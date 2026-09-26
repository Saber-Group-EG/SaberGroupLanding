import { Layers, Users, UtensilsCrossed, Stethoscope, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';


const PRODUCT_META = [
  {
    id: 'jahez-crm',
    title: 'Jahez CRM',
    badgeColor: 'bg-[#E5192D]/10 text-[#E5192D] border-[#E5192D]/20',
    isSoon: false,
    icon: <Layers className="w-6 h-6 text-[#E5192D]" />,
  },
  {
    id: 'jahez-ats',
    title: 'Jahez ATS',
    badgeColor: 'bg-[#E5192D]/10 text-[#E5192D] border-[#E5192D]/20',
    isSoon: false,
    icon: <Users className="w-6 h-6 text-[#E5192D]" />,
  },
  {
    id: 'easy-menu',
    title: 'Easy Menu',
    badgeColor: 'bg-neutral-100 text-neutral-600 border-neutral-300',
    isSoon: true,
    icon: <UtensilsCrossed className="w-6 h-6 text-[#111315]" />,
  },
  {
    id: 'medify',
    title: 'medify',
    badgeColor: 'bg-neutral-100 text-neutral-600 border-neutral-300',
    isSoon: true,
    icon: <Stethoscope className="w-6 h-6 text-[#111315]" />,
  },
];

export const ProductsSection = ({ onOpenContact }) => {
  const copy = useHomeCopy();

  return (
    <section id="our-products" className="py-24 bg-white border-b border-neutral-200/80 scroll-mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 text-neutral-400 font-bold text-xs tracking-[0.25em] uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#E5192D]" />
              <span>{copy.products.eyebrow}</span>
            </div>
            <h2 className="text-[#111315] font-black text-4xl sm:text-5xl tracking-tight uppercase leading-[1.05]">
              {copy.products.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <div className="w-8 h-1 bg-[#E5192D] my-4 rounded-full" />
            <p className="text-neutral-500 text-sm max-w-xl">
              {copy.products.intro}
            </p>
          </div>

          <button
            onClick={onOpenContact}
            className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-neutral-800 hover:border-black hover:bg-neutral-900 hover:text-white text-neutral-900 font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <span>{copy.products.demoCta}</span>
            <ArrowRight className="w-4 h-4 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Products Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCT_META.map((product) => {
            const productCopy = copy.products.items[product.id];
            return (
              <div
                key={product.id}
                className="group relative bg-[#fbfbfc] hover:bg-white rounded-2xl p-7 border border-neutral-200 hover:border-neutral-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      {product.icon}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${product.badgeColor}`}
                    >
                      {productCopy.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-2xl font-black text-[#111315] tracking-tight group-hover:text-[#E5192D] transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xs font-semibold text-neutral-400 mt-1 mb-4">
                    {productCopy.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-neutral-600 text-xs leading-relaxed mb-6">
                    {productCopy.description}
                  </p>

                  {/* Feature Bullets */}
                  <div className="space-y-2 mb-6">
                    {productCopy.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E5192D] flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4 border-t border-neutral-200/60">
                  <button
                    onClick={onOpenContact}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      product.isSoon
                        ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                        : 'bg-neutral-900 hover:bg-[#E5192D] text-white shadow-xs'
                    }`}
                  >
                    <span>{product.isSoon ? copy.products.joinWaitlist : copy.products.explore}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
