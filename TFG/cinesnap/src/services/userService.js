const API_URL = import.meta.env.VITE_API_URL; // Tu backend local

/**
 * Get all public users information.
 * 
 * @returns users
 */
export const getPublicUsers = async () => {
    try {
        const response = await fetch(`${API_URL}/users/public/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener la lista pública de usuarios");
        }

        const data = await response.json();
        return data; // Retorna el array de usuarios filtrados
    } catch (error) {
        console.error("Error en getPublicUsers:", error);
        throw error;
    }
};

/**
 * Devuelve el perfil del usuario autenticado.
 */
export const getMyProfile = async (token) => {
    const response = await fetch(`${API_URL}/users/me/`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) throw new Error("Error al obtener perfil propio");
    return response.json();
};

/**
 * Actualiza campos del perfil del usuario autenticado (is_public, username, picture_url).
 */
export const updateMyProfile = async (token, data) => {
    const response = await fetch(`${API_URL}/users/me/`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al actualizar perfil");
    return response.json();
};

/**
 * Get a single user's public information.
 *
 * @param {number} user_id
 * @returns user
 */
export const getUser = async (user_id) => {
    try {
        const response = await fetch(`${API_URL}/users/${user_id}/public/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener la lista pública de usuarios");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en getPublicUsers:", error);
        throw error;
    }
};