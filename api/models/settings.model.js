// models/settings.model.js
import { pool } from "../database/connection.js";

const getSettings = async () => {
    const { rows } = await pool.query(
      "SELECT id, title, description, email, instagram, telephone FROM settings WHERE id = 1"
    );
    return rows[0];
  };
  
  const updateSettings = async ({
    title = null,
    description = null,
    email = null,
    instagram = null,
    telephone = null,
  } = {}) => {
    const { rows } = await pool.query(
      `
      UPDATE settings
         SET title       = COALESCE($1, title),
             description = COALESCE($2, description),
             email       = COALESCE($3, email),
             instagram   = COALESCE($4, instagram),
             telephone   = COALESCE($5, telephone)
       WHERE id = 1
       RETURNING id, title, description, email, instagram, telephone;
      `,
      [title, description, email, instagram, telephone]
    );
    return rows[0];
  };

export const settingsModel = { getSettings, updateSettings };
