import { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';


export const AutoPlayingHeroVideo = () => {
  const copy = useHomeCopy();
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Reliable high-quality royalty-free cinematic real estate & architecture footage
  // Fallback to high-definition video CDN
  const videoSrc = "https://assets.mixkit.co/videos/preview/mixkit-sunset-over-a-swimming-pool-and-a-luxury-house-41586-large.mp4";

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted in some browsers until interaction
      });
    }
  }, []);

  const toggleSound = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMute = !isMuted;
      videoRef.current.muted = nextMute;
      setIsMuted(nextMute);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-neutral-950">
      {/* HTML5 Autoplaying Video element */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        onLoadedData={() => setVideoLoaded(true)}
        className={`w-full h-full object-cover object-center transform scale-105 transition-opacity duration-1000 ${
          videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        poster="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
      >
        <source src={videoSrc} type="video/mp4" />
        {/* Secondary fallback video */}
        <source src="https://assets.mixkit.co/videos/preview/mixkit-modern-architecture-house-in-the-sunset-42358-large.mp4" type="video/mp4" />
      </video>

      {/* Fallback & Poster under video while loading */}
      {!videoLoaded && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')"
          }}
        />
      )}

      {/* Cinematic Color Grade & Vignette Overlays for text legibility */}
      <div className="absolute inset-0 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-black/85 via-black/45 to-black/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

      {/* Live Video Indicator Badge & Quick Audio Toggle */}
      <div className="absolute top-6 end-6 sm:top-8 sm:end-8 z-20 flex items-center gap-2.5">
        <button
          onClick={toggleSound}
          title={isMuted ? copy.hero.unmuteTitle : copy.hero.muteTitle}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white backdrop-blur-md border border-white/20 text-xs font-semibold transition-all cursor-pointer shadow-lg active:scale-95"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-neutral-300" />
              <span className="text-[11px] uppercase tracking-wider hidden sm:inline">{copy.hero.soundOff}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#E5192D]" />
              <span className="text-[11px] uppercase tracking-wider hidden sm:inline text-white">{copy.hero.soundOn}</span>
            </>
          )}
        </button>
      </div>

      {/* Subtle cinema film grain texture */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:3px_3px]" />
    </div>
  );
};
