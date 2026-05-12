const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_URL = import.meta.env.VITE_API_URL; // Tu backend local

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
	}
}

export async function searchMoviesInDB(query) {
	try {
		// Codificamos el query para evitar problemas con espacios o caracteres especiales
		const encodedQuery = encodeURIComponent(query);

		const response = await fetch(`${API_URL}/movies/search-tmdb/?query=${encodedQuery}`, {
			method: "GET", // Tal como lo definimos en el backend
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

export async function getMovieDetails(movieId) {
	const res = await fetch(
		`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=es-ES`,
	);
	const data = await res.json();

	return {
		id: data.id,
		title: data.title,
		image: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
	};
}
