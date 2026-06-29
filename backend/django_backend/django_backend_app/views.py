from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, authentication_classes, permission_classes as drf_permission_classes
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .models import Movie, User, Collection, CollectionMovie, Wishlist, WishlistMovie, Friend, MoviePrice
from .serializers import (
    MovieSerializer, UserSerializer, CollectionSerializer,
    WishlistSerializer, FriendSerializer, MoviePriceSerializer,
    WishlistMovieSerializer, CollectionMovieSerializer, UserPublicSerializer
)
from .auth import Auth0Authentication
from .services import fetch_and_save_popular_movies, get_dvd_prices, search_and_save_movies, analyze_image_with_gemini
from django.db.models import Q

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

    def get_permissions(self):
        # Lecturas públicas; escrituras solo para usuarios autenticados
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

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
    
    # ENDPOINT PARA PELÍCULAS POPULARES
    @action(detail=False, methods=['get'], url_path='sync-tmdb')
    def sync_tmdb(self, request):
        page = request.query_params.get('page', 1)
        try:
            movies = fetch_and_save_popular_movies(page=page)
            serializer = self.get_serializer(movies, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    # ENDPOINT PARA BUSCAR PELÍCULAS — público para permitir búsquedas sin login
    @action(detail=False, methods=['get'], url_path='search-tmdb')
    def search_tmdb(self, request):
        query = request.query_params.get('query', None)
        page = request.query_params.get('page', 1)

        if not query:
            return Response(
                {"error": "Debes proporcionar un parámetro de búsqueda 'query'"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Llamamos al servicio con el query del usuario
            movies = search_and_save_movies(query=query)
            serializer = self.get_serializer(movies, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserPublicSerializer  # nunca exponemos UserSerializer con __all__

    authentication_classes = [Auth0Authentication]
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        # Rutas públicas intencionadas
        if self.action in ('create', 'public_list', 'public_detail'):
            return [permissions.AllowAny()]
        # Perfil propio y acciones autenticadas
        if self.action == 'me':
            return [permissions.AllowAny()]  # me() valida el token manualmente
        # Bloqueamos list/retrieve/update/destroy con datos internos
        return [permissions.IsAdminUser()]

    def create(self, request, *args, **kwargs):
        """
        Upsert al hacer login con Auth0.
        El auth0_id siempre se extrae del JWT verificado, nunca del body,
        para evitar que alguien tome el control de otra cuenta por email.
        """
        auth = Auth0Authentication()
        try:
            payload = auth.decode_token(request)
        except Exception:
            return Response({'error': 'Token inválido'}, status=status.HTTP_401_UNAUTHORIZED)
        if not payload:
            return Response({'error': 'Token requerido'}, status=status.HTTP_401_UNAUTHORIZED)

        auth0_id = payload['sub']  # siempre del token, no del body
        username = request.data.get('username', '')
        picture_url = request.data.get('picture_url', '')
        # El email también se lee del body solo para crear el usuario —
        # NO se usa para buscar cuentas existentes, para evitar account takeover.
        email = request.data.get('email', '')

        def _username_is_email(u):
            return '@' in (u or '')

        def _try_update_username(user_obj, new_username):
            """Actualiza el username solo si el actual es un email y el nuevo no lo es
            y además no está ya tomado por otra cuenta."""
            if _username_is_email(user_obj.username) and new_username and not _username_is_email(new_username):
                taken = User.objects.filter(username=new_username).exclude(pk=user_obj.pk).exists()
                if not taken:
                    user_obj.username = new_username

        # Buscar SOLO por auth0_id (viene del JWT verificado, no del body).
        # La búsqueda por email fue eliminada: permitía que un atacante pasara
        # el email de otra cuenta en el body y tomara el control de ella.
        user = User.objects.filter(auth0_id=auth0_id).first()
        if user:
            # Migrar username si sigue siendo el email del registro antiguo
            _try_update_username(user, username)
            user.save()

        if not user:
            # Usuario completamente nuevo — crear
            # Si el username ya existe, añadir sufijo numérico para garantizar unicidad
            base = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base}{counter}"
                counter += 1
            user = User(auth0_id=auth0_id, username=username, email=email, picture_url=picture_url)
            user.set_unusable_password()
            user.save()
            # Crear la wishlist automáticamente para el usuario nuevo
            Wishlist.objects.get_or_create(user=user)

        serializer = UserPublicSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

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

    @action(detail=False, methods=['get', 'patch'], url_path='me')
    def me(self, request):
        """
        GET  /api/users/me/ -> Devuelve el perfil del usuario autenticado.
        PATCH /api/users/me/ -> Actualiza campos permitidos (is_public, username, picture_url).
        """
        auth = Auth0Authentication()
        user_auth_tuple = auth.authenticate(request)
        if not user_auth_tuple:
            return Response({'error': 'No autenticado'}, status=status.HTTP_401_UNAUTHORIZED)
        current_user = user_auth_tuple[0]

        if request.method == 'GET':
            serializer = UserPublicSerializer(current_user)
            return Response(serializer.data)

        # PATCH — solo campos no sensibles
        allowed = {'is_public', 'username', 'picture_url'}
        data = {k: v for k, v in request.data.items() if k in allowed}
        serializer = UserPublicSerializer(current_user, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        # Guardar directamente para evitar validaciones de contraseña
        for attr, value in serializer.validated_data.items():
            setattr(current_user, attr, value)
        current_user.save()
        return Response(UserPublicSerializer(current_user).data)
    
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

    def get_permissions(self):
        # Escritura y acciones propias requieren autenticación
        if self.action in ('create', 'update', 'partial_update', 'destroy', 'mine'):
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        user = self.request.user
        base_qs = Collection.objects.select_related('user').prefetch_related('collectionmovie_set__movie')

        # Operaciones de escritura solo sobre colecciones propias
        if self.action in ('update', 'partial_update', 'destroy'):
            if user and user.is_authenticated:
                return base_qs.filter(user=user)
            return base_qs.none()

        # Lectura: colecciones públicas + las propias (aunque sean privadas)
        if user and user.is_authenticated:
            return base_qs.filter(Q(is_public=True) | Q(user=user))
        return base_qs.filter(is_public=True)

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
    serializer_class = CollectionMovieSerializer
    authentication_classes = [Auth0Authentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user and user.is_authenticated:
            return CollectionMovie.objects.filter(collection__user=user)
        return CollectionMovie.objects.none()

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

        # 3. Usamos get_or_create para evitar el 400 por UniqueConstraint
        # si la película ya está en la colección, devolvemos el registro existente
        instance, created = CollectionMovie.objects.get_or_create(
            collection=collection,
            movie=movie,
        )

        serializer = self.get_serializer(instance)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )

class WishlistViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Normalmente un usuario solo tiene una wishlist.
    Solo puede ver su propia wishlist — cada usuario tiene acceso únicamente a la suya.
    """
    serializer_class = WishlistSerializer
    authentication_classes = [Auth0Authentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Cada usuario solo puede ver su propia wishlist
        user = self.request.user
        if user and user.is_authenticated:
            return Wishlist.objects.filter(user=user).select_related('user').prefetch_related('wishlistmovie_set__movie')
        return Wishlist.objects.none()

    # Esto crea el endpoint /wishlist/mine/
    @action(detail=False, methods=['get'])
    def mine(self, request):
        # get_or_create por si el usuario existía antes de que se añadiera la creación automática
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(wishlist)

        return Response(serializer.data['movies'])

class WishlistMovieViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistMovieSerializer
    authentication_classes = [Auth0Authentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user and user.is_authenticated:
            return WishlistMovie.objects.filter(wishlist__user=user)
        return WishlistMovie.objects.none()

    def create(self, request, *args, **kwargs):
        # 1. Extraemos los datos del request
        imdb_id = request.data.get('imdb_id')
        user = request.user

        # get_or_create por si el usuario existía antes de la creación automática de wishlist
        wishlist, _ = Wishlist.objects.get_or_create(user=user)

        # 2. Buscamos la película manualmente por su imdb_id
        # Si no existe, lanzará un 404
        movie = get_object_or_404(Movie, imdb_id=imdb_id)

        # 3. Usamos get_or_create para evitar 400 por UniqueConstraint
        # si la película ya estaba en la wishlist, devolvemos el registro existente
        instance, created = WishlistMovie.objects.get_or_create(
            wishlist=wishlist,
            movie=movie,
        )

        serializer = self.get_serializer(instance)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )

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

    def get_permissions(self):
        # Lectura pública, escritura solo para autenticados
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def create(self, request, *args, **kwargs):
        """
        Crea o actualiza la relación de amistad evitando duplicados.
        Reglas de negocio:
          - status solo puede ser "requested" o "friend"
          - status="friend" directo solo se permite si el perfil destino es público
        """
        friend_id = request.data.get('friend')
        status_val = request.data.get('status', 'requested')
        user = request.user

        if status_val not in ('requested', 'friend'):
            return Response({'error': 'Estado inválido'}, status=status.HTTP_400_BAD_REQUEST)

        # Un usuario no puede seguirse a sí mismo
        if str(user.id) == str(friend_id):
            return Response({'error': 'No puedes seguirte a ti mismo'}, status=status.HTTP_400_BAD_REQUEST)

        # Solo se puede marcar directamente como "friend" si el perfil destino es público
        if status_val == 'friend':
            target = User.objects.filter(id=friend_id).first()
            if not target or not target.is_public:
                return Response(
                    {'error': 'No se puede seguir directamente un perfil privado'},
                    status=status.HTTP_403_FORBIDDEN
                )

        try:
            instance, created = Friend.objects.get_or_create(
                user=user,
                friend_id=friend_id,
                defaults={'status': status_val}
            )
            if not created:
                instance.status = status_val
                instance.save()
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        """
        Solo el destinatario (friend) puede aceptar una solicitud cambiando a "friend".
        El emisor (user) no puede auto-aceptar su propia solicitud.
        """
        user = request.user
        pk = kwargs.get('pk')
        try:
            instance = Friend.objects.get(pk=pk)
        except Friend.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Verificar que el usuario autenticado es parte de la relación
        if instance.user != user and instance.friend != user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        # Solo el destinatario puede cambiar el estado a "friend"
        new_status = request.data.get('status')
        if new_status == 'friend' and instance.friend != user:
            return Response(
                {'error': 'Solo el destinatario puede aceptar una solicitud'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def perform_create(self, serializer):
        """
        Asigna automáticamente el usuario autenticado como el emisor de la petición.
        """
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        """
        Elimina solo si el usuario autenticado es parte de la relación.
        """
        user = request.user
        pk = kwargs.get('pk')
        try:
            instance = Friend.objects.get(pk=pk)
        except Friend.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if instance.user != user and instance.friend != user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_queryset(self):
        """
        Este método redefine el queryset principal.
        Filtra para que el usuario solo vea sus propias relaciones de amistad.
        """
        user = self.request.user
        if user and user.is_authenticated:
            return Friend.objects.filter(Q(user=user) | Q(friend=user))
        return Friend.objects.none()
    
    @action(detail=False, methods=['get'], url_path='incoming')
    def incoming_requests(self, request):
        """
        Obtiene las peticiones del usuario autenticado.
        """
        user = self.request.user
        if not user or not user.is_authenticated:
            return Response([])

        # Filtramos donde el usuario actual es el remitente O el destinatario
        queryset = Friend.objects.filter(Q(user=user) | Q(friend=user))

        # Serializamos los datos
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class MoviePriceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MoviePrice.objects.all()
    serializer_class = MoviePriceSerializer

    # Lectura pública (lista de precios ya guardados), scrape requiere auth (ver abajo)
    authentication_classes = [Auth0Authentication]
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'], url_path='scrape',
            permission_classes=[permissions.IsAuthenticated])
    def scrape_prices(self, request):
        # Requiere autenticación para evitar que cualquiera gaste créditos de ScraperAPI
        title = request.query_params.get('title')
        if not title:
            return Response({"error": "title parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        prices = get_dvd_prices(title)
        return Response(prices)


@api_view(['POST'])
@authentication_classes([Auth0Authentication])
@drf_permission_classes([permissions.IsAuthenticated])
def analyze_image(request):
    """Endpoint que llama a Gemini server-side para analizar una imagen de DVDs."""
    image_data = request.data.get('image_data')
    mime_type = request.data.get('mime_type', 'image/jpeg')

    if not image_data:
        return Response({'error': 'image_data es requerido'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        resultados = analyze_image_with_gemini(image_data, mime_type)
        return Response(resultados)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)