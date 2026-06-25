"use client";

import WaitlistForm from "./WaitlistForm";
import GradientText from "./GradientText";
import SideRays from "./SideRays";

const headingClasses =
  "text-5xl md:text-7xl lg:text-8xl font-black leading-[0.92] tracking-tight font-display";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-black pt-20 pb-16"
    >
      <div className="w-full max-w-3xl mx-auto px-6 text-center">
        {/* Hero heading: gradient letters with light beams clipped to the glyphs */}
        <h1 className="relative mb-6">
          {/*
            Single text layer, beams clipped to the letters:
            - isolated group that screen-blends onto the black hero, so any
              black it produces contributes nothing
            - SideRays paints the moving beams behind the text
            - the GradientText sits on a black box and multiplies over the
              beams: the box turns black (killing beams outside the glyphs)
              while the gradient letters keep the beam light inside them
          */}
          <span className="relative inline-block isolate mix-blend-screen">
            <span className="pointer-events-none absolute inset-0">
              <SideRays
                speed={0.8}
                rayColor1="#ff9900"
                rayColor2="#ffd9a0"
                intensity={2.2}
                spread={2.2}
                origin="top-right"
                tilt={-4}
                saturation={1.4}
                blend={0.6}
                falloff={1.5}
                opacity={1}
              />
            </span>
            <GradientText
              className={`relative z-10 bg-black mix-blend-multiply ${headingClasses}`}
              colors={["#ffffff", "#ffce8a", "#ff9900", "#ffce8a", "#ffffff"]}
              animationSpeed={10}
              direction="horizontal"
              yoyo
            >
              Turn Any Website
              <br />
              Into a Store.
            </GradientText>
          </span>
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
