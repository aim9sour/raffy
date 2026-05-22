import type { Metadata } from "next";
import { Award, BrainCircuit, Code, Link, Mail, MessageCircle, Sparkles, Users } from "lucide-react";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import { PersonJsonLd } from "@/components/person-json-ld";
import { creator, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Abdullah Mansour | Creator of Raffy",
  description:
    "Meet Abdullah Mansour, an Egyptian applied AI engineer, accessibility-focused maker, open-source contributor, and creator of Raffy and Hassila.",
  keywords: ["Abdullah Mansour", "aim9sour", ...site.keywordsEn],
  alternates: { canonical: "/en/creator", languages: { ar: "/creator", en: "/en/creator", "x-default": "/creator" } },
};

const highlights = [
  ["Applied AI", "Works in applied artificial intelligence and turns ideas into useful tools.", BrainCircuit],
  ["Accessibility", "Practical accessibility experience and a strong focus on respectful user experiences.", Sparkles],
  ["Community impact", "Helped and mentored more than 1,000 people toward online work and digital opportunities.", Users],
  ["Certified learning", "Holds recognized certificates from Google, IBM, Microsoft, Amazon and others in digital marketing and AI.", Award],
] as const;

export default function EnglishCreatorPage() {
  return (
    <main dir="ltr" className="min-h-screen bg-stone-50 text-stone-950 dark:bg-slate-950 dark:text-slate-50">
      <PersonJsonLd />
      <MarketingHeader locale="en" />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="w-fit rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
          Developed by
        </p>
        <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
          {creator.nameEn}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-700 dark:text-slate-300">
          Abdullah Mansour is an Egyptian technologist passionate about applied artificial intelligence.
          He works as an Applied AI Engineer, contributes to open-source projects on GitHub, and created
          projects such as Raffy and Hassila. His journey began in digital marketing before shifting into
          applied AI to build practical tools that help people.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-700 dark:text-slate-300">
          Raffy is more than a book organizer; it is a small digital gift to the community and a belief
          that technology can be calmer, more accessible, and more human.
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
            WhatsApp
          </a>
          <a className="secondary-link h-12 px-5 text-base" href={`mailto:${creator.email}`}>
            <Mail size={18} />
            Email
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
      <MarketingFooter locale="en" />
    </main>
  );
}
