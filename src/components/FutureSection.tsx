"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ROADMAP, EMBEDS } from "./future/data";
import GroupIntro from "./future/GroupIntro";
import RoadmapPanel from "./future/RoadmapPanel";
import EmbedPanel from "./future/EmbedPanel";
import TimelineNode from "./future/TimelineNode";
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
            scrub: 1,
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
          {/* Intro panel */}
          <article className="future-panel future-panel--intro flex flex-col px-8 py-14 md:px-10">
            <div className="flex flex-1 flex-col justify-center">
              <h2 className="font-display text-4xl font-black leading-[1.05] tracking-tight text-white md:text-6xl">
                Where Square Share is going.
              </h2>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-white/50 md:text-lg">
                This is our direction, not our highlight reel. Everything here is
                planned and on the way. None of it is live yet.
              </p>
            </div>
            <TimelineNode />
          </article>

          {/* Sub-group 1: the roadmap */}
          <GroupIntro kicker="The roadmap" title="Where we're headed." />
          {ROADMAP.map((step) => (
            <RoadmapPanel key={step.num} step={step} />
          ))}

          {/* Sub-group 2: future embeds */}
          <GroupIntro
            kicker="Future embeds"
            title="We handle the database, you make it pretty."
          />
          {EMBEDS.map((item) => (
            <EmbedPanel key={item.title} item={item} />
          ))}
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
