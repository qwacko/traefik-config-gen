-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "identifier" TEXT,
    "type" TEXT NOT NULL,
    "address" TEXT,
    "autoDelete" BOOLEAN NOT NULL DEFAULT false,
    "autoUpdate" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastRefresh" DATETIME,
    "lastRefreshData" TEXT,
    "lastRefreshErrors" TEXT,
    "lastRefreshErrorsDate" DATETIME,
    "defaultRouterTemplateId" TEXT NOT NULL,
    "defaultServiceTemplateId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Source_defaultRouterTemplateId_fkey" FOREIGN KEY ("defaultRouterTemplateId") REFERENCES "RouterTemplate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Source_defaultServiceTemplateId_fkey" FOREIGN KEY ("defaultServiceTemplateId") REFERENCES "ServiceTemplate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Source" ("address", "autoDelete", "autoUpdate", "createdAt", "defaultRouterTemplateId", "defaultServiceTemplateId", "enabled", "id", "identifier", "lastRefresh", "lastRefreshData", "lastRefreshErrors", "lastRefreshErrorsDate", "title", "type", "updatedAt") SELECT "address", "autoDelete", "autoUpdate", "createdAt", "defaultRouterTemplateId", "defaultServiceTemplateId", "enabled", "id", "identifier", "lastRefresh", "lastRefreshData", "lastRefreshErrors", "lastRefreshErrorsDate", "title", "type", "updatedAt" FROM "Source";
DROP TABLE "Source";
ALTER TABLE "new_Source" RENAME TO "Source";
CREATE UNIQUE INDEX "Source_id_key" ON "Source"("id");
CREATE UNIQUE INDEX "Source_title_key" ON "Source"("title");
CREATE UNIQUE INDEX "Source_identifier_key" ON "Source"("identifier");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
