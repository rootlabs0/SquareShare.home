"use client";

import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import SquareShareLogo from "./SquareShareLogo";
import PixelButton from "./PixelButton";

const navLinks = [
  { label: "How It Works", href: "#features" },
  { label: "Our Story", href: "#founder" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6 md:pt-5"
    >
      {/* Floating island — inset from every screen edge, never full-bleed */}
      <div
        className={`mx-auto max-w-4xl overflow-hidden rounded-2xl border backdrop-blur-xl transition-colors duration-300 ${
          scrolled || menuOpen
            ? "border-white/15 bg-black/80 shadow-xl shadow-black/40"
            : "border-white/10 bg-black/50 shadow-lg shadow-black/20"
        }`}
      >
        <nav className="flex h-14 items-center justify-between px-4 md:h-16 md:px-6">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2.5 group" aria-label="Square Share home">
            <SquareShareLogo width={26} height={26} className="text-white" />
            <span className="text-white font-black text-lg tracking-tighter uppercase">
              Square Share
            </span>
          </a>

          {/* Desktop nav links + CTA (right aligned) */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white/60 hover:text-white font-mono text-xs tracking-widest uppercase transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <PixelButton
              baseColor="#ffffff"
              hoverColor="#000000"
              hoverTextColor="#ffffff"
              onClick={() =>
                document
                  .getElementById("hero")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-5 py-2.5 text-sm uppercase tracking-wider rounded-none"
            >
              Join Waitlist
            </PixelButton>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden flex items-center justify-center w-10 h-10 text-white"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile dropdown — nested inside the island so it shares its shape */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden overflow-hidden border-t border-white/10"
            >
              <div className="px-4 py-5 flex flex-col gap-5">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-white/70 hover:text-white font-mono text-sm tracking-widest uppercase transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#hero"
                  onClick={() => setMenuOpen(false)}
                  className="mt-1 inline-flex justify-center px-5 py-3 bg-[#a855f7] text-black font-black text-sm uppercase tracking-wider rounded-none border-2 border-[#a855f7] hover:bg-[#9333ea] transition-colors duration-200"
                >
                  Join Waitlist
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
