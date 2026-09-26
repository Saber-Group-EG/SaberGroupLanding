/**
 * High-fidelity visual components faithfully recreating each photographic scene from the design:
 * - Valora Luxury Sunset Villa & Infinity Pool
 * - Behind-The-Scenes Film Shoot
 * - Asia Cosmetics Product Campaign
 * - Seashell Beach & Restaurant
 * - Swissôtel El Quseir Resort
 * - Doctors Marketing
 * - Cubic Construction
 * - Camera Lens Aperture for What We Do
 */

export const HeroSunsetVillaVisual = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
      {/* Sky & Sunset Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#203144] via-[#7d4834] to-[#f49c57]" 
        style={{
          background: 'radial-gradient(ellipse at 82% 48%, #ffeedd 0%, #ff9e47 18%, #c5532c 42%, #4a273b 72%, #141f33 100%)'
        }}
      />

      {/* Sun glow over the ocean horizon */}
      <div className="absolute right-[12%] top-[40%] w-[180px] h-[180px] rounded-full bg-gradient-to-r from-amber-100 via-orange-300 to-transparent blur-2xl opacity-90" />
      <div className="absolute right-[14%] top-[45%] w-[40px] h-[40px] rounded-full bg-white blur-md opacity-95" />

      {/* Ocean Horizon */}
      <div className="absolute top-[48%] left-0 right-0 h-[22%] bg-gradient-to-b from-[#b76239] via-[#48424b] to-[#1d2d3a] opacity-85">
        {/* Ocean sunlight reflection streak */}
        <div 
          className="absolute right-[10%] top-0 bottom-0 w-[120px] opacity-75 blur-[2px]"
          style={{
            background: 'linear-gradient(to bottom, #ffe8bf, rgba(255, 170, 80, 0.4) 60%, transparent 100%)'
          }}
        />
        {/* Subtle wave ripples */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_4px]" />
      </div>

      {/* Palm Trees on the right ocean promontory */}
      <svg className="absolute right-0 top-[26%] w-[260px] h-[360px] opacity-90 pointer-events-none" viewBox="0 0 260 360" fill="none">
        <path d="M220 360 C 210 270, 205 180, 225 90 C 228 75, 235 55, 245 40" stroke="#101820" strokeWidth="12" strokeLinecap="round"/>
        {/* Palm fronds */}
        <path d="M240 50 C 200 40, 160 60, 130 90 C 150 70, 190 55, 240 50 Z" fill="#151e28" />
        <path d="M240 50 C 210 20, 170 15, 140 30 C 165 25, 205 30, 240 50 Z" fill="#151e28" />
        <path d="M245 45 C 240 10, 210 -5, 180 0 C 205 10, 230 25, 245 45 Z" fill="#1a2533" />
        <path d="M245 50 C 265 15, 290 20, 310 35 C 285 30, 260 38, 245 50 Z" fill="#151e28" />
        <path d="M245 52 C 275 55, 305 75, 320 105 C 295 85, 265 70, 245 52 Z" fill="#151e28" />
        <path d="M240 55 C 205 75, 170 110, 155 145 C 175 120, 210 90, 240 55 Z" fill="#101820" />
      </svg>

      {/* Modern Luxury Villa Structure (Left & Middle-Upper) */}
      <div className="absolute top-0 left-0 w-[55%] h-[68%] pointer-events-none">
        {/* Villa Overhang / Ceiling with warm recessed spot lights */}
        <div className="absolute top-0 left-0 right-0 h-[38%] bg-gradient-to-r from-[#171413] via-[#241f1c] to-[#342921] shadow-2xl">
          {/* Wooden slatted ceiling detail */}
          <div className="absolute inset-0 opacity-30 bg-[linear-gradient(90deg,#000000_2px,transparent_2px)] [background-size:24px_100%]" />
          {/* Warm recessed LED spotlights */}
          <div className="absolute bottom-4 left-[20%] w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_20px_6px_rgba(255,200,100,0.8)]" />
          <div className="absolute bottom-4 left-[45%] w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_20px_6px_rgba(255,200,100,0.8)]" />
          <div className="absolute bottom-4 left-[70%] w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_20px_6px_rgba(255,200,100,0.8)]" />
        </div>

        {/* Floor to ceiling glass interior room */}
        <div className="absolute top-[38%] left-0 right-[25%] bottom-0 bg-[#281b15] border-r border-[#433027] overflow-hidden">
          {/* Golden glowing modern luxury living room inside */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3f2214] via-[#5c341c] to-[#7f4a25] opacity-90" />
          <div className="absolute right-6 top-8 w-28 h-40 bg-amber-100/20 blur-xl rounded-full" />
          {/* Vertical sleek glass mullions */}
          <div className="absolute top-0 bottom-0 left-[35%] w-[3px] bg-[#110f0e]" />
          <div className="absolute top-0 bottom-0 left-[70%] w-[3px] bg-[#110f0e]" />
          {/* Interior warm design furniture silhouette */}
          <div className="absolute bottom-0 left-6 right-6 h-14 bg-[#191310]/80 rounded-t-lg" />
        </div>

        {/* Stone column / support pillar */}
        <div className="absolute top-[38%] right-[22%] bottom-0 w-8 bg-gradient-to-r from-[#1c1816] via-[#332b26] to-[#151211] shadow-lg" />
      </div>

      {/* Infinity Swimming Pool (Middle to Bottom Right) */}
      <div className="absolute bottom-0 right-0 w-[65%] h-[46%] overflow-hidden">
        {/* Pool Water gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1b5d6e] via-[#157285] to-[#0c4250]">
          {/* Water caustic light patterns */}
          <div 
            className="absolute inset-0 opacity-40 mix-blend-screen"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, transparent 60%)',
              backgroundSize: '40px 24px'
            }}
          />
          {/* Sunset sky & warm villa glow reflections on pool surface */}
          <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-orange-400/35 via-amber-200/20 to-transparent" />
          {/* Pool rim light */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-200/80 to-white/90 shadow-[0_0_12px_rgba(255,255,255,0.7)]" />
        </div>
      </div>

      {/* Travertine Sun Deck & Outdoor Lounge Seating (Foreground Left & Center) */}
      <div className="absolute bottom-0 left-0 w-[55%] h-[36%] bg-gradient-to-t from-[#1b1716] via-[#342921] to-[#45372d] shadow-2xl">
        {/* Travertine stone tile lines */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,#000000_1px,transparent_1px),linear-gradient(0deg,#000000_1px,transparent_1px)] [background-size:60px_40px]" />

        {/* Luxury Outdoor Sunbed / Couch 1 */}
        <div className="absolute bottom-6 left-[18%] w-[160px] h-[58px] bg-[#1a1512] rounded-lg shadow-2xl border-t border-[#4f3d32] transform -rotate-1">
          {/* Plush beige cushion */}
          <div className="absolute -top-2 left-2 right-2 h-[26px] bg-gradient-to-b from-[#706456] to-[#473c32] rounded-md shadow-md">
            {/* Pillows */}
            <div className="absolute top-1 left-2 w-8 h-4 bg-[#b59e84] rounded-sm shadow" />
            <div className="absolute top-1 left-12 w-8 h-4 bg-[#8b6951] rounded-sm shadow" />
          </div>
          {/* Wooden legs */}
          <div className="absolute -bottom-2 left-3 w-3 h-2 bg-[#2d1b0f]" />
          <div className="absolute -bottom-2 right-3 w-3 h-2 bg-[#2d1b0f]" />
        </div>

        {/* Luxury Outdoor Armchair / Lounge Chair 2 */}
        <div className="absolute bottom-4 left-[55%] w-[130px] h-[64px] bg-[#15110e] rounded-lg shadow-2xl border-t border-[#534135]">
          <div className="absolute -top-2 left-2 right-2 h-[30px] bg-gradient-to-b from-[#7d7062] to-[#4f4337] rounded-md shadow">
            <div className="absolute top-1 left-2 w-7 h-5 bg-[#c2ac94] rounded-sm shadow" />
          </div>
        </div>
      </div>

      {/* Cinematic Scrim overlay so white hero text is 100% crisp & readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />
    </div>
  );
};

export const BtsShootVisual = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full bg-[#0d1017] overflow-hidden ${className}`}>
      {/* Dark studio background with cyan rim light & warm amber fill */}
      <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-cyan-600/30 blur-3xl" />
      <div className="absolute bottom-10 right-0 w-48 h-48 rounded-full bg-amber-600/20 blur-3xl" />
      
      {/* Studio Film Camera on Heavy Duty Tripod */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-[85%] h-[85%] drop-shadow-2xl" viewBox="0 0 200 320" fill="none">
          {/* Background studio lights / softbox */}
          <rect x="140" y="30" width="40" height="70" rx="4" fill="#1b2535" opacity="0.7" />
          <line x1="160" y1="100" x2="160" y2="280" stroke="#161f2c" strokeWidth="3" />
          <circle cx="160" cy="65" r="14" fill="#4fd1c5" opacity="0.25" className="blur-[4px]" />

          {/* Camera Operator Silhouette */}
          <path d="M50 180 C 40 140, 50 110, 65 95 C 75 85, 88 85, 92 95 C 95 105, 85 130, 80 160 Z" fill="#0b0e14" />
          <circle cx="78" cy="80" r="14" fill="#0b0e14" />
          {/* Headphone silhouette */}
          <path d="M68 80 C 68 70, 88 70, 88 80" stroke="#334155" strokeWidth="3" />

          {/* Cinema Camera Body (ARRI / RED style) */}
          <rect x="80" y="115" width="55" height="38" rx="4" fill="#1f2937" stroke="#374151" strokeWidth="2" />
          {/* Viewfinder / Monitor */}
          <rect x="75" y="100" width="28" height="18" rx="2" fill="#0f172a" stroke="#60a5fa" strokeWidth="1.5" />
          <rect x="77" y="102" width="24" height="14" rx="1" fill="#1e3a8a" opacity="0.8" />
          <circle cx="95" cy="106" r="2" fill="#ef4444" />

          {/* Matte Box & Cinema Lens */}
          <path d="M135 120 L 165 110 L 165 160 L 135 150 Z" fill="#111827" stroke="#4b5563" strokeWidth="1.5" />
          {/* Lens Glass Reflection */}
          <ellipse cx="165" cy="135" rx="5" ry="24" fill="url(#lensReflect)" stroke="#38bdf8" strokeWidth="1" />

          {/* Tripod Head & Heavy Legs */}
          <rect x="100" y="153" width="16" height="18" rx="3" fill="#374151" />
          <line x1="108" y1="171" x2="60" y2="300" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
          <line x1="108" y1="171" x2="108" y2="300" stroke="#111827" strokeWidth="6" strokeLinecap="round" />
          <line x1="108" y1="171" x2="160" y2="300" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />

          {/* Definitions for Gradients */}
          <defs>
            <linearGradient id="lensReflect" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Atmospheric dust & glow */}
      <div className="absolute top-1/3 left-1/2 w-32 h-32 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-xl pointer-events-none" />
    </div>
  );
};

