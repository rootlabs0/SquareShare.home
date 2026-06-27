"use client";

// A figma-style cursor: a filled arrow pointer with an optional name tag.
// Presentational only. Parents wrap this in a motion element and animate its
// position. The arrow tip sits near the element's top-left corner, so translate
// a wrapper to (targetX - 3, targetY - 3) to point at a target.
export default function CursorPointer({
  label,
  color = "#171717",
  className = "",
}: {
  label?: string;
  color?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
        aria-hidden="true"
      >
        <path
          d="M4 2.2 L4 18.8 L8.3 14.6 L11.1 21 L13.8 19.8 L11 13.5 L16.7 13.2 Z"
          fill={color}
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      {label && (
        <span
          className="absolute left-4 top-5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm"
          style={{ backgroundColor: color }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
