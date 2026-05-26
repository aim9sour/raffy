ALTER TABLE "LibraryEntity" ADD COLUMN "category" TEXT;

UPDATE "LibraryEntity" AS entity
SET "category" = shelf_source."category"
FROM (
  SELECT "userId", "shelf", MIN("category") AS "category"
  FROM "Book"
  WHERE "shelf" IS NOT NULL AND "shelf" <> ''
  GROUP BY "userId", "shelf"
) AS shelf_source
WHERE entity."type" = 'SHELF'
  AND entity."userId" = shelf_source."userId"
  AND entity."name" = shelf_source."shelf";

UPDATE "LibraryEntity"
SET "category" = 'Uncategorized'
WHERE "type" = 'SHELF' AND "category" IS NULL;

DROP INDEX IF EXISTS "LibraryEntity_userId_type_name_key";

CREATE UNIQUE INDEX "LibraryEntity_userId_type_name_category_key"
ON "LibraryEntity"("userId", "type", "name", COALESCE("category", ''));
