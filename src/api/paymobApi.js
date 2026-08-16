// Headless Paymob integration (custom UI around Paymob's card iframe).
// Paymob no longer exposes a browser tokenization REST endpoint, so the
// card number/expiry/cvv inputs live in Paymob's hosted iframe
// (`/iframe-card/`), which we theme with our brand colors, drive via
// postMessage, and wrap in our own page, pay button and result handling.

const API_BASE_BY_CHECKOUT_HOST = {
  'eg.checkout.paymob.com': 'https://accept.paymob.com',
  'ksa.checkout.paymob.com': 'https://ksa.paymob.com',
  'uae.checkout.paymob.com': 'https://uae.paymob.com',
  'oman.checkout.paymob.com': 'https://oman.paymob.com',
  'pakistan.checkout.paymob.com': 'https://pakistan.paymob.com',
};

const FE_BASE_BY_CHECKOUT_HOST = {
  'eg.checkout.paymob.com': 'https://eg.checkout.paymob.com',
  'ksa.checkout.paymob.com': 'https://ksa.checkout.paymob.com',
  'uae.checkout.paymob.com': 'https://uae.checkout.paymob.com',
  'om.checkout.paymob.com': 'https://om.checkout.paymob.com',
  'pk.checkout.paymob.com': 'https://pk.checkout.paymob.com',
};

function checkoutHost(checkoutUrl) {
  if (!checkoutUrl) return null;
  try {
    return new URL(checkoutUrl).host;
  } catch {
    return null;
  }
}

/** Paymob Accept API base for the checkout region (defaults to Egypt). */
export function paymobApiBaseUrl(checkoutUrl) {
  const host = checkoutHost(checkoutUrl);
  if (host && API_BASE_BY_CHECKOUT_HOST[host]) {
    return API_BASE_BY_CHECKOUT_HOST[host];
  }
  return 'https://accept.paymob.com';
}

/** Paymob card-iframe frontend base for the checkout region (defaults to Egypt). */
export function paymobFeBaseUrl(checkoutUrl) {
  const host = checkoutHost(checkoutUrl);
  if (host && FE_BASE_BY_CHECKOUT_HOST[host]) {
    return FE_BASE_BY_CHECKOUT_HOST[host];
  }
  return 'https://eg.checkout.paymob.com';
}

export class PaymobApiError extends Error {
  constructor(message, status, raw, redirect) {
    super(message);
    this.name = 'PaymobApiError';
    this.status = status;
    this.raw = raw;
    this.redirect = redirect;
  }
}

function extractErrorMessage(data, fallback) {
  if (Array.isArray(data) && data.length > 0) return String(data[0]);
  if (data && typeof data === 'object') {
    for (const key of ['msg', 'message', 'error', 'detail']) {
      const v = data[key];
      if (typeof v === 'string' && v) return v;
    }
  }
  return fallback;
}

/**
 * Resolves the intention via the public element endpoint and returns the
 * card payment method data needed to drive the card iframe.
 */
export async function fetchPaymobCardMethod(
  publicKey,
  clientSecret,
  checkoutUrl
) {
  const base = paymobApiBaseUrl(checkoutUrl);
  let res;
  try {
    res = await fetch(
      `${base}/v1/intention/element/${encodeURIComponent(publicKey)}/${encodeURIComponent(clientSecret)}/`
    );
  } catch {
    throw new PaymobApiError('network');
  }
  if (!res.ok) {
    throw new PaymobApiError(
      extractErrorMessage(await res.json().catch(() => null), 'intention'),
      res.status
    );
  }
  const data = await res.json();
  const redirect =
    typeof data.redirect === 'string' ? data.redirect : undefined;
  if (redirect) {
    throw new PaymobApiError(
      typeof data.error === 'string' && data.error
        ? data.error
        : 'pending_payment',
      res.status,
      data,
      redirect
    );
  }
  const paymentToken = data.payment_keys?.['card'];
  if (typeof paymentToken !== 'string' || !paymentToken) {
    throw new PaymobApiError('no_card_method');
  }
  const cardMethod = (data.payment_methods ?? []).find(
    (m) => (m.name ?? '').toLowerCase() === 'card'
  );
  return {
    paymentToken,
    integrationId:
      typeof cardMethod?.integration_id === 'number'
        ? cardMethod.integration_id
        : null,
    currency: data.intention_detail?.currency ?? 'EGP',
  };
}

/**
 * Extracts Pixel credentials from a hosted checkout URL like
 * `https://accept.paymob.com/unifiedcheckout/?publicKey=...&clientSecret=...`
 * so the payment can be embedded instead of redirecting away.
 */
export function parsePaymobCheckoutUrl(url) {
  try {
    const parsed = new URL(url);
    const publicKey = parsed.searchParams.get('publicKey');
    const clientSecret = parsed.searchParams.get('clientSecret');
    if (publicKey && clientSecret) {
      return { publicKey, clientSecret, checkoutUrl: url };
    }
  } catch {
    // not a parseable URL — leave it to the caller to redirect
  }
  return null;
}

export function isDarkMode() {
  return (
    document.documentElement.classList.contains('dark') ||
    document.body.classList.contains('dark')
  );
}

/**
 * Brand-matched styling sent to the Paymob card iframe via `customStyles`.
 *
 * The iframe renders the card fields as one connected block (shared borders,
 * no gaps), so we override per-field inline styles to split it into
 * standalone boxes that mirror the site's inputs: text-sm (14px), h-11
 * (44px), rounded-xl (12px), brand palette, 16px gaps.
 *
 * Structure must match what the iframe reads: `input`, `placeholder`,
 * `label`, `error`, `container` and `hideCardIcons`.
 */
export function buildPaymobIframeCustomStyle(dark) {
  const fontFamily = 'Cairo, ui-sans-serif, system-ui, sans-serif';
  return dark
    ? {
        container: { direction: 'ltr', width: '100%' },
        label: {
          fontFamily,
          fontSize: '12px',
          fontWeight: '600',
          color: '#a3a3a3',
        },
        input: {
          fontFamily,
          fontSize: '14px',
          fontWeight: '400',
          color: '#f6f6f6',
          backgroundColor: '#141414',
          border: '1px solid #3d3d3d',
          borderRadius: '12px',
          height: '44px',
          padding: '0 16px',
          marginTop: '16px',
          marginRight: '16px',
        },
        error: { color: '#f5413e' },
        placeholder: { color: '#525252' },
        hideCardIcons: true,
      }
    : {
        container: { direction: 'ltr', width: '100%' },
        label: {
          fontFamily,
          fontSize: '12px',
          fontWeight: '600',
          color: '#7c8e89',
        },
        input: {
          fontFamily,
          fontSize: '14px',
          fontWeight: '400',
          color: '#0f1413',
          backgroundColor: '#ffffff',
          border: '1px solid #dce7e5',
          borderRadius: '12px',
          height: '44px',
          padding: '0 16px',
          marginTop: '16px',
          marginRight: '16px',
        },
        error: { color: '#e42e2b' },
        placeholder: { color: '#a2b3ae' },
        hideCardIcons: true,
      };
}