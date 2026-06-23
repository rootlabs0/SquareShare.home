import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Square Share: Turn Any Website Into a Store",
  description:
    "Embed a portable storefront anywhere. Bypass platform lock-in. Own your revenue stream.",
  keywords: ["ecommerce", "embed", "store", "shopify alternative", "portable storefront"],
  openGraph: {
    title: "Square Share: Turn Any Website Into a Store",
    description:
      "Embed a portable storefront anywhere. Bypass platform lock-in. Own your revenue stream.",
    url: "https://squareshare.to",
    siteName: "Square Share",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Square Share: Turn Any Website Into a Store",
    description:
      "Embed a portable storefront anywhere. Bypass platform lock-in. Own your revenue stream.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
