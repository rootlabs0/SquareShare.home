import { ROADMAP } from "./future/data";
import RoadmapTrail from "./future/RoadmapTrail";
import "./FutureSection.css";

// "Where Square Share is going." A vertical roadmap threaded by a weaving pixel
// trail: each phase is a station on the trail. Content cards (kept from before)
// stack down the right; numbered nodes ride the weave on the left.
export default function FutureSection() {
  const api = ROADMAP.find((s) => s.mock === "api")!;
  const feed = ROADMAP.find((s) => s.mock === "feed")!;

  return (
    <section id="future" className="future-section relative bg-black text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
        <header className="mx-auto max-w-2xl text-center md:mr-0 md:text-right">
          <h2 className="font-display whitespace-nowrap text-5xl font-black leading-[1.05] tracking-tight text-white md:text-8xl">
            Our next steps
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/50 md:mr-0 md:text-base">
            Working hard to get this to you ASAP
          </p>
        </header>

        <RoadmapTrail api={api} feed={feed} />
      </div>
    </section>
  );
}
