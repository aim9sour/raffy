import { describe, expect, it } from "vitest";
import { filterBooks, getLibraryStats } from "./book-filters";

const books = [
  {
    id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    coverUrl: "",
    category: "Self Development",
    shelf: "Morning",
    acquiredAt: "2024-01-01",
    status: "READ" as const,
    rating: 5,
    notes: "Tiny changes compound.",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Dune",
    author: "Frank Herbert",
    coverUrl: "",
    category: "Novel",
    shelf: "Fiction",
    acquiredAt: null,
    status: "UNREAD" as const,
    rating: null,
    notes: "",
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  },
];

describe("book filters", () => {
  it("filters books by search text, shelf, category, and status", () => {
    expect(
      filterBooks(books, {
        search: "clear",
        shelf: "Morning",
        category: "Self Development",
        status: "READ",
      }),
    ).toEqual([books[0]]);
  });

  it("calculates useful dashboard stats", () => {
    expect(getLibraryStats(books)).toEqual({
      total: 2,
      reading: 0,
      read: 1,
      unread: 1,
      shelves: 2,
      categories: 2,
    });
  });
});
