/*
  Warnings:

  - You are about to drop the column `password` on the `Creador` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeAccountId]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerkUserId]` on the table `Creador` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkUserId` to the `Creador` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Cliente` ADD COLUMN `stripeAccountId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Creador` DROP COLUMN `password`,
    ADD COLUMN `clerkUserId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Cliente_stripeAccountId_key` ON `Cliente`(`stripeAccountId`);

-- CreateIndex
CREATE UNIQUE INDEX `Creador_clerkUserId_key` ON `Creador`(`clerkUserId`);
