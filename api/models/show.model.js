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
      categories,
      instagram = null,
      web = null,
      address = null,
    } = body;
  
    try {
      let flyerBuffer = null;
  
      if (Buffer.isBuffer(flyer)) {
        flyerBuffer = flyer;
      } else if (
        flyer &&
        typeof flyer === "string" &&
        flyer.startsWith("data:image")
      ) {
        flyerBuffer = Buffer.from(flyer.split(",")[1], "base64");
      } else {
        throw new Error("Formato de flyer inválido");
      }
  
      const query = `
        INSERT INTO shows (
          title, venue, event_date, city, url, completedevent,
          flyer, categories, instagram, web, address
        )
        VALUES ($1, $2, $3, $4, $5, $6,
                $7, $8, $9, $10, $11)
        RETURNING *`;
  
      const values = [
        title,
        venue,
        event_date,
        city,
        url,
        completedevent,
        flyerBuffer,
        categories,
        instagram,
        web,
        address,
      ];
  
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("Error al crear el espectáculo:", error);
      throw error;
    }
  };
  
const updateShow = async (show_id, newData) => {
    const {
      title,
      venue,
      city,
      url,
      flyer,
      event_date,
      categories,
      instagram,
      web,
      address,
    } = newData;
  
  
    try {
      let query = `
        UPDATE shows SET
          title = $2,
          venue = $3,
          city = $4,
          url = $5,
          event_date = $6,
          categories = $7,
          instagram = $8,
          web = $9,
          address = $10`;
  
      const values = [
        show_id,
        title,
        venue,
        city,
        url,
        event_date,
        categories,
        instagram,
        web,
        address,
      ];
  
      if (Buffer.isBuffer(flyer)) {
        query += `, flyer = $11`;
        values.push(flyerBuffer);
      }
  
      query += " WHERE show_id = $1 RETURNING *";
  
      const { rows } = await pool.query(query, values);
  
      if (rows.length === 0) {
        throw new Error("No se encontró ningún espectáculo con el ID especificado");
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
