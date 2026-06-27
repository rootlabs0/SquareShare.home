import type { EmbedItem } from "./data";
import StatusPill from "./StatusPill";
import TimelineNode from "./TimelineNode";

// One "future embed" as a panel. Content fills top (kicker) to bottom (rule) so
// there is no empty space below it when the track scrolls past.
export default function EmbedPanel({ item }: { item: EmbedItem }) {
  const Icon = item.icon;

  return (
    <article className="future-panel relative flex flex-col px-8 py-14 md:px-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
        Future embeds
      </p>

      <div className="flex flex-1 flex-col justify-center">
        <div className="max-w-xs">
          <span className="flex h-12 w-12 items-center justify-center border border-white/15 bg-white/[0.03] text-acid">
            <Icon size={22} strokeWidth={2} />
          </span>
          <div className="mt-6">
            <StatusPill />
          </div>
          <h3 className="mt-6 font-display text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
            {item.title}
          </h3>
          <p className="mt-5 text-base leading-relaxed text-white/55">
            {item.body}
          </p>
        </div>
      </div>

      <TimelineNode />
    </article>
  );
}
