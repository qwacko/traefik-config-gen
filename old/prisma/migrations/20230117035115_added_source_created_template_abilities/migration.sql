-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ServiceTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "exampleData" TEXT,
    "editable" BOOLEAN NOT NULL DEFAULT true,
    "masterSourceId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ServiceTemplate_masterSourceId_fkey" FOREIGN KEY ("masterSourceId") REFERENCES "Source" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ServiceTemplate" ("createdAt", "exampleData", "id", "template", "title", "updatedAt") SELECT "createdAt", "exampleData", "id", "template", "title", "updatedAt" FROM "ServiceTemplate";
DROP TABLE "ServiceTemplate";
ALTER TABLE "new_ServiceTemplate" RENAME TO "ServiceTemplate";
CREATE UNIQUE INDEX "ServiceTemplate_id_key" ON "ServiceTemplate"("id");
CREATE UNIQUE INDEX "ServiceTemplate_title_key" ON "ServiceTemplate"("title");
CREATE TABLE "new_RouterTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "exampleData" TEXT,
    "editable" BOOLEAN NOT NULL DEFAULT true,
    "masterSourceId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RouterTemplate_masterSourceId_fkey" FOREIGN KEY ("masterSourceId") REFERENCES "Source" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_RouterTemplate" ("createdAt", "exampleData", "id", "template", "title", "updatedAt") SELECT "createdAt", "exampleData", "id", "template", "title", "updatedAt" FROM "RouterTemplate";
DROP TABLE "RouterTemplate";
ALTER TABLE "new_RouterTemplate" RENAME TO "RouterTemplate";
CREATE UNIQUE INDEX "RouterTemplate_id_key" ON "RouterTemplate"("id");
CREATE UNIQUE INDEX "RouterTemplate_title_key" ON "RouterTemplate"("title");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
