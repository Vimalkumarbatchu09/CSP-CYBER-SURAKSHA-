"""
Cyber Suraksha — Application Configuration
"""
import os
import urllib.parse
from dotenv import load_dotenv

load_dotenv(override=True)


class Config:
    # Flask core
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY', 'cyber-suraksha-dev-secret-key-2026')

    # MySQL Database credentials
    MYSQL_HOST = os.getenv('MYSQL_HOST', '127.0.0.1')
    MYSQL_PORT = os.getenv('MYSQL_PORT', '3306')
    MYSQL_USER = os.getenv('MYSQL_USER', 'cyber_admin')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', 'CyberSuraksha@2026')
    MYSQL_DATABASE = os.getenv('MYSQL_DATABASE', 'cyber_suraksha')

    _raw_db_url = os.getenv('DATABASE_URL')
    if _raw_db_url:
        if _raw_db_url.startswith('postgres://'):
            _raw_db_url = _raw_db_url.replace('postgres://', 'postgresql://', 1)
        SQLALCHEMY_DATABASE_URI = _raw_db_url
    else:
        # Properly URL-encode password in case it contains special characters like '@'
        _encoded_password = urllib.parse.quote_plus(MYSQL_PASSWORD)
        SQLALCHEMY_DATABASE_URI = (
            f"mysql+pymysql://{MYSQL_USER}:{_encoded_password}"
            f"@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"
        )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Session security
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    REMEMBER_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_DURATION = 2592000  # 30 days in seconds

    # CSRF
    WTF_CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = 3600  # 1 hour

    # Google OAuth 2.0
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID', '').strip()
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET', '').strip()

    # Rate limiting
    RATELIMIT_DEFAULT = "300 per hour"
    RATELIMIT_STORAGE_URI = "memory://"
