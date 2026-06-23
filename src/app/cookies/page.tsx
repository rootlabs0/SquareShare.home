import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import LegalDocument from "@/components/legal/LegalDocument";
import { cookiesContent } from "@/content/legal/cookies";

export const metadata: Metadata = {
  title: "Cookie Policy | Square Share",
  description:
    "Which cookies and similar technologies Square Share uses, why, and how to control them, in accordance with EU ePrivacy rules.",
};

export default function CookiesPage() {
  return (
    <LegalLayout>
      <LegalDocument content={cookiesContent} />
    </LegalLayout>
  );
}
