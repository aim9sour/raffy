import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { BookNotFoundError, deleteBook, updateBook } from "@/lib/books";
import { AuthRequiredError, requireUserId } from "@/lib/auth/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const userId = await requireUserId();
    const book = await updateBook(userId, id, await request.json());
    return NextResponse.json({ book });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const userId = await requireUserId();
    await deleteBook(userId, id);
    return NextResponse.json({ ok: true });
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

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  if (error instanceof BookNotFoundError) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  if (error instanceof AuthRequiredError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const message = error instanceof Error ? error.message : "Unexpected error";
  return NextResponse.json({ error: message }, { status: 500 });
}
