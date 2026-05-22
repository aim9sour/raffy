import type { BookFilters, LibraryBook } from "./book-schema";

export function filterBooks(
  books: LibraryBook[],
  filters: BookFilters,
): LibraryBook[] {
  const search = filters.search?.trim().toLowerCase() ?? "";

  return books.filter((book) => {
    const matchesSearch =
      !search ||
      [book.title, book.author, book.category, book.shelf, book.notes]
        .join(" ")
        .toLowerCase()
        .includes(search);

    const matchesShelf = !filters.shelf || book.shelf === filters.shelf;
    const matchesCategory =
      !filters.category || book.category === filters.category;
    const matchesStatus =
      !filters.status || filters.status === "ALL" || book.status === filters.status;

    return matchesSearch && matchesShelf && matchesCategory && matchesStatus;
  });
}

export function getLibraryStats(books: LibraryBook[]) {
  return {
    total: books.length,
    reading: books.filter((book) => book.status === "READING").length,
    read: books.filter((book) => book.status === "READ").length,
    unread: books.filter((book) => book.status === "UNREAD").length,
    shelves: new Set(books.map((book) => book.shelf)).size,
    categories: new Set(books.map((book) => book.category)).size,
  };
}
