"use client";

import { useEffect, useRef } from "react";
import type { RoadmapItem } from "./data";
import ApiPanel from "./ApiPanel";
import MarketplacePanel from "./MarketplacePanel";
import EmbedsSection from "./EmbedsSection";

// Pixel grid for the trail. Each "pixel" is a DOT×DOT square snapped to a CELL grid.
const CELL = 10;
const DOT = 9;
const DIM_ALPHA = 0.14; // faint resting visibility of the trail
const GLIMMER_PEAK = 0.85; // added brightness at the centre of the glimmer
const GLIMMER_WIDTH = 55; // px falloff of the glimmer band
const TRAVEL_MS = 2400; // time for the glimmer to travel the whole path
const GAP_MS = 2400; // pause between passes

type Pt = { x: number; y: number };
type Cell = { gx: number; gy: number; s: number; y: number };
type Geom = {
  cells: Cell[];
  length: number;
  w: number;
  h: number;
  tailStartY: number;
  tailSpan: number;
  headStartY: number;
  headSpan: number;
  extraAbove: number;
};

// The roadmap as three stations threaded by a single pixel trail with only
// right-angle turns:
//   Card 1 (left)  - exits the RIGHT edge
//   Card 2 (right) - the trail runs down through it (top -> bottom)
//   Card 3 (left)  - enters the RIGHT edge, exits the BOTTOM
//   Tail           - drops straight down to the section bottom, fading out
// A glimmer periodically flows along the path. On mobile the trail is hidden;
// under prefers-reduced-motion the glimmer is disabled (static faint trail).
export default function RoadmapTrail({
  api,
  feed,
}: {
  api: RoadmapItem;
  feed: RoadmapItem;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const s0 = useRef<HTMLDivElement>(null);
  const s1 = useRef<HTMLDivElement>(null);
  const s2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapEl = wrap.current;
    const cv = canvas.current;
    if (!wrapEl || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const stations = [s0, s1, s2];

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let geom: Geom | null = null;
    let raf = 0;
    let start = performance.now();

    // Rasterise a Manhattan polyline into grid-snapped cells tagged with arc length.
    const rasterise = (points: Pt[]): { cells: Cell[]; length: number } => {
      const cells: Cell[] = [];
      let s = 0;
      let pgx = NaN;
      let pgy = NaN;
      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        const len = Math.hypot(b.x - a.x, b.y - a.y);
        const steps = Math.max(1, Math.ceil(len / 2));
        for (let k = 0; k <= steps; k++) {
          const t = k / steps;
          const x = a.x + (b.x - a.x) * t;
          const y = a.y + (b.y - a.y) * t;
          const gx = Math.round(x / CELL);
          const gy = Math.round(y / CELL);
          if (gx === pgx && gy === pgy) continue;
          cells.push({ gx, gy, s: s + len * t, y });
          pgx = gx;
          pgy = gy;
        }
        s += len;
      }
      return { cells, length: s };
    };

    const layout = () => {
      const w = cv.clientWidth;
      const wrapH = wrapEl.clientHeight;
      if (!w || !wrapH) return;

      const desktop = window.innerWidth >= 768;
      if (!desktop) {
        geom = null;
        cv.style.top = "0px";
        cv.style.height = "0px";
        cv.width = 0;
        cv.height = 0;
        return;
      }

      // Extend the canvas to span the full <section>: down past card 3 so the tail
      // runs through the bottom padding, and up to the section's top edge so the
      // head can run all the way up and fade out at the very top.
      const sectionEl = wrapEl.closest("section");
      const sectionRect = sectionEl?.getBoundingClientRect() ?? null;
      const wrapRectFull = wrapEl.getBoundingClientRect();
      const sectionBottom = sectionRect ? sectionRect.bottom : wrapRectFull.bottom;
      const extraBelow = Math.max(0, sectionBottom - wrapRectFull.bottom);
      const h = wrapH + extraBelow;

      const sectionTop = sectionRect ? sectionRect.top : wrapRectFull.top;
      const extraAbove = Math.max(0, wrapRectFull.top - sectionTop);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor((extraAbove + h) * dpr);
      cv.style.top = -extraAbove + "px";
      cv.style.height = extraAbove + h + "px"; // overflow above (head) and below (tail)
      // Shift the origin down so wrap-local y still maps correctly; negative y now
      // paints into the extended region above the wrap.
      ctx.setTransform(dpr, 0, 0, dpr, 0, extraAbove * dpr);

      const wrapRect = wrapEl.getBoundingClientRect();
      const rects = stations.map((r) => r.current?.getBoundingClientRect() ?? null);
      if (rects.some((rc) => !rc)) return;
      const toLocal = (rc: DOMRect) => ({
        top: rc.top - wrapRect.top,
        bot: rc.bottom - wrapRect.top,
        left: rc.left - wrapRect.left,
        right: rc.right - wrapRect.left,
      });
      const c1 = toLocal(rects[0]!);
      const c2 = toLocal(rects[1]!);
      const c3 = toLocal(rects[2]!);

      const c1cy = (c1.top + c1.bot) / 2;
      const c3cy = (c3.top + c3.bot) / 2;
      const hx = c1.left + (c1.right - c1.left) * 0.44; // head entry x into card 1
      const x2 = c2.left + (c2.right - c2.left) * 0.32; // vertical run x in card 2
      const ex = c3.left + (c3.right - c3.left) * 0.44; // card 3 bottom exit x

      // Manhattan route — right-angle turns only:
      //   head runs up to the section's top edge -> down into card 1 -> right out
      //   of card 1 -> down (through card 2) -> down to card 3 level -> left (into
      //   card 3 right edge) -> down (out the bottom) -> tail
      const headTopY = -extraAbove; // section top, in wrap-local coords
      // Fully visible from card 1 up to headFadeStart, then fades over the topmost
      // band so the path dissolves right at the section's top edge.
      const headFadeSpan = Math.min(extraAbove, Math.max(140, extraAbove * 0.5));
      const headFadeStart = headTopY + headFadeSpan;
      const points: Pt[] = [
        { x: hx, y: headTopY },
        { x: hx, y: c1cy },
        { x: c1.right - 14, y: c1cy },
        { x: x2, y: c1cy },
        { x: x2, y: c3cy },
        { x: ex, y: c3cy },
        { x: ex, y: h - 4 },
      ];

      const { cells, length } = rasterise(points);
      geom = {
        cells,
        length,
        w,
        h,
        tailStartY: c3.bot,
        tailSpan: Math.max(1, h - 4 - c3.bot),
        headStartY: headFadeStart,
        headSpan: Math.max(1, headFadeSpan),
        extraAbove,
      };
    };

    const tailFade = (g: Geom, y: number): number => {
      if (y <= g.tailStartY) return 1;
      const t = Math.min(1, (y - g.tailStartY) / g.tailSpan);
      return 1 - t * t; // quadratic fade into the next section
    };

    const headFade = (g: Geom, y: number): number => {
      if (y >= g.headStartY) return 1;
      const t = Math.min(1, (g.headStartY - y) / g.headSpan);
      return 1 - t * t; // quadratic fade out toward the top
    };

    // Draw one frame. head = the glimmer's arc-length position, or null for none.
    const render = (head: number | null) => {
      if (!geom) return;
      const g = geom;
      ctx.clearRect(0, -g.extraAbove, g.w, g.extraAbove + g.h);
      const twoW2 = 2 * GLIMMER_WIDTH * GLIMMER_WIDTH;
      const reach = GLIMMER_WIDTH * 3;
      for (const c of g.cells) {
        const fade = tailFade(g, c.y) * headFade(g, c.y);
        let a = DIM_ALPHA * fade;
        if (head !== null) {
          const d = c.s - head;
          if (d > -reach && d < reach) {
            a += GLIMMER_PEAK * fade * Math.exp(-(d * d) / twoW2);
          }
        }
        if (a <= 0.004) continue;
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, a).toFixed(3)})`;
        ctx.fillRect(c.gx * CELL, c.gy * CELL, DOT, DOT);
      }
    };

    const frame = (now: number) => {
      if (geom) {
        const cycle = TRAVEL_MS + GAP_MS;
        const phase = (now - start) % cycle;
        let head: number | null = null;
        if (phase < TRAVEL_MS) {
          const p = phase / TRAVEL_MS;
          // Run from just before the start to just past the end so the glimmer
          // eases on and off the path edges.
          head = -GLIMMER_WIDTH * 2 + p * (geom.length + GLIMMER_WIDTH * 4);
        }
        render(head);
      }
      raf = requestAnimationFrame(frame);
    };

    const startLoop = () => {
      if (!raf) {
        start = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const stopLoop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    layout();

    // Animate only while the section is on-screen; static faint trail otherwise.
    let io: IntersectionObserver | null = null;
    if (reduced) {
      render(null);
    } else {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) startLoop();
          else {
            stopLoop();
            render(null);
          }
        },
        { threshold: 0 },
      );
      io.observe(wrapEl);
    }

    const onResize = () => {
      layout();
      if (reduced || !raf) render(null);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(wrapEl);
    window.addEventListener("resize", onResize, { passive: true });
    const t = window.setTimeout(onResize, 450);

    return () => {
      stopLoop();
      io?.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div ref={wrap} className="future-trail-wrap relative mt-12 md:mt-16">
      <canvas ref={canvas} className="future-trail" aria-hidden="true" />

      <div className="future-stations">
        <div ref={s0} className="future-station">
          <ApiPanel step={api} />
        </div>
        <div ref={s1} className="future-station">
          <MarketplacePanel step={feed} />
        </div>
        <div ref={s2} className="future-station">
          <EmbedsSection />
        </div>
      </div>
    </div>
  );
}
