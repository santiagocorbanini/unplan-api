import { pool } from "../database/connection.js";
import path from "path";
import fs from "fs";

// Obtener todos los lugares
const findAll = async () => {
    const { rows } = await pool.query(`
      SELECT l.*, s.nombre AS seccion_nombre
      FROM lugares l
      LEFT JOIN secciones s ON l.seccion_id = s.id
      ORDER BY 
        CASE WHEN l.lugares_order > 0 THEN 0 ELSE 1 END,
        l.lugares_order ASC,
        LOWER(TRIM(l.nombre)) ASC
    `);
    return rows;
  };

// Obtener un lugar por ID
const getLugarById = async (id) => {
    const { rows } = await pool.query(
      `SELECT l.*, s.nombre AS seccion_nombre
       FROM lugares l
       LEFT JOIN secciones s ON l.seccion_id = s.id
       WHERE l.id = $1`,
      [id]
    );
    if (rows.length === 0) throw new Error("No se encontró el lugar");
    return rows[0];
  };

// Crear un nuevo lugar
const createLugar = async (body) => {
    const {
      nombre,
      direccion,
      link_direccion,
      telefono,
      logo_url,
      descripcion,
      reservas,
      menu,
      delivery,
      web,
      is_featured,
      instagram,
      youtube,
      seccion_id,
      lugares_order, // <-- NUEVO
    } = body;
  
    const { rows } = await pool.query(
      `INSERT INTO lugares (
        nombre, direccion, link_direccion, telefono,
        logo_url, descripcion, reservas, menu, delivery, web,
        is_featured, instagram, youtube, seccion_id, lugares_order
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING *`,
      [
        nombre,
        direccion,
        link_direccion,
        telefono,
        logo_url,
        descripcion,
        reservas,
        menu,
        delivery,
        web,
        is_featured ?? false,
        instagram,
        youtube,
        seccion_id,
        lugares_order ?? 0, // <-- default
      ]
    );
  
    return rows[0];
  };

// Actualizar un lugar
const updateLugar = async (id, newData) => {
    const {
      nombre,
      direccion,
      link_direccion,
      telefono,
      logo_url,
      descripcion,
      reservas,
      menu,
      delivery,
      web,
      is_featured,
      instagram,
      youtube,
      seccion_id,
      lugares_order, // <-- NUEVO
    } = newData;
  
    const { rows } = await pool.query(
      `UPDATE lugares SET
        nombre = $2,
        direccion = $3,
        link_direccion = $4,
        telefono = $5,
        logo_url = $6,
        descripcion = $7,
        reservas = $8,
        menu = $9,
        delivery = $10,
        web = $11,
        is_featured = $12,
        instagram = $13,
        youtube = $14,
        seccion_id = $15,
        lugares_order = $16
       WHERE id = $1
       RETURNING *`,
      [
        id,
        nombre,
        direccion,
        link_direccion,
        telefono,
        logo_url,
        descripcion,
        reservas,
        menu,
        delivery,
        web,
        is_featured ?? false,
        instagram,
        youtube,
        seccion_id,
        lugares_order ?? 0, 
      ]
    );
  
    if (rows.length === 0) throw new Error("No se encontró el lugar");
    return rows[0];
  };

// Eliminar un lugar y su logo si existe
const deleteLugar = async (id) => {
  const { rows: selectRows } = await pool.query(
    "SELECT logo_url FROM lugares WHERE id = $1",
    [id]
  );

  if (selectRows.length === 0) {
    throw new Error("No se encontró el lugar");
  }

  const logoUrl = selectRows[0].logo_url;
  if (logoUrl) {
    const filename = logoUrl.split("/").pop();
    const filePath = path.resolve("public/uploads", filename);
    try {
      await fs.promises.unlink(filePath);
      console.log("Logo eliminado:", filePath);
    } catch (err) {
      console.warn("No se pudo eliminar el logo:", err.message);
    }
  }

  const { rows } = await pool.query(
    "DELETE FROM lugares WHERE id = $1 RETURNING *",
    [id]
  );

  return rows[0];
};

// Obtener lugares por sección padre
const findBySeccionPadre = async (seccion_padre) => {
    const { rows } = await pool.query(
      `
        SELECT l.*, s.nombre AS seccion_nombre, s.seccion_padre
        FROM lugares l
        JOIN secciones s ON l.seccion_id = s.id
        WHERE LOWER(s.seccion_padre) = LOWER($1)
        ORDER BY 
          CASE WHEN l.lugares_order > 0 THEN 0 ELSE 1 END,
          l.lugares_order ASC,
          LOWER(TRIM(l.nombre)) ASC
      `,
      [seccion_padre]
    );
    return rows;
  };

  const findBySeccionPadreAndNombre = async (seccionPadre, seccionNombre) => {
    const { rows } = await pool.query(
      `
        SELECT l.*, s.nombre AS seccion_nombre, s.seccion_padre
        FROM lugares l
        INNER JOIN secciones s ON l.seccion_id = s.id
        WHERE LOWER(s.seccion_padre) = LOWER($1)
          AND LOWER(s.nombre) = LOWER($2)
        ORDER BY 
          CASE WHEN l.lugares_order > 0 THEN 0 ELSE 1 END,
          l.lugares_order ASC,
          LOWER(TRIM(l.nombre)) ASC
      `,
      [seccionPadre, seccionNombre]
    );
    return rows;
  };

export const lugarModel = {
  findAll,
  getLugarById,
  createLugar,
  updateLugar,
  deleteLugar,
  findBySeccionPadre,
  findBySeccionPadreAndNombre
};
