"use client";

import WaitlistForm from "./WaitlistForm";
import GradientText from "./GradientText";
import SideRays from "./SideRays";

const headingClasses =
  "text-5xl md:text-7xl lg:text-8xl font-black leading-[0.92] tracking-tight font-display " +
  // font-black is already the heaviest weight, so thicken the gradient-clipped
  // glyphs further with a matching stroke painted behind the fill.
  "[&_.text-content]:[paint-order:stroke_fill] [&_.text-content]:[-webkit-text-stroke:2px_#f3e8ff]";

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
            {/* Beam field clipped to the text box. Two crossed linear
                gradients feather every edge evenly (a radial mask leaves the
                straight edges brighter than the corners, which shows as a
                faint rectangle), so the beams fade out before the box border. */}
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)",
                maskComposite: "intersect",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)",
                WebkitMaskComposite: "source-in",
              }}
            >
              <SideRays
                speed={1.4}
                rayColor1="#a855f7"
                rayColor2="#ede4ff"
                intensity={6.5}
                spread={3}
                origin="top-right"
                tilt={-8}
                sweep={22}
                sweepSpeed={0.6}
                saturation={1.4}
                blend={0.5}
                falloff={0.8}
                opacity={1}
              />
            </span>
            <GradientText
              className={`relative z-10 bg-black mix-blend-multiply ${headingClasses}`}
              colors={["#f3e8ff", "#ffffff", "#e9d5ff", "#ffffff", "#f3e8ff"]}
              animationSpeed={8}
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
