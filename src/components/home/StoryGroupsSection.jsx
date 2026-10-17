import { useEffect, useRef } from 'react';
import { ChevronRight, ArrowRight, Play } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';
import { useHorizontalScroll } from './useHorizontalScroll';
import { getStoryInitials } from './useProjectStories';

const SKELETON_COUNT = 6;

export const StoryGroupsSection = ({ groups, loading, error, onSelectGroup, fallback }) => {
  const copy = useHomeCopy();
  // A failed group fetch silently degrades to the legacy stories block, so the
  // toast is the only signal something went wrong; the ref keeps a retry loop
  // from stacking the same message on every mount cycle.
  const errorToastShownRef = useRef(false);

  const isLoading = loading && groups.length === 0;
  const hasGroups = groups.length > 0;

  useEffect(() => {
    if (!error || loading || hasGroups || errorToastShownRef.current) return;
    errorToastShownRef.current = true;
    toast.error(copy.storyGroups.error);
  }, [error, loading, hasGroups, copy]);

  // Single fallback attempt, then the placeholder stays visible: switching the
  // src twice would otherwise risk looping on a failing URL.
  const handleThumbnailError = (event, group) => {
    const img = event.currentTarget;
    if (group.fallbackThumbnail && img.dataset.fallbackTried !== 'true') {
      img.dataset.fallbackTried = 'true';
      img.src = group.fallbackThumbnail;
      return;
    }
    img.style.display = 'none';
  };

  // itemCount changes when the track swaps between skeleton and real cards so
  // the scroll hook re-measures the freshly attached element.
  const { containerRef, scrollByStep } = useHorizontalScroll({
    gap: 16,
    itemCount: isLoading ? 0 : groups.length,
  });

  if (!loading && !hasGroups) return fallback;

  return (
    <section id="story-reels" className="py-20 bg-white border-b border-neutral-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* Start Column: Heading & Button */}
          <div className="lg:col-span-3 flex flex-col justify-between pt-1">
            <div>
              <h2 className="text-[#111315] font-black text-4xl sm:text-5xl leading-[1.05] tracking-tight uppercase mb-3">
                {copy.storyGroups.heading.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm font-normal leading-relaxed mb-8 max-w-xs">
                {copy.storyGroups.intro}
              </p>
            </div>

            <div>
              <button
                onClick={() => onSelectGroup(groups[0])}
                disabled={!hasGroups}
                className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-neutral-800 hover:border-black hover:bg-neutral-900 hover:text-white text-neutral-900 font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:pointer-events-none"
              >
                <span>{copy.storyGroups.viewAll}</span>
                <ArrowRight className="w-4 h-4 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* End Column: Reels Carousel */}
          <div className="lg:col-span-9 relative">

            {/* Scrollable Track */}
            <div
              ref={containerRef}
              className="flex items-center gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1 pe-12"
            >
              {isLoading
                ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                    <div
                      key={`story-group-skeleton-${index}`}
                      className="flex-shrink-0 w-[164px] sm:w-[180px] aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/60 animate-pulse p-3 flex flex-col justify-end gap-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-neutral-300" />
                      <div className="h-3 w-20 rounded bg-neutral-300" />
                      <div className="h-2 w-14 rounded bg-neutral-300" />
                    </div>
                  ))
                : groups.map((group) => (
                    <div
                      key={group.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`${copy.storyGroups.openStory}: ${group.title}`}
                      onClick={() => onSelectGroup(group)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          onSelectGroup(group);
                        }
                      }}
                      className="group relative flex-shrink-0 w-[164px] sm:w-[180px] aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform motion-safe:hover:-translate-y-1 bg-neutral-950 select-none border border-neutral-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5192D] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      {/* Placeholder beneath the image: shows when there is no
                          thumbnail or the chosen URL fails to load. The faint
                          play badge keeps that state reading as a deliberate
                          "no preview" reel card rather than a broken one
                          (group B's cover is extension-less and may fail the
                          image proxy). */}
                      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-white/5 border border-white/15 flex items-center justify-center">
                            <Play className="w-6 h-6 text-white/30" />
                          </div>
                        </div>
                      </div>

                      {/* Real Photographic Reel Cover — images only; these
                          originals are tens of MB and must never mount a
                          <video> inside the grid */}
                      {group.thumbnail ? (
                        <img
                          src={group.thumbnail}
                          alt={group.title}
                          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 motion-safe:group-hover:scale-105"
                          loading="lazy"
                          onError={(event) => handleThumbnailError(event, group)}
                        />
                      ) : null}

                      {/* Top Reel Progress Bars: one segment per video in the group */}
                      <div className="absolute top-3 start-3 end-3 flex items-center gap-1 z-10">
                        {(group.materials || []).map((material) => (
                          <div
                            key={material.id}
                            className="h-[2px] flex-1 rounded-full bg-white/40 group-hover:bg-white transition-colors"
                          />
                        ))}
                      </div>

                      {/* Gradient Scrims */}
                      <div className="absolute top-0 start-0 end-0 h-16 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 start-0 end-0 h-32 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />

                      {/* Bottom Avatar & Information */}
                      <div className="absolute bottom-3 start-3 end-3 flex items-center gap-2.5 z-10">
                        {/* Circle Avatar: cover art on top, initials underneath as fallback */}
                        <div className="relative w-8 h-8 rounded-full border-2 border-white/90 bg-neutral-900/90 shadow-md flex items-center justify-center flex-shrink-0 text-white font-bold text-[9px] uppercase tracking-tighter">
                          {getStoryInitials(group.title)}
                          {group.avatarImage ? (
                            <img
                              src={group.avatarImage}
                              alt=""
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover rounded-full"
                              onError={(event) => {
                                event.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : null}
                        </div>

                        {/* Text Details */}
                        <div className="flex flex-col min-w-0">
                          <span className="text-white/70 text-[10px] font-semibold uppercase tracking-wider truncate leading-tight">
                            {copy.storyGroups.createdBy}
                          </span>
                          <span className="text-white font-bold text-xs tracking-tight truncate leading-tight group-hover:text-[#E5192D] transition-colors">
                            {group.title}
                          </span>
                          <span className="text-white/80 text-[10px] font-medium truncate leading-tight mt-0.5">
                            {group.subtitle ||
                              `${copy.storyGroups.reelLabel} · ${group.videosCount} ${copy.storyGroups.videosLabel}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>

            {/* End Scroll Arrow Button */}
            <button
              onClick={() => scrollByStep('end')}
              aria-label={copy.storyGroups.scrollNext}
              className="absolute -end-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-xl border border-neutral-200 text-neutral-800 flex items-center justify-center hover:bg-neutral-50 motion-safe:hover:scale-105 transition-all z-20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5192D] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
