/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `RouterTemplate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifier]` on the table `ServiceTemplate` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RouterTemplate" ADD COLUMN "identifier" TEXT;

-- AlterTable
ALTER TABLE "ServiceTemplate" ADD COLUMN "identifier" TEXT;

-- AlterTable
ALTER TABLE "Source" ADD COLUMN "lastRefreshData" TEXT;
ALTER TABLE "Source" ADD COLUMN "lastRefreshErrors" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Host" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "identifier" TEXT,
    "lastSeen" DATETIME NOT NULL,
    "errors" TEXT,
    "sourceId" TEXT NOT NULL,
    "customRouter" TEXT,
    "routerTemplateId" TEXT,
    "customService" TEXT,
    "serviceTemplateId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Host_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Host_routerTemplateId_fkey" FOREIGN KEY ("routerTemplateId") REFERENCES "RouterTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Host_serviceTemplateId_fkey" FOREIGN KEY ("serviceTemplateId") REFERENCES "ServiceTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Host" ("createdAt", "customRouter", "customService", "errors", "id", "identifier", "lastSeen", "routerTemplateId", "serviceTemplateId", "sourceId", "title", "updatedAt") SELECT "createdAt", "customRouter", "customService", "errors", "id", "identifier", "lastSeen", "routerTemplateId", "serviceTemplateId", "sourceId", "title", "updatedAt" FROM "Host";
DROP TABLE "Host";
ALTER TABLE "new_Host" RENAME TO "Host";
CREATE UNIQUE INDEX "Host_id_key" ON "Host"("id");
CREATE UNIQUE INDEX "Host_title_key" ON "Host"("title");
CREATE UNIQUE INDEX "Host_identifier_key" ON "Host"("identifier");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "RouterTemplate_identifier_key" ON "RouterTemplate"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceTemplate_identifier_key" ON "ServiceTemplate"("identifier");
