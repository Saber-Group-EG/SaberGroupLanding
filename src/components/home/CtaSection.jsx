import { ArrowRight } from 'lucide-react';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';

export const CtaSection = ({ onOpenContact }) => {
  const copy = useHomeCopy();

  return (
    <section className="py-20 bg-[#0e1114] text-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Start Column: Heading */}
          <div className="lg:col-span-6">
            <h2 className="text-white font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.1] uppercase">
              {copy.cta.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </div>

          {/* Center Vertical Divider (visible on desktop) */}
          <div className="hidden lg:block lg:col-span-1 h-20 w-[1px] bg-neutral-800 mx-auto" />

          {/* End Column: Copy & Button */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xs">
              {copy.cta.text}
            </p>

            <button
              onClick={onOpenContact}
              className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#E5192D] hover:bg-[#c81424] text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-150 shadow-lg shadow-red-600/30 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span>{copy.cta.button}</span>
              <ArrowRight className="w-4 h-4 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
