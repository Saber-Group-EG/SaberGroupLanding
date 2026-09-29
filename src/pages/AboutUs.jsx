import React from 'react';
import { useTranslation } from '../i18n/hooks/useTranslation';
import content from '../content/AboutContent';

// ─── Value icons (SVG, no emojis) ────────────────────────────────────────────

const valueIcons = [
  // Innovation — lightbulb
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>,
  // Precision — target
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>,
  // Partnership — handshake-like users
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>,
  // Reliability — shield
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>,
];

// ─── Component ────────────────────────────────────────────────────────────────

const AboutUs = () => {
  const { isArabic } = useTranslation();
  const c = content[isArabic ? 'ar' : 'en'];

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen bg-linear-to-br from-light-50 via-white to-light-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-20 px-4 md:px-6"
    >
      <div className="max-w-5xl mx-auto">
        {/* ── Hero ── */}
        <div className="text-center mb-16 mt-12">
          <h1 className="text-5xl md:text-6xl font-bold text-light-900 dark:text-white mb-6 tracking-tight">
            {c.headline}
          </h1>
          <p className="text-lg text-light-600 dark:text-light-400 max-w-2xl mx-auto leading-relaxed">
            {c.subheadline}
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
          {c.stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-6 text-center"
            >
              <p className="text-3xl font-bold text-primary-500 mb-1 tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm text-light-500 dark:text-light-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Story + Vision ── */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {[c.story, c.vision].map((block, i) => (
            <div
              key={i}
              className="bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-8"
            >
              <h2 className="text-xl font-bold text-light-900 dark:text-white mb-4">
                {block.title}
              </h2>
              <p className="text-light-600 dark:text-light-400 leading-relaxed">
                {block.body}
              </p>
            </div>
          ))}
        </div>

        {/* ── Values ── */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-light-900 dark:text-white mb-8 text-center">
            {c.values.title}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {c.values.list.map((val, i) => (
              <div
                key={i}
                className="bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-6 hover:border-primary-500/40 transition-colors"
              >
                <div className={`flex items-center gap-3 mb-3 ${isArabic ? 'justify-end' : 'justify-start'}`}>
                  <div className="w-9 h-9 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center mb-4">
                    {valueIcons[i]}
                  </div>
                  <h3 className="font-bold text-light-900 dark:text-white">
                    {val.title}
                  </h3>
                </div>
                <p className="text-sm text-light-500 dark:text-light-400 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold text-light-900 dark:text-white mb-3">
            {c.cta.title}
          </h2>
          <p className="text-light-600 dark:text-light-400 mb-8">
            {c.cta.subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:info@sabergroup-eg.com"
              className="px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
            >
              info@sabergroup-eg.com
            </a>
            <a
              href="tel:+201080099757"
              dir="ltr"
              className="px-6 py-3 border border-primary-500 text-primary-500 rounded-xl font-semibold hover:bg-primary-500 hover:text-white transition-colors"
            >
              01080099757
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
