import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/hooks/useTranslation';

// Paymob appends these as query params on redirection_url after a card/
// wallet transaction completes. IMPORTANT: these are shown for immediate
// UX feedback only — they are NOT verified here (no HMAC check on the
// client). The real activation happens asynchronously via the webhook,
// which creates the User + Company and emails a temporary password
// directly — there's no manual follow-up step, so copy should say
// "check your email" rather than "we'll reach out".
const CheckoutComplete = () => {
  const [searchParams] = useSearchParams();
  const { t, isArabic } = useTranslation();
  const navigate = useNavigate();

  const success = searchParams.get('success');
  const pending = searchParams.get('pending');
  const errorOccured = searchParams.get('error_occured');
  const hasParams = searchParams.has('success');

  let status = 'unknown';
  if (hasParams) {
    if (pending === 'true') status = 'pending';
    else if (success === 'true' && errorOccured !== 'true') status = 'success';
    else status = 'failed';
  }

  const copyByStatus = {
    success: {
      title:
        t('checkout:successTitle') ||
        (isArabic ? 'تم استلام الدفع! ✓' : 'Payment received! ✓'),
      body:
        t('checkout:successBody') ||
        (isArabic
          ? 'حسابك بيتجهز أوتوماتيكيًا دلوقتي. هتوصلك إيميل خلال دقايق فيه كلمة سر مؤقتة تسجل بيها دخولك.'
          : "Your account is being created automatically. You'll get an email within a few minutes with a temporary password to log in."),
      cta:
        t('checkout:backToSite') ||
        (isArabic ? 'الرجوع للموقع' : 'Back to site'),
    },
    pending: {
      title:
        t('checkout:pendingTitle') ||
        (isArabic ? 'جاري معالجة الدفع…' : 'Payment processing…'),
      body:
        t('checkout:pendingBody') ||
        (isArabic
          ? 'دفعتك لسه بتتأكد. بمجرد ما تخلص هننشئ حسابك ونبعتلك كلمة السر المؤقتة على إيميلك.'
          : "Your payment is still being confirmed. Once it clears, we'll create your account and email you a temporary password."),
      cta:
        t('checkout:backToSite') ||
        (isArabic ? 'الرجوع للموقع' : 'Back to site'),
    },
    failed: {
      title:
        t('checkout:failedTitle') ||
        (isArabic ? 'الدفع لم يكتمل' : "Payment didn't go through"),
      body:
        t('checkout:failedBody') ||
        (isArabic
          ? 'ممكن تكون البطاقة اترفضت أو حصل خطأ. حاول تاني أو تواصل معانا لو المشكلة استمرت.'
          : 'The card may have been declined, or something went wrong. Please try again, or reach out if this keeps happening.'),
      cta: t('checkout:tryAgain') || (isArabic ? 'المحاولة تاني' : 'Try again'),
    },
    unknown: {
      title:
        t('checkout:unknownTitle') ||
        (isArabic ? 'صفحة إتمام الطلب' : 'Checkout complete'),
      body:
        t('checkout:unknownBody') ||
        (isArabic
          ? 'مفيش تفاصيل دفع هنا. لو لسه بتحاول تشترك، ارجع لصفحة الخدمات.'
          : "There's no payment info here. If you're still trying to subscribe, head back to Services."),
      cta:
        t('checkout:backToServices') ||
        (isArabic ? 'الرجوع للخدمات' : 'Back to Services'),
    },
  };

  const copy = copyByStatus[status];

  const handleCta = () => {
    if (status === 'failed') {
      navigate(-1) || navigate('/services');
    } else if (status === 'unknown') {
      navigate('/services');
    } else {
      navigate('/');
    }
  };

  const icons = {
    success: (
      <svg
        className="w-14 h-14 text-primary-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <path
          d="M8 12.5l2.5 2.5L16 9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    pending: (
      <svg
        className="w-14 h-14 text-light-400 dark:text-light-500 animate-spin"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 3a9 9 0 1 0 9 9" strokeLinecap="round" />
      </svg>
    ),
    failed: (
      <svg
        className="w-14 h-14 text-danger-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9 9l6 6M15 9l-6 6" strokeLinecap="round" />
      </svg>
    ),
    unknown: (
      <svg
        className="w-14 h-14 text-light-400 dark:text-light-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
      </svg>
    ),
  };

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen bg-linear-to-br from-light-50 via-white to-light-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-20 px-4 md:px-6 flex items-center justify-center"
    >
      <div className="max-w-md w-full text-center bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-10">
        <div className="flex justify-center mb-6">{icons[status]}</div>
        <h1 className="text-2xl font-bold text-light-900 dark:text-white mb-3">
          {copy.title}
        </h1>
        <p className="text-light-600 dark:text-light-400 leading-relaxed mb-8">
          {copy.body}
        </p>
        <button
          onClick={handleCta}
          className="px-8 py-3.5 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
        >
          {copy.cta}
        </button>
      </div>
    </section>
  );
};

export default CheckoutComplete;
