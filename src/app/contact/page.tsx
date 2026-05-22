import type { Metadata } from "next";
import { Code, Link, Mail, MessageCircle } from "lucide-react";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import { creator, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "تواصل معنا | رَفّي",
  description: "تواصل مع مطور رَفّي المهندس عبد الله منصور عبر واتساب أو البريد أو LinkedIn أو GitHub.",
  keywords: ["تواصل رفي", "عبد الله منصور", ...site.keywordsAr],
  alternates: { canonical: "/contact", languages: { ar: "/contact", en: "/en/contact", "x-default": "/contact" } },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950 dark:bg-slate-950 dark:text-slate-50">
      <MarketingHeader locale="ar" />
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">تواصل مع مطور رَفّي</h1>
        <p className="mt-5 text-lg leading-8 text-stone-700 dark:text-slate-300">
          لأي اقتراح، تعاون، استشارة، أو حديث حول الذكاء الاصطناعي التطبيقي والوصولية والمشاريع الرقمية.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <ContactLink icon={<MessageCircle size={20} />} label="واتساب" value={creator.phone} href={creator.whatsapp} />
          <ContactLink icon={<Mail size={20} />} label="البريد الإلكتروني" value={creator.email} href={`mailto:${creator.email}`} />
          <ContactLink icon={<Link size={20} />} label="LinkedIn" value="linkedin.com/in/aim9sour" href={creator.linkedin} />
          <ContactLink icon={<Code size={20} />} label="GitHub" value="github.com/aim9sour" href={creator.github} />
        </div>
      </section>
      <MarketingFooter locale="ar" />
    </main>
  );
}

function ContactLink({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href: string }) {
  return (
    <a href={href} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:border-teal-500 dark:border-slate-800 dark:bg-slate-900">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-teal-700 text-white">{icon}</span>
      <h2 className="mt-4 font-semibold">{label}</h2>
      <p className="mt-1 break-words text-sm text-stone-600 dark:text-slate-400">{value}</p>
    </a>
  );
}
