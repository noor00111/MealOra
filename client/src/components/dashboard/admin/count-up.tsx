import { useEffect, useState } from "react";

export function CountUp({ to, decimals = 0 }: { to: number; decimals?: number }) {
  
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (to === 0) return;
    const dur = 1000;
    const start = performance.now();
    let frame: number;
    function tick(now: number) {
      const t = Math.min((now - start) / dur, 1);
      setVal((1 - Math.pow(1 - t, 3)) * to);
      if (t < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to]);

  const shown = to === 0 ? 0 : val;
  return <>{decimals > 0 ? shown.toFixed(decimals) : Math.round(shown).toLocaleString()}</>;
}
