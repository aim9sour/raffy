import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createBook, listBooks } from "@/lib/books";
import { AuthRequiredError, requireUserId } from "@/lib/auth/server";

export async function GET() {
  try {
    const userId = await requireUserId();
    return NextResponse.json({ books: await listBooks(userId) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const book = await createBook(userId, await request.json());
    return NextResponse.json({ book }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Invalid book data", issues: error.issues },
      { status: 400 },
    );
  }

  if (error instanceof AuthRequiredError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const message = error instanceof Error ? error.message : "Unexpected error";
  return NextResponse.json({ error: message }, { status: 500 });
}
