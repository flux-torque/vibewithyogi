"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Lenis in root mode still drives the real window scroll position, so
 * `useScroll` from motion keeps working — we get inertia for free without
 * having to hand every scroll-linked animation a custom source.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.085,
        wheelMultiplier: 0.95,
        smoothWheel: true,
        touchMultiplier: 1.6,
        anchors: true, // in-page links glide instead of jumping
      }}
    >
      {children}
    </ReactLenis>
  );
}
