# Iniciar backend de DioTeca
El backend de nuestra aplicación usa el framework Django (python) localmente junto a una base de datos PostgreSQL en un contenedor Docker.

Usamos [uv](https://github.com/astral-sh/uv) como administrador del proyecto.

## Prerrequisitos
Descargar las dependencias desde el directorio `backend`:

```
uv sync
```

## 1. Iniciar base de datos
Para iniciar la base de datos, tenemos que tener [Docker](https://www.docker.com/) instalado en nuestra máquina. Desde el mismo directorio `backend` ejecutamos el comando:

```
docker compose up
```

Docker iniciará un contenedor a partir de las directivas del archivo `docker-compose.yml`: imagen de Postgres 16 y un volumen que asegura la preservación de la información al reiniciar el contenedor.

Con propósito de probar el backend, las variables de entorno se definen en este mismo fichero, en una aplicación desplegada se definirían en un fichero separado que no se subiría al repositorio.

```
POSTGRES_USER: admin
POSTGRES_PASSWORD: admin
POSTGRES_DB: cinesnap_db
```

Comprobamos que el contenedor se ha lanzado correctamente en `localhost:5432` con el comando:

```
docker ps -a
```

### Esquema de la base de datos
Cuando iniciamos la base de datos por primera vez, está completamente vacía. Crearemos las tablas ejecutando el script de migración desde la carpeta `backend`:
```
uv run ./manage.py migrate
```

## 2. Iniciar API de Django
Desde la carpeta `backend` ejecutamos el siguiente comando para iniciar el servidor:

```
uv run .\manage.py runserver
```