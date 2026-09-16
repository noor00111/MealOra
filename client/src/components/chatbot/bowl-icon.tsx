export function BowlIcon({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <line x1="8.5" y1="2.5" x2="7" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14.5" y1="2" x2="13" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 10 H21 C21 10 20.5 18 12 18 C3.5 18 3 10 3 10Z" fill="currentColor" />
      <rect x="7.5" y="18" width="9" height="1.8" rx="0.9" fill="currentColor" />
      <path d="M20 4.5 L20.4 3.2 L20.8 4.5 L22.1 4.9 L20.8 5.3 L20.4 6.6 L20 5.3 L18.7 4.9 Z" fill="currentColor" opacity="0.85" />
    </svg>
  );
}
