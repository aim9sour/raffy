"use client";

import { Save, X } from "lucide-react";
import { useState } from "react";
import type { BookInput, LibraryBook, ReadingStatus } from "@/lib/book-schema";
import type { Locale } from "@/lib/i18n";
import type { EntityView } from "./entity-manager";

const emptyBook: BookInput = {
  title: "",
  author: "",
  coverUrl: "",
  category: "Uncategorized",
  shelf: "General",
  acquiredAt: null,
  status: "UNREAD",
  rating: null,
  notes: "",
};

type Props = {
  book: LibraryBook | null;
  entities: EntityView[];
  locale: Locale;
  onClose: () => void;
  onSave: (book: BookInput, id?: string) => Promise<void>;
};

const copy = {
  ar: {
    add: "إضافة كتاب",
    edit: "تعديل كتاب",
    close: "إغلاق",
    title: "اسم الكتاب *",
    author: "المؤلف",
    noAuthor: "بدون مؤلف",
    coverUrl: "رابط الغلاف",
    category: "الفئة",
    uncategorized: "غير مصنف",
    shelf: "الرف",
    general: "عام",
    acquiredAt: "تاريخ الاقتناء",
    status: "الحالة",
    unread: "لم يبدأ",
    reading: "يقرأ الآن",
    read: "انتهى",
    rating: "التقييم",
    notes: "ملاحظات",
    saving: "جاري الحفظ",
    save: "حفظ",
  },
  en: {
    add: "Add book",
    edit: "Edit book",
    close: "Close",
    title: "Book title *",
    author: "Author",
    noAuthor: "No author",
    coverUrl: "Cover URL",
    category: "Category",
    uncategorized: "Uncategorized",
    shelf: "Shelf",
    general: "General",
    acquiredAt: "Acquired date",
    status: "Status",
    unread: "Not started",
    reading: "Reading",
    read: "Finished",
    rating: "Rating",
    notes: "Notes",
    saving: "Saving",
    save: "Save",
  },
};

export function BookForm({ book, entities, locale, onClose, onSave }: Props) {
  const [form, setForm] = useState<BookInput>(() => getInitialForm(book));
  const [saving, setSaving] = useState(false);
  const t = copy[locale];

  const authors = entities.filter((entity) => entity.type === "AUTHOR");
  const categories = entities.filter((entity) => entity.type === "CATEGORY");
  const shelves = entities.filter((entity) => entity.type === "SHELF");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await onSave(form, book?.id);
      setForm(emptyBook);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-lg border border-stone-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-stone-950 dark:text-slate-50">
          {book ? t.edit : t.add}
        </h2>
        <button
          type="button"
          onClick={onClose}
          title={t.close}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <X size={18} />
        </button>
      </div>

      <Field label={t.title}>
        <input
          required
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          className="input"
        />
      </Field>

      <Field label={t.author}>
        <select
          value={form.author}
          onChange={(event) => setForm({ ...form, author: event.target.value })}
          className="input"
        >
          <option value="">{t.noAuthor}</option>
          {authors.map((author) => (
            <option key={author.id} value={author.name}>
              {author.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t.coverUrl}>
        <input
          value={form.coverUrl}
          onChange={(event) => setForm({ ...form, coverUrl: event.target.value })}
          className="input"
          placeholder="https://..."
          dir="ltr"
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t.category}>
          <select
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
            className="input"
          >
            <option value="Uncategorized">{t.uncategorized}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t.shelf}>
          <select
            value={form.shelf}
            onChange={(event) => setForm({ ...form, shelf: event.target.value })}
            className="input"
          >
            <option value="General">{t.general}</option>
            {shelves.map((shelf) => (
              <option key={shelf.id} value={shelf.name}>
                {shelf.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Field label={t.acquiredAt}>
          <input
            type="date"
            value={form.acquiredAt ?? ""}
            onChange={(event) => setForm({ ...form, acquiredAt: event.target.value || null })}
            className="input"
          />
        </Field>
        <Field label={t.status}>
          <select
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value as ReadingStatus })}
            className="input"
          >
            <option value="UNREAD">{t.unread}</option>
            <option value="READING">{t.reading}</option>
            <option value="READ">{t.read}</option>
          </select>
        </Field>
        <Field label={t.rating}>
          <input
            type="number"
            min="1"
            max="5"
            value={form.rating ?? ""}
            onChange={(event) =>
              setForm({
                ...form,
                rating: event.target.value ? Number(event.target.value) : null,
              })
            }
            className="input"
          />
        </Field>
      </div>

      <Field label={t.notes}>
        <textarea
          value={form.notes}
          onChange={(event) => setForm({ ...form, notes: event.target.value })}
          className="input min-h-28 resize-y"
        />
      </Field>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save size={17} />
        {saving ? t.saving : t.save}
      </button>
    </form>
  );
}

function getInitialForm(book: LibraryBook | null): BookInput {
  return book
    ? {
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        category: book.category,
        shelf: book.shelf,
        acquiredAt: book.acquiredAt,
        status: book.status,
        rating: book.rating,
        notes: book.notes,
      }
    : emptyBook;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5 text-sm font-medium text-stone-700 dark:text-slate-300">
      <span>{label}</span>
      {children}
    </label>
  );
}
