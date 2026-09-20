import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/hooks/useTranslation';
import { getApiErrorMessage } from '../api/formsApi';
import {
  readCheckoutSession,
  clearCheckoutSession,
  getIntention,
  clearIntentionCache,
} from '../api/checkoutSession';
import PaymobCardForm from '../components/PaymobCardForm';

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

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isArabic } = useTranslation();

  // Router state (fast path) falls back to sessionStorage (refresh/back-nav).
  // If neither exists, there's nothing safe to charge — bounce to Checkout.
  const [checkoutSession] = useState(
    () => location.state || readCheckoutSession()
  );

  const [session, setSession] = useState(null); // { publicKey, clientSecret, checkoutUrl } | null
  const [failed, setFailed] = useState(false);
  const [failedMessage, setFailedMessage] = useState('');
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!checkoutSession) {
      navigate('/checkout', { replace: true });
    }
  }, [checkoutSession, navigate]);

  const t = {
    breadcrumb: isArabic ? 'الخدمات' : 'Services',
    checkoutStep: isArabic ? 'بياناتك' : 'Your details',
    stepPay: isArabic ? 'الدفع الآمن' : 'Secure payment',
    paymentPrompt: isArabic
      ? 'أدخل بيانات بطاقتك بأمان لإتمام الدفع.'
      : 'Enter your card details securely to complete payment.',
    redirectNote: isArabic
      ? 'بيانات بطاقتك بتتم معالجتها بأمان عبر Paymob. إحنا مش بنشوف أو بنخزن بيانات بطاقتك.'
      : 'Your card details are processed securely by Paymob. We never see or store your card information.',
    pixelLoadError: isArabic
      ? 'تعذر تحميل نموذج الدفع. حاول مرة أخرى.'
      : 'Unable to load the payment form. Please try again.',
    retry: isArabic ? 'حاول مرة أخرى' : 'Try again',
    payBtn: isArabic ? 'ادفع الآن' : 'Pay now',
    preparing: isArabic ? 'جاري تجهيز الدفع…' : 'Preparing payment…',
    orderTitle: isArabic ? 'ملخص الطلب' : 'Order summary',
    totalDue: isArabic ? 'الإجمالي اليوم' : 'Total due today',
    edit: isArabic ? 'تعديل' : 'Edit',
  };

  // Creates the Paymob intention from the exact plan/promo confirmed on
  // Checkout — this is where the real, backend-computed charge amount
  // comes from; nothing here is re-derived on the client.
  const startPayment = useCallback(async () => {
    if (!checkoutSession || starting || session) return;
    setStarting(true);
    setFailed(false);
    setFailedMessage('');
    try {
      const { plan, form, appliedPromo } = checkoutSession;
      const intent = await getIntention({
        fullName: form.name.trim(),
        companyName: form.company.trim(),
        workEmail: form.email.trim(),
        phone: form.phone.trim(),
        planId: plan._id,
        promoCode: appliedPromo || undefined,
      });
      setSession({
        publicKey: intent.publicKey,
        clientSecret: intent.clientSecret,
        checkoutUrl: intent.checkoutUrl,
      });
    } catch (err) {
      console.error('Failed to start payment session:', err);
      setFailedMessage(getApiErrorMessage(err) || t.pixelLoadError);
      setFailed(true);
    } finally {
      setStarting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutSession, starting, session]);

  useEffect(() => {
    startPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutSession]);

  const handleRetry = useCallback(() => {
    if (checkoutSession?.plan) clearIntentionCache(checkoutSession.plan._id);
    setFailed(false);
    setFailedMessage('');
    setSession(null);
    startPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutSession]);

  const handlePaySuccess = useCallback(() => {
    // Activation is confirmed asynchronously by the backend webhook, so
    // show the "waiting for confirmation" state instead of claiming success.
    clearCheckoutSession();
    navigate('/checkout/complete?pending=true');
  }, [navigate]);

  // Bank 3DS step. Open it in a new tab so the customer returns into the
  // app — the original tab switches to the confirmation-waiting page.
  const handlePayPending = useCallback(
    (redirectUrl) => {
      clearCheckoutSession();
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

  if (!checkoutSession) return null; // redirecting in the effect above

  const { tierKey, product, total, currency } = checkoutSession;

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
          <button
            onClick={() => navigate(-1)}
            className="text-primary-500 hover:underline"
          >
            {t.checkoutStep}
          </button>
          <span>›</span>
          <span className="text-light-600 dark:text-light-300">
            {t.stepPay}
          </span>
        </div>

        {/* Order recap — read-only, editable via "Edit" back-link */}
        <div className="bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-5 mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-primary-500/10 text-primary-500 px-2.5 py-1 rounded-md">
              {product?.toUpperCase()}
            </span>
            <div className="text-sm font-semibold text-light-900 dark:text-white mt-2">
              {tierKey}
            </div>
          </div>
          <div className={isArabic ? 'text-start' : 'text-end'}>
            <div className="text-xs text-light-400 dark:text-light-500 mb-1">
              {t.totalDue}
            </div>
            <div className="text-xl font-bold text-primary-500">
              {Number(total).toLocaleString()} {currency}
            </div>
            <button
              onClick={() => navigate(-1)}
              className="text-[10px] text-light-400 hover:text-primary-500 underline underline-offset-2 mt-1"
            >
              {t.edit}
            </button>
          </div>
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
                  {failedMessage || t.pixelLoadError}
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

            {!failed && !session && starting && (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-light-500 dark:text-light-400">
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
                {t.preparing}
              </div>
            )}

            <div className="flex items-center gap-2 mt-5 text-xs text-light-400 dark:text-light-500">
              <LockIcon />
              <span>{t.redirectNote}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentPage;
