/**
 * Open Graph (OG) Meta Tags Utilities
 * Helper functions and constants for social media sharing
 */

// Site configuration
export const SITE_URL = 'https://www.sabergroup-eg.com';
export const SITE_NAME = 'Saber Group';
export const DEFAULT_OG_IMAGE = '/src/assets/logos/MAIN LOGO.png';

/**
 * Convert relative image URLs to absolute URLs for OG tags
 * @param {string} imageUrl - The image URL (relative or absolute)
 * @returns {string|null} - Absolute URL or null if no image
 */
export const getAbsoluteImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If already absolute URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If relative URL, make it absolute using SITE_URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : SITE_URL;
  return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
};

/**
 * Get the full URL for a given path
 * @param {string} path - The path (e.g., '/about', '/projects/slug')
 * @returns {string} - Full URL
 */
export const getFullUrl = (path = '') => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
};

/**
 * Get default OG image URL
 * @returns {string} - Absolute URL to default OG image
 */
export const getDefaultOgImage = () => {
  return getAbsoluteImageUrl(DEFAULT_OG_IMAGE);
};
