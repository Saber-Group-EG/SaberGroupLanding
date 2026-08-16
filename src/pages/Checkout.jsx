import { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/hooks/useTranslation';
import { getPlans, startCheckout } from '../api/formsApi';
import { parsePaymobCheckoutUrl } from '../api/paymobApi';
import PaymobCardForm from '../components/PaymobCardForm';
// ⚠️ adjust these two paths to wherever your content files actually live
import termsContent from '../content/TermsContent';
import { privacyContent } from '../content/PoliciesContent';

// index (i) in ServicesPage's tier table is language-independent:
// 0 = Starter, 1 = Growth. Enterprise (2) never reaches this page.
const TIER_KEYS_BY_INDEX = ['Starter', 'Growth'];

const PLAN_FEATURES = {
  Starter: [
    'Up to 5 users',
    '1 company',
    'Applicant history',
    'Email confirmation',
    'Email support',
  ],
  Growth: [
    'Up to 20 users',
    'Up to 3 companies',
    'Interview scoring',
    'Email tracking',
    'Priority support',
  ],
  المبدئية: [
    'حتى 5 مستخدمين',
    'شركة واحدة',
    'سجل المتقدمين',
    'تأكيد بالإيميل',
    'دعم بالإيميل',
  ],
  النمو: [
    'حتى 20 مستخدم',
    'حتى 3 شركات',
    'تقييم المقابلات',
    'تتبع الإيميلات',
    'دعم ذو أولوية',
  ],
};

// The backend returns a { checkoutUrl } (unified checkout URL) carrying
// publicKey + clientSecret. We parse those out and render our own styled
// card form (PaymobCardForm) instead of Paymob's hosted page.
const createIntention = async (payload) => {
  const res = await startCheckout(payload);
  const parsed =
    typeof res.checkoutUrl === 'string'
      ? parsePaymobCheckoutUrl(res.checkoutUrl)
      : null;
  if (parsed) return parsed;
  throw new Error('No payment session returned');
};

const EMAIL_RE = /^\S+@\S+\.\S+$/;

const CONTACT_CACHE_KEY = 'checkout_contact';

const readSavedContact = () => {
  try {
    const raw = sessionStorage.getItem(CONTACT_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// One cached intention per plan + payload hash, so the pre-create never
// spams Paymob with duplicate orders — every reload (and React StrictMode
// double-fire) used to create a brand-new order, which got us 400s.
const INTENTION_CACHE_PREFIX = 'paymob_intention_';
const INTENTION_CACHE_TTL = 30 * 60 * 1000; // 30 min

const readIntentionCache = (planId) => {
  try {
    const raw = sessionStorage.getItem(INTENTION_CACHE_PREFIX + planId);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeIntentionCache = (planId, entry) => {
  try {
    sessionStorage.setItem(
      INTENTION_CACHE_PREFIX + planId,
      JSON.stringify(entry)
    );
  } catch {
    // storage unavailable — the session will just be re-created
  }
};

const clearIntentionCache = (planId) => {
  try {
    sessionStorage.removeItem(INTENTION_CACHE_PREFIX + planId);
  } catch {
    // noop
  }
};

let intentionInFlight = null; // { hash, promise } — dedupe concurrent creates

const getIntention = async (payload) => {
  const hash = JSON.stringify(payload);
  if (intentionInFlight && intentionInFlight.hash === hash) {
    return intentionInFlight.promise;
  }
  const cached = readIntentionCache(payload.planId);
  if (
    cached &&
    cached.payloadHash === hash &&
    Date.now() - cached.createdAt < INTENTION_CACHE_TTL
  ) {
    return cached;
  }
  const promise = createIntention(payload).then((r) => {
    const entry = { ...r, payloadHash: hash, createdAt: Date.now() };
    writeIntentionCache(payload.planId, entry);
    return entry;
  });
  intentionInFlight = { hash, promise };
  try {
    return await promise;
  } finally {
    if (intentionInFlight?.hash === hash) intentionInFlight = null;
  }
};

const LockIcon = () => (
  <svg
    className="w-3.5 h-3.5 opacity-50 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const { isArabic } = useTranslation();
  const navigate = useNavigate();

  const product = searchParams.get('product') || 'ats';
  const tierIndex = Number(searchParams.get('tierIndex') ?? 1);
  const tierKey = TIER_KEYS_BY_INDEX[tierIndex] || 'Growth';

  const pricing = PLAN_PRICES[tierKey] || { egp: 0, vat: 0, total: 0 };
  const features = PLAN_FEATURES[tierKey]?.[lang] || [];

  const [form, setForm] = useState(
    () =>
      readSavedContact() || {
        name: '',
        company: '',
        email: '',
        phone: '',
      }
  );
  const [errors, setErrors] = useState({});
  const [session, setSession] = useState(null); // { publicKey, clientSecret, checkoutUrl } | null
  const [failed, setFailed] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(CONTACT_CACHE_KEY, JSON.stringify(form));
    } catch {
      // storage unavailable — the form just won't be restored on reload
    }
  }, [form]);

  // ── Terms/Privacy agreement ────────────────────────────────────────────
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [legalModal, setLegalModal] = useState(null); // null | 'terms' | 'privacy'
  const [canAgreeInModal, setCanAgreeInModal] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadPlan = async () => {
      if (!tierKey) {
        setPlanStatus('not_found');
        return;
      }
      setPlanStatus('loading');
      try {
        const plans = await getPlans();
        if (cancelled) return;
        const list = Array.isArray(plans) ? plans : plans?.data || [];
        const match = list.find(
          (p) =>
            p.name.toLowerCase() === tierKey.toLowerCase() &&
            p.isActive !== false
        );
        if (match) {
          setPlan(match);
          setPlanStatus('ready');
        } else {
          setPlanStatus('not_found');
        }
      } catch (err) {
        console.debug('Failed to load plans:', err);
        if (!cancelled) setPlanStatus('error');
      }
    };

    loadPlan();
    return () => {
      cancelled = true;
    };
  }, [tierKey]);

  // The payment session is only started once the user fills in the four
  // contact fields and confirms — no placeholder billing is ever sent.
  // `getIntention` dedupes concurrent requests and caches per payload, so
  // reloads or double-clicks never create a duplicate Paymob order.

  // Price already includes VAT — no separate VAT line/calc.
  const egp = plan ? plan.priceCents / 100 : 0;
  const total = egp;

  const t = {
    breadcrumb: isArabic ? 'الخدمات' : 'Services',
    checkout: isArabic ? 'إتمام الطلب' : 'Checkout',
    planLabel: isArabic ? 'الباقة المختارة' : 'Selected plan',
    monthly: isArabic ? 'شهريًا' : 'per month',
    stepPlan: isArabic ? 'الباقة' : 'Plan',
    stepPayment: isArabic ? 'الدفع' : 'Payment',
    stepConfirm: isArabic ? 'تأكيد' : 'Confirm',
    contactTitle: isArabic ? 'بيانات التواصل' : 'Contact details',
    fullName: isArabic ? 'الاسم الكامل' : 'Full name',
    companyName: isArabic ? 'اسم الشركة' : 'Company',
    workEmail: isArabic ? 'الإيميل' : 'Work email',
    phone: isArabic ? 'تليفون / واتساب' : 'Phone / WhatsApp',
    redirectNote: isArabic
      ? 'بيانات بطاقتك بتتم معالجتها بأمان عبر Paymob. إحنا مش بنشوف أو بنخزن بيانات بطاقتك.'
      : "Your card details are processed securely by Paymob. We never see or store your card information.",
    paymentPrompt: isArabic
      ? 'أدخل بيانات بطاقتك بأمان لإتمام الدفع.'
      : 'Enter your card details securely to complete payment.',
    confirmStart: isArabic
      ? 'تأكيد وبدء الدفع الآمن'
      : 'Confirm & start secure payment',
    fillDetailsFirst: isArabic
      ? 'أكمل بياناتك الأربعة أعلاه ليظهر نموذج الدفع.'
      : 'Fill in your details above to see the payment form.',
    pixelLoadError: isArabic
      ? 'تعذر تحميل نموذج الدفع. حاول مرة أخرى.'
      : 'Unable to load the payment form. Please try again.',
    retry: isArabic ? 'حاول مرة أخرى' : 'Try again',
    orderTitle: isArabic ? 'ملخص الطلب' : 'Order summary',
    setupFee: isArabic ? 'رسوم الإعداد' : 'Setup fee',
    free: isArabic ? 'مجانًا' : 'Free',
    vat: isArabic ? 'ضريبة القيمة المضافة (14%)' : 'VAT (14%)',
    totalDue: isArabic ? 'الإجمالي اليوم' : 'Total due today',
    payBtn: isArabic ? 'ادفع الآن' : 'Pay now',
    processing: isArabic ? 'جاري التجهيز…' : 'Preparing payment…',
    termsNote: isArabic
      ? 'بالمتابعة، أنت توافق على شروط الخدمة وسياسة الخصوصية. الاشتراك يتجدد شهريًا ويمكن إلغاؤه في أي وقت.'
      : 'By proceeding you agree to our Terms of Service and Privacy Policy. Subscription renews monthly. Cancel any time.',
    successTitle: isArabic ? 'تم الدفع بنجاح!' : 'Payment confirmed!',
    successMsg: isArabic
      ? 'شكرًا. هنتواصل معاك خلال يوم عمل لإعداد حسابك.'
      : "You're all set. We'll reach out within one business day to get your account ready.",
    fieldRequired: isArabic ? 'هذا الحقل مطلوب' : 'Required',
    invalidCard: isArabic ? 'رقم بطاقة غير صحيح' : 'Invalid card number',
    invalidExpiry: isArabic ? 'تاريخ انتهاء غير صحيح' : 'Invalid expiry',
    invalidCvv: isArabic ? 'CVV غير صحيح' : 'Invalid CVV',
    productLabel: product.toUpperCase(),
  };

  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-dark-800/80 border text-light-900 dark:text-white ` +
    `placeholder-light-400/50 dark:placeholder-light-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-shadow text-sm ` +
    (errors[field]
      ? 'border-danger-500 focus:border-danger-500'
      : 'border-light-200/50 dark:border-dark-700/50 focus:border-primary-500');

  const labelCls =
    'block text-xs font-semibold text-light-500 dark:text-light-400 uppercase tracking-wide mb-1.5';

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'cardNumber') {
      value = value
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(.{4})/g, '$1  ')
        .trim();
    }
    if (name === 'expiry') {
      value = value.replace(/\D/g, '').slice(0, 4);
      if (value.length > 2) value = value.slice(0, 2) + ' / ' + value.slice(2);
    }
    if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 4);
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const isContactValid = useCallback(
    () =>
      Boolean(
        form.name.trim() &&
          form.company.trim() &&
          EMAIL_RE.test(form.email.trim()) &&
          form.phone.trim()
      ),
    [form]
  );

  const contactDone = isContactValid();

  const handleRetry = useCallback(() => {
    if (plan) clearIntentionCache(plan._id);
    setFailed(false);
    setSession(null);
  }, [plan]);

  // Waits for the four contact fields, then starts the payment session
  // with the real billing data — no placeholder billing is ever sent.
  const handleStartPayment = useCallback(async () => {
    if (planStatus !== 'ready' || !plan || session || starting) return;
    if (!isContactValid()) return;
    setStarting(true);
    setFailed(false);
    try {
      const intent = await getIntention({
        fullName: form.name.trim(),
        companyName: form.company.trim(),
        workEmail: form.email.trim(),
        phone: form.phone.trim(),
        planId: plan._id,
      });
      setSession({
        publicKey: intent.publicKey,
        clientSecret: intent.clientSecret,
        checkoutUrl: intent.checkoutUrl,
      });
    } catch (err) {
      console.error('Failed to start payment session:', err);
      setFailed(true);
    } finally {
      setStarting(false);
    }
  }, [planStatus, plan, session, starting, form, isContactValid]);

  const handlePaySuccess = useCallback(() => {
    // Payment is captured, but activation is confirmed asynchronously by
    // the backend webhook (it emails the temporary password) — so show
    // the "waiting for confirmation" state instead of claiming success.
    navigate('/checkout/complete?pending=true');
  }, [navigate]);

  // Bank 3DS step. Open it in a new tab so the customer returns into the
  // app — the original tab switches to the confirmation-waiting page.
  // If the popup is blocked, fall back to navigating the current tab.
  const handlePayPending = useCallback(
    (redirectUrl) => {
      const win = window.open(redirectUrl, '_blank');
      if (win) {
        navigate('/checkout/complete?pending=true');
      } else {
        window.location.assign(redirectUrl);
      }
    },
    [navigate]
  );

  const handlePayCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const openLegalModal = (which) => {
    setCanAgreeInModal(false);
    setLegalModal(which);
  };

  const handleModalScroll = (e) => {
    const el = e.target;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
    if (atBottom) setCanAgreeInModal(true);
  };

  const confirmAgreement = () => {
    setAgreedToTerms(true);
    setLegalModal(null);
    if (errors.terms) setErrors((p) => ({ ...p, terms: '' }));
  };

  if (planStatus === 'loading') {
    return (
      <section
        dir={isArabic ? 'rtl' : 'ltr'}
        className="min-h-screen bg-linear-to-br from-light-50 via-white to-light-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-20 px-4 md:px-6 flex items-center justify-center"
      >
        <p className="text-light-500 dark:text-light-400 text-sm">
          {t.loadingPlan}
        </p>
      </section>
    );
  }

  if (planStatus === 'not_found' || planStatus === 'error') {
    return (
      <section
        dir={isArabic ? 'rtl' : 'ltr'}
        className="min-h-screen bg-linear-to-br from-light-50 via-white to-light-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-20 px-4 md:px-6 flex items-center justify-center"
      >
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold text-light-900 dark:text-white mb-3">
            {t.planUnavailableTitle}
          </h1>
          <p className="text-light-600 dark:text-light-400 mb-6">
            {t.planUnavailableMsg}
          </p>
          <button
            onClick={() => navigate('/services')}
            className="px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
          >
            {t.backToServices}
          </button>
        </div>
      </section>
    );
  }

  const legalContent = legalModal === 'terms' ? termsContent : privacyContent;

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen bg-linear-to-br from-light-50 via-white to-light-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-20 px-4 md:px-6"
    >
      <div className="max-w-2xl mx-auto mt-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-light-400 dark:text-light-500 mb-8">
          <button
            onClick={() => navigate('/services')}
            className="text-primary-500 hover:underline"
          >
            {t.breadcrumb}
          </button>
          <span>›</span>
          <span className="text-light-600 dark:text-light-300">
            {t.checkout}
          </span>
        </div>

        {/* Plan summary bar */}
        <div className="bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-5 mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-primary-500/10 text-primary-500 px-2.5 py-1 rounded-md">
              {t.productLabel}
            </span>
            <div>
              <div className="text-sm font-semibold text-light-900 dark:text-white">
                {tier}
              </div>
              <div className="text-xs text-light-400 dark:text-light-500 mt-0.5">
                {t.monthly}
              </div>
            </div>
          </div>
          <div className={isArabic ? 'text-start' : 'text-end'}>
            <div className="text-xl font-bold text-light-900 dark:text-white">
              {pricing.egp.toLocaleString()}{' '}
              <span className="text-xs font-normal text-light-400">EGP</span>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center mb-8">
          {[
            { label: t.stepPlan, state: 'done' },
            { label: t.stepContact, state: contactDone ? 'done' : 'active' },
            { label: t.stepPay, state: session ? 'active' : 'idle' },
          ].map((step, i, arr) => (
            <div
              key={step.label}
              className="flex items-center flex-1 last:flex-none"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                  ${step.state === 'done' ? 'bg-primary-500 text-white' : ''}
                  ${step.state === 'active' ? 'bg-light-900 dark:bg-white text-white dark:text-dark-900' : ''}
                  ${step.state === 'idle' ? 'bg-light-100 dark:bg-dark-700 text-light-400 dark:text-light-500 border border-light-200 dark:border-dark-600' : ''}
                `}
                >
                  {step.state === 'done' ? '✓' : i + 1}
                </div>
                <span
                  className={`text-xs font-semibold hidden sm:block
                  ${step.state === 'done' ? 'text-primary-500' : ''}
                  ${step.state === 'active' ? 'text-light-900 dark:text-white' : ''}
                  ${step.state === 'idle' ? 'text-light-400 dark:text-light-500' : ''}
                `}
                >
                  {step.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div
                  className={`flex-1 h-px mx-3 ${step.state === 'done' ? 'bg-primary-500' : 'bg-light-200 dark:bg-dark-700'}`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={(e) => e.preventDefault()} noValidate>
          {/* Contact details */}
          <div className="bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-6 mb-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-light-400 dark:text-light-500 mb-5">
              {t.contactTitle}
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  name: 'name',
                  label: t.fullName,
                  placeholder: isArabic ? 'أحمد حسن' : 'Ahmed Hassan',
                  type: 'text',
                },
                {
                  name: 'company',
                  label: t.companyName,
                  placeholder: isArabic ? 'اسم الشركة' : 'Acme Corp',
                  type: 'text',
                },
                {
                  name: 'email',
                  label: t.workEmail,
                  placeholder: 'ahmed@company.com',
                  type: 'email',
                },
                {
                  name: 'phone',
                  label: t.phone,
                  placeholder: isArabic ? '01000000000' : '+20 100 000 0000',
                  type: 'tel',
                },
              ].map(({ name, label, placeholder, type }) => (
                <div key={name}>
                  <label className={labelCls}>{label}</label>
                  <input
                    name={name}
                    type={type}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={inputCls(name)}
                    dir={
                      name === 'phone' || name === 'email' ? 'ltr' : undefined
                    }
                  />
                  {errors[name] && (
                    <p className="mt-1 text-xs text-danger-500">
                      {errors[name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-6 mb-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-light-400 dark:text-light-500 mb-5">
              {t.paymentTitle}
            </p>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>{t.cardHolder}</label>
                <input
                  name="cardName"
                  type="text"
                  value={form.cardName}
                  onChange={handleChange}
                  placeholder={isArabic ? 'الاسم على البطاقة' : 'Name on card'}
                  className={inputCls('cardName')}
                />
                {errors.cardName && (
                  <p className="mt-1 text-xs text-danger-500">
                    {errors.cardName}
                  </p>
                )}
              </div>

              <div>
                <label className={labelCls}>{t.cardNumber}</label>
                <div className="relative">
                  <input
                    name="cardNumber"
                    type="text"
                    value={form.cardNumber}
                    onChange={handleChange}
                    dir="ltr"
                    placeholder="1234  5678  9012  3456"
                    className={`${inputCls('cardNumber')} pr-20`}
                  />
                  <div className="absolute end-3 top-1/2 -translate-y-1/2 flex gap-1.5 items-center">
                    <span className="text-[9px] font-black bg-blue-800 text-white rounded px-1.5 py-0.5 tracking-tight">
                      VISA
                    </span>
                    <span className="text-[9px] font-black bg-red-600 text-white rounded px-1.5 py-0.5 tracking-tight">
                      MC
                    </span>
                  </div>
                </div>
                {errors.cardNumber && (
                  <p className="mt-1 text-xs text-danger-500">
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>{t.expiry}</label>
                  <input
                    name="expiry"
                    type="text"
                    value={form.expiry}
                    onChange={handleChange}
                    dir="ltr"
                    placeholder="MM / YY"
                    className={inputCls('expiry')}
                  />
                  {errors.expiry && (
                    <p className="mt-1 text-xs text-danger-500">
                      {errors.expiry}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelCls}>{t.cvv}</label>
                  <input
                    name="cvv"
                    type="text"
                    value={form.cvv}
                    onChange={handleChange}
                    dir="ltr"
                    placeholder="•••"
                    className={inputCls('cvv')}
                  />
                  {errors.cvv && (
                    <p className="mt-1 text-xs text-danger-500">{errors.cvv}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 text-xs text-light-400 dark:text-light-500">
              <LockIcon />
              <span>{t.secureNote}</span>
            </div>
          </div>

          {/* Legal agreement */}
          <div className="bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-5 mb-4">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                id="terms-checkbox"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (errors.terms) setErrors((p) => ({ ...p, terms: '' }));
                }}
                className="mt-0.5 w-4 h-4 accent-primary-500 shrink-0"
              />
              <span className="text-xs text-light-600 dark:text-light-400 leading-relaxed">
                {t.legalCheckboxPrefix}{' '}
                <button
                  type="button"
                  onClick={() => openLegalModal('terms')}
                  className="text-primary-500 font-semibold underline underline-offset-2"
                >
                  {t.termsLink}
                </button>{' '}
                {t.and}{' '}
                <button
                  type="button"
                  onClick={() => openLegalModal('privacy')}
                  className="text-primary-500 font-semibold underline underline-offset-2"
                >
                  {t.privacyLink}
                </button>
              </span>
            </label>
            {errors.terms && (
              <p className="mt-2 text-xs text-danger-500">{errors.terms}</p>
            )}
          </div>

          {/* Payment */}
          <div
            id="payment-section"
            className="overflow-hidden rounded-2xl border border-light-200/50 dark:border-dark-700/50 bg-white/80 dark:bg-dark-800/80 mb-4"
          >
            <div className="flex items-center gap-3 border-b border-light-100 dark:border-dark-700 px-6 py-5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500 shrink-0">
                <ShieldIcon />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-light-900 dark:text-white">
                  {t.stepPay}
                </h2>
                <p className="mt-0.5 text-sm text-light-500 dark:text-light-400">
                  {t.paymentPrompt}
                </p>
              </div>
            </div>

            <div className="p-6">
              {failed && (
                <div className="space-y-3">
                  <p className="flex items-center gap-2 rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-500">
                    <svg
                      className="size-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 9v4m0 4h.01" />
                      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
                    </svg>
                    {t.pixelLoadError}
                  </p>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="w-full rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
                  >
                    {t.retry}
                  </button>
                </div>
              )}

              {!failed && session && (
                <PaymobCardForm
                  key={session.clientSecret}
                  publicKey={session.publicKey}
                  clientSecret={session.clientSecret}
                  checkoutUrl={session.checkoutUrl}
                  payButtonLabel={t.payBtn}
                  onSuccess={handlePaySuccess}
                  onPending={handlePayPending}
                  onRetry={handleRetry}
                  onCancel={handlePayCancel}
                />
              )}

              {!failed && !session && planStatus === 'ready' && (
                <div>
                  {isContactValid() ? (
                    <button
                      type="button"
                      onClick={handleStartPayment}
                      disabled={starting}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-primary-600 disabled:opacity-70"
                    >
                      {starting && (
                        <svg
                          className="size-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                          />
                        </svg>
                      )}
                      {starting ? t.processing : t.confirmStart}
                    </button>
                  ) : (
                    <p className="text-sm text-light-400 dark:text-light-500">
                      {t.fillDetailsFirst}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 mt-5 text-xs text-light-400 dark:text-light-500">
                <LockIcon />
                <span>{t.redirectNote}</span>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-6 mb-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-light-400 dark:text-light-500 mb-4">
              {t.orderTitle}
            </p>

            <div className="space-y-3">
              {[
                {
                  label: `${t.productLabel} — ${tier}`,
                  value: `${pricing.egp.toLocaleString()} EGP`,
                },
                { label: t.setupFee, value: t.free, green: true },
                { label: t.vat, value: `${pricing.vat.toLocaleString()} EGP` },
              ].map(({ label, value, green }) => (
                <div
                  key={label}
                  className="flex justify-between text-sm border-b border-light-100 dark:border-dark-700 pb-3 last:border-none last:pb-0"
                >
                  <span className="text-light-500 dark:text-light-400">
                    {label}
                  </span>
                  <span
                    className={`font-semibold ${green ? 'text-primary-500' : 'text-light-900 dark:text-white'}`}
                  >
                    {value}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-light-900 dark:text-white">
                  {t.totalDue}
                </span>
                <span className="text-lg font-bold text-primary-500">
                  {pricing.total.toLocaleString()} EGP
                </span>
              </div>
            </div>

            {/* Feature chips */}
            <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-light-100 dark:border-dark-700">
              {features.map((f) => (
                <span
                  key={f}
                  className="text-[11px] text-light-600 dark:text-light-400 bg-light-50 dark:bg-dark-700 px-3 py-1 rounded-full before:content-['✓_'] before:text-primary-500 before:font-bold"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-light-400 dark:text-light-500 text-center mt-4 leading-relaxed px-4">
            {t.termsNote}
          </p>
        </form>
      </div>
    </section>
  );
};

export default CheckoutPage;
