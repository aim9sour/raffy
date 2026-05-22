"use client";

import { BookOpen, CalendarDays, Pencil, Star, Trash2 } from "lucide-react";
import type { LibraryBook } from "@/lib/book-schema";
import type { Locale } from "@/lib/i18n";

type Props = {
  book: LibraryBook;
  locale: Locale;
  onEdit: (book: LibraryBook) => void;
  onDelete: (book: LibraryBook) => void;
};

const copy = {
  ar: {
    status: { UNREAD: "لم يبدأ", READING: "يقرأ الآن", READ: "انتهى" },
    noAuthor: "بدون مؤلف",
    cover: "غلاف",
    edit: "تعديل",
    delete: "حذف",
    noNotes: "لا توجد ملاحظات بعد.",
  },
  en: {
    status: { UNREAD: "Not started", READING: "Reading", READ: "Finished" },
    noAuthor: "No author",
    cover: "Cover",
    edit: "Edit",
    delete: "Delete",
    noNotes: "No notes yet.",
  },
};

export function BookCard({ book, locale, onEdit, onDelete }: Props) {
  const t = copy[locale];

  return (
    <article className="grid min-h-[240px] grid-cols-[96px_1fr] gap-4 rounded-lg border border-stone-200 bg-white p-3 shadow-sm transition hover:border-teal-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-400">
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-stone-200 dark:bg-slate-800">
        {book.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverUrl}
            alt={`${t.cover} ${book.title}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone-500 dark:text-slate-400">
            <BookOpen size={30} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-base font-semibold text-stone-950 dark:text-slate-50">
              {book.title}
            </h3>
            <p className="mt-1 truncate text-sm text-stone-600 dark:text-slate-400">
              {book.author || t.noAuthor}
            </p>
          </div>
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              title={t.edit}
              onClick={() => onEdit(book)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-stone-600 hover:bg-stone-100 hover:text-stone-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              title={t.delete}
              onClick={() => onDelete(book)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/40"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded bg-teal-50 px-2 py-1 text-teal-800 dark:bg-teal-950 dark:text-teal-200">
            {book.shelf}
          </span>
          <span className="rounded bg-indigo-50 px-2 py-1 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200">
            {book.category}
          </span>
          <span className="rounded bg-amber-50 px-2 py-1 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
            {t.status[book.status]}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-3 text-xs text-stone-500 dark:text-slate-400">
          {book.acquiredAt ? (
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={14} />
              {book.acquiredAt}
            </span>
          ) : null}
          {book.rating ? (
            <span className="inline-flex items-center gap-1">
              <Star size={14} />
              {book.rating}/5
            </span>
          ) : null}
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-700 dark:text-slate-300">
          {book.notes || t.noNotes}
        </p>
      </div>
    </article>
  );
}
