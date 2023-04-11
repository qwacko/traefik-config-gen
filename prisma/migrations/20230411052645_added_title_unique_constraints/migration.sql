/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Host` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[address]` on the table `OutputConfig` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `Source` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Host_title_key" ON "Host"("title");

-- CreateIndex
CREATE UNIQUE INDEX "OutputConfig_address_key" ON "OutputConfig"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Source_title_key" ON "Source"("title");
