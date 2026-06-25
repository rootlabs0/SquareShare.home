"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import { useIsMobile } from "@/hooks/useMediaQuery";

const START_TILT = 10;
const BEAM_WIDTH = "clamp(280px,78vw,400px)";

/** A single hanging pan: cords dropping from the beam to a square tray. */
function ScalePan({
  label,
  highlight = false,
}: {
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      {/* Cords hanging from the beam end down to the tray's top corners */}
      <svg
        width="84"
        height="46"
        viewBox="0 0 84 46"
        fill="none"
        aria-hidden="true"
        className={`block ${highlight ? "text-acid/55" : "text-white/30"}`}
      >
        <circle cx="42" cy="3" r="2.5" fill="currentColor" />
        <path
          d="M42 3 L13 44"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M42 3 L71 44"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>

      {/* The tray — a sharp square, true to the brand */}
      <div
        className={`-mt-px flex size-[72px] items-center justify-center border backdrop-blur-[2px] ${
          highlight
            ? "border-acid/50 bg-gradient-to-b from-acid/[0.18] to-acid/[0.02] shadow-[0_0_30px_-2px_rgba(255,153,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.14)]"
            : "border-white/15 bg-gradient-to-b from-white/[0.08] to-white/[0.01] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_18px_34px_-14px_rgba(0,0,0,0.9)]"
        }`}
      >
        <span
          className={`font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] ${
            highlight ? "text-acid" : "text-white/75"
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function FairSquareScale() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.3 });

  // The beam's tilt. The hangers counter-rotate by the inverse so the pans stay
  // hanging dead-vertical — like real trays under gravity — while the beam swings.
  const rotate = useMotionValue(reduce ? 0 : START_TILT);
  const counter = useTransform(rotate, (r) => -r);

  useEffect(() => {
    if (reduce || !inView) return;
    // A low-damping spring lets it overshoot and rock before settling level.
    const controls = animate(rotate, 0, {
      type: "spring",
      stiffness: 55,
      damping: 6.5,
      mass: 1.1,
    });
    return () => controls.stop();
  }, [inView, reduce, rotate]);

  const nudge = (deg: number) => {
    if (reduce) return;
    animate(rotate, deg, { type: "spring", stiffness: 130, damping: 9 });
  };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative mx-auto h-[280px] w-full max-w-md select-none"
      onMouseEnter={() => nudge(6)}
      onMouseLeave={() => nudge(0)}
    >
      {/* Pedestal: a static post + base the beam pivots on */}
      <div className="absolute left-1/2 top-[90px] h-[120px] w-[2.5px] -translate-x-1/2 bg-gradient-to-b from-white/25 via-white/10 to-white/[0.02]" />
      <div className="absolute left-1/2 top-[208px] h-[3px] w-[120px] -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute left-1/2 top-[214px] h-2 w-[150px] -translate-x-1/2 rounded-[50%] bg-white/[0.05] blur-md" />

      {/* Fulcrum: the acid pivot diamond the beam balances on */}
      <div className="absolute left-1/2 top-[84px] z-20 size-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-acid/70 bg-acid shadow-btn-glow" />

      {/* Beam + hangers: pivots about the fulcrum */}
      <motion.div
        style={{ rotate }}
        className="absolute left-1/2 top-[84px] z-10 origin-top -translate-x-1/2"
      >
        <div
          className="relative flex items-start justify-between"
          style={{ width: BEAM_WIDTH }}
        >
          {/* The beam bar with a metallic sheen */}
          <div className="absolute left-[42px] right-[42px] top-0 h-[2.5px] -translate-y-1/2 rounded-full bg-gradient-to-r from-white/15 via-white/75 to-white/15 shadow-[0_1px_10px_rgba(255,255,255,0.12)]" />

          <motion.div
            style={{ rotate: counter }}
            className="relative z-10 flex w-[84px] origin-top justify-center"
          >
            <ScalePan label="Fair" />
          </motion.div>

          <motion.div
            style={{ rotate: counter }}
            className="relative z-10 flex w-[84px] origin-top justify-center"
          >
            <ScalePan label="Square" highlight />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/** A soft acid bloom used behind the weight. */
function GlowOrb({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full opacity-[0.09] blur-3xl ${className}`}
      style={{
        background:
          "radial-gradient(circle, var(--color-acid) 0%, transparent 70%)",
      }}
    />
  );
}

/** The headline — shown alone in the first stage. */
function FeesHeadline() {
  return (
    <h2 className="font-display text-5xl font-black leading-[1.02] tracking-tight text-white md:text-7xl">
      Fair and square pricing.
    </h2>
  );
}

