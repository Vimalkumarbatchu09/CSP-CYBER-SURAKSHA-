"""
Cyber Suraksha — Python Flask Web Application Entry Point
Enforces Backend Authentication First:
- Unauthenticated requests to '/' redirect to '/login'.
- All site content and modules require '@login_required'.
- HTTP-only, secure sessions and anti-cache headers prevent unauthorized access.
"""
import os
import pymysql
from flask import Flask, render_template, redirect, url_for, request, session, make_response
from flask_login import LoginManager, login_required, current_user
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from authlib.integrations.flask_client import OAuth

from config import Config
from models import db, User
from extensions import bcrypt, csrf
from auth import auth_bp

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app = Flask(
    __name__,
    static_folder=os.path.join(BASE_DIR, 'static'),
    template_folder=os.path.join(BASE_DIR, 'templates')
)
app.config.from_object(Config)

# Initialize Security & Backend Extensions
bcrypt.init_app(app)
csrf.init_app(app)

limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    default_limits=["500 per hour"]
)

# Login Manager Configuration
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'
login_manager.login_message = "Please authenticate with your credentials to access Cyber Suraksha."
login_manager.login_message_category = "warning"


@login_manager.user_loader
def load_user(user_id):
    try:
        return User.query.get(int(user_id))
    except Exception:
        return None


# Google OAuth Configuration (Authlib)
oauth = OAuth(app)
_google_id = (app.config.get('GOOGLE_CLIENT_ID') or '').strip()
_google_secret = (app.config.get('GOOGLE_CLIENT_SECRET') or '').strip()
if _google_id and _google_id != 'YOUR_GOOGLE_CLIENT_ID_HERE':
    oauth.register(
        name='google',
        client_id=_google_id,
        client_secret=_google_secret,
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={'scope': 'openid email profile'}
    )

# Register Authentication Blueprint
app.register_blueprint(auth_bp)

# Check MySQL connectivity or use resilient SQLite fallback BEFORE db.init_app
use_mysql = False
try:
    conn = pymysql.connect(
        host=Config.MYSQL_HOST,
        port=int(Config.MYSQL_PORT),
        user=Config.MYSQL_USER,
        password=Config.MYSQL_PASSWORD,
        connect_timeout=2
    )
    with conn.cursor() as cur:
        cur.execute(f"CREATE DATABASE IF NOT EXISTS `{Config.MYSQL_DATABASE}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
    conn.close()
    use_mysql = True
    print(f"[DATABASE] MySQL connection established. Database `{Config.MYSQL_DATABASE}` ready.")
except Exception as e:
    # On Vercel / serverless environments, local filesystem is read-only except /tmp
    if os.environ.get('VERCEL') or os.environ.get('AWS_LAMBDA_FUNCTION_NAME'):
        sqlite_path = '/tmp/cyber_suraksha.db'
    else:
        sqlite_path = os.path.join(os.path.dirname(__file__), 'cyber_suraksha.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{sqlite_path}'
    print(f"[DATABASE NOTICE] MySQL server offline ({e}). Running on local database: {sqlite_path}")

db.init_app(app)

with app.app_context():
    db.create_all()


# Security Headers & Anti-Caching Filter (Strict Back-Navigation Protection)
@app.after_request
def add_security_headers(response):
    # Prevent browser caching of protected content
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0, private'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '-1'
    # Defense-in-depth headers
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response


# ==============================================================================
# ROOT ROUTE: ENFORCES FIRST PRIORITY AUTHENTICATION
# ==============================================================================
@app.route('/')
def index_gateway():
    """
    First point of entry:
    - If user is NOT authenticated: redirect directly to Login/Registration portal.
    - If user IS authenticated: direct to the main dashboard.
    """
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return redirect(url_for('auth.login'))


# ==============================================================================
# PROTECTED CONTENT ROUTES (ACCESSIBLE ONLY AFTER SUCCESSFUL AUTHENTICATION)
# ==============================================================================

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('site/dashboard.html', active_page='dashboard')


@app.route('/home')
@login_required
def home():
    return render_template('site/index.html', active_page='home')


@app.route('/threats')
@login_required
def threats():
    return render_template('site/threats.html', active_page='threats')


@app.route('/tools')
@login_required
def tools():
    return render_template('site/tools.html', active_page='tools')


@app.route('/mfa')
@login_required
def mfa():
    return render_template('site/mfa.html', active_page='mfa')


@app.route('/awareness')
@login_required
def awareness():
    return render_template('site/awareness.html', active_page='awareness')


@app.route('/quiz')
@login_required
def quiz():
    return render_template('site/quiz.html', active_page='quiz')


@app.route('/resources')
@login_required
def resources():
    return render_template('site/resources.html', active_page='resources')


@app.route('/contact')
@login_required
def contact():
    return render_template('site/contact.html', active_page='contact')


@app.route('/about')
@login_required
def about():
    return render_template('site/about.html', active_page='about')


if __name__ == '__main__':
    # Run locally on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
