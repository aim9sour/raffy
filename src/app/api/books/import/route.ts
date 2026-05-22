import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { importBooks } from "@/lib/books";
import { parseImportedBooks, parseImportedEntities } from "@/lib/book-import-export";
import { AuthRequiredError, requireUserId } from "@/lib/auth/server";
import { importEntities } from "@/lib/entities";

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const payload = await request.json();
    const importedBooks = parseImportedBooks(payload);
    const importedEntities = parseImportedEntities(payload);
    const [entities, books] = await Promise.all([
      importEntities(userId, importedEntities),
      importBooks(userId, importedBooks),
    ]);
    return NextResponse.json(
      { imported: books.length, importedEntities: importedEntities.length, books, entities },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Import file is not valid", issues: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof AuthRequiredError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
