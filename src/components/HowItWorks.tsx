"use client";

import { STEPS } from "./howItWorks/data";
import StepRow from "./howItWorks/StepRow";
import BuildEmbedHandoff from "./howItWorks/BuildEmbedHandoff";
import PixelReveal from "./PixelReveal";

// The "How It Works" section — a product-led walkthrough. Replaces the old
// generic feature-card BentoGrid. Keeps id="features" so the header/footer
// "How It Works" anchors still resolve. Lives between a dark section (via the
// dark→light pixel transition) and the white founder section, so it stays light
// at both seams.
export default function HowItWorks() {
  return (
    <section
      id="features"
      className="relative scroll-mt-24 overflow-x-clip bg-[#F9F9F9] pb-24 md:pb-32"
    >
      {/* Section header, hidden behind a dark pixel curtain that meets the dark
          section above and dissolves on scroll-in to reveal the heading. */}
      <PixelReveal direction="dark-to-light">
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 font-mono text-xs uppercase tracking-widest text-neutral-500">
              How It Works
            </span>
            <h2 className="mt-5 font-display text-4xl font-black leading-tight text-neutral-900 md:text-6xl">
              From shelf to sale
              <br />
              <span className="text-neutral-400">in three steps.</span>
            </h2>
          </div>
        </div>
      </PixelReveal>

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
