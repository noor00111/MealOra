export function SalesChart({ data, days }: { data: number[]; days: string[] }) {
  const VW = 520, VH = 170, padL = 38, padB = 24, padT = 10, padR = 12;
  const cW = VW - padL - padR, cH = VH - padT - padB;
  const maxVal = Math.max(...data, 1);
  const X = (i: number) => padL + (i / (data.length - 1)) * cW;
  const Y = (v: number) => padT + cH - (v / (maxVal * 1.15)) * cH;

  function smoothPath(points: [number, number][]): string {
    if (points.length < 2) return `M${points[0][0]},${points[0][1]}`;
    let d = `M ${points[0][0]},${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      const p0 = points[Math.max(i - 2, 0)];
      const p1 = points[i - 1];
      const p2 = points[i];
      const p3 = points[Math.min(i + 1, points.length - 1)];
      const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
      const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0]},${p2[1]}`;
    }
    return d;
  }

  const pts = data.map((v, i) => [X(i), Y(v)] as [number, number]);
  const linePath = smoothPath(pts);
  const areaPath = `${linePath} L ${X(data.length - 1)},${padT + cH} L ${padL},${padT + cH} Z`;

  const yTicks = [0, Math.round(maxVal * 0.33), Math.round(maxVal * 0.66), Math.round(maxVal)];

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ height: VH }}>
      <defs>
        <linearGradient id="sales-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </linearGradient>
      </defs>

      {yTicks.map((tick) => (
        <g key={tick}>
          <line x1={padL} y1={Y(tick)} x2={VW - padR} y2={Y(tick)}
            stroke="currentColor" strokeOpacity="0.07" strokeWidth="1" strokeDasharray="3 3" />
          <text x={padL - 5} y={Y(tick) + 4} textAnchor="end" fontSize="9" fill="currentColor" opacity="0.45">
            ${tick}
          </text>
        </g>
      ))}

      <path d={areaPath} fill="url(#sales-area)" />
      <path d={linePath} fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {pts.map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r="3" fill="white" stroke="#f97316" strokeWidth="1.5" />
      ))}
      {days.map((day, i) => (
        <text key={i} x={X(i)} y={VH - 5} textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.45">
          {day}
        </text>
      ))}
    </svg>
  );
}
