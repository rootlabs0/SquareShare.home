import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import LegalDocument from "@/components/legal/LegalDocument";
import { termsContent } from "@/content/legal/terms";

export const metadata: Metadata = {
  title: "Terms of Service | Square Share",
  description:
    "The terms governing use of Square Share, covering accounts, the embeddable Widget, payments via Stripe, acceptable use, and your rights.",
};

export default function TermsPage() {
  return (
    <LegalLayout>
      <LegalDocument content={termsContent} />
    </LegalLayout>
  );
}
