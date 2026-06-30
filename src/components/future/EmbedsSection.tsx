import { Download, Mail, Star, type LucideIcon } from "lucide-react";
import { EMBEDS, type EmbedKind } from "./data";
import FloatingBubble from "./FloatingBubble";
import DotGrid from "./DotGrid";

// The representative icon for each planned embed.
const ICONS: Record<EmbedKind, LucideIcon> = {
  email: Mail,
  delivery: Download,
  reviews: Star,
};

// "Other embeds" — the trail's final station: the planned embeds as a stacked
// list of chips (icon + copy rows) over a faint dot-grid. Neutral throughout.
export default function EmbedsSection() {
  return (
    <article className="future-card future-card--embeds relative p-6 md:p-7">
      <DotGrid variant="dots" fade="bottom" />
      <div className="relative z-10">
        <h3 className="font-display text-2xl font-black leading-tight tracking-tight text-white">
          Other embeds
        </h3>

        <div className="mt-5 flex flex-col gap-3">
          {EMBEDS.map((item, i) => (
            <FloatingBubble
              key={item.title}
              icon={ICONS[item.kind]}
              title={item.title}
              body={item.body}
              delay={i * 0.7}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
