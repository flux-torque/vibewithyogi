"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Headline lines that slide up out of a clipping mask. Each string is one
 * visual line, so the caller controls where the copy breaks.
 */
export function MaskLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  duration = 1.05,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
}) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={line + i} className={`line-mask ${lineClassName ?? ""}`}>
          <motion.span
            className="block"
            initial={{ y: "115%", rotate: 3 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration, delay: delay + i * stagger, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * Same mask treatment, but triggered when the block scrolls into view.
 *
 * The trigger has to live on the wrapper: a line parked at y:115% sits outside
 * its own `overflow:hidden` mask, so an observer on the line itself would
 * never see it intersect and the copy would stay hidden forever.
 */
export function MaskLinesInView({
  lines,
  className,
  lineClassName,
  stagger = 0.08,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  stagger?: number;
}) {
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
    >
      {lines.map((line, i) => (
        <span key={line + i} className={`line-mask ${lineClassName ?? ""}`}>
          <motion.span
            className="block"
            variants={{ hidden: { y: "115%" }, show: { y: 0 } }}
            transition={{ duration: 1, delay: i * stagger, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Generic fade + rise for anything that isn't type. */
export function FadeUp({
  children,
  delay = 0,
  y = 26,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.95, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export { EASE };
