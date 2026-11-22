"""
Cyber Suraksha — Database Models
"""
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime, timezone

db = SQLAlchemy()


class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=True)  # Null for Google-only users
    is_google_user = db.Column(db.Boolean, default=False)
    google_id = db.Column(db.String(255), unique=True, nullable=True)
    profile_picture = db.Column(db.String(500), nullable=True)
    is_admin = db.Column(db.Boolean, default=False)
    is_active_account = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    last_login = db.Column(db.DateTime, nullable=True)
    failed_login_attempts = db.Column(db.Integer, default=0)
    locked_until = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<User {self.email}>'

    @property
    def is_locked(self):
        """Check if the account is temporarily locked due to failed attempts."""
        if self.locked_until and self.locked_until > datetime.now(timezone.utc):
            return True
        return False
