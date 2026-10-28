"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Visibility-gated playback for a decorative background <video>.
 *
 *   1. near the viewport  — only then is a single byte requested
 *   2. actually on screen — play; otherwise pause and hand the bandwidth to
 *                           whatever the reader is really looking at
 *
 * Playback is asked for as soon as the clip is on screen, and the browser
 * starts it the moment it has frames. Waiting for `canplaythrough` instead
 * looked safer but never fired on slow links or iOS Safari (which won't
 * buffer ahead until play() is called), so clips sat on their posters.
 *
 * The jerk at the top of a clip is hidden rather than waited out: the video
 * stays transparent over its poster until `playing` fires — real frames are
 * moving — and only then cross-fades up.
 */
export default function useInViewVideo(preloadMargin = "600px") {
  const ref = useRef<HTMLVideoElement | null>(null);
  const onScreen = useRef(false);
  const armed = useRef(false);
  const [ready, setReady] = useState(false);

  /* The single place that decides whether this clip should be running. */
  const sync = useCallback(() => {
    const el = ref.current;
    if (!el || !armed.current) return;
    if (onScreen.current) {
      // rejected in e.g. iOS Low Power Mode — the poster simply stays up
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, []);

  const onPlaying = useCallback(() => setReady(true), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Reduced-motion readers get the poster and nothing else. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* Start fetching before it arrives, so by the time it is on screen the
       first frames are already decoded. */
    const warm = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.preload = "auto";
        el.load();
        armed.current = true;
        warm.disconnect();
        sync();
      },
      { rootMargin: preloadMargin }
    );

    const gate = new IntersectionObserver(
      ([entry]) => {
        onScreen.current = entry.isIntersecting;
        sync();
      },
      { threshold: 0.15 }
    );

    warm.observe(el);
    gate.observe(el);
    return () => {
      warm.disconnect();
      gate.disconnect();
    };
  }, [preloadMargin, sync]);

  return { ref, ready, onPlaying };
}
