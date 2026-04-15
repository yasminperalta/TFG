from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import (
    MovieViewSet, UserViewSet, CollectionViewSet, 
    WishlistViewSet, FriendViewSet, WishlistMovieViewSet
)

router = DefaultRouter()
router.register(r'movies', MovieViewSet)
router.register(r'users', UserViewSet)
router.register(r'collections', CollectionViewSet)
router.register(r'wishlist', WishlistViewSet)
router.register(r'wishlist-movies', WishlistMovieViewSet)
router.register(r'friends', FriendViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]