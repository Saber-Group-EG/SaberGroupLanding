import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';
import { useTranslation } from '../../i18n/hooks/useTranslation';
import { useHorizontalScroll } from './useHorizontalScroll';
import { getJobPositions } from '../../store/slices/jobPositionsSlice';

const SKELETON_COUNT = 4;

const extractStringFromRich = (val) => {
  if (val == null) return '';
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return val.map(extractStringFromRich).join(' ');
  if (typeof val === 'object') {
    if (typeof val.text === 'string') return val.text;
    if (val.ops && Array.isArray(val.ops)) {
      return val.ops.map((op) => (typeof op.insert === 'string' ? op.insert : '')).join('');
    }
    if (val.blocks && Array.isArray(val.blocks)) {
      return val.blocks.map((b) => extractStringFromRich(b.text || b.data || b)).join('\n');
    }
    if (typeof val.html === 'string') return val.html.replace(/<[^>]+>/g, '');
    return '';
  }
  return String(val);
};

const getLocalizedText = (field, isArabic) => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'object') {
    if (field.en != null || field.ar != null) {
      const localized = isArabic ? (field.ar || field.en || '') : (field.en || field.ar || '');
      return extractStringFromRich(localized);
    }
    return extractStringFromRich(field);
  }
  return '';
};

const isRegistrationOpen = (registrationEnd) =>
  !registrationEnd || new Date(registrationEnd).getTime() >= Date.now();

// Department names arrive as "Media Production Department" / "قسم الميديا
// برودكشن"; the badge shows the bare name. Never returns an empty string.
const formatDepartment = (name, isArabic) => {
  if (!name) return name;
  const source = String(name).trim();
  if (!source) return source;
  const stripped = isArabic
    ? source.replace(/^(?:قسم|القسم)\s+/, '').replace(/\s+(?:القسم)$/, '')
    : source.replace(/^department\s+of\s+/i, '').replace(/\s+(?:department|dept\.?)$/i, '');
  const result = stripped.trim();
  return result || source;
};

export const JoinTeamBlocksSection = ({ onOpenApply, onApply }) => {
  const copy = useHomeCopy();
  const dispatch = useDispatch();
  const { isArabic, mapEmploymentType, mapWorkArrangement } = useTranslation();
  const { positions, loading, error } = useSelector((state) => state.jobPositions);

  const sortedPositions = useMemo(() => {
    return [...positions].sort((a, b) => {
      const orderA = Number.isFinite(Number(a?.order)) ? Number(a.order) : Infinity;
      const orderB = Number.isFinite(Number(b?.order)) ? Number(b.order) : Infinity;
      return orderA - orderB;
    });
  }, [positions]);

  const showSkeleton = loading && sortedPositions.length === 0 && !error;
  const showEmpty = !showSkeleton && (error !== null || (!loading && sortedPositions.length === 0));
  const showCards = !showSkeleton && !showEmpty;
  const showArrows = showCards && sortedPositions.length > 1;

  // itemCount changes when the card track mounts so the scroll hook re-measures
  // the freshly attached element instead of a stale (unmounted) one.
  const {
    containerRef: sliderRef,
    canScrollStart,
    canScrollEnd,
    scrollByStep,
  } = useHorizontalScroll({ gap: 16, itemCount: showCards ? sortedPositions.length : 0 });

  useEffect(() => {
    if (positions.length === 0 && !loading && !error) {
      dispatch(getJobPositions());
    }
  }, [dispatch, positions.length, loading, error]);

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
            {showArrows && (
              <>
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
              </>
            )}

            <button
              onClick={() => onOpenApply()}
              className="text-xs font-bold uppercase tracking-wider text-[#E5192D] hover:text-white transition-colors cursor-pointer ms-2 flex items-center gap-1"
            >
              <span>{copy.joinTeam.generalApp}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {showSkeleton && (
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth no-scrollbar snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <div
                key={`position-skeleton-${index}`}
                className="w-[280px] sm:w-[310px] flex-shrink-0 snap-start bg-[#111418] rounded-2xl p-5 border border-neutral-800/90 animate-pulse shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="h-4 w-24 rounded-md bg-neutral-800 mb-3" />
                  <div className="h-4 w-3/4 rounded-md bg-neutral-800" />
                  <div className="h-3 w-1/2 rounded-md bg-neutral-800 mt-3" />
                </div>
                <div className="pt-3.5 mt-3.5 border-t border-neutral-800/80 flex items-center justify-between">
                  <div className="h-3 w-20 rounded-md bg-neutral-800" />
                  <div className="w-6 h-6 rounded-full bg-neutral-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {showEmpty && (
          <div className="rounded-2xl border border-neutral-800/90 bg-[#111418] p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="min-w-0">
              <h4 className="text-base sm:text-lg font-bold text-white">
                {copy.joinTeam.emptyTitle}
              </h4>
              <p className="text-sm text-neutral-400 leading-relaxed mt-1.5">
                {copy.joinTeam.emptyDesc}
              </p>
            </div>
            <button
              onClick={() => onOpenApply()}
              className="shrink-0 sm:ms-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#E5192D] bg-[#E5192D]/10 text-[#E5192D] hover:bg-[#E5192D] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>{copy.joinTeam.generalApp}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        )}

        {/* Compact Single-Row Scroll Cards */}
        {showCards && (
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth no-scrollbar snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {sortedPositions.map((position) => {
              const department = formatDepartment(
                getLocalizedText(position.departmentId?.name, isArabic),
                isArabic
              );
              const openNow = isRegistrationOpen(position.registrationEnd);
              const employmentLabel =
                mapEmploymentType(position.employmentType) || (isArabic ? 'دوام كامل' : 'Full-time');
              const workLabel = mapWorkArrangement(position.workArrangement);

              return (
                <div
                  key={position._id}
                  onClick={() => onApply(position)}
                  className="w-[280px] sm:w-[310px] flex-shrink-0 snap-start bg-[#111418] rounded-2xl p-5 border border-neutral-800/90 hover:border-[#E5192D] transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-md hover:-translate-y-1"
                >
                  <div>
                    {(department || openNow) && (
                      <div className="flex items-center justify-between gap-2 mb-3">
                        {department && (
                          <span className="min-w-0 flex-1 truncate text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                            {department}
                          </span>
                        )}
                        {openNow && (
                          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#E5192D]/40 bg-transparent px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#E5192D] whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E5192D]" />
                            {copy.joinTeam.openNow}
                          </span>
                        )}
                      </div>
                    )}

                    <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-[#E5192D] transition-colors leading-snug line-clamp-2 min-h-[44px]">
                      {getLocalizedText(position.title, isArabic)}
                    </h4>

                    <div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-2.5">
                      <span>{employmentLabel}</span>
                      {workLabel && (
                        <>
                          <span>•</span>
                          <span className="px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300">
                            {workLabel}
                          </span>
                        </>
                      )}
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
        )}

      </div>
    </section>
  );
};
