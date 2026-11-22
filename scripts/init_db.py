"""
Cyber Suraksha — Database Initialization Script
Usage:
    python scripts/init_db.py
Creates database tables and seeds default demonstration administrator user.
"""
import sys
import os

# Ensure parent directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, db, bcrypt
from models import User

def main():
    with app.app_context():
        db.create_all()
        print("[SUCCESS] Database tables verified & created.")

        admin_email = "admin@cybersuraksha.org"
        admin = User.query.filter_by(email=admin_email).first()
        if not admin:
            hashed = bcrypt.generate_password_hash("AdminCyber@2026").decode('utf-8')
            admin = User(
                full_name="Cyber Suraksha Administrator",
                email=admin_email,
                password_hash=hashed,
                is_admin=True
            )
            db.session.add(admin)
            db.session.commit()
            print(f"[SEED] Created default admin account: {admin_email} / AdminCyber@2026")
        else:
            print(f"[SEED] Default admin account already exists: {admin_email}")

if __name__ == '__main__':
    main()
