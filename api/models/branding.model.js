// models/branding.model.js
import { pool } from "../database/connection.js";

const getBranding = async () => {
    const { rows } = await pool.query(
      "SELECT id, logo_url, banner_url, icon_url FROM branding WHERE id = 1"
    );
    return rows[0];
  };
  
  const updateBranding = async ({ logo_url = null, banner_url = null, icon_url = null } = {}) => {
    const { rows } = await pool.query(
      `
      UPDATE branding
         SET logo_url   = COALESCE($1, logo_url),
             banner_url = COALESCE($2, banner_url),
             icon_url   = COALESCE($3, icon_url)
       WHERE id = 1
       RETURNING id, logo_url, banner_url, icon_url
      `,
      [logo_url, banner_url, icon_url]
    );
    return rows[0];
  };

export const brandingModel = { getBranding, updateBranding };
