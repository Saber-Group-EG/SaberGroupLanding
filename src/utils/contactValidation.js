// Phone and email rules for the application form.
//
// Phones: the applicant picks a country and types the local number.
// - Egypt keeps the format the ATS has always stored (01XXXXXXXXX, mobile
//   only), so duplicate checks and WhatsApp links keep working.
// - Every other country is checked with libphonenumber and stored in
//   international form (+9665XXXXXXXX).
import examples from 'libphonenumber-js/mobile/examples';
import {
  getCountries,
  getExampleNumber,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';

export const DEFAULT_PHONE_COUNTRY = 'EG';

// Shown first in the picker: Egypt and the Gulf/Levant markets.
const PINNED = ['EG', 'SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'JO'];

const EGYPT_MOBILE = /^01[0125]\d{8}$/;

/** Countries for the picker, names in the page language, pinned ones first. */
export function phoneCountryOptions(lang) {
  let names = null;
  try {
    names = new Intl.DisplayNames([lang], { type: 'region' });
  } catch {
    names = null;
  }
  const all = getCountries().map((code) => ({
    code,
    name: names?.of(code) || code,
    dial: `+${getCountryCallingCode(code)}`,
  }));
  const pinned = PINNED.map((c) => all.find((o) => o.code === c)).filter(Boolean);
  const rest = all
    .filter((o) => !PINNED.includes(o.code))
    .sort((a, b) => a.name.localeCompare(b.name, lang));
  return [...pinned, ...rest];
}

/** Keep only what a phone number can contain while typing. */
export const cleanPhoneInput = (raw) => raw.replace(/[^\d]/g, '').slice(0, 15);

/** Egyptian numbers typed without the leading 0 (1012345678) get it back. */
const egyptLocal = (digits) => (/^1[0125]\d{8}$/.test(digits) ? `0${digits}` : digits);

export function isValidPhone(phone, country) {
  const digits = cleanPhoneInput(phone || '');
  if (!digits) return false;
  if (country === 'EG') return EGYPT_MOBILE.test(egyptLocal(digits));
  try {
    return isValidPhoneNumber(digits, country);
  } catch {
    return false;
  }
}

/** The value sent to the server: 01XXXXXXXXX for Egypt, +<code><number> otherwise. */
export function toStoredPhone(phone, country) {
  const digits = cleanPhoneInput(phone || '');
  if (!digits) return '';
  if (country === 'EG') return egyptLocal(digits);
  const parsed = parsePhoneNumberFromString(digits, country);
  return parsed?.number || `+${getCountryCallingCode(country)}${digits.replace(/^0+/, '')}`;
}

/**
 * Split a number from elsewhere (e.g. a CV) into country + local digits.
 * Egyptian-looking and unknown numbers fall back to Egypt.
 */
export function splitPhone(raw) {
  const value = String(raw || '').trim();
  const intl = value.startsWith('00') ? `+${value.slice(2)}` : value;
  if (intl.startsWith('+')) {
    const parsed = parsePhoneNumberFromString(intl);
    if (parsed?.country) {
      const national = String(parsed.nationalNumber);
      return {
        country: parsed.country,
        phone: parsed.country === 'EG' ? egyptLocal(national) : national,
      };
    }
  }
  return { country: DEFAULT_PHONE_COUNTRY, phone: egyptLocal(cleanPhoneInput(value)) };
}

/** Example local number for the placeholder. */
export function phonePlaceholder(country) {
  if (country === 'EG') return '01012345678';
  try {
    return getExampleNumber(country, examples)?.nationalNumber || '';
  } catch {
    return '';
  }
}

// ─── Email ───────────────────────────────────────────────────────────────────

// name@domain.tld — no spaces, one @, a dot in the domain, a 2+ letter TLD.
const EMAIL = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

export const isValidEmail = (email) => {
  const v = (email || '').trim();
  return v.length <= 254 && EMAIL.test(v) && !v.includes('..');
};

// Common misspellings of popular mail domains.
const DOMAIN_FIXES = {
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.om': 'gmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmal.com': 'hotmail.com',
  'hotmail.co': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'outlook.co': 'outlook.com',
  'outlook.con': 'outlook.com',
  'icloud.co': 'icloud.com',
};

/** "name@gmial.com" → "name@gmail.com"; null when nothing looks mistyped. */
export function suggestEmail(email) {
  const v = (email || '').trim().toLowerCase();
  const at = v.lastIndexOf('@');
  if (at < 1) return null;
  const fix = DOMAIN_FIXES[v.slice(at + 1)];
  return fix ? `${v.slice(0, at)}@${fix}` : null;
}
