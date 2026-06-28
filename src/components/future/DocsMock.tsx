import type { ReactNode } from "react";

// Custom UI for "Docs & support": a fanned stack of slim, tall doc pages in an
// editorial, monochrome style (no accent colors, just type and hairlines). The
// front page is fully readable; the two behind fan out to the left and show
// their own text peeking past the edge.
function BackSheet({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden
      className={`absolute inset-0 origin-bottom overflow-hidden rounded-lg border border-neutral-200 px-4 py-4 ${className}`}
    >
      {children}
    </div>
  );
}

export default function DocsMock() {
  return (
    <div className="relative mx-auto w-[13rem] max-w-full">
      {/* Two sheets fanned out to the left, each tilted more, with their own text. */}
      <BackSheet className="-translate-x-6 -rotate-[14deg] bg-neutral-100">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
          Guides
        </p>
        <h5 className="mt-2 font-display text-[15px] font-black leading-tight text-neutral-500">
          Handle webhooks
        </h5>
        <div className="mt-2.5 h-px w-8 bg-neutral-200" />
        <p className="mt-3 text-[11px] leading-relaxed text-neutral-400">
          Get notified on every sale and keep your own systems in sync.
        </p>
      </BackSheet>
      <BackSheet className="-translate-x-3 -rotate-[7deg] bg-neutral-50">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
          Guides
        </p>
        <h5 className="mt-2 font-display text-[15px] font-black leading-tight text-neutral-600">
          Customize the look
        </h5>
        <div className="mt-2.5 h-px w-8 bg-neutral-200" />
        <p className="mt-3 text-[11px] leading-relaxed text-neutral-400">
          Match the store to your brand with a few CSS variables.
        </p>
      </BackSheet>

      {/* Front page: sits to the right, tilted slightly, with the full content. */}
      <div className="relative min-h-[17.5rem] origin-bottom rotate-[3deg] overflow-hidden rounded-lg border border-neutral-200 bg-white px-4 py-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
          Docs
        </p>
        <h5 className="mt-2 font-display text-[15px] font-black leading-tight text-neutral-900">
          Embed in 60 seconds
        </h5>
        <div className="mt-2.5 h-px w-8 bg-neutral-300" />
        <p className="mt-3 text-[11px] leading-relaxed text-neutral-600">
          Add one script tag to your page, then drop a container where the store
          should render.
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <p className="text-[11px] font-semibold text-neutral-900">
              <span className="text-neutral-400">1.</span> Add the snippet
            </p>
            <div className="mt-1.5 border-l border-neutral-300 pl-2.5 font-mono text-[10px] leading-relaxed text-neutral-500 [font-variant-ligatures:none]">
              &lt;script src=&quot;...embed.js&quot;&gt;
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-neutral-900">
              <span className="text-neutral-400">2.</span> Go live
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-neutral-600">
              Pick products from your dashboard. Changes appear instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
