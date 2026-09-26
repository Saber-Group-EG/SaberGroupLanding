import { useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { SELECTED_PROJECTS } from '../../content/home/saberData';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';
import {
  ValoraArchitectureVisual,
  CosmeticsVisual,
  SeashellBeachVisual,
  SwissotelVisual,
} from './VisualAssets';


export const SelectedProjects = ({
  onSelectProject,
  onViewAllProjects,
}) => {
  const copy = useHomeCopy();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredProjects = selectedFilter === 'all'
    ? SELECTED_PROJECTS
    : SELECTED_PROJECTS.filter((p) => p.industryKey === selectedFilter);

  const renderVisual = (type) => {
    switch (type) {
      case 'valora':
        return <ValoraArchitectureVisual />;
      case 'cosmetics':
        return <CosmeticsVisual />;
      case 'seashell':
        return <SeashellBeachVisual />;
      case 'swissotel':
        return <SwissotelVisual />;
      default:
        return <div className="w-full h-full bg-neutral-800" />;
    }
  };

  return (
    <section id="portfolio" className="py-24 bg-[#f8f9fa] border-b border-neutral-200/80 scroll-mt-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">

        {/* Header Layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="text-neutral-400 font-bold text-xs tracking-[0.25em] uppercase mb-2">
              {copy.selectedProjects.eyebrow}
            </div>
            <h2 className="text-[#111315] font-black text-4xl sm:text-5xl tracking-tight uppercase leading-[1.05]">
              {copy.selectedProjects.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <div className="w-8 h-1 bg-[#E5192D] my-4 rounded-full" />
            <p className="text-neutral-500 text-sm max-w-md">
              {copy.selectedProjects.intro}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white border border-neutral-200 rounded-full shadow-xs">
              {copy.selectedProjects.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFilter(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedFilter === cat.id
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* View All Projects Button */}
            <button
              onClick={onViewAllProjects}
              className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-neutral-800 hover:border-black hover:bg-neutral-900 hover:text-white text-neutral-900 font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              <span>{copy.selectedProjects.viewAll}</span>
              <ArrowRight className="w-4 h-4 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 4-Column Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProjects.map((project) => {
            const projectCopy = copy.shared.projects[project.id];
            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="group bg-white rounded-xl overflow-hidden border border-neutral-200/80 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Project Image Area (4:3 aspect ratio) */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                    {renderVisual(project.visualType)}
                  </div>
                  {/* Subtle scrim hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                </div>

                {/* Bottom Card Info & Action Arrow */}
                <div className="p-5 flex items-center justify-between border-t border-neutral-100 bg-white">
                  <div>
                    <h3 className="text-[#111315] font-bold text-base tracking-tight group-hover:text-[#E5192D] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-neutral-400 text-xs font-medium mt-0.5">
                      {projectCopy.category}
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:bg-[#E5192D] transition-all flex-shrink-0">
                    <ChevronRight className="w-4 h-4 ltr:group-hover:translate-x-0.5 rtl:-rotate-180 rtl:group-hover:-translate-x-0.5 transition-transform" />
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
