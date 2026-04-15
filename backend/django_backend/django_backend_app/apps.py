from django.apps import AppConfig


class DjangoBackendAppConfig(AppConfig):
    name = 'django_backend.django_backend_app'

    def ready(self):
            # Importamos las señales aquí para que se registren al arrancar
            import django_backend.django_backend_app.signals