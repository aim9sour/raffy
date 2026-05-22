import type { Prisma } from "@prisma/client";
import { bookInputSchema, partialBookInputSchema } from "./book-schema";
import type { BookInput, LibraryBook } from "./book-schema";
import { getDb } from "./db";

type DbBook = Prisma.BookGetPayload<Record<string, never>>;

function toDate(value: string | null | undefined) {
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

export function serializeBook(book: DbBook): LibraryBook {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    coverUrl: book.coverUrl,
    category: book.category,
    shelf: book.shelf,
    acquiredAt: book.acquiredAt?.toISOString().slice(0, 10) ?? null,
    status: book.status,
    rating: book.rating,
    notes: book.notes,
    createdAt: book.createdAt.toISOString(),
    updatedAt: book.updatedAt.toISOString(),
  };
}

export async function listBooks(userId: string) {
  const books = await getDb().book.findMany({
    where: { userId },
    orderBy: [{ updatedAt: "desc" }, { title: "asc" }],
  });

  return books.map(serializeBook);
}

export async function createBook(userId: string, input: unknown) {
  const data = bookInputSchema.parse(input);
  const book = await getDb().book.create({
    data: {
      ...data,
      userId,
      acquiredAt: toDate(data.acquiredAt),
    },
  });

  return serializeBook(book);
}

export async function updateBook(userId: string, id: string, input: unknown) {
  const data = partialBookInputSchema.parse(input);
  const updateData: Prisma.BookUpdateInput = {
    ...data,
    acquiredAt: data.acquiredAt === undefined ? undefined : toDate(data.acquiredAt),
  };

  const db = getDb();
  const result = await db.book.updateMany({
    where: { id, userId },
    data: updateData,
  });

  if (result.count === 0) {
    throw new BookNotFoundError();
  }

  const book = await db.book.findFirstOrThrow({ where: { id, userId } });

  return serializeBook(book);
}

export async function deleteBook(userId: string, id: string) {
  const result = await getDb().book.deleteMany({ where: { id, userId } });

  if (result.count === 0) {
    throw new BookNotFoundError();
  }
}

export async function importBooks(userId: string, inputs: BookInput[]) {
  const db = getDb();
  const books = await db.$transaction(
    inputs.map((input) =>
      db.book.create({
        data: {
          ...input,
          userId,
          acquiredAt: toDate(input.acquiredAt),
        },
      }),
    ),
  );

  return books.map(serializeBook);
}

export class BookNotFoundError extends Error {
  constructor() {
    super("Book not found");
    this.name = "BookNotFoundError";
  }
}
