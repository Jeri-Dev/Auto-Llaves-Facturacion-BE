/*
  Warnings:

  - You are about to drop the column `nextEndConsumerExpiration` on the `company` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "rnc" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "secondPhoneNumber" TEXT,
    "nextGovernmentalNCF" TEXT NOT NULL,
    "nextGovernmentalExpiration" DATETIME NOT NULL,
    "nextCreditNCF" TEXT NOT NULL,
    "nextCreditExpiration" DATETIME NOT NULL,
    "nextEndConsumerNCF" TEXT NOT NULL,
    "nextQuoteNumber" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_company" ("address", "createdAt", "id", "name", "nextCreditExpiration", "nextCreditNCF", "nextEndConsumerNCF", "nextGovernmentalExpiration", "nextGovernmentalNCF", "nextQuoteNumber", "phoneNumber", "rnc", "secondPhoneNumber", "updatedAt") SELECT "address", "createdAt", "id", "name", "nextCreditExpiration", "nextCreditNCF", "nextEndConsumerNCF", "nextGovernmentalExpiration", "nextGovernmentalNCF", "nextQuoteNumber", "phoneNumber", "rnc", "secondPhoneNumber", "updatedAt" FROM "company";
DROP TABLE "company";
ALTER TABLE "new_company" RENAME TO "company";
CREATE UNIQUE INDEX "company_rnc_key" ON "company"("rnc");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
