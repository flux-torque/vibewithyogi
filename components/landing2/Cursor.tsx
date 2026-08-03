"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Difference-blended follower. Any element carrying `data-cursor="hover"`
 * swells the ring while the pointer is over it.
 */
export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.4 });
  const [big, setBig] = useState(false);

  useEffect(() => {
    // Touch devices never see it (CSS hides it), so don't bother listening.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      setBig(Boolean(el?.closest('[data-cursor="hover"]')));
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden mix-blend-difference [@media(pointer:fine)]:block"
      style={{ x: sx, y: sy }}
    >
      <motion.span
        className="block rounded-full border border-white"
        animate={{
          width: big ? 78 : 16,
          height: big ? 78 : 16,
          margin: big ? -39 : -8,
          backgroundColor: big ? "rgba(255,255,255,0)" : "rgba(255,255,255,1)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      />
    </motion.div>
  );
}
