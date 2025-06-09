<<<<<<< HEAD
# Proyecto UnplanDB

Este proyecto requiere la creación de una base de datos llamada `unplandb` con una tabla `shows` para gestionar eventos. A continuación se detallan los pasos para configurarla correctamente.

## 📂 **Creación de la base de datos:**
```sql
CREATE DATABASE unplandb;
```

## 🛠️ **Creación de la tabla `shows`:**
```sql
CREATE TABLE shows (
    show_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    venue VARCHAR(255),
    event_date DATE,
    city VARCHAR(255),
    url VARCHAR(255),
    end_date TIMESTAMP,
    start_date TIMESTAMP,
    completedevent BOOLEAN DEFAULT FALSE,
    flyer VARCHAR(255)
);
```

## 🔍 **Consulta básica:**
```sql
SELECT * FROM shows;
```

## 🛠️ **Modificación de la tabla:**

1. **Cambiar tipo de columna `flyer` a `BYTEA`:**
```sql
ALTER TABLE shows
ALTER COLUMN flyer TYPE BYTEA USING flyer::bytea;
```

2. **Agregar columna `categories` como array de strings:**
```sql
ALTER TABLE shows
ADD COLUMN categories VARCHAR(255)[];
```

## 🛠️ **Configuración del archivo en api `.env`:**
```
PORT=5004
PGUSER="postgres"
PGHOST="localhost"
PGPASSWORD="root"
PGDATABASE="unplandb"
PGPORT=5432
```

## 🛠️ **Configuración del archivo en front `.env`:**
```
VITE_APP_API_URL='http://localhost:5004'
```

## 🚀 **Comandos para iniciar el proyecto:**
```
npm install
npm run dev/start (dependiendo si te pocionas en / o /api)
```
=======
# unplan-api

brew services start postgresql@14
>>>>>>> 58121ba (agrego categorias un plan)
