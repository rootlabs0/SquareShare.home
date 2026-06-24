"use client";

import { useMemo, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useIsMobile } from "@/hooks/useMediaQuery";

interface PixelTransitionProps {
  direction: "dark-to-light" | "light-to-dark";
}

// Deterministic pseudo-random in [0,1): a fixed "preset" scatter, identical
// every load, so the dissolve order is designed rather than truly random.
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 4.1414) * 43758.5453;
  return x - Math.floor(x);
}

// Where, within the element's scroll pass, the dissolve is active, and how long
// a single pixel takes to fade (all in scroll-progress units, 0..1).
const FADE_START = 0.12;
const FADE_END = 0.92;
const FADE_DURATION = 0.32;
// How much of the schedule follows the up/down wave vs. the random scatter.
const DIRECTIONAL_WEIGHT = 0.55;
const ROWS = 3;

interface Pixel {
  id: number;
  start: number;
  end: number;
  persistent: boolean;
  color: string;
}

export default function PixelTransition({ direction }: PixelTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Big, chunky blocks: few columns.
  const cols = isMobile ? 4 : 8;
  const rows = ROWS;

  // The second transition (light→dark, at the bottom) is the first one flipped
  // upside down: the same preset scatter mirrored over the horizontal axis, so
  // its anchors linger at the bottom and it dissolves top-down. Blocks only
  // fade; they never move.
  const flip = direction === "light-to-dark";

  const toColor = flip
    ? "var(--color-surface-dark)"
    : "var(--color-surface-light)";

  const pixels = useMemo<Pixel[]>(() => {
    const total = cols * rows;
    const span = FADE_END - FADE_START - FADE_DURATION;

    // Canonical (top) schedule per source cell: top rows linger, the bottom
    // fades first, with a deterministic scatter so it is not a clean sweep.
    const canonical = Array.from({ length: total }, (_, s) => {
      const row = Math.floor(s / cols);
      const rowNorm = row / (rows - 1); // 0 top .. 1 bottom
      const rand = seededRandom(s);
      const dir = 1 - rowNorm; // 0 = fades first, 1 = lingers
      const delay = Math.min(
        1,
        Math.max(0, dir * DIRECTIONAL_WEIGHT + rand * (1 - DIRECTIONAL_WEIGHT))
      );
      return { row, rand, delay };
    });

    // A handful of anchor cells that never fade. They scatter across the grid
    // (not locked to one row) with only a gentle lean toward the lingering edge,
    // and render solid black regardless of the gradient.
    const persistentCount = isMobile ? 3 : 5;
    const anchors = new Set(
      canonical
        .map((c, s) => ({ s, score: c.rand + (c.row / (rows - 1)) * 0.2 }))
        .sort((a, b) => a.score - b.score)
        .slice(0, persistentCount)
        .map((c) => c.s)
    );

    // Upside down (vertical flip): cell i reads the schedule of the cell in the
    // mirrored row, same column.
    const flipVertical = (i: number) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      return (rows - 1 - row) * cols + col;
    };

    return Array.from({ length: total }, (_, i) => {
      const source = flip ? flipVertical(i) : i;
      const c = canonical[source];
      const start = FADE_START + c.delay * span;
      const persistent = anchors.has(source);
      // Non-anchor pixels lighten toward the band's light edge (bottom for T1,
      // top for the flipped T2), with a per-square jitter so a whole row is
      // never one flat shade. Anchor pixels stay solid black.
      const rowNorm = Math.floor(i / cols) / (rows - 1);
      const base = flip ? 1 - rowNorm : rowNorm;
      const jitter = (seededRandom(i * 3 + 777) - 0.5) * 0.42;
      const light = Math.round(
        Math.min(1, Math.max(0.05, base * 0.9 + 0.05 + jitter)) * 100
      );
      return {
        id: i,
        start,
        end: start + FADE_DURATION,
        persistent,
        color: persistent
          ? "var(--color-surface-dark)"
          : `color-mix(in oklab, var(--color-surface-light) ${light}%, var(--color-surface-dark))`,
      };
    });
  }, [cols, rows, flip, isMobile]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: toColor }}
    >
      <div
        className="grid w-full"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {pixels.map((pixel) => (
          <PixelBlock
            key={pixel.id}
            pixel={pixel}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
}

interface PixelBlockProps {
  pixel: Pixel;
  scrollYProgress: MotionValue<number>;
}

function PixelBlock({ pixel, scrollYProgress }: PixelBlockProps) {
  const opacity = useTransform(
    scrollYProgress,
    [pixel.start, pixel.end],
    pixel.persistent ? [1, 1] : [1, 0]
  );

  return (
    <motion.div
      className="aspect-square w-full"
      style={{ backgroundColor: pixel.color, opacity }}
    />
  );
}
