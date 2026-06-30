"use client";

import WaitlistForm from "./WaitlistForm";
import CursorWord from "./CursorWord";

// Looser line-height on mobile so the over-sized "Store" (and its tall storefront
// icon, which rises above the cap height) clears the line above it; tight on
// desktop where "Into a Store" sits on one line.
const headingClasses =
  "text-6xl md:text-8xl lg:text-9xl font-black leading-[1.16] md:leading-[0.92] tracking-tight font-display";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-black pt-20 pb-16"
    >
      <div className="w-full max-w-5xl mx-auto px-6 text-center">
        {/* Hero heading: plain white text, except the final word "Store" which
            is spelled by a swarm of customer cursors (see CursorWord). */}
        <h1 className={`relative mb-6 text-white ${headingClasses}`}>
          Turn Any Website
          <br />
          Into a{" "}
          {/* Bigger than the rest of the headline on mobile (where it renders
              as static text on its own line); matches the headline size at
              md/lg where it's the cursor swarm. */}
          <CursorWord
            word="Store"
            // How long "Store" stays as readable text before it morphs into the
            // storefront icon (the icon is an occasional flourish, so hold a while).
            assembleDelayMs={7000}
            cursorColor="var(--color-acid)"
            className="text-8xl lg:text-9xl"
          />
        </h1>

        <p className="text-lg md:text-xl text-white/50 mb-10 max-w-xl mx-auto">
          Embed a portable storefront anywhere. Bypass platform lock-in. Own
          your revenue stream.
        </p>

        <WaitlistForm variant="hero" />
      </div>
    </section>
  );
}
