from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Movie, User, Collection, Wishlist, Friend, MoviePrice
from .serializers import (
    MovieSerializer, UserSerializer, CollectionSerializer, 
    WishlistSerializer, FriendSerializer, MoviePriceSerializer
)

class MovieViewSet(viewsets.ModelViewSet):
    """
    Endpoint para ver y buscar películas.
    Se optimiza con prefetch_related para traer los precios de una vez.
    """
    queryset = Movie.objects.all().prefetch_related('movieprice_set')
    serializer_class = MovieSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'director']
    ordering_fields = ['release_year', 'title']

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny] # Por ahora permitimos que cualquiera lo vea

class CollectionViewSet(viewsets.ModelViewSet):
    """
    Las colecciones tipo Letterboxd. 
    Usamos prefetch_related para cargar las películas y sus detalles eficientemente.
    """
    queryset = Collection.objects.all().select_related('user').prefetch_related('collectionmovie_set__movie')
    serializer_class = CollectionSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['user', 'is_public']
    search_fields = ['name', 'description']

    def perform_create(self, serializer):
        # Asigna automáticamente el usuario autenticado como creador
        serializer.save(user=self.request.user)

class WishlistViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Normalmente un usuario solo tiene una wishlist.
    """
    queryset = Wishlist.objects.all().select_related('user').prefetch_related('wishlistmovie_set__movie')
    serializer_class = WishlistSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # Un usuario solo ve su propia wishlist
        return self.queryset.filter(user=self.request.user)

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
    permission_classes = [permissions.AllowAny]