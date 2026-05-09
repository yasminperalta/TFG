# tu_app/services.py
import requests
from django.conf import settings
from .models import Movie
import os
from dotenv import load_dotenv


def fetch_and_save_popular_movies(page=1):
    load_dotenv()
    TMDB_API_KEY = os.getenv("TMDB_API_KEY")
    url = f"https://api.themoviedb.org/3/movie/popular?api_key={TMDB_API_KEY}&language=es-ES&page={page}"
    
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    
    movies_created = []
    for movie_data in data.get('results', []):
        # Usamos update_or_create para evitar duplicados
        movie, created = Movie.objects.update_or_create(
            imdb_id=movie_data['id'],
            defaults={
                'title': movie_data['title'],
                'release_year': movie_data.get('release_date', '')[:4] or None,
                'description': movie_data.get('overview'),
                'poster_url': movie_data.get('poster_path'),
            }
        )
        movies_created.append(movie)
    return movies_created