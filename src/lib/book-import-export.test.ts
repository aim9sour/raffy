import { describe, expect, it } from "vitest";
import {
  buildExportPayload,
  parseImportedBooks,
  parseImportedEntities,
} from "./book-import-export";

const sampleBook = {
  id: "book_1",
  title: "The Pragmatic Programmer",
  author: "Andrew Hunt, David Thomas",
  coverUrl: "https://example.com/cover.jpg",
  category: "Software",
  shelf: "Work",
  acquiredAt: "2025-04-10",
  status: "READING" as const,
  rating: 5,
  notes: "Re-read the refactoring chapters.",
  createdAt: "2026-05-20T10:00:00.000Z",
  updatedAt: "2026-05-21T10:00:00.000Z",
};

describe("book import/export", () => {
  it("builds a portable export payload with metadata, books and entities", () => {
    const payload = buildExportPayload([sampleBook], [{ type: "AUTHOR", name: "Andrew Hunt" }]);

    expect(payload.app).toBe("Raffy");
    expect(payload.version).toBe(2);
    expect(payload.books).toHaveLength(1);
    expect(payload.entities).toEqual([{ type: "AUTHOR", name: "Andrew Hunt" }]);
    expect(payload.books[0].title).toBe("The Pragmatic Programmer");
  });

  it("normalizes imported books and rejects invalid payloads", () => {
    const imported = parseImportedBooks({
      books: [
        {
          title: "Clean Code",
          author: "Robert C. Martin",
          category: "",
          shelf: "",
          status: "READ",
          rating: 4,
        },
      ],
    });

    expect(imported).toEqual([
      {
        title: "Clean Code",
        author: "Robert C. Martin",
        coverUrl: "",
        category: "Uncategorized",
        shelf: "General",
        acquiredAt: null,
        status: "READ",
        rating: 4,
        notes: "",
      },
    ]);

    expect(() => parseImportedBooks({ books: [{ title: "" }] })).toThrow();
  });

  it("normalizes imported entities", () => {
    expect(
      parseImportedEntities({
        books: [],
        entities: [{ type: "CATEGORY", name: "  روايات  " }],
      }),
    ).toEqual([{ type: "CATEGORY", name: "روايات" }]);
  });
});
