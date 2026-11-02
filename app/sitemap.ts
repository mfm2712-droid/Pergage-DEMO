import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "../lib/launch.mjs";

// /privacy, /about and /insights are provisional and noindex, so they are left out
// until their text is approved (see PROVISIONAL_PATHS in lib/launch.mjs).
const publicPaths = ["/", "/scorecards", "/scorecards/organisational", "/scorecards/individual"];

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable || !siteUrl) return [];
  const host = siteUrl;
  return publicPaths.map((path) => ({
    url: path === "/" ? host : `${host}${path}`,
    lastModified: new Date(),
  }));
}
