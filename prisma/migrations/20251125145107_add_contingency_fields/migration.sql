/*
  Warnings:

  - You are about to drop the column `contingencies` on the `Offer` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Offer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "offerPrice" INTEGER NOT NULL,
    "earnestMoney" INTEGER NOT NULL,
    "financingType" TEXT NOT NULL,
    "downPaymentPercent" INTEGER,
    "preApproved" BOOLEAN NOT NULL DEFAULT false,
    "inspectionContingency" BOOLEAN NOT NULL DEFAULT true,
    "inspectionDays" INTEGER,
    "appraisalContingency" BOOLEAN NOT NULL DEFAULT true,
    "appraisalDays" INTEGER,
    "financingContingency" BOOLEAN NOT NULL DEFAULT true,
    "financingDays" INTEGER,
    "targetClosingDate" DATETIME,
    "sellerConcessions" TEXT,
    "additionalTerms" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Offer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Offer" ("additionalTerms", "createdAt", "downPaymentPercent", "earnestMoney", "financingType", "id", "listingId", "offerPrice", "preApproved", "sellerConcessions", "status", "targetClosingDate", "updatedAt", "userId") SELECT "additionalTerms", "createdAt", "downPaymentPercent", "earnestMoney", "financingType", "id", "listingId", "offerPrice", "preApproved", "sellerConcessions", "status", "targetClosingDate", "updatedAt", "userId" FROM "Offer";
DROP TABLE "Offer";
ALTER TABLE "new_Offer" RENAME TO "Offer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