export const ValoraArchitectureVisual = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full bg-[#121a24] overflow-hidden ${className}`}>
      {/* Twilight Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111927] via-[#1e293b] to-[#452b27]" />
      
      {/* Upscale Modern Architectural Complex */}
      <div className="absolute top-[12%] left-[10%] right-[10%] bottom-[35%] bg-[#1a2332] rounded-t-sm shadow-2xl border-t border-l border-r border-[#334155]/60 overflow-hidden">
        {/* Balconies and architectural modular tiers */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-2 p-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="relative rounded-sm bg-[#0f172a]/90 border border-amber-500/20 overflow-hidden flex flex-col justify-end p-1">
              {/* Warm interior room illumination */}
              <div className="absolute inset-0 bg-gradient-to-t from-amber-400/35 via-amber-200/15 to-transparent" />
              {/* Glass balcony balustrade */}
              <div className="h-2 w-full bg-cyan-400/20 border-t border-cyan-300/40 rounded-sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Swimming Pool with Reflections at the base */}
      <div className="absolute bottom-0 left-0 right-0 h-[38%] bg-gradient-to-b from-[#0e485e] via-[#0b647c] to-[#063340] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-cyan-300/60 shadow-[0_0_10px_#22d3ee]" />
        {/* Warm reflection ripples */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#fed7aa_1px,transparent_1px)] [background-size:20px_6px]" />
        <div className="absolute top-2 left-1/4 right-1/4 h-12 bg-gradient-to-b from-amber-300/30 to-transparent blur-sm" />
      </div>

      {/* Palm silhouettes framing */}
      <div className="absolute -bottom-4 -left-4 w-24 h-40 opacity-75">
        <svg viewBox="0 0 100 160" fill="#0a0f18">
          <path d="M10 160 Q 30 90, 70 40 Q 50 60, 10 160 Z" />
          <path d="M70 40 Q 95 20, 100 0 Q 75 25, 70 40 Z" />
          <path d="M70 40 Q 80 50, 100 60 Q 75 55, 70 40 Z" />
          <path d="M70 40 Q 50 20, 30 10 Q 55 30, 70 40 Z" />
        </svg>
      </div>
    </div>
  );
};

export const SeashellBeachVisual = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full bg-[#1b263b] overflow-hidden ${className}`}>
      {/* Sunset Coastal Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2b2d42] via-[#d90429]/40 to-[#ffb703]" />

      {/* Ocean Horizon */}
      <div className="absolute top-[40%] left-0 right-0 h-[25%] bg-gradient-to-b from-[#e07a5f]/80 via-[#2a9d8f]/80 to-[#264653]" />

      {/* Beach Club / Restaurant Wooden Pergola Deck */}
      <div className="absolute bottom-0 left-0 right-0 h-[48%] bg-gradient-to-t from-[#1f1610] via-[#3a2c21] to-[#543e2e]">
        {/* Glowing Neon Sign 'Seashell' */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-4 py-1 rounded-md bg-[#1f1610]/90 border border-amber-500/40 shadow-[0_0_20px_rgba(251,191,36,0.6)]">
          <span className="font-serif italic font-bold text-amber-300 text-sm tracking-wider drop-shadow-[0_0_8px_rgba(252,211,77,0.9)]">
            Seashell
          </span>
        </div>

        {/* String fairy lights hanging across deck */}
        <div className="absolute top-3 left-0 right-0 flex justify-around px-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_10px_#fde68a]" />
          ))}
        </div>

        {/* Restaurant Tables & Warm Amber Lanterns */}
        <div className="absolute bottom-3 left-6 right-6 flex justify-around items-end">
          <div className="w-16 h-12 bg-[#2b1e15] rounded-t border-t border-[#6b4f3b] flex justify-center pt-1">
            <div className="w-2 h-3 bg-amber-300 rounded-sm shadow-[0_0_8px_#f59e0b]" />
          </div>
          <div className="w-20 h-14 bg-[#231811] rounded-t border-t border-[#6b4f3b] flex justify-center pt-1">
            <div className="w-2.5 h-3.5 bg-amber-300 rounded-sm shadow-[0_0_10px_#f59e0b]" />
          </div>
          <div className="w-16 h-12 bg-[#2b1e15] rounded-t border-t border-[#6b4f3b] flex justify-center pt-1">
            <div className="w-2 h-3 bg-amber-300 rounded-sm shadow-[0_0_8px_#f59e0b]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CosmeticsVisual = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full bg-[#faedec] overflow-hidden ${className}`}>
      {/* Studio Backdrop & Soft Rose/Blush Ambient Light */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#edd5d1] via-[#f7e7e5] to-[#fff6f5]" />
      
      {/* Soft spotlight behind bottles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-white/70 blur-2xl" />

      {/* Display Pedestals / Travertine Slabs */}
      <div className="absolute bottom-0 left-0 right-0 h-[28%] bg-gradient-to-t from-[#d9beba] to-[#edd6d2] border-t border-[#e8ceca] shadow-inner" />
      
      {/* Center Pedestal Elevation */}
      <div className="absolute bottom-[24%] left-[30%] right-[30%] h-8 bg-gradient-to-b from-[#f2dedb] to-[#dfc4c0] rounded-t-sm shadow-md border-t border-white/60" />

      {/* Skincare Bottles & Dropper Vials */}
      <div className="absolute inset-0 flex items-end justify-center pb-8 gap-3">
        {/* Left tall pump bottle */}
        <div className="flex flex-col items-center">
          <div className="w-3 h-4 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 rounded-t-sm" />
          <div className="w-8 h-28 bg-gradient-to-r from-[#e39c8c] via-[#f4b6a8] to-[#ce8676] rounded-t-md shadow-xl border border-white/40 flex flex-col justify-between p-1">
            <div className="w-full h-4 bg-white/30 rounded-xs mt-4" />
            <div className="w-3 h-1 bg-amber-800/40 self-center mb-2" />
          </div>
        </div>

        {/* Center luxury serum bottle with pipette dropper */}
        <div className="flex flex-col items-center z-10">
          <div className="w-3 h-5 bg-stone-900 rounded-t-full shadow" />
          <div className="w-5 h-3 bg-gradient-to-r from-amber-300 via-amber-100 to-amber-400 rounded-xs" />
          <div className="w-10 h-22 bg-gradient-to-r from-[#1c1917] via-[#292524] to-[#0c0a09] rounded-md shadow-2xl border border-amber-400/30 flex flex-col justify-center items-center p-1">
            <div className="w-6 h-9 bg-white/10 rounded-xs border border-amber-300/40 flex items-center justify-center">
              <span className="text-[6px] tracking-widest text-amber-200 font-serif">ASIA</span>
            </div>
          </div>
        </div>

        {/* Right skincare cream jar */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-3 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 rounded-t-sm shadow" />
          <div className="w-14 h-16 bg-gradient-to-r from-[#f0c2b7] via-[#fad6ce] to-[#dfaba0] rounded-b-md shadow-xl border border-white/50" />
        </div>
      </div>
    </div>
  );
};

export const SwissotelVisual = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full bg-[#16202c] overflow-hidden ${className}`}>
      {/* Evening Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#382627]" />

      {/* Resort Palace Facade with Moorish / Nubian Architectural Arches */}
      <div className="absolute top-[18%] left-[8%] right-[8%] bottom-[36%] bg-[#221c1b] rounded-t-md border-t border-[#4f3b37] overflow-hidden shadow-2xl">
        <div className="absolute inset-0 flex justify-around pt-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-14 h-24 bg-gradient-to-t from-amber-500/35 via-amber-300/20 to-transparent rounded-t-full border-t-2 border-l border-r border-amber-400/40 relative">
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_8px_#fde68a]" />
            </div>
          ))}
        </div>
      </div>

      {/* Grand Illuminated Blue Swimming Pool */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-[#075985] overflow-hidden">
        {/* Pool rim light */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-200 shadow-[0_0_12px_#38bdf8]" />
        {/* Warm reflection columns */}
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-around opacity-40">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-10 h-full bg-gradient-to-b from-amber-300/60 to-transparent blur-[2px]" />
          ))}
        </div>
        {/* Sun loungers & parasols silhouette at pool side */}
        <div className="absolute bottom-2 left-4 flex gap-4 opacity-80">
          <div className="w-8 h-3 bg-[#0a121e] rounded-xs" />
          <div className="w-8 h-3 bg-[#0a121e] rounded-xs" />
        </div>
      </div>
    </div>
  );
};

