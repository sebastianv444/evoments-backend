/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Creador` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Creador` ADD COLUMN `username` VARCHAR(100) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Creador_username_key` ON `Creador`(`username`);
