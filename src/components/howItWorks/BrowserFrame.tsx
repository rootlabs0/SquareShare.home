"use client";

import { Lock } from "lucide-react";

// A static, decorative browser window used to show the Square Share widget
// living inside someone else's external website. Monochrome chrome (neutral
// window dots, a URL pill). Purely a picture: pointer-events-none, aria-hidden
// ornaments under one labelled wrapper.
export default function BrowserFrame({
  url = "fieldandform.com",
  label,
  children,
}: {
  url?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className="pointer-events-none select-none overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.18)]"
    >
      <div aria-hidden="true">
        {/* Browser top bar */}
        <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
          </div>
          <div className="flex h-7 flex-1 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3">
            <Lock size={11} className="shrink-0 text-neutral-400" />
            <span className="truncate text-xs text-neutral-500">{url}</span>
          </div>
        </div>

        {/* Viewport (the external website) */}
        <div>{children}</div>
      </div>
    </div>
  );
}
