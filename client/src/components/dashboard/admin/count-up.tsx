import { useEffect, useState } from "react";

export function CountUp({ to, decimals = 0 }: { to: number; decimals?: number }) {
  
  const [val, setVal] = useState(0);
  
  useEffect(() => {
    if (to === 0) { setVal(0); return; }
    const dur = 1000;
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min((now - start) / dur, 1);
      setVal((1 - Math.pow(1 - t, 3)) * to);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [to]);
  return <>{decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString()}</>;
}
