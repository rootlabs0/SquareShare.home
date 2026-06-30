import type { ReactNode } from "react";
import Glow from "./Glow";

// The "glow behind a mockup" primitive: a positioned wrapper that drops a Glow
// at the back and renders its children above it.
export default function GlowMock({
  children,
  tone = "neutral",
  position,
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent";
  position?: { x?: string; y?: string };
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Glow tone={tone} position={position} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
