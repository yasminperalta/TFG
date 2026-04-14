const API_URL = import.meta.env.VITE_API_URL; // Tu backend local

export const syncUserWithDatabase = async (token, user) => {
    try {
        // Enviamos la petición de "Login/Sync" a nuestro backend
        const response = await fetch(`${API_URL}/users/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                auth0_id: user.sub, // El ID único de Auth0
                username: user.name,
                email: user.email,
            }),
        });

        if (!response.ok) throw new Error("Error al sincronizar con el servidor");

        const data = await response.json();
        return data; // Aquí podrías devolver el perfil completo de tu DB
    } catch (error) {
        console.error("Error en el servicio de auth:", error);
        throw error;
    }
};