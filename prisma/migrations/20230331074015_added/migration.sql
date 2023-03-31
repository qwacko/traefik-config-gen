-- CreateTable
CREATE TABLE "RouterTemplate" (
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

-- CreateTable
CREATE TABLE "ServiceTemplate" (
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

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "autoDelete" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "parameters" TEXT,
    "lastRefresh" DATETIME,
    "defaultRouterTemplateId" TEXT,
    "defaultServiceTemplateId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Source_defaultRouterTemplateId_fkey" FOREIGN KEY ("defaultRouterTemplateId") REFERENCES "RouterTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Source_defaultServiceTemplateId_fkey" FOREIGN KEY ("defaultServiceTemplateId") REFERENCES "ServiceTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Host" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "parameters" TEXT,
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

-- CreateIndex
CREATE UNIQUE INDEX "RouterTemplate_id_key" ON "RouterTemplate"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RouterTemplate_title_key" ON "RouterTemplate"("title");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceTemplate_id_key" ON "ServiceTemplate"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceTemplate_title_key" ON "ServiceTemplate"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Source_id_key" ON "Source"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Host_id_key" ON "Host"("id");
