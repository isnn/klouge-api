/*
  Warnings:

  - You are about to drop the column `api_key` on the `devices` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "devices_api_key_key";

-- AlterTable
ALTER TABLE "devices" DROP COLUMN "api_key";
