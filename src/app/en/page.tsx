import type { Metadata } from "next";
import Link from "next/link";
import { Cloud, Database, Languages, Layers3, Moon, Search } from "lucide-react";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Raffy | Personal Library Organizer and Offline Book Tracker",
  description: site.descriptionEn,
  keywords: site.keywordsEn,
  alternates: {
    canonical: "/en",
    languages: { ar: "/", en: "/en", "x-default": "/" },
  },
  openGraph: {
    title: "Raffy | Personal Library Organizer",
    description: site.descriptionEn,
    url: "/en",
    siteName: "Raffy",
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary", title: "Raffy | Personal Library Organizer", description: site.descriptionEn },
};

const features = [
  ["Fast search", "Find any book by title, author, category, shelf, or notes.", Search],
  ["Flexible organization", "Create authors, categories, and shelves that match your library.", Layers3],
  ["Offline work", "Use Raffy on your phone offline; it syncs when connection returns.", Cloud],
  ["Portable backups", "Export and import your personal library whenever you need.", Database],
  ["Dark mode", "A calm interface for daily book management.", Moon],
  ["Arabic and English", "A comfortable bilingual experience for readers and collectors.", Languages],
] as const;

export default function EnglishHome() {
  return (
    <main dir="ltr" className="min-h-screen bg-stone-50 text-stone-950 dark:bg-slate-950 dark:text-slate-50">
      <SeoJsonLd locale="en" page="home" />
      <MarketingHeader locale="en" />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[1fr_460px] lg:px-8 lg:pt-14">
        <div className="flex flex-col justify-center">
          <p className="w-fit rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
            A calmer home for your personal library
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            Raffy keeps your books, notes, authors, and shelves beautifully organized.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-700 dark:text-slate-300">
            Add books, track authors and categories, keep acquisition dates and reading notes,
            and continue working from your phone even when the internet drops. Raffy saves your
            edits locally and syncs them when you reconnect.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="primary-link h-12 px-5 text-base" href="/auth/sign-up">
              Start your library
            </Link>
            <Link className="secondary-link h-12 px-5 text-base" href="/en/about">
              Read the story
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-3">
            {features.map(([title, text, Icon]) => (
              <div key={title} className="flex gap-3 rounded-md border border-stone-100 bg-stone-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-teal-700 text-white">
                  <Icon size={18} />
                </span>
                <div>
                  <h2 className="font-semibold">{title}</h2>
                  <p className="mt-1 text-sm leading-6 text-stone-600 dark:text-slate-400">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <MarketingFooter locale="en" />
    </main>
  );
}
