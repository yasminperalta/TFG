import sys
import os

try:
    import django_backend.django_backend_app
    print("✅ Importación con prefijo exitosa")
except ImportError:
    print("❌ No se encuentra con prefijo")

try:
    import django_backend_app
    print("✅ Importación directa exitosa")
except ImportError:
    print("❌ No se encuentra directo")