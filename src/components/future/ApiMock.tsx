// Custom UI for "The API": the embed snippet as a light code editor (tabs,
// syntax colour, a blinking cursor) in the How It Works mockup style.
export default function ApiMock() {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="flex items-end gap-1 border-b border-neutral-200 bg-neutral-50 px-2 pt-2">
        <span className="rounded-t-md border border-b-0 border-neutral-200 bg-white px-2.5 py-1.5 font-mono text-[10px] font-medium text-neutral-700">
          index.html
        </span>
        <span className="px-2.5 py-1.5 font-mono text-[10px] text-neutral-400">
          store.js
        </span>
      </div>
      <div className="space-y-1 px-3.5 py-3 font-mono text-[11px] leading-relaxed [font-variant-ligatures:none]">
        <p className="text-neutral-400">&lt;!-- your store, live --&gt;</p>
        <p className="text-neutral-400">
          &lt;<span className="text-acid">script</span>{" "}
          <span className="text-neutral-500">src</span>=
          <span className="text-emerald-600">
            &quot;squareshare.to/embed.js&quot;
          </span>
          &gt;&lt;/<span className="text-acid">script</span>&gt;
        </p>
        <p className="text-neutral-400">
          &lt;<span className="text-acid">div</span>{" "}
          <span className="text-neutral-500">id</span>=
          <span className="text-emerald-600">&quot;sq-store&quot;</span>&gt;&lt;/
          <span className="text-acid">div</span>&gt;
        </p>
        <p>
          <span className="future-caret inline-block h-3 w-[7px] translate-y-[1px] bg-acid" />
        </p>
      </div>
    </div>
  );
}
