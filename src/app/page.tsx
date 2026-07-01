import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PurposeSection from "@/components/PurposeSection";
import HowItWorks from "@/components/HowItWorks";
import FutureSection from "@/components/FutureSection";
import FounderSection from "@/components/FounderSection";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export default function Home() {
  return (
    <>
      <JsonLd data={softwareJsonLd} />
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
