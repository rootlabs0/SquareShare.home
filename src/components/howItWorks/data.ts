// Data for the "How It Works" product walkthrough. Pure data, no "use client".
//
// Products are real stock photos bundled under /public/howitworks. The shelf
// leans on clean tech goods with a few pops of greenery/plants.
import { asset } from "@/lib/asset";

// Single source of truth for the product photos. asset() prefixes the basePath
// so these resolve when served from a GitHub Pages project subpath.
export const PRODUCT_IMAGES = [
  asset("/howitworks/product-01.jpg"), // camera
  asset("/howitworks/product-02.jpg"), // headphones
  asset("/howitworks/product-03.jpg"), // watch
  asset("/howitworks/product-04.jpg"), // monstera (green)
  asset("/howitworks/product-05.jpg"), // mouse
  asset("/howitworks/product-06.jpg"), // smartwatch
  asset("/howitworks/product-07.jpg"), // succulent (green)
  asset("/howitworks/product-08.jpg"), // keyboard
  asset("/howitworks/product-09.jpg"), // speaker
  asset("/howitworks/product-10.jpg"), // potted monstera (green)
  asset("/howitworks/product-11.jpg"), // phone
  asset("/howitworks/product-12.jpg"), // seedlings (green)
];

const p = PRODUCT_IMAGES;

// The customizable embeddable storefront: a fixed 4-col x 3-row bento with
// every tile explicitly placed (square cells, so square photos never crop).
// Only clean white-background products are used. This is the "store they built"
// that gets dragged into the example website during the 01 -> 02 transition.
export interface StoreSlot {
  id: string;
  img: string;
  col: number; // 1-based column start
  row: number; // 1-based row start
  cw: number; // column span
  rh: number; // row span
}

export const STOREFRONT_SLOTS: StoreSlot[] = [
  { id: "s1", img: p[0], col: 1, row: 1, cw: 2, rh: 2 }, // camera (hero)
  { id: "s2", img: p[3], col: 3, row: 1, cw: 1, rh: 1 }, // monstera (green)
  { id: "s3", img: p[2], col: 4, row: 1, cw: 1, rh: 1 }, // watch
  { id: "s4", img: p[1], col: 3, row: 2, cw: 2, rh: 2 }, // headphones (featured)
  { id: "s5", img: p[6], col: 1, row: 3, cw: 1, rh: 1 }, // succulent (green)
  { id: "s6", img: p[4], col: 2, row: 3, cw: 1, rh: 1 }, // mouse
];

// The product the step-3 customer clicks and buys. Its image matches the
// headphones tile in STOREFRONT_SLOTS, so all three steps show one store.
export const CHECKOUT_PRODUCT = {
  img: p[1],
  name: "Studio Headphones",
  category: "Audio gear",
  price: "$129.00",
};

// ── The 3 process steps ─────────────────────────────────────────────────────
export type StepMockup = "build" | "embed" | "sell";

export interface Step {
  num: string;
  eyebrow: string;
  title: string;
  body: string;
  mockup: StepMockup;
}

export const STEPS: Step[] = [
  {
    num: "01",
    eyebrow: "Build your shelf",
    title: "Curate a grid that's all yours.",
    body: "Drop your products into a Pinterest-style bento grid and size each one to fit. No cookie-cutter templates and no code, just a store shelf that actually looks like you.",
    mockup: "build",
  },
  {
    num: "02",
    eyebrow: "Embed anywhere",
    title: "Drop your storefront onto your site.",
    body: "Square Share generates one lightweight widget you paste into WordPress, Wix, or any HTML page. Your shelf goes live right where your audience already is, and you keep every customer.",
    mockup: "embed",
  },
  {
    num: "03",
    eyebrow: "Get discovered and sell",
    title: "Connect Stripe and take payment.",
    body: "Buyers check out securely through your embedded shelf with Stripe handling every payment. Each sale also plugs you into Square Share's public discovery feed, turning proven buyers into your next customers.",
    mockup: "sell",
  },
];
