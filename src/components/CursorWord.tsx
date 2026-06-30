"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  createCursorWord,
  CURSOR_WORD_LETTER_SPACING_EM,
} from "./cursorWord/cursorWordEngine";

/*
  CursorWord — thin React wrapper around the framework-agnostic cursorWordEngine.
  It renders the accessible real text (transparent while the swarm paints) plus a
  fixed overlay canvas, then hands all three elements to the engine. All of the
  effect logic lives in ./cursorWord/cursorWordEngine.ts so it can be dropped into
  any site (see that file's header for vanilla usage).
*/

// Render the word as plain static text (skipping the swarm entirely) when the
// user prefers reduced motion. The server snapshot is false, so SSR and the
// first client render agree (no hydration mismatch); React reconciles after.
const STATIC_QUERY = "(prefers-reduced-motion: reduce)";

function useStaticWord(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(STATIC_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(STATIC_QUERY).matches,
    () => false
  );
}

interface CursorWordProps {
  word: string;
  className?: string;
  /** Cursor color: a #rrggbb hex or a CSS var like var(--color-acid). */
  cursorColor?: string;
  /**
   * Optional hard ceiling on the cursor pool. By default the engine picks a
   * device-appropriate count (denser on capable desktops, lighter on phones),
   * so leave this unset unless you need to clamp it.
   */
  count?: number;
  /** How long the word holds before each icon morph, ms. */
  assembleDelayMs?: number;
}

export default function CursorWord({
  word,
  className = "",
  cursorColor = "var(--color-acid)",
  count,
  assembleDelayMs = 3200,
}: CursorWordProps) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isStatic = useStaticWord();

  useEffect(() => {
    if (isStatic) return;
    const canvas = canvasRef.current;
    const host = hostRef.current;
    const wordEl = wordRef.current;
    if (!canvas || !host || !wordEl) return;

    const handle = createCursorWord({
      canvas,
      host,
      wordEl,
      word,
      color: cursorColor,
      maxCursors: count,
      assembleDelayMs,
    });
    return () => handle.destroy();
  }, [isStatic, word, count, assembleDelayMs, cursorColor]);

  return (
    <span
      ref={hostRef}
      className={`relative inline-block align-baseline ${className}`}
    >
      {/* Real text: kept in the layout + accessibility tree. Transparent while
          the canvas paints the cursors; visible (inherited color) under reduced
          motion (the swarm is skipped) so the headline is always readable. */}
      <span
        ref={wordRef}
        style={{
          color: isStatic ? "inherit" : "transparent",
          // Match the engine's tracking so the transparent text lines up with
          // the swarm (single source of truth in the engine).
          letterSpacing: isStatic
            ? undefined
            : `${CURSOR_WORD_LETTER_SPACING_EM}em`,
        }}
      >
        {word}
      </span>
      {!isStatic && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0"
          style={{ zIndex: 30 }}
        />
      )}
    </span>
  );
}
