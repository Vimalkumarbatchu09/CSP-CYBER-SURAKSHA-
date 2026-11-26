"""
Cyber Suraksha — Authentication Routes
Handles standard email/password login, registration, Google OAuth, password reset, and logout.
"""
from datetime import datetime, timezone, timedelta
from flask import render_template, redirect, url_for, flash, request, session, current_app
from flask_login import login_user, logout_user, login_required, current_user
from urllib.parse import urlparse
from auth import auth_bp
from models import db, User
from extensions import bcrypt
from forms import LoginForm, SignupForm, ForgotPasswordForm, ResetPasswordForm
import os


def is_safe_url(target):
    """Ensure redirect target is a safe relative URL within this application."""
    if not target:
        return False
    ref_url = urlparse(request.host_url)
    test_url = urlparse(target)
    return test_url.scheme in ('', 'http', 'https') and (test_url.netloc == '' or test_url.netloc == ref_url.netloc)


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))

    form = LoginForm()
    google_configured = bool(current_app.config.get('GOOGLE_CLIENT_ID') and 
                             current_app.config.get('GOOGLE_CLIENT_ID') != 'YOUR_GOOGLE_CLIENT_ID_HERE')

    if form.validate_on_submit():
        email = form.email.data.strip().lower()
        password = form.password.data
        user = User.query.filter_by(email=email).first()

        if user:
            # Check account lockout
            if user.is_locked:
                remaining_min = int((user.locked_until - datetime.now(timezone.utc)).total_seconds() / 60) + 1
                flash(f"Account is temporarily locked due to multiple failed login attempts. Please try again in {remaining_min} minute(s).", "danger")
                return render_template('auth/login.html', form=form, google_configured=google_configured)

            # Check if user registered exclusively through Google OAuth
            if user.is_google_user and not user.password_hash:
                flash("This account was created with Google Sign-In. Please sign in using Google.", "warning")
                return render_template('auth/login.html', form=form, google_configured=google_configured)

            # Verify password using bcrypt
            if user.password_hash and bcrypt.check_password_hash(user.password_hash, password):
                # Reset failed attempts and update last login
                user.failed_login_attempts = 0
                user.locked_until = None
                user.last_login = datetime.now(timezone.utc)
                db.session.commit()

                login_user(user, remember=form.remember_me.data)
                flash(f"Welcome back, {user.full_name}!", "success")

                next_page = request.args.get('next')
                if next_page and is_safe_url(next_page):
                    return redirect(next_page)
                return redirect(url_for('dashboard'))
            else:
                # Increment failed attempts
                user.failed_login_attempts = (user.failed_login_attempts or 0) + 1
                if user.failed_login_attempts >= 5:
                    user.locked_until = datetime.now(timezone.utc) + timedelta(minutes=15)
                    db.session.commit()
                    flash("Too many failed login attempts. Account locked for 15 minutes to prevent brute-force attacks.", "danger")
                else:
                    db.session.commit()
                    attempts_left = 5 - user.failed_login_attempts
                    flash(f"Invalid email or password. ({attempts_left} attempts remaining before temporary lockout)", "danger")
        else:
            flash("Invalid email or password. Please verify your credentials or register a new account.", "danger")

    return render_template('auth/login.html', form=form, google_configured=google_configured)


@auth_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))

    form = SignupForm()
    google_configured = bool(current_app.config.get('GOOGLE_CLIENT_ID') and 
                             current_app.config.get('GOOGLE_CLIENT_ID') != 'YOUR_GOOGLE_CLIENT_ID_HERE')

    if form.validate_on_submit():
        email = form.email.data.strip().lower()
        full_name = form.full_name.data.strip()
        password = form.password.data

        hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')

        new_user = User(
            full_name=full_name,
            email=email,
            password_hash=hashed_pw,
            is_google_user=False,
            created_at=datetime.now(timezone.utc)
        )

        db.session.add(new_user)
        db.session.commit()

        # Log user in automatically and direct to dashboard
        login_user(new_user, remember=True)
        flash(f"Account created successfully! Welcome to Cyber Suraksha, {full_name}.", "success")
        return redirect(url_for('dashboard'))

    return render_template('auth/signup.html', form=form, google_configured=google_configured)


