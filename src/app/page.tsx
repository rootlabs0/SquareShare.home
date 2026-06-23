import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
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

        {/* Section 2: White Product Demo */}
        <BentoGrid />

        {/* Section 3: Founder Story & Final CTA */}
        <FounderSection />
      </main>

      {/* Interactive pixel-grid footer */}
      <Footer />
    </>
  );
}
