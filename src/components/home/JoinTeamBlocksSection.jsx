import { ArrowRight, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';
import { useHorizontalScroll } from './useHorizontalScroll';


const JOB_META = [
  { id: 'job-cinematographer', featured: true },
  { id: 'job-editor-colorist', featured: true },
  { id: 'job-art-director', featured: false },
  { id: 'job-fullstack', featured: false },
  { id: 'job-media-buyer', featured: false },
  { id: 'job-social-strategist', featured: false },
];


export const JoinTeamBlocksSection = ({ onOpenApply }) => {
  const copy = useHomeCopy();
  const {
    containerRef: sliderRef,
    canScrollStart,
    canScrollEnd,
    scrollByStep,
  } = useHorizontalScroll({ gap: 16 });

  return (
    <section id="careers" className="py-16 bg-[#0c0e12] text-white border-t border-neutral-900 scroll-mt-16 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">

        {/* Sleek Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-neutral-400 font-bold text-xs tracking-[0.25em] uppercase mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5192D]" />
              <span>{copy.joinTeam.eyebrow}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              {copy.joinTeam.heading}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollByStep('start')}
              disabled={!canScrollStart}
              aria-label={copy.joinTeam.prev}
              className={`w-9 h-9 rounded-full border border-neutral-800 flex items-center justify-center transition-all ${
                canScrollStart
                  ? 'bg-neutral-900 text-white hover:border-[#E5192D] hover:bg-[#E5192D] cursor-pointer'
                  : 'bg-neutral-900/50 text-neutral-600 cursor-not-allowed opacity-40'
              }`}
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            </button>

            <button
              onClick={() => scrollByStep('end')}
              disabled={!canScrollEnd}
              aria-label={copy.joinTeam.next}
              className={`w-9 h-9 rounded-full border border-neutral-800 flex items-center justify-center transition-all ${
                canScrollEnd
                  ? 'bg-neutral-900 text-white hover:border-[#E5192D] hover:bg-[#E5192D] cursor-pointer'
                  : 'bg-neutral-900/50 text-neutral-600 cursor-not-allowed opacity-40'
              }`}
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>

            <button
              onClick={() => onOpenApply()}
              className="text-xs font-bold uppercase tracking-wider text-[#E5192D] hover:text-white transition-colors cursor-pointer ms-2 flex items-center gap-1"
            >
              <span>{copy.joinTeam.generalApp}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Compact Single-Row Scroll Cards */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto pb-4 scroll-smooth no-scrollbar snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {JOB_META.map((job) => {
            const jobCopy = copy.joinTeam.jobs[job.id];
            return (
              <div
                key={job.id}
                onClick={() => onOpenApply(jobCopy.title)}
                className="w-[280px] sm:w-[310px] flex-shrink-0 snap-start bg-[#111418] rounded-2xl p-5 border border-neutral-800/90 hover:border-[#E5192D] transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-md hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-neutral-900 text-neutral-400 border border-neutral-800">
                      {jobCopy.department}
                    </span>
                    {job.featured && (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-widest bg-[#E5192D]/15 text-[#E5192D]">
                        {copy.joinTeam.openNow}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-[#E5192D] transition-colors leading-snug line-clamp-2 min-h-[44px]">
                    {jobCopy.title}
                  </h4>

                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-2.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#E5192D]" />
                      {jobCopy.location}
                    </span>
                    <span>•</span>
                    <span>{jobCopy.experience}</span>
                    <span>•</span>
                    <span>{jobCopy.type}</span>
                  </div>
                </div>

                <div className="pt-3.5 mt-3.5 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 group-hover:text-white transition-colors">
                    {copy.joinTeam.applyNow}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-neutral-900 group-hover:bg-[#E5192D] group-hover:text-white text-neutral-400 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
