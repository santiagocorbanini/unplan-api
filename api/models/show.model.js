import { pool } from "../database/connection.js";

const findAll = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM shows order by event_date asc"
  );
  return rows;
};

const findActualShows = async () => {
  const query = `
        SELECT * 
        FROM shows 
        WHERE event_date >= CURRENT_DATE 
        ORDER BY event_date ASC
      `;

  const { rows } = await pool.query(query);
  return rows;
};

const findListShowsMain = async () => {
  const { rows } = await pool.query("SELECT url FROM shows");
  return rows;
};

const findListShowsProximos = async () => {
  const { rows } = await pool.query(
    "SELECT title, venue , city , url FROM shows"
  );
  return rows;
};

const deleteShow = async (show_id) => {
  const query = "DELETE FROM shows WHERE show_id = $1 RETURNING *";
  const { rows } = await pool.query(query, [show_id]);
  if (rows.length === 0) {
    // No se encontró ningún registro con el ID especificado
    throw new Error("No se encontró ningún espectáculo con el ID especificado");
  }
  return rows[0];
};

const getShowById = async (show_id) => {
  const query = "SELECT * FROM shows WHERE show_id = $1";
  const { rows } = await pool.query(query, [show_id]);
  if (rows.length === 0) {
    // No se encontró ningún registro con el ID especificado
    throw new Error("No se encontró ningún show con el ID especificado");
  }
  return rows[0];
};

const createShow = async (body) => {
  const {
    title,
    venue,
    event_date = null,
    city,
    url,
    completedevent,
    flyer,
    categories = [],
  } = body;

  try {
    let flyerBuffer = null;

    // Si el flyer ya es un buffer, úsalo directamente
    if (Buffer.isBuffer(flyer)) {
      flyerBuffer = flyer;
    } else if (
      flyer &&
      typeof flyer === "string" &&
      flyer.startsWith("data:image")
    ) {
      flyerBuffer = Buffer.from(flyer.split(",")[1], "base64");
    }

    const query = `
            INSERT INTO shows (title, venue, event_date, city, url, completedevent, flyer, categories)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

    // Utiliza null para las fechas si no se proporcionan
    const values = [
      title,
      venue,
      event_date || null,
      city,
      url,
      completedevent,
      flyerBuffer,
      categories,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error("Error al crear el espectáculo:", error);
    throw error;
  }
};

const updateShow = async (show_id, newData) => {
  console.log("santi", newData);
  try {
    const { title, venue, city, url, flyer, event_date, categories } = newData;
    let query =
      "UPDATE shows SET title = $2, venue = $3, city = $4, url = $5, event_date = $6, categories = $7";
    const values = [show_id, title, venue, city, url, event_date, categories];

    if (Buffer.isBuffer(flyer)) {
      query += ", flyer = $8";
      values.push(flyer);
    }

    query += " WHERE show_id = $1 RETURNING *";

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      throw new Error(
        "No se encontró ningún espectáculo con el ID especificado"
      );
    }

    return rows[0];
  } catch (error) {
    console.error("Error al actualizar el espectáculo:", error);
    throw error;
  }
};

export const showModel = {
  findAll,
  findActualShows,
  createShow,
  findListShowsMain,
  findListShowsProximos,
  deleteShow,
  updateShow,
  getShowById,
  updateShow,
};
