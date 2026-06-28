"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

// Render the word as plain static text (skipping the cursor-swarm canvas, its
// requestAnimationFrame loop and pointer tracking) when the user prefers reduced
// motion OR on small/touch screens — there the swarm is the heaviest thing above
// the fold and the pointer-repulsion interaction is pointless without a mouse.
// The server snapshot is false, so SSR and the first client render agree (no
// hydration mismatch); React reconciles to the real value after hydration.
const STATIC_QUERY = "(prefers-reduced-motion: reduce), (max-width: 768px)";

function useStaticWord(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(STATIC_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(STATIC_QUERY).matches,
    () => false
  );
}

/*
  CursorWord renders a single word as a swarm of fake "customer" mouse cursors.

  On load the cursors roam around the word's slot (a marketplace crowd); after a
  short delay they fly in and bunch together to spell the word. Hovering the
  formed word makes the cursors flee a repulsion field that follows the pointer,
  then drift back and re-spell it — a repeatable loop.

  Implementation mirrors PixelGrid.tsx: one 2D canvas, one requestAnimationFrame
  loop, DPR-aware backing store, ResizeObserver, and a prefers-reduced-motion
  branch. Everything lives in one canvas-local CSS-px coordinate system; sampled
  glyph targets are offset by a constant `pad`, and the pointer is mapped through
  the canvas's own bounding rect — so there is only ever one coordinate space.
*/

// Figma-style arrow pointer, identical path to CursorPointer.tsx. The tip sits
// near the top-left; the box spans roughly x4..16.7, y2.2..21.
const ARROW_PATH =
  "M4 2.2 L4 18.8 L8.3 14.6 L11.1 21 L13.8 19.8 L11 13.5 L16.7 13.2 Z";
// Anchor point placed on each target: the arrow's visual centre rather than
// its tip, so the formed word sits tight on the baseline and the cursor bodies
// don't smear down-right (which hurt readability).
const ARROW_ANCHOR_X = 10.35; // (4 + 16.7) / 2
const ARROW_ANCHOR_Y = 11.6; // (2.2 + 21) / 2
const ARROW_UNIT_HEIGHT = 18.8; // path height (21 - 2.2), used to scale to px

// Extra tracking applied to the cursor word (as a fraction of font size) so the
// letters separate and stay legible — an unreadable word loses visitors.
const LETTER_SPACING_RATIO = 0.09;

// Physics tunables (frame-based, like PixelGrid's per-frame easing).
const SPRING_ASSEMBLE = 0.085; // pull toward target while flying in
const SPRING_FORMED = 0.05; // gentler hold once spelled
const DAMP_ROAM = 0.92;
const DAMP_ACTIVE = 0.8;
const WANDER_ACCEL = 0.025;
const ROAM_MAX_SPEED = 1.1;
const HALO = 56; // how far cursors may roam/scatter beyond the word box (CSS px)
const CONTAIN_K = 0.012; // soft pushback toward the roam region
const REPEL_RADIUS = 80;
const REPEL_FORCE = 2.0;
const BOB_AMP = 0.5; // idle vertical bob once formed
const BOB_SPEED = 0.0016;
const ASSEMBLE_FALLBACK_MS = 1800; // force "formed" even if not fully settled

// Faint white outline on every cursor (like CursorPointer's stroke, dialled
// down). Width is in arrow-unit space, so it scales with the cursor.
const BORDER_COLOR = "rgba(255, 255, 255, 0.6)";
const BORDER_WIDTH = 1.2;

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

// Draw a geometric cross for the letter "t" (straight stem to the baseline +
// a crossbar) instead of the font's curved-foot glyph. x0 is the glyph's pen
// start; baselineY is the text baseline; ascent is the word's cap-ish ascent
// (so the cross sits at the right height). Sized from fontPx so letter-spacing
// on the trailing edge doesn't shift it.
function drawCrossT(
  ctx: CanvasRenderingContext2D,
  x0: number,
  baselineY: number,
  ascent: number,
  fontPx: number
): void {
  const stem = Math.max(2, fontPx * 0.15); // matches font-black stroke weight
  const cx = x0 + fontPx * 0.2; // stem centre, ~middle of the t's advance
  const top = baselineY - ascent * 0.95;
  ctx.fillRect(cx - stem / 2, top, stem, baselineY - top); // vertical stem
  const half = fontPx * 0.185;
  const crossY = baselineY - ascent * 0.64;
  ctx.fillRect(cx - half, crossY, half * 2, stem); // crossbar
}

