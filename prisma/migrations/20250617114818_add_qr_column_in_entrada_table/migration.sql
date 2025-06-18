/*
  Warnings:

  - A unique constraint covering the columns `[qrToken]` on the table `Entrada` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `qrToken` to the `Entrada` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Entrada` ADD COLUMN `qrEnviado` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `qrToken` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Entrada_qrToken_key` ON `Entrada`(`qrToken`);
