"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import WaitlistForm from "./WaitlistForm";
import StorefrontMockup from "./StorefrontMockup";
import SoftAurora from "./SoftAurora";

gsap.registerPlugin(useGSAP);

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Select the elements we want to animate within the text container
    const elements = textContentRef.current?.children;
    if (elements) {
      gsap.from(elements, {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.1,
      });
    }
  }, { scope: containerRef });

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20 pb-10"
    >
      {/* Soft Aurora Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <SoftAurora
          speed={0.6}
          scale={1.5}
          brightness={1.0}
          color1="#000000"
          color2="#ff9900"
          noiseFrequency={2.5}
          noiseAmplitude={1.0}
          bandHeight={0.5}
          bandSpread={1.0}
          octaveDecay={0.1}
          layerOffset={0}
          colorSpeed={1.0}
          enableMouseInteraction={true}
          mouseInfluence={0.25}
        />
      </div>

      {/* Content - Two Column Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        
        {/* Left: Copy & Form */}
        <div ref={textContentRef} className="text-left max-w-2xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[0.95] tracking-tight mb-6 font-display">
            Turn Any Website
            <br />
            Into a Store.
          </h1>
          <p className="text-xl md:text-2xl font-medium text-white/60 mb-10 max-w-xl">
            Embed a portable storefront anywhere. Bypass platform lock-in. Own your revenue stream. 
          </p>
          <div className="w-full">
            <WaitlistForm variant="hero" />
          </div>
        </div>

        {/* Right: Mockup */}
        <div className="w-full mt-10 lg:mt-0">
          <StorefrontMockup />
        </div>

      </div>
    </section>
  );
}
