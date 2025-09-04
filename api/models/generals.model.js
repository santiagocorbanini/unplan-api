// models/generals.model.js
import { pool } from "../database/connection.js";

export const getGenerals = async () => {
  const sql = `
    SELECT
      c.general                      AS general,
      c.primary_color                AS primary,
      c.background                   AS background,
      b.logo_url                     AS logo,
      b.banner_url                   AS banner,
      b.icon_url                     AS icon,
      s.title                        AS title,
      s.description                  AS description,
      s.email                        AS email,
      s.telephone                    AS telephone,
      s.instagram                    AS instagram
    FROM colors c
    CROSS JOIN branding b
    CROSS JOIN settings s
    WHERE c.id = 1 AND b.id = 1 AND s.id = 1
  `;
  const { rows } = await pool.query(sql);

  return (
    rows[0] ?? {
      general: null,
      primary: null,
      background: null,
      logo: null,
      banner: null,
      icon: null,
      title: null,
      description: null,
      email: null,
      telephone: null,
      instagram: null,
    }
  );
};

export const generalsModel = { getGenerals };
