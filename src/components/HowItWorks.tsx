"use client";

import { STEPS } from "./howItWorks/data";
import StepRow from "./howItWorks/StepRow";
import BuildEmbedHandoff from "./howItWorks/BuildEmbedHandoff";
import PixelEdge from "./PixelEdge";

// The "How It Works" section — a product-led walkthrough. Replaces the old
// generic feature-card BentoGrid. Keeps id="features" so the header/footer
// "How It Works" anchors still resolve. Lives between a dark section and the
// white founder section; the dark→light seam at the top is broken up by an
// irregular pixel border (PixelEdge) instead of a straight line.
export default function HowItWorks() {
  return (
    <section
      id="features"
      className="relative scroll-mt-24 overflow-x-clip bg-[#F9F9F9] pb-24 md:pb-32"
    >
      {/* Irregular black "pixel" border bridging the dark section above: the
          black breaks into a jagged run of squares as it meets the light bg. */}
      <PixelEdge />
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-20 md:pb-24 md:pt-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-5xl font-black leading-[1.05] text-neutral-900 md:text-8xl">
            It only takes <span className="text-neutral-400">3&nbsp;steps</span>
          </h2>
        </div>
      </div>

      {/* Steps 01 + 02: a blue cursor drags the built store from step 01's grid
          into step 02's example website as you scroll. */}
      <BuildEmbedHandoff />

      {/* Step 03 */}
      <div className="mx-auto mt-24 max-w-6xl px-6 md:mt-32">
        <StepRow step={STEPS[2]} reverse={false} />
      </div>
    </section>
  );
}
