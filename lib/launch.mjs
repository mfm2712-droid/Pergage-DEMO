/**
 * Single source of truth for whether this deployment may be indexed.
 *
 * It lives in a .mjs file so next.config.mjs can import it as well as the app.
 * The default is "not indexable". A deployment only becomes indexable when ALL
 * of these hold:
 *
 *   1. SITE_LAUNCH=true (NEXT_PUBLIC_SITE_LAUNCH=true is still read as an alias)
 *   2. VERCEL_ENV=production, which Vercel sets itself, so a preview deployment
 *      that inherits the flag still stays out of search. On any other host this
 *      is never true, which fails safe; add the host's equivalent deliberately
 *      when Pergage chooses its production setup.
 *   3. NEXT_PUBLIC_SITE_URL is a valid https URL (used for the sitemap).
 *
 * The values are read when the app is built, so changing them needs a redeploy.
 */

function isTrue(value) {
  return String(value ?? "").trim().toLowerCase() === "true";
}

function readSiteUrl(raw) {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.origin : null;
  } catch {
    return null;
  }
}

export function resolveLaunch(env = process.env) {
  const launchRequested = isTrue(env.SITE_LAUNCH) || isTrue(env.NEXT_PUBLIC_SITE_LAUNCH);
  const productionDeployment = env.VERCEL_ENV === "production";
  const siteUrl = readSiteUrl(env.NEXT_PUBLIC_SITE_URL);
  return {
    launchRequested,
    productionDeployment,
    siteUrl,
    isIndexable: launchRequested && productionDeployment && siteUrl !== null,
  };
}

export const launch = resolveLaunch();
export const isIndexable = launch.isIndexable;
export const siteUrl = launch.siteUrl;
export const NOINDEX_HEADER_VALUE = "noindex, nofollow, noarchive";

/**
 * Pages whose content is still provisional. They carry their own noindex meta tag
 * and stay out of the sitemap, and the server also sends noindex for them even
 * after launch, until the owner approves the text and removes them from this list.
 */
export const PROVISIONAL_PATHS = ["/privacy", "/about", "/insights"];
