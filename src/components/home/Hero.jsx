import { useState } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES } from '../../content/home/saberData';
import { AutoPlayingHeroVideo } from './AutoPlayingHeroVideo';
import {
  SeashellBeachVisual,
  CosmeticsVisual,
  SwissotelVisual
} from './VisualAssets';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';


export const Hero = ({ onOpenShowreel, onSelectProject }) => {
  const copy = useHomeCopy();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [animateKey, setAnimateKey] = useState(0);

  const currentSlide = HERO_SLIDES[currentSlideIndex];
  const slideCopy = copy.hero.slides[currentSlide.id];

  // Re-trigger text entrance animation whenever slide changes
  const changeSlide = (newIndex) => {
    setCurrentSlideIndex(newIndex);
    setAnimateKey((prev) => prev + 1);
  };

  const handlePrevSlide = () => {
    const nextIdx = currentSlideIndex === 0 ? HERO_SLIDES.length - 1 : currentSlideIndex - 1;
    changeSlide(nextIdx);
  };

  const handleNextSlide = () => {
    const nextIdx = currentSlideIndex === HERO_SLIDES.length - 1 ? 0 : currentSlideIndex + 1;
    changeSlide(nextIdx);
  };

  const handleProjectCardClick = () => {
    // Map slide to project modal
    if (currentSlide.id === 'slide-01') onSelectProject('proj-valora');
    else if (currentSlide.id === 'slide-02') onSelectProject('proj-seashell');
    else if (currentSlide.id === 'slide-03') onSelectProject('proj-asia');
    else if (currentSlide.id === 'slide-04') onSelectProject('proj-swissotel');
  };

  return (
    <section id="home" className="relative w-full h-[88vh] min-h-[640px] max-h-[850px] bg-neutral-900 overflow-hidden">

      {/* Background Visual Scene with Smooth Transitions */}
      <div className="absolute inset-0 transition-opacity duration-700 select-none">
        {/* Slide 1: Autoplaying cinematic video on page load */}
        {currentSlideIndex === 0 && (
          <AutoPlayingHeroVideo onOpenShowreel={onOpenShowreel} />
        )}
        {currentSlideIndex === 1 && (
          <div className="relative w-full h-full animate-in fade-in duration-700">
            <SeashellBeachVisual />
            <div className="absolute inset-0 bg-black/60 pointer-events-none" />
          </div>
        )}
        {currentSlideIndex === 2 && (
          <div className="relative w-full h-full animate-in fade-in duration-700">
            <CosmeticsVisual />
            <div className="absolute inset-0 bg-black/75 pointer-events-none" />
          </div>
        )}
        {currentSlideIndex === 3 && (
          <div className="relative w-full h-full animate-in fade-in duration-700">
            <SwissotelVisual />
            <div className="absolute inset-0 bg-black/65 pointer-events-none" />
          </div>
        )}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-[1440px] h-full mx-auto px-4 sm:px-8 lg:px-12 flex flex-col justify-between pt-16 md:pt-24 pb-12 select-text">

        {/* Start Headline & CTA Zone with Staggered Entrance Animations */}
        <div key={animateKey} className="max-w-3xl">
          {/* Eyebrow kicker with entrance animation */}
          <div className="mb-2 sm:mb-4 animate-hero-kicker">
            <span className="text-white/80 font-medium text-xs sm:text-sm md:text-base tracking-[0.25em] uppercase drop-shadow-md">
              {slideCopy.eyebrow}
            </span>
          </div>

          {/* Primary Impact Headline with cinematic reveal animation */}
          <h1 className="text-white font-black text-6xl sm:text-7xl md:text-8xl lg:text-[92px] leading-[0.92] tracking-tighter uppercase drop-shadow-xl mb-6 overflow-hidden">
            {slideCopy.titleLines.map((line, idx) => (
              <span
                key={line}
                className={`block ${idx === 0 ? 'animate-hero-title-1' : 'animate-hero-title-2 text-white'}`}
              >
                {line}
              </span>
            ))}
          </h1>

          {/* Bulleted Subtitle Bar with fade up animation */}
          <p className="text-white/85 text-xs sm:text-sm md:text-base font-normal tracking-wide drop-shadow-md mb-8 flex flex-wrap items-center gap-x-2.5 gap-y-1 animate-hero-subtitle">
            {copy.hero.bullets.map((bullet, idx) => (
              <span key={bullet} className="contents">
                {idx > 0 && (
                  <span className="text-[#E5192D] text-lg leading-none">•</span>
                )}
                <span>{bullet}</span>
              </span>
            ))}
          </p>

          {/* Watch Showreel Button with entrance animation */}
          <div className="flex items-center animate-hero-cta">
            <button
              onClick={onOpenShowreel}
              className="group inline-flex items-center gap-3.5 px-7 py-3.5 rounded-full bg-[#E5192D] hover:bg-[#c81424] text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shadow-xl shadow-red-600/30 active:scale-95 cursor-pointer"
            >
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:scale-110">
                <Play className="w-3.5 h-3.5 fill-white text-white ltr:translate-x-0.5 rtl:-translate-x-0.5" />
              </span>
              <span>{copy.hero.watchShowreel}</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar: Slide Pagination (Start) & Featured Project Card (End) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-6">

          {/* Slide Pagination: 01 02 03 04 */}
          <div className="flex items-center gap-6">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === currentSlideIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => changeSlide(idx)}
                  className="group flex flex-col items-start cursor-pointer py-1"
                >
                  <span
                    className={`text-xs font-bold tracking-widest transition-colors ${
                      isActive ? 'text-white' : 'text-white/40 group-hover:text-white/80'
                    }`}
                  >
                    {slide.slideNumber}
                  </span>
                  {/* Underline Indicator */}
                  <div className="w-8 h-[2px] mt-1.5 bg-white/20 relative overflow-hidden rounded-full">
                    {isActive && (
                      <div className="absolute inset-0 bg-white animate-pulse" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Showcase Project Card & Carousel Controls */}
          <div className="flex items-center gap-6 self-end sm:self-auto">
            {/* Project Info Block */}
            <button
              onClick={handleProjectCardClick}
              className="text-end group cursor-pointer"
              title={copy.hero.projectLinkTitle}
            >
              <h2 className="text-white text-2xl md:text-3xl font-serif tracking-[0.25em] font-normal uppercase group-hover:text-[#E5192D] transition-colors drop-shadow-md">
                {currentSlide.projectName}
              </h2>
              <div className="text-white/70 text-[10px] md:text-xs tracking-[0.2em] font-semibold uppercase mt-0.5">
                {slideCopy.projectCategory}
              </div>
              <div className="text-white/50 text-[9px] md:text-[10px] tracking-[0.25em] uppercase font-medium">
                {slideCopy.projectLocation}
              </div>
            </button>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevSlide}
                aria-label={copy.hero.prevSlide}
                className="w-10 h-10 rounded-full border border-white/40 hover:border-white text-white hover:bg-white/15 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm active:scale-90"
              >
                <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
              </button>
              <button
                onClick={handleNextSlide}
                aria-label={copy.hero.nextSlide}
                className="w-10 h-10 rounded-full bg-[#E5192D] hover:bg-[#c81424] text-white flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-red-600/30 active:scale-90"
              >
                <ChevronRight className="w-5 h-5 rtl:rotate-180" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
