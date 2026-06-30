import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Self-hosted (downloaded from Google Fonts into ./fonts) so they build/render
// without needing a network connection to Google at build time. Variable fonts
// declare a weight range; Shadows Into Light ships a single 400 weight.
const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk.woff2",
  weight: "300 700",
  variable: "--font-display",
  display: "swap",
});

const geist = localFont({
  src: "./fonts/Geist.woff2",
  weight: "100 900",
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono.woff2",
  weight: "100 800",
  variable: "--font-mono",
  display: "swap",
});

// Hand-written voice for the founder's self-corrections.
const shadowsIntoLight = localFont({
  src: "./fonts/ShadowsIntoLight.woff2",
  weight: "400",
  variable: "--font-hand",
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
    <html lang="en" className={cn("dark", spaceGrotesk.variable, jetbrainsMono.variable, shadowsIntoLight.variable, "font-sans", geist.variable)}>
      <body className="font-sans antialiased">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster theme="dark" position="bottom-center" />
      </body>
    </html>
  );
}
