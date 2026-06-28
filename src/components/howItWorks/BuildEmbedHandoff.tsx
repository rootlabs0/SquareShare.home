"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import BrowserFrame from "./BrowserFrame";
import CursorPointer from "./CursorPointer";
import StorefrontGrid from "./StorefrontGrid";
import StoreBuilder from "./StoreBuilder";
import { STEPS } from "./data";

const S1 = STEPS[0];
const S2 = STEPS[1];
const CURSOR_BLUE = "#2563eb";

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ── Shared pieces ───────────────────────────────────────────────────────────

function TextBlock({ step }: { step: (typeof STEPS)[number] }) {
  return (
    <div>
      <span className="block font-display text-6xl font-black leading-none text-neutral-200 md:text-7xl">
        {step.num}
      </span>
      <h3 className="mt-4 font-display text-3xl font-black leading-tight text-neutral-900 md:text-4xl">
        {step.title}
      </h3>
      <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-600">
        {step.body}
      </p>
    </div>
  );
}

// The example external website. `slotRef` marks where the store lands.
function SiteFrame({
  slotRef,
  children,
}: {
  slotRef?: RefObject<HTMLDivElement | null>;
  children?: ReactNode;
}) {
  return (
    <BrowserFrame
      url="yourstudio.com"
      label="An external website with the Square Share store embedded inside it"
    >
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2.5">
        <span className="text-sm font-black tracking-tight text-neutral-900">
          STUDIO
        </span>
        <div className="hidden gap-4 text-[11px] text-neutral-400 sm:flex">
          <span>Work</span>
          <span>About</span>
          <span>Contact</span>
        </div>
      </div>
      <div className="px-4 py-3">
        <h4 className="text-sm font-black text-neutral-900 sm:text-base">
          Handmade goods from my studio
        </h4>
        <p className="mt-0.5 text-[11px] text-neutral-500">
          A small shop of things I make between commissions.
        </p>
        <div className="mb-1 mt-3 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Shop
          </span>
          <span className="text-[9px] text-neutral-400">
            Powered by Square Share
          </span>
        </div>
        <div ref={slotRef} className="aspect-[4/3] w-[64%]">
          {children}
        </div>
      </div>
    </BrowserFrame>
  );
}

// ── Stacked fallback (mobile / reduced motion): static end-states ────────────

function StackedFallback() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-24 px-6 md:gap-32">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <TextBlock step={S1} />
        <div className="mx-auto w-full max-w-xl lg:mx-0">
          {/* Same animated build as the desktop handoff; it self-plays on
              scroll-into-view and ends on the finished grid (reduced motion is
              handled inside StoreBuilder, which then shows the static grid). */}
          <StoreBuilder />
        </div>
      </div>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 mx-auto w-full max-w-xl lg:order-1 lg:mx-0">
          <SiteFrame>
            <StorefrontGrid className="!shadow-none" />
          </SiteFrame>
        </div>
        <div className="order-1 lg:order-2">
          <TextBlock step={S2} />
        </div>
      </div>
    </div>
  );
}

// ── Scroll handoff (desktop): a blue cursor drags the 01 grid into 02 ─────────

