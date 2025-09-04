import { pool } from "../database/connection.js";

const getInfo = async () => {
  const { rows } = await pool.query("SELECT * FROM info WHERE id = 1");
  return rows[0];
};

const updateInfo = async (data = {}) => {
  // Si una key no viene, la dejamos en null para que COALESCE conserve el valor actual
  const {
    como_llegar = null,
    numeros_utiles = null,
    atractivos = null,
    transporte = null,
  } = data;

  const sql = `
    UPDATE info
       SET como_llegar    = COALESCE($1, como_llegar),
           numeros_utiles = COALESCE($2, numeros_utiles),
           atractivos     = COALESCE($3, atractivos),
           transporte     = COALESCE($4, transporte)
     WHERE id = 1
     RETURNING *;
  `;

  const { rows } = await pool.query(sql, [
    como_llegar,
    numeros_utiles,
    atractivos,
    transporte,
  ]);
  return rows[0];
};

export const infoModel = { getInfo, updateInfo };
