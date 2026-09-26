import { useTranslation } from './useTranslation';
import homeContent from '../../content/HomeContent';

/**
 * Returns the home page copy for the current language ({ en, ar } from HomeContent).
 */
export const useHomeCopy = () => {
  const { isArabic } = useTranslation();

  return homeContent[isArabic ? 'ar' : 'en'];
};
