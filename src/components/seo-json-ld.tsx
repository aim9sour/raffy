import { site } from "@/lib/site";

type Props = {
  locale: "ar" | "en";
  page: "home" | "features";
};

export function SeoJsonLd({ locale, page }: Props) {
  const isArabic = locale === "ar";
  const path = isArabic ? (page === "home" ? "/" : "/features") : page === "home" ? "/en" : "/en/features";
  const description = isArabic ? site.descriptionAr : site.descriptionEn;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${site.url}/#app`,
        name: `${site.nameAr} | ${site.nameEn}`,
        alternateName: [site.nameAr, site.nameEn, "رفي"],
        url: `${site.url}${path}`,
        applicationCategory: "ProductivityApplication",
        operatingSystem: "Web, iOS, Android, Windows, macOS",
        inLanguage: isArabic ? ["ar", "en"] : ["en", "ar"],
        description,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [
          "Book catalog management",
          "Authors, categories and shelves",
          "Book notes and acquisition dates",
          "Offline-first PWA",
          "Automatic sync after reconnecting",
          "JSON import and export",
          "Dark mode",
          "Arabic and English interface",
        ],
      },
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.nameEn,
        alternateName: [site.nameAr, "رفي"],
        url: site.url,
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        name: `${site.nameAr} | ${site.nameEn}`,
        url: site.url,
        inLanguage: ["ar", "en"],
        potentialAction: {
          "@type": "SearchAction",
          target: `${site.url}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
