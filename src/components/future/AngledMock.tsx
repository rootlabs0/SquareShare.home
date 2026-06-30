import type { ReactNode } from "react";

// Tilts a mockup in 3D (desktop only). Optionally fades one edge into the card
// via a mask; pass fade="none" to leave the mockup crisp (e.g. when the card
// itself supplies the edge shadow). On small screens the child renders upright.
export default function AngledMock({
  children,
  fade = "bottom-right",
  className = "",
}: {
  children: ReactNode;
  fade?: "bottom" | "bottom-right" | "none";
  className?: string;
}) {
  const fadeClass =
    fade === "none"
      ? ""
      : fade === "bottom-right"
        ? "future-angled--br"
        : "future-angled--b";

  return (
    <div className="future-tilt-wrap">
      <div className={`future-tilt ${fadeClass} ${className}`}>{children}</div>
    </div>
  );
}
