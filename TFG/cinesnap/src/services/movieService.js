const API_URL = import.meta.env.VITE_API_URL; // Tu backend local

export const addMovie = async (token, movie) => {
    try {

        if (!movie.title || !movie.id) {
            throw new Error("Película no existe");
        }

        let release_year = null;
        if (movie.release_date) {
            release_year = movie.release_date.substring(0, 4);
        }

        // Enviamos la petición de "Login/Sync" a nuestro backend
        const response = await fetch(`${API_URL}/movies/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                imdb_id: movie.id,
                title: movie.title,
                release_year: release_year,
                description: movie.overview,
                poster_url: movie.poster_path
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