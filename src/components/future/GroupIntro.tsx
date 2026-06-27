import TimelineNode from "./TimelineNode";

// A slim panel that opens each sub-group inside the horizontal track: a mono
// kicker and the sub-group title, sitting on the same pixel timeline.
export default function GroupIntro({
  kicker,
  title,
}: {
  kicker: string;
  title: string;
}) {
  return (
    <article className="future-panel flex flex-col px-8 py-14 md:px-10">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/30">
        {kicker}
      </p>
      <div className="flex flex-1 items-center">
        <h3 className="max-w-xs font-display text-3xl font-black leading-[1.1] tracking-tight text-white md:text-5xl">
          {title}
        </h3>
      </div>
      <TimelineNode />
    </article>
  );
}
