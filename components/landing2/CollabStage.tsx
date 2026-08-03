"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { FadeUp, MaskLinesInView } from "@/components/shared/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

/* The cut clips, in play order. `hold` is how long each one owns the stage —
   its own length, so nothing is ever cut off mid-shot. */
const CLIPS = [
  { brand: "Barefoot Trekians", src: "barefoot", hold: 4000, wide: false },
  { brand: "JBL", src: "jbl-1", hold: 3000, wide: false },
  { brand: "Mountrev", src: "mountrev", hold: 4000, wide: true },
  { brand: "Mountain Dew", src: "mountaindew", hold: 4000, wide: false },
  { brand: "CarryPro", src: "carrypro", hold: 3000, wide: false },
  { brand: "Riddhi Dogra", src: "riddhi", hold: 7000, wide: false },
  { brand: "Mahindra", src: "mahindra", hold: 5000, wide: false },
  { brand: "Ellora's Melting Moments", src: "ellora", hold: 6000, wide: false },
  { brand: "Social Stays", src: "socialstays", hold: 4000, wide: false },
  { brand: "JBL", src: "jbl-2", hold: 2000, wide: false },
];

/* Sorted, as asked. */
const BRANDS = [
  { name: "Barefoot Trekians", tag: "Trek partner" },
  { name: "CarryPro", tag: "Camera carry" },
  { name: "Ellora's Melting Moments", tag: "Dessert brand" },
  { name: "JBL", tag: "Audio" },
  { name: "Mahindra", tag: "Vehicle partner" },
  { name: "Mountain Dew", tag: "Beverage" },
  { name: "Mountrev", tag: "Expedition rentals" },
  { name: "Riddhi Dogra", tag: "On-screen collab" },
  { name: "Social Stays", tag: "Stays" },
];

/** The run of `n` portrait clips ending at `end`, wrapping the list. */
function portraitRun(end: number, n: number) {
  const out: number[] = [];
  const L = CLIPS.length;
  for (let step = 0; out.length < n && step < L * 2; step++) {
    const j = ((end - step) % L + L) % L;
    if (!CLIPS[j].wide && !out.includes(j)) out.unshift(j);
  }
  return out;
}

