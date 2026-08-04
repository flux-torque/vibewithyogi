"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Visibility-gated playback for a decorative background <video>.
 *
 * The stutter at the top of a clip comes from letting it start before it can
 * actually run. Three things have to line up, and skipping the middle one is
 * what you see as a jerk:
 *
 *   1. near the viewport  — only then is a single byte requested
 *   2. buffered enough    — readyState 4, so playback won't stall a frame in
 *   3. actually on screen — otherwise pause and hand the bandwidth to
 *                           whatever the reader is really looking at
 *
 * `ready` flips once (2) holds, so the caller can cross-fade from the poster
 * instead of popping.
 */
export default function useInViewVideo(preloadMargin = "600px") {
  const ref = useRef<HTMLVideoElement | null>(null);
  const onScreen = useRef(false);
  const [ready, setReady] = useState(false);

  /* The single place that decides whether this clip should be running. */
  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // HAVE_ENOUGH_DATA — anything less and we would be starting into a stall
    if (onScreen.current && el.readyState >= 4) {
      void el.play().catch(() => {});
    } else if (!onScreen.current) {
      el.pause();
    }
  }, []);

  const onCanPlayThrough = useCallback(() => {
    setReady(true);
    sync();
  }, [sync]);

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
        warm.disconnect();
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

  return { ref, ready, onCanPlayThrough };
}
