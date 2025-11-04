/*
  Warnings:

  - You are about to drop the column `email` on the `customers` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_customers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_customers" ("createdAt", "document", "id", "name", "phone") SELECT "createdAt", "document", "id", "name", "phone" FROM "customers";
DROP TABLE "customers";
ALTER TABLE "new_customers" RENAME TO "customers";
CREATE UNIQUE INDEX "customers_document_key" ON "customers"("document");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
