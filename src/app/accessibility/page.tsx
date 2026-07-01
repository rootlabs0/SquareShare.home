import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import LegalDocument from "@/components/legal/LegalDocument";
import JsonLd from "@/components/JsonLd";
import { accessibilityContent } from "@/content/legal/accessibility";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "Square Share's accessibility commitment: the WCAG 2.1 AA, EN 301 549, EAA, and ADA standards we work to, our current conformance, known limitations, and how to report a barrier.",
  alternates: { canonical: "/accessibility/" },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Accessibility Statement", item: `${SITE_URL}/accessibility/` },
  ],
};

export default function AccessibilityPage() {
  return (
    <LegalLayout>
      <JsonLd data={breadcrumbJsonLd} />
      <LegalDocument content={accessibilityContent} />
    </LegalLayout>
  );
}
