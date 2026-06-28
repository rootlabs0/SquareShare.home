"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  MotionValue,
} from "framer-motion";
import { useIsMobile } from "@/hooks/useMediaQuery";

const PURPOSE_TEXT =
  "We exist to give every creator the power to sell anywhere, on their own terms.";

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const [start, end] = range;
  const mid = (start + end) / 2;
  const opacity = useTransform(progress, range, [0.15, 1]);
  // `accent` rises to 1 while the word is actively appearing, and is 0 both
  // before (greyed) and after (settled white). It drives the primary-color
  // (--primary / #a855f7) gradient and the right-edge fringe.
  const accent = useTransform(progress, [start, mid, end], [0, 1, 0]);
  const weak = useTransform(accent, (v) => v * 0.4); // tint across the body
  const strong = useTransform(accent, (v) => v); // fully saturated right edge
  const fringe = useTransform(accent, (v) => v); // border on that edge
  const glow = useTransform(accent, (v) => v * 0.7); // outer glow on that edge
  // Bottom layer is solid white so glyphs are always fully painted; the top
  // layer is transparent for the left, then ramps up to a saturated primary
  // edge on the right. The drop-shadows add a primary fringe plus a soft glow.
  const backgroundImage = useMotionTemplate`linear-gradient(90deg, rgba(168,85,247,0) 0%, rgba(168,85,247,0) 45%, rgba(192,132,252,${weak}) 78%, rgba(168,85,247,${strong}) 100%), linear-gradient(0deg, #ffffff, #ffffff)`;
  const filter = useMotionTemplate`drop-shadow(2px 0 0.5px rgba(168,85,247,${fringe})) drop-shadow(0 0 6px rgba(168,85,247,${glow}))`;
  return (
    <span className="relative mr-[0.25em] inline-block">
      <motion.span
        className="bg-clip-text text-transparent"
        style={{
          opacity,
          backgroundImage,
          filter,
          backgroundRepeat: "no-repeat, no-repeat",
          WebkitTextFillColor: "transparent",
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

const HEADING_CLASS =
  "font-display text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.15] tracking-tight text-white";

// Desktop: every word reveals (opacity + primary-color gradient fringe) as it
// scrolls through, driven per-frame by useScroll/useTransform.
function AnimatedPurpose({ words }: { words: string[] }) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.55"],
  });

  return (
    <h2 ref={containerRef} className={HEADING_CLASS}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = (i + 1) / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </h2>
  );
}

// Mobile / reduced motion: skip the per-word scroll scrubbing and the animated
// text drop-shadow filters (expensive to repaint while scrolling on phones) for
// a single cheap fade-in. No scroll listener is created on this path.
function StaticPurpose() {
  return (
    <motion.h2
      className={HEADING_CLASS}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {PURPOSE_TEXT}
    </motion.h2>
  );
}

export default function PurposeSection() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const simplify = reduced || isMobile;
  const words = PURPOSE_TEXT.split(" ");

  return (
    <section
      id="purpose"
      className="relative bg-black py-28 md:py-40 overflow-hidden"
    >
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.p
          className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase text-white/30 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          Our Purpose
        </motion.p>
        {simplify ? <StaticPurpose /> : <AnimatedPurpose words={words} />}
      </div>
    </section>
  );
}
