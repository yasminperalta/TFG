const API_URL = import.meta.env.VITE_API_URL; // Tu backend local

export const addMovieToWishlist = async (token, imdb_id) => {
    try {
        const response = await fetch(`${API_URL}/wishlist-movies/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                imdb_id: imdb_id,
            }),
        });

        if (!response.ok) throw new Error("Error al añadir película a wishlist");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en el servicio de Wishlist:", error);
        throw error;
    }
};