export default function CollabStage() {
  const [cursor, setCursor] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  /* How many 9:16 clips it takes to fill the stage.
     A vertical reel must never be stretched past 9:16, so instead of letting
     one clip sprawl across the whole panel we run however many fit — the
     stage always ends up full, and every clip stays portrait. */
  const [slots, setSlots] = useState(2);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (!r.height) return;
      const portraitWidth = r.height * 0.5625;
      setSlots(Math.min(5, Math.max(2, Math.ceil(r.width / portraitWidth))));
    };
    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  // each clip hands over to the next when its own run is done
  useEffect(() => {
    const t = setTimeout(
      () => setCursor((c) => (c + 1) % CLIPS.length),
      CLIPS[cursor].hold
    );
    return () => clearTimeout(t);
  }, [cursor]);

  /* Mountrev is the only landscape cut — it takes the stage alone. Every
     other reel is 9:16 and runs in a row that fills the panel. */
  const onStage = CLIPS[cursor].wide ? [cursor] : portraitRun(cursor, slots);

  const live = new Set(onStage.map((i) => CLIPS[i].brand));

  return (
    <section
      id="collabs"
      className="relative border-t border-[#c9dcea]/10 bg-[#05070a] px-4 py-24 sm:px-6 lg:px-10 lg:py-32"
    >
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6 px-2">
        <h2 className="font-[family-name:var(--font-anton)] text-[clamp(1.9rem,5vw,4.2rem)] uppercase leading-[1.06] text-[#eef5fb]">
          <MaskLinesInView lines={["Worked with"]} />
        </h2>
        <FadeUp delay={0.12}>
          <p className="max-w-[40ch] text-sm leading-relaxed text-[#c9dcea]/55">
            Real cuts from the campaigns. Whatever is running on the left is
            lit up on the right.
          </p>
        </FadeUp>
      </div>

      <div className="relative grid gap-10 lg:grid-cols-[1.85fr_1fr] lg:gap-0">
        {/* the seam — a gradient, not a rule */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[65%] top-0 hidden h-full w-[180px] -translate-x-1/2 bg-[linear-gradient(to_right,transparent,rgba(77,155,255,0.16)_45%,rgba(77,155,255,0.16)_55%,transparent)] blur-[2px] lg:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 h-[120px] -translate-y-1/2 bg-[linear-gradient(to_bottom,transparent,rgba(77,155,255,0.14),transparent)] blur-[2px] lg:hidden"
        />

        {/* ---- stage ---------------------------------------------------- */}
        <div className="relative lg:pr-14">
          {/* --stage-h drives both the height and the portrait width cap */}
          <div
            ref={stageRef}
            className="flex h-[var(--stage-h)] justify-center gap-2.5 [--stage-h:max(46vh,300px)] sm:gap-3 sm:[--stage-h:54vh] lg:[--stage-h:min(64vh,560px)]"
          >
            <AnimatePresence initial={false}>
              {onStage.map((i) => {
                const clip = CLIPS[i];
                return (
                  <motion.div
                    key={`${clip.src}-${i}`}
                    initial={{ flexGrow: 0.0001, opacity: 0 }}
                    animate={{ flexGrow: 1, opacity: 1 }}
                    exit={{ flexGrow: 0.0001, opacity: 0 }}
                    transition={{ duration: 0.85, ease: EASE }}
                    className={`relative h-full min-w-0 basis-0 overflow-hidden rounded-sm bg-[#0a0e14] ${
                      // a 9:16 clip can never grow wider than 9:16
                      clip.wide ? "" : "max-w-[calc(var(--stage-h)*0.5625)]"
                    }`}
                  >
                    <video
                      src={`/video/collab/${clip.src}.mp4`}
                      poster={`/video/collab/${clip.src}.jpg`}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(5,7,10,0.75),transparent_42%)]" />
                    <span className="absolute bottom-3 left-3 whitespace-nowrap bg-[#eef5fb] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[#1662c4]">
                      {clip.brand}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* progress ticks, one per clip */}
          <div className="mt-4 flex gap-1.5">
            {CLIPS.map((c, i) => (
              <span
                key={`${c.src}-${i}`}
                className={`h-px flex-1 transition-colors duration-500 ${
                  onStage.includes(i) ? "bg-[#4d9bff]" : "bg-[#c9dcea]/15"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ---- brand list ------------------------------------------------ */}
        <div className="relative lg:pl-14">
          {BRANDS.map((b) => {
            const active = live.has(b.name);
            return (
              <div
                key={b.name}
                data-cursor="hover"
                className="group relative flex items-center justify-between gap-4 py-3 sm:py-3.5"
              >
                <div className="flex items-center gap-4">
                  <motion.span
                    animate={{ opacity: active ? 1 : 0.25 }}
                    transition={{ duration: 0.5 }}
                    className={`w-11 shrink-0 font-[family-name:var(--font-anton)] text-xl uppercase leading-none transition-colors duration-500 sm:text-2xl ${
                      active ? "text-[#4d9bff]" : "text-[#c9dcea]"
                    }`}
                  >
                    {b.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </motion.span>
                  <div>
                    <p
                      className={`text-[14px] font-medium leading-tight transition-colors duration-500 sm:text-[15px] ${
                        active ? "text-[#f4f9ff]" : "text-[#eef5fb]/55"
                      }`}
                    >
                      {b.name}
                    </p>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[#c9dcea]/40">
                      {b.tag}
                    </p>
                  </div>
                </div>

                <span className="flex h-2 w-2 shrink-0 items-center justify-center">
                  {active && (
                    <motion.span
                      layoutId="live-dot"
                      className="block h-1.5 w-1.5 rounded-full bg-[#4d9bff]"
                    />
                  )}
                </span>

                {/* the lit row draws its own underline */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[#c9dcea]/12" />
                <motion.span
                  animate={{ scaleX: active ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-[#4d9bff]"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
