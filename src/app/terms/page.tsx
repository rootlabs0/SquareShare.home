import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import LegalDocument from "@/components/legal/LegalDocument";
import JsonLd from "@/components/JsonLd";
import { termsContent } from "@/content/legal/terms";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms governing use of Square Share, covering accounts, the embeddable Widget, payments via Stripe, acceptable use, and your rights.",
  alternates: { canonical: "/terms/" },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Terms of Service", item: `${SITE_URL}/terms/` },
  ],
};

export default function TermsPage() {
  return (
    <LegalLayout>
      <JsonLd data={breadcrumbJsonLd} />
      <LegalDocument content={termsContent} />
    </LegalLayout>
  );
}
