import type { Metadata } from "next";
import { Award, BrainCircuit, Code, Link, Mail, MessageCircle, Sparkles, Users } from "lucide-react";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import { PersonJsonLd } from "@/components/person-json-ld";
import { creator, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "المهندس عبد الله منصور | مطور رَفّي",
  description:
    "تعرف على المهندس عبد الله منصور، شاب مصري شغوف بالتقنية والذكاء الاصطناعي التطبيقي، ومطور رَفّي ومنصة حصيلة.",
  keywords: ["عبد الله منصور", "Abdullah Mansour", "aim9sour", ...site.keywordsAr],
  alternates: { canonical: "/creator", languages: { ar: "/creator", en: "/en/creator", "x-default": "/creator" } },
};

const highlights = [
  ["ذكاء اصطناعي تطبيقي", "يعمل في قطاع الذكاء الاصطناعي التطبيقي ويركز على تحويل الأفكار إلى أدوات نافعة.", BrainCircuit],
  ["وصولية وتجربة مستخدم", "خبير عملي في الوصولية وبناء تجارب أكثر احترامًا للمستخدمين باختلاف احتياجاتهم.", Sparkles],
  ["أثر مجتمعي", "ساهم في تعليم وإرشاد أكثر من 1000 شخص وساعدهم على بداية طريق العمل عبر الإنترنت.", Users],
  ["تعلم موثق", "حاصل على شهادات معتمدة من Google وIBM وMicrosoft وAmazon وغيرها في التسويق الرقمي والذكاء الاصطناعي.", Award],
] as const;

export default function CreatorPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950 dark:bg-slate-950 dark:text-slate-50">
      <PersonJsonLd />
      <MarketingHeader locale="ar" />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="w-fit rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
          تم تطوير رَفّي بواسطة
        </p>
        <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
          {creator.nameAr}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-700 dark:text-slate-300">
          عبد الله منصور شاب مصري شغوف بالتقنية والذكاء الاصطناعي. يعمل كمهندس في قطاع الذكاء
          الاصطناعي التطبيقي، وساهم في مشاريع مفتوحة على GitHub، وأنشأ مشاريع مثل رَفّي ومنصة حصيلة.
          بدأ رحلته في التسويق الرقمي ثم انتقل إلى الذكاء الاصطناعي التطبيقي ليبني أدوات عملية تخدم الناس.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-700 dark:text-slate-300">
          رَفّي ليس مجرد تطبيق لتنظيم الكتب؛ هو هدية رقمية للمجتمع، ورسالة صغيرة بأن التقنية يمكن أن
          تكون أبسط وأقرب وأكثر إنسانية.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map(([title, text, Icon]) => (
            <article key={title} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Icon className="text-teal-700 dark:text-teal-300" size={28} />
              <h2 className="mt-4 font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-slate-400">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <a className="primary-link h-12 px-5 text-base" href={creator.whatsapp}>
            <MessageCircle size={18} />
            واتساب
          </a>
          <a className="secondary-link h-12 px-5 text-base" href={`mailto:${creator.email}`}>
            <Mail size={18} />
            البريد
          </a>
          <a className="secondary-link h-12 px-5 text-base" href={creator.linkedin}>
            <Link size={18} />
            LinkedIn
          </a>
          <a className="secondary-link h-12 px-5 text-base" href={creator.github}>
            <Code size={18} />
            GitHub
          </a>
        </div>
      </section>
      <MarketingFooter locale="ar" />
    </main>
  );
}
