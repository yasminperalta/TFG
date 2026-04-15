from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .models import Movie, User, Collection, Wishlist, Friend, MoviePrice, WishlistMovie
from .serializers import (
    MovieSerializer, UserSerializer, CollectionSerializer, 
    WishlistSerializer, FriendSerializer, MoviePriceSerializer,
    WishlistMovieSerializer
)
from .auth import Auth0Authentication

class MovieViewSet(viewsets.ModelViewSet):
    """
    Endpoint para ver y buscar películas.
    Se optimiza con prefetch_related para traer los precios de una vez.
    """
    queryset = Movie.objects.all().prefetch_related('movieprice_set')
    serializer_class = MovieSerializer

    # Para autenticar usando auth0, el autentificador que hemos creado
    authentication_classes = [Auth0Authentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'director']
    ordering_fields = ['release_year', 'title']

    def create(self, request, *args, **kwargs):

        # Usamos update_or_create para la lógica     de Upsert
        # 'defaults' contiene los campos que se actualizarán si existe o se usarán para crear
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

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    authentication_classes = []
    permission_classes = [permissions.AllowAny] # Por ahora permitimos que cualquiera lo vea

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

    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        # Asigna automáticamente el usuario autenticado como creador
        serializer.save(user=self.request.user)

class WishlistViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Normalmente un usuario solo tiene una wishlist.
    """
    queryset = Wishlist.objects.all().select_related('user').prefetch_related('wishlistmovie_set__movie')
    serializer_class = WishlistSerializer

    authentication_classes = []
    permission_classes = [permissions.AllowAny]

class WishlistMovieViewSet(viewsets.ModelViewSet):
    queryset = WishlistMovie.objects.all()
    serializer_class = WishlistMovieSerializer

    def create(self, request, *args, **kwargs):
        # 1. Extraemos los datos del request
        imdb_id = request.data.get('imdb_id')
        user = request.user

        wishlist = Wishlist.objects.get(user=user.id)

        # 2. Buscamos la película manualmente por su imdb_id
        # Si no existe, lanzará un 404 (o puedes personalizar el error)
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
    queryset = Friend.objects.all().select_related('user', 'friend')
    serializer_class = FriendSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

class MoviePriceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MoviePrice.objects.all()
    serializer_class = MoviePriceSerializer

    authentication_classes = []
    permission_classes = [permissions.AllowAny]