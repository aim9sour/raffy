CREATE TYPE "ReadingStatus" AS ENUM ('UNREAD', 'READING', 'READ');

CREATE TABLE "Book" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "author" TEXT NOT NULL,
  "coverUrl" TEXT NOT NULL DEFAULT '',
  "category" TEXT NOT NULL DEFAULT 'Uncategorized',
  "shelf" TEXT NOT NULL DEFAULT 'General',
  "acquiredAt" TIMESTAMP(3),
  "status" "ReadingStatus" NOT NULL DEFAULT 'UNREAD',
  "rating" INTEGER,
  "notes" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Book_title_idx" ON "Book"("title");
CREATE INDEX "Book_author_idx" ON "Book"("author");
CREATE INDEX "Book_category_idx" ON "Book"("category");
CREATE INDEX "Book_shelf_idx" ON "Book"("shelf");
CREATE INDEX "Book_status_idx" ON "Book"("status");
