import { pool } from "../database/connection.js";
import path from "path";
import fs from "fs";

// Helpers
const filenameFromUrl = (url) => url?.split("/").pop();
const bannerFilePath = (filename) => path.resolve("public/uploads/banners", filename);

// GET all
const findAll = async () => {
    const { rows } = await pool.query(`
      SELECT id, image_url, banner_name, banner_url, banner_order, available, created_at, updated_at
      FROM banners
      ORDER BY
        CASE WHEN COALESCE(banner_order, 0) > 0 THEN 0 ELSE 1 END,
        banner_order ASC NULLS LAST,
        banner_name ASC,
        id ASC
    `);
    return rows;
  };

// GET by id
const getById = async (id) => {
  const { rows } = await pool.query(
    `SELECT id, image_url, banner_name, banner_url, banner_order, available, created_at, updated_at
     FROM banners WHERE id = $1`,
    [id]
  );
  if (!rows.length) throw new Error("No se encontró el banner");
  return rows[0];
};

// CREATE
const createBanner = async ({ image_url, banner_name, banner_url = null, banner_order = 0, available = true }) => {
  const { rows } = await pool.query(
    `INSERT INTO banners (image_url, banner_name, banner_url, banner_order, available)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, image_url, banner_name, banner_url, banner_order, available, created_at, updated_at`,
    [image_url, banner_name, banner_url, banner_order, available]
  );
  return rows[0];
};

// UPDATE
const updateBanner = async (id, { image_url, banner_name, banner_url, banner_order, available }) => {
  const { rows } = await pool.query(
    `UPDATE banners SET
       banner_name  = COALESCE($2, banner_name),
       banner_url   = COALESCE($3, banner_url),
       image_url    = COALESCE($4, image_url),
       banner_order = COALESCE($5, banner_order),
       available    = COALESCE($6, available),
       updated_at   = NOW()
     WHERE id = $1
     RETURNING id, image_url, banner_name, banner_url, banner_order, available, created_at, updated_at`,
    [
      id,
      banner_name ?? null,
      banner_url ?? null,
      image_url ?? null,
      banner_order ?? null,
      available ?? null,
    ]
  );
  if (!rows.length) throw new Error("No se encontró el banner");
  return rows[0];
};

// DELETE
const deleteBanner = async (id) => {
  const { rows: sel } = await pool.query(
    "SELECT image_url FROM banners WHERE id = $1",
    [id]
  );
  if (!sel.length) throw new Error("No se encontró el banner");

  const filename = filenameFromUrl(sel[0].image_url);
  if (filename) {
    try {
      await fs.promises.unlink(bannerFilePath(filename));
      console.log("Imagen de banner eliminada:", filename);
    } catch (e) {
      console.warn("No se pudo eliminar la imagen:", e.message);
    }
  }

  const { rows } = await pool.query(
    "DELETE FROM banners WHERE id = $1 RETURNING id",
    [id]
  );
  return rows[0];
};

const findAvailable = async () => {
  const { rows } = await pool.query(`
    SELECT id, image_url, banner_name, banner_url, banner_order, available, created_at, updated_at
    FROM banners
    WHERE available = true
    ORDER BY banner_order ASC, id ASC
  `);
  return rows;
};

export const bannerModel = {
  findAll,
  getById,
  createBanner,
  updateBanner,
  deleteBanner,
  findAvailable,
};
