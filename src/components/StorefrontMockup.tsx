"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function StorefrontMockup() {
  const container = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Set 3D perspective and rotation
    gsap.set(mockupRef.current, {
      rotationX: 5,
      rotationY: -10,
      transformPerspective: 1000,
    });

    // Entrance animation
    gsap.from(mockupRef.current, {
      y: 60,
      opacity: 0,
      rotationX: 20,
      duration: 1.5,
      ease: "power3.out",
      delay: 0.3,
    });

    // Gentle floating loop
    gsap.to(mockupRef.current, {
      y: "-=15",
      rotationX: 2,
      rotationY: -8,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: 1.8,
    });
  }, { scope: container });

  return (
    <div ref={container} className="relative w-full max-w-lg mx-auto lg:ml-auto">
      {/* Mockup Container */}
      <div 
        ref={mockupRef}
        className="relative bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 overflow-hidden"
      >
        {/* Fake Browser Header */}
        <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-white/20 rounded-none" />
            <div className="w-3 h-3 bg-white/20 rounded-none" />
            <div className="w-3 h-3 bg-white/20 rounded-none" />
          </div>
          <div className="mx-auto bg-black/50 border border-white/10 px-4 py-1 text-xs text-white/40 font-mono tracking-widest uppercase">
            your-site.com
          </div>
        </div>

        {/* Mockup Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Store Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="text-white font-black text-2xl tracking-tighter uppercase">STORE.</div>
            <div className="text-white/50 text-sm font-mono border border-white/10 px-2 py-1">Cart (2)</div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Product 1 */}
            <div className="border border-white/10 p-4 group hover:border-[#ff9900]/50 hover:bg-[#ff9900]/5 transition-all duration-500 cursor-pointer bg-white/5">
              <div className="w-full aspect-square bg-black/50 mb-4 flex items-center justify-center border border-white/5 group-hover:border-[#ff9900]/30 transition-all duration-500">
                <div className="w-12 h-12 border border-white/20 group-hover:border-[#ff9900] transition-colors" />
              </div>
              <div className="text-white text-sm font-bold uppercase tracking-wide">Digital Asset</div>
              <div className="text-white font-mono text-sm mt-2">$49.00</div>
            </div>
            {/* Product 2 */}
            <div className="border border-white/10 p-4 group hover:border-[#ff9900]/50 hover:bg-[#ff9900]/5 transition-all duration-500 cursor-pointer bg-white/5">
              <div className="w-full aspect-square bg-black/50 mb-4 flex items-center justify-center border border-white/5 group-hover:border-[#ff9900]/30 transition-all duration-500">
                <div className="w-12 h-12 border border-white/20 group-hover:border-[#ff9900] transition-colors rotate-45" />
              </div>
              <div className="text-white text-sm font-bold uppercase tracking-wide">Premium Course</div>
              <div className="text-white font-mono text-sm mt-2">$199.00</div>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="w-full py-4 mt-4 bg-[#ff9900] text-black text-center font-black text-sm uppercase tracking-widest hover:bg-[#cc7a00] cursor-pointer transition-colors">
            Checkout $248.00
          </div>
        </div>
      </div>
      
    </div>
  );
}
