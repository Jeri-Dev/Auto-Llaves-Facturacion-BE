/*
  Warnings:

  - Added the required column `nextCreditExpiration` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextEndConsumerExpiration` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextGovernmentalExpiration` to the `company` table without a default value. This is not possible if the table is not empty.

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
    "nextEndConsumerExpiration" DATETIME NOT NULL,
    "nextQuoteNumber" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_company" ("address", "createdAt", "id", "name", "nextCreditNCF", "nextEndConsumerNCF", "nextGovernmentalNCF", "nextQuoteNumber", "phoneNumber", "rnc", "secondPhoneNumber", "updatedAt") SELECT "address", "createdAt", "id", "name", "nextCreditNCF", "nextEndConsumerNCF", "nextGovernmentalNCF", "nextQuoteNumber", "phoneNumber", "rnc", "secondPhoneNumber", "updatedAt" FROM "company";
DROP TABLE "company";
ALTER TABLE "new_company" RENAME TO "company";
CREATE UNIQUE INDEX "company_rnc_key" ON "company"("rnc");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
