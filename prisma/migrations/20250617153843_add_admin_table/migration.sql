-- CreateTable
CREATE TABLE `admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clerkUserId` VARCHAR(191) NOT NULL,
    `username` VARCHAR(100) NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `apellidos` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `telefono` VARCHAR(20) NULL,
    `fecha_registro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `admin_clerkUserId_key`(`clerkUserId`),
    UNIQUE INDEX `admin_username_key`(`username`),
    UNIQUE INDEX `admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
