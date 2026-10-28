"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

/**
 * Lenis in root mode still drives the real window scroll position, so
 * `useScroll` from motion keeps working — we get inertia for free without
 * having to hand every scroll-linked animation a custom source.
 *
 * Mouse-and-wheel only. Lenis leaves touch scrolling native anyway, so on a
 * phone it was nothing but a requestAnimationFrame loop burning every frame.
 * Started imperatively (rather than as a <ReactLenis> wrapper) so switching it
 * on never remounts the page beneath it.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085,
      wheelMultiplier: 0.95,
      smoothWheel: true,
      anchors: true, // in-page links glide instead of jumping
    });
    return () => lenis.destroy();
  }, []);

  return children;
}
