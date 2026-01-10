/*
  Warnings:

  - You are about to drop the column `notes` on the `checklists` table. All the data in the column will be lost.
  - You are about to drop the column `clientEmail` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `clientName` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `clientPhone` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailUrl` on the `photos` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `checklist_templates` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "checklists" DROP COLUMN "notes";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "clientEmail",
DROP COLUMN "clientName",
DROP COLUMN "clientPhone",
DROP COLUMN "location";

-- AlterTable
ALTER TABLE "photos" DROP COLUMN "thumbnailUrl";

-- AlterTable
ALTER TABLE "refresh_tokens" DROP COLUMN "ipAddress",
DROP COLUMN "userAgent";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatarUrl";

-- DropTable
DROP TABLE "checklist_templates";
