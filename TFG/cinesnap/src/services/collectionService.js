const API_URL = import.meta.env.VITE_API_URL; // Tu backend local

/**
 * Create a collection.
 * 
 * @param {*} token 
 * @param {*} collection 
 * @returns 
 */
export const createCollection = async (token, collection) => {
    try {
        if (!collection || !collection.name) {
            throw new Error("Colección no existe");
        }

        const response = await fetch(`${API_URL}/collections/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: collection.name,
                description: "",
                is_public: collection.is_public
            }),
        });

        if (!response.ok) throw new Error("Error al crear colección");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en el servicio de Collection:", error);
        throw error;
    }
};

/**
 * Get logged in user's collections.
 * 
 * @param {*} token 
 * @returns 
 */
export const getYourCollections = async (token) => {
    try {
        const response = await fetch(`${API_URL}/collections/mine/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) throw new Error("Error al obtener tus colecciones");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en el servicio de Collection:", error);
        throw error;
    }
};

/**
 * Delete a collection by id.
 * 
 * @param {*} token 
 * @param {*} collection_id 
 */
export const removeCollection = async (token, collection_id) => {
    try {
        if (!collection_id) {
            throw new Error("Colección no existe");
        }

        const response = await fetch(`${API_URL}/collections/${collection_id}/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) throw new Error("Error al borrar colección");

    } catch (error) {
        console.error("Error en el servicio de Collection:", error);
        throw error;
    }
};

/**
 * Update collection parameters (name, description, is_public).
 * 
 * @param {*} token 
 * @param {*} collection 
 */
export const updateCollection = async (token, collection) => {
    try {
        if (!collection || !collection.id || !collection.name) {
            throw new Error("Colección no existe");
        }

        const response = await fetch(`${API_URL}/collections/${collection.id}/`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: collection.name,
                description: "",
                is_public: collection.is_public
            }),
        });

        if (!response.ok) throw new Error("Error al actualizar colección");
    } catch (error) {
        console.error("Error en el servicio de Collection:", error);
        throw error;
    }
};

/**
 * Add a movie to a collection by imdb id.
 * 
 * @param {*} token 
 * @param {*} collectionId 
 * @param {*} imdbId 
 * @param {*} movieData 
 * @returns 
 */
export const addMovieToCollection = async (token, collectionId, imdbId, movieData = {}) => {
    try {
        const response = await fetch(`${API_URL}/collection-movies/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                collection: collectionId,
                imdb_id: imdbId,
                title: movieData.title || '',
                poster_url: movieData.image || '',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response:", errorData);
            throw new Error("Error al añadir película a la colección");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en el servicio de Collection:", error);
        throw error;
    }
};

/**
 * Delete a movie from collection by id.
 * 
 * @param {*} token 
 * @param {*} collectionMovieId 
 */
export const deleteMovieFromCollection = async (token, collectionMovieId) => {
    try {
        const response = await fetch(`${API_URL}/collection-movies/${collectionMovieId}/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) throw new Error("Error al eliminar película de la colección");
    } catch (error) {
        console.error("Error en el servicio de Collection:", error);
        throw error;
    }
};

/**
 * Get a single collection by id (public access).
 *
 * @param {*} collection_id
 * @returns
 */
export const getCollectionById = async (collection_id) => {
    try {
        const response = await fetch(`${API_URL}/collections/${collection_id}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) throw new Error("Colección no encontrada");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en el servicio de Collection:", error);
        throw error;
    }
};

/**
 * Get user's public collections by user id.
 *
 * @param {*} user_id
 * @returns
 */
export const getUserCollections = async (user_id) => {
    try {
        if (!user_id) {
            throw new Error("Usuario no existe");
        }
        const response = await fetch(`${API_URL}/collections/?user=${user_id}&is_public=true`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) throw new Error("Error al obtener colección de usuario");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en el servicio de Collection:", error);
        throw error;
    }
};