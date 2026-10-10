import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Play, Pause, ArrowRight, Sparkles, Clock, MapPin, X } from 'lucide-react';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';


const LATEST_WORKS = [
  {
    id: 'latest-valora-film',
    title: 'Valora Luxury Living',
    industryKey: 'real-estate',
    clientName: 'Valora Developments',
    year: '2025',
    videoDuration: '02:45',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=980&q=60',
  },
  {
    id: 'latest-asia-luxe',
    title: 'Asia Skin & Radiance Serum',
    industryKey: 'beauty',
    clientName: 'Asia Beauty Care',
    year: '2025',
    videoDuration: '01:15',
    coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=840&q=60',
  },
  {
    id: 'latest-seashell-summer',
    title: 'Seashell Bohemian Beach Club',
    industryKey: 'hospitality',
    clientName: 'Seashell Hospitality',
    year: '2024 - 2025',
    videoDuration: '03:10',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=840&q=60',
  },
  {
    id: 'latest-swissotel-legacy',
    title: 'Swissôtel Sanctuary & Heritage',
    industryKey: 'hospitality',
    clientName: 'Swissôtel Hotels & Resorts',
    year: '2024',
    videoDuration: '02:56',
    video: 'https://upload.ats.sabergroup-eg.com/Markting/landing/video/resized.mp4',
    coverImage: '/hero/2.jpg',
  },
];

