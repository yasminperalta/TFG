const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_URL = import.meta.env.VITE_API_URL; // Tu backend local

export async function getPopularMovies(page = 1) {
	try {
		const response = await fetch(`${API_URL}/movies/sync-tmdb/?page=${page}`, {
			method: "POST",
		});
		if (!response.ok) throw new Error("Error al obtener películas populares");

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error obteniendo películas populares:", error);
	}
}

export async function searchMovies(query) {
	const res = await fetch(
		`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}`,
	);
	const data = await res.json();
	return data.results;
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
