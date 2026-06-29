const API_URL = import.meta.env.VITE_API_URL;

export async function getPopularMovies(page = 1) {
	try {
		const response = await fetch(`${API_URL}/movies/sync-tmdb/?page=${page}`, {
			method: "GET",
		});
		if (!response.ok) throw new Error("Error al obtener películas populares");

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error obteniendo películas populares:", error);
		return [];
	}
}

export async function searchMoviesInDB(query) {
	try {
		// Codificamos el query para evitar problemas con espacios o caracteres especiales
		const encodedQuery = encodeURIComponent(query);

		const response = await fetch(`${API_URL}/movies/search-tmdb/?query=${encodedQuery}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			}
		});

		if (!response.ok) {
			throw new Error("Error al buscar películas en el servidor");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error en searchMoviesInDB:", error);
		return []; // Devolvemos un array vacío para evitar que el frontend rompa
	}
}

