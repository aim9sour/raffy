"use client";

import {
  Cloud,
  CloudOff,
  Download,
  Filter,
  Library,
  List,
  Plus,
  RefreshCw,
  Search,
  Upload,
  UserRound,
  WifiOff,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { BookInput, LibraryBook, ReadingStatus } from "@/lib/book-schema";
import { filterBooks, getLibraryStats } from "@/lib/book-filters";
import { buildAuthorGroups, buildCategoryGroups } from "@/lib/book-navigation";
import {
  buildExportPayload,
  parseImportedBooks,
  parseImportedEntities,
} from "@/lib/book-import-export";
import {
  cacheLibrarySnapshot,
  createLocalId,
  enqueueOfflineOperation,
  isLocalId,
  readCachedLibrarySnapshot,
  readOfflineQueue,
  removeQueuedCreate,
  replaceOfflineQueue,
  updateQueuedCreate,
  type OfflineOperation,
} from "@/lib/offline-store";
import { getBrowserLocale, localeLabels, type Locale } from "@/lib/i18n";
import { BookDetailPanel, bookToInput } from "./book-detail-panel";
import { BookForm } from "./book-form";
import {
  EntityManager,
  type EntityCreateInput,
  type EntityUpdateInput,
  type EntityView,
} from "./entity-manager";
import { AppModal } from "./app-modal";
import { BookCoverTile, CollectionCover } from "./library-covers";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";

type LoadState = "idle" | "loading" | "ready" | "error";
type LibraryTab = "categories" | "authors" | "books";

const navigationCopy = {
  ar: {
    tabs: { categories: "الفئات", authors: "المؤلفون", books: "الكتب" },
    categories: "الفئات",
    shelves: "الرفوف",
    authors: "المؤلفون",
    books: "الكتب",
    book: "كتاب",
    shelf: "رف",
    author: "مؤلف",
    category: "فئة",
    chooseCategory: "اختر فئة لتصفح رفوفها.",
    chooseShelf: "اختر رفًا لعرض كتبه داخل هذه الفئة.",
    allBooks: "كل الكتب",
    allAuthors: "كل المؤلفين",
    backToCategories: "العودة للفئات",
    backToShelves: "العودة للرفوف",
    backToAuthors: "العودة للمؤلفين",
  },
  en: {
    tabs: { categories: "Categories", authors: "Authors", books: "Books" },
    categories: "Categories",
    shelves: "Shelves",
    authors: "Authors",
    books: "Books",
    book: "Book",
    shelf: "Shelf",
    author: "Author",
    category: "Category",
    chooseCategory: "Choose a category to browse its shelves.",
    chooseShelf: "Choose a shelf to see its books in this category.",
    allBooks: "All books",
    allAuthors: "All authors",
    backToCategories: "Back to categories",
    backToShelves: "Back to shelves",
    backToAuthors: "Back to authors",
  },
};

const copy = {
  ar: {
    subtitle: "مكتبتك، مؤلفوك، فئاتك ورفوفك في مكان واحد",
    refresh: "تحديث",
    addBook: "كتاب",
    addBookTitle: "إضافة كتاب",
    editBookTitle: "تعديل كتاب",
    close: "إغلاق",
    stats: {
      total: "كل الكتب",
      reading: "يقرأ الآن",
      read: "انتهى",
      unread: "لم يبدأ",
      authors: "المؤلفون",
      categories: "الفئات",
    },
    searchPlaceholder: "ابحث بالاسم، المؤلف، الملاحظات...",
    allCategories: "كل الفئات",
    allShelves: "كل الرفوف",
    allStatuses: "كل الحالات",
    unread: "لم يبدأ",
    reading: "يقرأ الآن",
    read: "انتهى",
    clearFilters: "مسح الفلاتر",
    loading: "جاري تحميل المكتبة...",
    emptyTitle: "لا توجد كتب مطابقة.",
    emptyText: "أضف كتابًا جديدًا أو غيّر الفلاتر الحالية.",
    dataTitle: "إدارة البيانات",
    dataText: "صدّر نسخة احتياطية JSON أو استورد مكتبة قديمة بنفس الصيغة.",
    exportData: "تصدير البيانات",
    importData: "استيراد البيانات",
    deleteBook: (title: string) => `حذف "${title}"؟`,
    deleteEntity: "حذف هذا العنصر؟ الكتب المرتبطة به لن يتم حذفها.",
    messages: {
      online: "عاد الاتصال. جاري مزامنة التعديلات...",
      offline: "أنت الآن بدون اتصال. استمر في العمل وسنزامن التعديلات لاحقًا.",
      cached:
        "أنت تعمل الآن بدون اتصال. أي تعديل سيتم حفظه محليًا ثم مزامنته لاحقًا.",
      savedLocal: "تم حفظ التعديل محليًا وسيتم مزامنته عند عودة الاتصال.",
      bookSavedLocal: "تم حفظ الكتاب محليًا وسيتم مزامنته عند عودة الاتصال.",
      localDeleted: "تم حذف النسخة المحلية قبل مزامنتها.",
      bookDeletedLocal: "تم حذف الكتاب محليًا وسيتم مزامنة الحذف عند عودة الاتصال.",
      entitySavedLocal: "تم حفظ العنصر محليًا وسيتم مزامنته عند عودة الاتصال.",
      entityDeletedLocal: "تم حذف العنصر محليًا وسيتم مزامنة الحذف عند عودة الاتصال.",
      synced: "تمت مزامنة كل التعديلات.",
      partialSync: "بعض التعديلات لم تتم مزامنتها بعد. سنحاول مرة أخرى عند عودة الاتصال.",
      exportedCached: "تم تصدير آخر نسخة محفوظة على الجهاز لأنك تعمل بدون اتصال.",
      invalidImport: "ملف الاستيراد غير صالح.",
      importedLocal: "تم استيراد الملف محليًا وسيتم رفع البيانات عند عودة الاتصال.",
    },
    errors: {
      loadBooks: "تعذر تحميل الكتب",
      loadEntities: "تعذر تحميل العناصر",
      generic: "حدث خطأ",
      saveBook: "تعذر حفظ الكتاب",
      deleteBook: "تعذر حذف الكتاب",
      createEntity: "تعذر إضافة العنصر",
      updateEntity: "تعذر تعديل العنصر",
      deleteEntity: "تعذر حذف العنصر",
      sync: "تعذرت المزامنة",
      export: "تعذر تصدير البيانات",
      import: "تعذر استيراد الملف",
    },
    sync: {
      offline: "بدون اتصال",
      pending: (count: number) => `${count} بانتظار المزامنة`,
      synced: "متزامن",
    },
  },
  en: {
    subtitle: "Your books, authors, categories and shelves in one place",
    refresh: "Refresh",
    addBook: "Book",
    addBookTitle: "Add book",
    editBookTitle: "Edit book",
    close: "Close",
    stats: {
      total: "All books",
      reading: "Reading",
      read: "Finished",
      unread: "Not started",
      authors: "Authors",
      categories: "Categories",
    },
    searchPlaceholder: "Search by title, author, notes...",
    allCategories: "All categories",
    allShelves: "All shelves",
    allStatuses: "All statuses",
    unread: "Not started",
    reading: "Reading",
    read: "Finished",
    clearFilters: "Clear filters",
    loading: "Loading library...",
    emptyTitle: "No matching books.",
    emptyText: "Add a new book or change the current filters.",
    dataTitle: "Data management",
    dataText: "Export a JSON backup or import an older library in the same format.",
    exportData: "Export data",
    importData: "Import data",
    deleteBook: (title: string) => `Delete "${title}"?`,
    deleteEntity: "Delete this item? Linked books will not be deleted.",
    messages: {
      online: "Connection is back. Syncing changes...",
      offline: "You are offline. Keep working and Raffy will sync later.",
      cached: "You are working offline. Changes will be saved locally and synced later.",
      savedLocal: "Saved locally and will sync when connection returns.",
      bookSavedLocal: "Book saved locally and will sync when connection returns.",
      localDeleted: "Local draft deleted before syncing.",
      bookDeletedLocal: "Book deleted locally and the delete will sync later.",
      entitySavedLocal: "Item saved locally and will sync when connection returns.",
      entityDeletedLocal: "Item deleted locally and the delete will sync later.",
      synced: "All changes synced.",
      partialSync: "Some changes are still waiting. Raffy will try again when online.",
      exportedCached: "Exported the latest local copy because you are offline.",
      invalidImport: "Import file is not valid.",
      importedLocal: "Imported locally and will upload when connection returns.",
    },
    errors: {
      loadBooks: "Could not load books",
      loadEntities: "Could not load items",
      generic: "Something went wrong",
      saveBook: "Could not save book",
      deleteBook: "Could not delete book",
      createEntity: "Could not add item",
      updateEntity: "Could not update item",
      deleteEntity: "Could not delete item",
      sync: "Could not sync",
      export: "Could not export data",
      import: "Could not import file",
    },
    sync: {
      offline: "Offline",
      pending: (count: number) => `${count} pending sync`,
      synced: "Synced",
    },
  },
};

export function LibraryApp() {
  const [locale, setLocale] = useState<Locale>(() => getBrowserLocale());
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [entities, setEntities] = useState<EntityView[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [error, setError] = useState("");
  const [syncMessage, setSyncMessage] = useState("");
  const [online, setOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  const [pendingCount, setPendingCount] = useState(() =>
    typeof window === "undefined" ? 0 : readOfflineQueue().length,
  );
  const [editing, setEditing] = useState<LibraryBook | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<LibraryTab>("categories");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedShelf, setSelectedShelf] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [shelf, setShelf] = useState("");
  const [status, setStatus] = useState<ReadingStatus | "ALL">("ALL");
  const fileRef = useRef<HTMLInputElement>(null);
  const t = copy[locale];
  const navT = navigationCopy[locale];

  useEffect(() => {
    void loadLibrary();

    function handleOnline() {
      setOnline(true);
      setSyncMessage(copy[getBrowserLocale()].messages.online);
      void syncPendingOperations().then((synced) => {
        if (synced) void loadLibrary();
      });
    }

    function handleOffline() {
      setOnline(false);
      setSyncMessage(copy[getBrowserLocale()].messages.offline);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
    // The initial load and online listener are intentionally registered once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredBooks = useMemo(
    () => filterBooks(books, { search, category, shelf, status }),
    [books, category, search, shelf, status],
  );
  const stats = useMemo(() => getLibraryStats(books), [books]);
  const authors = useMemo(() => entities.filter((entity) => entity.type === "AUTHOR"), [entities]);
  const categories = useMemo(() => entities.filter((entity) => entity.type === "CATEGORY"), [entities]);
  const shelves = useMemo(() => entities.filter((entity) => entity.type === "SHELF"), [entities]);
  const categoryGroups = useMemo(
    () =>
      buildCategoryGroups(books, {
        categories: categories.map((item) => item.name),
        shelves: shelves.map((item) => ({ name: item.name, category: item.category })),
      }),
    [books, categories, shelves],
  );
  const authorGroups = useMemo(
    () => buildAuthorGroups(books, authors.map((item) => item.name)),
    [authors, books],
  );
  const selectedCategoryGroup = categoryGroups.find((group) => group.name === selectedCategory);
  const selectedShelfGroup = selectedCategoryGroup?.shelves.find((group) => group.name === selectedShelf);
  const selectedAuthorGroup = authorGroups.find((group) => group.name === selectedAuthor);
  const selectedBook = useMemo(
    () => books.find((book) => book.id === selectedBookId) ?? null,
    [books, selectedBookId],
  );

  async function loadLibrary() {
    const activeCopy = copy[getBrowserLocale()];
    setState("loading");
    setError("");
    try {
      const [booksResponse, entitiesResponse] = await Promise.all([
        fetch("/api/books", { cache: "no-store" }),
        fetch("/api/entities", { cache: "no-store" }),
      ]);
      const booksPayload = await booksResponse.json();
      const entitiesPayload = await entitiesResponse.json();
      if (!booksResponse.ok) throw new Error(booksPayload.error ?? activeCopy.errors.loadBooks);
      if (!entitiesResponse.ok) throw new Error(entitiesPayload.error ?? activeCopy.errors.loadEntities);

      setBooks(booksPayload.books);
      setEntities(entitiesPayload.entities);
      cacheLibrarySnapshot({ books: booksPayload.books, entities: entitiesPayload.entities });
      setState("ready");
      setSyncMessage("");

      const synced = await syncPendingOperations();
      if (synced) void loadLibrary();
    } catch (loadError) {
      const cached = readCachedLibrarySnapshot();
      if (cached) {
        setBooks(cached.books);
        setEntities(cached.entities);
        setState("ready");
        setSyncMessage(activeCopy.messages.cached);
        return;
      }

      setError(loadError instanceof Error ? loadError.message : activeCopy.errors.generic);
      setState("error");
    }
  }

  async function saveBook(input: BookInput, id?: string) {
    const activeCopy = copy[getBrowserLocale()];
    try {
      if (id && isLocalId(id)) {
        updateQueuedCreate(id, input);
        updateBooks((current) =>
          current.map((book) =>
            book.id === id ? { ...book, ...input, updatedAt: new Date().toISOString() } : book,
          ),
        );
        closeBookForm();
        setSyncMessage(activeCopy.messages.savedLocal);
        return;
      }

      const response = await fetch(id ? `/api/books/${id}` : "/api/books", {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? activeCopy.errors.saveBook);

      updateBooks((current) =>
        id ? current.map((book) => (book.id === id ? payload.book : book)) : [payload.book, ...current],
      );
      closeBookForm();
    } catch (saveError) {
      if (!shouldQueueOffline(saveError)) throw saveError;

      const now = new Date().toISOString();
      if (id) {
        enqueueOfflineOperation({
          id: createLocalId("queue"),
          type: "update-book",
          remoteId: id,
          payload: input,
        });
        refreshPendingCount();
        updateBooks((current) =>
          current.map((book) => (book.id === id ? { ...book, ...input, updatedAt: now } : book)),
        );
      } else {
        const localBook: LibraryBook = { ...input, id: createLocalId(), createdAt: now, updatedAt: now };
        enqueueOfflineOperation({
          id: createLocalId("queue"),
          type: "create-book",
          localId: localBook.id,
          payload: input,
        });
        refreshPendingCount();
        updateBooks((current) => [localBook, ...current]);
      }

      closeBookForm();
      setSyncMessage(activeCopy.messages.bookSavedLocal);
    }
  }

  async function deleteBook(book: LibraryBook) {
    const activeCopy = copy[getBrowserLocale()];
    if (!confirm(activeCopy.deleteBook(book.title))) return;

    if (isLocalId(book.id)) {
      removeQueuedCreate(book.id);
      refreshPendingCount();
      updateBooks((current) => current.filter((item) => item.id !== book.id));
      setSelectedBookId((current) => (current === book.id ? "" : current));
      setSyncMessage(activeCopy.messages.localDeleted);
      return;
    }

    try {
      const response = await fetch(`/api/books/${book.id}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? activeCopy.errors.deleteBook);
      updateBooks((current) => current.filter((item) => item.id !== book.id));
      setSelectedBookId((current) => (current === book.id ? "" : current));
    } catch (deleteError) {
      if (!shouldQueueOffline(deleteError)) {
        setError(deleteError instanceof Error ? deleteError.message : activeCopy.errors.deleteBook);
        return;
      }

      enqueueOfflineOperation({ id: createLocalId("queue"), type: "delete-book", remoteId: book.id });
      refreshPendingCount();
      updateBooks((current) => current.filter((item) => item.id !== book.id));
      setSelectedBookId((current) => (current === book.id ? "" : current));
      setSyncMessage(activeCopy.messages.bookDeletedLocal);
    }
  }

  async function createEntity(input: EntityCreateInput) {
    const activeCopy = copy[getBrowserLocale()];
    try {
      const response = await fetch("/api/entities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? activeCopy.errors.createEntity);
      updateEntities((current) => [...current, payload.entity].sort(sortEntities));
    } catch (createError) {
      if (!shouldQueueOffline(createError)) {
        setError(createError instanceof Error ? createError.message : activeCopy.errors.createEntity);
        return;
      }

      const localEntity = { id: createLocalId(), ...input };
      enqueueOfflineOperation({
        id: createLocalId("queue"),
        type: "create-entity",
        localId: localEntity.id,
        payload: input,
      });
      refreshPendingCount();
      updateEntities((current) => [...current, localEntity].sort(sortEntities));
      setSyncMessage(activeCopy.messages.entitySavedLocal);
    }
  }

  async function updateEntity(id: string, input: EntityUpdateInput, previous: EntityView) {
    const activeCopy = copy[getBrowserLocale()];
    if (isLocalId(id)) {
      replaceOfflineQueue(
        readOfflineQueue().map((operation) =>
          operation.type === "create-entity" && operation.localId === id
            ? { ...operation, payload: input }
            : operation,
        ),
      );
      refreshPendingCount();
      updateEntities((current) =>
        current.map((entity) => (entity.id === id ? { ...entity, ...input } : entity)).sort(sortEntities),
      );
      updateBooksForEntityChange(previous, input);
      setSyncMessage(activeCopy.messages.savedLocal);
      return;
    }

    try {
      const response = await fetch(`/api/entities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? activeCopy.errors.updateEntity);
      updateEntities((current) =>
        current.map((entity) => (entity.id === id ? payload.entity : entity)).sort(sortEntities),
      );
      updateBooksForEntityChange(previous, payload.entity);
    } catch (updateError) {
      if (!shouldQueueOffline(updateError)) {
        setError(updateError instanceof Error ? updateError.message : activeCopy.errors.updateEntity);
        return;
      }

      enqueueOfflineOperation({
        id: createLocalId("queue"),
        type: "update-entity",
        remoteId: id,
        payload: input,
      });
      refreshPendingCount();
      updateEntities((current) =>
        current.map((entity) => (entity.id === id ? { ...entity, ...input } : entity)).sort(sortEntities),
      );
      updateBooksForEntityChange(previous, input);
      setSyncMessage(activeCopy.messages.savedLocal);
    }
  }

  async function deleteEntity(id: string) {
    const activeCopy = copy[getBrowserLocale()];
    if (!confirm(activeCopy.deleteEntity)) return;

    if (isLocalId(id)) {
      removeQueuedCreate(id);
      refreshPendingCount();
      updateEntities((current) => current.filter((entity) => entity.id !== id));
      setSyncMessage(activeCopy.messages.localDeleted);
      return;
    }

    try {
      const response = await fetch(`/api/entities/${id}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? activeCopy.errors.deleteEntity);
      updateEntities((current) => current.filter((entity) => entity.id !== id));
    } catch (deleteError) {
      if (!shouldQueueOffline(deleteError)) {
        setError(deleteError instanceof Error ? deleteError.message : activeCopy.errors.deleteEntity);
        return;
      }

      enqueueOfflineOperation({ id: createLocalId("queue"), type: "delete-entity", remoteId: id });
      refreshPendingCount();
      updateEntities((current) => current.filter((entity) => entity.id !== id));
      setSyncMessage(activeCopy.messages.entityDeletedLocal);
    }
  }

  async function syncPendingOperations() {
    const activeCopy = copy[getBrowserLocale()];
    const queue = readOfflineQueue();
    if (queue.length === 0 || !navigator.onLine) return false;

    const remaining: OfflineOperation[] = [];
    const idMap = new Map<string, string>();

    for (const operation of queue) {
      try {
        await replayOperation(operation, idMap);
      } catch {
        remaining.push(operation);
      }
    }

    replaceOfflineQueue(remaining);
    refreshPendingCount();
    if (remaining.length === 0) {
      setSyncMessage(activeCopy.messages.synced);
      return queue.length > 0;
    }

    setSyncMessage(activeCopy.messages.partialSync);
    return queue.length !== remaining.length;
  }

  async function replayOperation(operation: OfflineOperation, idMap: Map<string, string>) {
    if (operation.type === "create-book") {
      const payload = await sendJson("/api/books", "POST", operation.payload);
      idMap.set(operation.localId, payload.book.id);
      return;
    }
    if (operation.type === "update-book") {
      await sendJson(`/api/books/${idMap.get(operation.remoteId) ?? operation.remoteId}`, "PATCH", operation.payload);
      return;
    }
    if (operation.type === "delete-book") {
      await sendJson(`/api/books/${idMap.get(operation.remoteId) ?? operation.remoteId}`, "DELETE");
      return;
    }
    if (operation.type === "create-entity") {
      const payload = await sendJson("/api/entities", "POST", operation.payload);
      idMap.set(operation.localId, payload.entity.id);
      return;
    }
    if (operation.type === "update-entity") {
      await sendJson(`/api/entities/${idMap.get(operation.remoteId) ?? operation.remoteId}`, "PATCH", operation.payload);
      return;
    }
    await sendJson(`/api/entities/${idMap.get(operation.remoteId) ?? operation.remoteId}`, "DELETE");
  }

  async function exportData() {
    const activeCopy = copy[getBrowserLocale()];
    let payload = buildExportPayload(books, entities);
    try {
      const response = await fetch("/api/books/export");
      const serverPayload = await response.json();
      if (!response.ok) throw new Error(serverPayload.error ?? activeCopy.errors.export);
      payload = serverPayload;
    } catch (exportError) {
      if (!shouldQueueOffline(exportError)) {
        setError(exportError instanceof Error ? exportError.message : activeCopy.errors.export);
        return;
      }
      setSyncMessage(activeCopy.messages.exportedCached);
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `raffy-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importData(file: File) {
    const activeCopy = copy[getBrowserLocale()];
    try {
      const payload = JSON.parse(await file.text());
      const response = await fetch("/api/books/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? activeCopy.errors.import);
      updateBooks((current) => [...result.books, ...current]);
      if (result.entities) updateEntities(() => result.entities);
    } catch (importError) {
      let payload: unknown;
      let importedBooks: ReturnType<typeof parseImportedBooks>;
      let importedEntities: ReturnType<typeof parseImportedEntities>;

      try {
        payload = JSON.parse(await file.text());
        importedBooks = parseImportedBooks(payload);
        importedEntities = parseImportedEntities(payload);
      } catch {
        setError(activeCopy.messages.invalidImport);
        return;
      }

      if (!shouldQueueOffline(importError)) {
        setError(importError instanceof Error ? importError.message : activeCopy.errors.import);
        return;
      }

      const now = new Date().toISOString();
      const localBooks = importedBooks.map((book) => ({ ...book, id: createLocalId(), createdAt: now, updatedAt: now }));
      const localEntities = importedEntities.map((entity) => ({ ...entity, id: createLocalId() }));

      for (const entity of localEntities) {
        enqueueOfflineOperation({
          id: createLocalId("queue"),
          type: "create-entity",
          localId: entity.id,
          payload: { type: entity.type, name: entity.name, category: entity.category },
        });
      }
      for (const book of localBooks) {
        enqueueOfflineOperation({
          id: createLocalId("queue"),
          type: "create-book",
          localId: book.id,
          payload: {
            title: book.title,
            author: book.author,
            coverUrl: book.coverUrl,
            category: book.category,
            shelf: book.shelf,
            acquiredAt: book.acquiredAt,
            status: book.status,
            rating: book.rating,
            notes: book.notes,
          },
        });
      }

      refreshPendingCount();
      updateEntities((current) => [...current, ...localEntities].sort(sortEntities));
      updateBooks((current) => [...localBooks, ...current]);
      setSyncMessage(activeCopy.messages.importedLocal);
    }
  }

  function updateBooks(updater: (current: LibraryBook[]) => LibraryBook[]) {
    setBooks((current) => {
      const next = updater(current);
      cacheLibrarySnapshot({ books: next, entities });
      return next;
    });
  }

  function updateEntities(updater: (current: EntityView[]) => EntityView[]) {
    setEntities((current) => {
      const next = updater(current);
      cacheLibrarySnapshot({ books, entities: next });
      return next;
    });
  }

  function closeBookForm() {
    setEditing(null);
    setShowForm(false);
  }

  function refreshPendingCount() {
    setPendingCount(readOfflineQueue().length);
  }

  function updateBooksForEntityChange(previous: EntityView, next: EntityUpdateInput) {
    if (previous.type !== next.type) return;
    const now = new Date().toISOString();

    if (previous.type === "CATEGORY" && previous.name !== next.name) {
      updateEntities((current) =>
        current
          .map((entity) =>
            entity.type === "SHELF" && entity.category === previous.name
              ? { ...entity, category: next.name }
              : entity,
          )
          .sort(sortEntities),
      );
      updateBooks((current) =>
        current.map((book) =>
          book.category === previous.name ? { ...book, category: next.name, updatedAt: now } : book,
        ),
      );
      return;
    }

    if (previous.type === "AUTHOR" && previous.name !== next.name) {
      updateBooks((current) =>
        current.map((book) =>
          book.author === previous.name ? { ...book, author: next.name, updatedAt: now } : book,
        ),
      );
      return;
    }

    if (previous.type !== "SHELF") return;

    updateBooks((current) =>
      current.map((book) =>
        book.category === previous.category && book.shelf === previous.name
          ? {
              ...book,
              category: next.category ?? previous.category ?? book.category,
              shelf: next.name,
              updatedAt: now,
            }
          : book,
      ),
    );
  }

  function switchTab(tab: LibraryTab) {
    setActiveTab(tab);
    setSelectedBookId("");
    if (tab !== "categories") {
      setSelectedCategory("");
      setSelectedShelf("");
    }
    if (tab !== "authors") setSelectedAuthor("");
  }

  function openBook(book: LibraryBook) {
    setSelectedBookId(book.id);
    setShowForm(false);
  }

  function openCategory(name: string) {
    setActiveTab("categories");
    setSelectedCategory(name);
    setSelectedShelf("");
    setSelectedAuthor("");
    setSelectedBookId("");
  }

  function openShelf(categoryName: string, shelfName: string) {
    setActiveTab("categories");
    setSelectedCategory(categoryName);
    setSelectedShelf(shelfName);
    setSelectedAuthor("");
    setSelectedBookId("");
  }

  function openAuthor(name: string) {
    setActiveTab("authors");
    setSelectedAuthor(name);
    setSelectedCategory("");
    setSelectedShelf("");
    setSelectedBookId("");
  }

  async function saveBookNotes(book: LibraryBook, notes: string) {
    await saveBook({ ...bookToInput(book), notes }, book.id);
  }

  function renderMainContent() {
    return (
      <div className="space-y-4">
        {renderTabs()}
        {selectedBook ? (
          <BookDetailPanel
            key={selectedBook.id}
            book={selectedBook}
            locale={locale}
            onBack={() => setSelectedBookId("")}
            onEdit={(book) => {
              setEditing(book);
              setShowForm(true);
            }}
            onDelete={(book) => void deleteBook(book)}
            onSaveNotes={saveBookNotes}
            onOpenAuthor={openAuthor}
            onOpenCategory={openCategory}
            onOpenShelf={openShelf}
          />
        ) : activeTab === "categories" ? (
          renderCategoriesView()
        ) : activeTab === "authors" ? (
          renderAuthorsView()
        ) : (
          renderBooksView()
        )}
      </div>
    );
  }

  function renderTabs() {
    return (
      <div className="grid gap-2 rounded-lg border border-stone-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-3">
        <TabButton
          active={activeTab === "categories"}
          icon={<Library size={17} />}
          label={navT.tabs.categories}
          onClick={() => switchTab("categories")}
        />
        <TabButton
          active={activeTab === "authors"}
          icon={<UserRound size={17} />}
          label={navT.tabs.authors}
          onClick={() => switchTab("authors")}
        />
        <TabButton
          active={activeTab === "books"}
          icon={<List size={17} />}
          label={navT.tabs.books}
          onClick={() => switchTab("books")}
        />
      </div>
    );
  }

  function renderCategoriesView() {
    if (!selectedCategory) {
      return (
        <section className="space-y-4">
          <SectionIntro title={navT.categories} text={navT.chooseCategory} />
          {categoryGroups.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {categoryGroups.map((group) => (
                <CollectionCover
                  key={group.name}
                  kind="category"
                  title={group.name}
                  subtitle={navT.category}
                  locale={locale}
                  stats={[
                    { label: navT.books, value: group.bookCount },
                    { label: navT.shelves, value: group.shelfCount },
                  ]}
                  onClick={() => openCategory(group.name)}
                />
              ))}
            </div>
          ) : (
            <EmptyState title={t.emptyTitle} text={t.emptyText} />
          )}
        </section>
      );
    }

    if (!selectedShelf) {
      return (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionIntro title={selectedCategory} text={navT.chooseShelf} />
            <button type="button" className="secondary-button" onClick={() => setSelectedCategory("")}>
              {navT.backToCategories}
            </button>
          </div>
          {selectedCategoryGroup?.shelves.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {selectedCategoryGroup.shelves.map((group) => (
                <CollectionCover
                  key={group.name}
                  kind="shelf"
                  title={group.name}
                  subtitle={selectedCategory}
                  locale={locale}
                  stats={[{ label: navT.books, value: group.bookCount }]}
                  onClick={() => openShelf(selectedCategory, group.name)}
                />
              ))}
            </div>
          ) : (
            <EmptyState title={t.emptyTitle} text={t.emptyText} />
          )}
        </section>
      );
    }

    return (
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionIntro title={selectedShelf} text={selectedCategory} />
          <div className="flex flex-wrap gap-2">
            <button type="button" className="secondary-button" onClick={() => setSelectedShelf("")}>
              {navT.backToShelves}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setSelectedCategory("");
                setSelectedShelf("");
              }}
            >
              {navT.backToCategories}
            </button>
          </div>
        </div>
        {renderBookGrid(selectedShelfGroup?.books ?? [])}
      </section>
    );
  }

  function renderAuthorsView() {
    if (!selectedAuthor) {
      return (
        <section className="space-y-4">
          <SectionIntro title={navT.allAuthors} text={locale === "ar" ? "افتح مؤلفا لترى كل كتبه." : "Open an author to see every linked book."} />
          {authorGroups.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {authorGroups.map((group) => (
                <CollectionCover
                  key={group.name}
                  kind="author"
                  title={group.name}
                  subtitle={navT.author}
                  locale={locale}
                  stats={[{ label: navT.books, value: group.bookCount }]}
                  onClick={() => openAuthor(group.name)}
                />
              ))}
            </div>
          ) : (
            <EmptyState title={t.emptyTitle} text={t.emptyText} />
          )}
        </section>
      );
    }

    return (
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionIntro title={selectedAuthor} text={navT.author} />
          <button type="button" className="secondary-button" onClick={() => setSelectedAuthor("")}>
            {navT.backToAuthors}
          </button>
        </div>
        {renderBookGrid(selectedAuthorGroup?.books ?? [])}
      </section>
    );
  }

  function renderBooksView() {
    return (
      <section className="space-y-4">
        {renderBookFilters()}
        {state === "loading" ? (
          <div className="rounded-lg border border-stone-200 bg-white p-8 text-center text-stone-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            {t.loading}
          </div>
        ) : null}
        {state === "ready" ? (
          filteredBooks.length === 0 ? (
            <EmptyState title={t.emptyTitle} text={t.emptyText} />
          ) : (
            renderBookGrid(filteredBooks)
          )
        ) : null}
      </section>
    );
  }

  function renderBookFilters() {
    return (
      <div className="grid gap-3 rounded-lg border border-stone-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[1fr_180px_180px_160px_auto]">
        <label className="relative block">
          <Search size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.searchPlaceholder} className="input pr-10" />
        </label>
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="input">
          <option value="">{t.allCategories}</option>
          {categories.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
        </select>
        <select value={shelf} onChange={(event) => setShelf(event.target.value)} className="input">
          <option value="">{t.allShelves}</option>
          {shelves.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value as ReadingStatus | "ALL")} className="input">
          <option value="ALL">{t.allStatuses}</option>
          <option value="UNREAD">{t.unread}</option>
          <option value="READING">{t.reading}</option>
          <option value="READ">{t.read}</option>
        </select>
        <button
          type="button"
          title={t.clearFilters}
          onClick={() => {
            setSearch("");
            setCategory("");
            setShelf("");
            setStatus("ALL");
          }}
          className="icon-button"
        >
          <Filter size={18} />
        </button>
      </div>
    );
  }

  function renderBookGrid(bookList: LibraryBook[]) {
    if (bookList.length === 0) return <EmptyState title={t.emptyTitle} text={t.emptyText} />;

    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {bookList.map((book) => (
          <BookCoverTile key={book.id} book={book} locale={locale} onOpen={openBook} />
        ))}
      </div>
    );
  }

  return (
    <main
      dir={localeLabels[locale].dir}
      className="min-h-screen bg-stone-50 text-stone-950 dark:bg-slate-950 dark:text-slate-50"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-teal-700 text-white">
              <Library size={23} />
            </span>
            <div>
              <h1 className="text-2xl font-bold">{locale === "ar" ? "رَفّي" : "Raffy"}</h1>
              <p className="text-sm text-stone-600 dark:text-slate-400">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SyncBadge locale={locale} online={online} pendingCount={pendingCount} />
            <LanguageToggle locale={locale} onChange={setLocale} />
            <ThemeToggle />
            <button type="button" onClick={() => void loadLibrary()} title={t.refresh} className="icon-button">
              <RefreshCw size={18} />
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-teal-700 px-3 text-sm font-semibold text-white hover:bg-teal-800"
            >
              <Plus size={18} />
              {t.addBook}
            </button>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label={t.stats.total} value={stats.total} />
          <Stat label={t.stats.reading} value={stats.reading} />
          <Stat label={t.stats.read} value={stats.read} />
          <Stat label={t.stats.unread} value={stats.unread} />
          <Stat label={t.stats.authors} value={authors.length} />
          <Stat label={t.stats.categories} value={categories.length} />
        </section>

        {syncMessage ? (
          <div className="rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">
            {syncMessage}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        <section className="grid gap-5 lg:grid-cols-[1fr_380px]">
          {renderMainContent()}

          <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
            <EntityManager
              entities={entities}
              locale={locale}
              onCreate={createEntity}
              onUpdate={updateEntity}
              onDelete={deleteEntity}
            />

            <div className="rounded-lg border border-stone-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="font-semibold">{t.dataTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-slate-400">{t.dataText}</p>
              <div className="mt-4 grid gap-2">
                <button type="button" onClick={() => void exportData()} className="secondary-button">
                  <Download size={17} />
                  {t.exportData}
                </button>
                <button type="button" onClick={() => fileRef.current?.click()} className="secondary-button">
                  <Upload size={17} />
                  {t.importData}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/json"
                  hidden
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void importData(file);
                    event.target.value = "";
                  }}
                />
              </div>
            </div>
          </aside>
        </section>

        {showForm ? (
          <AppModal
            title={editing ? t.editBookTitle : t.addBookTitle}
            closeLabel={t.close}
            onClose={closeBookForm}
            size="lg"
          >
            <BookForm
              key={editing?.id ?? "new-book"}
              book={editing}
              books={books}
              entities={entities}
              locale={locale}
              onClose={closeBookForm}
              onSave={saveBook}
              surface="plain"
              hideHeader
            />
          </AppModal>
        ) : null}
      </div>
    </main>
  );
}

async function sendJson(url: string, method: "POST" | "PATCH" | "DELETE", body?: unknown) {
  const activeCopy = copy[getBrowserLocale()];
  const response = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error ?? activeCopy.errors.sync);
  return payload;
}

function shouldQueueOffline(error: unknown) {
  return !navigator.onLine || error instanceof TypeError;
}

function sortEntities(a: EntityView, b: EntityView) {
  return (
    a.type.localeCompare(b.type) ||
    (a.category ?? "").localeCompare(b.category ?? "") ||
    a.name.localeCompare(b.name)
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs text-stone-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
        active
          ? "bg-teal-700 text-white shadow-sm"
          : "text-stone-700 hover:bg-stone-100 dark:text-slate-200 dark:hover:bg-slate-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function SectionIntro({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-stone-950 dark:text-slate-50">{title}</h2>
      <p className="mt-1 text-sm text-stone-600 dark:text-slate-400">{text}</p>
    </div>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
      <p className="font-semibold">{title}</p>
      <p className="mt-2 text-sm text-stone-600 dark:text-slate-400">{text}</p>
    </div>
  );
}

function SyncBadge({
  locale,
  online,
  pendingCount,
}: {
  locale: Locale;
  online: boolean;
  pendingCount: number;
}) {
  const t = copy[locale].sync;

  if (!online) {
    return (
      <span className="inline-flex h-10 items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 text-xs font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        <WifiOff size={16} />
        {t.offline}
      </span>
    );
  }

  if (pendingCount > 0) {
    return (
      <span className="inline-flex h-10 items-center gap-2 rounded-md border border-sky-200 bg-sky-50 px-3 text-xs font-semibold text-sky-800 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200">
        <CloudOff size={16} />
        {t.pending(pendingCount)}
      </span>
    );
  }

  return (
    <span className="hidden h-10 items-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-3 text-xs font-semibold text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200 sm:inline-flex">
      <Cloud size={16} />
      {t.synced}
    </span>
  );
}
