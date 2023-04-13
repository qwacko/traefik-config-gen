-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "autoDelete" BOOLEAN NOT NULL DEFAULT false,
    "autoUpdate" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastRefresh" DATETIME,
    "lastRefreshData" TEXT,
    "lastRefreshErrors" TEXT,
    "defaultRouterTemplateId" TEXT,
    "defaultServiceTemplateId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Source_defaultRouterTemplateId_fkey" FOREIGN KEY ("defaultRouterTemplateId") REFERENCES "RouterTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Source_defaultServiceTemplateId_fkey" FOREIGN KEY ("defaultServiceTemplateId") REFERENCES "ServiceTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Source" ("address", "autoDelete", "createdAt", "defaultRouterTemplateId", "defaultServiceTemplateId", "enabled", "id", "lastRefresh", "lastRefreshData", "lastRefreshErrors", "title", "type", "updatedAt") SELECT "address", "autoDelete", "createdAt", "defaultRouterTemplateId", "defaultServiceTemplateId", "enabled", "id", "lastRefresh", "lastRefreshData", "lastRefreshErrors", "title", "type", "updatedAt" FROM "Source";
DROP TABLE "Source";
ALTER TABLE "new_Source" RENAME TO "Source";
CREATE UNIQUE INDEX "Source_id_key" ON "Source"("id");
CREATE UNIQUE INDEX "Source_title_key" ON "Source"("title");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
