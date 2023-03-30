/*
  Warnings:

  - You are about to drop the column `primary` on the `auth_key` table. All the data in the column will be lost.
  - Added the required column `primary_key` to the `auth_key` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_auth_key" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hashed_password" TEXT,
    "user_id" TEXT NOT NULL,
    "primary_key" BOOLEAN NOT NULL,
    "expires" BIGINT,
    CONSTRAINT "auth_key_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_auth_key" ("expires", "hashed_password", "id", "user_id") SELECT "expires", "hashed_password", "id", "user_id" FROM "auth_key";
DROP TABLE "auth_key";
ALTER TABLE "new_auth_key" RENAME TO "auth_key";
CREATE UNIQUE INDEX "auth_key_id_key" ON "auth_key"("id");
CREATE INDEX "auth_key_user_id_idx" ON "auth_key"("user_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
