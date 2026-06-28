import type { RoadmapItem } from "./data";
import ApiMock from "./ApiMock";
import FeedMock from "./FeedMock";
import DocsMock from "./DocsMock";

const MOCKS = { api: ApiMock, feed: FeedMock, docs: DocsMock } as const;

// One roadmap step: a title, what it does and why, and a small custom UI that
// shows the idea. Content sits at the top so the pixel path weaves below.
export default function RoadmapPanel({ step }: { step: RoadmapItem }) {
  const Mock = MOCKS[step.mock];

  return (
    <article
      className={`future-panel relative flex flex-col px-7 py-12 ${
        step.mock === "feed" ? "future-panel--wide" : ""
      }`}
    >
      <h3 className="font-display text-3xl font-black leading-tight tracking-tight text-white">
        {step.title}
      </h3>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">
        {step.body}
      </p>
      <div className="relative z-10 mt-7">
        <Mock />
      </div>
    </article>
  );
}
