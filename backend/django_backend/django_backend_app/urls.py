from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MovieViewSet, UserViewSet, CollectionViewSet, CollectionMovieViewSet,
    WishlistViewSet, FriendViewSet, WishlistMovieViewSet, MoviePriceViewSet
)

router = DefaultRouter()
router.register(r'movies', MovieViewSet)
router.register(r'users', UserViewSet)
router.register(r'collections', CollectionViewSet)
router.register(r'collection-movies', CollectionMovieViewSet)
router.register(r'wishlist', WishlistViewSet)
router.register(r'wishlist-movies', WishlistMovieViewSet)
router.register(r'friends', FriendViewSet)
router.register(r'movie-prices', MoviePriceViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]