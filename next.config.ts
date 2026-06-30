import type { NextConfig } from "next";

// Deployed as a fully static site to GitHub Pages (project page), served from
//   https://rootlabs0.github.io/SquareShare.home/
// so everything lives under a basePath. Override NEXT_PUBLIC_BASE_PATH to "" for
// a root deployment (custom domain / user page).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/SquareShare.home";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  // GitHub Pages can't run the Next image optimiser.
  images: { unoptimized: true },
};

export default nextConfig;
