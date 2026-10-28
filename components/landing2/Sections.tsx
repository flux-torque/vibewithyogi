"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Magnetic from "@/components/shared/Magnetic";
import CollabStage from "@/components/landing2/CollabStage";
import { Films, Gear } from "@/components/landing2/Portfolio";
import { FadeUp, MaskLinesInView } from "@/components/shared/Reveal";
import useDesktop from "@/components/shared/useDesktop";

/* Imported rather than referenced by path, so each photo carries a tiny
   blurred preview: a slow connection shows the shape of the frame at once
   instead of an empty box, and the files get hashed, immutable URLs. */
import aboutMe from "@/public/photos/aboutme.jpg";
import g1 from "@/public/photos/g1.jpg";
import g2 from "@/public/photos/g2.jpg";
import g3 from "@/public/photos/g3.jpg";
import g4 from "@/public/photos/g4.jpg";
import g5 from "@/public/photos/g5.jpg";
import g6 from "@/public/photos/g6.jpg";
import g7 from "@/public/photos/g7.jpg";
import g8 from "@/public/photos/g8.jpg";
import g9 from "@/public/photos/g9.jpg";
import g10 from "@/public/photos/g10.jpg";
import routeKuari from "@/public/photos/route-kuari.jpg";
import routeLadakh from "@/public/photos/route-ladakh.jpg";
import routeSpiti from "@/public/photos/route-spiti.jpg";
import routeZanskar from "@/public/photos/route-zanskar.jpg";

/* Placeholder content. */
const PANELS = [
  { n: "01", title: "Spiti", img: routeSpiti },
  { n: "02", title: "Kuari", img: routeKuari },
  { n: "03", title: "Ladakh", img: routeLadakh },
  { n: "04", title: "Zanskar", img: routeZanskar },
];


/* --- horizontal rail, pinned while it scrolls sideways ------------------ */
function Rail() {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);

  // Measure rather than guess: the rail should stop exactly when the last
  // panel's right edge meets the viewport edge, at any width.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () =>
      setTravel(Math.max(0, el.scrollWidth - window.innerWidth + 40));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  return (
    <section ref={ref} id="journeys" className="relative h-[340vh] bg-[#05070a]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="mb-10 flex items-end justify-between px-6 sm:px-10">
          <h2 className="font-[family-name:var(--font-anton)] text-[clamp(1.8rem,4.6vw,4rem)] uppercase leading-[0.9] tracking-[-0.01em] text-[#eef5fb]">
            <MaskLinesInView lines={["Travel archives"]} />
          </h2>
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-[#c9dcea]/40 sm:block">
            Drag / scroll →
          </p>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max gap-5 pl-6 pr-6 sm:gap-8 sm:pl-10 sm:pr-10"
        >
          {PANELS.map((p) => (
            <article
              key={p.n}
              className="relative h-[56vh] w-[74vw] shrink-0 overflow-hidden rounded-sm sm:w-[38vw] lg:w-[30vw]"
            >
              <Image
                src={p.img}
                alt={p.title}
                fill
                sizes="(max-width: 640px) 74vw, 32vw"
                placeholder="blur"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,7,10,0.85),rgba(5,7,10,0.08)_50%,transparent)]" />
              <span className="absolute right-5 top-4 font-mono text-[10px] tracking-[0.3em] text-[#eef5fb]/70">
                {p.n}
              </span>
              <h3 className="absolute inset-x-5 bottom-5 font-[family-name:var(--font-anton)] text-[clamp(1.6rem,2.8vw,2.6rem)] uppercase leading-none text-[#f4f9ff]">
                {p.title}
              </h3>
            </article>
          ))}
        </motion.div>
      </div>

    </section>
  );
}

