"use client";

import { motion } from "framer-motion";

export default function PurposeSection() {
  return (
    <section
      id="purpose"
      className="relative bg-black py-28 md:py-40 overflow-hidden"
    >
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.p
          className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase text-white/30 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          Our Purpose
        </motion.p>
        <motion.h2
          className="gradient-wave-text font-display text-3xl md:text-5xl lg:text-6xl font-black leading-[1.15] tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          We exist to give every creator the power to sell anywhere,
          on their own terms.
        </motion.h2>
      </div>
    </section>
  );
}
