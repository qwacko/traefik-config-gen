-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "autoDelete" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "parameters" TEXT,
    "lastRefresh" DATETIME,
    "routerTemplateId" TEXT,
    "serviceTemplateId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Source_routerTemplateId_fkey" FOREIGN KEY ("routerTemplateId") REFERENCES "RouterTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Source_serviceTemplateId_fkey" FOREIGN KEY ("serviceTemplateId") REFERENCES "ServiceTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Source" ("address", "autoDelete", "createdAt", "enabled", "id", "lastRefresh", "parameters", "routerTemplateId", "serviceTemplateId", "title", "type", "updatedAt") SELECT "address", "autoDelete", "createdAt", "enabled", "id", "lastRefresh", "parameters", "routerTemplateId", "serviceTemplateId", "title", "type", "updatedAt" FROM "Source";
DROP TABLE "Source";
ALTER TABLE "new_Source" RENAME TO "Source";
CREATE UNIQUE INDEX "Source_id_key" ON "Source"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
