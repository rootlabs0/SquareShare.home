import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PurposeSection from "@/components/PurposeSection";
import PixelTransition from "@/components/PixelTransition";
import BentoGrid from "@/components/BentoGrid";
import FounderSection from "@/components/FounderSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Section 1: Dark Hero */}
        <HeroSection />

        {/* Purpose: one-sentence mission with gradient wave text */}
        <PurposeSection />

        {/* Transition 1: dark → light, dissolves upward (anchors linger at top) */}
        <PixelTransition direction="dark-to-light" />

        {/* Section 2: White Product Demo */}
        <BentoGrid />

        {/* Transition 2: light → dark, the first transition rotated 180° (anchors linger at bottom) */}
        <PixelTransition direction="light-to-dark" />

        {/* Section 3: Founder Story & Final CTA */}
        <FounderSection />
      </main>

      {/* Interactive pixel-grid footer */}
      <Footer />
    </>
  );
}
