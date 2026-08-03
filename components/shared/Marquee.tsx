"use client";

import type { ReactNode } from "react";

/**
 * Seamless ticker. The children are rendered twice and the track travels
 * exactly -50%, so the loop point is invisible.
 */
export default function Marquee({
  children,
  duration = 38,
  reverse = false,
  className,
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`marquee overflow-hidden ${className ?? ""}`}>
      <div
        className="marquee-track"
        data-dir={reverse ? "reverse" : undefined}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
