import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_EMAIL } from "@/lib/site";

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

// Hand-written voice for the founder's self-corrections. Used only far below the
// fold, so we skip the render-time preload to leave more bandwidth for the LCP.
// display: swap still governs the (unchanged) fallback behavior when it loads.
const shadowsIntoLight = localFont({
  src: "./fonts/ShadowsIntoLight.woff2",
  weight: "400",
  variable: "--font-hand",
  display: "swap",
  preload: false,
});

const TITLE = "Square Share: Turn Any Website Into a Store";
const OG_IMAGE = {
  url: "/img/squareshare1.webp",
  width: 2531,
  height: 1598,
  alt: "Square Share portable storefront",
  type: "image/webp",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Square Share",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "ecommerce",
    "embed",
    "embeddable store",
    "portable storefront",
    "store widget",
    "shopify alternative",
    "sell on any website",
    "creator commerce",
    "indie sellers",
    "digital store shelf",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  formatDetection: { telephone: false, email: false, address: false },
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  // Mobile browser chrome only; does not affect page rendering.
  themeColor: "#000000",
};

// Site-wide identity graph. Product-level SoftwareApplication data lives on the
// home page (src/app/page.tsx) where it belongs.
const identityJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    email: SITE_EMAIL,
    description:
      "Square Share lets creators and indie sellers embed a portable storefront on any website, without platform lock-in.",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": `${SITE_URL}/#organization` },
  },
];

// Origin of the Supabase project the waitlist form posts to, resolved at build
// time. Rendered as resource hints so the first waitlist submit connects faster.
function supabaseOrigin(): string | null {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return url ? new URL(url).origin : null;
  } catch {
    return null;
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = supabaseOrigin();
  return (
    <html lang="en" className={cn("dark", spaceGrotesk.variable, jetbrainsMono.variable, shadowsIntoLight.variable, "font-sans", geist.variable)}>
      <body className="font-sans antialiased">
        {supabase && (
          <>
            <link rel="preconnect" href={supabase} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={supabase} />
          </>
        )}
        <JsonLd data={identityJsonLd} />
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster theme="dark" position="bottom-center" />
      </body>
    </html>
  );
}