@auth_bp.route('/google')
def google_login():
    """Initiates Google OAuth 2.0 / OpenID Connect authorization redirect."""
    oauth = current_app.extensions.get('authlib.integrations.flask_client')
    client_id = current_app.config.get('GOOGLE_CLIENT_ID', '').strip()
    if not oauth or not client_id or client_id == 'YOUR_GOOGLE_CLIENT_ID_HERE':
        flash("Google OAuth credentials are not configured yet in .env file. Please use email and password to log in.", "warning")
        return redirect(url_for('auth.login'))

    # Google Cloud Console requires exact match: http://localhost:5000/google/callback
    redirect_uri = url_for('auth.google_callback', _external=True)
    if '127.0.0.1' in redirect_uri:
        redirect_uri = redirect_uri.replace('127.0.0.1:5000', 'localhost:5000').replace('127.0.0.1', 'localhost')
    return oauth.google.authorize_redirect(redirect_uri, prompt='select_account')


@auth_bp.route('/google/callback')
@auth_bp.route('/auth/google/callback')
def google_callback():
    """Handles Google OAuth authorization response."""
    oauth = current_app.extensions.get('authlib.integrations.flask_client')
    if not oauth:
        flash("Google OAuth client is not initialized.", "danger")
        return redirect(url_for('auth.login'))

    try:
        token = oauth.google.authorize_access_token()
        user_info = token.get('userinfo')
        if not user_info:
            # Fallback to fetching userinfo endpoint
            resp = oauth.google.get('https://openidconnect.googleapis.com/v1/userinfo')
            user_info = resp.json()

        email = user_info.get('email', '').lower()
        google_id = user_info.get('sub')
        full_name = user_info.get('name', 'Google User')
        picture = user_info.get('picture')

        if not email:
            flash("Unable to obtain verified email address from Google.", "danger")
            return redirect(url_for('auth.login'))

        # Check existing user
        user = User.query.filter_by(email=email).first()
        if user:
            # Link Google ID if not linked
            if not user.google_id:
                user.google_id = google_id
            if picture:
                user.profile_picture = picture
            user.last_login = datetime.now(timezone.utc)
            db.session.commit()
        else:
            # Create new Google-authenticated user
            user = User(
                full_name=full_name,
                email=email,
                is_google_user=True,
                google_id=google_id,
                profile_picture=picture,
                last_login=datetime.now(timezone.utc),
                created_at=datetime.now(timezone.utc)
            )
            db.session.add(user)
            db.session.commit()

        login_user(user, remember=True)
        flash(f"Signed in via Google as {user.full_name}!", "success")
        return redirect(url_for('dashboard'))

    except Exception as e:
        flash(f"Google Sign-In was cancelled or encountered an error: {str(e)}", "danger")
        return redirect(url_for('auth.login'))


@auth_bp.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))

    form = ForgotPasswordForm()
    if form.validate_on_submit():
        email = form.email.data.strip().lower()
        user = User.query.filter_by(email=email).first()
        if user:
            # Store temporary reset authorization in session
            session['reset_email'] = email
            flash("Email verified. Please set your new secure password below.", "info")
            return redirect(url_for('auth.reset_password'))
        else:
            # For security, avoid enumerating accounts or confirm if not found
            flash("If an account exists with that email, a password reset link has been dispatched.", "info")
            return redirect(url_for('auth.login'))

    return render_template('auth/forgot_password.html', form=form)


@auth_bp.route('/reset-password', methods=['GET', 'POST'])
def reset_password():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))

    reset_email = session.get('reset_email')
    if not reset_email:
        flash("Password reset session expired or invalid. Please start again.", "warning")
        return redirect(url_for('auth.forgot_password'))

    form = ResetPasswordForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=reset_email).first()
        if user:
            user.password_hash = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
            user.failed_login_attempts = 0
            user.locked_until = None
            db.session.commit()

            session.pop('reset_email', None)
            flash("Your password has been successfully reset! You may now log in.", "success")
            return redirect(url_for('auth.login'))
        else:
            flash("User account not found.", "danger")
            return redirect(url_for('auth.forgot_password'))

    return render_template('auth/reset_password.html', form=form, email=reset_email)


@auth_bp.route('/logout')
@login_required
def logout():
    user_name = current_user.full_name
    logout_user()
    session.clear()
    flash(f"You have been securely logged out. Thank you for using Cyber Suraksha, {user_name}.", "info")
    response = redirect(url_for('auth.login'))
    remember_cookie = current_app.config.get('REMEMBER_COOKIE_NAME', 'remember_token')
    session_cookie = current_app.config.get('SESSION_COOKIE_NAME', 'session')
    cookie_path = current_app.config.get('REMEMBER_COOKIE_PATH', '/')
    cookie_domain = current_app.config.get('REMEMBER_COOKIE_DOMAIN', None)
    response.delete_cookie(remember_cookie, path=cookie_path, domain=cookie_domain)
    response.delete_cookie(session_cookie, path='/', domain=cookie_domain)
    return response
