-- ===================================================
-- 0. – OPCIONAL: BORRAR TABLA UNIFICADA DE USUARIOS
--    (Si ya no la vas a usar)
-- ===================================================
-- DROP TABLE IF EXISTS Usuarios;

-- ===================================================
-- 1. TABLA: Clientes
-- ---------------------------------------------------
-- Almacena solo la info necesaria de los compradores
-- ===================================================
CREATE TABLE Clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,   -- hash de contraseña
    telefono VARCHAR(20),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===================================================
-- 2. TABLA: Creadores
-- ---------------------------------------------------
-- Datos de organizadores a quienes se les ingresa
-- un método de cobro (tarjeta tokenizada)
-- ===================================================
CREATE TABLE Creadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,   -- hash de contraseña
    telefono VARCHAR(20),
    -- ¡Nunca guardes el número completo en texto!  
    -- Mejor almacena solo un token, los 4 últimos dígitos
    -- y fecha de expiración que te proporcione el PSP.
    tarjeta_token VARCHAR(100) NOT NULL,
    tarjeta_last4 CHAR(4) NOT NULL,
    tarjeta_expiry CHAR(5) NOT NULL,  -- MM/AA
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===================================================
-- 3. TABLA: Venues (Lugares)
-- ===================================================
CREATE TABLE Venues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    localidad VARCHAR(100) DEFAULT 'Madrid',
    capacidad_total INT,
    descripcion TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===================================================
-- 4. TABLA: Eventos
-- ---------------------------------------------------
-- Cada evento lo crea un Creador y se celebra en un Venue.
-- ===================================================
CREATE TABLE Eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_creador INT NOT NULL,
    id_venue INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha_evento DATETIME NOT NULL,
    imagen VARCHAR(255),
    estado ENUM('activo','cancelado','finalizado') 
           DEFAULT 'activo',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_eventos_creador
      FOREIGN KEY (id_creador) 
      REFERENCES Creadores(id)
      ON DELETE CASCADE,
    CONSTRAINT fk_eventos_venue
      FOREIGN KEY (id_venue) 
      REFERENCES Venues(id)
      ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ===================================================
-- 5. TABLA: Zonas_Evento
-- ===================================================
CREATE TABLE Zonas_Evento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_evento INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,       -- VIP, Premium, Palco...
    capacidad INT NOT NULL,
    precio_base DECIMAL(10,2) NOT NULL,
    descripcion VARCHAR(255),
    CONSTRAINT fk_zonas_evento_evento
      FOREIGN KEY (id_evento) 
      REFERENCES Eventos(id)
      ON DELETE CASCADE
) ENGINE=InnoDB;

-- ===================================================
-- 6. TABLA: Asientos (opcional)
-- ===================================================
CREATE TABLE Asientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_zona INT NOT NULL,
    fila INT,
    numero INT,
    estado ENUM('disponible','reservado','vendido') 
           DEFAULT 'disponible',
    CONSTRAINT fk_asientos_zona
      FOREIGN KEY (id_zona) 
      REFERENCES Zonas_Evento(id)
      ON DELETE CASCADE,
    UNIQUE(id_zona, fila, numero)
) ENGINE=InnoDB;

-- ===================================================
-- 7. TABLA: Entradas
-- ---------------------------------------------------
-- Cada entrada la compra un Cliente para una Zona,
-- y opcionalmente se asigna un Asiento.
-- ===================================================
CREATE TABLE Entradas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_evento INT NOT NULL,
    id_cliente INT NOT NULL,
    id_zona INT NOT NULL,
    id_asiento INT DEFAULT NULL,
    fecha_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activa','cancelada','usada') 
           DEFAULT 'activa',
    CONSTRAINT fk_entradas_evento
      FOREIGN KEY (id_evento) 
      REFERENCES Eventos(id)
      ON DELETE CASCADE,
    CONSTRAINT fk_entradas_cliente
      FOREIGN KEY (id_cliente) 
      REFERENCES Clientes(id)
      ON DELETE CASCADE,
    CONSTRAINT fk_entradas_zona
      FOREIGN KEY (id_zona) 
      REFERENCES Zonas_Evento(id)
      ON DELETE RESTRICT,
    CONSTRAINT fk_entradas_asiento
      FOREIGN KEY (id_asiento) 
      REFERENCES Asientos(id)
      ON DELETE SET NULL
) ENGINE=InnoDB;

-- ===================================================
-- 8. TABLA: Pagos
-- ===================================================
CREATE TABLE Pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_entrada INT NOT NULL,
    metodo_pago ENUM('tarjeta','transferencia','paypal','efectivo') 
           NOT NULL,
    link_comprobante VARCHAR(255),
    estado_pago ENUM('pendiente','aprobado','rechazado') 
           DEFAULT 'pendiente',
    fecha_pago DATETIME,
    CONSTRAINT fk_pagos_entrada
      FOREIGN KEY (id_entrada) 
      REFERENCES Entradas(id)
      ON DELETE CASCADE
) ENGINE=InnoDB;
