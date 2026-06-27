"use client";

import CheckoutFlow from "./CheckoutFlow";

// Step 03: Get discovered and sell. The 3-stage animated Stripe checkout.
// (Steps 01 + 02 are handled by BuildEmbedSequence, not StepRow.)
export function SellMockup() {
  return <CheckoutFlow />;
}

export const MOCKUPS = {
  sell: SellMockup,
} as const;
