import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Pause, Play, Share2 } from 'lucide-react';
import { STORIES_DATA } from '../../content/home/saberData';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';


export const StoryViewerModal = ({
  initialStory,
  onClose,
}) => {
  const copy = useHomeCopy();
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialStory) {
      const idx = STORIES_DATA.findIndex((s) => s.id === initialStory.id);
      if (idx !== -1) return idx;
    }
    return 0;
  });
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentStory = STORIES_DATA[currentIndex];
  const currentStoryCopy = currentStory ? copy.stories.items[currentStory.id] : null;

  useEffect(() => {
    if (!initialStory || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < STORIES_DATA.length - 1) {
            setCurrentIndex((i) => i + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [initialStory, isPaused, currentIndex, onClose]);

  if (!initialStory || !currentStory || !currentStoryCopy) return null;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < STORIES_DATA.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-md select-none animate-in fade-in duration-200">

      {/* Navigation Arrows for desktop */}
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className="hidden md:flex absolute start-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer z-20"
      >
        <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
      </button>

      <button
        onClick={handleNext}
        className="hidden md:flex absolute end-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-colors cursor-pointer z-20"
      >
        <ChevronRight className="w-6 h-6 rtl:rotate-180" />
      </button>

      {/* Story Screen Card */}
      <div className="relative w-full max-w-[400px] h-[85vh] max-h-[760px] rounded-3xl overflow-hidden shadow-2xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between">

        {/* Real Photographic Background */}
        <div className="absolute inset-0">
          <img
            src={currentStory.imageUrl}
            alt={currentStory.title}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Top Scrim */}
        <div className="absolute top-0 start-0 end-0 h-28 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
        {/* Bottom Scrim */}
        <div className="absolute bottom-0 start-0 end-0 h-44 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />

        {/* Top Controls & Story Progress */}
        <div className="relative z-10 p-4">
          {/* Progress Bars */}
          <div className="flex items-center gap-1.5 mb-3">
            {STORIES_DATA.map((_, idx) => {
              let fill = '0%';
              if (idx < currentIndex) fill = '100%';
              else if (idx === currentIndex) fill = `${progress}%`;

              return (
                <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-100 ease-linear"
                    style={{ width: fill }}
                  />
                </div>
              );
            })}
          </div>

          {/* Header with avatar, author name, and close button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#E5192D] bg-neutral-900 flex items-center justify-center text-white font-bold text-xs">
                {currentStory.avatarText}
              </div>
              <div>
                <h4 className="text-white font-bold text-sm leading-tight">
                  {currentStory.title}
                </h4>
                <p className="text-white/70 text-xs font-medium">
                  {currentStoryCopy.category} • Saber Studio
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tap areas for mobile story advancing */}
        <div className="absolute inset-0 z-0 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-1/3 h-full cursor-pointer" onClick={() => setIsPaused(!isPaused)} />
          <div className="w-1/3 h-full cursor-pointer" onClick={handleNext} />
        </div>

        {/* Bottom Story Caption & Details */}
        <div className="relative z-10 p-5">
          <div className="p-4 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10">
            <span className="text-[#E5192D] font-bold text-[10px] tracking-wider uppercase mb-1 block">
              {copy.modals.storyViewer.spotlight}
            </span>
            <p className="text-white text-xs leading-relaxed font-normal">
              {currentStoryCopy.description}
            </p>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 text-[11px] text-white/60">
              <span className="font-medium">{copy.modals.storyViewer.shotOn}</span>
              <button
                onClick={() => alert(copy.modals.storyViewer.shareAlert)}
                className="flex items-center gap-1 text-white hover:text-[#E5192D] transition-colors cursor-pointer font-semibold"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copy.modals.storyViewer.share}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
