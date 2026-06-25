"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import PixelButton from "@/components/PixelButton";
import { cn } from "@/lib/utils";

interface WaitlistFormProps {
  variant?: "hero" | "footer";
}

export default function WaitlistForm({ variant = "hero" }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      toast.error("Please enter a valid email address.");
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
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const isFooter = variant === "footer";

  return (
    <div className={cn("w-full mx-auto", isFooter ? "max-w-2xl" : "max-w-lg")}>
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-6 px-8 border-2 border-[#ff9900] bg-[#ff9900]/10"
          >
            <p className="text-[#ff9900] font-bold text-lg flex items-center justify-center gap-2">
              You&apos;re on the list! <PartyPopper size={20} />
            </p>
            <p className="text-sm mt-1 text-white/50">
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
                "flex-1 h-auto px-6 py-4 text-base font-medium bg-white/5 border-2 border-white/20 text-white placeholder:text-white/30 focus-visible:border-[#ff9900] focus-visible:ring-0",
                status === "error" && "border-red-500"
              )}
              style={{ fontSize: "16px" }}
            />
            <PixelButton
              type="submit"
              disabled={status === "loading"}
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
        )}
      </AnimatePresence>
    </div>
  );
}
