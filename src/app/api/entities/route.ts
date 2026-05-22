import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AuthRequiredError, requireUserId } from "@/lib/auth/server";
import { createEntity, isUniqueEntityError, listEntities } from "@/lib/entities";

export async function GET() {
  try {
    const userId = await requireUserId();
    return NextResponse.json({ entities: await listEntities(userId) });
  } catch (error) {
    return handleEntityError(error);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const entity = await createEntity(userId, await request.json());
    return NextResponse.json({ entity }, { status: 201 });
  } catch (error) {
    return handleEntityError(error);
  }
}

export function handleEntityError(error: unknown) {
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
