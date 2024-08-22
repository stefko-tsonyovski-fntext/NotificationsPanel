/*
  Warnings:

  - Added the required column `personName` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseNumber` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "personName" TEXT NOT NULL,
ADD COLUMN     "releaseNumber" TEXT NOT NULL;
