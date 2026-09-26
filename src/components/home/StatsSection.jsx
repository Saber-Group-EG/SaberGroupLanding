import { STATS_DATA } from '../../content/home/saberData';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';

export const StatsSection = () => {
  const copy = useHomeCopy();

  return (
    <section className="py-16 bg-white border-b border-neutral-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200">
          {STATS_DATA.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col items-center justify-center text-center p-6 sm:p-8"
            >
              <span className="font-black text-4xl sm:text-5xl lg:text-[54px] text-[#111315] tracking-tight leading-none mb-3 tabular-nums">
                {stat.value}
              </span>
              <span className="text-neutral-500 text-xs sm:text-sm font-medium tracking-normal">
                {copy.stats[stat.id]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