function Handoff() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null); // 01 grid slot (right)
  const targetRef = useRef<HTMLDivElement>(null); // 02 website slot (left)
  const flyRef = useRef<HTMLDivElement>(null); // the travelling store
  const cursorRef = useRef<HTMLDivElement>(null);
  const targetGridRef = useRef<HTMLDivElement>(null); // the store locked into 02
  const buildDoneRef = useRef(false); // step-01 build animation has finished
  const releasedRef = useRef(false); // scrolled past the grace; let the drag run
  const kickRef = useRef<() => void>(() => {}); // re-run the loop on build finish
  const [dragging, setDragging] = useState(false);

  useLayoutEffect(() => {
    const fly = flyRef.current;
    const cursor = cursorRef.current;
    const container = containerRef.current;
    const source = sourceRef.current;
    const target = targetRef.current;
    const targetGrid = targetGridRef.current;
    if (!fly || !cursor || !container || !source || !target || !targetGrid)
      return;

    let raf = 0;
    // Smoothed state of the flying store (viewport centre, scale, lift, shadow)
    // so its motion plays as a damped animation rather than tracking scroll 1:1.
    let cur: {
      cx: number;
      cy: number;
      scale: number;
      lift: number;
      float: number;
    } | null = null;
    let draggingNow = false;
    let droppedNow = false;
    let lockedNow = false;

    // How far past "01 centered" a scroll may go before it stops protecting the
    // build and lets the drag take over. A small accidental over-scroll stays
    // under this and still gets to watch the build; a fast or deliberate scroll
    // blows past it in a frame or two and releases.
    const GRACE_P = 0.3;
    const GRAB_START = 0.012; // the carried-size shrink begins just after grab
    const GRAB_END = 0.13; // fully shrunk to the carried size by here
    const DROP_AT = 0.82; // trigger the (played) drop animation
    const DROP_UNDO = 0.74; // hysteresis: un-drop only if scrolled back below

    // Raw scroll progress: 0 at "01 grid centered", 1 at "02 slot centered".
    const measure = () => {
      const cRect = container.getBoundingClientRect();
      const sRect = source.getBoundingClientRect();
      const tRect = target.getBoundingClientRect();
      if (!sRect.width || !tRect.width) return null;
      const vh = window.innerHeight;
      const sCenterDoc = sRect.top + window.scrollY + sRect.height / 2;
      const tCenterDoc = tRect.top + window.scrollY + tRect.height / 2;
      const start = sCenterDoc - vh * 0.5;
      const end = tCenterDoc - vh * 0.5;
      const raw = end > start ? (window.scrollY - start) / (end - start) : 0;
      return { cRect, sRect, tRect, rawP: Math.min(1, Math.max(0, raw)) };
    };

    const tick = () => {
      const m = measure();
      if (!m) {
        raf = 0;
        return;
      }
      const { cRect, sRect, tRect, rawP } = m;

      // Until the build finishes, hold the store docked (p = 0) so a small
      // accidental over-scroll does not skip it. Once the user scrolls clearly
      // past the grace, give up and let the drag run from the real position.
      if (!buildDoneRef.current && !releasedRef.current && rawP > GRACE_P) {
        releasedRef.current = true;
      }
      const dragAllowed = buildDoneRef.current || releasedRef.current;
      const p = dragAllowed ? rawP : 0;

      const vh = window.innerHeight;
      const w = sRect.width;
      const h = sRect.height;
      const ratio = tRect.width / sRect.width;

      // Viewport centres of the two slots (they move with scroll).
      const srcCx = sRect.left + sRect.width / 2;
      const srcCy = sRect.top + sRect.height / 2;
      const tgtCx = tRect.left + tRect.width / 2;
      const tgtCy = tRect.top + tRect.height / 2;

      // The drop is a triggered animation: once the drag reaches the end we snap
      // the *target* to the docked slot and let the smoothing play the expand +
      // settle, so the drop is smooth and not scrubbed frame-by-frame by scroll.
      if (!droppedNow && p >= DROP_AT) droppedNow = true;
      else if (droppedNow && p < DROP_UNDO) droppedNow = false;

      let cx: number;
      let cy: number;
      let scale: number;
      let liftTarget: number;
      // Drop shadow is on while the store is floating, off once it embeds, so
      // the hand-off to the flat in-page copy on lock is seamless.
      const floatTarget = droppedNow ? 0 : 1;
      if (droppedNow) {
        cx = tgtCx;
        cy = tgtCy;
        scale = ratio;
        liftTarget = 0;
      } else {
        const eX = easeInOut(p);
        cx = lerp(srcCx, tgtCx, eX);
        // Keep the store near the viewport centre mid-flight (so it never runs
        // off the top of the screen), docking to the real slot centres at the
        // ends so the hand-off in and out stays seamless.
        const dock = 1 - Math.sin(p * Math.PI);
        cy = lerp(vh * 0.5, lerp(srcCy, tgtCy, eX), dock);
        // Shrink to a small carried size just after the grab, then stay small.
        const carry = ratio * 0.62;
        if (p <= GRAB_START) scale = 1;
        else if (p < GRAB_END)
          scale = lerp(
            1,
            carry,
            easeOut((p - GRAB_START) / (GRAB_END - GRAB_START))
          );
        else scale = carry;
        liftTarget = Math.sin(p * Math.PI);
      }

      // Ease the smoothed state toward the target so motion plays as animation.
      if (!cur) cur = { cx, cy, scale, lift: liftTarget, float: floatTarget };
      const k = 0.22;
      cur.cx += (cx - cur.cx) * k;
      cur.cy += (cy - cur.cy) * k;
      cur.scale += (scale - cur.scale) * k;
      cur.lift += (liftTarget - cur.lift) * k;
      cur.float += (floatTarget - cur.float) * k;
      const settled =
        Math.abs(cx - cur.cx) < 0.4 &&
        Math.abs(cy - cur.cy) < 0.4 &&
        Math.abs(scale - cur.scale) < 0.001 &&
        Math.abs(liftTarget - cur.lift) < 0.005 &&
        Math.abs(floatTarget - cur.float) < 0.005;
      if (settled) {
        cur.cx = cx;
        cur.cy = cy;
        cur.scale = scale;
        cur.lift = liftTarget;
        cur.float = floatTarget;
      }

      // Viewport centre + scale -> container-relative top-left (origin top-left).
      const renderW = w * cur.scale;
      const renderH = h * cur.scale;
      const left = cur.cx - renderW / 2 - cRect.left;
      const top = cur.cy - renderH / 2 - cRect.top;
      const lift = cur.lift;
      const sh = cur.float; // shadow strength, fades out as the store embeds

      fly.style.width = `${w}px`;
      fly.style.transform = `translate(${left}px, ${top}px) scale(${cur.scale}) rotate(${-2.5 * lift}deg)`;
      fly.style.filter = `drop-shadow(0 ${18 * sh + 22 * lift}px ${34 * sh + 36 * lift}px rgba(0,0,0,${0.16 * sh + 0.14 * lift}))`;

      // Once the drop has played out, lock the store into the 02 slot: hand off
      // to the in-page copy so it scrolls with the rest of the 02 UI instead of
      // being repositioned (and lagging behind) every frame.
      if (droppedNow) {
        if (settled) lockedNow = true;
      } else {
        lockedNow = false;
      }
      const building = p <= 0.01;
      source.style.opacity = building ? "1" : "0";
      if (lockedNow) {
        fly.style.opacity = "0";
        targetGrid.style.opacity = "1";
      } else {
        fly.style.opacity = building ? "0" : "1";
        targetGrid.style.opacity = "0";
      }

      // Cursor grabs the store in its lower-right area (not the corner).
      const gx = left + 0.7 * renderW;
      const gy = top + 0.72 * renderH;
      cursor.style.transform = `translate(${gx - 4}px, ${gy - 3}px)`;

      // The cursor lets go when the drop triggers; the store then settles in.
      const nowDrag = p > 0.01 && !droppedNow;
      if (nowDrag !== draggingNow) {
        draggingNow = nowDrag;
        setDragging(nowDrag);
      }

      raf = settled ? 0 : requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    // Let the build-complete callback re-run the loop so the drag is released
    // the moment the build finishes, even without a scroll event.
    kickRef.current = onScroll;

    tick(); // set initial docked position before paint
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    const ro = new ResizeObserver(onScroll);
    ro.observe(container);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-6xl px-6">
      {/* Step 01: text left, storefront (source slot) right */}
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <TextBlock step={S1} />
        <div className="mx-auto w-full max-w-xl lg:order-2 lg:mx-0">
          {/* The store builds itself here. Once the drag starts, the travelling
              copy takes over and this source is hidden, so the swap is seamless. */}
          <div ref={sourceRef} className="w-full">
            <StoreBuilder
              onBuildComplete={() => {
                buildDoneRef.current = true;
                kickRef.current();
              }}
            />
          </div>
        </div>
      </div>

      {/* Step 02: website (target slot) left, text right. The big gap gives the
          store open space to be dragged across. */}
      <div className="mt-[38vh] grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="mx-auto w-full max-w-xl lg:order-1 lg:mx-0">
          <SiteFrame slotRef={targetRef}>
            {/* The store, locked into the page once it lands so it scrolls with
                the 02 UI. Hidden until the drop completes. */}
            <div ref={targetGridRef} style={{ opacity: 0 }}>
              <StorefrontGrid className="!shadow-none" />
            </div>
          </SiteFrame>
        </div>
        <div className="lg:order-2">
          <TextBlock step={S2} />
        </div>
      </div>

      {/* The travelling store (positioned via scroll) */}
      <div
        ref={flyRef}
        style={{ opacity: 0, willChange: "transform, filter" }}
        className="pointer-events-none absolute left-0 top-0 z-30 origin-top-left"
      >
        <StorefrontGrid className="!shadow-none" />
      </div>

      {/* The blue cursor. Outer div is positioned imperatively; the inner visual
          pops in (spring + ripple) so the eye is drawn to it as the drag starts. */}
      <div
        ref={cursorRef}
        style={{ willChange: "transform" }}
        className="pointer-events-none absolute left-0 top-0 z-40"
      >
        <AnimatePresence>
          {dragging && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{
                x: 30,
                y: -24,
                scale: 0.7,
                opacity: 0,
                transition: { duration: 0.4, ease: "easeOut" },
              }}
              transition={{ type: "spring", stiffness: 520, damping: 18 }}
              className="relative origin-top-left"
            >
              <motion.span
                initial={{ scale: 0, opacity: 0.55 }}
                animate={{ scale: 2.4, opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="absolute h-6 w-6 rounded-full"
                style={{ left: -8, top: -9, border: `2px solid ${CURSOR_BLUE}` }}
              />
              <CursorPointer color={CURSOR_BLUE} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function BuildEmbedHandoff() {
  // The drag only makes sense in the side-by-side two-column layout, which only
  // exists at lg+. Below that (and for reduced motion) show plain stacked
  // sections with no cursor/transition.
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduced = useReducedMotion();
  if (!isDesktop || reduced) return <StackedFallback />;
  return <Handoff />;
}
