"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import Magnetic from "@/components/shared/Magnetic";
import { EASE } from "@/components/shared/Reveal";

const LINKS = ["Journeys", "Stories", "Gallery", "About", "Contact"];

export default function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 40));

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.1, ease: EASE }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? "border-b border-[#f0dcbb]/10 bg-[#150d03]/70 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
        <a href="#top" className="group flex items-center gap-3">
          <svg width="34" height="22" viewBox="0 0 34 22" fill="none" aria-hidden>
            <path
              d="M2 20L11.5 3l6.5 11.5L22 8l10 12H2z"
              stroke="#ffc74d"
              strokeWidth="2"
              strokeLinejoin="round"
              className="transition-all duration-500 group-hover:stroke-[#fff0c8]"
            />
          </svg>
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#fff6e6]">
            Vibe with Yogi
          </span>
        </a>

        <div className="hidden items-center gap-9 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="group relative text-[13px] font-medium uppercase tracking-[0.14em] text-[#f0dcbb]/75 transition-colors hover:text-[#fff6e6]"
            >
              {l}
              <span className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-[#ffc74d] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100" />
            </a>
          ))}
        </div>

        <Magnetic strength={0.25} className="hidden sm:block">
          <a
            href="#contact"
            className="rounded-full border border-[#ffc74d]/55 px-6 py-2.5 text-[12px] font-bold uppercase tracking-[0.14em] text-[#ffdd93] transition-colors duration-500 hover:bg-[#ffc74d] hover:text-[#20140a]"
          >
            Plan a trip
          </a>
        </Magnetic>
      </nav>
    </motion.header>
  );
}
