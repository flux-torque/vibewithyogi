"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { FadeUp, MaskLinesInView } from "@/components/shared/Reveal";
import useDesktop from "@/components/shared/useDesktop";

/* ---------------------------------------------------------------------------
   Everything in this file is placeholder content — real films, real kit specs
   and real partners drop straight into these arrays.
   --------------------------------------------------------------------------- */

/* Drone cuts. No titles, no locations — the footage speaks. */
const FILMS = [
  { n: "01", meta: "0:07", src: "drone-03", feature: true },
  { n: "02", meta: "0:04", src: "drone-01" },
  { n: "03", meta: "0:06", src: "drone-02" },
];

const KIT = [
  {
    n: "01",
    name: "Sony A7S III",
    role: "Primary body",
    specs: ["Full frame", "4K 120"],
    img: "/gear/camera.png",
  },
  {
    n: "02",
    name: "Samyang 24–70",
    role: "Standard zoom",
    specs: ["f/2.8", "Everyday lens"],
    img: "/gear/lens-wide.png",
  },
  {
    n: "03",
    name: "Sigma 70–200",
    role: "Telephoto",
    specs: ["f/2.8", "Compression + peaks"],
    img: "/gear/lens-tele.png",
  },
  {
    n: "04",
    name: "DJI Mini 5 Pro",
    role: "Aerial unit",
    specs: ["Sub-250 g", "Everything from above"],
    img: "/gear/drone.png",
  },
  {
    n: "05",
    name: "GoPro Hero 10",
    role: "Action rig",
    specs: ["Bonnet + chest", "Waterproof"],
    img: "/gear/gopro.png",
  },
  {
    n: "06",
    name: "iPhone 17 Pro",
    role: "Pocket cut",
    specs: ["Vertical reels", "ProRes log"],
    img: "/gear/phone.png",
    // the lit screen is a hotspot against this palette
    tone: "brightness-[0.72]",
  },
];


/* --- drone films -------------------------------------------------------- */
function FilmCard({ film }: { film: (typeof FILMS)[number] }) {
  return (
    <article className="relative h-full overflow-hidden rounded-sm">
      <div
        className={
          film.feature ? "aspect-[16/10] lg:aspect-[21/9]" : "aspect-[16/10]"
        }
      >
        <video
          src={`/video/drone/${film.src}.mp4`}
          poster={`/video/drone/${film.src}.jpg`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(5,7,10,0.6),transparent_38%)]" />

      <span className="absolute right-4 top-4 font-mono text-[10px] tracking-[0.3em] text-[#eef5fb]/70">
        {film.n}
      </span>

      <span className="absolute bottom-4 left-4 bg-[#eef5fb] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#1662c4] sm:bottom-5 sm:left-5 sm:text-[10px]">
        {film.meta}
      </span>
    </article>
  );
}

export function Films() {
  return (
    <section
      id="films"
      className="relative border-t border-[#c9dcea]/10 bg-[#05070a] px-4 py-24 sm:px-6 lg:px-10 lg:py-32"
    >
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6 px-2">
        <h2 className="font-[family-name:var(--font-anton)] text-[clamp(1.9rem,5vw,4.2rem)] uppercase leading-[1.06] text-[#eef5fb]">
          <MaskLinesInView lines={["Shots from", "the sky"]} />
        </h2>
        <FadeUp delay={0.12}>
          <p className="max-w-[40ch] text-sm leading-relaxed text-[#c9dcea]/55">
            Drone shots. Frames from the sky.
          </p>
        </FadeUp>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        {FILMS.map((f, i) => (
          <FadeUp
            key={f.n}
            delay={i * 0.1}
            className={f.feature ? "lg:col-span-2" : undefined}
          >
            <FilmCard film={f} />
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* --- the kit ------------------------------------------------------------ */
function KitTile({ item, i }: { item: (typeof KIT)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const desktop = useDesktop();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // alternate the drift so the row breathes instead of moving as a block
  const dir = i % 2 === 0 ? 1 : -1;
  const drift = useTransform(scrollYProgress, [0, 1], [18 * dir, -18 * dir]);
  const y = desktop ? drift : undefined;

  return (
    <div
      ref={ref}
      data-cursor="hover"
      className="group relative flex flex-col overflow-hidden rounded-sm border border-[#c9dcea]/10 bg-[linear-gradient(180deg,#0a0e14_0%,#05070a_100%)] p-4 transition-colors duration-500 hover:border-[#c9dcea]/25 sm:p-5"
    >
      {/* technical grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(#c9dcea_1px,transparent_1px),linear-gradient(90deg,#c9dcea_1px,transparent_1px)] [background-size:22px_22px]" />
      {/* glow that wakes up on hover */}
      <div className="pointer-events-none absolute left-1/2 top-[42%] h-[75%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse,rgba(120,170,215,0.18),transparent_68%)] opacity-60 blur-[8px] transition-opacity duration-700 group-hover:opacity-100" />

      <div className="relative mb-3 flex items-start justify-between gap-2">
        <span className="font-mono text-[9px] tracking-[0.3em] text-[#c9dcea]/45">
          {item.n}
        </span>
        <span className="text-right font-mono text-[9px] uppercase leading-tight tracking-[0.16em] text-[#4d9bff]">
          {item.role}
        </span>
      </div>

      <motion.div
        style={{ y }}
        className="relative mx-auto h-[104px] w-full sm:h-[120px] lg:h-[132px]"
      >
        <Image
          src={item.img}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 45vw, 24vw"
          className={`object-contain [filter:drop-shadow(0_22px_26px_rgba(0,0,0,0.6))] ${
            item.tone ?? "brightness-[0.92]"
          }`}
        />
      </motion.div>

      {/* measurement rule */}
      <div className="relative mt-4 flex items-center gap-1">
        {Array.from({ length: 9 }).map((_, t) => (
          <span
            key={t}
            className={`block w-full bg-[#c9dcea]/25 ${t % 4 === 0 ? "h-2" : "h-[3px]"}`}
          />
        ))}
      </div>

      <h3 className="relative mt-3 font-[family-name:var(--font-anton)] text-base uppercase leading-none text-[#f4f9ff] sm:text-lg">
        {item.name}
      </h3>
      <ul className="relative mt-1.5 space-y-0.5">
        {item.specs.map((s) => (
          <li
            key={s}
            className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#c9dcea]/45"
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Gear() {
  return (
    <section
      id="gear"
      className="relative border-t border-[#c9dcea]/10 bg-[#05070a] px-4 py-24 sm:px-6 lg:px-10 lg:py-32"
    >
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6 px-2">
        <h2 className="font-[family-name:var(--font-anton)] text-[clamp(1.9rem,5vw,4.2rem)] uppercase leading-[1.06] text-[#eef5fb]">
          <MaskLinesInView lines={["What rides", "in the back"]} />
        </h2>
        <FadeUp delay={0.12}>
          <p className="max-w-[40ch] text-sm leading-relaxed text-[#c9dcea]/55">
            One body, two lenses, one hard case and no assistant.
            Placeholder specs for now.
          </p>
        </FadeUp>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {KIT.map((item, i) => (
          <FadeUp key={item.n} delay={(i % 4) * 0.07}>
            <KitTile item={item} i={i} />
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
