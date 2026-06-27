// Data for the "Future of Square Share" section. Pure data, no "use client".
// Everything here is presented as planned, never as live. No dates anywhere.
import { Mail, Download, Star, type LucideIcon } from "lucide-react";

export const STATUS_LABEL = "Planned";

export interface RoadmapItem {
  num: string;
  title: string;
  /** short muted clarifier under the title */
  clarifier?: string;
  body: string;
}

export const ROADMAP: RoadmapItem[] = [
  {
    num: "01",
    title: "The API",
    clarifier: "Embeddable storefront",
    body: "Drop your store into a site you already have. WordPress, Wix, anything. No rebuild, no new platform to learn.",
  },
  {
    num: "02",
    title: "The marketplace",
    clarifier: "Discovery feed",
    body: "Get discovered by new buyers instead of only your own traffic. Buyers get one place to find indie work.",
  },
  {
    num: "03",
    title: "Docs & support",
    body: "Solve any issue yourself, fast, without waiting on support.",
  },
];

export interface EmbedItem {
  icon: LucideIcon;
  title: string;
  body: string;
}

export const EMBEDS: EmbedItem[] = [
  {
    icon: Mail,
    title: "Email list",
    body: "Collect and own your audience. Buyers auto-join at checkout, so your store grows your list.",
  },
  {
    icon: Download,
    title: "Digital delivery",
    body: "Files and license keys sent automatically the moment someone buys.",
  },
  {
    icon: Star,
    title: "Reviews",
    body: "Collect buyer reviews and show them off. Social proof that sells the next buyer.",
  },
];
