"""
Configuration constants that read values from environment variables.
"""

import os

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "")

# Security
SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "django-insecure-2$o$w1jff2icu^6iqqh-%g3p+9pq4e2=dxon-gh#*p=in*#y*t",
)
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
ALLOWED_HOSTS = (
    os.getenv("ALLOWED_HOSTS", "").split(",")
    if os.getenv("ALLOWED_HOSTS")
    else []
)

# JWT Settings
JWT_ACCESS_TOKEN_LIFETIME = int(
    os.getenv("JWT_ACCESS_TOKEN_LIFETIME", "60")
)  # minutes
JWT_REFRESH_TOKEN_LIFETIME = int(
    os.getenv("JWT_REFRESH_TOKEN_LIFETIME", "7")
)  # days
JWT_ROTATE_REFRESH_TOKENS = (
    os.getenv("JWT_ROTATE_REFRESH_TOKENS", "True").lower() == "true"
)
JWT_BLACKLIST_AFTER_ROTATION = (
    os.getenv("JWT_BLACKLIST_AFTER_ROTATION", "True").lower() == "true"
)
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

# CORS Settings
CORS_ALLOWED_ORIGINS = os.getenv(
    "CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"
).split(",")
CORS_ALLOW_CREDENTIALS = (
    os.getenv("CORS_ALLOW_CREDENTIALS", "True").lower() == "true"
)
CORS_ALLOW_ALL_ORIGINS = (
    os.getenv("CORS_ALLOW_ALL_ORIGINS", "True").lower() == "true"
)

# Time Zone
TIME_ZONE = os.getenv("TIME_ZONE", "UTC")
LANGUAGE_CODE = os.getenv("LANGUAGE_CODE", "en-us")
