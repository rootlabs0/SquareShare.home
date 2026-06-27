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

        {/* Section 2: White Product Demo — the header reveals from a dark pixel
            curtain (see PixelReveal), bridging the dark section above. */}
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
