import type { NextConfig } from "next";

// Deployed as a fully static site to GitHub Pages (project page), served from
//   https://rootlabs0.github.io/SquareShare.home/
// so the production build lives under a basePath. In local dev we serve from the
// root, so the site is reachable at http://localhost:3000/ (under the basePath the
// root 404s and the index route loops on the trailing-slash redirect in dev).
// Override NEXT_PUBLIC_BASE_PATH to force a value ("" for a root / custom-domain
// deployment). Keep this default in sync with BASE_PATH in src/lib/asset.ts.
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.NODE_ENV === "production" ? "/SquareShare.home" : "");

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  // GitHub Pages can't run the Next image optimiser.
  images: { unoptimized: true },
};

export default nextConfig;
