import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/hooks/useTranslation';
import { getPlans, getApiErrorMessage, previewPromo } from '../api/formsApi';
import {
  readSavedContact,
  writeSavedContact,
  writeCheckoutSession,
} from '../api/checkoutSession';
// ⚠️ adjust these two paths to wherever your content files actually live
import termsContent from '../content/TermsContent';
import { privacyContent } from '../content/PoliciesContent';

// index (i) in ServicesPage's tier table is language-independent:
// 0 = Starter, 1 = Growth. Enterprise (2) never reaches this page.
const TIER_KEYS_BY_INDEX = ['Starter', 'Growth'];

const PLAN_FEATURES = {
  Starter: {
    en: [
      'Up to 5 users',
      '1 company',
      'Applicant history',
      'Email confirmation',
      'Email support',
    ],
    ar: [
      'حتى 5 مستخدمين',
      'شركة واحدة',
      'سجل المتقدمين',
      'تأكيد بالإيميل',
      'دعم بالإيميل',
    ],
  },
  Growth: {
    en: [
      'Up to 20 users',
      'Up to 3 companies',
      'Interview scoring',
      'Email tracking',
      'Priority support',
    ],
    ar: [
      'حتى 20 مستخدم',
      'حتى 3 شركات',
      'تقييم المقابلات',
      'تتبع الإيميلات',
      'دعم ذو أولوية',
    ],
  },
};

