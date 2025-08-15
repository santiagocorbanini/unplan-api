CREATE TABLE shows (
show_id SERIAL PRIMARY KEY,
title VARCHAR(255),
venue VARCHAR(255),
event_date DATE,
city VARCHAR(255),
url VARCHAR(255),
end_date TIMESTAMP,
start_date TIMESTAMP,
completedevent BOOLEAN DEFAULT(FALSE),
);

ALTER TABLE shows 
ADD COLUMN image_url VARCHAR(255);
ADD COLUMN categories VARCHAR(255)[],
ADD COLUMN instagram VARCHAR(255),
ADD COLUMN web VARCHAR(255),
ADD COLUMN address VARCHAR(255);
ADD COLUMN is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN youtube VARCHAR(255),
ADD COLUMN description TEXT;

-- Tabla de secciones
CREATE TABLE secciones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    seccion_padre VARCHAR(50) CHECK (seccion_padre IN ('salir', 'comer', 'dormir', 'actividades', 'comercios'))
);

-- Tabla de lugares
CREATE TABLE lugares (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    direccion VARCHAR(255),
    link_direccion VARCHAR(255),
    telefono VARCHAR(50),
    logo_url VARCHAR(255) NOT NULL,
    descripcion TEXT,
    reservas VARCHAR(255),
    menu VARCHAR(255),
    delivery VARCHAR(255),
    web VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    instagram VARCHAR(255),
    youtube VARCHAR(255),
    seccion_id INT NOT NULL,
    FOREIGN KEY (seccion_id) REFERENCES secciones(id) ON DELETE CASCADE
);