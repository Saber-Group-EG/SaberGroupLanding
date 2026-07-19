import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/hooks/useTranslation';
import Swal from 'sweetalert2';
import { getPlans, startCheckout, getApiErrorMessage } from '../api/formsApi';
// ⚠️ adjust these two paths to wherever your content files actually live
import termsContent from '../content/TermsContent';
import { privacyContent } from '../content/PoliciesContent';

// index (i) in ServicesPage's tier table is language-independent:
// 0 = Starter, 1 = Growth. Enterprise (2) never reaches this page.
const TIER_KEYS_BY_INDEX = ['Starter', 'Growth'];

// Map "<product>:<TierKey>" -> the exact `name` field on your Plan
// documents in Mongo. Edit these once you know the real names —
// this is deliberately explicit rather than fuzzy-matched, since a
// wrong match here means charging the wrong amount.
const PLAN_NAME_MAP = {
  'ats:Starter': 'ATS Starter',
  'ats:Growth': 'ATS Growth',
  'crm:Starter': 'CRM Starter',
  'crm:Growth': 'CRM Growth',
};

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

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const { isArabic } = useTranslation();
  const navigate = useNavigate();
  const lang = isArabic ? 'ar' : 'en';

  const product = searchParams.get('product') || 'ats';
  const tierIndex = Number(searchParams.get('tierIndex') ?? 1);
  const tierKey = TIER_KEYS_BY_INDEX[tierIndex] || 'Growth';
  const planLookupKey = `${product}:${tierKey}`;
  const planName = PLAN_NAME_MAP[planLookupKey];

  const [plan, setPlan] = useState(null);
  const [planStatus, setPlanStatus] = useState('loading'); // loading | ready | not_found | error

  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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

  const features = PLAN_FEATURES[tierKey]?.[lang] || [];
  // Price already includes VAT — no separate VAT line/calc.
  const egp = plan ? plan.priceCents / 100 : 0;
  const total = egp;

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
      ? 'هيتم تحويلك لصفحة الدفع الآمنة من Paymob لإدخال بيانات البطاقة. إحنا مش بنشوف أو بنخزن بيانات بطاقتك.'
      : "You'll be redirected to Paymob's secure page to enter your card details. We never see or store your card information.",
    orderTitle: isArabic ? 'ملخص الطلب' : 'Order summary',
    setupFee: isArabic ? 'رسوم الإعداد' : 'Setup fee',
    free: isArabic ? 'مجانًا' : 'Free',
    vatIncludedNote: isArabic
      ? 'السعر شامل ضريبة القيمة المضافة'
      : 'Price includes VAT',
    totalDue: isArabic ? 'الإجمالي اليوم' : 'Total due today',
    continueBtn: isArabic
      ? 'المتابعة للدفع الآمن'
      : 'Continue to secure payment',
    processing: isArabic ? 'جاري التحويل…' : 'Redirecting…',
    termsNote: isArabic
      ? 'الاشتراك يتجدد شهريًا ويمكن إلغاؤه في أي وقت.'
      : 'Subscription renews monthly. Cancel any time.',
    fieldRequired: isArabic ? 'هذا الحقل مطلوب' : 'Required',
    invalidEmail: isArabic ? 'إيميل غير صحيح' : 'Invalid email',
    productLabel: product.toUpperCase(),
    loadingPlan: isArabic ? 'جاري تحميل الباقة…' : 'Loading plan…',
    planUnavailableTitle: isArabic ? 'الباقة غير متاحة' : 'Plan unavailable',
    planUnavailableMsg: isArabic
      ? 'الباقة المختارة غير متاحة حاليًا. من فضلك ارجع لصفحة الخدمات واختار باقة تانية.'
      : "This plan isn't available right now. Please go back to Services and pick another plan.",
    backToServices: isArabic ? 'الرجوع للخدمات' : 'Back to Services',
    genericErrorTitle: isArabic ? 'حصل خطأ' : 'Something went wrong',
    // Legal agreement
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

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = t.fieldRequired;
    if (!form.company.trim()) e.company = t.fieldRequired;
    if (!form.email.trim()) e.email = t.fieldRequired;
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = t.invalidEmail;
    if (!form.phone.trim()) e.phone = t.fieldRequired;
    if (!agreedToTerms) e.terms = t.termsRequired;
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (planStatus !== 'ready' || !plan) return;

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const { checkoutUrl } = await startCheckout({
        fullName: form.name,
        companyName: form.company,
        workEmail: form.email,
        phone: form.phone,
        planId: plan._id,
      });

      if (!checkoutUrl) {
        throw new Error('No checkout URL returned');
      }

      // Full page redirect — this is an external Paymob domain, not
      // an in-app route, so react-router's navigate() is wrong here.
      window.location.href = checkoutUrl;
    } catch (err) {
      setSubmitting(false);
      await Swal.fire({
        icon: 'error',
        title: t.genericErrorTitle,
        text: getApiErrorMessage(err, t.genericErrorTitle),
        confirmButtonText: isArabic ? 'تمام' : 'OK',
        confirmButtonColor: '#ef4444',
      });
    }
  };

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
              {egp.toLocaleString()}{' '}
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
            { label: t.stepContact, state: 'active' },
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

        <form onSubmit={handleSubmit} noValidate>
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

          {/* Order summary */}
          <div className="bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-6 mb-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-light-400 dark:text-light-500 mb-4">
              {t.orderTitle}
            </p>

            <div className="space-y-3">
              {[
                {
                  label: `${t.productLabel} — ${tierKey}`,
                  value: `${egp.toLocaleString()} ${plan?.currency || 'EGP'}`,
                },
                { label: t.setupFee, value: t.free, green: true },
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
                  {total.toLocaleString()} {plan?.currency || 'EGP'}
                </span>
              </div>
              <p className="text-[10px] text-light-400 dark:text-light-500">
                {t.vatIncludedNote}
              </p>
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

          {/* Legal agreement */}
          <div className="bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-5 mb-6">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
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

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-xl font-bold text-[15px] hover:bg-primary-600 transition-colors disabled:opacity-70"
          >
            <ShieldIcon />
            {submitting ? t.processing : t.continueBtn}
          </button>

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
