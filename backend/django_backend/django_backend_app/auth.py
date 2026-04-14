import jwt
import requests
from django.core.cache import cache
from django.conf import settings
from rest_framework import authentication, exceptions
from .models import User
from dotenv import load_dotenv
import os

class Auth0Authentication(authentication.BaseAuthentication):
    
    def get_public_key(self, kid):
        # Lee el caché definido en settings.py
        cache_key = f"auth0_jwk_{kid}"
        # key_data = cache.get(cache_key)
        key_data = None

        if not key_data:
            load_dotenv()
            DOMAIN = os.getenv("AUTH0_DOMAIN")

            # Si no está en caché, descargamos el set de llaves (JWKS)
            jwks_url = f'https://{DOMAIN}/.well-known/jwks.json'
            response = requests.get(jwks_url)
            jwks = response.json()

            # Buscamos la llave específica que firmó el token
            for key in jwks['keys']:
                # Guardamos todas las llaves del set en caché por 24 horas (86400 seg)
                # Esto evita peticiones futuras si Auth0 rota llaves
                loop_cache_key = f"auth0_jwk_{key['kid']}"
                cache.set(loop_cache_key, key, 86400)
                
                if key['kid'] == kid:
                    key_data = key

        if not key_data:
            raise exceptions.AuthenticationFailed("No se encontró una llave pública válida.")

        return jwt.algorithms.RSAAlgorithm.from_jwk(key_data)

    def get_user(self, payload):
        """
        Obtiene el User que está mandando la petición
        """
        print(payload)
        try:
            user = User.objects.get(auth0_id=payload["sub"])
            return user
        except Exception as e:
            print(e)
            raise exceptions.AuthenticationFailed(f'Error de autenticación: {str(e)}')

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization', None)
        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split()[1]

        try:
            load_dotenv()
            DOMAIN = os.getenv("AUTH0_DOMAIN")
            AUDIENCE = os.getenv("AUTH0_AUDIENCE")
            
            # 1. Obtener el 'kid' (Key ID) sin verificar la firma todavía
            header = jwt.get_unverified_header(token)
            kid = header.get('kid')

            # 2. Obtener la llave pública (usando el caché)
            public_key = self.get_public_key(kid)

            # 3. Validar el token con la llave recuperada
            payload = jwt.decode(
                token,
                public_key,
                algorithms=['RS256'],
                audience=AUDIENCE,
                issuer=f'https://{DOMAIN}/'
            )

            # Devuelve una tupla con el objeto User autorizado y el token
            return (self.get_user(payload), token)

        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('El token ha expirado.')
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Error de autenticación: {str(e)}')