"use client";

import { useEffect, useState } from "react";

/**
 * True only on wide, pointer-precise screens.
 *
 * Scroll-linked transforms are computed in JS a frame behind the compositor.
 * On desktop (smooth wheel, rAF-synced) that is invisible; on touch, momentum
 * scrolling coalesces scroll events and the correction lands late enough to
 * read as judder. So parallax is gated behind this everywhere.
 */
export default function useDesktop() {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px) and (pointer: fine)");
    const sync = () => setDesktop(mq.matches);
    const raf = requestAnimationFrame(sync);
    mq.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", sync);
    };
  }, []);

  return desktop;
}
