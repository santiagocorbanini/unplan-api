import api from "./api";

// Crear un nuevo evento
export const createShow = async (formData) => {
    const response = await api.post("/shows/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
};

// Actualizar un evento existente
export const updateShow = async (showId, formData) => {
    const response = await api.put(`/shows/updateShow/${showId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

export const getAllShows = async () => {
  try {
    const response = await api.get(`/shows/actualShows?page=1`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los shows:", error);
    throw error;
  }
};

export const deleteShowId = async (id) => {
  try {
    const response = await api.delete(`/shows/deleteShow/${id}`);
    return response;
  } catch (error) {
    console.error(`Error al eliminar el show con ID ${id}:`, error);
    throw error;
  }
};
