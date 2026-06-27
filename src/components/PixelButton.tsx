"use client";

import * as React from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Same deterministic hash used by PixelReveal, so the scatter is a designed
// preset (identical every render) rather than truly random.
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 4.1414) * 43758.5453;
  return x - Math.floor(x);
}

interface PixelButtonProps extends React.ComponentProps<"button"> {
  /** Resting background color. */
  baseColor?: string;
  /** Color the pixels sweep in on hover. */
  hoverColor?: string;
  /** Label color while hovered (default keeps the base background visible). */
  hoverTextColor?: string;
  /**
   * Side length, in CSS px, of one hover pixel. The button is snapped to a whole
   * multiple of this in BOTH axes, so every grid cell is a perfect square — never
   * a rectangle — regardless of the label width.
   */
  pixelSize?: number;
  /** Total time, in ms, for the sweep to cross the button. */
  sweepMs?: number;
  /** How strongly the sweep follows the diagonal vs. the random scatter (0..1). */
  directionalWeight?: number;
}

export default function PixelButton({
  baseColor = "#a855f7",
  hoverColor = "#0a0a0a",
  hoverTextColor = "#a855f7",
  pixelSize = 13,
  sweepMs = 420,
  directionalWeight = 0.6,
  className,
  children,
  style,
  ...props
}: PixelButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Grid derived from the rendered size: the cell is a perfect square (height /
  // rows), and the width is snapped to a whole number of those squares so the
  // grid tiles the button exactly — no rectangles, whatever the label width.
  const [grid, setGrid] = useState({ cols: 1, rows: 1, cell: pixelSize });

  useIsoLayoutEffect(() => {
    const el = buttonRef.current;
    if (!el) return;

    const measure = () => {
      // Read the NATURAL layout size with our own width override removed, so the
      // measurement never feeds back on the value we set (content width on a
      // desktop row, full-bleed stretch in a mobile column).
      el.style.width = "";
      const cs = getComputedStyle(el);
      const bL = parseFloat(cs.borderLeftWidth) || 0;
      const bR = parseFloat(cs.borderRightWidth) || 0;
      const bT = parseFloat(cs.borderTopWidth) || 0;
      const bB = parseFloat(cs.borderBottomWidth) || 0;
      const rect = el.getBoundingClientRect();
      const w = rect.width - bL - bR; // padding box = the pixel grid's area
      const h = rect.height - bT - bB;

      // One square pixel = height / rows, so the rows fill the height exactly;
      // then snap the width to a whole number of those squares.
      const rows = Math.max(1, Math.round(h / pixelSize));
      const cell = h / rows;
      const cols = Math.max(1, Math.round(w / cell));
      el.style.width = `${cols * cell + bL + bR}px`;

      setGrid((prev) =>
        prev.cols === cols &&
        prev.rows === rows &&
        Math.abs(prev.cell - cell) < 0.05
          ? prev
          : { cols, rows, cell }
      );
    };

    measure();

    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    window.addEventListener("resize", onResize);
    // Webfonts can change the label width after first paint; re-snap when ready.
    document.fonts?.ready.then(() => measure()).catch(() => {});

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [pixelSize]);

  const { cols, rows, cell } = grid;

  // Per-pixel reveal delays: a left-to-right, slightly top-down diagonal blended
  // with a seeded jitter so the edge looks broken up rather than a clean wipe.
  const delays = useMemo(() => {
    const total = cols * rows;
    return Array.from({ length: total }, (_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const directional =
        (col / Math.max(1, cols - 1)) * 0.8 + (row / Math.max(1, rows - 1)) * 0.2;
      const rand = seededRandom(i * 1.37 + 0.5);
      const progress = Math.min(
        1,
        Math.max(0, directional * directionalWeight + rand * (1 - directionalWeight))
      );
      return Math.round(progress * sweepMs);
    });
  }, [cols, rows, sweepMs, directionalWeight]);

  return (
    <button
      ref={buttonRef}
      data-slot="pixel-button"
      suppressHydrationWarning
      className={cn(
        "group/pixel relative isolate inline-flex shrink-0 items-center justify-center overflow-hidden",
        "border-2 font-black whitespace-nowrap select-none outline-none",
        "transition-transform duration-150 active:scale-95",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        "disabled:pointer-events-none disabled:opacity-50",
        // motion-reduce: skip the pixels, just crossfade the background.
        "motion-reduce:transition-colors",
        className
      )}
      style={
        {
          backgroundColor: baseColor,
          borderColor: baseColor,
          color: "#000000",
          "--pixel-hover-text": hoverTextColor,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* Pixel sweep overlay — sits behind the label, clipped to the button.
          Fixed px tracks (not 1fr) keep every cell a perfect square. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 grid motion-reduce:hidden"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
          gridTemplateRows: `repeat(${rows}, ${cell}px)`,
        }}
      >
        {delays.map((delay, i) => (
          <span
            key={i}
            className={cn(
              "opacity-0 transition-opacity ease-out",
              "group-hover/pixel:opacity-100 group-focus-visible/pixel:opacity-100"
            )}
            style={{
              backgroundColor: hoverColor,
              // 1px spread bleeds into neighbors to hide sub-pixel grid seams;
              // it rides the same opacity transition, so it's invisible at rest.
              boxShadow: `0 0 0 1px ${hoverColor}`,
              transitionDuration: "150ms",
              transitionDelay: `${delay}ms`,
            }}
          />
        ))}
      </span>

      {/* Label: two copies stacked in one grid cell, both ABOVE the pixels and
          crossfaded. A contrasting copy is always visible, so the text never
          drops to black-on-black mid-sweep (which read as a flicker/reload). */}
      <span className="relative z-10 grid place-items-center">
        <span className="col-start-1 row-start-1 transition-opacity duration-300 ease-out group-hover/pixel:opacity-0 group-focus-visible/pixel:opacity-0">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="col-start-1 row-start-1 opacity-0 transition-opacity duration-300 ease-out group-hover/pixel:opacity-100 group-focus-visible/pixel:opacity-100"
          style={{ color: hoverTextColor }}
        >
          {children}
        </span>
      </span>
    </button>
  );
}