// Draw a geometric lowercase "e" with an exaggerated, guaranteed-open aperture
// (lower-right gap). The font's own "e" has a small aperture that the overlapping
// cursors fill in, making it read as an "o" with a bar — this keeps it legible.
// x0 is the glyph pen start; baselineY the baseline; xHeight the e's body height.
function drawE(
  ctx: CanvasRenderingContext2D,
  x0: number,
  baselineY: number,
  fontPx: number,
  xHeight: number
): void {
  const W = fontPx * 0.5; // body width, ~matches the font o
  const Lx = x0 + fontPx * 0.025; // small left bearing
  const cx = Lx + W / 2;
  const cy = baselineY - xHeight / 2;
  const rx = W / 2;
  const ry = xHeight / 2;
  const sw = fontPx * 0.145; // stroke weight, ~font-black
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  // Hollow out the counter.
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.ellipse(cx, cy, Math.max(1, rx - sw), Math.max(1, ry - sw), 0, 0, Math.PI * 2);
  ctx.fill();
  // Crossbar across the middle.
  ctx.globalCompositeOperation = "source-over";
  ctx.fillRect(Lx, cy - sw / 2, W, sw);
  // Open the lower-right (the aperture) so it can't read as an "o".
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillRect(cx, cy + sw / 2, rx + sw, baselineY - (cy + sw / 2) + 1);
  ctx.restore();
}

// Resolve a CSS custom property (e.g. var(--color-acid)) to its value so the
// canvas can use it as a fillStyle; pass-through for plain colors. (Same helper
// shape as PixelGrid.tsx.)
function resolveColor(input: string): string {
  if (input.startsWith("var(")) {
    const name = input.slice(4, -1).trim();
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
    return value || "#a855f7";
  }
  return input;
}

interface Cursor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number; // assigned glyph target
  ty: number;
  active: boolean;
  opacity: number;
  rot: number;
  bobPhase: number;
  homeAngle: number;
}

interface Point {
  x: number;
  y: number;
}

type Phase = "roam" | "assemble" | "formed";

interface CursorWordProps {
  word: string;
  className?: string;
  /** Cursor color: a #rrggbb hex or a CSS var like var(--color-acid). */
  cursorColor?: string;
  /** Max cursor pool size (scaled down at small font sizes). */
  count?: number;
  /** Delay before the swarm flies in and spells the word. */
  assembleDelayMs?: number;
  /** Slack (CSS px) around the word box so roaming/scatter isn't clipped. */
  pad?: number;
}

