import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Generated as a static /sitemap.xml at build time (compatible with output: export).
export const dynamic = "force-static";

// trailingSlash: true in next.config.ts, so URLs are emitted with a trailing slash
// to match the canonical tags and the actual generated routes.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/privacy/"),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/terms/"),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/cookies/"),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
