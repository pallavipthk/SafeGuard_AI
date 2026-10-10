import os
from datetime import timedelta


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "safeguard-ai-secret-key-2024-secure-production-token-min32")
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "sqlite:///safeguard.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-secret-key-2024-secure-production-token-min32")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    UPLOAD_FOLDER = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "static/uploads"
    )
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
    OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
