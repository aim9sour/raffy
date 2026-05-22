import Link from "next/link";
import {
  BookMarked,
  Cloud,
  Database,
  Moon,
  Pencil,
  Search,
  Shield,
  Tags,
} from "lucide-react";
import { LanguageLink } from "@/components/language-link";

type Locale = "ar" | "en";

const content = {
  ar: {
    dir: "rtl",
    badge: "مميزات رَفّي",
    title: "كل ما تحتاجه لتنظيم مكتبتك الشخصية من الهاتف أو الكمبيوتر.",
    intro:
      "رَفّي يجمع إدارة الكتب، المؤلفين، الفئات، الرفوف، الملاحظات، النسخ الاحتياطي، والعمل دون اتصال في تجربة واحدة بسيطة.",
    cta: "ابدأ تنظيم مكتبتك",
    secondary: "النسخة الإنجليزية",
    secondaryHref: "/en/features",
    items: [
      ["كتالوج كتب واضح", "أضف اسم الكتاب والغلاف والمؤلف والحالة والتقييم وتاريخ الاقتناء.", BookMarked],
      ["مؤلفون وفئات ورفوف", "أنشئ وعدّل واحذف عناصر التنظيم بدون جعل كل الحقول إجبارية.", Tags],
      ["بحث وفلاتر", "اعثر على الكتاب من الاسم أو المؤلف أو الفئة أو الرف أو الملاحظات.", Search],
      ["ملاحظات القراءة", "احتفظ بملاحظاتك وانطباعاتك بجانب كل كتاب.", Pencil],
      ["يعمل دون اتصال", "استخدم التطبيق على الهاتف بدون إنترنت، ثم تتم المزامنة تلقائيًا.", Cloud],
      ["استيراد وتصدير", "انقل بيانات مكتبتك بصيغة JSON تشمل الكتب والكيانات التنظيمية.", Database],
      ["وضع ليلي", "واجهة هادئة ومريحة للاستخدام اليومي.", Moon],
      ["حسابات منفصلة", "تسجيل دخول بالبريد وكلمة المرور مع بيانات منفصلة لكل مستخدم.", Shield],
    ],
  },
  en: {
    dir: "ltr",
    badge: "Raffy features",
    title: "Everything you need to organize a personal book library.",
    intro:
      "Raffy combines books, authors, categories, shelves, reading notes, backups, offline work, and automatic sync in one simple PWA.",
    cta: "Start organizing",
    secondary: "Arabic version",
    secondaryHref: "/features",
    items: [
      ["Book catalog", "Track title, cover, author, status, rating, notes, and acquisition date.", BookMarked],
      ["Authors and shelves", "Create, edit, and delete authors, categories, and shelves without forcing every field.", Tags],
      ["Search and filters", "Find books by title, author, category, shelf, reading status, or notes.", Search],
      ["Reading notes", "Keep thoughts and summaries attached to each book.", Pencil],
      ["Offline-first", "Use the mobile PWA offline; Raffy syncs edits when connection returns.", Cloud],
      ["Import and export", "Move your library with JSON backups that include books and organization data.", Database],
      ["Dark mode", "A calm interface for daily use.", Moon],
      ["Private accounts", "Email and password login with separated user data.", Shield],
    ],
  },
} satisfies Record<Locale, { dir: "rtl" | "ltr"; badge: string; title: string; intro: string; cta: string; secondary: string; secondaryHref: string; items: [string, string, typeof BookMarked][] }>;

export function FeaturesContent({ locale }: { locale: Locale }) {
  const copy = content[locale];

  return (
    <main
      dir={copy.dir}
      className="min-h-screen bg-stone-50 text-stone-950 dark:bg-slate-950 dark:text-slate-50"
    >
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="w-fit rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
          {copy.badge}
        </p>
        <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
          {copy.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-700 dark:text-slate-300">
          {copy.intro}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link className="primary-link h-12 px-5 text-base" href="/auth/sign-up">
            {copy.cta}
          </Link>
          <LanguageLink href={copy.secondaryHref} label={copy.secondary} />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.items.map(([title, text, Icon]) => (
            <article
              key={title}
              className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-teal-700 text-white">
                <Icon size={19} />
              </span>
              <h2 className="mt-4 font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-slate-400">
                {text}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
