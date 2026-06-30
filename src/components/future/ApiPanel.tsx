import type { RoadmapItem } from "./data";
import { API_TERMINAL } from "./data";
import TerminalFrame from "./TerminalFrame";
import GlowMock from "./GlowMock";
import DotGrid from "./DotGrid";

// "The API" — copy, then a terminal mockup showing the embed snippet building,
// over a faint dot-grid with a soft neutral glow contained inside the card.
export default function ApiPanel({ step }: { step: RoadmapItem }) {
  return (
    <article className="future-card future-card--api relative p-6 md:p-7">
      <DotGrid variant="dots" fade="bottom" />
      <div className="relative z-10">
      <h3 className="font-display text-2xl font-black leading-tight tracking-tight text-white">
        {step.title}
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-white/55">{step.body}</p>

      <div className="relative mt-5">
        <DotGrid variant="dots" fade="radial" />
        <GlowMock position={{ x: "55%", y: "50%" }}>
          <TerminalFrame lines={API_TERMINAL} />
        </GlowMock>
      </div>
      </div>
    </article>
  );
}
