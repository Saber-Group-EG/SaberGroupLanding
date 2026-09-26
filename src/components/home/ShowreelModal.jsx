import { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';


const SCENE_META = [
  {
    id: 'showreel-valora',
    imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'showreel-asia',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'showreel-seashell',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'showreel-swissotel',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'showreel-studio',
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=85',
  },
];

export const ShowreelModal = ({ isOpen, onClose }) => {
  const copy = useHomeCopy();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [progress, setProgress] = useState(0);

  const sceneCount = SCENE_META.length;

  useEffect(() => {
    if (!isOpen) return;

    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentScene((s) => (s + 1) % sceneCount);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, sceneCount]);

  if (!isOpen) return null;

  const activeScene = SCENE_META[currentScene];
  const activeSceneTitle = copy.modals.showreel.scenes[activeScene.id];
  const sceneCounter = copy.modals.showreel.sceneCounter
    .replace('{n}', currentScene + 1)
    .replace('{total}', sceneCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col">

        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900/90 border-b border-neutral-800 z-10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5192D] animate-ping" />
            <span className="text-white font-bold text-xs sm:text-sm tracking-widest uppercase">
              {copy.modals.showreel.barTitle}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Screen Simulation */}
        <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
          {/* Active Scene Content */}
          <div className="absolute inset-0 transition-all duration-700">
            <img
              src={activeScene.imageUrl}
              alt={activeSceneTitle}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Letterbox Bars & Anamorphic Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

          {/* Center Play/Pause Overlay on Hover */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-black/50 hover:bg-[#E5192D] text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer z-10"
          >
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-white ltr:translate-x-0.5 rtl:-translate-x-0.5" />}
          </button>

          {/* Scene Title Overlay */}
          <div className="absolute bottom-16 start-6 z-10">
            <span className="px-3 py-1 rounded-sm bg-black/60 backdrop-blur-md text-[#E5192D] font-bold text-[10px] tracking-widest uppercase mb-2 inline-block">
              {sceneCounter}
            </span>
            <h4 className="text-white text-lg sm:text-xl font-bold tracking-tight drop-shadow-md">
              {activeSceneTitle}
            </h4>
          </div>
        </div>

        {/* Bottom Video Controller Bar */}
        <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex flex-col gap-3">
          {/* Progress scrubber */}
          <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden cursor-pointer">
            <div
              className="bg-[#E5192D] h-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:text-[#E5192D] transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <button
                onClick={() => {
                  setProgress(0);
                  setCurrentScene(0);
                }}
                className="hover:text-white transition-colors cursor-pointer"
                title={copy.modals.showreel.restart}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="tabular-nums text-neutral-500 font-medium">
                0{currentScene + 1}:{(progress * 0.6).toFixed(0).padStart(2, '0')} / 05:00
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-bold text-neutral-300">
                4K UHD 60FPS
              </span>
              <button
                onClick={() => {}}
                className="hover:text-white transition-colors cursor-pointer p-1"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
