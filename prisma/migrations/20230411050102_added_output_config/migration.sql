-- CreateTable
CREATE TABLE "OutputConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "currentOutput" TEXT NOT NULL,
    "autoUpdate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OutputHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "current" BOOLEAN NOT NULL DEFAULT false,
    "changeTitle" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "configId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OutputHistory_configId_fkey" FOREIGN KEY ("configId") REFERENCES "OutputConfig" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "OutputConfig_id_key" ON "OutputConfig"("id");

-- CreateIndex
CREATE UNIQUE INDEX "OutputConfig_title_key" ON "OutputConfig"("title");

-- CreateIndex
CREATE UNIQUE INDEX "OutputHistory_id_key" ON "OutputHistory"("id");
