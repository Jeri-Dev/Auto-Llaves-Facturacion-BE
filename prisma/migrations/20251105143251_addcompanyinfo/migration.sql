-- CreateTable
CREATE TABLE "company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "rnc" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "secondPhoneNumber" TEXT,
    "nextGovernmentalNCF" TEXT NOT NULL,
    "nextCreditNCF" TEXT NOT NULL,
    "nextEndConsumerNCF" TEXT NOT NULL,
    "nextQuoteNumber" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "company_rnc_key" ON "company"("rnc");
