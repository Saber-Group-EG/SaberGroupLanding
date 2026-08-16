import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from '../i18n/hooks/useTranslation';
import {
  fetchPaymobCardMethod,
  paymobFeBaseUrl,
  PaymobApiError,
  isDarkMode,
  buildPaymobIframeCustomStyle,
} from '../api/paymobApi';

const IFRAME_PATH = 'iframe-card';

const SpinnerIcon = () => (
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
);

const ShieldIcon = () => (
  <svg
    className="size-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

function isTrue(v) {
  return v === true || v === 'true' || v === 'True';
}

function extractError(data, fallback) {
  if (Array.isArray(data) && data.length > 0) return String(data[0]);
  if (data && typeof data === 'object') {
    for (const key of ['msg', 'message', 'error', 'detail']) {
      const v = data[key];
      if (typeof v === 'string' && v) return v;
    }
  }
  return fallback;
}

export default function PaymobCardForm({
  publicKey,
  clientSecret,
  checkoutUrl,
  payButtonLabel,
  saveCard = false,
  onSuccess,
  onPending,
  onRetry,
  onCancel,
}) {
  const { isArabic } = useTranslation();
  const dir = isArabic ? 'rtl' : 'ltr';

  const [method, setMethod] = useState(null);
  const [loadingMethod, setLoadingMethod] = useState(true);
  const [methodError, setMethodError] = useState(false);

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(224);
  const [holderName, setHolderName] = useState('');
  const [holderError, setHolderError] = useState('');
  const [paying, setPaying] = useState(false);
  const [payDisabledByIframe, setPayDisabledByIframe] = useState(false);
  const [payError, setPayError] = useState('');

  const iframeRef = useRef(null);

  const feBase = useMemo(() => paymobFeBaseUrl(checkoutUrl), [checkoutUrl]);
  const iframeSrc = useMemo(
    () =>
      `${feBase}/${IFRAME_PATH}/?type=card&v=2&integration_type=directPayment`,
    [feBase]
  );

  const loadMethod = () => {
    setMethodError(false);
    setLoadingMethod(true);
    fetchPaymobCardMethod(publicKey, clientSecret, checkoutUrl)
      .then(setMethod)
      .catch((err) => {
        if (err instanceof PaymobApiError && err.redirect) {
          onPending(err.redirect);
          return;
        }
        setMethodError(true);
      })
      .finally(() => setLoadingMethod(false));
  };

  useEffect(() => {
    loadMethod();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, clientSecret]);

  const postToIframe = (message) => {
    iframeRef.current?.contentWindow?.postMessage(message, feBase);
  };

  useEffect(() => {
    if (!method) return;
    const handleMessage = (event) => {
      if (event.origin !== feBase) return;
      const msg = event.data;
      if (!msg || typeof msg.type !== 'string') return;

      switch (msg.type) {
        case 'isIframeLoaded':
          setIframeLoaded(true);
          postToIframe({
            type: 'customStyles',
            payload: {
              styling: buildPaymobIframeCustomStyle(isDarkMode()),
              options: { hideCardHolderName: true },
            },
          });
          break;
        case 'iframeCardHight':
          if (typeof msg.iframeCardHight === 'number') {
            setIframeHeight(msg.iframeCardHight);
          }
          break;
        case 'loading':
          if (typeof msg.loading === 'boolean') setPaying(msg.loading);
          break;
        case 'shouldDisableActionBtn':
          if (typeof msg.shouldDisableActionBtn === 'boolean') {
            setPayDisabledByIframe(msg.shouldDisableActionBtn);
          }
          break;
        case 'paymentResponse': {
          setPaying(false);
          const response = msg.response ?? {};
          const data = response.data ?? {};
          if (
            response.status === 200 &&
            isTrue(data.success) &&
            !isTrue(data.is_3d_secure)
          ) {
            onSuccess();
            return;
          }
          const url =
            typeof data.redirection_url === 'string'
              ? data.redirection_url
              : typeof data.redirect_url === 'string'
                ? data.redirect_url
                : typeof data.redirect === 'string'
                  ? data.redirect
                  : null;
          if (url) {
            onPending(url);
            return;
          }
          setPayError(
            extractError(
              data,
              isArabic
                ? 'تعذر إتمام الدفع. حاول مرة أخرى.'
                : 'Payment failed. Please try again.'
            )
          );
          break;
        }
        default:
          break;
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, feBase]);

  if (loadingMethod) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-light-200/50 bg-light-50 py-8 text-sm text-light-500 dark:border-dark-700/50 dark:bg-dark-800/50 dark:text-light-400">
        <SpinnerIcon />
        {isArabic
          ? 'جارٍ تحميل نموذج الدفع الآمن…'
          : 'Loading the secure payment form…'}
      </div>
    );
  }

  if (methodError || !method) {
    return (
      <div className="space-y-3">
        <p className="rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-500">
          {isArabic
            ? 'تعذر تحميل نموذج الدفع الآمن.'
            : 'Unable to load the secure payment form.'}
        </p>
        <button
          type="button"
          onClick={() => {
            if (onRetry) onRetry();
            else loadMethod();
          }}
          className="w-full rounded-xl border border-light-200/50 px-4 py-2.5 text-sm font-semibold text-light-600 transition hover:bg-light-50 dark:border-dark-700/50 dark:text-light-300 dark:hover:bg-dark-800"
        >
          {isArabic ? 'حاول مرة أخرى' : 'Try again'}
        </button>
      </div>
    );
  }

  const submit = () => {
    if (!method || paying) return;
    if (!holderName.trim()) {
      setHolderError(
        isArabic ? 'مطلوب اسم حامل البطاقة' : 'Card holder name is required'
      );
      return;
    }
    setHolderError('');
    setPayError('');
    setPaying(true);
    postToIframe({
      type: 'cardData',
      payload: {
        paymentToken: method.paymentToken,
        subType: {},
        currency: method.currency,
        cardHolderName: holderName.trim(),
        saveCard,
        tenure: null,
        shouldSubmitData: true,
        country: 'EG',
        integrationId: method.integrationId,
        discounts: {},
        checkBinFees: false,
        feesAmount: 0,
        isInstantRefundActive: false,
      },
    });
  };

  const labelClass =
    'mb-1 block text-xs font-semibold text-light-500 dark:text-light-400';

  return (
    <div className="space-y-4" dir={dir}>
      <div>
        <label className={labelClass} htmlFor="pm-holder">
          {isArabic ? 'اسم حامل البطاقة' : 'Card holder name'}
        </label>
        <input
          id="pm-holder"
          autoComplete={window.isSecureContext ? 'cc-name' : 'off'}
          value={holderName}
          onChange={(e) => {
            setHolderName(e.target.value);
            if (holderError) setHolderError('');
          }}
          placeholder={
            isArabic ? 'الاسم على البطاقة' : 'Name on card'
          }
          className={`w-full rounded-xl border px-4 py-3 text-sm text-light-900 outline-none transition placeholder:text-light-400/50 dark:text-white dark:placeholder:text-light-500/50 ${
            holderError
              ? 'border-danger-500 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20'
              : 'border-light-200/50 bg-white/80 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-dark-700/50 dark:bg-dark-800/80'
          }`}
        />
        {holderError && (
          <p className="mt-1 text-xs text-danger-500">{holderError}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>
          {isArabic ? 'بيانات البطاقة' : 'Card details'}
        </label>
        <iframe
          ref={iframeRef}
          title="Card details"
          src={iframeSrc}
          frameBorder="0"
          scrolling="no"
          width="100%"
          height={iframeHeight}
          style={{ border: 0, overflow: 'hidden' }}
        />
        {!iframeLoaded && (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-light-200/50 bg-light-50 py-8 text-sm text-light-500 dark:border-dark-700/50 dark:bg-dark-800/50 dark:text-light-400">
            <SpinnerIcon />
            {isArabic
              ? 'جارٍ تحميل نموذج الدفع الآمن…'
              : 'Loading the secure payment form…'}
          </div>
        )}
      </div>

      {payError && (
        <p className="rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-500">
          {payError}
        </p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={!iframeLoaded || paying || payDisabledByIframe}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {paying && <SpinnerIcon />}
        {payButtonLabel}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-light-400 dark:text-light-500">
        <ShieldIcon />
        {isArabic
          ? 'الدفع مشفّر وآمن بالكامل عبر Paymob'
          : 'Payments are fully encrypted & secured by Paymob'}
      </p>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-xl border border-light-200/50 px-4 py-2.5 text-sm font-semibold text-light-600 transition hover:bg-light-50 dark:border-dark-700/50 dark:text-light-300 dark:hover:bg-dark-800"
        >
          {isArabic ? 'رجوع' : 'Back'}
        </button>
      )}
    </div>
  );
}