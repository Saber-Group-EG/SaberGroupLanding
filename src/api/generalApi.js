import axios from 'axios';

// Determine API base URL. Prefer CRM backend, fallback to location API URL if set.
const apiBase = import.meta.env.VITE_CRM_BACKEND_URL || import.meta.env.VITE_LOCATION_API_URL || '';
if (!apiBase) {
  // If no base is configured, axios will issue requests relative to the page origin (localhost during dev).
  // Log a clear warning to help debugging.
  // eslint-disable-next-line no-console
  console.warn('VITE_CRM_BACKEND_URL and VITE_LOCATION_API_URL are not set — API requests will use the site origin. Set VITE_CRM_BACKEND_URL in your .env to point to the API.');
}

// Create axios instance with resolved base URL
const api = axios.create({
  baseURL: apiBase,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add lead (public endpoint)
export async function addLead(leadData) {
  try {
    const response = await api.post('/lead/public', leadData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default { addLead };

// --- Location API helpers ---
/**
 * Fetch countries (public)
 * Returns the full axios response so callers can access `.data` as before
 */
export async function fetchCountries(params = { deleted: false, PageCount: 1000, page: 1 }) {
  // Use CRM backend API for location endpoints so env VITE_CRM_BACKEND_URL is used
  return api.get('/country/public', { params });
}

/**
 * Fetch all cities (public)
 */
export async function fetchCities(params = { deleted: false, PageCount: 1000, page: 1 }) {
  // Prefer CRM backend for city endpoints to ensure VITE_CRM_BACKEND_URL is respected
  return api.get('/city/public', { params });
}

/**
 * Fetch governorates for a country (public)
 */
export async function fetchGovernorates(params = { deleted: false, PageCount: 1000, page: 1, country: '' }) {
  // Use CRM backend for governorate endpoints so the configured CRM base URL is used
  return api.get('/government/public', { params });
}
