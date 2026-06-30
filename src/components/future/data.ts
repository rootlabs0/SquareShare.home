// Data for the "Future of Square Share" section. Pure data, no "use client".
// Everything here is presented as planned, never as live. No dates anywhere.

export type RoadmapMock = "api" | "feed";

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
    body: "Firstly we need to create the embedable API that allows you to turn any website into a storefront. Before we create the API we need a system for users to create and manage this storefront. ",
  },
  {
    num: "02",
    mock: "feed",
    title: "The marketplace",
    body: "Get found by new buyers, not just your own traffic. A shared feed puts your products in front of people already shopping for indie work.",
  },
];

// "The API" terminal: the embed snippet, then a prompt + build status. Code lines
// carry tokens so the snippet keeps its syntax colors while staying data-driven.
export type CodeToken = { t: string; c?: "tag" | "attr" | "str" };

export type TerminalLine =
  | { kind: "comment"; text: string }
  | { kind: "code"; tokens: CodeToken[] }
  | { kind: "prompt"; text: string }
  | { kind: "status"; text: string };

export const API_TERMINAL: TerminalLine[] = [
  {
    kind: "code",
    tokens: [
      { t: "<" },
      { t: "script", c: "tag" },
      { t: " " },
      { t: "src", c: "attr" },
      { t: "=" },
      { t: '"squareshare.to/embed.js"', c: "str" },
      { t: ">" },
      { t: "</" },
      { t: "script", c: "tag" },
      { t: ">" },
    ],
  },
  {
    kind: "code",
    tokens: [
      { t: "<" },
      { t: "div", c: "tag" },
      { t: " " },
      { t: "id", c: "attr" },
      { t: "=" },
      { t: '"sq-store"', c: "str" },
      { t: ">" },
      { t: "</" },
      { t: "div", c: "tag" },
      { t: ">" },
    ],
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
