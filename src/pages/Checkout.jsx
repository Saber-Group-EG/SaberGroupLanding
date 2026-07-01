import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/hooks/useTranslation';
import Swal from 'sweetalert2';

const PLAN_PRICES = {
  Starter: { egp: 3000, vat: 420, total: 3420 },
  Growth: { egp: 5000, vat: 700, total: 5700 },
  المبدئية: { egp: 3000, vat: 420, total: 3420 },
  النمو: { egp: 5000, vat: 700, total: 5700 },
};

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

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const { isArabic } = useTranslation();
  const navigate = useNavigate();

  const product = searchParams.get('product') || 'ats';
  const tier = searchParams.get('tier') || 'Growth';

  const pricing = PLAN_PRICES[tier] || { egp: 0, vat: 0, total: 0 };
  const features = PLAN_FEATURES[tier] || [];

  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [paid, setPaid] = useState(false);

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
    paymentTitle: isArabic ? 'بيانات الدفع' : 'Payment method',
    cardHolder: isArabic ? 'اسم حامل البطاقة' : 'Cardholder name',
    cardNumber: isArabic ? 'رقم البطاقة' : 'Card number',
    expiry: isArabic ? 'تاريخ الانتهاء' : 'Expiry',
    cvv: 'CVV',
    secureNote: isArabic
      ? 'المدفوعات تتم بأمان عبر Paymob. لا نحتفظ ببيانات بطاقتك.'
      : 'Payments processed securely via Paymob. We never store your card details.',
    orderTitle: isArabic ? 'ملخص الطلب' : 'Order summary',
    setupFee: isArabic ? 'رسوم الإعداد' : 'Setup fee',
    free: isArabic ? 'مجانًا' : 'Free',
    vat: isArabic ? 'ضريبة القيمة المضافة (14%)' : 'VAT (14%)',
    totalDue: isArabic ? 'الإجمالي اليوم' : 'Total due today',
    payBtn: isArabic
      ? `دفع ${pricing.total.toLocaleString()} جنيه`
      : `Pay ${pricing.total.toLocaleString()} EGP`,
    processing: isArabic ? 'جاري المعالجة…' : 'Processing…',
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

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = t.fieldRequired;
    if (!form.company.trim()) e.company = t.fieldRequired;
    if (!form.email.trim()) e.email = t.fieldRequired;
    if (!form.phone.trim()) e.phone = t.fieldRequired;
    if (!form.cardName.trim()) e.cardName = t.fieldRequired;
    const digits = form.cardNumber.replace(/\s/g, '');
    if (digits.length < 16) e.cardNumber = t.invalidCard;
    if (!/^\d{2}\s*\/\s*\d{2}$/.test(form.expiry)) e.expiry = t.invalidExpiry;
    if (form.cvv.length < 3) e.cvv = t.invalidCvv;
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    // Simulate payment gateway delay
    await new Promise((r) => setTimeout(r, 2000));
    setSubmitting(false);
    setPaid(true);
    await Swal.fire({
      icon: 'success',
      title: t.successTitle,
      text: t.successMsg,
      confirmButtonText: isArabic ? 'تمام' : 'OK',
      confirmButtonColor: '#10b981',
    });
    navigate('/');
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
            { label: t.stepPayment, state: 'active' },
            { label: t.stepConfirm, state: 'idle' },
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

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || paid}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-xl font-bold text-[15px] hover:bg-primary-600 transition-colors disabled:opacity-70"
          >
            <ShieldIcon />
            {submitting
              ? t.processing
              : paid
                ? isArabic
                  ? 'تم الدفع ✓'
                  : 'Paid ✓'
                : t.payBtn}
          </button>

          <p className="text-[11px] text-light-400 dark:text-light-500 text-center mt-4 leading-relaxed px-4">
            {t.termsNote}
          </p>
        </form>
      </div>
    </section>
  );
};

export default CheckoutPage;
