import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  LogoValora,
  LogoAsiaCosmetics,
  LogoCubic,
  LogoSeashell,
  LogoSwissotel,
  LogoZad,
} from './ClientLogos';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';
import { useHorizontalScroll } from './useHorizontalScroll';

export const ClientsSection = () => {
  const copy = useHomeCopy();
  const { containerRef, scrollByStep } = useHorizontalScroll({ gap: 48 });

  return (
    <section className="py-20 bg-[#fafafa] border-b border-neutral-200/80 select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">

        {/* Kicker Header */}
        <div className="text-start mb-8">
          <span className="text-neutral-400 font-bold text-xs tracking-[0.25em] uppercase">
            {copy.clients.label}
          </span>
        </div>

        {/* Logos Carousel with Navigation Arrows */}
        <div className="relative flex items-center">

          {/* Start Arrow Button */}
          <button
            onClick={() => scrollByStep('start')}
            aria-label={copy.clients.prevAria}
            className="w-10 h-10 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-600 hover:text-black transition-all flex-shrink-0 shadow-xs cursor-pointer z-10 me-4"
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          </button>

          {/* Scrollable Track */}
          <div
            ref={containerRef}
            className="flex items-center gap-12 sm:gap-16 lg:gap-20 overflow-x-auto no-scrollbar scroll-smooth w-full py-4 px-2"
          >
            <div className="flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              <LogoValora />
            </div>
            <div className="flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              <LogoAsiaCosmetics />
            </div>
            <div className="flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              <LogoCubic />
            </div>
            <div className="flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              <LogoSeashell />
            </div>
            <div className="flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              <LogoSwissotel />
            </div>
            <div className="flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              <LogoZad />
            </div>
            {/* Duplicated for seamless scrolling feel */}
            <div className="flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              <LogoValora />
            </div>
            <div className="flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              <LogoAsiaCosmetics />
            </div>
          </div>

          {/* End Arrow Button */}
          <button
            onClick={() => scrollByStep('end')}
            aria-label={copy.clients.nextAria}
            className="w-10 h-10 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-600 hover:text-black transition-all flex-shrink-0 shadow-xs cursor-pointer z-10 ms-4"
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>

        </div>

      </div>
    </section>
  );
};
