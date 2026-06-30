// A faint dotted (or line) grid backdrop that fades out at its edges via a mask,
// the same masked-pattern idiom as .future-grid. Decorative; horizontal-only.
export default function DotGrid({
  variant = "dots",
  fade = "radial",
  className = "",
}: {
  variant?: "dots" | "lines";
  fade?: "radial" | "bottom";
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`future-dotgrid future-dotgrid--${variant} future-dotgrid--${fade} ${className}`}
    />
  );
}
