/*
  cursorWordEngine — a self-contained, framework-agnostic engine that spells a
  word out of a swarm of "customer" mouse-cursor (arrow pointer) glyphs on a
  canvas. Zero dependencies: no React, no Tailwind, no app imports. Drop this
  file into any site.

  Behaviour: the cursors roam like a crowd, then (after `assembleDelayMs`) fly in
  and assemble into the word; hovering the formed word makes the cursors flee a
  repulsion field that follows the pointer, then drift back and re-spell it.

  The assembled word is built with stroke-locked density (every stem is a fixed
  number of cursors thick at ANY font size, so strokes stay solid and never go
  sparse on large screens), tight tracking, a quincunx (hex-packed) interior on a
  single baseline lattice, and an even-spaced silhouette outline — so it reads as
  one crisp word while still being visibly made of individual arrows.

  --- USAGE -----------------------------------------------------------------
  You provide three elements (the React wrapper in ./CursorWord.tsx wires them up
  for you; a vanilla site can create them by hand):

    canvas  — any <canvas> element; the engine itself sets it to a fixed,
              full-viewport, pointer-events:none overlay (you only control z-index)
    host    — the inline element occupying the word's slot in your layout; its box
              is tracked each frame so the formed word follows the text on scroll/resize
    wordEl  — the element whose computed font + text content is sampled (usually a
              transparent copy of the word sitting inside `host`)

    import { createCursorWord, CURSOR_WORD_LETTER_SPACING_EM } from "./cursorWordEngine";

    const handle = createCursorWord({ canvas, host, wordEl, word: "Store", color: "#a855f7" });
    // ...later
    handle.destroy();

  The only hard requirement is that a font is loaded on `wordEl`; the swarm adopts
  whatever font the host page uses. `geometricGlyphs` swaps in cleaner geometric
  forms for "t"/"e" (tuned for heavy display faces) and can be turned off for
  other fonts.
  ---------------------------------------------------------------------------
*/

// Figma-style arrow pointer. The tip sits near the top-left; the bbox spans
// roughly x4..16.7, y2.2..21.
const ARROW_PATH =
  "M4 2.2 L4 18.8 L8.3 14.6 L11.1 21 L13.8 19.8 L11 13.5 L16.7 13.2 Z";
// Anchor placed on each target: the arrow's visual centre, so the formed word
// sits tight on the baseline and the bodies don't smear down-right.
const ARROW_ANCHOR_X = 10.35; // (4 + 16.7) / 2
const ARROW_ANCHOR_Y = 11.6; // (2.2 + 21) / 2
const ARROW_UNIT_HEIGHT = 18.8; // path height (21 - 2.2), used to scale to px

/** Default tracking (fraction of font size). Exported so the host markup can set
 *  the same letter-spacing on the real text, keeping it aligned with the swarm. */
export const CURSOR_WORD_LETTER_SPACING_EM = 0.02;

// The sampling grid is locked to the font's STROKE thickness (not a cursor
// budget): every stem ends up STROKES_ACROSS cursors thick at ANY font size, so
// strokes stay solid and the word never goes sparse on big screens.
const STROKE_RATIO = 0.155; // stem width as a fraction of font size (heavy display face)
const STROKES_ACROSS = 3.0; // target cursors across a stem
// Extra upward shift of the formed word (fraction of font size) so its baseline
// sits level with the surrounding headline text rather than hanging low.
const BASELINE_RAISE = 0.14;
// Cursor drawn size as a multiple of the grid cell. >1 so neighbours overlap
// into a continuous stroke, but kept modest so individual arrows stay legible
// AND so cursors on a counter's inner edge don't protrude in and fill small
// holes (the 'e' eye, 'o' counter).
const CURSOR_OVERLAP = 1.1;

// Physics tunables (frame-based easing).
const SPRING_FORMED = 0.055; // hold the word / icon — firm enough to stay crisp
const DAMP_ACTIVE = 0.8;
const EDGE_MARGIN = 24; // keep wander spots this far inside the viewport
const CONTAIN_K = 0.01; // soft pushback toward the viewport
const REPEL_RADIUS = 90;
const REPEL_FORCE = 2.2;
const BOB_AMP = 0.5; // idle vertical bob while holding the word
const BOB_SPEED = 0.0016;

// The loop: the page loads with the cursors already spelling the word (no
// scattered intro). The word holds, morphs into the storefront icon, holds on
// the icon, morphs back to the word — and repeats forever.
const WORD_HOLD_MS = 3200; // how long the word holds each loop (wanderers play here)
// Each morph glides over a fixed DURATION (not a fixed speed), so it reads the
// same regardless of word size — and mobile is deliberately slower (the smaller
// mobile word would otherwise complete its glide much faster than desktop).
const MORPH_DUR_DESKTOP = 1500;
const MORPH_DUR_MOBILE = 2600;
const ICON_HOLD_MS = 1100; // how long it holds on the fully-formed icon
const FRAME_MS = 1000 / 60; // nominal frame time, for the arrive-in-time morph

// A wandering cursor "clicks" when it reaches its open-space spot — a quick
// press pulse + ripple ring.
const CLICK_DURATION = 340; // ms per click pulse

// Once the word is formed, a few of its OWN cursors take turns leaving: a cursor
// travels out to an open-space spot, clicks a time or two, then returns to its
// exact place in the word — and a different cursor from a different part of the
// word heads out to replace it. The travel mimics a human hand: a curved path
// with an ease-in/ease-out (minimum-jerk) speed profile, a little tremor, and a
// short hesitation before each click — never a robotic straight-line glide.
const WANDER_MAX = 3; // max cursors away from the word at any moment
const WANDER_CLICKS_MIN = 1; // clicks performed out in the open before returning
const WANDER_CLICKS_MAX = 2;
const WANDER_SPAWN_RATE = 0.9; // new wanderers dispatched per second (when under the cap)
const WANDER_DUR_BASE = 380; // travel time floor (ms) for a very short hop
const WANDER_DUR_PER_PX = 1.7; // extra travel time per px of distance (Fitts-like)
const WANDER_DUR_MIN = 520; // clamp on travel time
const WANDER_DUR_MAX = 2600;
const WANDER_CURVE_MIN = 0.06; // path bow as a fraction of travel distance (perpendicular)
const WANDER_CURVE_MAX = 0.2;
const WANDER_TREMOR = 0.7; // px of subtle hand-tremor wobble while moving
const WANDER_HESITATE_MIN = 90; // ms pause after arriving before the first click
const WANDER_HESITATE_MAX = 340;
const WANDER_SETTLE_MS = 160; // ms pause after the last click before heading home

// Flourish icon: the whole word morphs into a storefront, so every cursor gets
// an icon target. Sized to the word's glyph height; it sits centred where the
// word is so the morph happens in place.
const ICON_SCALE = 1.18; // icon height as a multiple of the word's glyph height
const ICON_NUDGE_X = 0.06; // desktop: shift the icon left by this fraction of the word width
const ICON_NUDGE_Y_DESKTOP = 0.06; // desktop: shift down slightly (fraction of glyph height)
const ICON_NUDGE_Y_MOBILE = 0.2; // mobile: shift down more so it sits lower under the headline

