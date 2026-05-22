import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, GraduationCap, Library, NotebookPen } from "lucide-react";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "استخدامات رَفّي | للقراء والطلاب والباحثين",
  description: "اكتشف كيف يساعد رَفّي القراء والطلاب والباحثين ومحبي الكتب على تنظيم مكتباتهم وملاحظاتهم بسهولة.",
  keywords: site.keywordsAr,
  alternates: { canonical: "/use-cases", languages: { ar: "/use-cases", en: "/en/use-cases", "x-default": "/use-cases" } },
};

const cases = [
  ["للقراء", "احتفظ بقائمة كتبك، ملاحظاتك، وتقييماتك بدل أن تبقى متفرقة.", BookOpen],
  ["للطلاب", "نظّم المراجع والكتب الدراسية حسب المادة أو المشروع.", GraduationCap],
  ["للباحثين", "اجمع الكتب والمراجع والملاحظات في مكان واحد قابل للبحث.", NotebookPen],
  ["لهواة المكتبات", "قسّم مكتبتك حسب الرفوف والفئات والمؤلفين لتصل لكل كتاب بسرعة.", Library],
] as const;

export default function UseCasesPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950 dark:bg-slate-950 dark:text-slate-50">
      <MarketingHeader locale="ar" />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
          رَفّي يناسب كل شخص يريد أن يرى مكتبته بوضوح.
        </h1>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cases.map(([title, text, Icon]) => (
            <article key={title} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Icon className="text-teal-700 dark:text-teal-300" size={28} />
              <h2 className="mt-4 text-xl font-semibold">{title}</h2>
              <p className="mt-2 leading-7 text-stone-600 dark:text-slate-400">{text}</p>
            </article>
          ))}
        </div>
        <Link className="primary-link mt-8 h-12 w-fit px-5 text-base" href="/auth/sign-up">
          ابدأ الاستخدام
        </Link>
      </section>
      <MarketingFooter locale="ar" />
    </main>
  );
}