export const DoctorsVisual = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full bg-[#111e2e] overflow-hidden ${className}`}>
      {/* High-tech hospital clinic lighting */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#091522] via-[#102a43] to-[#1e4e75]" />
      <div className="absolute top-1/4 right-1/4 w-36 h-36 rounded-full bg-cyan-400/20 blur-2xl" />

      {/* Doctor & Medical Team Silhouettes */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-[85%] h-[85%] drop-shadow-2xl" viewBox="0 0 200 300" fill="none">
          {/* Medical cross glow watermark */}
          <path d="M90 60 H110 V80 H130 V100 H110 V120 H90 V100 H70 V80 H90 Z" fill="#38bdf8" opacity="0.12" />

          {/* Doctor 1 (Left - Consultation with clipboard/tablet) */}
          <circle cx="65" cy="110" r="18" fill="#e2e8f0" opacity="0.9" />
          <path d="M40 180 C 40 140, 50 135, 65 135 C 80 135, 90 140, 90 180 Z" fill="#ffffff" />
          {/* Stethoscope */}
          <path d="M56 138 C 56 156, 74 156, 74 138" stroke="#0284c7" strokeWidth="2.5" fill="none" />
          <circle cx="65" cy="158" r="3.5" fill="#0369a1" />

          {/* Doctor 2 (Right - Senior Specialist) */}
          <circle cx="135" cy="95" r="20" fill="#e2e8f0" opacity="0.95" />
          <path d="M105 170 C 105 125, 118 120, 135 120 C 152 120, 165 125, 165 170 Z" fill="#f8fafc" />
          {/* Cyan tablet glow */}
          <rect x="95" y="150" width="30" height="42" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" transform="rotate(-15 95 150)" />
          <rect x="97" y="152" width="26" height="38" rx="2" fill="#0284c7" opacity="0.6" transform="rotate(-15 97 152)" />
        </svg>
      </div>
    </div>
  );
};

export const CubicConstructionVisual = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full bg-[#18212c] overflow-hidden ${className}`}>
      {/* Construction Sky & Crane Silhouette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1b2a3d] via-[#2f435a] to-[#475569]" />
      
      {/* Architectural Grid / Blueprints */}
      <div className="absolute inset-0 opacity-15 bg-[linear-gradient(90deg,#38bdf8_1px,transparent_1px),linear-gradient(0deg,#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Engineer Silhouette with Blue Hard Hat */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-[85%] h-[85%] drop-shadow-2xl" viewBox="0 0 200 300" fill="none">
          {/* Construction crane in background */}
          <line x1="30" y1="50" x2="170" y2="50" stroke="#64748b" strokeWidth="2" />
          <line x1="60" y1="50" x2="60" y2="220" stroke="#475569" strokeWidth="4" />
          <line x1="60" y1="50" x2="160" y2="90" stroke="#64748b" strokeWidth="1.5" />

          {/* Safety Hard Hat (Blue) */}
          <ellipse cx="100" cy="115" rx="26" ry="12" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
          <path d="M78 115 C 78 95, 122 95, 122 115 Z" fill="#0369a1" />

          {/* Engineer Head & Profile */}
          <circle cx="100" cy="128" r="16" fill="#cbd5e1" />
          
          {/* High-Vis Vest & Jacket */}
          <path d="M65 210 C 65 155, 80 150, 100 150 C 120 150, 135 155, 135 210 Z" fill="#334155" />
          {/* High-vis yellow stripes */}
          <path d="M80 155 L 75 210 M 120 155 L 125 210" stroke="#eab308" strokeWidth="6" />

          {/* Rolled Blueprint */}
          <rect x="115" y="165" width="45" height="12" rx="4" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" transform="rotate(-30 115 165)" />
        </svg>
      </div>
    </div>
  );
};