/* --- portrait band: the cutout sits on a drawn ledge --------------------- */
function Portrait() {
  const ref = useRef<HTMLDivElement>(null);
  const desktop = useDesktop();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // gentle, and only within the overscan so the bottom of the frame is safe
  const dFigure = useTransform(scrollYProgress, [0, 1], ["0%", "7%"]);
  const dGlow = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const figureY = desktop ? dFigure : undefined;
  const glowY = desktop ? dGlow : undefined;

  return (
    <section
      id="about"
      ref={ref}
      className="relative overflow-hidden border-y border-[#c9dcea]/10 bg-[#05070a] px-6 py-24 sm:px-10 lg:px-20"
    >
      <motion.div
        style={{ y: glowY }}
        className="pointer-events-none absolute left-[6%] top-1/2 h-[70vh] w-[70vh] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(120,170,215,0.16),transparent_62%)]"
      />

      <div className="relative grid items-center gap-10 sm:gap-14 lg:grid-cols-[0.95fr_1fr]">
        {/* The frame matches the photo's own 3:4, so `cover` has almost
            nothing to trim — and the parallax pans down from the top rather
            than eating the bottom of the shot. */}
        <div className="relative aspect-[3/4] max-h-[76vh] w-full overflow-hidden rounded-sm">
          <motion.div style={{ y: figureY }} className="absolute inset-x-0 -top-[7%] bottom-0">
            <Image
              src={aboutMe}
              alt="Yogesh Yadav on a ridge in Spiti"
              fill
              /* first thing under the hero — start now, but behind it */
              loading="eager"
              placeholder="blur"
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover object-bottom"
            />
          </motion.div>
        </div>

        <div>
          <FadeUp>
            <p className="mb-6 inline-block bg-[#eef5fb] px-3 py-1.5 font-mono text-[13px] uppercase tracking-[0.2em] text-[#12508f] sm:text-[15px]">
              About me
            </p>
          </FadeUp>
          <h2 className="font-[family-name:var(--font-anton)] text-[clamp(2.1rem,5vw,4.2rem)] uppercase leading-[1.06] text-[#f4f9ff]">
            <MaskLinesInView lines={["Ten winters", "above 4,500 m"]} />
          </h2>

          <FadeUp delay={0.12}>
            <p className="mt-7 text-[17px] font-medium leading-snug text-[#eef5fb] sm:text-[19px]">
              Hi, I&rsquo;m Yogesh Yadav — VibeWithYogi.
            </p>
          </FadeUp>
          <FadeUp delay={0.18}>
            <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-[#c9dcea]/65">
              I&rsquo;m a travel content creator, expedition leader and adventure
              enthusiast. I specialise in Himalayan expeditions, high-altitude
              treks and winter adventures, while exploring the diverse
              landscapes and cultures of India. Having travelled across many
              states, I love finding offbeat destinations and creating
              authentic travel stories. I also organise curated group trips all
              over India, helping travellers build unforgettable experiences
              through adventure, culture and exploration.
            </p>
          </FadeUp>

          <div className="mt-10 divide-y divide-[#c9dcea]/10 border-y border-[#c9dcea]/10 sm:mt-12">
            {[
              ["Passes crossed", "15"],
              ["Kilometres solo", "45,000"],
              ["Nights above snowline", "212"],
            ].map(([k, v], i) => (
              <FadeUp key={k} delay={0.1 + i * 0.07}>
                <div className="flex items-baseline justify-between gap-4 py-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#c9dcea]/45">
                    {k}
                  </span>
                  <span className="font-[family-name:var(--font-anton)] text-2xl text-[#eef5fb]">
                    {v}
                  </span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- gallery with per-column drift -------------------------------------- */
function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const desktop = useDesktop();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const da = useTransform(scrollYProgress, [0, 1], ["8%", "-12%"]);
  const db = useTransform(scrollYProgress, [0, 1], ["-6%", "14%"]);
  const dc = useTransform(scrollYProgress, [0, 1], ["4%", "-18%"]);
  // columns sit still on touch — see useDesktop
  const a = desktop ? da : undefined;
  const b = desktop ? db : undefined;
  const c = desktop ? dc : undefined;

  const cols = [
    {
      y: a,
      items: [
        { src: g1, pos: "50% 40%" },
        { src: g4, pos: "50% 50%" },
        { src: g7, pos: "50% 55%" },
      ],
    },
    {
      y: b,
      items: [
        { src: g2, pos: "50% 45%" },
        { src: g5, pos: "50% 35%" },
        { src: g8, pos: "50% 50%" },
      ],
    },
    {
      y: c,
      items: [
        { src: g3, pos: "50% 50%" },
        { src: g10, pos: "50% 45%" },
        { src: g6, pos: "50% 45%" },
        { src: g9, pos: "50% 40%" },
      ],
    },
  ];

  return (
    <section
      id="gallery"
      ref={ref}
      className="relative overflow-hidden bg-[#05070a] px-4 py-24 sm:px-6"
    >
      <div className="mb-12 flex items-end justify-between px-2 sm:px-4">
        <h2 className="font-[family-name:var(--font-anton)] text-[clamp(1.6rem,4vw,3.4rem)] uppercase leading-none text-[#eef5fb]">
          <MaskLinesInView lines={["From the road"]} />
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#c9dcea]/40">
          10 frames
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {cols.map((col, ci) => (
          <motion.div
            key={ci}
            style={{ y: col.y }}
            className={`flex flex-col gap-3 sm:gap-4 ${
              ci === 1 ? "lg:mt-20" : ci === 2 ? "hidden lg:mt-8 lg:flex" : ""
            }`}
          >
            {col.items.map((item, i) => (
              <div
                key={item.src.src + i}
                className="relative aspect-[4/5] overflow-hidden rounded-sm"
              >
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  style={{ objectPosition: item.pos }}
                  placeholder="blur"
                  className="object-cover"
                />
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function Sections() {
  return (
    <div className="relative z-10">
      <Portrait />
      <Rail />
      <Films />
      <Gear />
      <CollabStage />
      <Gallery />

      {/* closing */}
      <section
        id="contact"
        className="relative overflow-hidden border-t border-[#c9dcea]/10 bg-[#05070a] px-6 py-28 sm:px-10 lg:px-20"
      >
        <div className="flex flex-col items-center justify-between gap-12 lg:flex-row lg:items-end">
          <h2 className="text-center font-[family-name:var(--font-anton)] text-[clamp(2.2rem,7vw,6rem)] uppercase leading-[1.04] text-[#f4f9ff] lg:text-left">
            <MaskLinesInView lines={["Connect", "with me"]} />
          </h2>

          <Magnetic strength={0.32}>
            <a
              href="https://www.instagram.com/vibewithyogi/"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="group relative flex h-40 w-40 items-center justify-center rounded-full border border-[#c9dcea]/25 font-mono text-[10px] uppercase tracking-[0.24em] text-[#eef5fb]"
            >
              <span className="absolute inset-0 scale-0 rounded-full bg-[#4d9bff] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100" />
              <span className="relative flex flex-col items-center gap-1.5">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.7" />
                  <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
                  <circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" />
                </svg>
                Instagram
              </span>
            </a>
          </Magnetic>
        </div>
      </section>

      {/* Nothing but the name, centred in its own space. */}
      <footer className="flex min-h-[42vh] items-center justify-center overflow-hidden border-t border-[#c9dcea]/10 bg-[#05070a] px-6 py-20">
        <p className="text-outline whitespace-nowrap pb-[0.08em] text-center font-[family-name:var(--font-anton)] text-[13vw] uppercase leading-[0.82] text-[#c9dcea]/25">
          Vibe with Yogi
        </p>
      </footer>
    </div>
  );
}
