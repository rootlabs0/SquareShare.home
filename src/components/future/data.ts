// Data for the "Future of Square Share" section. Pure data, no "use client".
// Everything here is presented as planned, never as live. No dates anywhere.

export type RoadmapMock = "api" | "feed" | "docs";

export interface RoadmapItem {
  num: string;
  mock: RoadmapMock;
  title: string;
  body: string;
}

export const ROADMAP: RoadmapItem[] = [
  {
    num: "01",
    mock: "api",
    title: "The API",
    body: "Embed your store on any site you already have. One snippet drops a real checkout into WordPress, Wix, or plain HTML. No rebuild, no migration.",
  },
  {
    num: "02",
    mock: "feed",
    title: "The marketplace",
    body: "Get found by new buyers, not just your own traffic. A shared feed puts your products in front of people already shopping for indie work.",
  },
  {
    num: "03",
    mock: "docs",
    title: "Docs & support",
    body: "Fix anything yourself, fast. Searchable docs and clear answers, so you are never stuck waiting on a support reply.",
  },
];

export type EmbedKind = "email" | "delivery" | "reviews";

export interface EmbedItem {
  kind: EmbedKind;
  title: string;
  body: string;
}

export const EMBEDS: EmbedItem[] = [
  {
    kind: "email",
    title: "Email list",
    body: "Own your audience. Buyers auto-join at checkout.",
  },
  {
    kind: "delivery",
    title: "Digital delivery",
    body: "Files and keys sent the moment they buy.",
  },
  {
    kind: "reviews",
    title: "Reviews",
    body: "Proof that sells the next buyer.",
  },
];
