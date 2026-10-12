import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from '../i18n/hooks/useTranslation';
import content from '../content/AboutContent';

const valueIcons = [
  <svg
    key="innovation"
    className="w-6 h-6"
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
  <svg
    key="precision"
    className="w-6 h-6"
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
  <svg
    key="partnership"
    className="w-6 h-6"
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
  <svg
    key="reliability"
    className="w-6 h-6"
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

const AboutUs = () => {
  const { isArabic } = useTranslation();
  const navigate = useNavigate();
  const c = content[isArabic ? 'ar' : 'en'];

  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5192D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f9fa]';
  const focusRingDark =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5192D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1114]';

  const primaryPill = `group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#E5192D] hover:bg-[#c81424] text-white font-bold text-xs ltr:tracking-wider rtl:tracking-normal uppercase shadow-lg shadow-red-600/30 active:scale-95 transition-all cursor-pointer whitespace-nowrap`;
  const outlinePill = `inline-flex items-center justify-center px-6 py-3 rounded-full border border-neutral-800 text-neutral-900 hover:border-black hover:bg-neutral-900 hover:text-white font-bold text-xs ltr:tracking-wider rtl:tracking-normal uppercase transition-all cursor-pointer whitespace-nowrap`;
  const ghostPill = `inline-flex items-center justify-center px-6 py-3 rounded-full border border-neutral-700 hover:border-white text-white hover:bg-white hover:text-black font-bold text-xs ltr:tracking-wider rtl:tracking-normal uppercase transition-all cursor-pointer whitespace-nowrap`;

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className="pt-16 min-h-screen bg-[#f8f9fa] text-[#111315] selection:bg-[#E5192D] selection:text-white"
      style={{
        fontFamily: isArabic
          ? "'Cairo', system-ui, sans-serif"
          : "'Montserrat', system-ui, sans-serif",
      }}
    >
      <Helmet>
        {!isArabic && (
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap"
          />
        )}
        {isArabic && (
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap"
          />
        )}
      </Helmet>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="py-16 sm:py-20 lg:py-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5192D]/10 text-[#C81424] text-[10px] font-extrabold uppercase ltr:tracking-widest rtl:tracking-normal mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5192D]" />
            {isArabic ? 'من نحن' : 'Who We Are'}
          </div>

          <h1 className="text-[#111315] font-black text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight leading-[1.03]">
            {c.headline}
          </h1>

          <span className="block w-8 h-1 bg-[#E5192D] rounded-full my-4 mx-auto" />

          <p className="text-neutral-600 text-sm sm:text-base max-w-2xl leading-relaxed">
            {c.subheadline}
          </p>

          {/* wrap keeps the three pills from forcing horizontal scroll at md */}
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className={`${primaryPill} ${focusRing}`}
            >
              <span>{isArabic ? 'تواصل معنا' : 'Get in touch'}</span>
              <ArrowRight className="w-4 h-4 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </button>

            <a
              href="mailto:info@sabergroup-eg.com"
              className={`${outlinePill} ${focusRing}`}
            >
              info@sabergroup-eg.com
            </a>

            <a href="tel:+201080099757" dir="ltr" className={`${outlinePill} ${focusRing}`}>
              01080099757
            </a>
          </div>
        </div>
      </div>

      <section className="py-16 bg-white border-b border-neutral-200/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200">
            {c.stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center text-center p-6 sm:p-8"
              >
                <span className="font-black text-4xl sm:text-5xl lg:text-[54px] text-[#111315] tracking-tight leading-none mb-3 tabular-nums">
                  {stat.value}
                </span>
                <span className="text-neutral-500 text-xs sm:text-sm font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#f8f9fa] border-b border-neutral-200/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="mb-12">
            <h2 className="text-[#111315] font-black text-4xl sm:text-5xl uppercase tracking-tight">
              {isArabic ? 'قصتنا ورؤيتنا' : 'Our Story & Vision'}
            </h2>
            <span className="block w-8 h-1 bg-[#E5192D] rounded-full my-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 rounded-3xl bg-white border border-neutral-200/80 p-8 sm:p-10 shadow-xs">
              <h3 className="text-2xl font-black uppercase tracking-tight text-[#111315] mb-4">
                {c.story.title}
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">{c.story.body}</p>
            </div>

            <div className="lg:col-span-5 rounded-3xl ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-neutral-900 to-neutral-950 border border-neutral-800 p-8 sm:p-10 text-white">
              <div className="w-12 h-12 rounded-2xl bg-[#E5192D]/15 text-[#E5192D] flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">
                {c.vision.title}
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{c.vision.body}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-neutral-200/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="mb-12">
            <h2 className="text-[#111315] font-black text-4xl sm:text-5xl uppercase tracking-tight">
              {c.values.title}
            </h2>
            <span className="block w-8 h-1 bg-[#E5192D] rounded-full my-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.values.list.map((val, i) => (
              <div
                key={i}
                className="group bg-[#fbfbfc] hover:bg-white rounded-2xl p-7 border border-neutral-200 hover:border-neutral-400/80 shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-start gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200/80 shadow-xs flex items-center justify-center text-[#E5192D] group-hover:scale-105 transition-transform">
                    {valueIcons[i]}
                  </div>
                  <h3 className="text-lg font-black text-[#111315] tracking-tight group-hover:text-[#C81424] transition-colors">
                    {val.title}
                  </h3>
                </div>
                <p className="text-neutral-600 text-xs leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0e1114] text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6">
              <h2 className="font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.1] uppercase">
                {c.cta.title}
              </h2>
            </div>

            <div className="hidden lg:block lg:col-span-1 h-20 w-[1px] bg-neutral-800 mx-auto" />

            <div className="lg:col-span-5 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-6">
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xs">
                {c.cta.subtitle}
              </p>

              {/* wraps below the copy instead of overflowing the 5-col track */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className={`${primaryPill} ${focusRingDark}`}
                >
                  <span>{isArabic ? 'تواصل معنا' : 'Get in touch'}</span>
                  <ArrowRight className="w-4 h-4 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </button>

                <a
                  href="mailto:info@sabergroup-eg.com"
                  className={`${ghostPill} ${focusRingDark}`}
                >
                  info@sabergroup-eg.com
                </a>

                <a
                  href="tel:+201080099757"
                  dir="ltr"
                  className={`${ghostPill} ${focusRingDark}`}
                >
                  01080099757
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default AboutUs;
