import { STATUS_LABEL } from "./data";

// Shared "Planned" marker. Sharp corners, white label, with the purple accent
// carried by the border and the small square dot (purple text at this size
// would fail contrast on black, so it stays on the non-text elements).
export default function StatusPill() {
  return (
    <span className="inline-flex items-center gap-2 border border-acid/40 bg-acid/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
      <span aria-hidden="true" className="h-1.5 w-1.5 bg-acid" />
      {STATUS_LABEL}
    </span>
  );
}
