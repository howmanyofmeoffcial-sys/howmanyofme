import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,

  redirects: async () => [
    // Strip trailing slashes
    {
      source: "/:path+/",
      destination: "/:path+",
      permanent: true,
    },
    // Legacy blog slug redirects
    {
      source: "/blog/how-many-people-have-my-name-questions",
      destination: "/#faq",
      permanent: true,
    },
    {
      source: "/blog/baby-name-trends-2026",
      destination: "/blog/baby-name-trends",
      permanent: true,
    },
    {
      source: "/blog/baby-name-trends-:year(20\\d{2})",
      destination: "/blog/baby-name-trends",
      permanent: true,
    },
    {
      source: "/blog/top-google-baby-name-searches-2026",
      destination: "/blog/top-google-baby-name-searches",
      permanent: true,
    },
    {
      source: "/blog/top-google-baby-name-searches-:year(20\\d{2})",
      destination: "/blog/top-google-baby-name-searches",
      permanent: true,
    },
    {
      source: "/blog/popular-baby-names-california-2026",
      destination: "/blog/popular-baby-names-california",
      permanent: true,
    },
    {
      source: "/blog/popular-baby-names-california-:year(20\\d{2})",
      destination: "/blog/popular-baby-names-california",
      permanent: true,
    },
    {
      source: "/blog/popular-baby-names-texas-2026",
      destination: "/blog/popular-baby-names-texas",
      permanent: true,
    },
    {
      source: "/blog/popular-baby-names-texas-:year(20\\d{2})",
      destination: "/blog/popular-baby-names-texas",
      permanent: true,
    },
  ],
};

export default nextConfig;
