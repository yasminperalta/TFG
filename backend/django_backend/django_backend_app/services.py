# tu_app/services.py
import requests
from django.conf import settings
from .models import Movie
import os
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import re

load_dotenv()
SCRAPERAPI_KEY = os.getenv("SCRAPERAPI_KEY")


def fetch_and_save_popular_movies(page=1):
    load_dotenv()
    TMDB_API_KEY = os.getenv("TMDB_API_KEY")
    url = f"https://api.themoviedb.org/3/movie/popular?api_key={TMDB_API_KEY}&language=es-ES&page={page}"
    
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    
    movies_created = []
    for movie_data in data.get('results', []):
        poster_url = "/no_poster.png"

        if movie_data.get('poster_path') != None:
            poster_url = f"https://image.tmdb.org/t/p/w500{movie_data.get('poster_path')}"

        movie, created = Movie.objects.update_or_create(
            imdb_id=movie_data['id'],
            defaults={
                'title': movie_data['title'],
                'release_year': movie_data.get('release_date', '')[:4] or None,
                'description': movie_data.get('overview'),
                'poster_url': poster_url,
            }
        )
        movies_created.append(movie)
    return movies_created

def search_and_save_movies(query):
    load_dotenv()
    TMDB_API_KEY = os.getenv("TMDB_API_KEY")
    # Endpoint de búsqueda de TMDB
    url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&language=es-ES&query={query}"
    
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    
    movies_created = []
    for movie_data in data.get('results', []):
        poster_url = "/no_poster.png"

        if movie_data.get('poster_path') != None:
            poster_url = f"https://image.tmdb.org/t/p/w500{movie_data.get('poster_path')}"

        # Usamos update_or_create para que si la película ya existe, 
        # se actualice su info y no se duplique por ID de TMDB
        movie, created = Movie.objects.update_or_create(
            imdb_id=movie_data['id'],
            defaults={
                'title': movie_data['title'],
                'release_year': movie_data.get('release_date', '')[:4] or None,
                'description': movie_data.get('overview'),
                'poster_url': poster_url,
            }
        )
        movies_created.append(movie)
    return movies_created

def get_scraperapi_url(target_url):
    """Construye URL con ScraperAPI"""
    if not SCRAPERAPI_KEY:
        print("SCRAPERAPI_KEY no configurada")
        return None
    return f"http://api.scraperapi.com?api_key={SCRAPERAPI_KEY}&url={target_url}"


def scrape_amazon_dvd(title):
    query = requests.utils.quote(f"dvd {title}")
    url = f"https://www.amazon.es/s?k={query}"
    scraper_url = get_scraperapi_url(url)
    
    if not scraper_url:
        return None
    
    try:
        print(f"Scrapeando Amazon: {url}")
        response = requests.get(scraper_url, timeout=60)
        print(f"Status: {response.status_code}, Length: {len(response.text)}")
        
        if response.status_code != 200:
            print(f"Error response: {response.text[:500]}")
            return None
            
        soup = BeautifulSoup(response.content, 'html.parser')
        
        results = []
        items = soup.select('[data-component-type="s-search-result"]')
        print(f"Items encontrados: {len(items)}")
        
        for item in items[:5]:
            # Find product link (contains /dp/)
            link = None
            for a in item.find_all('a', href=True):
                href = a.get('href', '')
                if '/dp/' in href:
                    link = 'https://www.amazon.es' + href.split('?')[0]
                    break
            
            if not link:
                continue
                
            price_elem = item.select_one('.a-price-whole')
            price_frac = item.select_one('.a-price-fraction')
            price_val = 0
            
            if price_elem:
                whole = price_elem.get_text(strip=True).replace('.', '').replace(',', '')
                frac = price_frac.get_text(strip=True) if price_frac else ''
                try:
                    price_val = float(f"{whole}.{frac}" if frac else whole)
                    print(f"Precio Amazon: {price_val}")
                except ValueError:
                    price_val = 0
            
            # Only add items with valid prices
            if price_val > 0:
                results.append({
                    'name': 'Amazon',
                    'link': link,
                    'price': price_val,
                    'logo': 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/amazon-white-icon.png'
                })
        
        # Return only the best result (sorted by price)
        return sorted(results, key=lambda x: x['price']) if results else None
    except Exception as e:
        print(f"Amazon scraping error: {e}")
        return None


def scrape_fnac_dvd(title):
    query = requests.utils.quote(f"dvd {title}")
    url = f"https://www.fnac.es/SearchResult/ResultList.aspx?Search={query}&sft=1"
    scraper_url = get_scraperapi_url(url)
    
    if not scraper_url:
        return None
    
    try:
        print(f"Scrapeando Fnac: {url}")
        response = requests.get(scraper_url, timeout=60)
        print(f"Status: {response.status_code}, Length: {len(response.text)}")
        
        if response.status_code != 200:
            print(f"Error response (first 500 chars): {response.text[:500]}")
            return None
            
        soup = BeautifulSoup(response.content, 'html.parser')
        
        results = []
        items = soup.select('.Article-item')
        print(f"Items encontrados: {len(items)}")
        
        for item in items[:5]:
            link_elem = item.select_one('a')
            
            if link_elem:
                link = link_elem.get('href', '')
                
                # Extract price from Article-price--mp element (most reliable)
                price_val = 0
                price_elem = item.select_one('.Article-price--mp')
                if price_elem:
                    txt = price_elem.get_text(strip=True)
                    # Find first price with comma (actual product price, not rating)
                    matches = re.findall(r'(\d+,\d+)', txt)
                    if matches:
                        try:
                            price_val = float(matches[0].replace(',', '.'))
                            print(f"Precio Fnac: {price_val}")
                        except ValueError:
                            price_val = 0
                
                # Only add items with valid prices
                if price_val > 0:
                    results.append({
                        'name': 'Fnac',
                        'link': link,
                        'price': price_val,
                        'logo': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Fnac_Logo.svg'
                    })
        
        # Return only the best result (sorted by price)
        return sorted(results, key=lambda x: x['price']) if results else None
    except Exception as e:
        print(f"Fnac scraping error: {e}")
        return None


def get_dvd_prices(title):
    amazon = scrape_amazon_dvd(title)
    fnac = scrape_fnac_dvd(title)
    
    results = []
    # Take only the best result from each store with a valid price
    if amazon:
        # Filter items with price and preferring DVD format
        valid_amazon = [a for a in amazon if a['price'] > 0]
        if valid_amazon:
            results.append(valid_amazon[0])  # Already sorted by price
    
    if fnac:
        # Filter items with price and preferring DVD format
        valid_fnac = [f for f in fnac if f['price'] > 0]
        if valid_fnac:
            results.append(valid_fnac[0])  # Already sorted by price
    
    if not results:
        results = [
            {
                'name': 'Amazon',
                'link': f'https://www.amazon.es/s?k=dvd {title}',
                'price': 0,
                'logo': 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/amazon-white-icon.png'
            },
            {
                'name': 'Fnac',
                'link': f'https://www.fnac.es/SearchResult/ResultList.aspx?Search=dvd {title}&sft=1',
                'price': 0,
                'logo': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Fnac_Logo.svg'
            }
        ]
    
    return results