import { Check, FileDown, Plus, Star } from "lucide-react";
import { EMBEDS, type EmbedKind } from "./data";

// The small representative element each card carries in its bottom-right box.
function Preview({ kind }: { kind: EmbedKind }) {
  if (kind === "reviews") {
    return (
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            strokeWidth={1.5}
            fill="currentColor"
            className="future-star text-yellow-400"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>
    );
  }

  if (kind === "email") {
    return (
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] text-neutral-500">
          you@mail.com
        </span>
        <span className="flex h-4 w-4 items-center justify-center rounded bg-acid text-white">
          <Plus size={11} strokeWidth={3} />
        </span>
      </div>
    );
  }

  // delivery
  return (
    <div className="flex items-center gap-2">
      <FileDown size={14} strokeWidth={2} className="text-acid" />
      <span className="font-mono text-[10px] text-neutral-500">license.key</span>
      <Check size={13} strokeWidth={3} className="text-emerald-500" />
    </div>
  );
}

// The "future embeds" as one panel holding a card per planned embed. The cards
// are light-mode UI in the How It Works style; each shows a representative
// element in a box pinned to its bottom-right.
export default function EmbedsSection() {
  return (
    <article className="future-panel future-panel--embeds flex flex-col px-7 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/30">
        Future embeds
      </p>
      <h3 className="mt-4 max-w-md font-display text-2xl font-black leading-tight tracking-tight text-white md:text-3xl">
        We handle the database, you make it pretty.
      </h3>

      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {EMBEDS.map((item) => (
          <div
            key={item.title}
            className="flex min-h-[13rem] flex-col rounded-xl border border-neutral-200 bg-white p-4"
          >
            <h4 className="font-display text-lg font-black leading-tight text-neutral-900">
              {item.title}
            </h4>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
              {item.body}
            </p>
            <div className="mt-auto self-end rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5">
              <Preview kind={item.kind} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
