ALTER TABLE "Book" ADD COLUMN "userId" TEXT NOT NULL DEFAULT 'legacy-user';

CREATE INDEX "Book_userId_idx" ON "Book"("userId");

ALTER TABLE "Book" ALTER COLUMN "userId" DROP DEFAULT;
