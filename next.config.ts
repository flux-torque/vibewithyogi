import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Static files out of /public are served with `max-age=0` by default, which
     would make the collab stage's warm-up pointless: the bytes are in the
     cache, but the real request still pays a revalidation round-trip before
     it can touch them. Thirty days, and deliberately not `immutable` — these
     filenames are stable, so a re-cut clip reusing a name still gets picked
     up on the next revalidation instead of being pinned for a year. */
  async headers() {
    return [
      {
        source: "/video/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }],
      },
    ];
  },
};

export default nextConfig;
