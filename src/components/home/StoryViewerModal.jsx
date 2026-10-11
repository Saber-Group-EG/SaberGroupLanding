import { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Pause, Play, Share2, Volume2, VolumeX, LoaderCircle } from 'lucide-react';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';
import { getStoryInitials } from './useProjectStories';
import {
  requestVideoPrefetch,
  nextStoryVideoUrls,
  pauseVideoWarmup,
  resumeVideoWarmup,
} from '../../utils/storyVideoPrefetch';

// One recipe for what each slot holds — the selected material plus the one
// behind it. The useState initializer for `slots` and planSlots both call it
// so they can never disagree: if the opened story's plan differed from
// planSlots(initialIndex, 0), the first play press would refetch a video that
// is already sitting in the DOM.
const buildSlotPlan = (storyList, pIdx, mIdx) => {
  const mat = storyList[pIdx]?.materials?.[mIdx];
  const nextM = storyList[pIdx]?.materials?.[mIdx + 1];
  const toSlot = (material, slotMIdx) => ({
    pIdx,
    mIdx: slotMIdx,
    // Play the small `-story` rendition when it exists; fullUrl keeps the
    // original so an onError can repoint the element at the file that is
    // known to be there (until the renditions are uploaded, every slot is
    // effectively on the original).
    url: material?.storyVideoUrl || material?.videoUrl || null,
    fullUrl: material?.videoUrl || null,
  });
  return [toSlot(mat, mIdx), nextM ? toSlot(nextM, mIdx + 1) : null];
};

