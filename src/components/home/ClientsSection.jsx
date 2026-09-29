import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';
import { useTranslation } from '../../i18n/hooks/useTranslation';
import { useHorizontalScroll } from './useHorizontalScroll';

const SKELETON_IDS = ['client-1', 'client-2', 'client-3', 'client-4', 'client-5', 'client-6'];

const ClientWordmark = ({ logo, name, field }) => {
  const [failed, setFailed] = useState(false);

  if (logo && !failed) {
    return (
      <img
        src={logo}
        alt={name}
        className="h-10 sm:h-12 w-auto object-contain"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="flex flex-col items-start">
      <span className="text-lg sm:text-xl font-black uppercase tracking-tight text-neutral-500 whitespace-nowrap max-w-[200px] sm:max-w-[260px] line-clamp-1">
        {name}
      </span>
      {field && (
        <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-neutral-600 max-w-[200px] sm:max-w-[260px] line-clamp-2">
          {field}
        </span>
      )}
    </div>
  );
};

export const ClientsSection = ({ clients = [], loading = false }) => {
  const copy = useHomeCopy();
  const { isArabic } = useTranslation();
  const { containerRef, canScrollStart, canScrollEnd, scrollByStep } = useHorizontalScroll({
    itemCount: clients.length,
    gap: 32,
  });

  const showSkeletons = loading && clients.length === 0;

  if (!showSkeletons && clients.length === 0) return null;

  const showArrows = clients.length > 1;
  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5192D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafafa]';

  return (
    <section className="py-20 bg-[#fafafa] border-b border-neutral-200/80 select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">

        {/* Kicker Header */}
        <div className="text-start mb-8">
          <span className="text-neutral-600 font-bold text-xs tracking-[0.25em] uppercase">
            {copy.clients.label}
          </span>
        </div>

        {/* Logos Carousel with Navigation Arrows */}
        <div className="relative flex items-center">

          {/* Start Arrow Button */}
          {showArrows && (
            <button
              type="button"
              onClick={() => scrollByStep('start')}
              disabled={!canScrollStart}
              aria-label={copy.clients.prevAria}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all flex-shrink-0 shadow-xs z-10 me-4 ${focusRing} ${
                canScrollStart
                  ? 'border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-black cursor-pointer'
                  : 'border-neutral-200 bg-neutral-100 text-neutral-400 opacity-60 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            </button>
          )}

          {/* Scrollable Track */}
          <div
            ref={containerRef}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label={copy.clients.label}
            aria-busy={loading}
            className="flex items-center gap-8 sm:gap-16 lg:gap-20 overflow-x-auto no-scrollbar scroll-smooth w-full py-4 px-2"
          >
            {showSkeletons ? (
              <div role="status" className="flex items-center gap-8 shrink-0">
                {SKELETON_IDS.map((id) => (
                  <div
                    key={id}
                    aria-hidden="true"
                    className="h-10 w-28 rounded bg-neutral-200 animate-pulse flex-shrink-0"
                  />
                ))}
              </div>
            ) : (
              clients.map((client) => {
                const name = isArabic
                  ? client.nameAr || client.nameEn
                  : client.nameEn || client.nameAr;
                return (
                  <div
                    key={client.id}
                    title={name}
                    className="flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <ClientWordmark logo={client.logo} name={name} field={client.field} />
                  </div>
                );
              })
            )}
          </div>

          {/* End Arrow Button */}
          {showArrows && (
            <button
              type="button"
              onClick={() => scrollByStep('end')}
              disabled={!canScrollEnd}
              aria-label={copy.clients.nextAria}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all flex-shrink-0 shadow-xs z-10 ms-4 ${focusRing} ${
                canScrollEnd
                  ? 'border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-black cursor-pointer'
                  : 'border-neutral-200 bg-neutral-100 text-neutral-400 opacity-60 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          )}

        </div>

      </div>
    </section>
  );
};
