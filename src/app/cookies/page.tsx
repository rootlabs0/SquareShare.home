import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import LegalDocument from "@/components/legal/LegalDocument";
import JsonLd from "@/components/JsonLd";
import { cookiesContent } from "@/content/legal/cookies";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Which cookies and similar technologies Square Share uses, why, and how to control them, in accordance with EU ePrivacy rules.",
  alternates: { canonical: "/cookies/" },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Cookie Policy", item: `${SITE_URL}/cookies/` },
  ],
};

export default function CookiesPage() {
  return (
    <LegalLayout>
      <JsonLd data={breadcrumbJsonLd} />
      <LegalDocument content={cookiesContent} />
    </LegalLayout>
  );
}
