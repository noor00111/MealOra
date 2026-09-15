export function Sparkline({ data, color, id }: { data: number[]; color: string; id: string }) {
 
  const W = 80, H = 32, pad = 3;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const x = (i: number) => (i / (data.length - 1)) * W;
  const y = (v: number) => H - pad - ((v - min) / range) * (H - pad * 2);
  const pts = data.map((v, i) => [x(i), y(v)] as [number, number]);
  const line = `M ${pts.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(" L ")}`;
  const area = `${line} L ${W},${H} L 0,${H} Z`;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.5" fill={color} />
    </svg>
  );
}
