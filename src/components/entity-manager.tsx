"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { AppModal } from "./app-modal";

export type EntityType = "AUTHOR" | "CATEGORY" | "SHELF";

export type EntityView = {
  id: string;
  type: EntityType;
  name: string;
  category: string | null;
};

export type EntityCreateInput = {
  type: EntityType;
  name: string;
  category: string | null;
};

export type EntityUpdateInput = {
  type: EntityType;
  name: string;
  category: string | null;
};

const copy = {
  ar: {
    title: "إدارة المؤلفين والفئات والرفوف",
    add: "إضافة",
    addItem: "إضافة عنصر",
    editItem: "تعديل عنصر",
    save: "حفظ",
    cancel: "إلغاء",
    edit: "تعديل",
    delete: "حذف",
    empty: "لا توجد عناصر بعد.",
    name: "اسم",
    categoryForShelf: "الفئة الخاصة بالرف",
    chooseCategory: "اختر الفئة",
    createCategoryFirst: "أنشئ فئة أولا",
    labels: {
      AUTHOR: { singular: "مؤلف", plural: "المؤلفون" },
      CATEGORY: { singular: "فئة", plural: "الفئات" },
      SHELF: { singular: "رف", plural: "الرفوف" },
    },
  },
  en: {
    title: "Authors, categories and shelves",
    add: "Add",
    addItem: "Add item",
    editItem: "Edit item",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    empty: "No items yet.",
    name: "Name",
    categoryForShelf: "Shelf category",
    chooseCategory: "Choose category",
    createCategoryFirst: "Create a category first",
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
  onCreate: (input: EntityCreateInput) => Promise<void>;
  onUpdate: (id: string, input: EntityUpdateInput, previous: EntityView) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function EntityManager({ entities, locale, onCreate, onUpdate, onDelete }: Props) {
  const [createOpen, setCreateOpen] = useState(false);
  const [type, setType] = useState<EntityType>("AUTHOR");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [editingEntity, setEditingEntity] = useState<EntityView | null>(null);
  const [editingType, setEditingType] = useState<EntityType>("AUTHOR");
  const [editingName, setEditingName] = useState("");
  const [editingCategory, setEditingCategory] = useState("");
  const [busy, setBusy] = useState(false);
  const t = copy[locale];
  const categories = entities.filter((entity) => entity.type === "CATEGORY");
  const canCreate = Boolean(name.trim()) && (type !== "SHELF" || Boolean(category));

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canCreate) return;
    setBusy(true);
    try {
      await onCreate({ type, name, category: type === "SHELF" ? category : null });
      setName("");
      setCategory("");
      setCreateOpen(false);
    } finally {
      setBusy(false);
    }
  }

  async function saveEdit(entity: EntityView) {
    if (!editingName.trim()) return;
    if (editingType === "SHELF" && !editingCategory) return;
    setBusy(true);
    try {
      await onUpdate(
        entity.id,
        {
          type: editingType,
          name: editingName,
          category: editingType === "SHELF" ? editingCategory : null,
        },
        entity,
      );
      closeEditDialog();
    } finally {
      setBusy(false);
    }
  }

  function openCreateDialog(nextType: EntityType = "AUTHOR") {
    setType(nextType);
    setName("");
    setCategory("");
    setCreateOpen(true);
  }

  function closeCreateDialog() {
    setCreateOpen(false);
    setName("");
    setCategory("");
  }

  function openEditDialog(entity: EntityView) {
    setEditingEntity(entity);
    setEditingType(entity.type);
    setEditingName(entity.name);
    setEditingCategory(entity.category ?? "");
  }

  function closeEditDialog() {
    setEditingEntity(null);
    setEditingType("AUTHOR");
    setEditingName("");
    setEditingCategory("");
  }

  return (
    <>
      <section className="rounded-lg border border-stone-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">{t.title}</h2>
          <button
            type="button"
            onClick={() => openCreateDialog()}
            aria-label={t.addItem}
            className="secondary-button"
          >
            <Plus size={17} />
            {t.add}
          </button>
        </div>

        <div className="mt-4 grid gap-4">
          {(["AUTHOR", "CATEGORY", "SHELF"] as EntityType[]).map((groupType) => {
            const groupItems = entities.filter((entity) => entity.type === groupType);
            return (
              <div key={groupType} className="rounded-md border border-stone-200 p-3 dark:border-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-stone-700 dark:text-slate-300">
                    {t.labels[groupType].plural}
                  </h3>
                  <button
                    type="button"
                    onClick={() => openCreateDialog(groupType)}
                    aria-label={`${t.add} ${t.labels[groupType].singular}`}
                    className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-teal-700 hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-950"
                  >
                    <Plus size={14} />
                    {t.add}
                  </button>
                </div>
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
                      <span className="truncate">{entity.name}</span>
                      {entity.type === "SHELF" && entity.category ? (
                        <span className="rounded bg-teal-50 px-1.5 py-0.5 text-xs text-teal-800 dark:bg-teal-950 dark:text-teal-200">
                          {entity.category}
                        </span>
                      ) : null}
                      <button
                        type="button"
                        title={`${t.edit} ${entity.name}`}
                        aria-label={`${t.edit} ${entity.name}`}
                        onClick={() => openEditDialog(entity)}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        title={`${t.delete} ${entity.name}`}
                        aria-label={`${t.delete} ${entity.name}`}
                        onClick={() => void onDelete(entity.id)}
                        className="text-rose-600 dark:text-rose-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {createOpen ? (
        <AppModal title={t.addItem} closeLabel={t.cancel} onClose={closeCreateDialog}>
          <form onSubmit={submit} className="grid gap-3">
            <select
              value={type}
              onChange={(event) => {
                setType(event.target.value as EntityType);
                setCategory("");
              }}
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
              placeholder={`${t.name} ${t.labels[type].singular}`}
            />
            {type === "SHELF" ? (
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="input"
                aria-label={t.categoryForShelf}
                disabled={categories.length === 0}
                required
              >
                <option value="">{categories.length === 0 ? t.createCategoryFirst : t.chooseCategory}</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            ) : null}
            <button type="submit" disabled={busy || !canCreate} className="secondary-button justify-center disabled:cursor-not-allowed disabled:opacity-50">
              <Plus size={17} />
              {t.add}
            </button>
          </form>
        </AppModal>
      ) : null}

      {editingEntity ? (
        <AppModal title={t.editItem} closeLabel={t.cancel} onClose={closeEditDialog}>
          <form onSubmit={(event) => {
            event.preventDefault();
            void saveEdit(editingEntity);
          }} className="grid gap-3">
            <select
              value={editingType}
              onChange={(event) => {
                setEditingType(event.target.value as EntityType);
                if (event.target.value !== "SHELF") setEditingCategory("");
              }}
              className="input"
            >
              <option value="AUTHOR">{t.labels.AUTHOR.singular}</option>
              <option value="CATEGORY">{t.labels.CATEGORY.singular}</option>
              <option value="SHELF">{t.labels.SHELF.singular}</option>
            </select>
            <input
              value={editingName}
              onChange={(event) => setEditingName(event.target.value)}
              className="input"
              placeholder={`${t.name} ${t.labels[editingType].singular}`}
            />
            {editingType === "SHELF" ? (
              <select
                value={editingCategory}
                onChange={(event) => setEditingCategory(event.target.value)}
                className="input"
                aria-label={t.categoryForShelf}
              >
                <option value="">{t.chooseCategory}</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            ) : null}
            <button
              type="submit"
              disabled={busy || !editingName.trim() || (editingType === "SHELF" && !editingCategory)}
              className="secondary-button justify-center disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t.save}
            </button>
          </form>
        </AppModal>
      ) : null}
    </>
  );
}
