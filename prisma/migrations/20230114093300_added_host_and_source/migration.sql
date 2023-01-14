-- CreateTable
CREATE TABLE "RouterTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ServiceTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "Host" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "parameters" TEXT,
    "lastSeen" DATETIME NOT NULL,
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
