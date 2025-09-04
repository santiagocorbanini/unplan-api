import { pool } from "../database/connection.js";

const getColors = async () => {
  const { rows } = await pool.query("SELECT id, general, primary_color, background FROM colors WHERE id = 1");
  return rows[0];
};

// Update parcial con COALESCE: sólo cambia lo que venga en el body
const updateColors = async ({ general = null, primary_color = null, background = null } = {}) => {
  const sql = `
    UPDATE colors
       SET general       = COALESCE($1, general),
           primary_color = COALESCE($2, primary_color),
           background    = COALESCE($3, background)
     WHERE id = 1
     RETURNING id, general, primary_color, background;
  `;
  const { rows } = await pool.query(sql, [general, primary_color, background]);
  return rows[0];
};

export const colorsModel = { getColors, updateColors };
