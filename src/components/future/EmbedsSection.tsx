import { Download, Mail, Star, type LucideIcon } from "lucide-react";
import { EMBEDS, type EmbedKind } from "./data";

// The representative icon for each planned embed.
const ICONS: Record<EmbedKind, LucideIcon> = {
  email: Mail,
  delivery: Download,
  reviews: Star,
};

// The "future embeds" as one panel holding a card per planned embed. Each card
// is a dark-mode row: a purple icon on the left, the copy on the right.
export default function EmbedsSection() {
  return (
    <article className="future-panel future-panel--embeds flex flex-col px-7 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/30">
        Future embeds
      </p>
      <h3 className="mt-4 max-w-md font-display text-2xl font-black leading-tight tracking-tight text-white md:text-3xl">
        We handle the database, you make it pretty.
      </h3>

      <div className="mt-7 flex flex-col gap-3">
        {EMBEDS.map((item) => {
          const Icon = ICONS[item.kind];
          return (
            <div
              key={item.title}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-acid/30 bg-acid/10 text-acid">
                <Icon size={20} strokeWidth={2} />
              </span>
              <div>
                <h4 className="font-display text-base font-black leading-tight text-white">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-white/55">
                  {item.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
