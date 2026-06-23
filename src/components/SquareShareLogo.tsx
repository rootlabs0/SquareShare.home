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
      {/* Bottom-right block */}
      <rect x="4" y="5" width="2" height="2" fill="var(--color-acid)" />
      {/* Top-right accent */}
      <rect x="4" y="0" width="2" height="3" fill="#0a0a0a" />
    </svg>
  );
}
