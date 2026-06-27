"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useInView } from "framer-motion";

type Direction = "dark-to-light" | "light-to-dark";

interface PixelRevealProps {
  children: ReactNode;
  /**
   * Which surface color the covering pixels are. "dark-to-light" lays a dark
   * curtain (bridging a dark section above) that dissolves to reveal a light
   * surface; "light-to-dark" is the inverse.
   */
  direction?: Direction;
  /** Approximate side length of one pixel block, in CSS px. Smaller = finer grid. */
  cellSize?: number;
  className?: string;
}

// Deterministic pseudo-random in [0,1): a fixed scatter, identical every load,
// so the dissolve order is a designed preset rather than truly random.
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 4.1414) * 43758.5453;
  return x - Math.floor(x);
}

// Time-based dissolve (ms). The whole curtain clears in ~FADE_MS + STAGGER_MS,
// so the reveal "just plays" on enter instead of being scrubbed by the scroll.
const FADE_MS = 750; // how long one block takes to fade out
const STAGGER_MS = 1500; // spread of start delays across the grid
// How much the delay follows a top-down sweep vs. the random scatter (0..1).
const DIRECTIONAL_WEIGHT = 0.45;

// Used for the first (server + initial client) render, before we measure.
const DEFAULT_COLS = 8;
const DEFAULT_ROWS = 4;

export default function PixelReveal({
  children,
  direction = "dark-to-light",
  cellSize = 140,
  className = "",
}: PixelRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  // Fire once, as soon as a third of the curtain has scrolled into view.
  const inView = useInView(rootRef, { once: true, amount: 0.33 });

  const [grid, setGrid] = useState({ cols: DEFAULT_COLS, rows: DEFAULT_ROWS });
  const [reducedMotion, setReducedMotion] = useState(false);

  // Pick cols×rows from the covered area so the blocks stay roughly square at
  // any width/height, and re-measure on resize.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMq = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onMq);

    const measure = () => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const cell = window.matchMedia("(max-width: 768px)").matches
        ? cellSize * 0.78
        : cellSize;
      const cols = Math.max(3, Math.round(r.width / cell));
      const rows = Math.max(2, Math.round(r.height / cell));
      setGrid((p) => (p.cols === cols && p.rows === rows ? p : { cols, rows }));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", onMq);
    };
  }, [cellSize]);

  const { cols, rows } = grid;

  const cover =
    direction === "dark-to-light"
      ? "var(--color-surface-dark)"
      : "var(--color-surface-light)";
  const accent =
    direction === "dark-to-light"
      ? "var(--color-surface-light)"
      : "var(--color-surface-dark)";

  const blocks = useMemo(() => {
    const total = cols * rows;
    return Array.from({ length: total }, (_, i) => {
      const row = Math.floor(i / cols);
      const rowNorm = rows > 1 ? row / (rows - 1) : 0; // 0 top .. 1 bottom
      const rand = seededRandom(i * 1.37 + 0.5);
      // Clear from the bottom up (bottom row fades first, top lingers), blended
      // with a scatter so the edge breaks up instead of wiping cleanly.
      const progress = Math.min(
        1,
        Math.max(
          0,
          (1 - rowNorm) * DIRECTIONAL_WEIGHT + rand * (1 - DIRECTIONAL_WEIGHT)
        )
      );
      const delay = Math.round(progress * STAGGER_MS);
      // Subtle per-block shade toward the destination color so the curtain
      // reads as textured pixels rather than one flat slab.
      const tint = Math.round(seededRandom(i * 3 + 777) * 12); // 0..12%
      return {
        id: i,
        delay,
        color: `color-mix(in oklab, ${cover} ${100 - tint}%, ${accent})`,
      };
    });
  }, [cols, rows, cover, accent]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {children}
      {!reducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {blocks.map((b) => (
            <div
              key={b.id}
              style={{
                backgroundColor: b.color,
                opacity: inView ? 0 : 1,
                transition: `opacity ${FADE_MS}ms ease-out`,
                transitionDelay: `${inView ? b.delay : 0}ms`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
