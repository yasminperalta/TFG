from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Wishlist, User

@receiver(post_save, sender=User)
def create_user_wishlist(sender, instance, created, **kwargs):
    if created:
        Wishlist.objects.create(user=instance)