// Custom UI for "The marketplace": a discovery feed of real products. Your
// product (the highlighted "You" tile) gets surfaced to people already shopping.
const PRODUCTS = [
  { name: "Lo-fi Pack", price: "$18", tint: "bg-amber-100" },
  { name: "UI Kit", price: "$42", tint: "bg-acid/15", you: true },
  { name: "Icon Set", price: "$12", tint: "bg-rose-100" },
  { name: "Preset Pack", price: "$24", tint: "bg-sky-100" },
];

export default function FeedMock() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-3">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
          Discover
        </span>
        <span className="rounded-full bg-acid/10 px-1.5 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-widest text-acid">
          Trending
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {PRODUCTS.map((p) => (
          <div
            key={p.name}
            className={`rounded-lg border p-1.5 ${
              p.you ? "border-acid bg-acid/[0.04]" : "border-neutral-200 bg-white"
            }`}
          >
            <div className={`relative mb-1.5 aspect-[5/3] rounded-md ${p.tint}`}>
              {p.you && (
                <span className="absolute right-1 top-1 rounded bg-acid px-1 py-px font-mono text-[7px] font-bold uppercase tracking-wide text-white">
                  You
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-1">
              <span className="truncate text-[10px] font-bold text-neutral-800">
                {p.name}
              </span>
              <span className="shrink-0 font-mono text-[10px] text-neutral-500">
                {p.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
