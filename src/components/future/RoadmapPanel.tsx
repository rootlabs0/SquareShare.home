import type { RoadmapItem } from "./data";
import StatusPill from "./StatusPill";
import TimelineNode from "./TimelineNode";

// One roadmap step as a panel. Content is anchored top (kicker) to bottom (rule)
// so it fills the panel height with no empty void when the track scrolls past.
export default function RoadmapPanel({ step }: { step: RoadmapItem }) {
  return (
    <article className="future-panel relative flex flex-col px-8 py-14 md:px-10">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-7 top-1/2 -translate-y-1/2 font-display text-[8.5rem] font-black leading-none text-white/[0.05]"
      >
        {step.num}
      </span>

      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
        The roadmap
      </p>

      <div className="relative flex flex-1 flex-col justify-center">
        <div className="max-w-xs">
          <StatusPill />
          <h3 className="mt-6 font-display text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
            {step.title}
          </h3>
          {step.clarifier && (
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
              {step.clarifier}
            </p>
          )}
          <p className="mt-5 text-base leading-relaxed text-white/55">
            {step.body}
          </p>
        </div>
      </div>

      <TimelineNode />
    </article>
  );
}
