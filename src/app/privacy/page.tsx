import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import LegalDocument from "@/components/legal/LegalDocument";
import { privacyContent } from "@/content/legal/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy | Square Share",
  description:
    "How Square Share collects, uses, and protects personal data across the platform, in accordance with the GDPR, UK GDPR, and CCPA/CPRA.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout>
      <LegalDocument content={privacyContent} />
    </LegalLayout>
  );
}
