interface Props {
  className?: string;
  width?: number;
  height?: number;
}

export default function SquareShareLogo({ className, width = 28, height = 32 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 6 7"
      width={width}
      height={height}
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {/* Left column — full height */}
      <rect x="0" y="0" width="4" height="7" fill="var(--color-acid)" />
      {/* Bottom-right foot — fills up to the notch */}
      <rect x="4" y="3" width="2" height="4" fill="var(--color-acid)" />
      {/* Top-right accent block */}
      <rect x="4" y="0" width="2" height="2" fill="#0a0a0a" />
      {/* Accent step beside the notch */}
      <rect x="5" y="2" width="1" height="1" fill="#0a0a0a" />
    </svg>
  );
}
