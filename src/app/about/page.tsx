import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "من نحن | رَفّي",
  description: "رَفّي مشروع مجاني لتنظيم المكتبات الشخصية، صُمم ليجعل الكتب والملاحظات والرفوف أقرب وأسهل في الاستخدام اليومي.",
  keywords: site.keywordsAr,
  alternates: { canonical: "/about", languages: { ar: "/about", en: "/en/about", "x-default": "/about" } },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950 dark:bg-slate-950 dark:text-slate-50">
      <MarketingHeader locale="ar" />
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="w-fit rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
          من نحن
        </p>
        <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
          رَفّي بدأ كفكرة بسيطة: مكتبتك تستحق مكانًا مرتبًا يليق بها.
        </h1>
        <div className="mt-8 grid gap-5 text-lg leading-8 text-stone-700 dark:text-slate-300">
          <p>
            كثير من القرّاء يمتلكون كتبًا ورقية ورقمية وملاحظات متناثرة، لكن لا يجدون أداة خفيفة
            تحفظ لهم الصورة الكاملة: ما الذي أملكه؟ أين وضعته؟ متى حصلت عليه؟ وما الذي كتبته عنه؟
          </p>
          <p>
            رَفّي يحاول حل هذا ببساطة: كتب، مؤلفون، فئات، رفوف، ملاحظات، حالة قراءة، تصدير واستيراد،
            وتجربة تعمل على الهاتف والكمبيوتر حتى عندما ينقطع الاتصال.
          </p>
          <p>
            المشروع هدية مفتوحة الروح للمجتمع العربي والإنجليزي؛ أداة صغيرة لكنها نافعة لأي شخص يريد
            بناء ذاكرة منظمة لقراءاته ومراجعه.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="primary-link h-12 px-5 text-base" href="/auth/sign-up">
            جرّب رَفّي
          </Link>
          <Link className="secondary-link h-12 px-5 text-base" href="/creator">
            تعرف على المطور
          </Link>
        </div>
      </section>
      <MarketingFooter locale="ar" />
    </main>
  );
}
