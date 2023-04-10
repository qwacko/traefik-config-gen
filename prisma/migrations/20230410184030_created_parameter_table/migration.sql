/*
  Warnings:

  - You are about to drop the column `parameters` on the `Host` table. All the data in the column will be lost.
  - You are about to drop the column `parameters` on the `Source` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Parameter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "hostId" TEXT,
    "sourceId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Parameter_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Parameter_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Host" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
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
CREATE TABLE "new_Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "autoDelete" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastRefresh" DATETIME,
    "defaultRouterTemplateId" TEXT,
    "defaultServiceTemplateId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Source_defaultRouterTemplateId_fkey" FOREIGN KEY ("defaultRouterTemplateId") REFERENCES "RouterTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Source_defaultServiceTemplateId_fkey" FOREIGN KEY ("defaultServiceTemplateId") REFERENCES "ServiceTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Source" ("address", "autoDelete", "createdAt", "defaultRouterTemplateId", "defaultServiceTemplateId", "enabled", "id", "lastRefresh", "title", "type", "updatedAt") SELECT "address", "autoDelete", "createdAt", "defaultRouterTemplateId", "defaultServiceTemplateId", "enabled", "id", "lastRefresh", "title", "type", "updatedAt" FROM "Source";
DROP TABLE "Source";
ALTER TABLE "new_Source" RENAME TO "Source";
CREATE UNIQUE INDEX "Source_id_key" ON "Source"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Parameter_id_key" ON "Parameter"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Parameter_hostId_sourceId_label_key" ON "Parameter"("hostId", "sourceId", "label");
