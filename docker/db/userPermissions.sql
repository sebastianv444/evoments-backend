CREATE USER IF NOT EXISTS 'evoments_admin'@'%' IDENTIFIED BY 'evoments_615';
GRANT ALL PRIVILEGES ON *.* TO 'evoments_admin'@'%';
FLUSH PRIVILEGES;