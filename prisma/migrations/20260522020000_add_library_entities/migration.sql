CREATE TYPE "EntityType" AS ENUM ('AUTHOR', 'CATEGORY', 'SHELF');

CREATE TABLE "LibraryEntity" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" "EntityType" NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "LibraryEntity_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LibraryEntity_userId_type_name_key" ON "LibraryEntity"("userId", "type", "name");
CREATE INDEX "LibraryEntity_userId_type_idx" ON "LibraryEntity"("userId", "type");

INSERT INTO "LibraryEntity" ("id", "userId", "type", "name", "createdAt", "updatedAt")
SELECT 'author_' || md5("userId" || "author"), "userId", 'AUTHOR'::"EntityType", "author", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM (SELECT DISTINCT "userId", "author" FROM "Book" WHERE trim("author") <> '') authors
ON CONFLICT ("userId", "type", "name") DO NOTHING;

INSERT INTO "LibraryEntity" ("id", "userId", "type", "name", "createdAt", "updatedAt")
SELECT 'category_' || md5("userId" || "category"), "userId", 'CATEGORY'::"EntityType", "category", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM (SELECT DISTINCT "userId", "category" FROM "Book" WHERE trim("category") <> '') categories
ON CONFLICT ("userId", "type", "name") DO NOTHING;

INSERT INTO "LibraryEntity" ("id", "userId", "type", "name", "createdAt", "updatedAt")
SELECT 'shelf_' || md5("userId" || "shelf"), "userId", 'SHELF'::"EntityType", "shelf", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM (SELECT DISTINCT "userId", "shelf" FROM "Book" WHERE trim("shelf") <> '') shelves
ON CONFLICT ("userId", "type", "name") DO NOTHING;
