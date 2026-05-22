import { NextResponse } from "next/server";
import { AuthRequiredError, requireUserId } from "@/lib/auth/server";
import {
  EntityNotFoundError,
  deleteEntity,
  updateEntity,
  isUniqueEntityError,
} from "@/lib/entities";
import { ZodError } from "zod";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const userId = await requireUserId();
    const entity = await updateEntity(userId, id, await request.json());
    return NextResponse.json({ entity });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const userId = await requireUserId();
    await deleteEntity(userId, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}

function handleRouteError(error: unknown) {
  if (error instanceof EntityNotFoundError) {
    return NextResponse.json({ error: "Entity not found" }, { status: 404 });
  }

  if (error instanceof AuthRequiredError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Invalid entity data", issues: error.issues },
      { status: 400 },
    );
  }

  if (isUniqueEntityError(error)) {
    return NextResponse.json({ error: "This item already exists" }, { status: 409 });
  }

  const message = error instanceof Error ? error.message : "Unexpected error";
  return NextResponse.json({ error: message }, { status: 500 });
}
