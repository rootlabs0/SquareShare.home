"use client";

import { useEffect, useRef } from "react";

// One continuous white pixel line that weaves left-to-right across the band.
// Built from big square pixels on a grid and kept one pixel thick: each column
// fills the cells between the previous and current height, so the line steps
// (blocky, not smooth) but never breaks. The wave is a sum of sines, so it
// reads as irregular rather than a clean repeating curve.
const CELL = 16; // pixel pitch
const DOT = 12; // lit square size

export default function PixelPath({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (!w || !h) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const midY = h * 0.85;
      const reach = Math.min(h * 0.1, 64);
      const base = (Math.PI * 2) / Math.max(360, w / Math.max(2, Math.round(w / 540)));
      // Irregular weave: a few sines of different frequency and phase.
      const waveY = (x: number) =>
        midY +
        reach * 0.62 * Math.sin(x * base) +
        reach * 0.27 * Math.sin(x * base * 2.3 + 1.7) +
        reach * 0.16 * Math.sin(x * base * 0.55 + 0.5);

      ctx.fillStyle = "rgba(255,255,255,0.42)";
      let prev: number | null = null;
      for (let x = 0; x <= w; x += CELL) {
        const yc = Math.round(waveY(x) / CELL);
        if (prev === null) prev = yc;
        const lo = Math.min(prev, yc);
        const hi = Math.max(prev, yc);
        for (let yy = lo; yy <= hi; yy++) {
          ctx.fillRect(x, yy * CELL, DOT, DOT);
        }
        prev = yc;
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    window.addEventListener("resize", draw, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", draw);
    };
  }, []);

  return (
    <canvas ref={ref} aria-hidden="true" className={`pointer-events-none ${className}`} />
  );
}
