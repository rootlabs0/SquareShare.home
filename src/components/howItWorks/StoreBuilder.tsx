"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimate, useInView, useReducedMotion } from "framer-motion";
import CursorPointer from "./CursorPointer";
import { STOREFRONT_SLOTS } from "./data";

const CURSOR_BLUE = "#2563eb";
const GAP = 8; // matches the grid's gap-2
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
type Ease = "easeInOut" | "easeOut" | "easeIn" | "linear";

type Slot = (typeof STOREFRONT_SLOTS)[number];
// Tiles that get "resized" during the build (the 2x2 hero + featured tiles).
const isBig = (s: Slot) => s.cw > 1 || s.rh > 1;
// Where the cursor grips a carried item, as a fraction of its size.
const GRAB_FX = 0.28;
const GRAB_FY = 0.24;

// Step 01: a blue cursor builds the customizable storefront. It drags each
// product in from a tray below the grid and drops it into a cell, resizing the
// hero and featured tiles right after dropping them to show the grid is
// editable. The finished state is visually identical to <StorefrontGrid />, so
// the 01 -> 02 handoff can swap to the travelling copy without a seam.
export default function StoreBuilder({
  onBuildComplete,
}: {
  onBuildComplete?: () => void;
}) {
  const [scope, animate] = useAnimate();
  const inView = useInView(scope, { amount: 0.4, once: true });
  const reduced = useReducedMotion();
  const cursorRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const floatImgRef = useRef<HTMLImageElement>(null);
  const onDoneRef = useRef(onBuildComplete);
  const [placed, setPlaced] = useState<Set<string>>(new Set());
  const [grown, setGrown] = useState<Set<string>>(new Set());

  useEffect(() => {
    onDoneRef.current = onBuildComplete;
  }, [onBuildComplete]);

  useEffect(() => {
    if (reduced || !inView) return;
    const cursor = cursorRef.current;
    const float = floatRef.current;
    const floatImg = floatImgRef.current;
    const root = scope.current as HTMLElement | null;
    if (!cursor || !float || !floatImg || !root) return;
    let cancelled = false;

    // Tile box (cell) relative to the scope, read straight from the DOM so the
    // cursor lands exactly on it regardless of responsive sizing.
    const rectOf = (id: string) => {
      const el = root.querySelector(`[data-id="${id}"]`);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const b = root.getBoundingClientRect();
      return {
        cx: r.left - b.left + r.width / 2,
        cy: r.top - b.top + r.height / 2,
        rx: r.left - b.left + r.width,
        by: r.top - b.top + r.height,
        w: r.width,
        h: r.height,
      };
    };

    let curX = 0;
    let curY = 0;
    // Move the cursor so its tip (~4,3px in from the wrapper origin) lands at px,py.
    const cursorTo = async (
      px: number,
      py: number,
      opts: { duration?: number; ease?: Ease; opacity?: number } = {}
    ) => {
      curX = px - 4;
      curY = py - 3;
      const duration = opts.duration ?? 0.3;
      const ease = opts.ease ?? "easeInOut";
      if (opts.opacity !== undefined) {
        await animate(
          cursor,
          { x: curX, y: curY, opacity: opts.opacity },
          { duration, ease }
        );
      } else {
        await animate(cursor, { x: curX, y: curY }, { duration, ease });
      }
    };
    const press = () => animate(cursor, { scale: 0.82 }, { duration: 0.07 });
    const release = () => animate(cursor, { scale: 1 }, { duration: 0.09 });

    const run = async () => {
      setPlaced(new Set());
      setGrown(new Set());
      const rb = root.getBoundingClientRect();
      const storeH = rb.height;
      await animate(cursor, { x: 0, y: 0, opacity: 0, scale: 1 }, { duration: 0 });
      await animate(float, { opacity: 0 }, { duration: 0 });
      await wait(250);
      if (cancelled) return;

      let first = true;
      for (const s of STOREFRONT_SLOTS) {
        if (cancelled) return;
        const r = rectOf(s.id);
        if (!r) continue;
        const S = r.w; // 1x1 cell size (square)

        // Park the carried item in the tray just below the grid, under the
        // target column, while it is still invisible.
        const trayX = Math.max(S / 2 + 2, Math.min(rb.width - S / 2 - 2, r.cx));
        const trayY = storeH + S * 0.55;
        floatImg.src = s.img;
        float.style.width = `${S}px`;
        float.style.height = `${S}px`;
        await animate(
          float,
          { x: trayX - S / 2, y: trayY - S / 2 },
          { duration: 0 }
        );

        // Cursor travels down to the tray to pick the item up.
        await cursorTo(trayX + (GRAB_FX - 0.5) * S, trayY + (GRAB_FY - 0.5) * S, {
          duration: first ? 0.34 : 0.22,
          opacity: 1,
        });
        first = false;
        if (cancelled) return;
        await animate(float, { opacity: 1 }, { duration: 0.1 });
        await press();

        // Drag the item up into its cell (item + cursor locked together).
        curX = r.cx + (GRAB_FX - 0.5) * S - 4;
        curY = r.cy + (GRAB_FY - 0.5) * S - 3;
        await Promise.all([
          animate(
            float,
            { x: r.cx - S / 2, y: r.cy - S / 2 },
            { duration: 0.26, ease: "easeInOut" }
          ),
          animate(
            cursor,
            { x: curX, y: curY },
            { duration: 0.26, ease: "easeInOut" }
          ),
        ]);
        if (cancelled) return;

        // Drop: reveal the real grid tile and cross-fade the carried copy out.
        setPlaced((prev) => {
          const n = new Set(prev);
          n.add(s.id);
          return n;
        });
        await Promise.all([
          animate(float, { opacity: 0 }, { duration: 0.12 }),
          release(),
        ]);
        await wait(30);

        // Resize the hero / featured tile right after dropping it (editable).
        if (isBig(s)) {
          if (cancelled) return;
          const rr = rectOf(s.id);
          if (rr) {
            await cursorTo(rr.rx, rr.by, { duration: 0.24 });
            if (cancelled) return;
            await press();
            setGrown((prev) => {
              const n = new Set(prev);
              n.add(s.id);
              return n;
            });
            // Pull the corner outward by one cell each way as the tile grows.
            await cursorTo(rr.rx + rr.w + GAP, rr.by + rr.h + GAP, {
              duration: 0.32,
            });
            await release();
            await wait(90);
          }
        }
      }

      if (cancelled) return;
      onDoneRef.current?.(); // store is fully built; the drag may take over now
      // Let go: glide away and fade out.
      await animate(
        cursor,
        { x: curX + 30, y: curY - 24, opacity: 0, scale: 0.8 },
        { duration: 0.45, ease: "easeOut" }
      );
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [inView, reduced, animate, scope]);

  const show = (id: string) => reduced || placed.has(id);
  const full = (id: string) => reduced || grown.has(id);

  return (
    <div ref={scope} className="relative w-full">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.18)]">
        <div className="relative h-full">
          {/* Grid guides, so the cursor looks like it places items onto a grid.
              Filled tiles sit on top and cover them; at the end every cell is
              covered, matching the seamless <StorefrontGrid /> handoff. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-2"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50"
              />
            ))}
          </div>
          <div className="relative grid h-full grid-cols-4 grid-rows-3 gap-2">
          {STOREFRONT_SLOTS.map((s) => {
            const big = isBig(s);
            const cw = big && !full(s.id) ? 1 : s.cw;
            const rh = big && !full(s.id) ? 1 : s.rh;
            return (
              <motion.div
                key={s.id}
                data-id={s.id}
                layout
                initial={false}
                animate={{ opacity: show(s.id) ? 1 : 0 }}
                transition={{
                  layout: { duration: 0.5, ease: "easeInOut" },
                  opacity: { duration: 0.12, ease: "easeOut" },
                }}
                style={{
                  gridColumn: `${s.col} / span ${cw}`,
                  gridRow: `${s.row} / span ${rh}`,
                }}
                className="relative"
              >
                <motion.div
                  layout
                  transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
                  className="h-full w-full overflow-hidden rounded-lg border border-neutral-200/70 bg-neutral-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.img}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              </motion.div>
            );
          })}
          </div>
        </div>
      </div>

      {/* The item currently being carried in from the tray. */}
      <div
        ref={floatRef}
        style={{ opacity: 0 }}
        className="pointer-events-none absolute left-0 top-0 z-20 overflow-hidden rounded-lg border border-neutral-200/70 bg-neutral-100 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.3)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={floatImgRef}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>

      {/* The build cursor. */}
      <div
        ref={cursorRef}
        style={{ opacity: 0 }}
        className="pointer-events-none absolute left-0 top-0 z-30"
      >
        <CursorPointer color={CURSOR_BLUE} />
      </div>
    </div>
  );
}
