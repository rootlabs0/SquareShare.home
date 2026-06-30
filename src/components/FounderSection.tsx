"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import WaitlistForm from "./WaitlistForm";

export default function FounderSection() {
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      id="founder"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white"
    >
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-24">
        <motion.div
          className="mb-20"
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={reduce ? { duration: 0 } : { duration: 0.8 }}
        >
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-neutral-400">
            Our Story
          </p>

          <h2 className="mb-10 font-display text-4xl font-black leading-tight text-neutral-900 md:text-6xl">
            About us
          </h2>

          <div className="max-w-2xl text-lg leading-relaxed text-neutral-600 md:text-xl">
            {/* Always-visible intro */}
            <div className="space-y-6">
              <p>
                We don&apos;t think every creator needs another website. The
                internet is full of original work stuck inside the same handful
                of templates, and we think that&apos;s backwards.
              </p>
              <p>
                Where you sell should feel as much like yours as what
                you&apos;re selling. That belief is the whole reason Square Share
                exists.
              </p>
            </div>

            {/* Collapsible continuation */}
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="more"
                  className="overflow-hidden"
                  initial={reduce ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="space-y-6 pt-6">
                    <p>
                      We&apos;re four sixteen-year-olds from Europe. We&apos;re
                      building Square Share because we&apos;d rather make
                      something than just talk about making something. A normal
                      job, the safe corporate route, none of that does much for
                      us. We&apos;re happiest when we&apos;re actually building,
                      even when it means getting things wrong and starting over.
                      So that&apos;s what we&apos;re doing.
                    </p>
                    <p>
                      And we build it all in the open, the way we&apos;ve built
                      everything else. As we go, we&apos;ll show you the wins and
                      the broken bits and whatever we figure out from both. Some
                      things we&apos;ll nail on the first try. Others we&apos;ll
                      tear down and rebuild because the first version was wrong.
                      That&apos;s part of making something worth using, and
                      it&apos;s how we want the people backing us to see the work
                      as it really happens.
                    </p>
                    <p>
                      Behind it is a small team with a big ambition: to make
                      selling online feel effortless for the next generation of
                      creators. If Square Share saves an artist from fiddling
                      with settings so they can get back to their actual work,
                      we&apos;re building the right thing. And we&apos;re only
                      getting started.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              // Form-filler browser extensions inject an `fdprocessedid` attribute
              // onto buttons/inputs after SSR, which trips React's hydration check.
              // Suppress that benign attribute mismatch (same as WaitlistForm).
              suppressHydrationWarning
              className="group mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-neutral-900"
            >
              {expanded ? "Read less" : "Read more"}
              <svg
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-300",
                  expanded ? "rotate-180" : "group-hover:animate-arrow-nudge"
                )}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="mb-20 h-px w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />

        {/* Final CTA */}
        <motion.div
          className="text-center"
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={reduce ? { duration: 0 } : { duration: 0.8, delay: 0.2 }}
        >
          <h3 className="mb-4 font-display text-3xl font-black text-neutral-900 md:text-5xl">
            Be First in Line.
          </h3>
          <p className="mx-auto mb-10 max-w-xl text-lg text-neutral-500">
            Join the waitlist and get early access when we launch. Don't worry no spam. Just
            one email when it&apos;s go time.
          </p>
          <WaitlistForm variant="footer" />
        </motion.div>
      </div>
    </section>
  );
}
