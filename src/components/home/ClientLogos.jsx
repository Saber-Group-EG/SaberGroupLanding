export const LogoValora = ({ className = 'h-7' }) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
    <span className="font-serif tracking-[0.35em] text-lg md:text-xl font-medium text-slate-800 uppercase">
      VALORA
    </span>
  </div>
);

export const LogoAsiaCosmetics = ({ className = 'h-7' }) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
    <span className="text-2xl md:text-3xl font-serif italic text-slate-800 tracking-wide font-normal leading-none">
      Asia
    </span>
    <span className="text-[7px] tracking-[0.25em] font-semibold text-slate-500 uppercase mt-0.5">
      COSMETICS
    </span>
  </div>
);

export const LogoCubic = ({ className = 'h-7' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    {/* Isometric Cube Icon */}
    <svg className="w-7 h-7 text-slate-800" viewBox="0 0 40 40" fill="none">
      <path d="M20 4 L34 12 L20 20 L6 12 Z" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M6 12 L6 28 L20 36 L20 20 Z" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M34 12 L34 28 L20 36 L20 20 Z" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="20" cy="20" r="3" fill="currentColor" />
    </svg>
    <div className="flex flex-col">
      <span className="text-lg font-bold text-slate-800 tracking-wider leading-none">
        CUBIC
      </span>
      <span className="text-[7px] tracking-[0.15em] text-slate-500 font-medium uppercase mt-0.5">
        Engineering Group
      </span>
    </div>
  </div>
);

export const LogoSeashell = ({ className = 'h-7' }) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
    <span className="text-2xl md:text-3xl font-serif italic font-bold tracking-tight text-slate-800">
      Seashell
    </span>
  </div>
);

export const LogoSwissotel = ({ className = 'h-7' }) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
    <span className="text-base md:text-lg font-medium text-slate-800 tracking-[0.2em] uppercase leading-none">
      SWISSÔTEL
    </span>
    <span className="text-[8px] tracking-[0.3em] font-normal text-slate-500 uppercase mt-1">
      EL QUSEIR
    </span>
  </div>
);

export const LogoZad = ({ className = 'h-7' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    {/* Diamond Hexagon Crest */}
    <div className="w-8 h-8 rounded-md border-2 border-slate-800 flex items-center justify-center rotate-45">
      <span className="-rotate-45 text-[10px] font-bold text-slate-800 tracking-tighter">Z</span>
    </div>
    <div className="flex flex-col">
      <span className="text-base font-bold text-slate-800 tracking-[0.25em] leading-none">
        ZAD
      </span>
      <span className="text-[7px] tracking-[0.2em] text-slate-500 uppercase font-medium mt-0.5">
        JEWELRY
      </span>
    </div>
  </div>
);
