import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import LegalDocument from "@/components/legal/LegalDocument";
import JsonLd from "@/components/JsonLd";
import { privacyContent } from "@/content/legal/privacy";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Square Share collects, uses, and protects personal data across the platform, in accordance with the GDPR, UK GDPR, and CCPA/CPRA.",
  alternates: { canonical: "/privacy/" },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Privacy Policy", item: `${SITE_URL}/privacy/` },
  ],
};

export default function PrivacyPage() {
  return (
    <LegalLayout>
      <JsonLd data={breadcrumbJsonLd} />
      <LegalDocument content={privacyContent} />
    </LegalLayout>
  );
}
