/* Este archivo solo sirve con el fin de dar permisos de todo tipo al usuario
que le dimos a prima para que pueda ejecutar las migraciones a la base de datos
sin problemas. */
CREATE USER IF NOT EXISTS 'evoments_admin'@'%' IDENTIFIED BY 'evoments_615';
GRANT ALL PRIVILEGES ON *.* TO 'evoments_admin'@'%';
FLUSH PRIVILEGES;