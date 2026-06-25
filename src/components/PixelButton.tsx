"use client";

import * as React from "react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

// Same deterministic hash used by PixelTransition, so the scatter is a designed
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
  /** Grid density. More = finer pixels. */
  cols?: number;
  rows?: number;
  /** Total time, in ms, for the sweep to cross the button. */
  sweepMs?: number;
  /** How strongly the sweep follows the diagonal vs. the random scatter (0..1). */
  directionalWeight?: number;
}

export default function PixelButton({
  baseColor = "#ff9900",
  hoverColor = "#0a0a0a",
  hoverTextColor = "#ff9900",
  cols = 16,
  rows = 4,
  sweepMs = 420,
  directionalWeight = 0.6,
  className,
  children,
  style,
  ...props
}: PixelButtonProps) {
  // Per-pixel reveal delays: a left-to-right, slightly top-down diagonal blended
  // with a seeded jitter so the edge looks broken up rather than a clean wipe.
  const delays = useMemo(() => {
    const total = cols * rows;
    return Array.from({ length: total }, (_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const directional =
        (col / (cols - 1)) * 0.8 + (row / Math.max(1, rows - 1)) * 0.2;
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
      data-slot="pixel-button"
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
      {/* Pixel sweep overlay — sits behind the label, clipped to the button. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 grid motion-reduce:hidden"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
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
