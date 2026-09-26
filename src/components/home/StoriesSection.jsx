import { ChevronRight, ArrowRight } from 'lucide-react';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';
import { useHorizontalScroll } from './useHorizontalScroll';
import { getStoryInitials } from './useProjectStories';

const SKELETON_COUNT = 6;

export const StoriesSection = ({
  stories,
  loading,
  onSelectStory,
  onViewAllStories,
}) => {
  const copy = useHomeCopy();

  // Single fallback attempt, then the placeholder stays visible: switching the
  // src twice would otherwise risk looping on a failing URL.
  const handleThumbnailError = (event, story) => {
    const img = event.currentTarget;
    if (story.fallbackThumbnail && img.dataset.fallbackTried !== 'true') {
      img.dataset.fallbackTried = 'true';
      img.src = story.fallbackThumbnail;
      return;
    }
    img.style.display = 'none';
  };

  const isLoading = loading && stories.length === 0;
  const hasStories = stories.length > 0;

  // itemCount changes when the track swaps between skeleton and real cards so
  // the scroll hook re-measures the freshly attached element.
  const { containerRef, scrollByStep } = useHorizontalScroll({
    gap: 16,
    itemCount: isLoading ? 0 : stories.length,
  });

  if (!isLoading && !hasStories) return null;

  return (
    <section id="stories" className="py-20 bg-white border-b border-neutral-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* Start Column: Heading & Button */}
          <div className="lg:col-span-3 flex flex-col justify-between pt-1">
            <div>
              <h2 className="text-[#111315] font-black text-4xl sm:text-5xl leading-[1.05] tracking-tight uppercase mb-3">
                {copy.stories.heading.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm font-normal leading-relaxed mb-8 max-w-xs">
                {copy.stories.intro}
              </p>
            </div>

            <div>
              <button
                onClick={onViewAllStories}
                className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-neutral-800 hover:border-black hover:bg-neutral-900 hover:text-white text-neutral-900 font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                <span>{copy.stories.viewAll}</span>
                <ArrowRight className="w-4 h-4 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* End Column: Stories Carousel */}
          <div className="lg:col-span-9 relative">

            {/* Scrollable Track */}
            <div
              ref={containerRef}
              className="flex items-center gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1 pe-12"
            >
              {isLoading
                ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                    <div
                      key={`story-skeleton-${index}`}
                      className="flex-shrink-0 w-[170px] sm:w-[185px] h-[290px] sm:h-[315px] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/60 animate-pulse p-3 flex flex-col justify-end gap-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-neutral-300" />
                      <div className="h-3 w-20 rounded bg-neutral-300" />
                      <div className="h-2 w-14 rounded bg-neutral-300" />
                    </div>
                  ))
                : stories.map((story) => (
                    <div
                      key={story.id}
                      onClick={() => onSelectStory(story)}
                      className="group relative flex-shrink-0 w-[170px] sm:w-[185px] h-[290px] sm:h-[315px] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-neutral-950 select-none border border-neutral-200/60"
                    >
                      {/* Placeholder beneath the image: shows when there is no
                          thumbnail or the chosen URL fails to load */}
                      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950" />

                      {/* Real Photographic Story Background */}
                      {story.thumbnail ? (
                        <img
                          src={story.thumbnail}
                          alt={story.title}
                          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => handleThumbnailError(e, story)}
                        />
                      ) : null}

                      {/* Top Story Progress Bars: one segment per material */}
                      <div className="absolute top-3 start-3 end-3 flex items-center gap-1 z-10">
                        {(story.materials || []).map((material) => (
                          <div
                            key={material.id}
                            className="h-[2px] flex-1 bg-white/40 rounded-full overflow-hidden"
                          >
                            <div className="h-full w-full bg-white group-hover:bg-[#E5192D] transition-colors" />
                          </div>
                        ))}
                      </div>

                      {/* Gradient Scrims */}
                      <div className="absolute top-0 start-0 end-0 h-16 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 start-0 end-0 h-32 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />

                      {/* Bottom Avatar & Information */}
                      <div className="absolute bottom-3 start-3 end-3 flex items-center gap-2.5 z-10">
                        {/* Circle Avatar: cover art on top, initials underneath as fallback */}
                        <div className="relative w-8 h-8 rounded-full border-2 border-white/90 bg-neutral-900/90 shadow-md flex items-center justify-center flex-shrink-0 text-white font-bold text-[9px] uppercase tracking-tighter">
                          {getStoryInitials(story.title)}
                          {story.avatarImage ? (
                            <img
                              src={story.avatarImage}
                              alt=""
                              className="absolute inset-0 w-full h-full object-cover rounded-full"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : null}
                        </div>

                        {/* Text Details */}
                        <div className="flex flex-col min-w-0">
                          <span className="text-white font-bold text-xs tracking-tight truncate leading-tight group-hover:text-[#E5192D] transition-colors">
                            {story.title}
                          </span>
                          <span className="text-white/80 text-[10px] font-medium truncate leading-tight mt-0.5">
                            {story.subtitle}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>

            {/* End Scroll Arrow Button */}
            <button
              onClick={() => scrollByStep('end')}
              aria-label={copy.stories.scrollNext}
              className="absolute -end-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-xl border border-neutral-200 text-neutral-800 flex items-center justify-center hover:bg-neutral-50 hover:scale-105 transition-all z-20 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