// Faint white outline on every cursor; width is in arrow-unit space so it scales.
const BORDER_COLOR = "rgba(255, 255, 255, 0.45)";
const BORDER_WIDTH = 1.0;

// Adaptive detail tiers. The renderer scales cursor density to the device: a
// capable desktop packs a finer, denser swarm; a phone / low-core / low-memory
// device uses a coarser swarm and skips the per-cursor outline, to stay smooth.
// `step` (grid pitch) is multiplied by `detail` — smaller = finer = more cursors;
// `cap` is the hard ceiling on the pool for that tier.
const TIER_HIGH = { detail: 0.82, cap: 1500, border: true };
const TIER_MEDIUM = { detail: 1.0, cap: 1000, border: true };
const TIER_LOW = { detail: 1.34, cap: 460, border: false };

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

// Deterministic 0..1 from an integer so a given glyph target always gets the
// same cursor look on every reload.
function hash01(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// Minimum-jerk-style easing (smootherstep): zero velocity at both ends, peak
// speed in the middle — the bell-shaped profile a human hand follows when
// reaching for a point. Used for the wandering cursors' travel.
function easeMinJerk(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// Geometric cross for "t" (straight stem + crossbar) instead of the font's
// curved-foot glyph. x0 is the glyph pen start; baselineY the baseline; ascent
// the word's cap-ish ascent; sized from fontPx.
function drawCrossT(
  ctx: CanvasRenderingContext2D,
  x0: number,
  baselineY: number,
  ascent: number,
  fontPx: number
): void {
  const stem = Math.max(2, fontPx * 0.15);
  const cx = x0 + fontPx * 0.2;
  const top = baselineY - ascent * 0.95;
  ctx.fillRect(cx - stem / 2, top, stem, baselineY - top); // vertical stem
  const half = fontPx * 0.185;
  const crossY = baselineY - ascent * 0.64;
  ctx.fillRect(cx - half, crossY, half * 2, stem); // crossbar
}

// Resolve a CSS custom property (e.g. var(--color-acid)) to its value; plain
// colors pass straight through. Guarded so it is safe outside a browser.
function resolveColor(input: string): string {
  if (input.startsWith("var(") && typeof getComputedStyle === "function") {
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
  tx: number; // assigned glyph target (word-local)
  ty: number;
  active: boolean;
  opacity: number;
  rot: number;
  bobPhase: number;
  clickStart: number; // performance.now() of an active click pulse, or -1
  // Temporary wanderer state for a WORD cursor taking a turn out in the open.
  // wstate: 0 = home (in the word), 1 = travelling out, 2 = at the spot
  // (hesitate + click), 3 = returning to its word spot. clicksLeft = clicks left
  // before heading back. The travel is a human-like parametric move: ws* = start
  // point, wg* = goal (viewport px), wmStart/wmDur = timing, wcurve = arc bow,
  // wnext = the timestamp the next sub-action (click / depart) is due.
  wstate: 0 | 1 | 2 | 3;
  clicksLeft: number;
  wsx: number;
  wsy: number;
  wgx: number;
  wgy: number;
  wmStart: number;
  wmDur: number;
  wcurve: number;
  wnext: number;
  // This cursor's spot in the storefront icon (word-local), used during the
  // word→icon→word flourish. Every cursor gets one.
  itx: number;
  ity: number;
}

interface Point {
  x: number;
  y: number;
}

// The loop: formed (hold the word, wanderers play) → toIcon (morph to the
// storefront) → iconHold → toWord (morph back) → formed → … forever. The page
// starts already in "formed" with the cursors snapped onto the word.
type Phase = "formed" | "toIcon" | "iconHold" | "toWord";

export interface CursorWordConfig {
  /** Fixed, full-viewport, pointer-events:none overlay the swarm paints on. */
  canvas: HTMLCanvasElement;
  /** Inline element occupying the word's slot; tracked each frame so the formed
   *  word follows the text through scroll/resize. */
  host: HTMLElement;
  /** Element whose computed font + text is sampled (usually a transparent copy
   *  of the word inside `host`). */
  wordEl: HTMLElement;
  /** The word to spell. */
  word: string;
  /** Cursor fill: a hex/rgb, or a `var(--x)` resolved against :root. Default '#a855f7'. */
  color?: string;
  /** Optional hard ceiling on the cursor pool. By default the engine picks a
   *  device-appropriate cap (more on capable desktops, fewer on phones). */
  maxCursors?: number;
  /** How long the word holds before each icon morph, ms. Default WORD_HOLD_MS. */
  assembleDelayMs?: number;
  /** Tracking as a fraction of font size. Default CURSOR_WORD_LETTER_SPACING_EM. */
  letterSpacingEm?: number;
  /** Swap "t" for a clean geometric cross instead of the font's curved-foot
   *  glyph (tuned for heavy display faces). All other letters use the real font
   *  glyph. Default true. */
  geometricGlyphs?: boolean;
}

export interface CursorWordHandle {
  destroy(): void;
}

/**
 * Start the cursor-swarm effect on the supplied elements. Returns a handle whose
 * `destroy()` tears down every listener, observer and animation frame.
 */
export function createCursorWord(config: CursorWordConfig): CursorWordHandle {
  const {
    canvas,
    host,
    wordEl,
    word,
    color = "#a855f7",
    maxCursors,
    assembleDelayMs = WORD_HOLD_MS,
    letterSpacingEm = CURSOR_WORD_LETTER_SPACING_EM,
    geometricGlyphs = true,
  } = config;

  const ctx = canvas.getContext("2d");
  if (!ctx) return { destroy() {} };

  let cancelled = false;
  const fill = resolveColor(color);
  const arrow = new Path2D(ARROW_PATH);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // The swarm is painted as a fixed, full-viewport overlay. Set the critical
  // positioning here so the engine is self-sufficient on any site — a vanilla
  // consumer only has to hand us a <canvas> element; the host can still control
  // stacking via its own z-index.
  canvas.style.position = "fixed";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.style.pointerEvents = "none";

  let cssW = 0;
  let cssH = 0;
  const cursors: Cursor[] = [];
  let targets: Point[] = [];
  let iconTargets: Point[] = []; // storefront-icon points (word-local) for the loop
  let phase: Phase = "formed"; // start already spelling the word — no scattered intro
  let arrowS = 0.8; // scale applied to the unit arrow path
  let activeWanderers = 0; // word cursors currently away from the word (wstate > 0)
  let phaseStart = 0; // performance.now() the current morph/hold began (loop timing)
  let formedAt = 0; // performance.now() the word last finished forming
  let snapped = false; // have the cursors been placed straight onto the word yet
  let detail = 1; // grid-density multiplier for the active device tier (set in build)
  let drawBorder = true; // per-cursor white outline (off on the low tier)
  let iconNudgeX = ICON_NUDGE_X; // left shift of the icon; zeroed on mobile (centred)
  let iconNudgeY = ICON_NUDGE_Y_DESKTOP; // downward shift of the icon (bigger on mobile)
  let morphDurMs = MORPH_DUR_DESKTOP; // morph glide duration (longer on mobile)
  let ready = false;
  let visible = true;
  let raf = 0;
  let buildTimer = 0;

  // Roam/containment region = the whole viewport (minus a margin); the canvas is
  // a fixed full-viewport overlay so the crowd scatters everywhere.
  let inMinX = 0;
  let inMaxX = 0;
  let inMinY = 0;
  let inMaxY = 0;
  // Word box top-left in viewport coords, refreshed each frame so the formed word
  // tracks the host element through scroll/resize. Targets are stored local to
  // the word box and offset by this.
  let wordOriginX = 0;
  let wordOriginY = 0;
  let wordBoxW = 0; // host box size (CSS px), refreshed each frame
  let wordBoxH = 0;
  // Word-local visual centre and glyph height of the formed word (CSS px), set
  // while sampling. The pre-assembly icon is sized + centred to these so it sits
  // inline with the headline text and morphs into the word without shifting.
  let wordCenterY = 0;
  let wordGlyphH = 0;
  // Previous frame's word origin. Once the cursors stop roaming we carry them by
  // this frame's origin delta so the word is rigidly locked to the host element
  // (same scroll speed) instead of the spring lagging behind. NaN = not sampled.
  let prevOriginX = NaN;
  let prevOriginY = NaN;

  const pointer = { x: -9999, y: -9999, active: false };

  const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

  // Set up a human-like move for a wanderer from its current spot to (gx, gy):
  // a distance-scaled duration (Fitts-like) and a gently bowed path, so no two
  // trips look the same and none is a dead-straight line. startAt lets the move
  // begin in the future (a pause before it sets off).
  const startMove = (c: Cursor, gx: number, gy: number, startAt: number) => {
    c.wsx = c.x;
    c.wsy = c.y;
    c.wgx = gx;
    c.wgy = gy;
    const dist = Math.hypot(gx - c.x, gy - c.y);
    c.wmStart = startAt;
    c.wmDur = clamp(
      (WANDER_DUR_BASE + dist * WANDER_DUR_PER_PX) * rand(0.85, 1.25),
      WANDER_DUR_MIN,
      WANDER_DUR_MAX
    );
    c.wcurve =
      (Math.random() < 0.5 ? -1 : 1) * dist * rand(WANDER_CURVE_MIN, WANDER_CURVE_MAX);
  };

  const spawn = (): Cursor => ({
    x: rand(inMinX, inMaxX),
    y: rand(inMinY, inMaxY),
    vx: rand(-1, 1),
    vy: rand(-1, 1),
    tx: 0,
    ty: 0,
    active: true,
    opacity: 0.6 + Math.random() * 0.4,
    rot: rand(-0.08, 0.08),
    bobPhase: Math.random() * Math.PI * 2,
    clickStart: -1,
    wstate: 0,
    clicksLeft: 0,
    wsx: 0,
    wsy: 0,
    wgx: 0,
    wgy: 0,
    wmStart: 0,
    wmDur: 0,
    wcurve: 0,
    wnext: 0,
    itx: 0,
    ity: 0,
  });

  // Render the word to an offscreen canvas at the live computed font, then
  // convert its filled pixels into cursor target points. Two-pass placement:
  // (1) an EDGE pass drops evenly-spaced points along the glyph silhouette so
  // curves read as crisp continuous outlines; (2) a quincunx (hex-packed)
  // INTERIOR fill, phased to a single baseline lattice so every letter shares one
  // vertical rhythm. Density is locked to the stroke width, so strokes are a
  // consistent ~3 cursors thick at any size and the total count follows the glyph
  // area (capped only by `perfCap`).
  const sampleTargets = (
    wordW: number,
    wordH: number,
    perfCap: number
  ): Point[] => {
    const cs = getComputedStyle(wordEl);
    const off = document.createElement("canvas");
    const octx = off.getContext("2d") as
      | (CanvasRenderingContext2D & { letterSpacing?: string })
      | null;
    if (!octx) return [];

    const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const fontPx = parseFloat(cs.fontSize) || 64;
    const letterSpacingPx = Math.max(fontPx * letterSpacingEm, 1.5);
    const applyFont = () => {
      octx.font = font;
      if ("letterSpacing" in octx) octx.letterSpacing = `${letterSpacingPx}px`;
      octx.textBaseline = "alphabetic";
      octx.textAlign = "left";
    };

    applyFont();
    const m = octx.measureText(word);
    const ascent = m.actualBoundingBoxAscent || fontPx * 0.8;
    const descent = m.actualBoundingBoxDescent || fontPx * 0.2;
    const fbAscent = m.fontBoundingBoxAscent || ascent;
    const fbDescent = m.fontBoundingBoxDescent || descent;
    const leftBearing = m.actualBoundingBoxLeft || 0;
    const right = m.actualBoundingBoxRight || m.width;
    const gw = Math.max(1, Math.ceil(leftBearing + right));
    const gh = Math.max(1, Math.ceil(ascent + descent));

    off.width = Math.ceil(gw * dpr);
    off.height = Math.ceil(gh * dpr);
    // Resizing the canvas resets its context state, so re-apply everything.
    octx.setTransform(dpr, 0, 0, dpr, 0, 0);
    applyFont();
    octx.fillStyle = "#fff";
    // Render glyph-by-glyph (positions from cumulative substring widths so
    // kerning/letter-spacing match a normal render) so optional geometric "t"/"e"
    // can be swapped in for legibility.
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      const x0 = leftBearing + octx.measureText(word.slice(0, i)).width;
      if (geometricGlyphs && (ch === "t" || ch === "T")) {
        drawCrossT(octx, x0, ascent, ascent, fontPx);
      } else {
        octx.fillText(ch, x0, ascent);
      }
    }

    const w = off.width;
    const h = off.height;
    const data = octx.getImageData(0, 0, w, h).data;

    // The ruler is the stroke width, not a cursor budget. The device tier's
    // `detail` multiplier scales the pitch: <1 packs a finer, denser swarm on
    // capable machines; >1 a coarser, cheaper one on slow devices.
    const stroke = STROKE_RATIO * fontPx;
    const step = clamp(stroke / STROKES_ACROSS, 3.2, 7) * detail; // CSS px grid pitch
    const colDev = Math.max(1, Math.round(step * dpr)); // column pitch (device px)
    const rowDev = Math.max(1, Math.round(step * 0.866 * dpr)); // quincunx rows (√3/2)
    // Outline pitch: noticeably tighter than the interior so curved silhouettes
    // (the inner arches of 'o'/'e', which fall between interior lattice rows) get
    // a continuous run of cursors instead of a sparse, gappy line.
    const edgeDev = Math.max(1, Math.round(step * 0.52 * dpr));

    // Glyph mask (1 = ink). Mutable so we can open up enclosed counters below.
    const mask = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) mask[i] = data[i * 4 + 3] > 128 ? 1 : 0;

    // Cursors drawn on a counter's inner edge protrude inward and fill small
    // holes (the 'e' eye, 'o' bowl), so the real font glyph alone reads as a
    // blob. To KEEP the true font shape yet leave the holes open: flood-fill the
    // exterior from the border, treat any empty pixel it can't reach as an
    // ENCLOSED counter, and erode the glyph back from those counters. Open
    // counters (e.g. the 'e' aperture, reachable from outside) are untouched, and
    // outer edges/thin stems are never thinned.
    {
      const exterior = new Uint8Array(w * h);
      const stack = new Int32Array(w * h);
      let sp = 0;
      const seed = (x: number, y: number) => {
        if (x < 0 || y < 0 || x >= w || y >= h) return;
        const i = y * w + x;
        if (!mask[i] && !exterior[i]) {
          exterior[i] = 1;
          stack[sp++] = i;
        }
      };
      for (let x = 0; x < w; x++) {
        seed(x, 0);
        seed(x, h - 1);
      }
      for (let y = 0; y < h; y++) {
        seed(0, y);
        seed(w - 1, y);
      }
      while (sp > 0) {
        const i = stack[--sp];
        const x = i % w;
        const y = (i / w) | 0;
        seed(x - 1, y);
        seed(x + 1, y);
        seed(x, y - 1);
        seed(x, y + 1);
      }

      // Erode ink inward from each enclosed counter — but ADAPTIVELY by counter
      // size. A cursor's inward protrusion is a fixed amount, so a SMALL counter
      // (the 'e' eye) needs a deep erosion (~1.7 cells) to leave a hole that
      // still reads, whereas a LARGE counter (the 'o' bowl) only needs a shallow
      // one (~0.7 cells). Eroding the big bowl as hard as the tiny eye is exactly
      // what was thinning the bowl's top/bottom arches and dropping cursors from
      // their inner edge, so scale the depth to each counter's radius.
      // Pass 1: label every enclosed-counter component on the UNTOUCHED mask and
      // record its erosion depth. (Eroding inside this scan would let a freshly
      // emptied pixel be rescanned as a brand-new "counter" and cascade until the
      // whole letter is eaten — which is why only 'o'/'e' would vanish.)
      const label = new Uint8Array(w * h); // 1 = already part of a counter component
      const counters: Array<{ pixels: number[]; depth: number }> = [];
      for (let s = 0; s < w * h; s++) {
        if (mask[s] || exterior[s] || label[s]) continue;
        const comp: number[] = [];
        sp = 0;
        stack[sp++] = s;
        label[s] = 1;
        while (sp > 0) {
          const i = stack[--sp];
          comp.push(i);
          const x = i % w;
          const y = (i / w) | 0;
          const nbr = [
            x > 0 ? i - 1 : -1,
            x < w - 1 ? i + 1 : -1,
            y > 0 ? i - w : -1,
            y < h - 1 ? i + w : -1,
          ];
          for (const j of nbr) {
            if (j >= 0 && !mask[j] && !exterior[j] && !label[j]) {
              label[j] = 1;
              stack[sp++] = j;
            }
          }
        }
        // Classify by PHYSICAL radius (CSS px relative to font size) so the
        // split is the same at every detail tier: the tiny 'e' eye needs a deeper
        // erosion to read open, while the larger 'o' bowl needs only a shallow one
        // (eroding it as deep as the eye over-thins its arches).
        const radiusCss = Math.sqrt(comp.length / Math.PI) / dpr;
        const depth = radiusCss < fontPx * 0.105 ? 0.85 : 0.55; // small eye vs large bowl
        counters.push({ pixels: comp, depth });
      }
      // Pass 2: erode ink inward from each counter by its depth. Alternate 4- and
      // 8-connected layers so the hole dilates as a near-circle (octagon) rather
      // than a 4-connected Manhattan diamond — a pure 4-connected dilation leaves
      // the 'e' eye pointed at the top instead of a clean round arch.
      for (const { pixels, depth } of counters) {
        const D = Math.max(1, Math.round(colDev * depth));
        let frontier = pixels;
        for (let d = 0; d < D && frontier.length; d++) {
          const next: number[] = [];
          const diag = (d & 1) === 1; // every other layer also takes the diagonals
          for (const i of frontier) {
            const x = i % w;
            const y = (i / w) | 0;
            if (x > 0 && mask[i - 1]) { mask[i - 1] = 0; next.push(i - 1); }
            if (x < w - 1 && mask[i + 1]) { mask[i + 1] = 0; next.push(i + 1); }
            if (y > 0 && mask[i - w]) { mask[i - w] = 0; next.push(i - w); }
            if (y < h - 1 && mask[i + w]) { mask[i + w] = 0; next.push(i + w); }
            if (diag) {
              if (x > 0 && y > 0 && mask[i - w - 1]) { mask[i - w - 1] = 0; next.push(i - w - 1); }
              if (x < w - 1 && y > 0 && mask[i - w + 1]) { mask[i - w + 1] = 0; next.push(i - w + 1); }
              if (x > 0 && y < h - 1 && mask[i + w - 1]) { mask[i + w - 1] = 0; next.push(i + w - 1); }
              if (x < w - 1 && y < h - 1 && mask[i + w + 1]) { mask[i + w + 1] = 0; next.push(i + w + 1); }
            }
          }
          frontier = next;
        }
      }
    }

    const inside = (x: number, y: number): boolean =>
      x >= 0 && y >= 0 && x < w && y < h && mask[y * w + x] === 1;

    // Cursor size: a touch larger than the cell so strokes read as continuous
    // while individual arrows stay distinguishable (not a fuzzy blob).
    arrowS = clamp(step * CURSOR_OVERLAP, 6, 11) / ARROW_UNIT_HEIGHT;

    // Word-box placement (CSS px), baseline-aligned to the host text. Nudge up
    // half an arrow so the centre-anchored cursors' mass sits on the baseline.
    const baselineFromTop = (wordH - (fbAscent + fbDescent)) / 2 + fbAscent;
    const nudgeY = arrowS * ARROW_UNIT_HEIGHT * 0.5;
    const originX = (wordW - gw) / 2;
    const originY = baselineFromTop - ascent - nudgeY - fontPx * BASELINE_RAISE;
    // Tight glyph bbox (top..bottom of the inked word) in CSS px — the icon is
    // sized + vertically centred to this so it sits inline with the headline.
    wordGlyphH = ascent + descent;
    wordCenterY = originY + wordGlyphH / 2;
    const toCss = (px: number, py: number): Point => ({
      x: originX + px / dpr,
      y: originY + py / dpr,
    });

    // Spatial hash of accepted edge points (device px) for O(1) min-spacing
    // checks — used both to space the outline and to keep interior points off it.
    const ecols = Math.ceil(w / edgeDev) + 2;
    const ehash = new Map<number, Array<{ x: number; y: number }>>();
    const ekey = (gx: number, gy: number) => gy * ecols + gx;
    const farFromEdge = (x: number, y: number, minD: number): boolean => {
      const gx = Math.floor(x / edgeDev);
      const gy = Math.floor(y / edgeDev);
      const md2 = minD * minD;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const cgx = gx + dx;
          const cgy = gy + dy;
          // Guard the row bounds so a left-edge query (cgx = -1) can't alias
          // onto the previous row's right-edge bucket (key = cgy*ecols - 1).
          if (cgx < 0 || cgx >= ecols || cgy < 0) continue;
          const arr = ehash.get(ekey(cgx, cgy));
          if (!arr) continue;
          for (const p of arr) {
            const ddx = p.x - x;
            const ddy = p.y - y;
            if (ddx * ddx + ddy * ddy < md2) return false;
          }
        }
      }
      return true;
    };

    // (1) EDGE pass: greedy even-spaced points along the glyph boundary. A
    // boundary pixel is inside with at least one 4-neighbour outside. Scan order
    // gives reasonably uniform spacing without ordered contour tracing.
    const edgePts: Point[] = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!inside(x, y)) continue;
        if (
          inside(x - 1, y) &&
          inside(x + 1, y) &&
          inside(x, y - 1) &&
          inside(x, y + 1)
        )
          continue; // interior pixel, not a silhouette edge
        if (!farFromEdge(x, y, edgeDev)) continue;
        const gx = Math.floor(x / edgeDev);
        const gy = Math.floor(y / edgeDev);
        const k = ekey(gx, gy);
        let arr = ehash.get(k);
        if (!arr) {
          arr = [];
          ehash.set(k, arr);
        }
        arr.push({ x, y });
        edgePts.push(toCss(x, y));
      }
    }

    // (2) INTERIOR pass: quincunx lattice, phased so a row passes exactly through
    // the baseline — this puts every letter's rows on the same horizontal lines
    // (even vertical rhythm). Skip nodes the outline already owns.
    const baselineDev = Math.round(ascent * dpr);
    const startY = ((baselineDev % rowDev) + rowDev) % rowDev;
    const dedupeD = step * 0.5 * dpr;
    const interiorPts: Point[] = [];
    let row = 0;
    for (let y = startY; y < h; y += rowDev, row++) {
      const xOff = row & 1 ? colDev >> 1 : 0;
      for (let x = xOff; x < w; x += colDev) {
        if (!inside(x, y)) continue;
        if (!farFromEdge(x, y, dedupeD)) continue;
        interiorPts.push(toCss(x, y));
      }
    }

    // Even-stride downsample — deterministic, so the layout never reshuffles on
    // reload/resize.
    const downsample = (pts: Point[], keep: number): Point[] => {
      if (keep >= pts.length) return pts;
      const stride = pts.length / keep;
      const out: Point[] = [];
      for (let i = 0; i < keep; i++) out.push(pts[Math.floor(i * stride)]);
      return out;
    };
    // Count follows area; cap for perf. Cap the OUTLINE first (to ≤70% of the
    // budget) so a very long word can never starve the interior down to a
    // hairline, then fill the remaining budget with interior points.
    const edges = downsample(edgePts, Math.floor(perfCap * 0.7));
    const interior = downsample(interiorPts, Math.max(0, perfCap - edges.length));
    // Edge points first so the greedy fly-in locks the silhouette before the fill.
    return edges.concat(interior);
  };

  // Draw a literal STOREFRONT (scalloped awning + building + door + windows) to
  // an offscreen canvas and grid-sample its silhouette into ~targetCount points,
  // returned as word-local offsets centred on the word's slot (so the icon sits
  // where the word will appear). A bold, layered shape so it reads densely.
  const sampleIcon = (wordW: number, wordH: number, targetCount: number): Point[] => {
    if (targetCount < 1) return [];
    // Sized to the word's GLYPH height (not its tall line-box) so the icon reads
    // about as big as the headline text, and sits where the word is.
    const S = Math.max(40, (wordGlyphH || wordH) * ICON_SCALE);
    const IW = S * 1.2; // storefronts read wider than tall
    const IH = S * 1.0;
    const cw = Math.ceil(IW * 1.14);
    const ch = Math.ceil(IH * 1.16);
    const off = document.createElement("canvas");
    const octx = off.getContext("2d");
    if (!octx) return [];
    off.width = Math.ceil(cw * dpr);
    off.height = Math.ceil(ch * dpr);
    octx.setTransform(dpr, 0, 0, dpr, 0, 0);
    octx.fillStyle = "#fff";
    octx.strokeStyle = "#fff";
    octx.lineJoin = "round";
    octx.lineCap = "round";

    const cx = cw / 2;
    const topY = (ch - IH) / 2; // top of the storefront within the canvas
    const botY = topY + IH;

    // Awning band at the very top (overhangs the building).
    const awnTop = topY;
    const awnBot = topY + IH * 0.2;
    const awnTopHalf = IW * 0.46;
    const awnBotHalf = IW * 0.52;
    octx.beginPath();
    octx.moveTo(cx - awnTopHalf, awnTop);
    octx.lineTo(cx + awnTopHalf, awnTop);
    octx.lineTo(cx + awnBotHalf, awnBot);
    octx.lineTo(cx - awnBotHalf, awnBot);
    octx.closePath();
    octx.fill();
    // Scalloped valance hanging off the awning's bottom edge (the shop frill).
    const nSc = 8;
    const sr = (awnBotHalf * 2) / (nSc * 2);
    for (let i = 0; i < nSc; i++) {
      const scx = cx - awnBotHalf + sr * (2 * i + 1);
      octx.beginPath();
      octx.arc(scx, awnBot, sr, 0, Math.PI);
      octx.fill();
    }

    // Building below, with a gap under the scallops so the awning reads separately.
    const buildTop = awnBot + sr * 1.7;
    const buildHalf = IW * 0.42;
    octx.fillRect(cx - buildHalf, buildTop, buildHalf * 2, botY - buildTop);

    // Cut the openings (door + two windows) so it reads unmistakably as a shop.
    octx.save();
    octx.globalCompositeOperation = "destination-out";
    // Door: centred, rounded top, sitting on the ground line.
    const doorHalf = IW * 0.12;
    const doorTop = buildTop + (botY - buildTop) * 0.38;
    octx.beginPath();
    octx.moveTo(cx - doorHalf, botY);
    octx.lineTo(cx - doorHalf, doorTop + doorHalf);
    octx.arc(cx, doorTop + doorHalf, doorHalf, Math.PI, 0);
    octx.lineTo(cx + doorHalf, botY);
    octx.closePath();
    octx.fill();
    // Two windows flanking the door.
    const winW = IW * 0.16;
    const winH = (botY - buildTop) * 0.26;
    const winY = buildTop + (botY - buildTop) * 0.12;
    const winDX = IW * 0.27;
    octx.fillRect(cx - winDX - winW / 2, winY, winW, winH);
    octx.fillRect(cx + winDX - winW / 2, winY, winW, winH);
    octx.restore();

    const w = off.width;
    const h = off.height;
    const data = octx.getImageData(0, 0, w, h).data;
    let filled = 0;
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        if (data[(y * w + x) * 4 + 3] > 128) filled++;
      }
    }
    const filledCssArea = (filled * 4) / (dpr * dpr);
    const stepCss = Math.max(3, Math.sqrt(filledCssArea / Math.max(1, targetCount)));
    const sd = Math.max(1, Math.round(stepCss * dpr));
    // Sit on the word's centre (vertically the formed word's visual centre),
    // nudged a little LEFT so the storefront reads as centred on the word rather
    // than drifting toward its right end.
    const gh2 = wordGlyphH || wordH;
    const offX = wordW / 2 - cw / 2 - wordW * iconNudgeX;
    const offY = (wordCenterY || wordH / 2) - ch / 2 + gh2 * iconNudgeY;
    const pts: Point[] = [];
    for (let y = 0; y < h; y += sd) {
      for (let x = 0; x < w; x += sd) {
        if (data[(y * w + x) * 4 + 3] > 128) {
          pts.push({ x: offX + x / dpr, y: offY + y / dpr });
        }
      }
    }
    return pts;
  };

  // Hand every cursor a storefront-icon target for the flourish, greedy-nearest
  // from its current spot in the word so the morph reads as the word gathering
  // into the icon. If there are more cursors than icon points the leftovers
  // double up on their nearest point (denser, no holes).
  const assignIcon = () => {
    const n = iconTargets.length;
    if (n === 0) return;
    activeWanderers = 0; // any wanderers rejoin and morph into the icon
    const used = new Array<boolean>(n).fill(false);
    let usedCount = 0;
    for (const c of cursors) {
      if (!c.active) continue;
      c.wstate = 0;
      const cx = c.x - wordOriginX; // icon targets are word-local
      const cy = c.y - wordOriginY;
      const allowUsed = usedCount >= n; // once all points are taken, allow doubling
      let best = -1;
      let bestD = Infinity;
      for (let t = 0; t < n; t++) {
        if (!allowUsed && used[t]) continue;
        const dx = iconTargets[t].x - cx;
        const dy = iconTargets[t].y - cy;
        const d = dx * dx + dy * dy;
        if (d < bestD) {
          bestD = d;
          best = t;
        }
      }
      if (best >= 0) {
        if (!used[best]) {
          used[best] = true;
          usedCount++;
        }
        c.itx = iconTargets[best].x;
        c.ity = iconTargets[best].y;
      }
    }
  };

  // Greedy nearest-available: each cursor grabs its closest free target, so the
  // fly-in reads as convergence to the nearest letterform. Every cursor joins the
  // word; the "wanderers" are word cursors that take temporary turns out in the
  // open (see the wstate machine), so the word is never permanently short.
  const assignTargets = () => {
    const r = host.getBoundingClientRect();
    const ox = r.left;
    const oy = r.top;
    const nWord = targets.length;
    const used = new Array<boolean>(nWord).fill(false);
    activeWanderers = 0;
    for (let i = 0; i < cursors.length; i++) {
      const c = cursors[i];
      c.wstate = 0; // (re)assigning targets cancels any in-flight wander
      if (i >= nWord) {
        c.active = false;
        continue;
      }
      let best = -1;
      let bestD = Infinity;
      for (let t = 0; t < nWord; t++) {
        if (used[t]) continue;
        const dx = ox + targets[t].x - c.x;
        const dy = oy + targets[t].y - c.y;
        const d = dx * dx + dy * dy;
        if (d < bestD) {
          bestD = d;
          best = t;
        }
      }
      if (best >= 0) {
        used[best] = true;
        c.tx = targets[best].x; // stored local; offset by wordOrigin each frame
        c.ty = targets[best].y;
        c.active = true;
        // Formed look is intentionally UNIFORM (no per-cursor rotation/opacity
        // jitter) so the word reads as a clean glyph; the lively tilt/alpha live
        // in spawn() and only colour the roaming crowd. Bob phase stays varied
        // for a gentle, non-synchronised idle.
        c.opacity = 1;
        c.rot = 0;
        c.bobPhase = hash01(best + 911) * Math.PI * 2;
      } else {
        c.active = false;
      }
    }
  };

  const build = () => {
    cssW = window.innerWidth;
    cssH = window.innerHeight;
    const wr = wordEl.getBoundingClientRect();
    const wordW = wr.width;
    const wordH = wr.height;
    if (wordW === 0 || wordH === 0 || cssW === 0 || cssH === 0) return;

    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    inMinX = EDGE_MARGIN;
    inMaxX = cssW - EDGE_MARGIN;
    inMinY = EDGE_MARGIN;
    inMaxY = cssH - EDGE_MARGIN;

    // Pick the device detail tier: phones / low-core / low-memory machines get a
    // coarser, cheaper swarm; capable desktops a finer, denser one.
    const small = window.matchMedia("(max-width: 768px)").matches;
    const cores = navigator.hardwareConcurrency || 4;
    const mem =
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    const tier =
      small || cores <= 4 || mem <= 4
        ? TIER_LOW
        : cores >= 8 && mem >= 8
        ? TIER_HIGH
        : TIER_MEDIUM;
    detail = tier.detail;
    drawBorder = tier.border;
    // On mobile "Store" wraps onto its own centred line, so the icon sits
    // dead-centre under the headline (no left nudge) but lower; on desktop it's
    // nudged a little left and only slightly down. Mobile also morphs slower.
    iconNudgeX = small ? 0 : ICON_NUDGE_X;
    iconNudgeY = small ? ICON_NUDGE_Y_MOBILE : ICON_NUDGE_Y_DESKTOP;
    morphDurMs = small ? MORPH_DUR_MOBILE : MORPH_DUR_DESKTOP;
    // Density follows the glyph area (stroke-locked + `detail`); the cap is the
    // tier ceiling, or `maxCursors` if the host set a lower one.
    const perfCap = maxCursors ? Math.min(maxCursors, tier.cap) : tier.cap;

    targets = sampleTargets(wordW, wordH, perfCap);
    if (targets.length === 0) return;
    // One cursor per word target — wanderers are word cursors taking turns out,
    // not extras, so the pool is exactly the word.
    const poolSize = targets.length;

    while (cursors.length < poolSize) cursors.push(spawn());
    if (cursors.length > poolSize) cursors.length = poolSize;

    // Storefront icon for the loop: one point per cursor so the WHOLE word can
    // morph into it (greedy-assigned later, leftovers double up).
    iconTargets = sampleIcon(wordW, wordH, poolSize);

    // Hand out word targets. If we rebuilt mid-morph, also refresh the icon ones.
    assignTargets();
    if (phase === "toIcon" || phase === "iconHold" || phase === "toWord") {
      assignIcon();
    }
    // First build: snap every cursor straight onto its word spot so the page
    // loads already spelling the word (no fly-in, no scattered intro).
    if (!snapped && phase === "formed") {
      const hr = host.getBoundingClientRect();
      for (const c of cursors) {
        if (!c.active) continue;
        c.x = hr.left + c.tx;
        c.y = hr.top + c.ty;
        c.vx = 0;
        c.vy = 0;
      }
      snapped = true;
    }
    // A rebuild may have moved the host (resize/layout shift); drop the previous
    // origin so the next frame re-baselines instead of jumping by the delta.
    prevOriginX = NaN;
    prevOriginY = NaN;
  };

  const stepAndDraw = () => {
    const now = performance.now();

    // Track the word's live position so the formed word follows the host element
    // (through scroll / layout shifts) while cursors live in viewport coords.
    const wr = host.getBoundingClientRect();
    wordOriginX = wr.left;
    wordOriginY = wr.top;
    wordBoxW = wr.width;
    wordBoxH = wr.height;

    // Lock content to the host: carry every cursor by the exact origin delta so
    // the word / icon scrolls 1:1 with the text, no spring lag. Active wanderers
    // are skipped — they roam the fixed viewport on their own parametric path.
    if (!Number.isNaN(prevOriginX)) {
      const dox = wordOriginX - prevOriginX;
      const doy = wordOriginY - prevOriginY;
      if (dox !== 0 || doy !== 0) {
        for (const c of cursors) {
          if (c.wstate > 0) continue;
          c.x += dox;
          c.y += doy;
        }
      }
    }
    prevOriginX = wordOriginX;
    prevOriginY = wordOriginY;

    // While the word is held, dispatch the occasional word cursor out into the
    // open. Pick a random one that's currently home; it travels out, clicks a time
    // or two, and returns — then another from a different part of the word goes.
    if (
      phase === "formed" &&
      activeWanderers < WANDER_MAX &&
      cursors.length > 0 &&
      Math.random() < WANDER_SPAWN_RATE / 60
    ) {
      const c = cursors[(Math.random() * cursors.length) | 0];
      if (c.active && c.wstate === 0 && c.clickStart < 0) {
        // Aim for genuinely open space: a spot on a ring AROUND the word box (a
        // random direction, a gap beyond the box), clamped into the viewport — so
        // the cursor visibly leaves the word and clicks where there's nothing,
        // never on top of the letters. Then set off on a human-like travel to it.
        const ang = rand(0, Math.PI * 2);
        const gap = rand(50, 230);
        const sx = wordOriginX + wordBoxW / 2 + Math.cos(ang) * (wordBoxW / 2 + gap);
        const sy = wordOriginY + wordBoxH / 2 + Math.sin(ang) * (wordBoxH / 2 + gap);
        c.clicksLeft = Math.round(rand(WANDER_CLICKS_MIN, WANDER_CLICKS_MAX));
        startMove(c, clamp(sx, inMinX, inMaxX), clamp(sy, inMinY, inMaxY), now);
        c.wstate = 1; // travelling out
        activeWanderers++;
      }
    }

    ctx.clearRect(0, 0, cssW, cssH);
    ctx.fillStyle = fill;
    ctx.strokeStyle = BORDER_COLOR;
    ctx.lineJoin = "round";

    const morphing = phase === "toIcon" || phase === "toWord";
    for (const c of cursors) {
      if (!c.active) continue;
      let ax = 0;
      let ay = 0;
      let mTgX = 0; // morph target (viewport px), used by the arrive-in-time glide
      let mTgY = 0;

      if (c.wstate > 0) {
        // A word cursor taking a turn out in the open, moving like a human hand:
        // travel out (1) → hesitate + click a time or two (2) → travel home (3).
        if (c.wstate === 1 || c.wstate === 3) {
          // Parametric travel: ease-in/out along a gently bowed path, with a
          // touch of tremor. Position is set directly (no spring), so it reads as
          // a deliberate hand movement rather than a mechanical glide.
          const t = clamp((now - c.wmStart) / c.wmDur, 0, 1);
          const e = easeMinJerk(t);
          let px = c.wsx + (c.wgx - c.wsx) * e;
          let py = c.wsy + (c.wgy - c.wsy) * e;
          const ddx = c.wgx - c.wsx;
          const ddy = c.wgy - c.wsy;
          const len = Math.max(1, Math.hypot(ddx, ddy));
          const bow = c.wcurve * Math.sin(Math.PI * t); // peaks mid-path, 0 at ends
          px += (-ddy / len) * bow;
          py += (ddx / len) * bow;
          const tremor = WANDER_TREMOR * Math.sin(Math.PI * t); // fades at the ends
          px += Math.sin(now * 0.017 + c.bobPhase * 3) * tremor;
          py += Math.cos(now * 0.021 + c.bobPhase * 5) * tremor;
          c.x = px;
          c.y = py;
          if (t >= 1) {
            if (c.wstate === 1) {
              c.wstate = 2; // arrived → hesitate, then click
              c.clickStart = -1;
              c.wnext = now + rand(WANDER_HESITATE_MIN, WANDER_HESITATE_MAX);
            } else {
              c.wstate = 0; // home again — rejoin the word
              activeWanderers = Math.max(0, activeWanderers - 1);
            }
          }
        } else {
          // wstate 2: at the spot. Hold (with a faint tremor), hesitate, click,
          // then settle a beat and travel home.
          c.x = c.wgx + Math.sin(now * 0.012 + c.bobPhase) * 0.5;
          c.y = c.wgy + Math.cos(now * 0.015 + c.bobPhase * 2) * 0.5;
          if (c.clickStart < 0) {
            if (now >= c.wnext) c.clickStart = now; // hesitation over → click
          } else if (now > c.clickStart + CLICK_DURATION) {
            c.clicksLeft--;
            if (c.clicksLeft > 0) {
              c.clickStart = -1;
              c.wnext = now + rand(140, 320); // brief gap, then click again
            } else {
              c.clickStart = -1;
              // settle a beat, then travel back to its exact word spot
              startMove(c, wordOriginX + c.tx, wordOriginY + c.ty, now + WANDER_SETTLE_MS);
              c.wstate = 3;
            }
          }
        }
      } else {
        // Following a target: the word (formed / toWord) or the storefront icon
        // (toIcon / iconHold).
        const onIcon = phase === "toIcon" || phase === "iconHold";
        const tgX = onIcon ? c.itx : c.tx;
        let tgY = onIcon ? c.ity : c.ty;
        if (phase === "formed") {
          tgY += Math.sin(now * BOB_SPEED + c.bobPhase) * BOB_AMP; // idle bob
        }
        if (morphing) {
          // The arrive-in-time integrator (below) glides this cursor to the target
          // over the whole morph duration — same wall-clock time regardless of how
          // far it travels, so the morph reads identically on every device.
          mTgX = wordOriginX + tgX;
          mTgY = wordOriginY + tgY;
        } else {
          // Hold (formed / iconHold): a firm spring keeps it crisp.
          ax += (wordOriginX + tgX - c.x) * SPRING_FORMED;
          ay += (wordOriginY + tgY - c.y) * SPRING_FORMED;
        }
      }

      // Pointer repulsion — applies in every phase (the word, the icon, and the
      // morphs between them) so the swarm scatters from the cursor at all times.
      if (pointer.active && c.wstate === 0) {
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

      // Soft containment so the crowd stays in the word's vicinity.
      if (c.x < inMinX) ax += (inMinX - c.x) * CONTAIN_K;
      else if (c.x > inMaxX) ax += (inMaxX - c.x) * CONTAIN_K;
      if (c.y < inMinY) ay += (inMinY - c.y) * CONTAIN_K;
      else if (c.y > inMaxY) ay += (inMaxY - c.y) * CONTAIN_K;

      if (morphing) {
        // Arrive-in-time: cover a 1/remaining-frames slice of the gap each frame
        // → a constant-speed glide that lands exactly when the morph ends, no
        // matter the distance. Repel + containment (ax/ay) ride on top.
        const remain = Math.max(1, (phaseStart + morphDurMs - now) / FRAME_MS);
        c.vx = (mTgX - c.x) / remain + ax;
        c.vy = (mTgY - c.y) / remain + ay;
        c.x += c.vx;
        c.y += c.vy;
      } else if (c.wstate > 0) {
        // Wanderers are positioned directly by their parametric travel above; no
        // velocity integration (and they ignore repel/containment).
        c.vx = 0;
        c.vy = 0;
      } else {
        c.vx = (c.vx + ax) * DAMP_ACTIVE;
        c.vy = (c.vy + ay) * DAMP_ACTIVE;
        c.x += c.vx;
        c.y += c.vy;
      }

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

      // Click effect: a quick press-dip + an expanding ripple ring and a brief
      // bright core pop at the cursor tip (roaming clicks AND wander-off clicks).
      let cscale = arrowS;
      if (c.clickStart >= 0) {
        const p = (now - c.clickStart) / CLICK_DURATION;
        if (p >= 1) {
          c.clickStart = -1;
        } else {
          cscale = arrowS * (1 - 0.2 * Math.sin(p * Math.PI)); // press dip
          const tipX = c.x + (4 - ARROW_ANCHOR_X) * arrowS;
          const tipY = c.y + (2.2 - ARROW_ANCHOR_Y) * arrowS;
          const unit = arrowS * ARROW_UNIT_HEIGHT; // ≈ one cursor's height in px
          ctx.save();
          // Expanding ring.
          ctx.globalAlpha = (1 - p) * 0.55;
          ctx.strokeStyle = fill;
          ctx.lineWidth = Math.max(1, arrowS * 1.6);
          ctx.beginPath();
          ctx.arc(tipX, tipY, (0.3 + p * 2.4) * unit, 0, Math.PI * 2);
          ctx.stroke();
          // Quick bright core pop in the first half of the click.
          if (p < 0.45) {
            ctx.globalAlpha = (1 - p / 0.45) * 0.7;
            ctx.fillStyle = fill;
            ctx.beginPath();
            ctx.arc(tipX, tipY, unit * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      // Draw the arrow, anchored at its centre over (c.x, c.y).
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);
      ctx.scale(cscale, cscale);
      ctx.translate(-ARROW_ANCHOR_X, -ARROW_ANCHOR_Y);
      ctx.globalAlpha = c.opacity;
      ctx.fill(arrow);
      if (drawBorder) {
        ctx.lineWidth = BORDER_WIDTH;
        ctx.stroke(arrow);
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    // Drive the loop: hold the word → morph to the icon → hold → morph back → … .
    // Each morph runs for exactly `morphDurMs` (the arrive-in-time integrator
    // lands the cursors right as it ends), so the duration is consistent.
    if (phase === "formed" && now >= formedAt + assembleDelayMs) {
      assignIcon();
      phase = "toIcon";
      phaseStart = now;
    } else if (phase === "toIcon" && now >= phaseStart + morphDurMs) {
      phase = "iconHold";
      phaseStart = now;
    } else if (phase === "iconHold" && now >= phaseStart + ICON_HOLD_MS) {
      assignTargets(); // re-grab nearest word spots from the icon, then expand back
      phase = "toWord";
      phaseStart = now;
    } else if (phase === "toWord" && now >= phaseStart + morphDurMs) {
      phase = "formed";
      formedAt = now; // back to the word; the loop repeats after the hold
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

  // Pointer drives the repulsion field. The canvas is a fixed full-viewport
  // overlay, so client coords map straight to canvas coords.
  const onMove = (e: PointerEvent) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
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
      if (visible) {
        canvas.style.visibility = "";
        kick();
      } else {
        // The canvas is a fixed full-viewport overlay, so once the host scrolls
        // away we must stop AND wipe it — otherwise the last painted frame of the
        // formed word lingers frozen on screen, floating over later content.
        stop();
        ctx.clearRect(0, 0, cssW, cssH);
        canvas.style.visibility = "hidden";
        // Forget the last origin so the first frame after re-showing doesn't
        // carry the cursors by a stale (possibly huge) scroll delta.
        prevOriginX = NaN;
        prevOriginY = NaN;
      }
    },
    { threshold: 0 }
  );
  io.observe(host);

  const scheduleBuild = () => {
    window.clearTimeout(buildTimer);
    buildTimer = window.setTimeout(() => {
      if (cancelled || !ready) return;
      build();
      kick();
    }, 100);
  };
  const ro = new ResizeObserver(scheduleBuild);
  ro.observe(host);

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointercancel", onLeave, { passive: true });
  document.addEventListener("mouseleave", onLeave, { passive: true });
  window.addEventListener("resize", scheduleBuild, { passive: true });

  // Wait for the host font before sampling, or glyph metrics are wrong.
  const start = async () => {
    try {
      await document.fonts.ready;
    } catch {
      /* document.fonts unsupported — proceed with whatever is loaded */
    }
    if (cancelled) return;
    build();
    if (cancelled) return;
    formedAt = performance.now(); // start holding the word; first morph after the hold
    ready = true;
    kick();
  };
  void start();

  return {
    destroy() {
      cancelled = true;
      stop();
      io.disconnect();
      ro.disconnect();
      window.clearTimeout(buildTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointercancel", onLeave);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", scheduleBuild);
    },
  };
}
