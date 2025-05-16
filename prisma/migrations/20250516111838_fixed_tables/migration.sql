/*
  Warnings:

  - You are about to drop the column `tarjeta_expiry` on the `Creador` table. All the data in the column will be lost.
  - You are about to drop the column `tarjeta_last4` on the `Creador` table. All the data in the column will be lost.
  - You are about to drop the column `tarjeta_token` on the `Creador` table. All the data in the column will be lost.
  - You are about to drop the column `estado_pago` on the `Pago` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_pago` on the `Pago` table. All the data in the column will be lost.
  - You are about to drop the column `link_comprobante` on the `Pago` table. All the data in the column will be lost.
  - You are about to drop the column `metodo_pago` on the `Pago` table. All the data in the column will be lost.
  - You are about to drop the column `venueId` on the `ZonaEvento` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeAccountId]` on the table `Creador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripe_payment_intent_id]` on the table `Pago` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripe_charge_id]` on the table `Pago` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripe_transfer_id]` on the table `Pago` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeAccountId` to the `Creador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Pago` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Pago` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripe_payment_intent_id` to the `Pago` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ZonaEvento` DROP FOREIGN KEY `ZonaEvento_venueId_fkey`;

-- DropIndex
DROP INDEX `ZonaEvento_venueId_fkey` ON `ZonaEvento`;

-- AlterTable
ALTER TABLE `Asiento` MODIFY `fila` VARCHAR(5) NULL;

-- AlterTable
ALTER TABLE `Cliente` ADD COLUMN `username` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `Creador` DROP COLUMN `tarjeta_expiry`,
    DROP COLUMN `tarjeta_last4`,
    DROP COLUMN `tarjeta_token`,
    ADD COLUMN `stripeAccountId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Evento` MODIFY `estado` ENUM('ACTIVO', 'CANCELADO', 'FINALIZADO', 'PENDIENTE') NOT NULL DEFAULT 'PENDIENTE';

-- AlterTable
ALTER TABLE `Pago` DROP COLUMN `estado_pago`,
    DROP COLUMN `fecha_pago`,
    DROP COLUMN `link_comprobante`,
    DROP COLUMN `metodo_pago`,
    ADD COLUMN `amount` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `application_fee` DECIMAL(10, 2) NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `currency` CHAR(3) NOT NULL,
    ADD COLUMN `payout_status` VARCHAR(191) NULL,
    ADD COLUMN `stripe_charge_id` VARCHAR(191) NULL,
    ADD COLUMN `stripe_payment_intent_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `stripe_transfer_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ZonaEvento` DROP COLUMN `venueId`,
    ADD COLUMN `ventaNumerada` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `Cliente_username_key` ON `Cliente`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `Creador_stripeAccountId_key` ON `Creador`(`stripeAccountId`);

-- CreateIndex
CREATE UNIQUE INDEX `Pago_stripe_payment_intent_id_key` ON `Pago`(`stripe_payment_intent_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Pago_stripe_charge_id_key` ON `Pago`(`stripe_charge_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Pago_stripe_transfer_id_key` ON `Pago`(`stripe_transfer_id`);
