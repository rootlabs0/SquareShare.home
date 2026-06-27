// Custom UI for "Docs & support": a real doc page in the light mockup style.
// Actual written steps you read and act on yourself, no waiting on support.
export default function DocsMock() {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="flex items-end gap-1 border-b border-neutral-200 bg-neutral-50 px-2 pt-2">
        <span className="rounded-t-md border border-b-0 border-neutral-200 bg-white px-2.5 py-1.5 font-mono text-[10px] font-medium text-neutral-700">
          Quickstart
        </span>
        <span className="px-2.5 py-1.5 font-mono text-[10px] text-neutral-400">
          API
        </span>
      </div>
      <div className="px-4 py-3.5">
        <h5 className="font-display text-sm font-black leading-tight text-neutral-900">
          Embed in 60 seconds
        </h5>
        <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-600">
          Add one script tag to your page, then drop a container where the store
          should render.
        </p>
        <p className="mt-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-acid">
          1. Add the snippet
        </p>
        <div className="mt-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1.5 font-mono text-[10px] text-neutral-700 [font-variant-ligatures:none]">
          &lt;<span className="text-acid">script</span>{" "}
          <span className="text-neutral-500">src</span>=
          <span className="text-emerald-600">&quot;...embed.js&quot;</span>&gt;
        </div>
        <p className="mt-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-acid">
          2. Go live
        </p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-600">
          Pick products from your dashboard. Changes appear instantly, no
          redeploy.
        </p>
      </div>
    </div>
  );
}
