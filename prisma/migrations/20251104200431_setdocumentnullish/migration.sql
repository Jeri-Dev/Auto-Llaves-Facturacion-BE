-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_invoices" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" INTEGER,
    "customerName" TEXT,
    "type" TEXT NOT NULL,
    "document" TEXT,
    "items" JSONB NOT NULL,
    "subtotal" REAL NOT NULL,
    "taxes" REAL NOT NULL,
    "total" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "invoices_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_invoices" ("createdAt", "customerId", "customerName", "document", "id", "items", "subtotal", "taxes", "total", "type") SELECT "createdAt", "customerId", "customerName", "document", "id", "items", "subtotal", "taxes", "total", "type" FROM "invoices";
DROP TABLE "invoices";
ALTER TABLE "new_invoices" RENAME TO "invoices";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
