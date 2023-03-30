/*
  Warnings:

  - You are about to drop the column `hashed_password` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `provider_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `expires` on the `session` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "key" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hashed_password" TEXT,
    "user_id" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL,
    "expires" BIGINT,
    CONSTRAINT "key_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL
);
INSERT INTO "new_user" ("id", "username") SELECT "id", "username" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
CREATE TABLE "new_session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "active_expires" BIGINT NOT NULL DEFAULT 0,
    "idle_expires" BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_session" ("id", "idle_expires", "user_id") SELECT "id", "idle_expires", "user_id" FROM "session";
DROP TABLE "session";
ALTER TABLE "new_session" RENAME TO "session";
CREATE UNIQUE INDEX "session_id_key" ON "session"("id");
CREATE INDEX "session_user_id_idx" ON "session"("user_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "key_id_key" ON "key"("id");

-- CreateIndex
CREATE INDEX "key_user_id_idx" ON "key"("user_id");
