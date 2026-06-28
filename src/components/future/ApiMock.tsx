// Custom UI for "The API": just the embed snippet with a comment, in a dark box.
export default function ApiMock() {
  return (
    <div className="border border-white/10 bg-neutral-900 px-4 py-3.5">
      <div className="space-y-1 font-mono text-[11px] leading-relaxed [font-variant-ligatures:none]">
        <p className="text-white/35">&lt;!-- paste this once, anywhere --&gt;</p>
        <p className="text-white/45">
          &lt;<span className="text-acid">script</span>{" "}
          <span className="text-white/55">src</span>=
          <span className="text-emerald-400">
            &quot;squareshare.to/embed.js&quot;
          </span>
          &gt;&lt;/<span className="text-acid">script</span>&gt;
        </p>
        <p className="text-white/45">
          &lt;<span className="text-acid">div</span>{" "}
          <span className="text-white/55">id</span>=
          <span className="text-emerald-400">&quot;sq-store&quot;</span>&gt;&lt;/
          <span className="text-acid">div</span>&gt;
        </p>
      </div>
    </div>
  );
}
