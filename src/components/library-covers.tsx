"use client";

import { BookOpen, FolderOpen, LibraryBig, PenLine, UserRound } from "lucide-react";
import type { LibraryBook } from "@/lib/book-schema";
import type { Locale } from "@/lib/i18n";

type CoverKind = "category" | "shelf" | "author" | "book";

type CollectionCoverProps = {
  kind: Exclude<CoverKind, "book">;
  title: string;
  subtitle: string;
  stats: Array<{ label: string; value: number }>;
  locale: Locale;
  onClick: () => void;
};

type BookCoverTileProps = {
  book: LibraryBook;
  locale: Locale;
  onOpen: (book: LibraryBook) => void;
};

const kindIcon = {
  category: FolderOpen,
  shelf: LibraryBig,
  author: UserRound,
};

export function CollectionCover({
  kind,
  title,
  subtitle,
  stats,
  locale,
  onClick,
}: CollectionCoverProps) {
  const Icon = kindIcon[kind];
  const palette = coverPalette(`${kind}-${title}`);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group min-h-[230px] overflow-hidden rounded-lg border border-stone-200 bg-white text-start shadow-sm transition hover:-translate-y-0.5 hover:border-teal-500 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
    >
      <div
        className={`relative flex aspect-[4/3] flex-col justify-between overflow-hidden p-5 text-white ${palette.background}`}
      >
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_15%,white_0,transparent_28%),radial-gradient(circle_at_90%_20%,white_0,transparent_18%)]" />
        <div className="relative flex items-center justify-between gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-white/15 backdrop-blur">
            <Icon size={24} />
          </span>
          <span className="rounded-full bg-black/15 px-3 py-1 text-xs font-semibold">
            {subtitle}
          </span>
        </div>
        <div className="relative">
          <p className="line-clamp-2 text-2xl font-bold leading-tight">{title}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {stats.map((item) => (
              <span key={item.label} className="rounded-md bg-white/15 px-3 py-2 backdrop-blur">
                <span className="block text-lg font-bold">{item.value}</span>
                <span className="block text-xs opacity-85">{item.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-stone-700 dark:text-slate-200">
        <span>{locale === "ar" ? "استعراض" : "Browse"}</span>
        <span className="transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1">→</span>
      </div>
    </button>
  );
}

export function BookCoverTile({ book, locale, onOpen }: BookCoverTileProps) {
  const palette = coverPalette(`book-${book.title}-${book.author}`);

  return (
    <button
      type="button"
      onClick={() => onOpen(book)}
      className="group overflow-hidden rounded-lg border border-stone-200 bg-white text-start shadow-sm transition hover:-translate-y-0.5 hover:border-teal-500 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-stone-200 dark:bg-slate-800">
        {book.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
        ) : (
          <div className={`flex h-full w-full flex-col justify-between p-5 text-white ${palette.background}`}>
            <div className="flex items-center justify-between">
              <BookOpen size={28} />
              {book.rating ? (
                <span className="rounded-full bg-black/20 px-2 py-1 text-xs font-bold">
                  {book.rating}/5
                </span>
              ) : null}
            </div>
            <div>
              <p className="line-clamp-4 text-2xl font-bold leading-tight">{book.title}</p>
              <p className="mt-3 line-clamp-2 text-sm opacity-85">{book.author || (locale === "ar" ? "بدون مؤلف" : "No author")}</p>
            </div>
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <p className="line-clamp-2 font-semibold text-stone-950 dark:text-slate-50">{book.title}</p>
        <p className="line-clamp-1 text-sm text-stone-600 dark:text-slate-400">{book.author || (locale === "ar" ? "بدون مؤلف" : "No author")}</p>
        <div className="flex flex-wrap gap-1.5 text-xs">
          <span className="rounded bg-teal-50 px-2 py-1 text-teal-800 dark:bg-teal-950 dark:text-teal-200">{book.category}</span>
          <span className="rounded bg-stone-100 px-2 py-1 text-stone-700 dark:bg-slate-800 dark:text-slate-300">{book.shelf}</span>
        </div>
      </div>
    </button>
  );
}

export function InlineEditButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 bg-white px-3 text-sm font-semibold text-stone-700 hover:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
    >
      <PenLine size={15} />
      {label}
    </button>
  );
}

function coverPalette(seed: string) {
  const palettes = [
    "bg-[linear-gradient(135deg,#0f766e,#164e63)]",
    "bg-[linear-gradient(135deg,#7c2d12,#0f766e)]",
    "bg-[linear-gradient(135deg,#1d4ed8,#166534)]",
    "bg-[linear-gradient(135deg,#831843,#365314)]",
    "bg-[linear-gradient(135deg,#4338ca,#0f766e)]",
    "bg-[linear-gradient(135deg,#334155,#0f766e)]",
  ];
  const index = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0) % palettes.length;
  return { background: palettes[index] };
}