const EMAIL_RE = /^\S+@\S+\.\S+$/;

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

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const { isArabic } = useTranslation();
  const navigate = useNavigate();
  const lang = isArabic ? 'ar' : 'en';

  const product = searchParams.get('product') || 'ats';
  const tierIndex = Number(searchParams.get('tierIndex') ?? 1);
  const tierKey = TIER_KEYS_BY_INDEX[tierIndex] || 'Growth';

  const [plan, setPlan] = useState(null);
  const [planStatus, setPlanStatus] = useState('loading'); // loading | ready | not_found | error

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

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoChecking, setPromoChecking] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(null);

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [legalModal, setLegalModal] = useState(null); // null | 'terms' | 'privacy'
  const [canAgreeInModal, setCanAgreeInModal] = useState(false);

  useEffect(() => {
    writeSavedContact(form);
  }, [form]);

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

  const features = PLAN_FEATURES[tierKey]?.[lang] || [];
  // Price already includes VAT — no separate VAT line/calc.
  const standardEgp = plan ? plan.priceCents / 100 : 0;
  const discountedEgp = promoDiscount
    ? promoDiscount.discountedAmountCents / 100
    : null;
  const savingsEgp = discountedEgp !== null ? standardEgp - discountedEgp : 0;
  const total = discountedEgp ?? standardEgp;

  const t = {
    breadcrumb: isArabic ? 'الخدمات' : 'Services',
    checkout: isArabic ? 'إتمام الطلب' : 'Checkout',
    monthly: isArabic ? 'شهريًا' : 'per month',
    stepPlan: isArabic ? 'الباقة' : 'Plan',
    stepContact: isArabic ? 'بياناتك' : 'Your details',
    stepPay: isArabic ? 'الدفع الآمن' : 'Secure payment',
    contactTitle: isArabic ? 'بيانات التواصل' : 'Contact details',
    fullName: isArabic ? 'الاسم الكامل' : 'Full name',
    companyName: isArabic ? 'اسم الشركة' : 'Company',
    workEmail: isArabic ? 'الإيميل' : 'Work email',
    phone: isArabic ? 'تليفون / واتساب' : 'Phone / WhatsApp',
    redirectNote: isArabic
      ? 'بيانات بطاقتك بتتم معالجتها بأمان عبر Paymob. إحنا مش بنشوف أو بنخزن بيانات بطاقتك.'
      : 'Your card details are processed securely by Paymob. We never see or store your card information.',
    continueBtn: isArabic
      ? 'المتابعة للدفع الآمن'
      : 'Continue to secure payment',
    orderTitle: isArabic ? 'ملخص الطلب' : 'Order summary',
    setupFee: isArabic ? 'رسوم الإعداد' : 'Setup fee',
    free: isArabic ? 'مجانًا' : 'Free',
    vatIncludedNote: isArabic
      ? 'السعر شامل ضريبة القيمة المضافة'
      : 'Price includes VAT',
    totalDue: isArabic ? 'الإجمالي اليوم' : 'Total due today',
    termsNote: isArabic
      ? 'الاشتراك يتجدد شهريًا ويمكن إلغاؤه في أي وقت.'
      : 'Subscription renews monthly. Cancel any time.',
    productLabel: product.toUpperCase(),
    promoDiscount: isArabic ? 'خصم الكود' : 'Promo discount',
    loadingPlan: isArabic ? 'جاري تحميل الباقة…' : 'Loading plan…',
    planUnavailableTitle: isArabic ? 'الباقة غير متاحة' : 'Plan unavailable',
    planUnavailableMsg: isArabic
      ? 'الباقة المختارة غير متاحة حاليًا. من فضلك ارجع لصفحة الخدمات واختار باقة تانية.'
      : "This plan isn't available right now. Please go back to Services and pick another plan.",
    backToServices: isArabic ? 'الرجوع للخدمات' : 'Back to Services',
    legalCheckboxPrefix: isArabic ? 'أوافق على' : 'I agree to the',
    and: isArabic ? 'و' : 'and',
    termsLink: isArabic ? 'الشروط والأحكام' : 'Terms & Conditions',
    privacyLink: isArabic ? 'سياسة الخصوصية' : 'Privacy Policy',
    termsRequired: isArabic
      ? 'يجب الموافقة على الشروط والأحكام وسياسة الخصوصية للمتابعة'
      : 'You must agree to the Terms & Conditions and Privacy Policy to continue',
    modalAgreeBtn: isArabic ? 'قرأت وأوافق' : "I've read and agree",
    modalScrollHint: isArabic
      ? 'الرجاء التمرير للأسفل لقراءة المستند بالكامل'
      : 'Please scroll to the bottom to read the full document',
    modalClose: isArabic ? 'إغلاق' : 'Close',
    termsModalTitle: isArabic ? 'الشروط والأحكام' : 'Terms & Conditions',
    privacyModalTitle: isArabic ? 'سياسة الخصوصية' : 'Privacy Policy',
    promoLabel: isArabic ? 'كود الخصم' : 'Promo code',
    promoPlaceholder: isArabic ? 'مثال: WELCOME10' : 'e.g. WELCOME10',
    promoApply: isArabic ? 'تطبيق' : 'Apply',
    promoRemove: isArabic ? 'إزالة' : 'Remove',
    promoAppliedNote: isArabic ? 'تم التطبيق' : 'applied',
    promoEmpty: isArabic ? 'اكتب كود الخصم الأول' : 'Enter a promo code first',
    promoHint: isArabic
      ? 'الخصم بيتطبق عند تأكيد الدفع.'
      : 'Discount is applied when you confirm payment.',
    fillDetailsFirst: isArabic
      ? 'أكمل بياناتك الأربعة أعلاه للمتابعة للدفع.'
      : 'Fill in your details above to continue to payment.',
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
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleApplyPromo = async () => {
    const code = promoInput.trim();
    if (!code) {
      setPromoError(t.promoEmpty);
      return;
    }
    if (!plan) return;

    setPromoChecking(true);
    setPromoError('');
    try {
      const result = await previewPromo(code, plan._id);
      if (!result.valid) {
        setPromoError(result.error || t.promoEmpty);
        return;
      }
      setPromoDiscount({
        discountedAmountCents: result.discountedAmountCents,
        currency: result.currency,
      });
      setAppliedPromo(code);
      setPromoInput('');
    } catch (err) {
      setPromoError(getApiErrorMessage(err) || t.promoEmpty);
    } finally {
      setPromoChecking(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo('');
    setPromoDiscount(null);
    setPromoError('');
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

  // Validates contact + terms, then hands off the exact confirmed plan,
  // promo, and total to /checkout/payment. The Payment page never
  // re-derives the amount — it only creates the Paymob intention from
  // what was agreed to here.
  const handleContinue = useCallback(() => {
    const fieldErrors = {};
    if (!form.name.trim()) fieldErrors.name = isArabic ? 'مطلوب' : 'Required';
    if (!form.company.trim())
      fieldErrors.company = isArabic ? 'مطلوب' : 'Required';
    if (!EMAIL_RE.test(form.email.trim()))
      fieldErrors.email =
        t.invalidEmail || (isArabic ? 'إيميل غير صحيح' : 'Invalid email');
    if (!form.phone.trim()) fieldErrors.phone = isArabic ? 'مطلوب' : 'Required';
    if (!agreedToTerms) fieldErrors.terms = t.termsRequired;

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    const session = {
      product,
      tierKey,
      tierIndex,
      plan,
      form,
      appliedPromo,
      promoDiscount,
      total,
      currency: plan?.currency || 'EGP',
    };
    writeCheckoutSession(session);
    navigate('/checkout/payment', { state: session });
  }, [
    form,
    agreedToTerms,
    product,
    tierKey,
    tierIndex,
    plan,
    appliedPromo,
    promoDiscount,
    total,
    navigate,
    isArabic,
    t.termsRequired,
    t.invalidEmail,
  ]);

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
                {tierKey}
              </div>
              <div className="text-xs text-light-400 dark:text-light-500 mt-0.5">
                {t.monthly}
              </div>
            </div>
          </div>
          <div className={isArabic ? 'text-start' : 'text-end'}>
            <div className="text-xl font-bold text-light-900 dark:text-white">
              {discountedEgp !== null ? (
                <>
                  <span className="text-xs font-normal line-through text-light-400 me-1.5">
                    {standardEgp.toLocaleString()}
                  </span>
                  {discountedEgp.toLocaleString()}{' '}
                </>
              ) : (
                <>{standardEgp.toLocaleString()} </>
              )}
              <span className="text-xs font-normal text-light-400">
                {plan?.currency || 'EGP'}
              </span>
            </div>
            <div className="text-[10px] text-light-400 dark:text-light-500 mt-0.5">
              {t.vatIncludedNote}
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center mb-8">
          {[
            { label: t.stepPlan, state: 'done' },
            { label: t.stepContact, state: contactDone ? 'done' : 'active' },
            { label: t.stepPay, state: 'idle' },
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
          {/* Order summary */}
          <div className="bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-6 mb-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-light-400 dark:text-light-500 mb-4">
              {t.orderTitle}
            </p>

            {/* Promo code */}
            <div className="mb-5">
              {appliedPromo ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-primary-500/40 bg-primary-500/10 px-4 py-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <svg
                      className="size-4 shrink-0 text-primary-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a2 2 0 0 0 0 4v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1a2 2 0 0 0 0-4V9z" />
                      <path d="M13 5v2m0 10v2M9 7l6 10" />
                    </svg>
                    <span className="text-sm font-bold text-primary-500 truncate">
                      {appliedPromo}
                    </span>
                    <span className="text-xs text-light-500 dark:text-light-400 shrink-0">
                      {t.promoAppliedNote}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="text-xs font-semibold text-light-400 hover:text-danger-500 transition-colors shrink-0"
                  >
                    {t.promoRemove}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    name="promoCode"
                    type="text"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value);
                      if (promoError) setPromoError('');
                    }}
                    placeholder={t.promoPlaceholder}
                    className={inputCls('promoCode')}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoChecking}
                    className="shrink-0 rounded-xl bg-light-900 dark:bg-white px-5 py-3 text-sm font-semibold text-white dark:text-dark-900 transition hover:bg-primary-500 dark:hover:bg-primary-500 dark:hover:text-white disabled:opacity-60"
                  >
                    {promoChecking ? '...' : t.promoApply}
                  </button>
                </div>
              )}
              {promoError && (
                <p className="mt-1.5 text-xs text-danger-500 flex items-center gap-1.5">
                  {promoError}
                </p>
              )}
              {!promoError && !appliedPromo && (
                <p className="mt-1.5 text-[10px] text-light-400 dark:text-light-500">
                  {t.promoHint}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm border-b border-light-100 dark:border-dark-700 pb-3">
                <span className="text-light-500 dark:text-light-400">
                  {t.productLabel} — {tierKey}
                </span>
                <span className="font-semibold text-light-900 dark:text-white">
                  {standardEgp.toLocaleString()} {plan?.currency || 'EGP'}
                </span>
              </div>

              {discountedEgp !== null && (
                <div className="flex justify-between text-sm border-b border-light-100 dark:border-dark-700 pb-3">
                  <span className="text-light-500 dark:text-light-400 flex items-center gap-1.5">
                    {t.promoDiscount}
                    <span className="text-[10px] font-bold text-primary-500 bg-primary-500/10 px-1.5 py-0.5 rounded">
                      {appliedPromo}
                    </span>
                  </span>
                  <span className="font-semibold text-primary-500">
                    −{savingsEgp.toLocaleString()} {plan?.currency || 'EGP'}
                  </span>
                </div>
              )}

              {[{ label: t.setupFee, value: t.free, green: true }].map(
                ({ label, value, green }) => (
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
                )
              )}

              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-light-900 dark:text-white">
                  {t.totalDue}
                </span>
                <div className={isArabic ? 'text-start' : 'text-end'}>
                  <span className="text-lg font-bold text-primary-500">
                    {total.toLocaleString()} {plan?.currency || 'EGP'}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-light-400 dark:text-light-500">
                {t.vatIncludedNote}
              </p>
            </div>

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

            <div className="flex items-center gap-2 mt-5 text-xs text-light-400 dark:text-light-500">
              <LockIcon />
              <span>{t.redirectNote}</span>
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

          {/* Continue -> /checkout/payment */}
          <button
            type="button"
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-primary-600"
          >
            {t.continueBtn}
          </button>
          {!contactDone && (
            <p className="text-xs text-light-400 dark:text-light-500 text-center mt-2">
              {t.fillDetailsFirst}
            </p>
          )}

          <p className="text-[11px] text-light-400 dark:text-light-500 text-center mt-4 leading-relaxed px-4">
            {t.termsNote}
          </p>
        </form>
      </div>

      {/* Terms / Privacy modal */}
      {legalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setLegalModal(null)}
        >
          <div
            dir={isArabic ? 'rtl' : 'ltr'}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-dark-800 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-xl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-light-100 dark:border-dark-700">
              <h2 className="font-bold text-light-900 dark:text-white">
                {legalModal === 'terms'
                  ? t.termsModalTitle
                  : t.privacyModalTitle}
              </h2>
              <button
                onClick={() => setLegalModal(null)}
                className="text-light-400 hover:text-light-600 dark:hover:text-light-200 text-lg leading-none"
                aria-label={t.modalClose}
              >
                ✕
              </button>
            </div>

            <div
              onScroll={handleModalScroll}
              className="overflow-y-auto px-6 py-4 space-y-4 text-sm text-light-600 dark:text-light-300 leading-relaxed"
            >
              <p>{legalContent[lang].intro}</p>
              {legalContent[lang].sections.map((s) => (
                <div key={s.title}>
                  <h3 className="font-semibold text-light-900 dark:text-white mb-1">
                    {s.title}
                  </h3>
                  <p>{s.content}</p>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-light-100 dark:border-dark-700 flex items-center justify-between gap-3 flex-wrap">
              {!canAgreeInModal && (
                <span className="text-[11px] text-light-400 dark:text-light-500">
                  {t.modalScrollHint}
                </span>
              )}
              <div className="flex gap-2 ms-auto">
                <button
                  type="button"
                  onClick={() => setLegalModal(null)}
                  className="px-4 py-2 text-sm rounded-lg border border-light-200 dark:border-dark-600 text-light-600 dark:text-light-300 hover:bg-light-50 dark:hover:bg-dark-700 transition-colors"
                >
                  {t.modalClose}
                </button>
                <button
                  type="button"
                  disabled={!canAgreeInModal}
                  onClick={confirmAgreement}
                  className="px-4 py-2 text-sm rounded-lg bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t.modalAgreeBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CheckoutPage;