/** The supporting paragraph — the only copy shown once the weight has switched. */
function FeesBody({ className = "" }: { className?: string }) {
  return (
    <p className={`text-lg leading-relaxed text-white/60 md:text-xl ${className}`}>
      We eat the Stripe processing fees, and every fee we do charge is laid out in
      the open. No surprise charges, no fine print, and nothing sprung on you at
      checkout.
    </p>
  );
}

/** The balance + caption — the "weight" half of the swap. */
function FeesWeight() {
  return (
    <div className="relative z-10 w-full">
      <FairSquareScale />
    </div>
  );
}

/**
 * Desktop swap: a tall wrapper drives a pinned stage. The weight glides straight
 * across to the far side; the copy fades out where it stood and then fades + slides
 * back in on the opposite side once the weight has passed.
 */
function SwapStage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Headline: shown alone on the left in the first stage, then drifts away as the
  // weight starts moving (it does not come back).
  const headlineOpacity = useTransform(scrollYProgress, [0.16, 0.34], [1, 0]);
  const headlineX = useTransform(scrollYProgress, [0.16, 0.34], [0, -32]);
  const headlineY = useTransform(scrollYProgress, [0.16, 0.34], [0, -24]);

  // Body: the only copy in the second stage — fades + slides in from the right
  // once the weight has switched over.
  const bodyOpacity = useTransform(scrollYProgress, [0.56, 0.8], [0, 1]);
  const bodyX = useTransform(scrollYProgress, [0.56, 0.8], [48, 0]);
  const bodyY = useTransform(scrollYProgress, [0.56, 0.8], [24, 0]);

  // NOTE: opacity is driven through a CSS variable rather than framer's `opacity`
  // style. framer offloads a bound `opacity` motion value to a WAAPI animation
  // that ignores scroll updates (it freezes); a CSS variable is written directly
  // every frame, so the fade reliably tracks scroll. Fallbacks cover first paint.

  // Weight: a calm glide right → left, with the faintest lift so it doesn't read flat.
  const weightX = useTransform(scrollYProgress, [0.18, 0.72], ["100%", "0%"]);
  const weightY = useTransform(
    scrollYProgress,
    [0.18, 0.45, 0.72],
    [0, -26, 0],
  );
  const weightScale = useTransform(
    scrollYProgress,
    [0.18, 0.45, 0.72],
    [1, 1.04, 1],
  );

  return (
    <div ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen items-center">
        <div className="relative mx-auto w-full max-w-6xl px-6">
          <div className="relative h-[440px]">
            {/* Headline — first stage only, on the left; fades away for good */}
            <motion.div
              style={
                {
                  x: headlineX,
                  y: headlineY,
                  "--fade": headlineOpacity,
                  opacity: "var(--fade, 1)",
                } as MotionStyle
              }
              className="absolute inset-y-0 left-0 z-10 flex w-1/2 items-center px-6 md:px-10"
            >
              <FeesHeadline />
            </motion.div>

            {/* Body — second stage only, on the right; appears after the swap */}
            <motion.div
              style={
                {
                  x: bodyX,
                  y: bodyY,
                  "--fade": bodyOpacity,
                  opacity: "var(--fade, 0)",
                } as MotionStyle
              }
              className="absolute inset-y-0 right-0 z-10 flex w-1/2 items-center px-6 md:px-10"
            >
              <FeesBody className="max-w-md" />
            </motion.div>

            {/* Weight half (carries its own glow so the energy travels with it) */}
            <motion.div
              style={{ x: weightX, y: weightY, scale: weightScale }}
              className="absolute inset-y-0 left-0 z-20 flex w-1/2 items-center justify-center px-6"
            >
              <GlowOrb className="left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2" />
              <FeesWeight />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Static fallback for mobile + reduced motion: copy left, weight right. */
function StaticStage() {
  return (
    <div className="relative mx-auto max-w-5xl px-6 pt-28 md:pt-40">
      <div className="grid items-center gap-14 md:grid-cols-2">
        <div className="text-center md:text-left">
          <FeesHeadline />
          <FeesBody className="mx-auto mt-6 max-w-md md:mx-0" />
        </div>
        <div className="relative">
          <GlowOrb className="left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2" />
          <FeesWeight />
        </div>
      </div>
    </div>
  );
}

export default function FeesSection() {
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const swap = !reduce && !isMobile;

  return (
    <section id="fees" className="relative scroll-mt-24 bg-black">
      {swap ? <SwapStage /> : <StaticStage />}
    </section>
  );
}
