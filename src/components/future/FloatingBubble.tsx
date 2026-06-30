import type { LucideIcon } from "lucide-react";

// A chat/search chip in the neutral card token. The caller positions it
// (className) and can stagger the idle bob (delay). The bob is a CSS animation
// gated by prefers-reduced-motion (see .future-bubble).
export default function FloatingBubble({
  icon: Icon,
  title,
  body,
  delay = 0,
  className = "",
}: {
  icon?: LucideIcon;
  title: string;
  body?: string;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      style={delay ? { animationDelay: `${delay}s` } : undefined}
      className={`future-bubble flex items-center gap-3 rounded-2xl border border-white/10 bg-neutral-900/85 px-4 py-3 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md ${className}`}
    >
      {Icon ? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-white/70">
          <Icon size={17} strokeWidth={2} />
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="font-display text-sm font-bold leading-tight text-white">
          {title}
        </p>
        {body ? (
          <p className="mt-0.5 text-xs leading-snug text-white/55">{body}</p>
        ) : null}
      </div>
    </div>
  );
}
