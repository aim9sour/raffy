import type { LibraryBook } from "./book-schema";

type CategoryGroupOptions = {
  categories?: string[];
  shelves?: string[];
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

export function buildCategoryGroups(
  books: LibraryBook[],
  options: CategoryGroupOptions = {},
): CategoryGroup[] {
  const categories = new Map<string, LibraryBook[]>();
  const knownShelves = uniqueNames(options.shelves);

  for (const category of uniqueNames(options.categories)) {
    categories.set(category, []);
  }

  for (const book of books) {
    const category = book.category || "Uncategorized";
    categories.set(category, [...(categories.get(category) ?? []), book]);
  }

  return Array.from(categories.entries())
    .map(([name, categoryBooks]) => {
      const shelves = new Map<string, LibraryBook[]>();

      for (const shelfName of knownShelves) {
        shelves.set(shelfName, []);
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
