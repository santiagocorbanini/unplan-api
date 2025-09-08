import { pool } from "../database/connection.js";
import path from 'path';
import fs from 'fs';

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

/*
const deleteShow = async (show_id) => {
  const query = "DELETE FROM shows WHERE show_id = $1 RETURNING *";
  const { rows } = await pool.query(query, [show_id]);
  if (rows.length === 0) {
    // No se encontró ningún registro con el ID especificado
    throw new Error("No se encontró ningún espectáculo con el ID especificado");
  }
  return rows[0];
};
*/
const deleteShow = async (show_id) => {
    const selectQuery = "SELECT image_url FROM shows WHERE show_id = $1";
    const { rows: selectRows } = await pool.query(selectQuery, [show_id]);
  
    if (selectRows.length === 0) {
      throw new Error("No se encontró ningún espectáculo con el ID especificado");
    }
  
    const imageUrl = selectRows[0].image_url;
  
    // Eliminar el archivo si existe
    if (imageUrl) {
      const filename = imageUrl.split('/').pop(); // extrae el nombre del archivo
      const filePath = path.resolve('public/uploads', filename);
  
      try {
        await fs.promises.unlink(filePath);
        console.log("Imagen eliminada:", filePath);
      } catch (err) {
        console.warn("No se pudo eliminar la imagen:", filePath, err.message);
      }
    }
  
    const deleteQuery = "DELETE FROM shows WHERE show_id = $1 RETURNING *";
    const { rows } = await pool.query(deleteQuery, [show_id]);
  
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

const findFeaturedShows = async (page = 1, pageSize = 15) => {
    const offset = (page - 1) * pageSize;
  
    const query = `
      SELECT * FROM shows
      WHERE is_featured = true
      ORDER BY event_date ASC
      LIMIT $1 OFFSET $2
    `;
  
    const values = [pageSize, offset];
    const { rows } = await pool.query(query, values);
  
    const countQuery = `
      SELECT COUNT(*) FROM shows
      WHERE is_featured = true
    `;
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);
  
    return {
      data: rows,
      total,
      totalPages: Math.ceil(total / pageSize),
      page,
      pageSize
    };
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
      is_featured = false, 
      youtube,
      description
    } = body;

    // Asegurar que las categorías sean un array válido
    const parsedCategories = Array.isArray(categories)
      ? categories.filter(cat => typeof cat === 'string' && cat.trim().length > 0)
      : [];
  
    try {
      const query = `
        INSERT INTO shows (
          title, venue, event_date, city, url, completedevent,
          categories, instagram, web, address, image_url,
          is_featured, youtube, description
        )
        VALUES ($1, $2, $3, $4, $5, $6,
                $7, $8, $9, $10, $11,
                $12, $13, $14)
        RETURNING *`;
  
      const values = [
        title,
        venue,
        event_date,
        city,
        url,
        completedevent,
        parsedCategories, 
        instagram,
        web,
        address,
        image_url,
        is_featured,
        youtube,
        description
      ];
  
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("Error al crear el espectáculo:", error);
      res.status(500).json({ 
        error: "Error al crear el espectáculo", 
        detalle: error.message 
      });
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
      is_featured,
      youtube,
      description,
      image_url
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
          address = $10,
          is_featured = $11,
          youtube = $12,
          description = $13`;
  
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
        is_featured,
        youtube,
        description
      ];
  
      if (image_url) {
        query += `, image_url = $14`;
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
      res.status(500).json({ 
        error: "Error al actualizar el espectáculo", 
        detalle: error.message 
      });
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

  const deletePastShows = async () => {
    try {
      // 1. Obtener todos los shows anteriores a hoy
      const selectQuery = `
        SELECT show_id, image_url
        FROM shows
        WHERE event_date < CURRENT_DATE
      `;
      const { rows: pastShows } = await pool.query(selectQuery);
  
      if (pastShows.length === 0) {
        return { message: "No hay eventos pasados para eliminar." };
      }
  
      // 2. Eliminar imágenes si existen
      for (const show of pastShows) {
        const imageUrl = show.image_url;
  
        if (imageUrl) {
          const filename = imageUrl.split('/').pop();
          const filePath = path.resolve('public/uploads', filename);
  
          try {
            if (fs.existsSync(filePath)) {
              await fs.promises.unlink(filePath);
              console.log(`🗑 Imagen eliminada: ${filePath}`);
            }
          } catch (err) {
            console.warn(`⚠ No se pudo eliminar la imagen: ${filePath}`, err.message);
          }
        }
      }
  
      // 3. Eliminar los shows de la base de datos
      const deleteQuery = `
        DELETE FROM shows
        WHERE event_date < CURRENT_DATE
        RETURNING show_id
      `;
      const { rows: deletedRows } = await pool.query(deleteQuery);
  
      return {
        message: `${deletedRows.length} eventos pasados eliminados.`,
        deletedShowIds: deletedRows.map(r => r.show_id)
      };
    } catch (error) {
      console.error("❌ Error al eliminar eventos pasados:", error);
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
  searchShowsByTitle,
  findFeaturedShows,
  deletePastShows
};
