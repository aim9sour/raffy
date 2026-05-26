import { z } from "zod";
import { bookInputSchema, type BookInput, type LibraryBook } from "./book-schema";
import { entityInputSchema, type EntityInput } from "./entity-schema";

const importPayloadSchema = z.object({
  books: z.array(bookInputSchema),
  entities: z.array(z.unknown()).optional().default([]),
});

export type ExportPayload = {
  app: "Raffy";
  version: 2;
  exportedAt: string;
  books: LibraryBook[];
  entities: EntityInput[];
};

export function buildExportPayload(
  books: LibraryBook[],
  entities: EntityInput[] = [],
): ExportPayload {
  return {
    app: "Raffy",
    version: 2,
    exportedAt: new Date().toISOString(),
    books,
    entities,
  };
}

export function parseImportedBooks(payload: unknown): BookInput[] {
  return importPayloadSchema.parse(payload).books;
}

export function parseImportedEntities(payload: unknown): EntityInput[] {
  const parsed = importPayloadSchema.parse(payload);
  const shelfCategories = new Map(
    parsed.books.map((book) => [book.shelf.trim(), book.category.trim()] as const),
  );

  return parsed.entities.map((entity) =>
    entityInputSchema.parse(withLegacyShelfCategory(entity, shelfCategories)),
  );
}

function withLegacyShelfCategory(entity: unknown, shelfCategories: Map<string, string>) {
  if (!entity || typeof entity !== "object" || Array.isArray(entity)) return entity;
  const candidate = entity as { type?: unknown; name?: unknown; category?: unknown };
  if (candidate.type !== "SHELF" || candidate.category || typeof candidate.name !== "string") {
    return entity;
  }

  return {
    ...candidate,
    category: shelfCategories.get(candidate.name.trim()) ?? "Uncategorized",
  };
}
