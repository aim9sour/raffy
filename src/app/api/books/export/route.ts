import { NextResponse } from "next/server";
import { buildExportPayload } from "@/lib/book-import-export";
import { listBooks } from "@/lib/books";
import { AuthRequiredError, requireUserId } from "@/lib/auth/server";
import { listEntities } from "@/lib/entities";

export async function GET() {
  try {
    const userId = await requireUserId();
    const [books, entities] = await Promise.all([listBooks(userId), listEntities(userId)]);
    return NextResponse.json(buildExportPayload(books, entities));
  } catch (error) {
    if (error instanceof AuthRequiredError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