export const CameraLensApertureVisual = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Dark metallic vignette */}
      <div className="absolute inset-0 bg-[#07090b]" />

      {/* Large Camera Lens Element with aperture blades and glass reflections */}
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-60">
        {/* Outer barrel ring */}
        <div className="absolute inset-0 rounded-full border-[18px] border-[#181c22] shadow-[inset_0_0_80px_rgba(0,0,0,0.9)]" />
        {/* Focus ring knurling texture */}
        <div className="absolute inset-6 rounded-full border-[6px] border-dashed border-[#2b323c] opacity-40" />
        {/* Glass reflection ring 1 */}
        <div className="absolute inset-14 rounded-full border-[2px] border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.15)]" />
        {/* Glass reflection ring 2 */}
        <div className="absolute inset-28 rounded-full border-[3px] border-amber-500/15" />
        {/* Glass reflection ring 3 */}
        <div className="absolute inset-44 rounded-full border-[2px] border-rose-500/15" />

        {/* Multi-blade aperture iris */}
        <svg className="absolute inset-56 w-[250px] h-[250px]" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="95" stroke="#1c2430" strokeWidth="4" />
          {/* Overlapping aperture blades */}
          <path d="M100 5 L 180 60 L 140 140 Z" fill="#0d1117" stroke="#2a3441" strokeWidth="1.5" />
          <path d="M180 60 L 160 160 L 80 160 Z" fill="#0d1117" stroke="#2a3441" strokeWidth="1.5" />
          <path d="M160 160 L 70 180 L 40 100 Z" fill="#0d1117" stroke="#2a3441" strokeWidth="1.5" />
          <path d="M70 180 L 20 100 L 60 30 Z" fill="#0d1117" stroke="#2a3441" strokeWidth="1.5" />
          <path d="M20 100 L 60 30 L 150 20 Z" fill="#0d1117" stroke="#2a3441" strokeWidth="1.5" />
          {/* Aperture center opening */}
          <polygon points="100,65 130,85 125,120 90,125 75,95" fill="#05070a" />
        </svg>

        {/* Optical Glass Lens Flare Refractions */}
        <div 
          className="absolute inset-20 rounded-full opacity-35 mix-blend-screen pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 35% 30%, rgba(56, 189, 248, 0.4) 0%, rgba(168, 85, 247, 0.2) 35%, transparent 70%)'
          }}
        />
        <div 
          className="absolute inset-32 rounded-full opacity-30 mix-blend-screen pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 65% 70%, rgba(245, 158, 11, 0.35) 0%, transparent 60%)'
          }}
        />
      </div>
    </div>
  );
};
