from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .models import Movie, User, Collection, CollectionMovie, Wishlist, WishlistMovie, Friend, MoviePrice
from .serializers import (
    MovieSerializer, UserSerializer, CollectionSerializer,
    WishlistSerializer, FriendSerializer, MoviePriceSerializer,
    WishlistMovieSerializer, CollectionMovieSerializer, UserPublicSerializer
)
from .auth import Auth0Authentication
from .services import fetch_and_save_popular_movies, get_dvd_prices

class MovieViewSet(viewsets.ModelViewSet):
    """
    Endpoint para ver y buscar películas.
    Se optimiza con prefetch_related para traer los precios de una vez.
    """
    queryset = Movie.objects.all().prefetch_related('movieprice_set')
    serializer_class = MovieSerializer

    # Para autenticar usando auth0, el autentificador que hemos creado
    authentication_classes = [Auth0Authentication]
    permission_classes = [permissions.AllowAny]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'director']
    ordering_fields = ['release_year', 'title']

    def create(self, request, *args, **kwargs):
        movie_instance, created = Movie.objects.update_or_create(
            imdb_id=request.data.get('imdb_id'),
            defaults={
                'title': request.data.get('title'),
                'release_year': request.data.get('release_year'),
                'description': request.data.get('description'),
                'poster_url': request.data.get('poster_url'),
            }
        )

        # Serializamos el objeto (ya sea nuevo o actualizado) para devolverlo
        serializer = self.get_serializer(movie_instance)
        
        # Devolvemos 201 si se creó, o 200 si ya existía y se actualizó
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        
        return Response(serializer.data, status=status_code)
    
    @action(detail=False, methods=['post'], url_path='sync-tmdb')
    def sync_tmdb(self, request):
        page = request.query_params.get('page', 1)
        try:
            movies = fetch_and_save_popular_movies(page=page)
            serializer = self.get_serializer(movies, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    authentication_classes = []
    permission_classes = [permissions.AllowAny] # Por ahora permitimos que cualquiera lo vea

    def get_serializer_class(self):
        if self.action == 'public_list' or self.action == 'public_detail':
            return UserPublicSerializer
        return UserSerializer
    
    @action(detail=False, methods=['get'], url_path='public')
    def public_list(self, request):
        """
        Endpoint: GET /users/public/
        Retorna la lista de usuarios sin datos sensibles.
        """
        users = self.get_queryset()
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], url_path='public')
    def public_detail(self, request, pk=None):
        """
        GET /users/public/{id}/ -> Detalle público
        """
        user = self.get_object()
        serializer = self.get_serializer(user)
        return Response(serializer.data)
    
class CollectionViewSet(viewsets.ModelViewSet):
    """
    Las colecciones tipo Letterboxd. 
    Usamos prefetch_related para cargar las películas y sus detalles eficientemente.
    """
    queryset = Collection.objects.all().select_related('user').prefetch_related('collectionmovie_set__movie')
    serializer_class = CollectionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['user', 'is_public']
    search_fields = ['name', 'description']

    authentication_classes = [Auth0Authentication]
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        # Asigna automáticamente el usuario autenticado como creador
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

    # Esto crea el endpoint /collections/mine/
    @action(detail=False, methods=['get'])
    def mine(self, request):
        collections = self.queryset.filter(user=request.user.id)
        serializer = self.get_serializer(collections, many=True)

        return Response(serializer.data)

class CollectionMovieViewSet(viewsets.ModelViewSet):
    """
    Películas en colecciones.
    Similar a WishlistMovieViewSet, permite crear con imdb_id directamente.
    Crea la película automáticamente si no existe en la base de datos.
    """
    queryset = CollectionMovie.objects.all()
    serializer_class = CollectionMovieSerializer

    def create(self, request, *args, **kwargs):
        # 1. Extraemos los datos del request
        imdb_id = request.data.get('imdb_id')
        collection_id = request.data.get('collection')
        user = request.user

        # Validar colección existe y pertenece al usuario
        collection = get_object_or_404(Collection, id=collection_id, user=user.id)

        # 2. Buscamos o creamos la película automáticamente
        movie, created = Movie.objects.get_or_create(
            imdb_id=imdb_id,
            defaults={
                'title': request.data.get('title', 'Película desconocida'),
                'poster_url': request.data.get('poster_url', ''),
                'description': '',
            }
        )
        # Si la película ya existía pero no tenía poster_url, actualizarla
        if not created and request.data.get('poster_url') and not movie.poster_url:
            movie.poster_url = request.data.get('poster_url')
            movie.save()

        # 3. Preparamos los datos para el serializer
        data = {
            'collection': collection.id,
            'movie': movie.id
        }

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class WishlistViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Normalmente un usuario solo tiene una wishlist.
    """
    queryset = Wishlist.objects.all().select_related('user').prefetch_related('wishlistmovie_set__movie')
    serializer_class = WishlistSerializer

    # Esto crea el endpoint /wishlist/mine/
    @action(detail=False, methods=['get'])
    def mine(self, request):
        wishlist = Wishlist.objects.get(user=request.user.id)
        serializer = self.get_serializer(wishlist)

        return Response(serializer.data['movies'])

class WishlistMovieViewSet(viewsets.ModelViewSet):
    queryset = WishlistMovie.objects.all()
    serializer_class = WishlistMovieSerializer

    def create(self, request, *args, **kwargs):
        # 1. Extraemos los datos del request
        imdb_id = request.data.get('imdb_id')
        user = request.user

        wishlist = Wishlist.objects.get(user=user.id)

        # 2. Buscamos la película manualmente por su imdb_id
        # Si no existe, lanzará un 404
        movie = get_object_or_404(Movie, imdb_id=imdb_id)

        # 3. Preparamos los datos para el serializer
        # Pasamos el ID real de la película encontrada
        data = {
            'wishlist': wishlist.id,
            'movie': movie.id
        }

        serializer = self.get_serializer(data=data)
        serializer.is_valid()
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class FriendViewSet(viewsets.ModelViewSet):
    """
    Gestión de amistades/seguidores.
    """
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer

    authentication_classes = [Auth0Authentication]    
    permission_classes = [permissions.AllowAny]

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'friend']

    
    def get_queryset(self):
        """
        Este método redefine el queryset principal. 
        Filtra para que el usuario solo vea sus propias relaciones.
        """
        queryset = Friend.objects.all()
    
        # Verificamos si el usuario envió el parámetro 'mine'
        show_only_mine = self.request.query_params.get('mine') == 'true'

        if show_only_mine and self.request.user.is_authenticated:
            return queryset.filter(user=self.request.user)
        
        return queryset
    
    @action(detail=False, methods=['get'], url_path='incoming')
    def incoming_requests(self, request):
        """
        Obtiene las peticiones donde el usuario autenticado es el 'friend'.
        """
        user = self.request.user
        
        # Filtramos donde el usuario actual es el destinatario (friend)
        queryset = Friend.objects.filter(friend=user)
        
        # Serializamos los datos
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class MoviePriceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MoviePrice.objects.all()
    serializer_class = MoviePriceSerializer

    authentication_classes = []
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['get'], url_path='scrape')
    def scrape_prices(self, request):
        title = request.query_params.get('title')
        if not title:
            return Response({"error": "title parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        prices = get_dvd_prices(title)
        return Response(prices)