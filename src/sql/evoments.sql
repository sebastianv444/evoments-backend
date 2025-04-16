-- ===================================================
-- 1. TABLA: Usuarios
-- ---------------------------------------------------
-- Incluye ambos tipos de usuarios: CREADOR y CLIENTE.
-- Se recomienda almacenar la contraseña ya en hash.
-- ===================================================
CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- hash de la contraseña
    telefono VARCHAR(20),
    rol ENUM('creador', 'cliente') NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===================================================
-- 2. TABLA: Venues(Lugares)
-- ---------------------------------------------------
-- Información del lugar físico donde se realizan eventos.
-- Al estar enfocado a Madrid, se pueden incluir solo los datos necesarios.
-- ===================================================
CREATE TABLE Venues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    localidad VARCHAR(100) DEFAULT 'Madrid',
    capacidad_total INT,   -- Capacidad máxima del local (como referencia)
    descripcion TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===================================================
-- 3. TABLA: Eventos
-- ---------------------------------------------------
-- Cada evento está vinculado a un creador (usuario con rol 'creador')
-- y se realiza en un Venue.
-- ===================================================
CREATE TABLE Eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_creador INT NOT NULL,
    id_venue INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha_evento DATETIME NOT NULL,
    imagen VARCHAR(255),
    estado ENUM('activo','cancelado','finalizado') DEFAULT 'activo',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_eventos_creador FOREIGN KEY (id_creador) REFERENCES Usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_eventos_venue FOREIGN KEY (id_venue) REFERENCES Venues(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ===================================================
-- 4. TABLA: Zonas_Evento
-- ---------------------------------------------------
-- Cada evento puede tener varias zonas (ej. VIP, Premium, Palco, etc)
-- donde se define la capacidad y el precio específico de esa zona.
-- Se pueden establecer condiciones particulares según el evento,
-- por ejemplo, que algunas zonas tengan menos asientos disponibles.
-- ===================================================
CREATE TABLE Zonas_Evento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_evento INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,       -- Ej. 'VIP', 'Premium', 'Palco'
    capacidad INT NOT NULL,             -- Capacidad asignada a la zona para este evento
    precio_base DECIMAL(10,2) NOT NULL,   -- Precio para esta zona
    descripcion VARCHAR(255),
    CONSTRAINT fk_zonas_evento_evento FOREIGN KEY (id_evento) REFERENCES Eventos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ===================================================
-- 5. TABLA: Asientos
-- ---------------------------------------------------
-- En eventos donde se asignen asientos numerados, se registran aquí.
-- No todos los eventos lo requieren, por lo que este dato es opcional.
-- Cada asiento se relaciona con una zona de un evento.
-- ===================================================
CREATE TABLE Asientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_zona INT NOT NULL,
    fila INT,                    -- Puede ser NULL si no aplica
    numero INT,
    estado ENUM('disponible','reservado','vendido') DEFAULT 'disponible',
    CONSTRAINT fk_asientos_zona FOREIGN KEY (id_zona) REFERENCES Zonas_Evento(id) ON DELETE CASCADE,
    UNIQUE(id_zona, fila, numero)  -- Para evitar duplicados en una misma zona
) ENGINE=InnoDB;

-- ===================================================
-- 6. TABLA: Entradas
-- ---------------------------------------------------
-- Registro de la compra de entradas (tickets).
-- Cada entrada se asocia a un evento, un comprador y a una zona.
-- La asignación a un asiento es opcional (para los casos de asientos numerados).
-- Se puede ampliar con un estado (por ejemplo, activa, cancelada).
-- ===================================================
CREATE TABLE Entradas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_evento INT NOT NULL,
    id_comprador INT NOT NULL,   -- Usuario que compra (cliente)
    id_zona INT NOT NULL,        -- Zona en el evento para la que se compra
    id_asiento INT DEFAULT NULL, -- Opcional: se rellena solo si el evento tiene asignación de asiento
    fecha_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activa','cancelada','usada') DEFAULT 'activa',
    CONSTRAINT fk_entradas_evento FOREIGN KEY (id_evento) REFERENCES Eventos(id) ON DELETE CASCADE,
    CONSTRAINT fk_entradas_comprador FOREIGN KEY (id_comprador) REFERENCES Usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_entradas_zona FOREIGN KEY (id_zona) REFERENCES Zonas_Evento(id) ON DELETE RESTRICT,
    CONSTRAINT fk_entradas_asiento FOREIGN KEY (id_asiento) REFERENCES Asientos(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ===================================================
-- 7. TABLA: Pagos
-- ---------------------------------------------------
-- Registro de la transacción o comprobante de pago.
-- Se almacena información relevante del método de pago y el comprobante.
-- ===================================================
CREATE TABLE Pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_entrada INT NOT NULL,
    metodo_pago ENUM('tarjeta','transferencia','paypal','efectivo') NOT NULL,
    link_comprobante VARCHAR(255),   -- Podría ser un link a PDF, imagen, etc.
    estado_pago ENUM('pendiente','aprobado','rechazado') DEFAULT 'pendiente',
    fecha_pago DATETIME,
    CONSTRAINT fk_pagos_entrada FOREIGN KEY (id_entrada) REFERENCES Entradas(id) ON DELETE CASCADE
) ENGINE=InnoDB;
