"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
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

// The example external website the built store gets embedded into. Kept simple
// on purpose — a logo nav, one short hero line, the embedded shelf — so the
// store from step 01 is the focal point and reads as living inside someone's
// real page. No browser chrome; it presents as the site itself. `slotRef` marks
// where the dragged store lands and MUST stay aspect-[4/3] + w-full so the
// handoff math that measures it lines up.
function SiteFrame({
  slotRef,
  children,
}: {
  slotRef?: RefObject<HTMLDivElement | null>;
  children?: ReactNode;
}) {
  return (
    <div
      role="img"
      aria-label="An external website with the Square Share store embedded inside it"
      className="pointer-events-none select-none overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.18)]"
    >
      <div aria-hidden="true">
        {/* Nav */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-neutral-900 font-display text-[11px] font-black leading-none text-white">
              F
            </span>
            <span className="font-display text-sm font-bold tracking-tight text-neutral-900">
              Field&nbsp;&amp;&nbsp;Form
            </span>
          </div>
          <div className="flex items-center gap-5 text-[11px] font-medium text-neutral-400">
            <span>About</span>
            <span>Contact</span>
            <ShoppingBag
              size={14}
              strokeWidth={2.2}
              className="text-neutral-600"
            />
          </div>
        </div>

        {/* Hero + the embedded shelf */}
        <div className="px-5 pb-6 pt-5">
          <h4 className="font-display text-lg font-black leading-tight tracking-tight text-neutral-900">
            Handmade goods, made to last.
          </h4>
          <p className="mt-1.5 max-w-[44ch] text-[11px] leading-relaxed text-neutral-500">
            A small shop of things I make by hand between commissions.
          </p>

          {/* The embedded store — the hero of this section. */}
          <div className="mx-auto mt-5 w-[82%]">
            <div ref={slotRef} className="aspect-[4/3] w-full">
              {children}
            </div>
          </div>
        </div>

        {/* A peek of the next section, deliberately clipped by the card's bottom
            edge so the page reads as continuing below the fold. The capped
            height cuts off partway through the first line of body copy. */}
        <div className="max-h-[74px] overflow-hidden border-t border-neutral-100 px-5 pt-4">
          <h4 className="font-display text-lg font-black leading-tight tracking-tight text-neutral-900">
            Why I do what I do
          </h4>
          <p className="mt-2 text-[11px] leading-relaxed text-neutral-500">
            I started Field &amp; Form at a single workbench, making the pieces I
            wished I could find and couldn&apos;t. Every order still passes
            through my hands before it ever reaches yours.
          </p>
        </div>
      </div>
    </div>
  );
}

// 02 in the stacked (mobile) layout: a blue cursor carries the store in from the
// upper right and drops it into the website, then pops away. Self-plays once on
// scroll-into-view (mobile scroll-scrubbing is janky, so this is time-based).
// Reduced motion falls back to the store already embedded, with no cursor.
function SiteFrameDrop() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

  if (reduced) {
    return (
      <div ref={ref}>
        <SiteFrame>
          <StorefrontGrid className="!shadow-none" />
        </SiteFrame>
      </div>
    );
  }

  return (
    <div ref={ref}>
      <SiteFrame>
        <div className="relative h-full w-full">
          {/* Carrier: brings the store down from the upper right into the slot. */}
          <motion.div
            className="absolute inset-0"
            initial={{ x: "40%", y: "-58%", opacity: 0 }}
            animate={inView ? { x: 0, y: 0, opacity: 1 } : undefined}
            transition={{ duration: 1, ease: EASE, opacity: { duration: 0.3 } }}
          >
            {/* Store: scales up from the carried size around the grab point, with
                a lift shadow that fades out as it embeds into the page. */}
            <motion.div
              className="h-full w-full"
              style={{ transformOrigin: "70% 64%" }}
              initial={{
                scale: 0.5,
                rotate: -4,
                filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.22))",
              }}
              animate={
                inView
                  ? {
                      scale: 1,
                      rotate: 0,
                      filter: "drop-shadow(0 0px 0px rgba(0,0,0,0))",
                    }
                  : undefined
              }
              transition={{
                scale: { duration: 1, ease: EASE },
                rotate: { duration: 1, ease: EASE },
                filter: { duration: 0.4, delay: 0.82, ease: "easeOut" },
              }}
            >
              <StorefrontGrid className="!shadow-none" />
            </motion.div>

            {/* Blue cursor sitting on the grab point; pops away once it lands. */}
            <motion.div
              className="pointer-events-none absolute left-[70%] top-[64%] z-40 origin-top-left"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={
                inView
                  ? {
                      opacity: [0, 1, 1, 0],
                      scale: [0.6, 1, 1, 0.7],
                      x: [0, 0, 0, 26],
                      y: [0, 0, 0, -20],
                    }
                  : undefined
              }
              transition={{
                duration: 1.25,
                times: [0, 0.16, 0.82, 1],
                ease: "easeOut",
              }}
            >
              {/* Release ripple as the store drops. */}
              <motion.span
                className="absolute h-6 w-6 rounded-full"
                style={{ left: -8, top: -9, border: `2px solid ${CURSOR_BLUE}` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: [0, 2.4], opacity: [0.55, 0] } : undefined}
                transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
              />
              <CursorPointer color={CURSOR_BLUE} />
            </motion.div>
          </motion.div>
        </div>
      </SiteFrame>
    </div>
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
          <SiteFrameDrop />
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
