const API_URL = import.meta.env.VITE_API_URL; // Tu backend local

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