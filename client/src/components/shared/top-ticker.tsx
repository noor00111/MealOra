"use client";

export function TopTicker() {
  const ITEMS = [
  { text: "Trending Food", emoji: "🍔", outline: true },
  { text: "Food Combo Offer", emoji: "🍕", outline: false },
  { text: "Fresh Daily Meals", emoji: "🥗", outline: true },
  { text: "Local Chefs", emoji: "🍛", outline: false },
  { text: "Chef's Special", emoji: "🍜", outline: true },
  { text: "Order Now", emoji: "🍗", outline: false },
];
const REPEATED = [...ITEMS, ...ITEMS];

  return (
    <div className="w-full overflow-hidden border-b border-border/50 h-36 flex items-center mb-10">
      <div
        className="flex items-center gap-0 whitespace-nowrap w-max"
        style={{ animation: "marquee 36s linear infinite" }}>
        {REPEATED.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-8">
            {item.outline ? (
              <span
                className="text-[4rem] font-bold leading-none tracking-tight select-none"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontStyle: "italic",
                  WebkitTextStroke: "0.8px var(--brand-green)",
                  color: "transparent",
                }}>
                {item.text}
              </span>
            ) : (
              <span
                className="text-[4rem] font-bold leading-none tracking-tight select-none"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontStyle: "italic",
                  WebkitTextStroke: "1px gray",
                  color: "transparent",
                }}>
                {item.text}
              </span>
            )}
            <span className="text-5xl leading-none">{item.emoji}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
