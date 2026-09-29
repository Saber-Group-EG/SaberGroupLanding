// Shared helpers for passing checkout state from CheckoutPage -> PaymentPage,
// and for creating/caching Paymob payment intentions.
// Adjust the two imports below to match your actual api file locations.
import { startCheckout } from './formsApi';
import { parsePaymobCheckoutUrl } from './paymobApi';

const CONTACT_CACHE_KEY = 'checkout_contact';
const SESSION_CACHE_KEY = 'checkout_session';
const INTENTION_CACHE_PREFIX = 'paymob_intention_';
const INTENTION_CACHE_TTL = 30 * 60 * 1000; // 30 min

// ── Contact form persistence (Checkout step) ─────────────────────────────
export const readSavedContact = () => {
  try {
    const raw = sessionStorage.getItem(CONTACT_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const writeSavedContact = (form) => {
  try {
    sessionStorage.setItem(CONTACT_CACHE_KEY, JSON.stringify(form));
  } catch {
    // storage unavailable — form just won't be restored on reload
  }
};

// ── Full checkout session (handed off from Checkout -> Payment page) ────
// Carries the plan, contact details, and the exact promo/total the user
// confirmed, so the Payment page never has to re-derive the amount — it
// only ever charges what was shown and agreed to on the Checkout page.
export const writeCheckoutSession = (session) => {
  try {
    sessionStorage.setItem(
      SESSION_CACHE_KEY,
      JSON.stringify({ ...session, savedAt: Date.now() })
    );
  } catch {
    // noop — PaymentPage falls back to router state only
  }
};

export const readCheckoutSession = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Same TTL as the intention cache — a stale tab should never be able
    // to pay against an amount/promo snapshot that's minutes/hours old.
    if (Date.now() - parsed.savedAt > INTENTION_CACHE_TTL) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearCheckoutSession = () => {
  try {
    sessionStorage.removeItem(SESSION_CACHE_KEY);
  } catch {
    // noop
  }
};

// ── Paymob intention creation + caching (Payment step) ───────────────────
// One cached intention per plan + payload hash, so a reload (or React
// StrictMode double-fire) never spams Paymob with duplicate orders.
const createIntention = async (payload) => {
  const res = await startCheckout(payload);
  const parsed =
    typeof res.checkoutUrl === 'string'
      ? parsePaymobCheckoutUrl(res.checkoutUrl)
      : null;
  if (parsed) return parsed;
  throw new Error('No payment session returned');
};

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
    // storage unavailable — session will just be re-created
  }
};

export const clearIntentionCache = (planId) => {
  try {
    sessionStorage.removeItem(INTENTION_CACHE_PREFIX + planId);
  } catch {
    // noop
  }
};

let intentionInFlight = null; // { hash, promise } — dedupe concurrent creates

// payload must include the exact planId + promoCode that were confirmed on
// the Checkout page — the backend computes and returns the real charge
// amount from those, which is what gets embedded in the Paymob session.
export const getIntention = async (payload) => {
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
