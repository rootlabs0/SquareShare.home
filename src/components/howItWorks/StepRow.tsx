"use client";

import { motion } from "framer-motion";
import type { Step } from "./data";
import { MOCKUPS } from "./mockups";

// One process step: a two-column row pairing explainer copy with a product
// mockup. Alternates sides on desktop (`reverse`); on mobile it always stacks
// text-then-mockup so the explanation leads.
export default function StepRow({
  step,
  reverse,
}: {
  step: Step;
  reverse: boolean;
}) {
  const Mockup = MOCKUPS[step.mockup as keyof typeof MOCKUPS];
  if (!Mockup) return null;

  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      {/* Text */}
      <motion.div
        className={reverse ? "lg:order-2" : "lg:order-1"}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <span className="block font-display text-6xl font-black leading-none text-neutral-200 md:text-7xl">
          {step.num}
        </span>
        <h3 className="mt-4 font-display text-3xl font-black leading-tight text-neutral-900 md:text-4xl">
          {step.title}
        </h3>
        <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-600">
          {step.body}
        </p>
      </motion.div>

      {/* Mockup */}
      <motion.div
        className={`${
          reverse ? "lg:order-1" : "lg:order-2"
        } mx-auto w-full max-w-xl lg:mx-0`}
        initial={{ opacity: 0, y: 40, x: reverse ? -20 : 20 }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Mockup />
      </motion.div>
    </div>
  );
}
