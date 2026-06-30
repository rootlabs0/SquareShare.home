// Prefix a public/ asset path with the configured basePath. Needed for raw
// <img src> / CSS url() references, which Next does NOT rewrite for basePath
// (unlike next/link and next/image).
//
// Hardcoded (not read from process.env) so the value is identical during the
// Node prerender and in the browser after hydration — Turbopack resolves
// process.env.NEXT_PUBLIC_* at runtime here, which would risk a mismatch.
// MUST match the basePath in next.config.ts; set both to "" for a root deploy.
export const BASE_PATH = "/SquareShare.home";

export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
