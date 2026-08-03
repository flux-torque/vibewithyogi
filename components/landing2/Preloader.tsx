"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const EASE = [0.76, 0, 0.24, 1] as const;

/** Counts up, then splits away like a shutter. Holds scroll while it runs. */
export default function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";

    const start = performance.now();
    const dur = 1700;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      setCount(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 260);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      html.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    if (done) document.documentElement.style.overflow = "";
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#05070a] px-6 py-6 sm:px-10 sm:py-8"
          exit={{ y: "-100%" }}
          transition={{ duration: 1.05, ease: EASE }}
        >
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.28em] text-[#c9dcea]/50">
            <span>Vibe with Yogi</span>
            <span>Himalaya / 2026</span>
          </div>

          <div className="flex items-end justify-between">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="max-w-[22ch] font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-[#c9dcea]/40"
            >
              Loading the route
            </motion.p>
            <p className="font-[family-name:var(--font-anton)] text-[18vw] leading-[0.78] tracking-[-0.02em] text-[#eef5fb] sm:text-[13vw]">
              {String(count).padStart(3, "0")}
            </p>
          </div>

          <div className="relative h-px w-full bg-[#c9dcea]/12">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[#4d9bff]"
              style={{ width: `${count}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
