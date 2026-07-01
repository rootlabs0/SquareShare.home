// Prefix a public/ asset path with the configured basePath. Needed for raw
// <img src> / CSS url() references, which Next does NOT rewrite for basePath
// (unlike next/link and next/image).
//
// Derived from NODE_ENV, which Next statically inlines into both the server and
// client bundles, so the value is identical during the Node prerender and in the
// browser after hydration. We deliberately do NOT read process.env.NEXT_PUBLIC_*
// here: Turbopack can resolve that at runtime, which would risk a mismatch.
//
// This MUST match the basePath default in next.config.ts: the production build
// serves under "/SquareShare.home"; local dev serves from the root. If you set a
// NEXT_PUBLIC_BASE_PATH override for a custom-domain build, update this too.
export const BASE_PATH =
  process.env.NODE_ENV === "production" ? "/SquareShare.home" : "";

export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
