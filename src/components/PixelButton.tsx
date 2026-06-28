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
  /** How strongly the sweep follows the pointer-origin radial vs. the random scatter (0..1). */
  directionalWeight?: number;
}

export default function PixelButton({
  baseColor = "#a855f7",
  hoverColor = "#0a0a0a",
  hoverTextColor = "#a855f7",
  pixelSize = 13,
  sweepMs = 420,
  directionalWeight = 0.8,
  className,
  children,
  style,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: PixelButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Where the pixel sweep originates, as a fraction (0..1) of the button box.
  // Set to the pointer's position on enter/leave so the reveal radiates from the
  // exact point the cursor crossed — hovering in from the left vs. the right
  // plays the animation from opposite sides, and it drains back out toward
  // wherever the cursor leaves. Defaults to the left edge so the keyboard-focus
  // sweep (which has no pointer) still reads as a left-to-right wipe.
  const [origin, setOrigin] = useState({ fx: 0, fy: 0.5 });

  // The reveal is driven from state (NOT CSS :hover) so that the origin and the
  // opacity flip land in the *same* React commit. If the opacity were toggled by
  // :hover, the browser would start the transition before the new per-pixel
  // delays were applied, and the reveal-in would use the previous origin.
  const [hovering, setHovering] = useState(false);
  const [keyFocused, setKeyFocused] = useState(false);
  const active = hovering || keyFocused;

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
    window.addEventListener("resize", onResize, { passive: true });
    // Webfonts can change the label width after first paint; re-snap when ready.
    document.fonts?.ready.then(() => measure()).catch(() => {});

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [pixelSize]);

  const { cols, rows, cell } = grid;

  // The pointer's position relative to the button, as a 0..1 fraction of each
  // axis. Null until the button has a measured box.
  const originFromEvent = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = buttonRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    return {
      fx: Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)),
      fy: Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)),
    };
  };

  // Per-pixel reveal delays: a radial wipe emanating from the pointer origin
  // (the cell nearest the cursor lights first, the farthest corner last) blended
  // with a seeded jitter so the edge looks broken up rather than a clean front.
  const delays = useMemo(() => {
    const total = cols * rows;
    // Origin in cell-grid units. Cells are square, so grid distance ∝ px distance
    // and the wipe stays circular regardless of the button's aspect ratio.
    const ox = origin.fx * cols;
    const oy = origin.fy * rows;
    // Normalise by the farthest corner so the sweep always spans the whole button
    // in `sweepMs`, wherever it starts from.
    const maxDist =
      Math.max(
        Math.hypot(ox, oy),
        Math.hypot(cols - ox, oy),
        Math.hypot(ox, rows - oy),
        Math.hypot(cols - ox, rows - oy)
      ) || 1;
    return Array.from({ length: total }, (_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const directional =
        Math.hypot(col + 0.5 - ox, row + 0.5 - oy) / maxDist;
      const rand = seededRandom(i * 1.37 + 0.5);
      const progress = Math.min(
        1,
        Math.max(0, directional * directionalWeight + rand * (1 - directionalWeight))
      );
      return Math.round(progress * sweepMs);
    });
  }, [cols, rows, sweepMs, directionalWeight, origin]);

  return (
    <button
      ref={buttonRef}
      data-slot="pixel-button"
      suppressHydrationWarning
      className={cn(
        "relative isolate inline-flex shrink-0 items-center justify-center overflow-hidden",
        "border-2 font-black whitespace-nowrap select-none outline-none",
        "transition-transform duration-150 active:scale-95",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        "disabled:pointer-events-none disabled:opacity-50",
        // motion-reduce: skip the pixels, just crossfade the label.
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
      onPointerEnter={(e) => {
        // Set origin + reveal in one batch so the delays are in place the moment
        // the pixels start fading in — the sweep begins at the cursor.
        const o = originFromEvent(e);
        if (o) setOrigin(o);
        setHovering(true);
        onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        // Re-origin at the exit point so the fill drains back out toward it.
        const o = originFromEvent(e);
        if (o) setOrigin(o);
        setHovering(false);
        onPointerLeave?.(e);
      }}
      onFocus={(e) => {
        // Mirror the old :focus-visible reveal for keyboard users (no pointer, so
        // the default left-edge origin is used). Ignore mouse-click focus.
        let visible = true;
        try {
          visible = e.currentTarget.matches(":focus-visible");
        } catch {
          visible = true;
        }
        if (visible) setKeyFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setKeyFocused(false);
        onBlur?.(e);
      }}
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
            className="transition-opacity ease-out"
            style={{
              backgroundColor: hoverColor,
              // 1px spread bleeds into neighbors to hide sub-pixel grid seams;
              // it rides the same opacity transition, so it's invisible at rest.
              boxShadow: `0 0 0 1px ${hoverColor}`,
              opacity: active ? 1 : 0,
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
        <span
          className="col-start-1 row-start-1 transition-opacity duration-300 ease-out"
          style={{ opacity: active ? 0 : 1 }}
        >
          {children}
        </span>
        <span
          aria-hidden="true"
          className="col-start-1 row-start-1 transition-opacity duration-300 ease-out"
          style={{ color: hoverTextColor, opacity: active ? 1 : 0 }}
        >
          {children}
        </span>
      </span>
    </button>
  );
}
