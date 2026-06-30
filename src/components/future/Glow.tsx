// A soft glow behind a mockup, kept inside its card. Neutral (white) by default
// so the section stays mostly monochrome; tone="accent" is the single purple
// moment, used once behind the gallery. Pure CSS (radial-gradient + blur).
export default function Glow({
  tone = "neutral",
  position,
  className = "",
}: {
  tone?: "neutral" | "accent";
  position?: { x?: string; y?: string };
  className?: string;
}) {
  const style =
    position?.x || position?.y
      ? ({
          "--glow-x": position.x ?? "50%",
          "--glow-y": position.y ?? "55%",
        } as React.CSSProperties)
      : undefined;

  return (
    <div
      aria-hidden="true"
      style={style}
      className={`future-glow ${tone === "accent" ? "future-glow--accent" : ""} ${className}`}
    />
  );
}
