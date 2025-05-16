-- CreateTable
CREATE TABLE `Cliente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `apellidos` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `telefono` VARCHAR(20) NULL,
    `fecha_registro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Cliente_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Creador` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `apellidos` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `telefono` VARCHAR(20) NULL,
    `tarjeta_token` VARCHAR(100) NOT NULL,
    `tarjeta_last4` CHAR(4) NOT NULL,
    `tarjeta_expiry` CHAR(5) NOT NULL,
    `fecha_registro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Creador_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Venue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `direccion` VARCHAR(255) NOT NULL,
    `localidad` VARCHAR(100) NOT NULL DEFAULT 'Madrid',
    `capacidad_total` INTEGER NOT NULL,
    `descripcion` TEXT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_creador` INTEGER NOT NULL,
    `id_venue` INTEGER NOT NULL,
    `titulo` VARCHAR(150) NOT NULL,
    `descripcion` TEXT NULL,
    `fecha_evento` DATETIME(3) NOT NULL,
    `imagen` VARCHAR(255) NULL,
    `estado` ENUM('ACTIVO', 'CANCELADO', 'FINALIZADO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZonaEvento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_evento` INTEGER NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `capacidad` INTEGER NOT NULL,
    `precio_base` DECIMAL(10, 2) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `venueId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Asiento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_zona` INTEGER NOT NULL,
    `fila` INTEGER NULL,
    `numero` INTEGER NULL,
    `estado` ENUM('DISPONIBLE', 'RESERVADO', 'VENDIDO') NOT NULL DEFAULT 'DISPONIBLE',

    UNIQUE INDEX `Asiento_id_zona_fila_numero_key`(`id_zona`, `fila`, `numero`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Entrada` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_evento` INTEGER NOT NULL,
    `id_cliente` INTEGER NOT NULL,
    `id_zona` INTEGER NOT NULL,
    `id_asiento` INTEGER NULL,
    `fecha_compra` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estado` ENUM('ACTIVA', 'CANCELADA', 'USADA') NOT NULL DEFAULT 'ACTIVA',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pago` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_entrada` INTEGER NOT NULL,
    `metodo_pago` ENUM('TARJETA', 'TRANSFERENCIA', 'PAYPAL', 'EFECTIVO') NOT NULL,
    `link_comprobante` VARCHAR(255) NULL,
    `estado_pago` ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO') NOT NULL DEFAULT 'PENDIENTE',
    `fecha_pago` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Evento` ADD CONSTRAINT `Evento_id_creador_fkey` FOREIGN KEY (`id_creador`) REFERENCES `Creador`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evento` ADD CONSTRAINT `Evento_id_venue_fkey` FOREIGN KEY (`id_venue`) REFERENCES `Venue`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ZonaEvento` ADD CONSTRAINT `ZonaEvento_id_evento_fkey` FOREIGN KEY (`id_evento`) REFERENCES `Evento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ZonaEvento` ADD CONSTRAINT `ZonaEvento_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `Venue`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Asiento` ADD CONSTRAINT `Asiento_id_zona_fkey` FOREIGN KEY (`id_zona`) REFERENCES `ZonaEvento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entrada` ADD CONSTRAINT `Entrada_id_evento_fkey` FOREIGN KEY (`id_evento`) REFERENCES `Evento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entrada` ADD CONSTRAINT `Entrada_id_cliente_fkey` FOREIGN KEY (`id_cliente`) REFERENCES `Cliente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entrada` ADD CONSTRAINT `Entrada_id_zona_fkey` FOREIGN KEY (`id_zona`) REFERENCES `ZonaEvento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entrada` ADD CONSTRAINT `Entrada_id_asiento_fkey` FOREIGN KEY (`id_asiento`) REFERENCES `Asiento`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pago` ADD CONSTRAINT `Pago_id_entrada_fkey` FOREIGN KEY (`id_entrada`) REFERENCES `Entrada`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
