/*
  Warnings:

  - Added the required column `username` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider_id" TEXT NOT NULL,
    "hashed_password" TEXT,
    "username" TEXT NOT NULL
);
INSERT INTO "new_user" ("hashed_password", "id", "provider_id") SELECT "hashed_password", "id", "provider_id" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");
CREATE UNIQUE INDEX "user_provider_id_key" ON "user"("provider_id");
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
