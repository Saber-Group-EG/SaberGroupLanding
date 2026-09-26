import { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Pause, Play, Share2, Volume2, VolumeX } from 'lucide-react';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';
import { getStoryInitials } from './useProjectStories';

export const StoryViewerModal = ({
  stories,
  initialStory,
  onClose,
}) => {
  const copy = useHomeCopy();
  // Dual-slot preload: two persistent <video> elements so advancing never
  // remounts a fresh element that re-downloads the ~30 MB material.
  const videoRefs = useRef([null, null]);
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialStory) {
      const idx = stories.findIndex((s) => s.id === initialStory.id);
      if (idx !== -1) return idx;
    }
    return 0;
  });
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // Two-phase playback: no <video> (and no download) until the viewer presses play.
  const [started, setStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  // Position within the current project's materials, alongside currentIndex.
  const [materialIndex, setMaterialIndex] = useState(0);
  // Which material each slot currently holds (or is fetching); null = empty.
  const [slots, setSlots] = useState([null, null]);
  const [activeSlot, setActiveSlot] = useState(0);

  const currentStory = stories[currentIndex];
  const currentMaterial = currentStory?.materials?.[materialIndex] ?? null;

  // Audible autoplay can still be rejected by strict browsers even after a
  // click, so retry muted instead of leaving the story stuck on the poster.
  useEffect(() => {
    if (!started) return;
    const video = videoRefs.current[activeSlot];
    if (!video) return;
    video.play().catch(() => {
      video.muted = true;
      setIsMuted(true);
      video.play().catch(() => {});
    });
  }, [started, currentIndex, materialIndex, activeSlot]);

  const handlePosterError = (event) => {
    const img = event.currentTarget;
    if (currentStory?.fallbackThumbnail && img.dataset.fallbackTried !== 'true') {
      img.dataset.fallbackTried = 'true';
      img.src = currentStory.fallbackThumbnail;
      return;
    }
    img.style.display = 'none';
  };

  const resetPlayback = () => {
    setProgress(0);
    setIsPaused(false);
  };

  // Slot planning runs only inside event handlers: this repo's eslint rejects
  // setState inside useEffect bodies.
  const planSlots = (pIdx, mIdx) => {
    const mat = stories[pIdx]?.materials?.[mIdx];
    const nextM = stories[pIdx]?.materials?.[mIdx + 1];
    const target = { pIdx, mIdx, url: mat?.videoUrl || null };
    const next = nextM ? { pIdx, mIdx: mIdx + 1, url: nextM.videoUrl || null } : null;
    const other = activeSlot === 0 ? 1 : 0;
    const holdsTarget = (slot) => Boolean(slot) && slot.pIdx === pIdx && slot.mIdx === mIdx;

    if (holdsTarget(slots[other])) {
      // Promote the already-buffered slot. The demoted element must be paused
      // explicitly: it loses its onPause handler this render, and if it is
      // repointed to null it unmounts while still playing.
      videoRefs.current[activeSlot]?.pause();
      const freed = [...slots];
      freed[activeSlot] = next;
      setSlots(freed);
      setActiveSlot(other);
      return;
    }
    if (holdsTarget(slots[activeSlot])) return;
    // Target not buffered (backwards jump or new project): refetch on the
    // active element — its poster attr covers the wait — and preload after it.
    const replan = [...slots];
    replan[activeSlot] = target;
    replan[other] = next;
    setSlots(replan);
  };

  const startPlayback = () => {
    if (started) return;
    planSlots(currentIndex, materialIndex);
    setStarted(true);
    setIsPaused(false);
  };

  const handlePrev = () => {
    if (!started) {
      startPlayback();
      return;
    }
    if (materialIndex > 0) {
      planSlots(currentIndex, materialIndex - 1);
      setMaterialIndex(materialIndex - 1);
      resetPlayback();
      return;
    }
    if (currentIndex === 0) return;
    const prevMaterials = stories[currentIndex - 1]?.materials || [];
    const prevMaterialIdx = Math.max(prevMaterials.length - 1, 0);
    planSlots(currentIndex - 1, prevMaterialIdx);
    setCurrentIndex(currentIndex - 1);
    setMaterialIndex(prevMaterialIdx);
    resetPlayback();
  };

  const handleNext = () => {
    if (!started) {
      startPlayback();
      return;
    }
    const materials = currentStory?.materials || [];
    if (materialIndex < materials.length - 1) {
      planSlots(currentIndex, materialIndex + 1);
      setMaterialIndex(materialIndex + 1);
      resetPlayback();
      return;
    }
    if (currentIndex >= stories.length - 1) {
      onClose();
      return;
    }
    planSlots(currentIndex + 1, 0);
    setCurrentIndex(currentIndex + 1);
    setMaterialIndex(0);
    resetPlayback();
  };

  const togglePause = () => {
    if (!started) {
      startPlayback();
      return;
    }
    const video = videoRefs.current[activeSlot];
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRefs.current[activeSlot];
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    setProgress((video.currentTime / video.duration) * 100);
  };

  if (!initialStory || !currentStory) return null;

  const posterSrc =
    currentMaterial?.thumbnail || currentStory.thumbnail || currentStory.fallbackThumbnail || '';
  // The <img> layer only backs the viewer when nothing is playing yet or the
  // active slot has no video; otherwise the <video> covers (its poster attr
  // shows during any buffering).
  const showPosterLayer = !started || !slots[activeSlot]?.url;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-md select-none animate-in fade-in duration-200">

      {/* Navigation Arrows for desktop */}
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0 && materialIndex === 0}
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

        {/* Story Background: poster until started, then the two preload slots */}
        <div className="absolute inset-0">
          {started
            ? [0, 1].map((i) => {
                const slot = slots[i];
                if (!slot?.url) return null;
                const active = i === activeSlot;
                // Inactive slot stays 1px in the DOM instead of display:none:
                // hiding it lets the browser suspend the preload buffering.
                return (
                  <video
                    key={`slot-${i}`}
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    src={slot.url}
                    poster={currentMaterial?.thumbnail || currentStory.thumbnail || undefined}
                    preload="auto"
                    playsInline
                    muted={active ? isMuted : true}
                    autoPlay={active}
                    className={
                      active
                        ? 'w-full h-full object-cover object-center'
                        : 'absolute w-px h-px opacity-0 pointer-events-none'
                    }
                    onTimeUpdate={active ? handleTimeUpdate : undefined}
                    onEnded={active ? handleNext : undefined}
                    onPlay={active ? () => setIsPaused(false) : undefined}
                    onPause={active ? () => setIsPaused(true) : undefined}
                  />
                );
              })
            : null}
          {showPosterLayer && posterSrc ? (
            <img
              src={posterSrc}
              alt={currentStory.title}
              className="w-full h-full object-cover object-center"
              onError={handlePosterError}
            />
          ) : null}
        </div>

        {/* Top Scrim */}
        <div className="absolute top-0 start-0 end-0 h-28 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
        {/* Bottom Scrim */}
        <div className="absolute bottom-0 start-0 end-0 h-44 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />

        {/* Phase 1 only: nothing plays until this is pressed */}
        {!started ? (
          <button
            onClick={startPlayback}
            aria-label="Play"
            className="absolute top-0 bottom-0 start-0 end-0 m-auto w-16 h-16 rounded-full bg-[#E5192D] hover:bg-[#c81424] text-white shadow-2xl flex items-center justify-center transition-all active:scale-95 cursor-pointer z-20"
          >
            <Play className="w-7 h-7 fill-white translate-x-0.5" />
          </button>
        ) : null}

        {/* Top Controls & Story Progress */}
        <div className="relative z-10 p-4">
          {/* Progress Bars: one segment per material of the current project */}
          <div className="flex items-center gap-1.5 mb-3">
            {(currentStory.materials || []).map((material, materialIdx) => {
              let fill = '0%';
              if (materialIdx < materialIndex) fill = '100%';
              else if (materialIdx === materialIndex) fill = `${progress}%`;

              return (
                <div key={material.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-100 ease-linear"
                    style={{ width: fill }}
                  />
                </div>
              );
            })}
          </div>

          {/* Header with avatar, author name, and controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full border-2 border-[#E5192D] bg-neutral-900 flex items-center justify-center text-white font-bold text-xs">
                {getStoryInitials(currentStory.title)}
                {currentStory.avatarImage ? (
                  <img
                    src={currentStory.avatarImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
              </div>
              <div>
                <h4 className="text-white font-bold text-sm leading-tight">
                  {currentStory.title}
                </h4>
                <p className="text-white/70 text-xs font-medium">
                  {currentStory.category} • Saber Studio
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {started ? (
                <button
                  onClick={togglePause}
                  aria-label={isPaused ? 'Play' : 'Pause'}
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
                </button>
              ) : null}
              {started ? (
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              ) : null}
              <button
                onClick={onClose}
                aria-label="Close"
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
          <div className="w-1/3 h-full cursor-pointer" onClick={togglePause} />
          <div className="w-1/3 h-full cursor-pointer" onClick={handleNext} />
        </div>

        {/* Bottom Story Caption & Details */}
        <div className="relative z-10 p-5">
          <div className="p-4 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10">
            <span className="text-[#E5192D] font-bold text-[10px] tracking-wider uppercase mb-1 block">
              {copy.modals.storyViewer.spotlight}
            </span>
            <p className="text-white text-xs leading-relaxed font-normal">
              {currentMaterial?.description || currentStory.description}
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
