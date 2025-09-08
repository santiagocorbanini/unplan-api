// models/seccion.model.js
import { pool } from "../database/connection.js";

const findAll = async () => {
  const { rows } = await pool.query(`
    SELECT * 
    FROM secciones
    ORDER BY 
      CASE WHEN seccion_order > 0 THEN 0 ELSE 1 END,
      seccion_order ASC,
      nombre ASC
  `);
  return rows;
};

const getById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM secciones WHERE id = $1", [id]);
  if (rows.length === 0) throw new Error("Sección no encontrada");
  return rows[0];
};

const create = async (data) => {
  const { nombre, seccion_padre, seccion_order = 0 } = data;
  const { rows } = await pool.query(
    `INSERT INTO secciones (nombre, seccion_padre, seccion_order)
     VALUES ($1, $2, $3) RETURNING *`,
    [nombre, seccion_padre, seccion_order]
  );
  return rows[0];
};

const update = async (id, data) => {
  const { nombre, seccion_padre, seccion_order } = data;

  const { rows } = await pool.query(
    `UPDATE secciones
     SET
       nombre = COALESCE($2, nombre),
       seccion_padre = COALESCE($3, seccion_padre),
       seccion_order = COALESCE($4, seccion_order)
     WHERE id = $1
     RETURNING *`,
    [
      id,
      nombre ?? null,
      seccion_padre ?? null,
      seccion_order ?? null,
    ]
  );

  if (rows.length === 0) throw new Error("Sección no encontrada");
  return rows[0];
};

const remove = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM secciones WHERE id = $1 RETURNING *`,
    [id]
  );
  if (rows.length === 0) throw new Error("Sección no encontrada");
  return rows[0];
};

const findByPadre = async (seccion_padre) => {
    const { rows } = await pool.query(
      `
        SELECT id, nombre, seccion_order
        FROM secciones
        WHERE seccion_padre = $1
        ORDER BY 
          CASE WHEN seccion_order > 0 THEN 0 ELSE 1 END,
          seccion_order ASC,
          nombre ASC
      `,
      [seccion_padre]
    );
    return rows;
  };

export const seccionModel = {
  findAll,
  getById,
  create,
  update,
  remove,
  findByPadre,
};
