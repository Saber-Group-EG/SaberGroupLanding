import { Quote, Sparkles, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';
import { useHorizontalScroll } from './useHorizontalScroll';


const TEAM_MEMBERS = [
  {
    id: 'mostafa-saber',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    socials: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
  },
  {
    id: 'omar-farouk',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    socials: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
  },
  {
    id: 'nour-el-din',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    socials: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
  },
  {
    id: 'sarah-hassan',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    socials: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
  },
  {
    id: 'karim-mansour',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    socials: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
  },
  {
    id: 'layla-mahmoud',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
    socials: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
  },
];


export const TeamSection = ({ onJoinTeam }) => {
  const copy = useHomeCopy();
  const {
    containerRef: sliderRef,
    canScrollStart,
    canScrollEnd,
    activeIndex,
    scrollByStep,
    scrollToIndex,
  } = useHorizontalScroll({ itemCount: TEAM_MEMBERS.length, gap: 24 });

  return (
    <section id="our-team" className="py-24 bg-[#0e1115] text-white border-b border-neutral-900 scroll-mt-16 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#E5192D]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header Section with Navigation Arrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 text-neutral-400 font-bold text-xs tracking-[0.25em] uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#E5192D]" />
              <span>{copy.team.eyebrow}</span>
            </div>
            <h2 className="text-white font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight uppercase leading-[1.05]">
              {copy.team.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <div className="w-8 h-1 bg-[#E5192D] my-4 rounded-full" />
            <p className="text-neutral-400 text-sm max-w-lg leading-relaxed">
              {copy.team.intro}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Slider Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollByStep('start')}
                disabled={!canScrollStart}
                aria-label={copy.team.prevMember}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  canScrollStart
                    ? 'border-neutral-700 bg-neutral-900 text-white hover:border-[#E5192D] hover:bg-[#E5192D] active:scale-95'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-600 cursor-not-allowed opacity-50'
                }`}
              >
                <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
              </button>

              <button
                onClick={() => scrollByStep('end')}
                disabled={!canScrollEnd}
                aria-label={copy.team.nextMember}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  canScrollEnd
                    ? 'border-neutral-700 bg-neutral-900 text-white hover:border-[#E5192D] hover:bg-[#E5192D] active:scale-95'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-600 cursor-not-allowed opacity-50'
                }`}
              >
                <ChevronRight className="w-5 h-5 rtl:rotate-180" />
              </button>
            </div>

            <button
              onClick={onJoinTeam}
              className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#E5192D] hover:bg-[#c81424] text-white font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-xl shadow-red-600/25 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>{copy.team.joinCta}</span>
            </button>
          </div>
        </div>

        {/* Horizontal Carousel Slider */}
        <div className="relative">
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto pb-8 pt-2 scroll-smooth no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {TEAM_MEMBERS.map((member) => {
              const memberCopy = copy.team.members[member.id];
              return (
                <div
                  key={member.id}
                  className="w-[300px] sm:w-[340px] md:w-[380px] flex-shrink-0 snap-start group bg-neutral-900/90 rounded-2xl overflow-hidden border border-neutral-800 hover:border-neutral-600 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1.5"
                >
                  {/* Member Photo */}
                  <div className="relative aspect-[4/4.3] w-full overflow-hidden bg-neutral-950">
                    <img
                      src={member.image}
                      alt={memberCopy.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 filter grayscale contrast-110 group-hover:grayscale-0"
                    />

                    {/* Scrim Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent pointer-events-none" />

                    {/* Category Pill Tag */}
                    <div className="absolute top-4 start-4">
                      <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold tracking-wider text-neutral-300 uppercase border border-white/10">
                        {memberCopy.category}
                      </span>
                    </div>

                    {/* Social icons on photo bottom end */}
                    <div className="absolute bottom-4 end-4 flex items-center gap-2">
                      {member.socials?.linkedin && (
                        <a
                          href={member.socials.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={copy.team.linkedinAria}
                          className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#E5192D] text-white backdrop-blur-md flex items-center justify-center transition-colors border border-white/10"
                        >
                          {/* Brand icons inlined because lucide-react v1 no longer exports Linkedin/Instagram */}
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                            <rect width="4" height="12" x="2" y="9" />
                            <circle cx="4" cy="4" r="2" />
                          </svg>
                        </a>
                      )}
                      {member.socials?.instagram && (
                        <a
                          href={member.socials.instagram}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={copy.team.instagramAria}
                          className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#E5192D] text-white backdrop-blur-md flex items-center justify-center transition-colors border border-white/10"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Text Info */}
                  <div className="p-6 flex flex-col flex-1 justify-between bg-neutral-900 border-t border-neutral-800/80">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#E5192D] transition-colors">
                        {memberCopy.name}
                      </h3>
                      <p className="text-xs font-semibold text-neutral-400 mt-0.5 tracking-wide">
                        {memberCopy.role}
                      </p>
                    </div>

                    {/* Short Quote */}
                    <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-start gap-2.5">
                      <Quote className="w-4 h-4 text-[#E5192D] flex-shrink-0 mt-0.5 opacity-80" />
                      <p className="text-xs italic text-neutral-300 font-light leading-relaxed line-clamp-3">
                        {memberCopy.quote}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {TEAM_MEMBERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToIndex(idx)}
                aria-label={copy.team.goToSlide.replace('{n}', idx + 1)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === activeIndex
                    ? 'w-8 h-2 bg-[#E5192D]'
                    : 'w-2 h-2 bg-neutral-700 hover:bg-neutral-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Banner inside Team Section */}
        <div className="mt-14 p-8 rounded-3xl ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-neutral-900 to-neutral-950 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E5192D]/15 text-[#E5192D] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">{copy.team.bannerTitle}</h4>
              <p className="text-xs text-neutral-400 mt-0.5">{copy.team.bannerText}</p>
            </div>
          </div>

          <button
            onClick={onJoinTeam}
            className="px-6 py-2.5 rounded-full border border-neutral-700 hover:border-white text-white hover:bg-white hover:text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
          >
            {copy.team.bannerCta}
          </button>
        </div>
      </div>
    </section>
  );
};
