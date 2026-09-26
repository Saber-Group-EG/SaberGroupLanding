import { X, ArrowRight, CheckCircle2, Award, Calendar, MapPin, Building } from 'lucide-react';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';


export const ProjectModal = ({
  project,
  onClose,
  onOpenContact,
}) => {
  const copy = useHomeCopy();

  if (!project) return null;

  const projectCopy = copy.shared.projects[project.id];
  const modalCopy = copy.modals.project;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 flex flex-col my-auto max-h-[90vh]">

        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E5192D]" />
            <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
              {modalCopy.caseStudy} • {projectCopy.industry}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex flex-col gap-8">

          {/* Hero Banner within Modal with Real Photo */}
          <div className="relative w-full h-[280px] sm:h-[360px] rounded-2xl overflow-hidden shadow-inner bg-neutral-900">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 start-6 end-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#E5192D] text-white font-bold text-[10px] tracking-wider uppercase mb-2 inline-block">
                  {projectCopy.category}
                </span>
                <h3 className="text-white font-black text-3xl sm:text-4xl tracking-tight uppercase">
                  {project.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Metadata Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200/60">
            <div className="flex items-center gap-3">
              <Building className="w-4 h-4 text-neutral-400 flex-shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-neutral-400">{modalCopy.client}</div>
                <div className="text-xs font-bold text-neutral-800">{project.clientName}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-neutral-400 flex-shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-neutral-400">{modalCopy.location}</div>
                <div className="text-xs font-bold text-neutral-800">{projectCopy.location}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-neutral-400 flex-shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-neutral-400">{modalCopy.year}</div>
                <div className="text-xs font-bold text-neutral-800">{project.year}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 text-[#E5192D] flex-shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-neutral-400">{modalCopy.outcome}</div>
                <div className="text-xs font-bold text-emerald-600">{modalCopy.outcomeValue}</div>
              </div>
            </div>
          </div>

          {/* Overview & Deliverables */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">
                {modalCopy.overview}
              </h4>
              <p className="text-neutral-700 text-sm sm:text-base font-normal leading-relaxed mb-6">
                {projectCopy.description}
              </p>

              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
                {modalCopy.deliverables}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {projectCopy.deliverables.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                    <CheckCircle2 className="w-4 h-4 text-[#E5192D] flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics column */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">
                {modalCopy.results}
              </h4>
              {projectCopy.metrics.map((metric, i) => (
                <div key={i} className="p-4 rounded-xl bg-neutral-900 text-white flex items-center justify-between">
                  <span className="text-xs text-neutral-300 font-medium">{metric.label}</span>
                  <span className="text-2xl font-black text-[#E5192D] tabular-nums">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA within modal */}
          <div className="p-6 rounded-2xl bg-neutral-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white">{modalCopy.ctaTitle}</h4>
              <p className="text-xs text-neutral-400 font-normal mt-0.5">{modalCopy.ctaText}</p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenContact();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E5192D] hover:bg-[#c81424] text-white font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
            >
              <span>{modalCopy.ctaButton}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
