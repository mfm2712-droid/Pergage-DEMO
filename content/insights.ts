/**
 * File-backed editorial boundary until Pergage chooses and owns a CMS.
 *
 * Deliberately empty: no articles or authors are invented in the preview.
 */
export type InsightEntry = {
  slug: string;
  title: string;
  summary: string;
  publishedAt?: string;
  author?: string;
  source: "paul-approved" | "provisional";
};

export const insightEntries: InsightEntry[] = [];
