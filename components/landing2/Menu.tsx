"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import MountainMark from "@/components/shared/MountainMark";

const EASE = [0.76, 0, 0.24, 1] as const;

const LINKS = [
  { label: "Routes", href: "#journeys" },
  { label: "Films", href: "#films" },
  { label: "The man", href: "#about" },
  { label: "The kit", href: "#gear" },
  { label: "Collabs", href: "#collabs" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

/**
 * Persistent nav. The trigger sits exactly where the hero's own label sat, so
 * it reads as part of the frame until you scroll past it.
 */
export default function Menu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Difference blending on a fixed element forces a re-blend against the
          whole page on every scroll frame, so it is desktop-only; touch gets a
          text shadow instead. */}
      <button
        onClick={() => setOpen((v) => !v)}
        data-cursor="hover"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="group fixed right-6 top-6 z-[80] flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.26em] text-[#eef5fb] [text-shadow:0_1px_6px_rgba(0,0,0,0.6)] sm:right-10 sm:top-8 sm:mix-blend-difference sm:[text-shadow:none]"
      >
        <span className="hidden sm:inline">{open ? "Close" : "Menu"}</span>
        <span className="relative flex h-4 w-7 flex-col justify-center">
          <span
            className={`absolute block h-px w-7 bg-[#eef5fb] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              open ? "rotate-45" : "-translate-y-[3px] group-hover:-translate-x-1"
            }`}
          />
          <span
            className={`absolute block h-px w-7 bg-[#eef5fb] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              open ? "-rotate-45" : "translate-y-[3px] group-hover:translate-x-1"
            }`}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="fixed inset-0 z-[70] flex flex-col justify-between bg-[#05070a] px-6 pb-8 pt-24 sm:px-10 sm:pb-10 sm:pt-28"
          >
            <div className="pointer-events-none absolute right-[-10%] top-[-15%] h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle,rgba(77,155,255,0.12),transparent_65%)]" />
            <MountainMark
              className="absolute left-6 top-6 text-[#eef5fb] sm:left-10 sm:top-8"
              size={30}
            />

            <ul className="relative">
              {LINKS.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    data-cursor="hover"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%", transition: { duration: 0.35 } }}
                    transition={{
                      duration: 0.85,
                      delay: 0.18 + i * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="group flex items-center gap-4 py-[0.6vh] font-[family-name:var(--font-anton)] text-[clamp(2rem,7.4vw,5.4rem)] uppercase leading-[1.02] text-[#f4f9ff] transition-colors duration-300 hover:text-[#4d9bff]"
                  >
                    <span className="w-6 shrink-0 font-mono text-[10px] tracking-[0.2em] text-[#c9dcea]/35">
                      0{i + 1}
                    </span>
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative flex flex-wrap items-end justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.22em] text-[#c9dcea]/45"
            >
              <div className="flex flex-col gap-1.5">
                <span className="text-[#c9dcea]/25">Follow</span>
                <div className="flex gap-5">
                  {["Instagram", "YouTube"].map((s) => (
                    <a
                      key={s}
                      href="#"
                      data-cursor="hover"
                      className="transition-colors hover:text-[#4d9bff]"
                    >
                      {s}
                    </a>
                  ))}
                </div>
              </div>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                data-cursor="hover"
                className="transition-colors hover:text-[#4d9bff]"
              >
                hello@vibewithyogi.com
              </a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
