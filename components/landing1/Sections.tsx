"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import Marquee from "@/components/shared/Marquee";
import Magnetic from "@/components/shared/Magnetic";
import { FadeUp, MaskLinesInView, EASE } from "@/components/shared/Reveal";
import { useEffect, useState } from "react";

/* Placeholder content — real trips, photos and copy drop in later. */
const TICKER = [
  "Spiti Valley",
  "Zanskar",
  "Umling La",
  "Nubra",
  "Chadar Trek",
  "Kaza",
  "Sela Pass",
  "Tawang",
];

const JOURNEYS = [
  {
    tag: "Winter · 9 days",
    title: "Frozen Spiti",
    copy: "Kaza at −25°C, the Key monastery at first light and a road that only exists four months a year.",
    img: "/photos/thar.jpg",
  },
  {
    tag: "Alpine · 6 days",
    title: "Kuari Ridge",
    copy: "A slow walk to the Nanda Devi amphitheatre, sleeping above the treeline every night.",
    img: "/photos/summit.jpg",
  },
  {
    tag: "Overland · 12 days",
    title: "Ladakh Circuit",
    copy: "Five passes over 5,000 m, two river crossings and the longest silence you'll ever hear.",
    img: "/photos/thar.jpg",
  },
];

const STATS = [
  { n: 47, suffix: "", label: "Passes crossed" },
  { n: 11, suffix: "", label: "States ridden" },
  { n: 300, suffix: "+", label: "Days on the road" },
  { n: 68, suffix: "k", label: "Kilometres solo" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1500;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      // easeOutExpo, so the number lands softly instead of stopping dead
      setN(Math.round(to * (p === 1 ? 1 : 1 - Math.pow(2, -10 * p))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

function JourneyCard({ j, i }: { j: (typeof JOURNEYS)[number]; i: number }) {
  return (
    <FadeUp delay={i * 0.12}>
      <article className="group relative h-full overflow-hidden rounded-[26px] border border-[#f0dcbb]/12 bg-[#1c1206]">
        <div className="relative h-[300px] overflow-hidden sm:h-[340px]">
          <Image
            src={j.img}
            alt={j.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover brightness-[0.86] saturate-[0.92] transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.09] group-hover:brightness-100 group-hover:saturate-100"
          />
          {/* warm wash so the photography sits inside the amber world */}
          <div className="absolute inset-0 bg-[#ffb347] opacity-[0.16] mix-blend-overlay transition-opacity duration-700 group-hover:opacity-0" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,12,3,0.95)_6%,rgba(20,12,3,0.15)_60%,transparent)]" />
          <span className="absolute left-5 top-5 rounded-full border border-[#ffc74d]/40 bg-[#150d03]/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ffdd93] backdrop-blur-sm">
            {j.tag}
          </span>
        </div>

        <div className="relative -mt-16 p-6">
          <h3 className="text-2xl font-black uppercase tracking-[-0.01em] text-[#fff6e6]">
            {j.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[#f0dcbb]/70">
            {j.copy}
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ffc74d]">
            View route
            <span className="transition-transform duration-500 group-hover:translate-x-1.5">
              →
            </span>
          </span>
        </div>

        <span className="pointer-events-none absolute inset-0 rounded-[26px] border border-[#ffc74d]/0 transition-colors duration-500 group-hover:border-[#ffc74d]/35" />
      </article>
    </FadeUp>
  );
}

export default function Sections() {
  const storyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1, 1.12]);

  return (
    <div className="relative z-10 bg-[#150d03] text-[#f0dcbb]">
      {/* ---- ticker ------------------------------------------------------ */}
      <div className="border-y border-[#f0dcbb]/12 bg-[#1a1005] py-5">
        <Marquee duration={46}>
          {TICKER.map((t) => (
            <span
              key={t}
              className="flex items-center gap-8 whitespace-nowrap px-8 text-[13px] font-bold uppercase tracking-[0.24em] text-[#f0dcbb]/45"
            >
              {t}
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffc74d]/70" />
            </span>
          ))}
        </Marquee>
      </div>

      {/* ---- journeys ---------------------------------------------------- */}
      <section id="journeys" className="px-6 py-28 sm:px-10 lg:px-16">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-[clamp(2rem,5vw,3.8rem)] font-black uppercase leading-[0.95] tracking-[-0.03em] text-[#fff6e6]">
            <MaskLinesInView lines={["Pick a", "hard road"]} />
          </h2>
          <FadeUp delay={0.15}>
            <p className="max-w-[38ch] text-sm leading-relaxed text-[#f0dcbb]/65">
              Every trip below is one Yogi has ridden himself, more than once,
              in the season it is best ridden. Placeholder copy for now.
            </p>
          </FadeUp>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {JOURNEYS.map((j, i) => (
            <JourneyCard key={j.title} j={j} i={i} />
          ))}
        </div>
      </section>

      {/* ---- story with a parallax plate --------------------------------- */}
      <section
        id="about"
        ref={storyRef}
        className="grid items-stretch gap-0 border-y border-[#f0dcbb]/12 lg:grid-cols-2"
      >
        <div className="relative min-h-[420px] overflow-hidden lg:min-h-[620px]">
          <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-[-14%]">
            <Image
              src="/photos/summit.jpg"
              alt="Yogi above the Nanda Devi range"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover brightness-[0.88] saturate-[0.92]"
            />
          </motion.div>
          <div className="absolute inset-0 bg-[#ffb347] opacity-[0.14] mix-blend-overlay" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(21,13,3,0.55),transparent_60%)]" />
        </div>

        <div className="flex flex-col justify-center px-6 py-20 sm:px-10 lg:px-16">
          <FadeUp>
            <p className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#ffc74d]">
              <span className="inline-block h-px w-10 bg-[#ffc74d]/60" />
              The man
            </p>
          </FadeUp>
          <h2 className="text-[clamp(1.8rem,3.4vw,2.9rem)] font-black uppercase leading-[1.02] tracking-[-0.02em] text-[#fff6e6]">
            <MaskLinesInView
              lines={["Ten years,", "one rule —", "keep going up."]}
            />
          </h2>
          <FadeUp delay={0.2}>
            <p className="mt-7 max-w-[52ch] text-[15px] leading-relaxed text-[#f0dcbb]/70">
              Placeholder biography. Yogi started with a borrowed tent and a
              second-hand motorcycle, and has been finding the quiet side of the
              Himalaya ever since. He now takes small groups along, on the same
              routes, at the same unhurried pace.
            </p>
          </FadeUp>

          <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {STATS.map((s, i) => (
              <FadeUp key={s.label} delay={0.1 + i * 0.08}>
                <div>
                  <p className="text-[clamp(1.9rem,3vw,2.6rem)] font-black tracking-[-0.02em] text-[#ffc74d]">
                    <Counter to={s.n} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#f0dcbb]/55">
                    {s.label}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ---- closing call ------------------------------------------------ */}
      <section
        id="contact"
        className="relative overflow-hidden px-6 py-32 text-center sm:px-10"
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[80vw] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,199,77,0.16),transparent_62%)]" />
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1.1, ease: EASE }}
          className="relative mx-auto max-w-[18ch] text-[clamp(2.2rem,6vw,5rem)] font-black uppercase leading-[0.94] tracking-[-0.035em] text-[#fff6e6]"
        >
          The next one leaves in March
        </motion.h2>
        <FadeUp delay={0.15}>
          <p className="relative mx-auto mt-6 max-w-[46ch] text-sm leading-relaxed text-[#f0dcbb]/65">
            Six seats, one Thar, one photographer who has done this road in
            every season. Placeholder — booking flow comes later.
          </p>
        </FadeUp>
        <FadeUp delay={0.28}>
          <Magnetic strength={0.3} className="mt-10 inline-block">
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#ffc74d] px-9 py-4.5 text-sm font-bold uppercase tracking-[0.14em] text-[#20140a]"
            >
              <span className="absolute inset-0 -translate-x-full bg-[#fff0c8] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
              <span className="relative py-1">Hold a seat</span>
            </a>
          </Magnetic>
        </FadeUp>
      </section>

      {/* ---- footer ------------------------------------------------------ */}
      <footer className="border-t border-[#f0dcbb]/12 px-6 pb-10 pt-14 sm:px-10 lg:px-16">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <p className="text-[clamp(2.4rem,9vw,7rem)] font-black uppercase leading-[0.8] tracking-[-0.04em] text-[#f0dcbb]/12">
            Vibe with Yogi
          </p>
          <div className="flex flex-col gap-2 text-[12px] uppercase tracking-[0.16em] text-[#f0dcbb]/55">
            {["Instagram", "YouTube", "hello@vibewithyogi.com"].map((s) => (
              <a key={s} href="#" className="transition-colors hover:text-[#ffc74d]">
                {s}
              </a>
            ))}
          </div>
        </div>
        <p className="mt-10 text-[11px] uppercase tracking-[0.16em] text-[#f0dcbb]/35">
          © {new Date().getFullYear()} Vibe with Yogi — concept build
        </p>
      </footer>
    </div>
  );
}
