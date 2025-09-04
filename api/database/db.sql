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

CREATE TABLE info (
    id SERIAL PRIMARY KEY,
    como_llegar TEXT,
    numeros_utiles TEXT,
    atractivos TEXT,
    transporte TEXT
);

-- Insertar un registro inicial
INSERT INTO info (id, como_llegar, numeros_utiles, atractivos, transporte)
VALUES (1, '', '', '', '');

CREATE TABLE colors (
  id SERIAL PRIMARY KEY,
  general VARCHAR(7),         -- ej: #000000 o 000000
  primary_color VARCHAR(7),   -- 'primary' en el body → se guarda aquí
  background VARCHAR(7)
);

-- Registro inicial único
INSERT INTO colors (id, general, primary_color, background)
VALUES (1, '#000000', '#123sff', '#123sff');

CREATE TABLE branding (
    id SERIAL PRIMARY KEY,
    logo_url TEXT,
    banner_url TEXT,
    icon_url TEXT
);

-- Registro único
INSERT INTO branding (id, logo_url, banner_url, icon_url)
VALUES (1, '', '', '');

CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  email VARCHAR(255),
  instagram VARCHAR(255),
  telephone VARCHAR(50)
);

-- registro único
INSERT INTO settings (id, title, description, email, instagram, telephone)
VALUES (1, '', '', '', '', '');