export default function CursorWord({
  word,
  className = "",
  cursorColor = "var(--color-acid)",
  count = 120,
  assembleDelayMs = 2000,
  pad = 80,
}: CursorWordProps) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isStatic = useStaticWord();

  useEffect(() => {
    if (isStatic) return;
    const canvas = canvasRef.current;
    const host = hostRef.current;
    const wordEl = wordRef.current;
    if (!canvas || !host || !wordEl) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    const fill = resolveColor(cursorColor);
    const arrow = new Path2D(ARROW_PATH);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let cssW = 0;
    let cssH = 0;
    const cursors: Cursor[] = [];
    let targets: Point[] = [];
    let phase: Phase = "roam";
    let arrowS = 0.8; // scale applied to the unit arrow path
    let assembleStart = 0;
    let ready = false;
    let visible = true;
    let raf = 0;
    let buildTimer = 0;

    // Roam/containment region (word box inflated by HALO), in canvas-local px.
    let inMinX = 0;
    let inMaxX = 0;
    let inMinY = 0;
    let inMaxY = 0;

    const pointer = { x: -9999, y: -9999, active: false };

    const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

    const spawn = (): Cursor => ({
      x: rand(inMinX, inMaxX),
      y: rand(inMinY, inMaxY),
      vx: rand(-0.6, 0.6),
      vy: rand(-0.6, 0.6),
      tx: 0,
      ty: 0,
      active: true,
      opacity: 0.6 + Math.random() * 0.4,
      rot: rand(-0.08, 0.08),
      bobPhase: Math.random() * Math.PI * 2,
      homeAngle: Math.random() * Math.PI * 2,
    });

    // Render the word to an offscreen canvas at the live computed font, then
    // sample its pixels on a grid to get glyph target points (canvas-local px).
    const sampleTargets = (
      wordW: number,
      wordH: number,
      effCount: number
    ): Point[] => {
      const cs = getComputedStyle(wordEl);
      const off = document.createElement("canvas");
      const octx = off.getContext("2d") as
        | (CanvasRenderingContext2D & { letterSpacing?: string })
        | null;
      if (!octx) return [];

      const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const fontPx = parseFloat(cs.fontSize) || 64;
      const letterSpacing = `${fontPx * LETTER_SPACING_RATIO}px`;
      const applyFont = () => {
        octx.font = font;
        if ("letterSpacing" in octx) octx.letterSpacing = letterSpacing;
        octx.textBaseline = "alphabetic";
        octx.textAlign = "left";
      };

      applyFont();
      const m = octx.measureText(word);
      const xHeight = octx.measureText("x").actualBoundingBoxAscent || fontPx * 0.52;
      const ascent = m.actualBoundingBoxAscent || fontPx * 0.8;
      const descent = m.actualBoundingBoxDescent || fontPx * 0.2;
      const fbAscent = m.fontBoundingBoxAscent || ascent;
      const fbDescent = m.fontBoundingBoxDescent || descent;
      const left = m.actualBoundingBoxLeft || 0;
      const right = m.actualBoundingBoxRight || m.width;
      const gw = Math.max(1, Math.ceil(left + right));
      const gh = Math.max(1, Math.ceil(ascent + descent));

      off.width = Math.ceil(gw * dpr);
      off.height = Math.ceil(gh * dpr);
      // Resizing the canvas resets its context state, so re-apply everything.
      octx.setTransform(dpr, 0, 0, dpr, 0, 0);
      applyFont();
      octx.fillStyle = "#fff";
      // Render glyph-by-glyph (positions taken from cumulative substring widths
      // so kerning/letter-spacing match a normal render) so we can swap the
      // curved "t" for a clean cross and the "e" for an open-aperture form.
      for (let i = 0; i < word.length; i++) {
        const ch = word[i];
        const x0 = left + octx.measureText(word.slice(0, i)).width;
        if (ch === "t" || ch === "T") {
          drawCrossT(octx, x0, ascent, ascent, fontPx);
        } else if (ch === "e" || ch === "E") {
          drawE(octx, x0, ascent, fontPx, xHeight);
        } else {
          octx.fillText(ch, x0, ascent);
        }
      }

      const data = octx.getImageData(0, 0, off.width, off.height).data;
      const w = off.width;
      const h = off.height;

      // Estimate filled area (CSS px²) to pick a grid step yielding ~effCount.
      let filled = 0;
      for (let y = 0; y < h; y += 2) {
        for (let x = 0; x < w; x += 2) {
          if (data[(y * w + x) * 4 + 3] > 128) filled++;
        }
      }
      const filledCssArea = (filled * 4) / (dpr * dpr);
      const step = Math.max(4, Math.sqrt(filledCssArea / Math.max(1, effCount)));
      const stepDev = Math.max(1, Math.round(step * dpr));

      // Center horizontally in the word box; vertically, align the glyph's
      // baseline to the text baseline (so the word sits inline with the rest of
      // the headline) rather than centering it in the taller line box. Nudge up
      // by half an arrow so the centre-anchored cursors' visible bottoms land on
      // the baseline instead of hanging below it.
      const baselineFromTop = (wordH - (fbAscent + fbDescent)) / 2 + fbAscent;
      const nudgeY = arrowS * ARROW_UNIT_HEIGHT * 0.5;
      const originX = pad + (wordW - gw) / 2;
      const originY = pad + baselineFromTop - ascent - nudgeY;
      const points: Point[] = [];
      for (let y = 0; y < h; y += stepDev) {
        for (let x = 0; x < w; x += stepDev) {
          if (data[(y * w + x) * 4 + 3] > 128) {
            points.push({ x: originX + x / dpr, y: originY + y / dpr });
          }
        }
      }
      return points;
    };

    // Greedy nearest-available: each cursor grabs its closest free target, so
    // the fly-in reads as convergence to the nearest letterform.
    const assignTargets = () => {
      const used = new Array<boolean>(targets.length).fill(false);
      for (const c of cursors) {
        let best = -1;
        let bestD = Infinity;
        for (let t = 0; t < targets.length; t++) {
          if (used[t]) continue;
          const dx = targets[t].x - c.x;
          const dy = targets[t].y - c.y;
          const d = dx * dx + dy * dy;
          if (d < bestD) {
            bestD = d;
            best = t;
          }
        }
        if (best >= 0) {
          used[best] = true;
          c.tx = targets[best].x;
          c.ty = targets[best].y;
          c.active = true;
        } else {
          c.active = false; // more cursors than targets: hide the extras
        }
      }
    };

    const build = () => {
      const fontPx = parseFloat(getComputedStyle(wordEl).fontSize) || 64;
      // The host text carries the same tracking (set declaratively as `em` in
      // the JSX) so its reserved layout box matches the spaced cursor word.
      const wr = wordEl.getBoundingClientRect();
      const wordW = wr.width;
      const wordH = wr.height;
      if (wordW === 0 || wordH === 0) return;

      cssW = wordW + pad * 2;
      cssH = wordH + pad * 2;
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      inMinX = Math.max(6, pad - HALO);
      inMaxX = Math.min(cssW - 6, pad + wordW + HALO);
      inMinY = Math.max(6, pad - HALO);
      inMaxY = Math.min(cssH - 6, pad + wordH + HALO);

      arrowS = clamp(fontPx * 0.12, 10, 16) / ARROW_UNIT_HEIGHT;
      const effCount = clamp(Math.round(count * (fontPx / 96)), 40, count);

      targets = sampleTargets(wordW, wordH, effCount);
      if (targets.length === 0) return;
      const poolSize = Math.min(count, targets.length);

      while (cursors.length < poolSize) cursors.push(spawn());
      if (cursors.length > poolSize) cursors.length = poolSize;

      // On resize after assembly, keep the word formed by re-handing targets.
      if (phase !== "roam") assignTargets();
    };

    const stepAndDraw = () => {
      const now = performance.now();

      if (phase === "roam" && now >= assembleStart + assembleDelayMs) {
        assignTargets();
        phase = "assemble";
      }

      ctx.clearRect(0, 0, cssW, cssH);
      ctx.fillStyle = fill;
      ctx.strokeStyle = BORDER_COLOR;
      ctx.lineJoin = "round";

      const assembling = phase === "assemble";
      let sumDist = 0;
      let counted = 0;

      for (const c of cursors) {
        if (!c.active) continue;
        let ax = 0;
        let ay = 0;

        if (phase === "roam") {
          c.homeAngle += rand(-0.15, 0.15);
          ax += Math.cos(c.homeAngle) * WANDER_ACCEL;
          ay += Math.sin(c.homeAngle) * WANDER_ACCEL;
        } else {
          const k = phase === "formed" ? SPRING_FORMED : SPRING_ASSEMBLE;
          const bob =
            phase === "formed"
              ? Math.sin(now * BOB_SPEED + c.bobPhase) * BOB_AMP
              : 0;
          ax += (c.tx - c.x) * k;
          ay += (c.ty + bob - c.y) * k;

          if (pointer.active) {
            const dx = c.x - pointer.x;
            const dy = c.y - pointer.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < REPEL_RADIUS * REPEL_RADIUS) {
              const d = Math.max(Math.sqrt(d2), 0.001);
              const f = (1 - d / REPEL_RADIUS) ** 2 * REPEL_FORCE;
              ax += (dx / d) * f;
              ay += (dy / d) * f;
            }
          }
        }

        // Soft containment so the crowd stays in the word's vicinity.
        if (c.x < inMinX) ax += (inMinX - c.x) * CONTAIN_K;
        else if (c.x > inMaxX) ax += (inMaxX - c.x) * CONTAIN_K;
        if (c.y < inMinY) ay += (inMinY - c.y) * CONTAIN_K;
        else if (c.y > inMaxY) ay += (inMaxY - c.y) * CONTAIN_K;

        const damp = phase === "roam" ? DAMP_ROAM : DAMP_ACTIVE;
        c.vx = (c.vx + ax) * damp;
        c.vy = (c.vy + ay) * damp;

        if (phase === "roam") {
          const sp = Math.hypot(c.vx, c.vy);
          if (sp > ROAM_MAX_SPEED) {
            c.vx = (c.vx / sp) * ROAM_MAX_SPEED;
            c.vy = (c.vy / sp) * ROAM_MAX_SPEED;
          }
        }

        c.x += c.vx;
        c.y += c.vy;

        // Hard walls (safety against clipping at canvas edges).
        if (c.x < 4) {
          c.x = 4;
          c.vx = 0;
        } else if (c.x > cssW - 4) {
          c.x = cssW - 4;
          c.vx = 0;
        }
        if (c.y < 4) {
          c.y = 4;
          c.vy = 0;
        } else if (c.y > cssH - 4) {
          c.y = cssH - 4;
          c.vy = 0;
        }

        if (assembling) {
          sumDist += Math.hypot(c.tx - c.x, c.ty - c.y);
          counted++;
        }

        // Draw the arrow with its tip at (c.x, c.y), rotated/scaled about the tip.
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.scale(arrowS, arrowS);
        ctx.translate(-ARROW_ANCHOR_X, -ARROW_ANCHOR_Y);
        ctx.globalAlpha = c.opacity;
        ctx.fill(arrow);
        ctx.lineWidth = BORDER_WIDTH;
        ctx.stroke(arrow);
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      if (
        assembling &&
        counted > 0 &&
        (sumDist / counted < 1.5 ||
          now >= assembleStart + assembleDelayMs + ASSEMBLE_FALLBACK_MS)
      ) {
        phase = "formed";
      }
    };

    const loop = () => {
      raf = 0;
      if (cancelled || !ready || !visible) return;
      stepAndDraw();
      raf = requestAnimationFrame(loop);
    };

    const kick = () => {
      if (raf || cancelled || !ready || !visible) return;
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    // Pointer drives the repulsion field; mapped through the canvas's own rect.
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible) kick();
      },
      { threshold: 0 }
    );
    io.observe(host);

    const ro = new ResizeObserver(() => {
      window.clearTimeout(buildTimer);
      buildTimer = window.setTimeout(() => {
        if (cancelled || !ready) return;
        build();
        kick();
      }, 100);
    });
    ro.observe(host);

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave, { passive: true });
    host.addEventListener("pointercancel", onLeave, { passive: true });

    // Wait for the display font before sampling, or glyph metrics are wrong.
    const start = async () => {
      try {
        await document.fonts.ready;
      } catch {
        /* document.fonts unsupported — proceed with whatever is loaded */
      }
      if (cancelled) return;
      build();
      if (cancelled) return;
      assembleStart = performance.now();
      ready = true;
      kick();
    };
    void start();

    return () => {
      cancelled = true;
      stop();
      io.disconnect();
      ro.disconnect();
      window.clearTimeout(buildTimer);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointercancel", onLeave);
    };
  }, [isStatic, word, count, assembleDelayMs, pad, cursorColor]);

  return (
    <span
      ref={hostRef}
      className={`relative inline-block align-baseline ${className}`}
    >
      {/* Real text: kept in the layout + accessibility tree. Transparent while
          the canvas paints the cursors; visible (inherited color) when the swarm
          is skipped (reduced motion / mobile) so the headline is always readable. */}
      <span
        ref={wordRef}
        style={{
          color: isStatic ? "inherit" : "transparent",
          // Extra tracking only matters for the swarm (to separate overlapping
          // cursors); static text reads fine at the inherited tracking.
          letterSpacing: isStatic ? undefined : `${LETTER_SPACING_RATIO}em`,
        }}
      >
        {word}
      </span>
      {!isStatic && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ left: -pad, top: -pad }}
        />
      )}
    </span>
  );
}
