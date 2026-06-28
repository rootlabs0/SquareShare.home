"use client";

import { useCallback, useSyncExternalStore } from "react";

// SSR-safe media-query subscription. The server snapshot is `false`, so the
// server and first client render agree (no hydration mismatch); React reconciles
// to the real value right after hydration. Built on useSyncExternalStore so
// there is no setState-inside-an-effect (which caused an extra render).
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)");
}
