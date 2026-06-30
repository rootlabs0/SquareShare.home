import type { CodeToken, TerminalLine } from "./data";

// Token colors for the embed snippet. Kept mostly neutral — only strings carry a
// muted green, the rest is white at varying opacity (no purple).
const TOKEN_CLASS: Record<NonNullable<CodeToken["c"]>, string> = {
  tag: "text-white/80",
  attr: "text-white/55",
  str: "text-emerald-300/80",
};

// A dark terminal/window mockup for "The API": neutral traffic-light dots, a
// title bar, then the embed snippet, a prompt, and a "Building…" status with a
// blinking caret (the caret blink is CSS, gated by reduced motion).
export default function TerminalFrame({
  title = "embed.js",
  lines,
  className = "",
}: {
  title?: string;
  lines: TerminalLine[];
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label="Embedding a Square Share store with one snippet"
      className={`pointer-events-none select-none overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.8)] ${className}`}
    >
      <div aria-hidden="true">
        {/* Window top bar */}
        <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <span className="font-mono text-[11px] tracking-wide text-white/35">
            {title}
          </span>
        </div>

        {/* Body */}
        <div className="space-y-1.5 px-4 py-4 font-mono text-[11px] leading-relaxed [font-variant-ligatures:none]">
          {lines.map((line, i) => {
            if (line.kind === "comment") {
              return (
                <p key={i} className="text-white/30">
                  {line.text}
                </p>
              );
            }
            if (line.kind === "code") {
              return (
                <p key={i} className="text-white/45">
                  {line.tokens.map((tok, j) => (
                    <span key={j} className={tok.c ? TOKEN_CLASS[tok.c] : ""}>
                      {tok.t}
                    </span>
                  ))}
                </p>
              );
            }
            if (line.kind === "prompt") {
              return (
                <p key={i} className="pt-1 text-white/55">
                  <span className="text-white/35">&gt;</span> {line.text}
                </p>
              );
            }
            // status
            return (
              <p key={i} className="text-white/50">
                {line.text}
                <span className="future-caret ml-0.5 inline-block">▍</span>
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
