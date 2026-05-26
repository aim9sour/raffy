import { describe, expect, it } from "vitest";
import { buildAuthorGroups, buildCategoryGroups, getShelfOptionsForCategory } from "./book-navigation";
import type { LibraryBook } from "./book-schema";

const books: LibraryBook[] = [
  {
    id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    coverUrl: "",
    category: "Self Development",
    shelf: "Morning",
    acquiredAt: "2024-01-01",
    status: "READ",
    rating: 5,
    notes: "",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Deep Work",
    author: "Cal Newport",
    coverUrl: "",
    category: "Self Development",
    shelf: "Focus",
    acquiredAt: null,
    status: "READING",
    rating: null,
    notes: "",
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  },
  {
    id: "3",
    title: "Dune",
    author: "Frank Herbert",
    coverUrl: "",
    category: "Novel",
    shelf: "Fiction",
    acquiredAt: null,
    status: "UNREAD",
    rating: null,
    notes: "",
    createdAt: "2024-01-03T00:00:00.000Z",
    updatedAt: "2024-01-03T00:00:00.000Z",
  },
];

describe("book navigation grouping", () => {
  it("groups categories with nested shelves and scoped book counts", () => {
    const groups = buildCategoryGroups(books);

    expect(groups.map((group) => [group.name, group.bookCount, group.shelfCount])).toEqual([
      ["Novel", 1, 1],
      ["Self Development", 2, 2],
    ]);
    expect(groups[1].shelves.map((shelf) => [shelf.name, shelf.bookCount])).toEqual([
      ["Focus", 1],
      ["Morning", 1],
    ]);
  });

  it("groups authors with their books and ignores blank author names", () => {
    const groups = buildAuthorGroups([
      ...books,
      { ...books[0], id: "4", title: "Untitled", author: "" },
    ]);

    expect(groups.map((group) => [group.name, group.bookCount])).toEqual([
      ["Cal Newport", 1],
      ["Frank Herbert", 1],
      ["James Clear", 1],
    ]);
  });

  it("keeps created empty categories, shelves and authors visible", () => {
    const categoryGroups = buildCategoryGroups(books, {
      categories: ["Archive"],
      shelves: [{ name: "Wishlist", category: "Archive" }],
    });
    const authorGroups = buildAuthorGroups(books, ["Naguib Mahfouz"]);

    expect(categoryGroups.find((group) => group.name === "Archive")).toMatchObject({
      bookCount: 0,
      shelfCount: 1,
    });
    expect(categoryGroups.find((group) => group.name === "Archive")?.shelves.map((shelf) => shelf.name)).toContain("Wishlist");
    expect(categoryGroups.find((group) => group.name === "Novel")?.shelves.map((shelf) => shelf.name)).not.toContain("Wishlist");
    expect(authorGroups.find((group) => group.name === "Naguib Mahfouz")).toMatchObject({
      bookCount: 0,
    });
  });

  it("returns only shelf options that belong to the selected category", () => {
    const shelves = [
      { name: "Archive", category: "Novel" },
      { name: "Morning", category: "Self Development" },
    ];

    expect(getShelfOptionsForCategory(books, shelves, "Novel")).toEqual(["Archive", "Fiction"]);
    expect(getShelfOptionsForCategory(books, shelves, "Self Development")).toEqual([
      "Focus",
      "Morning",
    ]);
  });
});
