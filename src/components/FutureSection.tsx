"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ROADMAP } from "./future/data";
import RoadmapPanel from "./future/RoadmapPanel";
import EmbedsSection from "./future/EmbedsSection";
import PixelPath from "./future/PixelPath";
import "./FutureSection.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// "Where Square Share is going." A pinned horizontal-scroll section: as you
// scroll down, the track of panels (a roadmap, then the planned embeds) moves
// sideways. On mobile and for reduced-motion users it falls back to a plain
// vertical stack with no pinning. Pure black, single purple accent, pixel-grid
// backdrop: the house style, not a generic feature grid.
export default function FutureSection() {
  const section = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Only wire up the pinned horizontal scroll on a real pointer-sized
      // viewport with motion allowed. Everything else gets the static stack.
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const trackEl = track.current;
          const pinEl = pin.current;
          const sectionEl = section.current;
          if (!trackEl || !pinEl || !sectionEl) return;

          sectionEl.classList.add("is-horizontal");
          const distance = () =>
            Math.max(0, trackEl.scrollWidth - pinEl.clientWidth);

          const st = ScrollTrigger.create({
            trigger: pinEl,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            // Tie the track directly to scroll position. A numeric scrub lags
            // behind and, on a fast flick to the end, the leftover distance
            // slides across as the section unpins (a visible jump).
            scrub: true,
            invalidateOnRefresh: true,
            animation: gsap.to(trackEl, { x: () => -distance(), ease: "none" }),
            onUpdate: (self) => {
              if (progress.current) {
                progress.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          });

          return () => {
            st.kill();
            sectionEl.classList.remove("is-horizontal");
            gsap.set(trackEl, { clearProps: "transform" });
          };
        },
      );
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      id="future"
      className="future-section relative bg-black text-white"
    >
      <div ref={pin} className="future-pin relative">
        <div ref={track} className="future-track relative z-10">
          {/* The weaving pixel path (horizontal mode) and a vertical pixel
              spine (stack mode), behind the panels. */}
          <PixelPath className="future-weave" />
          <span aria-hidden="true" className="future-vline" />

          {/* Leading breathing room so the intro is not flush to the viewport
              edge the instant the horizontal scroll engages. */}
          <div aria-hidden="true" className="future-edge" />

          {/* Intro panel */}
          <article className="future-panel future-panel--intro relative flex flex-col px-7 py-12">
            <h2 className="font-display text-5xl font-black leading-[1.02] tracking-tight text-white md:text-7xl">
              Where Square Share is going.
            </h2>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50 md:text-base">
              Everything here is planned, not live yet.
            </p>
          </article>

          {/* The roadmap */}
          {ROADMAP.map((step) => (
            <RoadmapPanel key={step.num} step={step} />
          ))}

          {/* Future embeds: one panel, a card per embed */}
          <EmbedsSection />

          {/* Trailing breathing room so the last panel stays on screen before
              the scroll disengages. */}
          <div aria-hidden="true" className="future-edge" />
        </div>

        {/* Horizontal-scroll progress (horizontal mode only, via CSS) */}
        <div className="future-progress absolute inset-x-0 bottom-0 z-10 h-px bg-white/10">
          <span
            ref={progress}
            className="block h-full origin-left bg-acid"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
