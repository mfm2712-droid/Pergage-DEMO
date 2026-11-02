import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "../lib/launch.mjs";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable || !siteUrl) return { rules: { userAgent: "*", disallow: "/" } };
  // Draft pages are not disallowed here on purpose: a crawler that cannot fetch them
  // would never see their noindex tag. Only the API is kept out of crawling.
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
