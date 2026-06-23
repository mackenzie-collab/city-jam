import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://city-jam.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/privacy",
    "/terms",
    "/contact",
    "/community",
    "/project-match",
    "/blind-echo",
    "/echo-roulette",
    "/circles",
    "/dashboard",
    "/collab",
    "/listening-rooms",
    "/studio",
    "/login",
    "/register",
    "/affiliate",
  ];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/community" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/privacy" || path === "/terms" ? 0.5 : 0.7,
  }));
}
