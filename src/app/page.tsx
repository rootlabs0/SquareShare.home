import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PurposeSection from "@/components/PurposeSection";
import HowItWorks from "@/components/HowItWorks";
import FutureSection from "@/components/FutureSection";
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

        {/* Section 2: White Product Demo — an irregular pixel border (PixelEdge)
            breaks up the dark→light seam from the section above. */}
        <HowItWorks />

        {/* The Future — roadmap + planned embeds */}
        <FutureSection />

        {/* Section 3: Founder Story & Final CTA */}
        <FounderSection />
      </main>

      {/* Interactive pixel-grid footer */}
      <Footer />
    </>
  );
}
