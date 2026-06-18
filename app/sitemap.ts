import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://city-jam.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/privacy",
    "/terms",
    "/contact",
    "/community",
    "/signal-map",
    "/project-match",
    "/blind-echo",
    "/echo-roulette",
    "/circles",
    "/vault",
    "/collab",
    "/listening-rooms",
    "/studio",
    "/login",
    "/register",
  ];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/community" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/privacy" || path === "/terms" ? 0.5 : 0.7,
  }));
}
