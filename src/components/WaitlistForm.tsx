"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper } from "lucide-react";

interface WaitlistFormProps {
  variant?: "hero" | "footer";
}

export default function WaitlistForm({ variant = "hero" }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

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
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  };

  const isFooter = variant === "footer";

  return (
    <div className={`w-full ${isFooter ? "max-w-2xl mx-auto" : "max-w-lg mx-auto"}`}>
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`text-center py-6 px-8 rounded-none border-2 border-[#ff9900] ${
              isFooter ? "bg-[#ff9900]/10" : "bg-[#ff9900]/10"
            }`}
          >
            <p className="text-[#ff9900] font-bold text-lg flex items-center justify-center gap-2">You&apos;re on the list! <PartyPopper size={20} /></p>
            <p className={`text-sm mt-1 ${isFooter ? "text-white/50" : "text-white/50"}`}>
              We&apos;ll hit you up when it&apos;s go time.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex flex-col sm:flex-row gap-3 ${
              isFooter ? "" : ""
            }`}
            suppressHydrationWarning
          >
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="Enter your email"
              aria-label="Email address"
              className={`flex-1 px-6 py-4 rounded-none border-2 font-medium text-base outline-none transition-all duration-200 ${
                isFooter
                  ? "bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-[#ff9900]"
                  : "bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-[#ff9900]"
              } ${status === "error" ? "border-red-500" : ""}`}
              style={{ fontSize: "16px" }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-8 py-4 bg-[#ff9900] text-black font-black text-base rounded-none border-2 border-[#ff9900] hover:bg-[#cc7a00] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Joining...
                </span>
              ) : (
                "Join the Waitlist"
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {status === "error" && errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 text-red-400 text-sm text-center"
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
