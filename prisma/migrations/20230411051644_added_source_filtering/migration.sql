-- CreateTable
CREATE TABLE "_outputConfigIncludedHosts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_outputConfigIncludedHosts_A_fkey" FOREIGN KEY ("A") REFERENCES "Host" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_outputConfigIncludedHosts_B_fkey" FOREIGN KEY ("B") REFERENCES "OutputConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_outputConfigExcludedHosts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_outputConfigExcludedHosts_A_fkey" FOREIGN KEY ("A") REFERENCES "Host" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_outputConfigExcludedHosts_B_fkey" FOREIGN KEY ("B") REFERENCES "OutputConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_outputConfigIncludedSources" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_outputConfigIncludedSources_A_fkey" FOREIGN KEY ("A") REFERENCES "OutputConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_outputConfigIncludedSources_B_fkey" FOREIGN KEY ("B") REFERENCES "Source" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_outputConfigExcludedSources" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_outputConfigExcludedSources_A_fkey" FOREIGN KEY ("A") REFERENCES "OutputConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_outputConfigExcludedSources_B_fkey" FOREIGN KEY ("B") REFERENCES "Source" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_outputConfigIncludedHosts_AB_unique" ON "_outputConfigIncludedHosts"("A", "B");

-- CreateIndex
CREATE INDEX "_outputConfigIncludedHosts_B_index" ON "_outputConfigIncludedHosts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_outputConfigExcludedHosts_AB_unique" ON "_outputConfigExcludedHosts"("A", "B");

-- CreateIndex
CREATE INDEX "_outputConfigExcludedHosts_B_index" ON "_outputConfigExcludedHosts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_outputConfigIncludedSources_AB_unique" ON "_outputConfigIncludedSources"("A", "B");

-- CreateIndex
CREATE INDEX "_outputConfigIncludedSources_B_index" ON "_outputConfigIncludedSources"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_outputConfigExcludedSources_AB_unique" ON "_outputConfigExcludedSources"("A", "B");

-- CreateIndex
CREATE INDEX "_outputConfigExcludedSources_B_index" ON "_outputConfigExcludedSources"("B");
