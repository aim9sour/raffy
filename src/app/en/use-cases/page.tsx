import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, GraduationCap, Library, NotebookPen } from "lucide-react";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Raffy Use Cases | Readers, Students and Researchers",
  description: "See how Raffy helps readers, students, researchers, and book collectors organize libraries and reading notes.",
  keywords: site.keywordsEn,
  alternates: { canonical: "/en/use-cases", languages: { ar: "/use-cases", en: "/en/use-cases", "x-default": "/use-cases" } },
};

const cases = [
  ["Readers", "Keep books, notes, and ratings in one searchable place.", BookOpen],
  ["Students", "Organize course books and references by subject or project.", GraduationCap],
  ["Researchers", "Collect references and reading notes without losing context.", NotebookPen],
  ["Book collectors", "Use shelves, categories, and authors to reach each book quickly.", Library],
] as const;

export default function EnglishUseCasesPage() {
  return (
    <main dir="ltr" className="min-h-screen bg-stone-50 text-stone-950 dark:bg-slate-950 dark:text-slate-50">
      <MarketingHeader locale="en" />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
          Raffy fits anyone who wants a clearer view of their personal library.
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
          Start using Raffy
        </Link>
      </section>
      <MarketingFooter locale="en" />
    </main>
  );
}
