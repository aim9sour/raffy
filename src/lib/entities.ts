import { Prisma } from "@prisma/client";
import { entityInputSchema, entityTypes, type EntityInput, type EntityType } from "./entity-schema";
import { getDb } from "./db";
export { entityInputSchema, entityTypes };
export type { EntityInput, EntityType };
export type LibraryEntity = {
  id: string;
  userId: string;
  type: EntityType;
  name: string;
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
  const data = entityInputSchema.partial({ type: true }).parse(input);
  const db = getDb();
  const result = await db.libraryEntity.updateMany({
    where: { id, userId },
    data,
  });

  if (result.count === 0) {
    throw new EntityNotFoundError();
  }

  const entity = await db.libraryEntity.findFirstOrThrow({ where: { id, userId } });
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
