import { z } from "zod";
import { bookInputSchema, type BookInput, type LibraryBook } from "./book-schema";
import { entityInputSchema, type EntityInput } from "./entity-schema";

const importPayloadSchema = z.object({
  books: z.array(bookInputSchema),
  entities: z.array(entityInputSchema).optional().default([]),
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
  return importPayloadSchema.parse(payload).entities;
}