export const StoryViewerModal = ({
  stories,
  initialStory,
  onClose,
}) => {
  const copy = useHomeCopy();
  // Dual-slot preload: two persistent <video> elements so advancing never
  // remounts a fresh element that re-downloads the material video (the
  // original upload is tens of MB when the rendition is still missing).
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
  // Two-phase playback: the opened story's videos buffer right away behind the
  // poster, but nothing plays until the viewer presses play — starting a large
  // download only at that moment is what made the play press stall.
  const [started, setStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  // Position within the current project's materials, alongside currentIndex.
  const [materialIndex, setMaterialIndex] = useState(0);
  // Which material each slot currently holds (or is fetching); null = empty.
  // Seeded from the story opened this render (currentIndex was derived from
  // initialStory above), i.e. exactly planSlots(initialIndex, 0), so the
  // current video — and the one after it — start downloading during the
  // poster phase instead of after the play press.
  const [slots, setSlots] = useState(() => buildSlotPlan(stories, currentIndex, 0));
  const [activeSlot, setActiveSlot] = useState(0);
  // True while the active slot is starved for data; drives the spinner. Only
  // meaningful once started — the render gates on it, not the event handlers.
  const [isBuffering, setIsBuffering] = useState(false);

  const currentStory = stories[currentIndex];
  const currentMaterial = currentStory?.materials?.[materialIndex] ?? null;
  // Tracked separately so the play effect can re-enter after a fallback swap
  // (rendition 404 → original) reloads the active element.
  const activeVideoUrl = slots[activeSlot]?.url ?? null;

  // Audible autoplay can still be rejected by strict browsers (an onEnded
  // advance carries no user activation), so retry muted — but never flip the
  // user's preference: onPlay restores it, which needs no gesture.
  // isPaused is a guard, not a trigger: a src swap reload must resume a story
  // that was playing, and must leave a story the viewer paused alone.
  useEffect(() => {
    if (!started || isPaused) return;
    const video = videoRefs.current[activeSlot];
    if (!video) return;
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }, [started, isPaused, currentIndex, materialIndex, activeSlot, activeVideoUrl]);

  // Muting the property directly bypasses React's declarative prop (it only
  // re-applies when the prop value changes), so sync every slot here —
  // without calling play(), or a mute toggle would resume a paused story.
  useEffect(() => {
    if (!started) return;
    videoRefs.current.forEach((video, i) => {
      if (video) video.muted = i === activeSlot ? isMuted : true;
    });
  }, [started, isMuted, activeSlot]);

  // The idle warm-up downloads tens of MB underneath the player; hold it while
  // a story is actually open. This component stays mounted (and renders null)
  // whenever nothing is selected, so the guard is what keeps the warm-up alive.
  useEffect(() => {
    if (!initialStory) return undefined;
    pauseVideoWarmup();
    return () => {
      resumeVideoWarmup();
    };
  }, [initialStory]);

  // Prefetch deliberately targets the videos *beyond* the dual slots above so
  // the player and the service worker never download the same file twice.
  useEffect(() => {
    if (!started) return;
    requestVideoPrefetch(nextStoryVideoUrls(stories, currentIndex, materialIndex));
  }, [started, currentIndex, materialIndex, stories]);

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

  // A missing rendition fires onError fast (404 in milliseconds), so repoint
  // THAT slot at the original and let the same element retry it — the poster
  // attr covers the reload. url === fullUrl means the original itself failed,
  // and returning early keeps the element from looping on a dead file; the
  // spinner is deliberately untouched because the swap re-fires
  // waiting/canplay and those handlers resolve isBuffering by themselves.
  const handleSlotError = (slotIndex) => {
    setSlots((prev) => {
      const slot = prev[slotIndex];
      if (!slot?.fullUrl || slot.url === slot.fullUrl) return prev;
      const fallback = [...prev];
      fallback[slotIndex] = { ...slot, url: slot.fullUrl };
      return fallback;
    });
  };

  // Slot planning runs only inside event handlers: this repo's eslint rejects
  // setState inside useEffect bodies. Branches that move slots also clear
  // isBuffering: the swap re-fires loadstart/canPlay on the new active video,
  // so seeding "not stalling" is both accurate and cheap — while the
  // holdsTarget early return (no slot moved) deliberately keeps the state, so
  // startPlayback inherits whatever the poster phase already learned.
  const planSlots = (pIdx, mIdx) => {
    const [target, next] = buildSlotPlan(stories, pIdx, mIdx);
    const other = activeSlot === 0 ? 1 : 0;
    // Identity is pIdx/mIdx only: a slot that already fell back to the
    // original is still the same material and must not read as a miss.
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
      setIsBuffering(false);
      return;
    }
    if (holdsTarget(slots[activeSlot])) return;
    // Target not buffered (backwards jump or new project): refetch on the
    // active element — its poster attr covers the wait — and preload after it.
    const replan = [...slots];
    replan[activeSlot] = target;
    replan[other] = next;
    setSlots(replan);
    setIsBuffering(false);
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
      video.muted = isMuted;
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    } else {
      video.pause();
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRefs.current[activeSlot];
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    setProgress((video.currentTime / video.duration) * 100);
  };

  // Only the active slot reports stall/feed events, matching how onTimeUpdate
  // and friends are attached: the hidden slot's hiccups are not the viewer's.
  const showBuffering = () => setIsBuffering(true);
  const hideBuffering = () => setIsBuffering(false);

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

        {/* Story Background: the two preload slots mount as soon as the story
            is opened, so the poster phase already buffers the current video
            (and the one behind it); autoPlay stays gated on `started` so the
            play button remains the only way to start playback. */}
        <div className="absolute inset-0">
          {[0, 1].map((i) => {
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
                onError={() => handleSlotError(i)}
                poster={currentMaterial?.thumbnail || currentStory.thumbnail || undefined}
                preload="auto"
                playsInline
                muted={active ? isMuted : true}
                autoPlay={active && started}
                className={
                  active
                    ? 'w-full h-full object-cover object-center'
                    : 'absolute w-px h-px opacity-0 pointer-events-none'
                }
                onTimeUpdate={active ? handleTimeUpdate : undefined}
                onEnded={
                  active
                    ? () => {
                        // Ending means there is nothing left to buffer, and the
                        // advance must not inherit this slot's spinner state.
                        setIsBuffering(false);
                        handleNext();
                      }
                    : undefined
                }
                onWaiting={active ? showBuffering : undefined}
                onStalled={active ? showBuffering : undefined}
                onLoadStart={active ? showBuffering : undefined}
                onPlaying={active ? hideBuffering : undefined}
                onCanPlay={active ? hideBuffering : undefined}
                onPlay={
                  active
                    ? (event) => {
                        // A muted fallback play must not leave the story
                        // silent: unmuting a playing element is always
                        // allowed, no user activation required.
                        event.currentTarget.muted = isMuted;
                        setIsPaused(false);
                      }
                    : undefined
                }
                onPause={active ? () => setIsPaused(true) : undefined}
              />
            );
          })}
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

        {/* Spinner for the active slot stalling after started; z-[5] keeps it
            above the video (auto z) but below the header/caption layers (z-10)
            and it never steals a tap from the story's tap areas. */}
        {started && isBuffering ? (
          <div className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none">
            <LoaderCircle className="w-10 h-10 text-white animate-spin" aria-hidden="true" />
          </div>
        ) : null}

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

          {/* Header with avatar, author name, and controls.
              shrink-0 on the circle + min-w-0 on the text: once started, the
              pause/mute buttons and a wrapped title shrink this row, and without
              those two the 40px circle is the item that flexbox crushes. */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 shrink-0 rounded-full border-2 border-[#E5192D] bg-neutral-900 flex items-center justify-center text-white font-bold text-xs">
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
              <div className="min-w-0">
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
