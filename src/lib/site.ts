// Canonical public origin for SEO metadata (canonical URLs, Open Graph, sitemap,
// robots, JSON-LD). This is the production domain the site is meant to be crawled
// and shared under, independent of the current GitHub Pages staging path. Override
// with NEXT_PUBLIC_SITE_URL for a different deployment. No trailing slash.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://squareshare.to"
).replace(/\/+$/, "");

export const SITE_NAME = "Square Share";

export const SITE_DESCRIPTION =
  "Embed a portable storefront anywhere. Bypass platform lock-in. Own your revenue stream.";

export const SITE_EMAIL = "squareshare.to@gmail.com";

// Absolute URL for a root-relative path against the canonical origin.
export function absoluteUrl(path = "/"): string {
  return new URL(path, `${SITE_URL}/`).toString();
}
