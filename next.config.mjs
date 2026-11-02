import { NOINDEX_HEADER_VALUE, PROVISIONAL_PATHS, isIndexable } from "./lib/launch.mjs";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    // Rules never overlap on X-Robots-Tag: when two rules set the same header for the
    // same URL the later one wins, which previously marked the API as "index, follow"
    // after launch.
    const robotsRules = isIndexable
      ? [
          { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
          ...PROVISIONAL_PATHS.map((path) => ({
            source: path === "/privacy" ? path : `${path}/:path*`,
            headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
          })),
        ]
      : [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: NOINDEX_HEADER_VALUE }] }];

    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
      ...robotsRules,
      // A Content-Security-Policy is intentionally not set yet: it needs testing against
      // the final analytics, booking and CMS providers.
    ];
  },
};

export default nextConfig;
