from django.db import models


class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    release_year = models.IntegerField(blank=True, null=True)
    director = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'movies'

    def __str__(self):
        return str(self.title)


class User(models.Model):
    auth0_id = models.CharField(unique=True, max_length=50)
    username = models.CharField(unique=True, max_length=50)
    email = models.EmailField(unique=True, max_length=100)
    created_at = models.DateTimeField(blank=True, null=True, auto_now_add=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return str(self.username)


class Wishlist(models.Model):
    user = models.OneToOneField(User, models.CASCADE, blank=True, null=True)

    class Meta:
        db_table = 'wishlists'

    def __str__(self):
        return f"Wishlist de {self.user}"


class Collection(models.Model):
    user = models.ForeignKey(User, models.CASCADE, blank=True, null=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    is_public = models.BooleanField(blank=True, null=True)

    class Meta:
        db_table = 'collections'

    def __str__(self):
        return str(self.name)


class WishlistMovie(models.Model):
    wishlist = models.ForeignKey(Wishlist, models.CASCADE)
    movie = models.ForeignKey(Movie, models.CASCADE)

    class Meta:
        db_table = 'wishlist_movies'
        constraints = [
            models.UniqueConstraint(
                fields=['wishlist', 'movie'], 
                name='unique_wishlist_movie'
            )
        ]

    def __str__(self):
        return f"Wishlist {self.wishlist} película {self.movie}"


class Friend(models.Model):
    user = models.ForeignKey(User, models.CASCADE)
    friend = models.ForeignKey(User, models.CASCADE, related_name='friends_friend_set')
    status = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'friends'
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'friend'], 
                name='unique_friend'
            )
        ]

    def __str__(self):
        return f"Usuario {self.user} amigo {self.friend}"


class MoviePrice(models.Model):
    movie = models.ForeignKey(Movie, models.CASCADE, blank=True, null=True)
    platform_name = models.CharField(max_length=50, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    currency = models.CharField(max_length=3, blank=True, null=True)
    last_updated = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'movie_prices'

    def __str__(self):
        return f"Película {self.movie} precio {self.price}"


class CollectionMovie(models.Model):
    collection = models.ForeignKey(Collection, models.CASCADE)
    movie = models.ForeignKey(Movie, models.CASCADE)
    added_at = models.DateTimeField(blank=True, null=True, auto_now_add=True)

    class Meta:
        db_table = 'collection_movies'
        constraints = [
            models.UniqueConstraint(
                fields=['collection', 'movie'], 
                name='unique_collection_movie'
            )
        ]
        
    def __str__(self):
        return f"Colección {self.collection} película {self.movie}"


class LikedCollection(models.Model):
    user = models.ForeignKey(User, models.CASCADE)
    collection = models.ForeignKey(Collection, models.CASCADE)

    class Meta:
        db_table = 'liked_collections'
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'collection'], 
                name='unique_liked_collection'
            )
        ]

    def __str__(self):
        return f"Usuario {self.user} colección {self.collection}"