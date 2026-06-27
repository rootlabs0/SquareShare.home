import { STOREFRONT_SLOTS } from "./data";

// The built, customizable storefront: a fixed 4x3 bento of product photos.
// Square cells + square photos => nothing is cropped. Fills its parent's width
// at a 4:3 aspect, so it can be flown/scaled as a single unit.
export default function StorefrontGrid({ className = "" }: { className?: string }) {
  return (
    <div
      className={`aspect-[4/3] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.18)] ${className}`}
    >
      <div className="grid h-full grid-cols-4 grid-rows-3 gap-2">
        {STOREFRONT_SLOTS.map((s) => (
          <div
            key={s.id}
            style={{
              gridColumn: `${s.col} / span ${s.cw}`,
              gridRow: `${s.row} / span ${s.rh}`,
            }}
            className="relative overflow-hidden rounded-lg border border-neutral-200/70 bg-neutral-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.img}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
