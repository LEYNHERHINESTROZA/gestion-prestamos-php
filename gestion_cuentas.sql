-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS gestion_cuentas;

-- Seleccionar la base de datos
USE gestion_cuentas;

-- Crear la tabla de préstamos
CREATE TABLE prestamos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    monto_prestamo DECIMAL(10,2) NOT NULL,
    interes DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    observaciones TEXT,
    abono_interes DECIMAL(10,2) DEFAULT 0,
    abono_capital DECIMAL(10,2) DEFAULT 0,
    saldo_restante DECIMAL(10,2) NOT NULL
);