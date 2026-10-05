import type { MetadataRoute } from "next";

/**
 * Meridian is shared by direct link, not found through search, so every
 * crawler is turned away to keep traffic inside the Vercel Hobby limits.
 * Link-preview bots stay allowed: without them a shared link loses its card.
 */
const previewBots = [
  "facebookexternalhit",
  "Facebot",
  "Twitterbot",
  "LinkedInBot",
  "Slackbot-LinkExpanding",
  "TelegramBot",
  "WhatsApp",
  "Discordbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: previewBots, allow: "/" },
      { userAgent: "*", disallow: "/" },
    ],
  };
}
