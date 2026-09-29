import { useState } from 'react';
import { Sparkles, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';
import { useHorizontalScroll } from './useHorizontalScroll';

const SKELETON_IDS = ['member-1', 'member-2', 'member-3', 'member-4', 'member-5'];

const getMemberInitials = (name) =>
  String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

const MemberMedia = ({ member }) => {
  const copy = useHomeCopy();
  const [failed, setFailed] = useState(false);
  const name = typeof member.name === 'string' ? member.name : '';
  const showPhoto =
    !failed && typeof member.avatar === 'string' && member.avatar.trim() !== '';

  return (
    <div className="relative aspect-[4/4.3] w-full overflow-hidden bg-neutral-950">
      {showPhoto ? (
        <img
          src={member.avatar}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 filter grayscale contrast-110 group-hover:grayscale-0"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-950">
          <span className="text-6xl font-black tracking-tight text-neutral-200">
            {getMemberInitials(name)}
          </span>
        </div>
      )}

      {/* Scrim Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent pointer-events-none" />

      {/* Social icons on photo bottom end */}
      <div className="absolute bottom-4 end-4 flex items-center gap-2">
        {member.socials?.linkedin && (
          <a
            href={member.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label={`${copy.team.linkedinAria} — ${name}`}
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
            aria-label={`${copy.team.instagramAria} — ${name}`}
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
  );
};

export const TeamSection = ({ onJoinTeam, members = [], loading = false }) => {
  const copy = useHomeCopy();
  const showSkeletons = loading && members.length === 0;
  const showCarousel = showSkeletons || members.length > 0;
  const {
    containerRef: sliderRef,
    canScrollStart,
    canScrollEnd,
    activeIndex,
    scrollByStep,
    scrollToIndex,
  } = useHorizontalScroll({ itemCount: members.length, gap: 24 });

  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5192D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1115]';

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
            {showCarousel && members.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollByStep('start')}
                  disabled={!canScrollStart}
                  aria-label={copy.team.prevMember}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer ${focusRing} ${
                    canScrollStart
                      ? 'border-neutral-700 bg-neutral-900 text-white hover:border-[#E5192D] hover:bg-[#E5192D] active:scale-95'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollByStep('end')}
                  disabled={!canScrollEnd}
                  aria-label={copy.team.nextMember}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer ${focusRing} ${
                    canScrollEnd
                      ? 'border-neutral-700 bg-neutral-900 text-white hover:border-[#E5192D] hover:bg-[#E5192D] active:scale-95'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onJoinTeam}
              className={`group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#E5192D] hover:bg-[#c81424] text-white font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-xl shadow-red-600/25 active:scale-95 cursor-pointer whitespace-nowrap ${focusRing}`}
            >
              <UserPlus className="w-4 h-4" />
              <span>{copy.team.joinCta}</span>
            </button>
          </div>
        </div>

        {showCarousel && (
          <div className="relative">
            <div
              ref={sliderRef}
              tabIndex={0}
              role="region"
              aria-roledescription="carousel"
              aria-label={copy.team.heading.join(' ')}
              aria-busy={loading}
              className="flex gap-6 overflow-x-auto pb-8 pt-2 scroll-smooth no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {showSkeletons ? (
                <div
                  role="status"
                  aria-label={copy.team.eyebrow}
                  className="flex gap-6 shrink-0"
                >
                  {SKELETON_IDS.map((id) => (
                    <div
                      key={id}
                      className="w-[300px] sm:w-[340px] md:w-[380px] flex-shrink-0 snap-start bg-neutral-900/60 rounded-2xl overflow-hidden border border-neutral-800 flex flex-col"
                    >
                      <div
                        aria-hidden="true"
                        className="aspect-[4/4.3] w-full bg-neutral-950/60 animate-pulse"
                      />
                      <div className="p-6 flex flex-col gap-3 border-t border-neutral-800/80">
                        <div
                          aria-hidden="true"
                          className="h-5 w-2/3 rounded bg-neutral-800 animate-pulse"
                        />
                        <div
                          aria-hidden="true"
                          className="h-3 w-1/2 rounded bg-neutral-800 animate-pulse"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                members.map((member) => {
                  const role = Array.isArray(member.role)
                    ? member.role.join(', ')
                    : typeof member.role === 'string'
                      ? member.role
                      : '';
                  return (
                    <div
                      key={member.id || member.name}
                      className="w-[300px] sm:w-[340px] md:w-[380px] flex-shrink-0 snap-start group bg-neutral-900/90 rounded-2xl overflow-hidden border border-neutral-800 hover:border-neutral-600 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1.5"
                    >
                      <MemberMedia member={member} />

                      {/* Text Info */}
                      <div className="p-6 flex flex-col flex-1 justify-between bg-neutral-900 border-t border-neutral-800/80">
                        <div>
                          <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#E5192D] transition-colors">
                            {typeof member.name === 'string' ? member.name : ''}
                          </h3>
                          <p className="text-xs font-semibold text-neutral-400 mt-0.5 tracking-wide">
                            {role}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Carousel Pagination */}
            {!showSkeletons && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {members.length <= 10 ? (
                  members.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollToIndex(idx)}
                      aria-label={copy.team.goToSlide.replace('{n}', idx + 1)}
                      aria-current={idx === activeIndex ? 'true' : undefined}
                      className={`relative after:absolute after:-inset-2 after:content-[''] transition-all duration-300 rounded-full cursor-pointer ${focusRing} ${
                        idx === activeIndex
                          ? 'w-8 h-2 bg-[#E5192D]'
                          : 'w-2 h-2 bg-neutral-500 hover:bg-neutral-400'
                      }`}
                    />
                  ))
                ) : (
                  <span className="text-sm text-neutral-400 tabular-nums">
                    {activeIndex + 1} / {members.length}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

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
            type="button"
            onClick={onJoinTeam}
            className={`px-6 py-2.5 rounded-full border border-neutral-700 hover:border-white text-white hover:bg-white hover:text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${focusRing}`}
          >
            {copy.team.bannerCta}
          </button>
        </div>
      </div>
    </section>
  );
};
