/*
  Warnings:

  - The primary key for the `device_metrics` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "device_metrics" DROP CONSTRAINT "device_metrics_pkey",
ADD CONSTRAINT "device_metrics_pkey" PRIMARY KEY ("id", "timestamp");
