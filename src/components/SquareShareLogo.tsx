interface Props {
  className?: string;
  width?: number;
  height?: number;
}

export default function SquareShareLogo({ className, width = 26, height = 26 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 7 7"
      width={width}
      height={height}
      className={className}
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {/* Three flush squares forming the L (square) */}
      <rect x="0" y="1" width="3" height="3" />
      <rect x="0" y="4" width="3" height="3" />
      <rect x="3" y="4" width="3" height="3" />
      {/* Fourth square, nudged up-right and disconnected (share) */}
      <rect x="4" y="0" width="3" height="3" />
    </svg>
  );
}
