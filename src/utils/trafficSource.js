// Where an applicant came from (job board, social post, ad, QR code ...).
// Recorded once per browser session and sent with the application.

const STORAGE_KEY = 'applicantSource';

// Referrer host -> channel, used when the link carries no ?source= / utm_source.
const REFERRER_CHANNELS = [
  [/(^|\.)linkedin\.com$|^lnkd\.in$/, 'linkedin'],
  [/(^|\.)wuzzuf\.net$/, 'wuzzuf'],
  [/(^|\.)indeed\.com$/, 'indeed'],
  [/(^|\.)bayt\.com$/, 'bayt'],
  [/(^|\.)facebook\.com$|^fb\.com$|^l\.facebook\.com$/, 'facebook'],
  [/(^|\.)instagram\.com$/, 'instagram'],
  [/(^|\.)(twitter|x)\.com$|^t\.co$/, 'x'],
  [/(^|\.)(whatsapp|wa)\.(com|me)$/, 'whatsapp'],
  [/(^|\.)t\.me$|(^|\.)telegram\.org$/, 'telegram'],
  [/(^|\.)google\./, 'google'],
  [/(^|\.)bing\.com$/, 'bing'],
];

// Click identifiers that platforms append to links automatically (e.g. the
// ?fbclid=... Facebook adds), so a visit is attributed with no ?source= in the
// link. Meta uses fbclid for Facebook and Instagram alike, so it reports "facebook".
const CLICK_ID_CHANNELS = [
  ['fbclid', 'facebook'],
  ['igshid', 'instagram'],
  ['gclid', 'google'],
  ['gbraid', 'google'],
  ['wbraid', 'google'],
  ['msclkid', 'bing'],
  ['ttclid', 'tiktok'],
  ['li_fat_id', 'linkedin'],
  ['twclid', 'x'],
];

const channelFromClickId = (params) =>
  (CLICK_ID_CHANNELS.find(([key]) => params.has(key)) || [])[1];

const clean = (value, max = 200) => {
  const trimmed = (value || '').trim().slice(0, max);
  return trimmed || undefined;
};

const channelFromReferrer = (referrer) => {
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (host === window.location.hostname) return undefined;
    const known = REFERRER_CHANNELS.find(([re]) => re.test(host));
    return known ? known[1] : host.replace(/^www\./, '');
  } catch {
    return undefined;
  }
};

const readCurrentVisit = () => {
  const params = new URLSearchParams(window.location.search);
  const utmSource = clean(params.get('utm_source'));
  const explicit = clean(params.get('source') || params.get('ref'), 100);
  const referrer = clean(document.referrer, 500);
  const fromReferrer = referrer ? channelFromReferrer(referrer) : undefined;

  const channel = (explicit || utmSource || channelFromClickId(params) || fromReferrer)?.toLowerCase();
  if (!channel) return null;

  return {
    channel,
    utmSource,
    utmMedium: clean(params.get('utm_medium')),
    utmCampaign: clean(params.get('utm_campaign')),
    utmContent: clean(params.get('utm_content')),
    utmTerm: clean(params.get('utm_term')),
    referrer: fromReferrer ? referrer : undefined,
  };
};

/**
 * Call once on app start. Stores the visit's source in sessionStorage so it
 * survives in-app navigation (listing -> job form), where the original query
 * string and document.referrer are gone. A visit with an explicit source, a
 * click id or a known referrer replaces the stored one; a plain visit does not.
 */
export const captureTrafficSource = () => {
  try {
    const current = readCurrentVisit();
    if (current) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // Storage can be blocked (private mode, embedded iframes); source is optional.
  }
};

export const getTrafficSource = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // fall through
  }
  return readCurrentVisit() || { channel: 'direct' };
};
