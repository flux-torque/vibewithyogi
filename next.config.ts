import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* AVIF first — on these photos it comes in at roughly half the WebP size,
       which is most of what a slow connection pays for. */
    formats: ["image/avif", "image/webp"],
    /* The default ladder tops out at 3840, so a full-bleed frame on a retina
       laptop pulls a 4K photo. 2560 is indistinguishable under the grade. */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560],
    minimumCacheTTL: 2592000,
  },

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
