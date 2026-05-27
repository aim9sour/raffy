"use client";

import { Save, X } from "lucide-react";
import { useState } from "react";
import type { BookInput, LibraryBook, ReadingStatus } from "@/lib/book-schema";
import { getShelfOptionsForCategory } from "@/lib/book-navigation";
import type { Locale } from "@/lib/i18n";
import type { EntityView } from "./entity-manager";

const emptyBook: BookInput = {
  title: "",
  author: "",
  coverUrl: "",
  category: "",
  shelf: "",
  acquiredAt: null,
  status: "UNREAD",
  rating: null,
  notes: "",
};

type Props = {
  book: LibraryBook | null;
  entities: EntityView[];
  books: LibraryBook[];
  locale: Locale;
  onClose: () => void;
  onSave: (book: BookInput, id?: string) => Promise<void>;
  surface?: "card" | "plain";
  hideHeader?: boolean;
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
    createEntitiesFirst: "أنشئ الفئات والرفوف والمؤلفين من إدارة العناصر أولا.",
    chooseCategoryFirst: "اختر الفئة أولا",
    noShelves: "لا توجد رفوف داخل هذه الفئة",
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
    createEntitiesFirst: "Create categories, shelves and authors from item management first.",
    chooseCategoryFirst: "Choose a category first",
    noShelves: "No shelves inside this category",
  },
};

export function BookForm({
  book,
  entities,
  books,
  locale,
  onClose,
  onSave,
  surface = "card",
  hideHeader = false,
}: Props) {
  const [form, setForm] = useState<BookInput>(() => getInitialForm(book));
  const [saving, setSaving] = useState(false);
  const t = copy[locale];

  const authors = entities.filter((entity) => entity.type === "AUTHOR");
  const categories = entities.filter((entity) => entity.type === "CATEGORY");
  const shelves = entities.filter((entity) => entity.type === "SHELF");
  const authorOptions = ensureOption(authors.map((author) => author.name), form.author);
  const categoryOptions = ensureOption(categories.map((category) => category.name), form.category);
  const shelfOptions = getShelfOptionsForCategory(
    books,
    shelves.map((item) => ({ name: item.name, category: item.category })),
    form.category,
    form.shelf,
  );
  const canSave = Boolean(form.title.trim()) && Boolean(form.category) && Boolean(form.shelf);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;
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
      className={
        surface === "card"
          ? "space-y-4 rounded-lg border border-stone-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          : "space-y-4"
      }
    >
      {hideHeader ? null : (
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
      )}

      <Field label={t.title}>
        <input
          required
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          className="input"
        />
      </Field>

      <Field label={t.author}>
        <input
          value={form.author}
          onChange={(event) => setForm({ ...form, author: event.target.value })}
          className="input"
          list="author-suggestions"
          placeholder={t.noAuthor}
        />
        <datalist id="author-suggestions">
          {authorOptions.map((author) => (
            <option key={author} value={author} />
          ))}
        </datalist>
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
            required
            value={form.category}
            onChange={(event) => {
              const nextCategory = event.target.value;
              const nextShelves = getShelfOptionsForCategory(
                books,
                shelves.map((item) => ({ name: item.name, category: item.category })),
                nextCategory,
              );
              setForm({ ...form, category: nextCategory, shelf: nextShelves[0] ?? "" });
            }}
            className="input"
          >
            <option value="">{categories.length === 0 ? t.createEntitiesFirst : t.category}</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category === "Uncategorized" ? t.uncategorized : category}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t.shelf}>
          <select
            required
            value={form.shelf}
            onChange={(event) => setForm({ ...form, shelf: event.target.value })}
            className="input"
            disabled={!form.category || shelfOptions.length === 0}
          >
            <option value="">
              {!form.category ? t.chooseCategoryFirst : t.noShelves}
            </option>
            {shelfOptions.map((shelf) => (
              <option key={shelf} value={shelf}>
                {shelf === "General" ? t.general : shelf}
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
        disabled={saving || !canSave}
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

function ensureOption(options: string[], value: string) {
  const normalized = Array.from(new Set(options.filter(Boolean)));
  return value && !normalized.includes(value) ? [value, ...normalized] : normalized;
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
