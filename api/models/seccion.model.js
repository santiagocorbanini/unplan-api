import { pool } from "../database/connection.js";

// Obtener todas las secciones
const findAll = async () => {
  const { rows } = await pool.query("SELECT * FROM secciones ORDER BY nombre ASC");
  return rows;
};

// Obtener una sección por ID
const getById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM secciones WHERE id = $1", [id]);
  if (rows.length === 0) throw new Error("Sección no encontrada");
  return rows[0];
};

// Crear una nueva sección
const create = async (data) => {
  const { nombre, seccion_padre } = data;
  const { rows } = await pool.query(
    `INSERT INTO secciones (nombre, seccion_padre) VALUES ($1, $2) RETURNING *`,
    [nombre, seccion_padre]
  );
  return rows[0];
};

// Actualizar una sección
const update = async (id, data) => {
  const { nombre, seccion_padre } = data;
  const { rows } = await pool.query(
    `UPDATE secciones SET nombre = $2, seccion_padre = $3 WHERE id = $1 RETURNING *`,
    [id, nombre, seccion_padre]
  );
  if (rows.length === 0) throw new Error("Sección no encontrada");
  return rows[0];
};

// Eliminar una sección
const remove = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM secciones WHERE id = $1 RETURNING *`,
    [id]
  );
  if (rows.length === 0) throw new Error("Sección no encontrada");
  return rows[0];
};

// Obtener secciones por seccion_padre
const findByPadre = async (seccion_padre) => {
    const { rows } = await pool.query(
      `SELECT id, nombre FROM secciones WHERE seccion_padre = $1 ORDER BY nombre ASC`,
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
  findByPadre
};
