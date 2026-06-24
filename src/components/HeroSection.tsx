"use client";

import WaitlistForm from "./WaitlistForm";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-black pt-20 pb-16"
    >
      <div className="w-full max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.92] tracking-tight mb-6 font-display">
          Turn Any Website
          <br />
          Into a Store.
        </h1>
        <p className="text-lg md:text-xl text-white/50 mb-10 max-w-xl mx-auto">
          Embed a portable storefront anywhere. Bypass platform lock-in. Own your revenue stream.
        </p>
        <WaitlistForm variant="hero" />
      </div>
    </section>
  );
}
