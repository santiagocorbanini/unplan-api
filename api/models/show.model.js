import { pool } from "../database/connection.js";

const findAll = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM shows order by event_date asc"
  );
  return rows;
};

const findActualShows = async (
    page = 1, 
    pageSize = 15, 
    categories = [], 
    search = null,
    filterDate = null
  ) => {
      const offset = (page - 1) * pageSize;
      const values = [];
      let whereClauses = [`event_date >= CURRENT_DATE`];
    
      // Filter by specific date if provided
      if (filterDate) {
        const formattedDate = filterDate.toISOString().split('T')[0];
        whereClauses.push(`DATE(event_date) = $${values.length + 1}`);
        values.push(formattedDate);
      }
    
      if (categories.length > 0) {
        const categoryConditions = categories.map((cat) => {
          values.push(`%${cat.toLowerCase()}%`);
          return `LOWER(ARRAY_TO_STRING(categories, ',')) LIKE $${values.length}`;
        });
        whereClauses.push(`(${categoryConditions.join(" OR ")})`);
      }
    
      if (search) {
        values.push(`%${search.toLowerCase()}%`);
        whereClauses.push(`LOWER(title) LIKE $${values.length}`);
      }
    
      values.push(pageSize);
      values.push(offset);
    
      const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";
    
      const query = `
        SELECT * FROM shows
        ${whereSQL}
        ORDER BY event_date ASC
        LIMIT $${values.length - 1} OFFSET $${values.length}
      `;
    
      const { rows } = await pool.query(query, values);
    
      const countQuery = `
        SELECT COUNT(*) FROM shows
        ${whereSQL}
      `;
      const countResult = await pool.query(countQuery, values.slice(0, -2));
      const total = parseInt(countResult.rows[0].count);
    
      return {
        data: rows,
        total,
        totalPages: Math.ceil(total / pageSize),
        page,
        pageSize
      };
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
      event_date,
      city,
      url,
      completedevent,
      categories = [],
      instagram,
      web,
      address,
      image_url,
    } = body;

    // Asegurar que las categorías sean un array válido
    const parsedCategories = Array.isArray(categories)
      ? categories.filter(cat => typeof cat === 'string' && cat.trim().length > 0)
      : [];
  
    try {
      const query = `
        INSERT INTO shows (
          title, venue, event_date, city, url, completedevent,
          categories, instagram, web, address, image_url
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
        parsedCategories, // Enviar como array
        instagram,
        web,
        address,
        image_url
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
      event_date,
      categories = [],
      instagram,
      web,
      address,
      image_url // NUEVO
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
        address
      ];
  
      if (image_url) {
        query += `, image_url = $11`;
        values.push(image_url);
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

  const searchShowsByTitle = async (title, page = 1, pageSize = 15) => {
    const offset = (page - 1) * pageSize;
    const query = `
      SELECT * 
      FROM shows 
      WHERE LOWER(title) LIKE LOWER($1)
      AND event_date >= CURRENT_DATE 
      ORDER BY event_date ASC
      LIMIT $2 OFFSET $3
    `;
    const values = [`%${title}%`, pageSize, offset];
    const { rows } = await pool.query(query, values);
  
    const countQuery = `SELECT COUNT(*) FROM shows WHERE LOWER(title) LIKE LOWER($1) AND event_date >= CURRENT_DATE`;
    const countResult = await pool.query(countQuery, [`%${title}%`]);
    const total = parseInt(countResult.rows[0].count);
  
    return {
      data: rows,
      total,
      totalPages: Math.ceil(total / pageSize),
      page,
      pageSize
    };
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
  searchShowsByTitle
};
