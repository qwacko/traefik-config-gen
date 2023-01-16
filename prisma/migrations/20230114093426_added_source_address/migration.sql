/*
  Warnings:

  - Added the required column `address` to the `Source` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "autoDelete" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "parameters" TEXT NOT NULL,
    "lastRefresh" DATETIME NOT NULL,
    "routerTemplateId" TEXT NOT NULL,
    "serviceTemplateId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Source_routerTemplateId_fkey" FOREIGN KEY ("routerTemplateId") REFERENCES "RouterTemplate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Source_serviceTemplateId_fkey" FOREIGN KEY ("serviceTemplateId") REFERENCES "ServiceTemplate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Source" ("autoDelete", "createdAt", "enabled", "id", "lastRefresh", "parameters", "routerTemplateId", "serviceTemplateId", "title", "type", "updatedAt") SELECT "autoDelete", "createdAt", "enabled", "id", "lastRefresh", "parameters", "routerTemplateId", "serviceTemplateId", "title", "type", "updatedAt" FROM "Source";
DROP TABLE "Source";
ALTER TABLE "new_Source" RENAME TO "Source";
CREATE UNIQUE INDEX "Source_id_key" ON "Source"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;