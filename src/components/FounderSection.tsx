"use client";

import { motion } from "framer-motion";
import WaitlistForm from "./WaitlistForm";

export default function FounderSection() {
  return (
    <section
      id="founder"
      className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden"
    >
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        {/* Founder Story */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-neutral-900 font-mono text-sm tracking-widest uppercase mb-6">
            Our Story
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-neutral-900 leading-tight mb-8 font-display">
            Built by Founders Who
            <br />
            <span className="text-neutral-400">Refuse to Wait.</span>
          </h2>
          <div className="space-y-6 text-lg md:text-xl text-neutral-600 leading-relaxed">
            <p>
              We&apos;re a team of 16-year-old builders who got tired of watching
              creators get locked into platforms that take 30% cuts and own the
              customer relationship.
            </p>
            <p>
              Square Share was born from a simple frustration: why can&apos;t you sell
              your products wherever your audience already is? Why are we still
              redirecting people to generic storefronts that all look the same?
            </p>
            <p>
              We&apos;re building the infrastructure that lets anyone turn any
              website, blog, or portfolio into a fully functional store, with
              one embed snippet and zero platform dependencies.
            </p>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent mb-20" />

        {/* Final CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-3xl md:text-5xl font-black text-neutral-900 mb-4 font-display">
            Be First in Line.
          </h3>
          <p className="text-lg text-neutral-500 mb-10 max-w-xl mx-auto">
            Join the waitlist and get early access when we launch.
            No spam. Just one email when it&apos;s go time.
          </p>
          <WaitlistForm variant="footer" />
        </motion.div>
      </div>
    </section>
  );
}
