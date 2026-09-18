import Image from "next/image";


function RotatingBadge() {
  const size = 160;
  const r = 60;
  const cx = size / 2;
  const cy = size / 2;
  const id = "badge-circle";
  const CIRCULAR_TEXT = "FRESH MEALS · LOCAL CHEFS · ORDER NOW · ";

  return (
    <div className="size-[160px]" style={{ animation: "spin-badge 14s linear infinite" }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <defs>
          <path id={id} d={`M ${cx},${cy} m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`}/>
        </defs>

        <circle cx={cx} cy={cy} r={r + 8} fill="#111c14" />
        <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="#4ade80" strokeWidth="0.8" opacity="0.5" />
        <circle cx={cx} cy={cy} r="9" fill="#4ade80" />

        <text
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="2"
          fill="#e8f5e1"
          style={{ fontFamily: "var(--font-geist-sans)" }}>
          <textPath href={`#${id}`} startOffset="0%">
            {CIRCULAR_TEXT}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

export function PromoBanner() {
  return (
    <div className="px-4 md:px-6 pb-14 md:pb-20 bg-background">
      <div className="max-w-6xl mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="relative h-[260px] md:h-[380px] rounded-2xl overflow-hidden">
            <Image
              src="/images/home1.png"
              alt="Fresh seasonal specials"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"/>
              
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5">
              <p className="text-white/70 text-xs font-medium tracking-widest uppercase mb-1">Seasonal</p>
              <p
                className="text-white font-semibold text-xl leading-tight"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                Fresh specials,
                <br />
                every day
              </p>
            </div>
          </div>

          <div className="relative h-[260px] md:h-[380px] rounded-2xl overflow-hidden">
            <Image
              src="/images/home2.png"
              alt="Chef curated meals"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5">
              <p className="text-white/70 text-xs font-medium tracking-widest uppercase mb-1">
                Chef&apos;s Pick
              </p>
              <p
                className="text-white font-semibold text-xl leading-tight"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                Curated with
                <br />
                love & skill
              </p>
            </div>
          </div>
        </div>

        <div className="absolute -top-8 right-4 md:right-auto md:left-1/2 md:-translate-x-1/2 md:-top-9 z-10">
          <RotatingBadge />
        </div>
      </div>
    </div>
  );
}
