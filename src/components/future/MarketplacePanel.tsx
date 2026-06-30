import type { RoadmapItem } from "./data";
import GlowMock from "./GlowMock";
import AngledMock from "./AngledMock";

export default function MarketplacePanel({ step }: { step: RoadmapItem }) {
  return (
    <div className="relative">
      {/* Giant Lucide arrow (up-right, 45°) — desktop only; its tail bleeds off
          the left viewport edge while the tip points to the top-right corner.
          Static, very faint background motif. */}
      <div
        className="pointer-events-none absolute hidden md:block"
        style={{
          top: "92%",
          left: "-64rem",
          transform: "translateY(-50%)",
          zIndex: 0,
        }}
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="760"
          height="760"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="0.65"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          style={{ opacity: 0.045 }}
          aria-hidden="true"
        >
          <path d="M13 5H19V11" />
          <path d="M19 5L5 19" />
        </svg>
      </div>

      <article className="future-card future-card--feed relative overflow-hidden p-6 md:p-7">
        <div className="relative z-10">
          <h3 className="font-display text-2xl font-black leading-tight tracking-tight text-white">
            {step.title}
          </h3>
          <p className="mt-2.5 max-w-[17rem] text-sm leading-relaxed text-white/55">
            {step.body}
          </p>
        </div>

        <div className="future-feed-stage">
          <GlowMock tone="accent" position={{ x: "55%", y: "55%" }}>
            <AngledMock fade="none">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white shadow-[0_20px_50px_-18px_rgba(0,0,0,0.7)]">
                <div className="aspect-[2531/1598]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/img/squareshare1.webp"
                    alt="Square Share photo marketplace gallery"
                    loading="lazy"
                    decoding="async"
                    className="block h-full w-full object-cover"
                  />
                </div>
              </div>
            </AngledMock>
          </GlowMock>
        </div>

        <div className="future-card-fade" aria-hidden="true" />
      </article>
    </div>
  );
}
