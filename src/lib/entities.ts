import { Prisma } from "@prisma/client";
import {
  entityInputSchema,
  entityTypes,
  entityUpdateSchema,
  type EntityInput,
  type EntityType,
  type EntityUpdate,
} from "./entity-schema";
import { getDb } from "./db";
export { entityInputSchema, entityTypes };
export type { EntityInput, EntityType };
export type LibraryEntity = {
  id: string;
  userId: string;
  type: EntityType;
  name: string;
  category: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type EntityGroups = {
  authors: LibraryEntity[];
  categories: LibraryEntity[];
  shelves: LibraryEntity[];
};

export function groupEntitiesByType(entities: LibraryEntity[]): EntityGroups {
  return {
    authors: entities.filter((entity) => entity.type === "AUTHOR"),
    categories: entities.filter((entity) => entity.type === "CATEGORY"),
    shelves: entities.filter((entity) => entity.type === "SHELF"),
  };
}

export function serializeEntity(entity: LibraryEntity) {
  return {
    id: entity.id,
    userId: entity.userId,
    type: entity.type,
    name: entity.name,
    category: entity.category,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export async function listEntities(userId: string) {
  const entities = await getDb().libraryEntity.findMany({
    where: { userId },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  return entities.map(serializeEntity);
}

export async function createEntity(userId: string, input: unknown) {
  const data = entityInputSchema.parse(input);
  const entity = await getDb().libraryEntity.create({
    data: { ...data, userId },
  });

  return serializeEntity(entity);
}

export async function importEntities(userId: string, inputs: EntityInput[]) {
  if (inputs.length === 0) return [];

  await getDb().libraryEntity.createMany({
    data: inputs.map((input) => ({ ...input, userId })),
    skipDuplicates: true,
  });

  return listEntities(userId);
}

export async function updateEntity(userId: string, id: string, input: unknown) {
  const data = entityUpdateSchema.parse(input);
  const db = getDb();
  const entity = await db.$transaction(async (tx) => {
    const previous = await tx.libraryEntity.findFirst({ where: { id, userId } });
    if (!previous) throw new EntityNotFoundError();
    const next = normalizeEntityUpdate(previous, data);

    const updated = await tx.libraryEntity.update({
      where: { id },
      data: next,
    });

    if (previous.type === "AUTHOR" && next.type === "AUTHOR" && next.name !== previous.name) {
      await tx.book.updateMany({
        where: { userId, author: previous.name },
        data: { author: next.name },
      });
    }

    if (previous.type === "CATEGORY" && next.type === "CATEGORY" && next.name !== previous.name) {
      await tx.book.updateMany({
        where: { userId, category: previous.name },
        data: { category: next.name },
      });
      await tx.libraryEntity.updateMany({
        where: { userId, type: "SHELF", category: previous.name },
        data: { category: next.name },
      });
    }

    if (previous.type === "SHELF" && next.type === "SHELF") {
      const nextCategory = next.category ?? previous.category ?? "Uncategorized";
      await tx.book.updateMany({
        where: { userId, category: previous.category ?? undefined, shelf: previous.name },
        data: { category: nextCategory, shelf: next.name },
      });
    }

    return updated;
  });

  return serializeEntity(entity);
}

export async function deleteEntity(userId: string, id: string) {
  const result = await getDb().libraryEntity.deleteMany({ where: { id, userId } });

  if (result.count === 0) {
    throw new EntityNotFoundError();
  }
}

export function isUniqueEntityError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  );
}

export class EntityNotFoundError extends Error {
  constructor() {
    super("Entity not found");
    this.name = "EntityNotFoundError";
  }
}

function normalizeEntityUpdate(
  previous: LibraryEntity,
  data: EntityUpdate,
): { type: EntityType; name: string; category: string | null } {
  const type = data.type ?? previous.type;
  const name = data.name ?? previous.name;
  const category = type === "SHELF" ? data.category ?? previous.category : null;

  if (type === "SHELF" && !category) {
    throw new Error("Shelf category is required");
  }

  return { type, name, category };
}
