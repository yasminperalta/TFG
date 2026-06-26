from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MovieViewSet, UserViewSet, CollectionViewSet, CollectionMovieViewSet,
    WishlistViewSet, FriendViewSet, WishlistMovieViewSet, MoviePriceViewSet,
    analyze_image,
)

router = DefaultRouter()
router.register(r'movies', MovieViewSet)
router.register(r'users', UserViewSet)
router.register(r'collections', CollectionViewSet)
router.register(r'collection-movies', CollectionMovieViewSet, basename='collectionmovie')
router.register(r'wishlist', WishlistViewSet)
# basename requerido porque CollectionMovieViewSet y WishlistMovieViewSet no tienen queryset de clase
router.register(r'wishlist-movies', WishlistMovieViewSet, basename='wishlistmovie')
router.register(r'friends', FriendViewSet)
router.register(r'movie-prices', MoviePriceViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/analyze-image/', analyze_image),
]