"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import MountainMark from "@/components/shared/MountainMark";

const EASE = [0.16, 1, 0.3, 1] as const;
const TITLE = "VIBE WITH YOGI";

/* Two frames, no cropping games: a true 9:16 portrait fills a phone screen
   almost edge to edge, and the landscape frame takes over from `sm` up. */
const FRAME_WIDE = "/photos/thar.jpg";
const FRAME_TALL = "/photos/hero-portrait.jpg";

/* Words alternate the side they arrive from, so the wordmark closes in on
   itself from both edges rather than rising. */
const WORDS = TITLE.split(" ").map((word, i) => ({
  word,
  from: i % 2 === 0 ? "-105%" : "105%",
}));

/**
 * Fires once, the moment the page is first scrolled. Used instead of a
 * scroll-linked value so the reveal is a plain compositor animation.
 */
function useFirstScroll() {
  const [fired, setFired] = useState(false);
  useEffect(() => {
    if (fired) return;
    const check = () => {
      // the smallest nudge is enough — the reveal is time-based from there
      if (window.scrollY > 2) {
        setFired(true);
        window.removeEventListener("scroll", check);
      }
    };
    window.addEventListener("scroll", check, { passive: true });
    // covers a reload that restores a scrolled position
    const raf = requestAnimationFrame(check);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", check);
    };
  }, [fired]);
  return fired;
}

/** True only on pointer-precise, wide screens — where parallax is safe. */
function useDesktop() {
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

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const revealed = useFirstScroll();
  const desktop = useDesktop();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  /* Scroll-linked movement is DESKTOP ONLY.
     On a phone the browser scrolls the page on the compositor while a
     scroll-linked transform is computed in JS a frame later — and because
     touch momentum coalesces scroll events, that correction always arrives
     late. The result is an image that visibly shudders against the scroll.
     So on touch the frame gets no transform at all: it is simply still. */
  const frameScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const frameY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const plate = desktop ? { scale: frameScale, y: frameY } : undefined;

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#05070a]"
    >
      {/* --- 1. the frame — dead still on touch ---------------------------- */}
      <motion.div style={plate} className="absolute inset-0 z-0 sm:will-change-transform">
        <Image
          src={FRAME_TALL}
          alt="Yogi above the snowline"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[52%_42%] brightness-[0.78] contrast-[1.12] saturate-[0.92] sm:hidden"
        />
        <Image
          src={FRAME_WIDE}
          alt="Yogi and his Thar on a ridge road under snow peaks"
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-[52%_46%] brightness-[0.74] contrast-[1.14] saturate-[0.9] sm:block"
        />
      </motion.div>

      {/* --- 2. the wordmark — one-shot, triggered by the first scroll ------ */}
      {/* sits a little lower on laptop/desktop, where there is more sky */}
      <div className="pointer-events-none absolute inset-x-0 top-[11%] z-[1] px-4 sm:top-[17%] sm:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="pointer-events-none absolute left-1/2 top-[38%] h-[46vw] w-[86vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse,rgba(150,190,225,0.3),rgba(120,160,200,0.08)_45%,transparent_70%)] blur-[6px]"
        />
        <h1 className="relative mx-auto flex max-w-[5.2em] flex-wrap justify-center gap-x-[0.08em] font-[family-name:var(--font-anton)] text-[clamp(3.6rem,10.8vw,11rem)] uppercase leading-[0.88] tracking-[0.005em] sm:max-w-none">
          {WORDS.map(({ word, from }, w) => (
            <span key={word} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                initial={{ x: from }}
                animate={{ x: revealed ? "0%" : from }}
                transition={{ duration: 0.62, delay: w * 0.06, ease: EASE }}
                className="block bg-[linear-gradient(to_bottom,#ffffff_28%,#e8f1f9_70%,#c9dcea_100%)] bg-clip-text text-transparent will-change-transform"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>
      </div>

      {/* --- 3. grade ------------------------------------------------------ */}
      <div className="pointer-events-none absolute inset-0 z-[3] bg-[linear-gradient(to_top,#05070a_1%,rgba(5,7,10,0.72)_20%,rgba(5,10,18,0.26)_48%,rgba(5,10,18,0.04)_74%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(145%_115%_at_50%_76%,transparent_52%,rgba(3,5,8,0.6)_100%)]" />

      {/* --- 4. chrome ----------------------------------------------------- */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between px-6 py-6 sm:px-10 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: EASE }}
          className="flex items-start gap-3"
        >
          <MountainMark className="mt-[-3px] shrink-0 text-[#eef5fb]" size={30} />
          <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.26em] text-[#c9dcea]/60">
            Solo traveller
            <br />
            <span className="text-[#c9dcea]/35">Himalaya, on repeat</span>
          </p>
        </motion.div>

        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end sm:gap-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1 }}
            className="max-w-[30ch] font-mono text-[10px] uppercase leading-[1.9] tracking-[0.2em] text-[#c9dcea]/45"
          >
            N 30°26′ · E 79°34′
            <br />
            4,200 m — first light, no one else on the ridge
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: revealed ? 0 : 1 }}
            transition={{ duration: 0.8, delay: revealed ? 0 : 1.2 }}
            className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.26em] text-[#c9dcea]/55"
          >
            <span className="scroll-cue block h-8 w-px bg-gradient-to-b from-transparent via-[#4d9bff] to-transparent" />
            Scroll to begin
          </motion.div>
        </div>
      </div>
    </section>
  );
}
