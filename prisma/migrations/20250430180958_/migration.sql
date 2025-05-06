/*
  Warnings:

  - You are about to drop the column `password` on the `Cliente` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerkUserId]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkUserId` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Cliente` DROP COLUMN `password`,
    ADD COLUMN `clerkUserId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Cliente_clerkUserId_key` ON `Cliente`(`clerkUserId`);
