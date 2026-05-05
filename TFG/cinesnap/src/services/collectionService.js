const API_URL = import.meta.env.VITE_API_URL; // Tu backend local

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