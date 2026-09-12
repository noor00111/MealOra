import Link from "next/link";

export function HowItWorks() {
  
const STEPS = [
  { step: "01", title: "Discover", desc: "Explore menus from skilled local cooks near you" },
  { step: "02", title: "Order", desc: "Pick your favourites and check out in seconds" },
  { step: "03", title: "Enjoy", desc: "Fresh, handcrafted food arrives at your door" },
];


  return (
    <div className="py-16 md:py-20 px-6 bg-background">
      <div className="max-w-3xl mx-auto text-center space-y-10">
        <h2
          className="text-foreground leading-tight"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: "clamp(1.75rem, 4vw, 2.6rem)",
            fontWeight: 500,
          }}>
          Your Mood. Your Meal!
        </h2>

        <div className="grid grid-cols-3 gap-6 md:gap-10">
          {STEPS.map(({ step, title, desc }) => (
            <div key={step} className="flex flex-col items-center gap-2 text-center">
              <span className="text-xs font-bold tracking-widest text-primary">{step}</span>
              <p className="font-semibold text-foreground text-sm md:text-base">{title}</p>
              <p className="text-muted-foreground text-xs md:text-sm leading-snug">{desc}</p>
            </div>
          ))}
        </div>

        <Link
          href="/meals"
          className="inline-flex items-center px-8 py-3 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 hover:-translate-y-px transition-all duration-200 shadow-sm">
          Find Something Tasty
        </Link>
      </div>
    </div>
  );
}
