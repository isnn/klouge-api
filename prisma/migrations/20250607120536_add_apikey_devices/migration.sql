/*
  Warnings:

  - A unique constraint covering the columns `[api_key]` on the table `devices` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "devices" ADD COLUMN     "api_key" VARCHAR(100);

-- CreateIndex
CREATE UNIQUE INDEX "devices_api_key_key" ON "devices"("api_key");
