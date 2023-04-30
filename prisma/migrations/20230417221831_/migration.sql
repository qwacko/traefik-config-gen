/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `Source` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Source" ADD COLUMN "identifier" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Source_identifier_key" ON "Source"("identifier");
