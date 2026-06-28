"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Deterministic pseudo-random in [0,1) — a fixed scatter, identical every load.
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 4.1414) * 43758.5453;
  return x - Math.floor(x);
}

const ROWS = 6;
const DEFAULT_COLS = 18; // server / pre-measure render

// A static, irregular black "pixel" border for a black -> white section seam.
// Drop it at the very top of a light section that sits directly under a dark
// (black) one: the top row is solid black (continuing the dark section), then
// each column drops to a random depth with a few detached squares scattered
// below, so the edge breaks into a jagged run of black squares instead of a
// straight line. Purely decorative.
export default function PixelEdge({
  cellSize = 24,
  color = "var(--color-surface-dark)",
  className = "",
}: {
  cellSize?: number;
  color?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(DEFAULT_COLS);

  // Pick the column count from the measured width so the blocks stay square at
  // any viewport size, and re-measure on resize.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = el.getBoundingClientRect().width;
      if (!w) return;
      const cell = window.matchMedia("(max-width: 768px)").matches
        ? cellSize * 0.7
        : cellSize;
      setCols((prev) => {
        const next = Math.max(6, Math.round(w / cell));
        return prev === next ? prev : next;
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cellSize]);

  const cells = useMemo(() => {
    // Per-column black depth. Each column jumps toward a *fresh* random depth
    // (so the edge looks noisy/random, not a smooth drifting wave), but is
    // capped to within 2 of the previous column, so there is never a 3-tall
    // black spike or white notch. Every column is solid from the top down to
    // its depth (no detached squares), keeping the top joined to the dark
    // section above.
    const MIN_D = 2;
    const MAX_D = ROWS;
    const span = MAX_D - MIN_D + 1;
    const depths: number[] = [];
    let d = MIN_D + Math.floor(seededRandom(2.7) * span);
    for (let c = 0; c < cols; c++) {
      if (c > 0) {
        const target = MIN_D + Math.floor(seededRandom(c * 1.37 + 0.5) * span);
        // Mostly move at most 1 from the previous column, only occasionally 2,
        // so the edge stays random without so many tall 1-column "drips".
        const limit = seededRandom(c * 5.1 + 9) < 0.22 ? 2 : 1;
        d = Math.min(d + limit, Math.max(d - limit, target));
      }
      depths.push(d);
    }
    return Array.from({ length: cols * ROWS }, (_, i) => {
      const r = Math.floor(i / cols);
      return r < depths[i % cols];
    });
  }, [cols]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none -mt-px grid w-full ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        aspectRatio: `${cols} / ${ROWS}`,
      }}
    >
      {cells.map((on, i) => (
        <div key={i} style={on ? { backgroundColor: color } : undefined} />
      ))}
    </div>
  );
}
