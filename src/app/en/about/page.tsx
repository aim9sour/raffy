import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Raffy | Personal Library Organizer",
  description: "Raffy is a free personal library organizer built to make books, notes, authors, and shelves easier to manage every day.",
  keywords: site.keywordsEn,
  alternates: { canonical: "/en/about", languages: { ar: "/about", en: "/en/about", "x-default": "/about" } },
};

export default function EnglishAboutPage() {
  return (
    <main dir="ltr" className="min-h-screen bg-stone-50 text-stone-950 dark:bg-slate-950 dark:text-slate-50">
      <MarketingHeader locale="en" />
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="w-fit rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
          About Raffy
        </p>
        <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
          Raffy began with a simple idea: your books deserve a clear, beautiful home.
        </h1>
        <div className="mt-8 grid gap-5 text-lg leading-8 text-stone-700 dark:text-slate-300">
          <p>
            Many readers own physical books, digital references, and scattered notes, but they lack a lightweight
            place to answer: what do I own, where is it, when did I get it, and what did I write about it?
          </p>
          <p>
            Raffy brings that together: books, authors, categories, shelves, notes, reading status, import/export,
            and a mobile-friendly experience that keeps working offline.
          </p>
          <p>
            The project is a practical gift to readers, learners, and makers who want a calm memory for their books.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="primary-link h-12 px-5 text-base" href="/auth/sign-up">
            Try Raffy
          </Link>
          <Link className="secondary-link h-12 px-5 text-base" href="/en/creator">
            Meet the creator
          </Link>
        </div>
      </section>
      <MarketingFooter locale="en" />
    </main>
  );
}
