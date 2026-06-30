"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import PixelButton from "@/components/PixelButton";
import { cn } from "@/lib/utils";

interface WaitlistFormProps {
  variant?: "hero" | "footer";
}

export default function WaitlistForm({ variant = "hero" }: WaitlistFormProps) {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  // On success, play the checkmark draw-in first, then reveal the card.
  // Reduced-motion users skip straight to the card.
  const [revealed, setRevealed] = useState(false);
  const showCard = revealed || reduce;

  useEffect(() => {
    if (status !== "success" || reduce) return;
    const t = setTimeout(() => setRevealed(true), 1400);
    return () => clearTimeout(t);
  }, [status, reduce]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      toast.error("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setRevealed(false);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const isFooter = variant === "footer";

  return (
    <div className={cn("w-full mx-auto", isFooter ? "max-w-2xl" : "max-w-lg")}>
      <AnimatePresence mode="wait">
        {status !== "success" ? (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col sm:flex-row gap-3"
            suppressHydrationWarning
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="Enter your email"
              aria-label="Email address"
              className={cn(
                "flex-1 h-auto px-6 py-4 text-base font-medium focus-visible:border-[#a855f7] focus-visible:ring-0",
                isFooter
                  ? "bg-white border-2 border-neutral-300 text-neutral-900 placeholder:text-neutral-400"
                  : "bg-white/5 border-2 border-white/20 text-white placeholder:text-white/30",
                status === "error" && "border-red-500"
              )}
              style={{ fontSize: "16px" }}
            />
            <PixelButton
              type="submit"
              disabled={status === "loading"}
              hoverTextColor="#ffffff"
              style={{ color: "#ffffff" }}
              className="px-8 py-4 text-base"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Joining...
                </span>
              ) : (
                "Join the Waitlist"
              )}
            </PixelButton>
          </motion.form>
        ) : !showCard ? (
          // Phase 1: the checkmark draws itself in, then hands off to the card.
          <motion.div
            key="tick"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="flex items-center justify-center py-16"
          >
            <motion.svg
              viewBox="0 0 52 52"
              className="h-20 w-20"
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 16 }}
            >
              <motion.circle
                cx="26"
                cy="26"
                r="24"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M15 27l7.5 7.5L38 19"
                fill="none"
                stroke="#a855f7"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.45, duration: 0.35, ease: "easeOut" }}
              />
            </motion.svg>
          </motion.div>
        ) : (
          // Phase 2: the card slides up, with the oversized check as a watermark.
          <motion.div
            key="card"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
            }
            className={cn(
              "relative mx-auto max-w-md overflow-hidden border px-8 py-9",
              isFooter
                ? "border-neutral-200 bg-white shadow-[0_2px_24px_rgba(0,0,0,0.05)]"
                : "border-white/10 bg-white/[0.04]"
            )}
          >
            {/* Oversized check watermark, bleeding off the right edge. */}
            <Check
              aria-hidden
              strokeWidth={1.5}
              className={cn(
                "pointer-events-none absolute top-1/2 -right-10 h-60 w-60 -translate-y-1/2",
                isFooter ? "text-[#a855f7]/[0.18]" : "text-[#a855f7]/[0.15]"
              )}
            />

            <div className="relative z-10 max-w-xs text-left">
              <h3
                className={cn(
                  "font-display text-xl font-black md:text-2xl",
                  isFooter ? "text-neutral-900" : "text-white"
                )}
              >
                You&apos;re on the list!
              </h3>

              <p
                className={cn(
                  "mt-2 text-sm leading-relaxed",
                  isFooter ? "text-neutral-500" : "text-white/50"
                )}
              >
                We&apos;ll email you once, when it&apos;s go time. Until then, we
                share the whole process as it happens.
              </p>

              <a
                href="https://instagram.com/squareshare"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Square Share on Instagram"
                className={cn(
                  "mt-6 inline-flex items-center justify-center gap-2.5 px-7 py-3.5",
                  "text-sm font-bold transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  isFooter
                    ? "bg-neutral-900 text-white hover:bg-neutral-700 focus-visible:ring-neutral-900 focus-visible:ring-offset-white"
                    : "bg-white text-black hover:bg-white/85 focus-visible:ring-white focus-visible:ring-offset-black"
                )}
              >
                {/* simple-icons Instagram glyph (same source as Footer). */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-[18px] w-[18px] fill-current"
                  aria-hidden
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                @squareshare
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
