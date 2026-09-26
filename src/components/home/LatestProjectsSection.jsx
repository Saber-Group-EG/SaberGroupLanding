import { useState } from 'react';
import { Play, ArrowRight, Sparkles, Clock, MapPin } from 'lucide-react';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';


const LATEST_WORKS = [
  {
    id: 'latest-valora-film',
    title: 'Valora Luxury Living',
    industryKey: 'real-estate',
    clientName: 'Valora Developments',
    year: '2025',
    videoDuration: '02:45',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'latest-asia-luxe',
    title: 'Asia Skin & Radiance Serum',
    industryKey: 'beauty',
    clientName: 'Asia Beauty Care',
    year: '2025',
    videoDuration: '01:15',
    coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'latest-seashell-summer',
    title: 'Seashell Bohemian Beach Club',
    industryKey: 'hospitality',
    clientName: 'Seashell Hospitality',
    year: '2024 - 2025',
    videoDuration: '03:10',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'latest-swissotel-legacy',
    title: 'Swissôtel Sanctuary & Heritage',
    industryKey: 'hospitality',
    clientName: 'Swissôtel Hotels & Resorts',
    year: '2024',
    videoDuration: '02:30',
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  },
];

export const LatestProjectsSection = ({
  onSelectProject,
}) => {
  const copy = useHomeCopy();
  const [activeTab, setActiveTab] = useState('all');

  const filteredList =
    activeTab === 'all'
      ? LATEST_WORKS
      : LATEST_WORKS.filter((item) => item.industryKey === activeTab);

  const heroProject = filteredList[0] || LATEST_WORKS[0];
  const gridProjects = filteredList.slice(1);
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
            onClick={() => onSelectProject(heroProject)}
            className="group relative rounded-3xl overflow-hidden border border-neutral-800 hover:border-neutral-700 bg-neutral-900 mb-10 transition-all duration-300 shadow-2xl cursor-pointer"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
              {/* Media Visual Column */}
              <div className="lg:col-span-7 relative overflow-hidden min-h-[320px] lg:min-h-[480px] bg-neutral-950">
                <img
                  src={heroProject.coverImage}
                  alt={heroProject.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                />
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#E5192D]/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#E5192D] transition-all">
                    <Play className="w-6 h-6 fill-current ltr:ml-0.5 rtl:mr-0.5" />
                  </div>
                </div>
              </div>

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
