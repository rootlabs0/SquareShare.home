"use client";

import { useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/useMediaQuery";
import BrowserFrame from "./BrowserFrame";
import CursorPointer from "./CursorPointer";
import StorefrontGrid from "./StorefrontGrid";
import { STEPS } from "./data";

const S1 = STEPS[0];
const S2 = STEPS[1];
const CURSOR_BLUE = "#2563eb";

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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

function Snippet() {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 p-3 font-mono text-[11px] leading-relaxed text-neutral-300 shadow-xl">
      <div className="mb-2 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-neutral-600" />
        <span className="h-2 w-2 rounded-full bg-neutral-600" />
        <span className="ml-1 text-[10px] text-neutral-500">embed.html</span>
      </div>
      <pre className="whitespace-pre-wrap">
        <code>{`<script src="squareshare.to/embed.js"></script>\n<div id="sq-store"></div>`}</code>
      </pre>
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
          <StorefrontGrid />
        </div>
      </div>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <div className="mx-auto w-full max-w-xl lg:mx-0">
            <SiteFrame>
              <StorefrontGrid className="!shadow-none" />
            </SiteFrame>
          </div>
          <div className="mx-auto mt-4 w-[80%] max-w-xs lg:mx-0">
            <Snippet />
          </div>
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

  useLayoutEffect(() => {
    const fly = flyRef.current;
    const cursor = cursorRef.current;
    const container = containerRef.current;
    const source = sourceRef.current;
    const target = targetRef.current;
    if (!fly || !cursor || !container || !source || !target) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const cRect = container.getBoundingClientRect();
      const sRect = source.getBoundingClientRect();
      const tRect = target.getBoundingClientRect();
      if (!sRect.width || !tRect.width) return;

      const vh = window.innerHeight;
      const sCenterDoc = sRect.top + window.scrollY + sRect.height / 2;
      const tCenterDoc = tRect.top + window.scrollY + tRect.height / 2;
      // Travel runs from "01 grid centered" to "02 slot centered" so the store
      // visibly drags across the gap between the two sections.
      const start = sCenterDoc - vh * 0.5;
      const end = tCenterDoc - vh * 0.5;
      const raw = end > start ? (window.scrollY - start) / (end - start) : 0;
      const p = Math.min(1, Math.max(0, raw));
      const e = easeInOut(p);

      // Container-relative coords so the store scrolls naturally with the page.
      const sLeft = sRect.left - cRect.left;
      const sTop = sRect.top - cRect.top;
      const tLeft = tRect.left - cRect.left;
      const tTop = tRect.top - cRect.top;

      const left = lerp(sLeft, tLeft, e);
      const top = lerp(sTop, tTop, e);
      const scale = lerp(1, tRect.width / sRect.width, e);

      fly.style.width = `${sRect.width}px`;
      fly.style.transform = `translate(${left}px, ${top}px) scale(${scale})`;
      fly.style.opacity = "1";

      // Blue cursor sits on the store while it's in flight.
      cursor.style.transform = `translate(${left + 16}px, ${top + 14}px)`;
      cursor.style.opacity = p > 0.03 && p < 0.97 ? "1" : "0";
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
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
          {/* Empty slot; the travelling store overlays it at rest */}
          <div ref={sourceRef} className="aspect-[4/3] w-full" />
        </div>
      </div>

      {/* Step 02: website (target slot) left, text right. The big gap gives the
          store open space to be dragged across. */}
      <div className="mt-[38vh] grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="mx-auto w-full max-w-xl lg:order-1 lg:mx-0">
          <SiteFrame slotRef={targetRef} />
          <div className="mt-4 w-[80%] max-w-xs">
            <Snippet />
          </div>
        </div>
        <div className="lg:order-2">
          <TextBlock step={S2} />
        </div>
      </div>

      {/* The travelling store + blue cursor (positioned via scroll) */}
      <div
        ref={flyRef}
        style={{ opacity: 0, willChange: "transform" }}
        className="pointer-events-none absolute left-0 top-0 z-30 origin-top-left"
      >
        <StorefrontGrid />
      </div>
      <div
        ref={cursorRef}
        style={{ opacity: 0, willChange: "transform" }}
        className="pointer-events-none absolute left-0 top-0 z-40"
      >
        <CursorPointer color={CURSOR_BLUE} />
      </div>
    </div>
  );
}

export default function BuildEmbedHandoff() {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  if (isMobile || reduced) return <StackedFallback />;
  return <Handoff />;
}
