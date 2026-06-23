"use client";

import Link from "next/link";
import { Store, Heart } from "lucide-react";
import PixelGrid from "./PixelGrid";

const footerLinks = [
  { label: "How It Works", href: "#features" },
  { label: "Our Story", href: "#founder" },
  { label: "Join Waitlist", href: "#hero" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate min-h-screen bg-black border-t border-white/10 overflow-hidden">
      {/* Interactive pixel grid — lights up in acid near the cursor */}
      <PixelGrid color="#ff9900" className="absolute inset-0 z-0" />

      {/* Subtle seam fade so the brand row stays crisp against the section above */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 bg-gradient-to-b from-black to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24 pb-10">
        {/* Top row: brand + nav */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <a
              href="#hero"
              className="group inline-flex items-center gap-2.5"
              aria-label="Square Share home"
            >
              <span className="flex h-8 w-8 items-center justify-center bg-acid text-black transition-colors duration-200 group-hover:bg-acid-hover">
                <Store size={18} strokeWidth={2.5} />
              </span>
              <span className="text-lg font-black uppercase tracking-tighter text-white">
                Square Share
              </span>
            </a>
            <p className="mt-5 text-sm leading-relaxed text-white/40">
              Turn any website into a store. Embed a portable storefront
              anywhere and own your revenue stream.
            </p>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
            <nav className="flex flex-col gap-3" aria-label="Explore">
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-mono text-xs uppercase tracking-widest text-white/50 transition-colors duration-200 hover:text-acid"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <nav className="flex flex-col gap-3" aria-label="Legal">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-mono text-xs uppercase tracking-widest text-white/50 transition-colors duration-200 hover:text-acid"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Giant hollow wordmark — the pixel grid glows through it */}
        <div
          aria-hidden="true"
          className="footer-wordmark mt-16 select-none text-[clamp(2.75rem,13vw,11rem)] font-black uppercase leading-[0.82] tracking-tighter"
        >
          Square Share
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/30 sm:flex-row">
          <p>
            &copy; {year} Square Share. All rights reserved.
          </p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
            <span className="font-mono text-white/40">squareshare.to</span>
            <p className="inline-flex items-center gap-1.5 text-white/40">
              Made with
              <Heart
                size={13}
                aria-label="love"
                className="fill-acid text-acid"
              />
              by the{" "}
              <a
                href="https://rootlabs.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white/60 underline decoration-white/20 underline-offset-2 transition-colors duration-200 hover:text-acid hover:decoration-acid"
              >
                Root Labs
              </a>{" "}
              team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
