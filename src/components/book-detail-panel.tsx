"use client";

import { ArrowLeft, CalendarDays, Edit3, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import type { BookInput, LibraryBook } from "@/lib/book-schema";
import type { Locale } from "@/lib/i18n";
import { BookCoverTile, InlineEditButton } from "./library-covers";

type Props = {
  book: LibraryBook;
  locale: Locale;
  onBack: () => void;
  onEdit: (book: LibraryBook) => void;
  onDelete: (book: LibraryBook) => void;
  onSaveNotes: (book: LibraryBook, notes: string) => Promise<void>;
  onOpenAuthor: (author: string) => void;
  onOpenCategory: (category: string) => void;
  onOpenShelf: (category: string, shelf: string) => void;
};

const copy = {
  ar: {
    back: "رجوع",
    edit: "تعديل كامل",
    delete: "حذف",
    notes: "الملاحظات",
    saveNotes: "حفظ الملاحظات",
    saving: "جار الحفظ",
    noNotes: "لا توجد ملاحظات بعد.",
    author: "المؤلف",
    category: "الفئة",
    shelf: "الرف",
    acquiredAt: "تاريخ الاقتناء",
    status: { UNREAD: "لم يبدأ", READING: "يقرأ الآن", READ: "انتهى" },
    rating: "التقييم",
    noAuthor: "بدون مؤلف",
  },
  en: {
    back: "Back",
    edit: "Edit all",
    delete: "Delete",
    notes: "Notes",
    saveNotes: "Save notes",
    saving: "Saving",
    noNotes: "No notes yet.",
    author: "Author",
    category: "Category",
    shelf: "Shelf",
    acquiredAt: "Acquired date",
    status: { UNREAD: "Not started", READING: "Reading", READ: "Finished" },
    rating: "Rating",
    noAuthor: "No author",
  },
};

export function BookDetailPanel({
  book,
  locale,
  onBack,
  onEdit,
  onDelete,
  onSaveNotes,
  onOpenAuthor,
  onOpenCategory,
  onOpenShelf,
}: Props) {
  const t = copy[locale];
  const [notes, setNotes] = useState(book.notes);
  const [saving, setSaving] = useState(false);

  async function saveNotes() {
    setSaving(true);
    try {
      await onSaveNotes(book, notes);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button type="button" onClick={onBack} className="secondary-button">
          <ArrowLeft size={17} />
          {t.back}
        </button>
        <div className="flex flex-wrap gap-2">
          <InlineEditButton label={t.edit} onClick={() => onEdit(book)} />
          <button type="button" onClick={() => onDelete(book)} className="secondary-button text-rose-700 dark:text-rose-300">
            <Trash2 size={17} />
            {t.delete}
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="max-w-[260px]">
          <BookCoverTile book={book} locale={locale} onOpen={() => undefined} />
        </div>

        <div className="min-w-0">
          <h2 className="text-3xl font-bold leading-tight text-stone-950 dark:text-slate-50">{book.title}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill label={t.author} value={book.author || t.noAuthor} disabled={!book.author} onClick={() => book.author && onOpenAuthor(book.author)} />
            <Pill label={t.category} value={book.category} onClick={() => onOpenCategory(book.category)} />
            <Pill label={t.shelf} value={book.shelf} onClick={() => onOpenShelf(book.category, book.shelf)} />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Info icon={<CalendarDays size={17} />} label={t.acquiredAt} value={book.acquiredAt ?? "-"} />
            <Info icon={<Edit3 size={17} />} label={locale === "ar" ? "الحالة" : "Status"} value={t.status[book.status]} />
            <Info icon={<Star size={17} />} label={t.rating} value={book.rating ? `${book.rating}/5` : "-"} />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold">{t.notes}</h3>
              <button type="button" onClick={() => void saveNotes()} disabled={saving || notes === book.notes} className="secondary-button disabled:cursor-not-allowed disabled:opacity-50">
                {saving ? t.saving : t.saveNotes}
              </button>
            </div>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder={t.noNotes}
              className="input mt-3 min-h-44 resize-y leading-7"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function bookToInput(book: LibraryBook): BookInput {
  return {
    title: book.title,
    author: book.author,
    coverUrl: book.coverUrl,
    category: book.category,
    shelf: book.shelf,
    acquiredAt: book.acquiredAt,
    status: book.status,
    rating: book.rating,
    notes: book.notes,
  };
}

function Pill({
  label,
  value,
  onClick,
  disabled,
}: {
  label: string;
  value: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-start text-sm transition hover:border-teal-500 disabled:cursor-default disabled:hover:border-stone-200 dark:border-slate-700 dark:bg-slate-950 dark:disabled:hover:border-slate-700"
    >
      <span className="block text-xs text-stone-500 dark:text-slate-400">{label}</span>
      <span className="font-semibold text-stone-900 dark:text-slate-100">{value}</span>
    </button>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-2 text-stone-500 dark:text-slate-400">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}
