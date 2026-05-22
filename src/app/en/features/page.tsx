import type { Metadata } from "next";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { FeaturesContent } from "@/components/features-content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Raffy Features | Offline Personal Library Organizer",
  description:
    "Explore Raffy features: book catalog, authors, categories, shelves, notes, import/export, dark mode, offline work, and automatic sync.",
  keywords: site.keywordsEn,
  alternates: {
    canonical: "/en/features",
    languages: {
      ar: "/features",
      en: "/en/features",
      "x-default": "/features",
    },
  },
};

export default function EnglishFeaturesPage() {
  return (
    <>
      <SeoJsonLd locale="en" page="features" />
      <FeaturesContent locale="en" />
    </>
  );
}
