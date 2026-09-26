import { useState } from 'react';
import { Video, Camera, Megaphone, Layers, Monitor, ArrowRight, Check } from 'lucide-react';
import { SERVICES_DATA } from '../../content/home/saberData';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';


export const WhatWeDoSection = ({ onLearnMore }) => {
  const copy = useHomeCopy();
  const [activeServiceId, setActiveServiceId] = useState(null);

  const activeService = activeServiceId
    ? SERVICES_DATA.find((s) => s.id === activeServiceId)
    : null;
  const activeServiceCopy = activeServiceId ? copy.whatWeDo.services[activeServiceId] : null;

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'video':
        return <Video className="w-7 h-7" strokeWidth={1.5} />;
      case 'camera':
        return <Camera className="w-7 h-7" strokeWidth={1.5} />;
      case 'megaphone':
        return <Megaphone className="w-7 h-7" strokeWidth={1.5} />;
      case 'layers':
        return <Layers className="w-7 h-7" strokeWidth={1.5} />;
      case 'monitor':
        return <Monitor className="w-7 h-7" strokeWidth={1.5} />;
      default:
        return <Video className="w-7 h-7" strokeWidth={1.5} />;
    }
  };

  return (
    <section id="services" className="relative py-24 bg-[#090b0e] text-white overflow-hidden select-none">

      {/* Background Camera Lens Macro Photographic Imagery */}
      <div className="absolute end-0 top-0 bottom-0 w-full lg:w-1/2 opacity-25 lg:opacity-40 pointer-events-none overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=1400&q=80"
          alt={copy.whatWeDo.imageAlt}
          className="w-full h-full object-cover object-center mix-blend-screen scale-110"
        />
        {/* Soft blends into background */}
        <div className="absolute inset-0 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-[#090b0e] via-[#090b0e]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#090b0e] via-transparent to-[#090b0e]" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Start Column: Heading */}
          <div className="lg:col-span-5">
            <div className="text-white/60 font-semibold text-xs tracking-[0.25em] uppercase mb-3">
              {copy.whatWeDo.eyebrow}
            </div>
            <h2 className="text-white font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] uppercase">
              {copy.whatWeDo.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </div>

          {/* End Column: 5 Services Icons & Labels */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-4 items-center">
              {SERVICES_DATA.map((service) => {
                const serviceCopy = copy.whatWeDo.services[service.id];
                const isSelected = activeServiceId === service.id;
                return (
                  <button
                    key={service.id}
                    onClick={() => setActiveServiceId(isSelected ? null : service.id)}
                    className={`group flex flex-col items-center text-center p-3 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/10 ring-1 ring-white/30'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {/* Minimalist Line Icon */}
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'text-[#E5192D] scale-110'
                          : 'text-white/80 group-hover:text-white group-hover:scale-105'
                      }`}
                    >
                      {getServiceIcon(service.iconName)}
                    </div>

                    {/* Service Label */}
                    <span className="text-xs font-semibold text-white/90 group-hover:text-white mt-2 leading-tight">
                      {serviceCopy.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* End link: LEARN MORE */}
            <div className="flex justify-end mt-10">
              <button
                onClick={onLearnMore}
                className="group inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-white/90 hover:text-white transition-colors cursor-pointer"
              >
                <span>{copy.whatWeDo.learnMore}</span>
                <ArrowRight className="w-4 h-4 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

        {/* Interactive Active Service Drawer */}
        {activeService && activeServiceCopy && (
          <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-neutral-900/95 border border-neutral-800 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#E5192D]/20 text-[#E5192D] flex items-center justify-center">
                  {getServiceIcon(activeService.iconName)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{activeServiceCopy.title}</h3>
                  <p className="text-neutral-400 font-normal text-sm mt-0.5">{activeServiceCopy.description}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveServiceId(null)}
                className="text-xs uppercase font-semibold tracking-wider text-neutral-400 hover:text-white underline cursor-pointer self-start md:self-auto"
              >
                {copy.whatWeDo.closeDetails}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {activeServiceCopy.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-neutral-300 font-medium">
                  <Check className="w-4 h-4 text-[#E5192D] flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
