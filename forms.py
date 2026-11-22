"""
Cyber Suraksha — WTForms Validation
"""
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired, Email, Length, EqualTo, ValidationError
from models import User


class LoginForm(FlaskForm):
    email = StringField('Email Address', validators=[
        DataRequired(message="Email address is required."),
        Email(message="Please enter a valid email address.")
    ])
    password = PasswordField('Password', validators=[
        DataRequired(message="Password is required.")
    ])
    remember_me = BooleanField('Remember this device for 30 days')
    submit = SubmitField('Login to Dashboard')


class SignupForm(FlaskForm):
    full_name = StringField('Full Name', validators=[
        DataRequired(message="Full name is required."),
        Length(min=2, max=100, message="Full name must be between 2 and 100 characters.")
    ])
    email = StringField('Email Address', validators=[
        DataRequired(message="Email address is required."),
        Email(message="Please enter a valid email address."),
        Length(max=150, message="Email must be less than 150 characters.")
    ])
    password = PasswordField('Password', validators=[
        DataRequired(message="Password is required."),
        Length(min=8, message="Password must be at least 8 characters long.")
    ])
    confirm_password = PasswordField('Confirm Password', validators=[
        DataRequired(message="Please confirm your password."),
        EqualTo('password', message="Passwords must match.")
    ])
    terms = BooleanField('I agree to the Terms and Privacy Policy', validators=[
        DataRequired(message="You must agree to the Terms and Privacy Policy to register.")
    ])
    submit = SubmitField('Register Account')

    def validate_email(self, email):
        existing_user = User.query.filter_by(email=email.data.strip().lower()).first()
        if existing_user:
            raise ValidationError("An account with this email already exists. Please log in.")


class ForgotPasswordForm(FlaskForm):
    email = StringField('Registered Email Address', validators=[
        DataRequired(message="Please enter your registered email address."),
        Email(message="Please enter a valid email address.")
    ])
    submit = SubmitField('Send Password Reset Link')


class ResetPasswordForm(FlaskForm):
    password = PasswordField('New Password', validators=[
        DataRequired(message="New password is required."),
        Length(min=8, message="Password must be at least 8 characters long.")
    ])
    confirm_password = PasswordField('Confirm New Password', validators=[
        DataRequired(message="Please confirm your password."),
        EqualTo('password', message="Passwords must match.")
    ])
    submit = SubmitField('Update Password')
