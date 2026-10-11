import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../i18n/hooks/useTranslation';

const footerLogo = '/FOOTER.png';

// The footer is shared by every route (MainLayout), so it inherits each page's
// content container — match the classes the page itself uses.
const DEFAULT_CONTAINER = 'max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12';

const EXACT_CONTAINERS = {
  '/': DEFAULT_CONTAINER,
  '/about': 'max-w-5xl mx-auto px-4 md:px-6',
  '/address': 'max-w-5xl mx-auto px-4 md:px-6',
  '/contact': 'container mx-auto px-4 md:px-6',
  '/policies': 'max-w-4xl mx-auto px-4 md:px-6',
  '/terms': 'max-w-4xl mx-auto px-4 md:px-6',
  '/join-us': 'container mx-auto px-4 md:px-6',
  '/join-us/check-application': 'container mx-auto px-4 md:px-6 max-w-3xl',
  '/checkout': 'max-w-2xl mx-auto px-4 md:px-6',
  '/checkout/payment': 'max-w-2xl mx-auto px-4 md:px-6',
  '/checkout/complete': 'max-w-2xl mx-auto px-4 md:px-6',
  '/coming-soon': 'container mx-auto px-4 md:px-6',
};

const PREFIX_CONTAINERS = [
  ['/portfolio', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'],
  ['/services', 'max-w-5xl mx-auto px-4 md:px-6'],
  ['/join-us', 'container mx-auto px-4 md:px-6 max-w-4xl'],
];

const containerForPath = (pathname) => {
  const path = pathname.replace(/\/+$/, '') || '/';
  const exact = EXACT_CONTAINERS[path];
  if (exact) return exact;
  const prefixMatch = PREFIX_CONTAINERS.find(
    ([prefix]) => path === prefix || path.startsWith(`${prefix}/`),
  );
  return prefixMatch ? prefixMatch[1] : DEFAULT_CONTAINER;
};

const Footer = () => {
  const { t, isArabic } = useTranslation();
  const location = useLocation();
  const containerClass = containerForPath(location.pathname);
  const currentYear = new Date().getFullYear();

  const displayedYear = String(currentYear);

  const policyLinks = [
    {
      label: isArabic ? 'سياسة الخصوصية' : 'Privacy Policy',
      href: '/policies?tab=privacy',
    },
    {
      label: isArabic ? 'سياسة الاسترداد' : 'Refund Policy',
      href: '/policies?tab=refund',
    },
    {
      label: isArabic ? 'مدة الخدمة' : 'Service Duration',
      href: '/policies?tab=service',
    },
    {
      label: isArabic ? 'الشروط والأحكام' : 'Terms & Conditions',
      href: '/terms',
    },
    { label: isArabic ? 'عنواننا' : 'Address', href: '/address' },
    { label: isArabic ? 'تواصل معنا' : 'Contact Us', href: '/contact' },
  ];

  return (
    <footer className="bg-dark-900 text-white">
      <div className={containerClass}>
        {/* Main Contact & Location Section */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Brand & Description */}
            <div className={`space-y-6 ${isArabic ? 'rtl' : ''}`}>
              <div className="flex items-center gap-3">
                <img
                  src={footerLogo}
                  alt="Saber Group Logo"
                  className="h-8 w-auto object-contain"
                />
              </div>

              <p className="text-light-300 text-sm leading-relaxed">
                {t('footer:description')}
              </p>

              {/* Business Hours */}
              <div className="pt-4 border-t border-dark-800">
                <h5 className="text-lg font-semibold text-white mb-3">
                  {t('contact:officeHoursTitle') || 'Business Hours'}
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-light-400">
                      {t('footer:sunThu') || 'Saturday – Thursday'}
                    </span>
                    <span className="text-light-300">9:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-400">
                      {t('footer:friSat') || 'Friday'}
                    </span>
                    <span className="text-light-300">
                      {isArabic ? 'إجازة' : 'Closed'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-4 border-t border-dark-800">
                <h5 className="text-lg font-semibold text-white mb-3">
                  {t('footer:followUs') || 'Follow Us'}
                </h5>
                <div className="flex gap-3">
                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/sabergroupeg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-dark-800 hover:bg-primary-500 flex items-center justify-center transition-colors duration-200 group"
                  >
                    <svg
                      className="w-5 h-5 text-light-400 group-hover:text-white transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>

                  {/* Behance */}
                  <a
                    href="https://www.behance.net/ahmed_saber_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-dark-800 hover:bg-[#1769FF] flex items-center justify-center transition-colors duration-200 group"
                  >
                    <svg
                      className="w-5 h-5 text-light-400 group-hover:text-white transition-colors"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3 7v10h6.5c2.25 0 3.5-1.25 3.5-3.25 0-1.75-1.25-2.75-3-2.95V10c1.4-.15 2.5-1.1 2.5-2.5C12.5 6 11 5 8.5 5H3zm9 7.5c.83 0 1.5.67 1.5 1.5S12.83 17.5 12 17.5H9V14h3v.5zM16 8h5v2h-5V8zm0 4h5v6h-5v-6z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/sabergroupstudios"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-dark-800 hover:bg-linear-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 flex items-center justify-center transition-all duration-200 group"
                  >
                    <svg
                      className="w-5 h-5 text-light-400 group-hover:text-white transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/ahmed-saber-004aa8196/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-dark-800 hover:bg-blue-600 flex items-center justify-center transition-colors duration-200 group"
                  >
                    <svg
                      className="w-5 h-5 text-light-400 group-hover:text-white transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className={`space-y-6 ${isArabic ? 'rtl' : ''}`}>
           

     
            </div>

            {/* Location & Map */}
            <div className={`space-y-6 ${isArabic ? 'rtl' : ''}`}>
              <h4 className="text-xl font-bold text-white">
                {t('contact:findUs') || 'Visit Our Office'}
              </h4>

              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-primary-500 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-sm leading-relaxed">
                      <span className="text-white font-semibold">
                        {t('contact:addressTitle') || 'Headquarters'}
                      </span>
                      <span className="text-light-400">{' : '}</span>
                      <a
                        href="https://maps.app.goo.gl/U8b1DJxKdUVosnwV8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-light-300 hover:text-primary-300 transition-colors"
                      >
                        {t('contact:address') ||
                          'El-gharbia Tanta, El-nady St in front of Tanta Club Gate, Above Waffle Art'}
                      </a>
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-primary-500 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-sm leading-relaxed">
                      <span className="text-white font-semibold">
                        {t('contact:secondaryAddressTitle') || 'Studio'}
                      </span>
                      <span className="text-light-400">{' : '}</span>
                      <a
                        href="https://www.google.com/maps/place/articka/@30.7958747,30.9888239,16z/data=!3m1!4b1!4m6!3m5!1s0x14f7c94d9d544d5b:0xabf04ad58406b6c1!8m2!3d30.7958747!4d30.9888239!16s%2Fg%2F11h5w69h6d"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-light-300 hover:text-primary-300 transition-colors"
                      >
                        {t('contact:secondaryAddress')}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border-2 border-dark-700 shadow-lg">
                  <div className="w-full h-64 md:h-56 lg:h-64 bg-dark-800 relative">
                    <iframe
                      title="Saber Group Office - Tanta"
                      src="https://www.google.com/maps?q=30.810011,30.998228&z=17&output=embed"
                      className="w-full h-full border-0"
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="absolute top-3 right-3">
                      <a
                        href="https://maps.app.goo.gl/U8b1DJxKdUVosnwV8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm inline-flex items-center gap-2 px-3 py-1 bg-dark-900/60 text-white rounded-md border border-white/10 hover:bg-dark-900/80 transition-colors"
                      >
                        {t('footer:openMaps') || 'Open Maps'}
                      </a>
                    </div>
                  </div>
                  <div className="bg-dark-800 px-4 py-3 flex justify-between items-center">
                    <div>
                      <p className="text-light-300 font-medium text-sm">
                        Tanta Office
                      </p>
                      <p className="text-light-400 text-xs">
                        El-gharbia Tanta, Egypt
                      </p>
                    </div>
                    <a
                      href="https://maps.app.goo.gl/U8b1DJxKdUVosnwV8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white text-sm px-4 py-2 transition-colors duration-200"
                    >
                      {t('footer:openMaps') || 'Open Maps'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-800 py-6">
          <div
            className={`flex flex-col md:flex-row justify-between items-center gap-4 ${isArabic ? 'rtl' : ''}`}
          >
            {/* Copyright */}
            <p className="text-light-400 text-sm">
              © <span dir={isArabic ? 'ltr' : undefined}>{displayedYear}</span>{' '}
              {t('common:brandName') || 'Saber Group'}
            </p>

            {/* Policy Links */}
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {policyLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-light-500 hover:text-primary-400 text-xs transition-colors duration-200 whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
