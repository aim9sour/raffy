import type { Metadata } from "next";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { FeaturesContent } from "@/components/features-content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "مميزات رَفّي | تنظيم الكتب والمراجع والعمل دون اتصال",
  description:
    "تعرف على مميزات رَفّي: إدارة الكتب، المؤلفين، الفئات، الرفوف، الملاحظات، التصدير والاستيراد، الوضع الليلي، والعمل دون اتصال.",
  keywords: site.keywordsAr,
  alternates: {
    canonical: "/features",
    languages: {
      ar: "/features",
      en: "/en/features",
      "x-default": "/features",
    },
  },
};

export default function FeaturesPage() {
  return (
    <>
      <SeoJsonLd locale="ar" page="features" />
      <FeaturesContent locale="ar" />
    </>
  );
}
