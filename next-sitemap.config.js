const siteUrl = "https://raffy-library.vercel.app";

const pairs = {
  "/": "/en",
  "/features": "/en/features",
  "/about": "/en/about",
  "/creator": "/en/creator",
  "/use-cases": "/en/use-cases",
  "/contact": "/en/contact",
};

const priorities = {
  "/": 1,
  "/en": 0.95,
  "/features": 0.9,
  "/en/features": 0.9,
  "/about": 0.85,
  "/en/about": 0.85,
  "/creator": 0.85,
  "/en/creator": 0.85,
  "/use-cases": 0.8,
  "/en/use-cases": 0.8,
  "/contact": 0.7,
  "/en/contact": 0.7,
};

function routePair(path) {
  if (pairs[path]) return { ar: path, en: pairs[path] };
  const match = Object.entries(pairs).find(([, en]) => en === path);
  return match ? { ar: match[0], en: path } : { ar: "/", en: "/en" };
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/api/*", "/auth/*", "/account/*", "/library", "/manifest.webmanifest"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/en",
          "/features",
          "/en/features",
          "/about",
          "/en/about",
          "/creator",
          "/en/creator",
          "/use-cases",
          "/en/use-cases",
          "/contact",
          "/en/contact",
          "/icon.svg",
          "/manifest.webmanifest",
          "/llms.txt",
          "/humans.txt",
        ],
        disallow: ["/api/", "/auth/", "/account/", "/library"],
      },
    ],
    additionalSitemaps: [`${siteUrl}/sitemap.xml`],
  },
  additionalPaths: async (config) =>
    Object.keys(priorities).map((path) => config.transform(config, path)),
  transform: async (config, path) => {
    const pair = routePair(path);

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priorities[path] ?? config.priority,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        { href: `${siteUrl}${pair.ar}`, hreflang: "ar", hrefIsAbsolute: true },
        { href: `${siteUrl}${pair.en}`, hreflang: "en", hrefIsAbsolute: true },
        { href: `${siteUrl}${pair.ar}`, hreflang: "x-default", hrefIsAbsolute: true },
      ],
    };
  },
};
