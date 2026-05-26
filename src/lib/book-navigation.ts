import type { LibraryBook } from "./book-schema";

type CategoryGroupOptions = {
  categories?: string[];
  shelves?: ShelfEntityOption[];
};

export type ShelfGroup = {
  name: string;
  books: LibraryBook[];
  bookCount: number;
};

export type CategoryGroup = {
  name: string;
  shelves: ShelfGroup[];
  books: LibraryBook[];
  bookCount: number;
  shelfCount: number;
};

export type AuthorGroup = {
  name: string;
  books: LibraryBook[];
  bookCount: number;
};

export type ShelfEntityOption = {
  name: string;
  category?: string | null;
};

export function buildCategoryGroups(
  books: LibraryBook[],
  options: CategoryGroupOptions = {},
): CategoryGroup[] {
  const categories = new Map<string, LibraryBook[]>();
  const knownShelves = normalizeShelfOptions(options.shelves);

  for (const category of uniqueNames(options.categories)) {
    categories.set(category, []);
  }
  for (const shelf of knownShelves) {
    if (shelf.category) categories.set(shelf.category, categories.get(shelf.category) ?? []);
  }

  for (const book of books) {
    const category = book.category || "Uncategorized";
    categories.set(category, [...(categories.get(category) ?? []), book]);
  }

  return Array.from(categories.entries())
    .map(([name, categoryBooks]) => {
      const shelves = new Map<string, LibraryBook[]>();

      for (const shelf of knownShelves) {
        if (shelf.category === name) shelves.set(shelf.name, []);
      }

      for (const book of categoryBooks) {
        const shelf = book.shelf || "General";
        shelves.set(shelf, [...(shelves.get(shelf) ?? []), book]);
      }

      const shelfGroups = Array.from(shelves.entries())
        .map(([shelfName, shelfBooks]) => ({
          name: shelfName,
          books: sortBooks(shelfBooks),
          bookCount: shelfBooks.length,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      return {
        name,
        shelves: shelfGroups,
        books: sortBooks(categoryBooks),
        bookCount: categoryBooks.length,
        shelfCount: shelfGroups.length,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getShelfOptionsForCategory(
  books: LibraryBook[],
  shelves: ShelfEntityOption[],
  category: string,
  currentShelf = "",
): string[] {
  const names = new Set<string>();

  for (const shelf of normalizeShelfOptions(shelves)) {
    if (shelf.category === category) names.add(shelf.name);
  }

  for (const book of books) {
    if (book.category === category && book.shelf) names.add(book.shelf);
  }

  if (currentShelf) names.add(currentShelf);

  return Array.from(names).sort((a, b) => a.localeCompare(b));
}

export function buildAuthorGroups(books: LibraryBook[], knownAuthors: string[] = []): AuthorGroup[] {
  const authors = new Map<string, LibraryBook[]>();

  for (const author of uniqueNames(knownAuthors)) {
    authors.set(author, []);
  }

  for (const book of books) {
    if (!book.author.trim()) continue;
    authors.set(book.author, [...(authors.get(book.author) ?? []), book]);
  }

  return Array.from(authors.entries())
    .map(([name, authorBooks]) => ({
      name,
      books: sortBooks(authorBooks),
      bookCount: authorBooks.length,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function sortBooks(books: LibraryBook[]) {
  return [...books].sort(
    (a, b) =>
      Date.parse(b.updatedAt) - Date.parse(a.updatedAt) ||
      a.title.localeCompare(b.title),
  );
}

function uniqueNames(names: string[] = []) {
  return Array.from(new Set(names.map((name) => name.trim()).filter(Boolean)));
}

function normalizeShelfOptions(shelves: ShelfEntityOption[] = []) {
  const unique = new Map<string, ShelfEntityOption>();

  for (const shelf of shelves) {
    const name = shelf.name.trim();
    const category = shelf.category?.trim() || null;
    if (!name) continue;
    unique.set(`${category ?? ""}:${name}`, { name, category });
  }

  return Array.from(unique.values());
}
