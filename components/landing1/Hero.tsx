"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Magnetic from "@/components/shared/Magnetic";
import { MaskLines, EASE } from "@/components/shared/Reveal";

const CHIPS = ["Winter Spiti", "Solo & small-group", "Thar 4x4 convoys"];

/** Pointer parallax: one shared pair of springs, each layer scales it. */
function usePointerParallax() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const cfg = { stiffness: 45, damping: 18, mass: 0.7 };
  return {
    sx: useSpring(x, cfg),
    sy: useSpring(y, cfg),
    onMove: (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX / window.innerWidth - 0.5);
      y.set(e.clientY / window.innerHeight - 0.5);
    },
    reset: () => {
      x.set(0);
      y.set(0);
    },
  };
}

const useShift = (mv: MotionValue<number>, px: number) =>
  useTransform(mv, (v) => v * px);

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const { sx, sy, onMove, reset } = usePointerParallax();

  // Scroll-linked depth — the further back a plate sits, the less it travels.
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -170]);
  const copyFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const rigY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const rigScale = useTransform(scrollYProgress, [0, 1], [1, 1.09]);
  const ghostY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const skyY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const cloudNearY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="relative isolate h-[100svh] min-h-[660px] w-full overflow-hidden bg-[#150d03]"
    >
      {/* --- sky ------------------------------------------------------- */}
      <motion.div style={{ y: skyY }} className="absolute inset-[-10%] z-0">
        <div className="absolute inset-0 bg-[radial-gradient(130%_105%_at_72%_12%,#c9932c_0%,#a3701b_26%,#6d460d_52%,#2c1b06_80%,#130c03_100%)]" />
        {/* low sun sitting just behind the ridge line */}
        <div className="absolute right-[16%] top-[8%] h-[46vw] w-[46vw] rounded-full bg-[radial-gradient(circle,rgba(255,214,120,0.55)_0%,rgba(255,186,74,0.18)_38%,transparent_68%)] blur-[10px]" />
      </motion.div>

      {/* --- far cloud plate ------------------------------------------- */}
      <motion.div
        style={{ x: useShift(sx, 26), y: useShift(sy, 16) }}
        className="pointer-events-none absolute inset-x-0 top-[2%] z-[1] h-[54%] opacity-[0.3] mix-blend-screen [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_58%,transparent)]"
      >
        <div
          className="cloud-drift flex h-full w-[200%]"
          style={{ ["--drift-duration" as string]: "190s" }}
        >
          {[0, 1].map((i) => (
            <div key={i} className="relative h-full w-1/2">
              <Image
                src="/layers/clouds-a.png"
                alt=""
                fill
                sizes="100vw"
                className="object-cover object-bottom"
                priority
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* --- ghost wordmark -------------------------------------------- */}
      <motion.div
        style={{ y: ghostY, x: useShift(sx, -14) }}
        className="pointer-events-none absolute inset-x-0 top-[13%] z-[2] hidden select-none lg:block"
      >
        <motion.p
          initial={{ opacity: 0, scale: 1.05, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 2.2, delay: 0.45, ease: EASE }}
          className="pr-[3vw] text-right text-[9vw] font-black leading-[0.72] tracking-[-0.02em] text-[#fff1cf] opacity-[0.085]"
        >
          HIMALAYA
        </motion.p>
      </motion.div>

      {/* --- the rig ----------------------------------------------------- */}
      <motion.div
        style={{ y: rigY, scale: rigScale }}
        className="absolute bottom-[3%] right-[-14%] z-[3] w-[132vw] origin-bottom sm:bottom-[-2%] sm:right-[-6%] sm:w-[96vw] lg:right-[1.5%] lg:w-[62vw] lg:max-w-[1120px]"
      >
        <motion.div
          style={{ x: useShift(sx, -34), y: useShift(sy, -18) }}
          initial={{ opacity: 0, y: 90, scale: 1.05 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.35, ease: EASE }}
        >
          <Image
            src="/cutouts/yogi-thar.png"
            alt="Yogi and his Thar parked above the snowline"
            width={1412}
            height={626}
            priority
            sizes="(max-width: 1024px) 100vw, 64vw"
            className="h-auto w-full drop-shadow-[0_40px_60px_rgba(20,10,0,0.55)]"
          />
        </motion.div>
      </motion.div>

      {/* --- near cloud wisps, in front of the rig ---------------------- */}
      <motion.div
        style={{ x: useShift(sx, 54), y: cloudNearY }}
        className="pointer-events-none absolute inset-x-0 bottom-[2%] z-[4] h-[34%] opacity-[0.16] mix-blend-screen blur-[2px] [mask-image:linear-gradient(to_bottom,transparent,black_35%,black_75%,transparent)]"
      >
        <div
          className="cloud-drift flex h-full w-[200%]"
          style={{ ["--drift-duration" as string]: "95s" }}
        >
          {[0, 1].map((i) => (
            <div key={i} className="relative h-full w-1/2">
              <Image
                src="/layers/clouds-b.png"
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* --- scrims: keep the copy readable wherever the rig lands ------ */}
      <div className="pointer-events-none absolute inset-0 z-[5] bg-[linear-gradient(100deg,rgba(24,14,3,0.78)_0%,rgba(24,14,3,0.34)_34%,transparent_62%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[34%] bg-[linear-gradient(to_top,rgba(15,9,2,0.85),transparent)]" />
      <div className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(120%_80%_at_50%_50%,transparent_45%,rgba(12,7,2,0.55)_100%)]" />

      {/* --- copy -------------------------------------------------------- */}
      <motion.div
        style={{ y: copyY, opacity: copyFade }}
        className="relative z-10 flex h-full w-full flex-col justify-start px-6 pt-24 sm:px-10 lg:max-w-[min(760px,56vw)] lg:justify-center lg:px-16 lg:pt-24"
      >
        <motion.div style={{ x: useShift(sx, 10), y: useShift(sy, 6) }}>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="mb-5 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#f6d79b] sm:mb-6 sm:text-[11px] sm:tracking-[0.34em]"
          >
            <span className="inline-block h-px w-6 shrink-0 bg-[#f6d79b]/60 sm:w-10" />
            Solo traveller · 11 states · 300 days out
          </motion.p>

          <h1 className="text-[clamp(2.3rem,4.6vw,4.3rem)] font-black uppercase leading-[0.94] tracking-[-0.035em] text-[#fff6e6]">
            <MaskLines
              lines={["Where the", "road ends,", "the story", "begins"]}
              delay={0.25}
              lineClassName="[text-shadow:0_2px_30px_rgba(26,14,2,0.45)]"
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.72, ease: EASE }}
            className="mt-5 max-w-[46ch] text-[14px] leading-relaxed text-[#f0dcbb]/85 sm:mt-7 sm:text-base"
          >
            Yogi rides the routes the maps give up on — frozen passes, river
            crossings, villages with no signal and no name. Follow the trail, or
            come ride it with him.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.86, ease: EASE }}
            className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-4 sm:mt-9"
          >
            <Magnetic strength={0.28}>
              <a
                href="#journeys"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#ffc74d] px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] text-[#20140a] transition-colors hover:text-[#20140a]"
              >
                <span className="absolute inset-0 -translate-x-full bg-[#fff0c8] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
                <span className="relative">Ride along</span>
                <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#20140a] text-[#ffc74d] transition-transform duration-500 group-hover:translate-x-1">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M1 6h9M6.5 2l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
            </Magnetic>

            <a
              href="#film"
              className="group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#f0dcbb]"
            >
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#f0dcbb]/35">
                <span className="absolute inset-0 rounded-full border border-[#ffc74d]/50 opacity-0 transition-all duration-500 group-hover:scale-125 group-hover:opacity-100" />
                <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                  <path d="M0 0l10 6-10 6z" />
                </svg>
              </span>
              Watch the film
            </a>
          </motion.div>

          <div className="mt-10 hidden max-w-[38rem] flex-wrap gap-2.5 sm:flex">
            {CHIPS.map((chip, i) => (
              <motion.span
                key={chip}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1 + i * 0.08, ease: EASE }}
                className="rounded-full border border-[#f0dcbb]/22 bg-[#f0dcbb]/[0.06] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#f0dcbb]/80 backdrop-blur-sm transition-colors hover:border-[#ffc74d]/60 hover:text-[#ffe3ad]"
              >
                {chip}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* --- scroll cue -------------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        style={{ opacity: copyFade }}
        className="absolute bottom-8 left-16 z-10 hidden items-center gap-3 lg:flex"
      >
        <span className="scroll-cue block h-9 w-px bg-gradient-to-b from-transparent via-[#ffc74d] to-transparent" />
        <span className="text-[10px] uppercase tracking-[0.32em] text-[#f0dcbb]/55">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
