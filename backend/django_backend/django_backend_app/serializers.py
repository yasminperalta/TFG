from rest_framework import serializers
from .models import (
    Movie, User, Wishlist, Collection, 
    WishlistMovie, Friend, MoviePrice, 
    CollectionMovie, LikedCollection
)

# --- Películas y Precios ---

class MoviePriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoviePrice
        fields = '__all__'

class MovieSerializer(serializers.ModelSerializer):
    # Opcional: Incluir los precios al consultar una película
    prices = MoviePriceSerializer(many=True, read_only=True, source='movieprice_set')

    class Meta:
        model = Movie
        fields = '__all__'


# --- Usuarios ---

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'auth0_id', 'username', 'email', 'created_at']
        read_only_fields = ['id'] # El ID es autoincremental, no se manda

    def create(self, validated_data):
            """
            Crea y retorna un nuevo usuario usando los datos validados.
            """
            # Si estás usando el modelo User estándar de Django extendido:
            return User.objects.create(**validated_data)

# --- Wishlist (Lista de Deseos) ---

class WishlistMovieSerializer(serializers.ModelSerializer):
    # Para ver los detalles de la película en la wishlist
    movie_details = MovieSerializer(source='movie', read_only=True)

    class Meta:
        model = WishlistMovie
        fields = ['id', 'wishlist', 'movie', 'movie_details']

class WishlistSerializer(serializers.ModelSerializer):
    # Muestra las películas asociadas a esta wishlist
    movies = WishlistMovieSerializer(many=True, read_only=True, source='wishlistmovie_set')

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'movies']


# --- Colecciones ---

class CollectionMovieSerializer(serializers.ModelSerializer):
    movie_details = MovieSerializer(source='movie', read_only=True)

    class Meta:
        model = CollectionMovie
        fields = ['id', 'collection', 'movie', 'movie_details', 'added_at']

class CollectionSerializer(serializers.ModelSerializer):
    movies = CollectionMovieSerializer(many=True, read_only=True, source='collectionmovie_set')
    owner_name = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Collection
        fields = ['id', 'user', 'owner_name', 'name', 'description', 'is_public', 'movies']


# --- Relaciones Sociales ---

class FriendSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')
    friend_name = serializers.ReadOnlyField(source='friend.username')

    class Meta:
        model = Friend
        fields = ['id', 'user', 'user_name', 'friend', 'friend_name', 'status']


class LikedCollectionSerializer(serializers.ModelSerializer):
    collection_name = serializers.ReadOnlyField(source='collection.name')

    class Meta:
        model = LikedCollection
        fields = ['id', 'user', 'collection', 'collection_name']