// Thumbnail-first: the <video> element is only mounted after the visitor
// presses play, so nothing of the (huge) video file loads before that.
// The parent keys this by project id, so spotlight state resets on change.
const SpotlightMedia = ({ heroProject, heroCopy, copy }) => {
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const videoRef = useRef(null);
  const modalVideoRef = useRef(null);
  const lastTapRef = useRef(0);

  useEffect(() => {
    if (!started) return;
    const video = videoRef.current;
    if (!video) return;
    video
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [started]);

  useEffect(() => {
    if (!expanded) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setExpanded(false);
        const video = videoRef.current;
        if (video && playing) video.play().catch(() => {});
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [expanded, playing]);

  // The autoplay attribute alone is often blocked by browsers — nudge
  // playback once the modal element mounts and again once metadata loads.
  useEffect(() => {
    if (!expanded) return;
    modalVideoRef.current?.play().catch(() => {});
  }, [expanded]);

  const toggle = (e) => {
    e.stopPropagation();
    if (!heroProject.video) return;
    if (!started) {
      setStarted(true);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const openExpand = () => {
    if (!heroProject.video || !started) return;
    setExpanded(true);
    videoRef.current?.pause();
  };

  const closeExpand = (e) => {
    if (e) e.stopPropagation();
    setExpanded(false);
    const video = videoRef.current;
    if (video && playing) video.play().catch(() => {});
  };

  // Double-click on desktop, double-tap on touch → expand like the showreel
  const handleMediaTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 350) {
      lastTapRef.current = 0;
      openExpand();
    } else {
      lastTapRef.current = now;
    }
  };

  return (
    <div
      className="lg:col-span-7 relative overflow-hidden aspect-video lg:aspect-auto lg:min-h-[480px] bg-neutral-950"
      onDoubleClick={openExpand}
      onTouchEnd={handleMediaTap}
    >
      {/* Thumbnail always visible first — video mounts only on play */}
      <img
        src={heroProject.coverImage}
        alt={heroProject.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
      />
      {heroProject.video && started && (
        <video
          ref={videoRef}
          src={heroProject.video}
          playsInline
          onEnded={() => setPlaying(false)}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:ltr:bg-gradient-to-r lg:rtl:bg-gradient-to-l lg:from-transparent lg:to-neutral-900" />

      {/* Badges */}
      <div className="absolute top-5 start-5 flex items-center gap-2">
        <span className="px-3.5 py-1 rounded-full bg-[#E5192D] text-white text-[10px] font-extrabold uppercase tracking-widest shadow-lg">
          {heroCopy.featuredBadge || copy.latestProjects.featuredFallback}
        </span>
        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-neutral-300 text-[10px] font-bold uppercase tracking-wider border border-white/10 flex items-center gap-1">
          <Clock className="w-3 h-3 text-[#E5192D]" />
          <span>{heroProject.videoDuration}</span>
        </span>
      </div>

      {/* Big Play Reel Button */}
      {heroProject.video && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            onClick={toggle}
            aria-label={
              playing
                ? copy.latestProjects.pauseVideo || 'Pause video'
                : copy.latestProjects.playVideo || 'Play video'
            }
            className={`w-16 h-16 rounded-full bg-[#E5192D]/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#E5192D] transition-all ${
              playing ? 'opacity-0 hover:opacity-100' : 'opacity-100'
            }`}
          >
            {playing ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ltr:ml-0.5 rtl:mr-0.5" />
            )}
          </button>
        </div>
      )}

      {/* Expanded player — double-click / double-tap the video, same look as the hero showreel.
          Portaled to document.body: the section's inner container has `relative z-10`,
          which caps any z-index inside it below the fixed navbar (z-50). */}
      {expanded &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl"
            onClick={closeExpand}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="relative w-full max-w-5xl bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 bg-neutral-900/90 border-b border-neutral-800 z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E5192D] animate-ping shrink-0" />
                  <span className="text-white font-bold text-xs sm:text-sm tracking-widest uppercase truncate">
                    {heroProject.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeExpand}
                  aria-label={copy.latestProjects.closeVideo || 'Close video'}
                  className="w-8 h-8 shrink-0 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <video
                ref={modalVideoRef}
                src={heroProject.video}
                playsInline
                controls
                autoPlay
                className="w-full aspect-video bg-black"
                onLoadedMetadata={() => {
                  const modal = modalVideoRef.current;
                  const inline = videoRef.current;
                  if (
                    modal &&
                    inline &&
                    Number.isFinite(inline.currentTime) &&
                    inline.currentTime > 0.5
                  ) {
                    modal.currentTime = inline.currentTime;
                  }
                  modal?.play().catch(() => {});
                }}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export const LatestProjectsSection = ({
  onSelectProject,
}) => {
  const copy = useHomeCopy();
  const [activeTab, setActiveTab] = useState('all');

  const filteredList =
    activeTab === 'all'
      ? LATEST_WORKS
      : LATEST_WORKS.filter((item) => item.industryKey === activeTab);

  // Prefer the project that has an actual film for the spotlight card, so
  // the video is always featured when the section renders.
  const heroProject =
    filteredList.find((item) => item.video) ||
    filteredList[0] ||
    LATEST_WORKS[0];
  const gridProjects = filteredList.filter((item) => item !== heroProject);
  const heroCopy = copy.shared.projects[heroProject.id];

  return (
    <section
      id="our-latest-project"
      className="py-24 bg-[#0a0c0f] text-white border-b border-neutral-800/80 relative overflow-hidden scroll-mt-16"
    >
      {/* Background ambient spotlight */}
      <div className="absolute top-0 end-1/4 w-[600px] h-[350px] bg-[#E5192D]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 text-neutral-400 font-bold text-xs tracking-[0.25em] uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#E5192D]" />
              <span>{copy.latestProjects.eyebrow}</span>
            </div>
            <h2 className="text-white font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight uppercase leading-[1.05]">
              {copy.latestProjects.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <div className="w-8 h-1 bg-[#E5192D] my-4 rounded-full" />
            <p className="text-neutral-400 text-sm max-w-lg leading-relaxed">
              {copy.latestProjects.intro}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-neutral-900/80 p-1.5 rounded-2xl border border-neutral-800">
            {copy.latestProjects.filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#E5192D] text-white shadow-md shadow-red-600/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Spotlight Showcase (Hero Card) */}
        {heroProject && (
          <div
            onClick={() => {
              // Projects with their own film play it in place — no modal.
              if (!heroProject.video) onSelectProject(heroProject);
            }}
            className={`group relative rounded-3xl overflow-hidden border border-neutral-800 hover:border-neutral-700 bg-neutral-900 mb-10 transition-all duration-300 shadow-2xl ${
              heroProject.video ? 'cursor-default' : 'cursor-pointer'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:min-h-[480px]">
              {/* Media Visual Column */}
              <SpotlightMedia
                key={heroProject.id}
                heroProject={heroProject}
                heroCopy={heroCopy}
                copy={copy}
              />

              {/* Information Column */}
              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between bg-neutral-900">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
                    <span>{heroCopy.industry}</span>
                    <span>•</span>
                    <span className="text-[#E5192D] flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {heroCopy.location}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight group-hover:text-[#E5192D] transition-colors mb-3">
                    {heroProject.title}
                  </h3>

                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6">
                    {heroCopy.description}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-black/40 border border-neutral-800 mb-6">
                    {heroCopy.metrics.map((m, i) => (
                      <div key={i} className="text-center">
                        <div className="text-base sm:text-lg font-black text-white tracking-tight">
                          {m.value}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-0.5">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-xs font-semibold text-neutral-400">
                    <span className="text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">
                      {copy.latestProjects.productionScope}
                    </span>
                    <span>{heroCopy.role}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#E5192D] group-hover:underline flex items-center gap-1.5">
                    <span>{copy.latestProjects.viewCaseStudy}</span>
                    <ArrowRight className="w-4 h-4 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </span>

                  <span className="text-xs font-bold text-neutral-500">
                    {heroProject.year}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Latest Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gridProjects.map((proj) => {
            const projCopy = copy.shared.projects[proj.id];
            return (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj)}
                className="group bg-neutral-900/90 rounded-2xl overflow-hidden border border-neutral-800 hover:border-neutral-600 transition-all duration-300 flex flex-col justify-between shadow-xl cursor-pointer hover:-translate-y-1"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                  <img
                    src={proj.coverImage}
                    alt={proj.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute top-3 start-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[9px] font-extrabold uppercase tracking-wider border border-white/10">
                      {projCopy.featuredBadge || projCopy.industry}
                    </span>
                  </div>

                  <div className="absolute bottom-3 end-3 w-8 h-8 rounded-full bg-[#E5192D] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-current ltr:ml-0.5 rtl:mr-0.5" />
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                      {projCopy.industry} • {proj.year}
                    </div>
                    <h4 className="text-lg font-bold text-white tracking-tight group-hover:text-[#E5192D] transition-colors line-clamp-1">
                      {proj.title}
                    </h4>
                    <p className="text-neutral-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                      {projCopy.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-bold text-[#E5192D]">
                    <span>{copy.latestProjects.exploreMedia}</span>
                    <ArrowRight className="w-3.5 h-3.5 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
