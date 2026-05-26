"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";

export type EntityType = "AUTHOR" | "CATEGORY" | "SHELF";

export type EntityView = {
  id: string;
  type: EntityType;
  name: string;
};

export type EntityUpdateInput = {
  type: EntityType;
  name: string;
};

const copy = {
  ar: {
    title: "إدارة المؤلفين والفئات والرفوف",
    add: "إضافة",
    save: "حفظ",
    cancel: "إلغاء",
    edit: "تعديل",
    delete: "حذف",
    empty: "لا توجد عناصر بعد.",
    labels: {
      AUTHOR: { singular: "مؤلف", plural: "المؤلفون" },
      CATEGORY: { singular: "فئة", plural: "الفئات" },
      SHELF: { singular: "رف", plural: "الرفوف" },
    },
  },
  en: {
    title: "Authors, categories and shelves",
    add: "Add",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    empty: "No items yet.",
    labels: {
      AUTHOR: { singular: "Author", plural: "Authors" },
      CATEGORY: { singular: "Category", plural: "Categories" },
      SHELF: { singular: "Shelf", plural: "Shelves" },
    },
  },
};

type Props = {
  entities: EntityView[];
  locale: Locale;
  onCreate: (type: EntityType, name: string) => Promise<void>;
  onUpdate: (id: string, input: EntityUpdateInput, previous: EntityView) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function EntityManager({ entities, locale, onCreate, onUpdate, onDelete }: Props) {
  const [type, setType] = useState<EntityType>("AUTHOR");
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<EntityType>("AUTHOR");
  const [editingName, setEditingName] = useState("");
  const [busy, setBusy] = useState(false);
  const t = copy[locale];

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      await onCreate(type, name);
      setName("");
    } finally {
      setBusy(false);
    }
  }

  async function saveEdit(entity: EntityView) {
    if (!editingName.trim()) return;
    setBusy(true);
    try {
      await onUpdate(entity.id, { type: editingType, name: editingName }, entity);
      setEditingId(null);
      setEditingType("AUTHOR");
      setEditingName("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="font-semibold">{t.title}</h2>
      <form onSubmit={submit} className="mt-4 grid gap-2 sm:grid-cols-[130px_1fr_auto]">
        <select
          value={type}
          onChange={(event) => setType(event.target.value as EntityType)}
          className="input"
        >
          <option value="AUTHOR">{t.labels.AUTHOR.singular}</option>
          <option value="CATEGORY">{t.labels.CATEGORY.singular}</option>
          <option value="SHELF">{t.labels.SHELF.singular}</option>
        </select>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="input"
          placeholder={`${locale === "ar" ? "اسم" : "Name"} ${t.labels[type].singular}`}
        />
        <button type="submit" disabled={busy} className="secondary-button">
          <Plus size={17} />
          {t.add}
        </button>
      </form>

      <div className="mt-4 grid gap-4">
        {(["AUTHOR", "CATEGORY", "SHELF"] as EntityType[]).map((groupType) => {
          const groupItems = entities.filter((entity) => entity.type === groupType);
          return (
            <div key={groupType}>
              <h3 className="text-sm font-semibold text-stone-700 dark:text-slate-300">
                {t.labels[groupType].plural}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {groupItems.length === 0 ? (
                  <span className="text-sm text-stone-500 dark:text-slate-400">
                    {t.empty}
                  </span>
                ) : null}
                {groupItems.map((entity) => (
                  <span
                    key={entity.id}
                    className="inline-flex max-w-full items-center gap-1 rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950"
                  >
                    {editingId === entity.id ? (
                      <>
                        <select
                          value={editingType}
                          onChange={(event) => setEditingType(event.target.value as EntityType)}
                          className="h-7 rounded border border-stone-300 bg-white px-2 text-sm text-stone-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                        >
                          <option value="AUTHOR">{t.labels.AUTHOR.singular}</option>
                          <option value="CATEGORY">{t.labels.CATEGORY.singular}</option>
                          <option value="SHELF">{t.labels.SHELF.singular}</option>
                        </select>
                        <input
                          value={editingName}
                          onChange={(event) => setEditingName(event.target.value)}
                          className="h-7 min-w-0 rounded border border-stone-300 bg-white px-2 text-sm text-stone-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                        />
                        <button
                          type="button"
                          onClick={() => void saveEdit(entity)}
                          className="text-teal-700 dark:text-teal-300"
                        >
                          {t.save}
                        </button>
                        <button
                          type="button"
                          title={t.cancel}
                          onClick={() => setEditingId(null)}
                        >
                          <X size={15} />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="truncate">{entity.name}</span>
                        <button
                          type="button"
                          title={t.edit}
                          onClick={() => {
                            setEditingId(entity.id);
                            setEditingType(entity.type);
                            setEditingName(entity.name);
                          }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          title={t.delete}
                          onClick={() => void onDelete(entity.id)}
                          className="text-rose-600 dark:text-rose-300"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
