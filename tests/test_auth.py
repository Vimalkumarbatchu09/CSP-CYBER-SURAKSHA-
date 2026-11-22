"""
Cyber Suraksha — Automated Authentication & Access Control Verification Test
"""
import sys
import os

# Ensure parent directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, db, bcrypt
from models import User

def run_tests():
    print("=" * 60)
    print("RUNNING CYBER SURAKSHA AUTHENTICATION & SECURITY TESTS")
    print("=" * 60)

    # ---------------------------------------------------------
    # TEST 1: Root Gateway Redirection (Authentication First)
    # ---------------------------------------------------------
    client = app.test_client()
    res = client.get('/', follow_redirects=False)
    assert res.status_code == 302, f"Expected 302 redirect from '/', got {res.status_code}"
    assert '/login' in res.location, f"Expected redirect to /login, got {res.location}"
    print("[PASS] Test 1: Root '/' redirects unauthenticated visitors directly to /login.")

    # ---------------------------------------------------------
    # TEST 2: Protected Pages Access Control
    # ---------------------------------------------------------
    protected_endpoints = [
        '/dashboard', '/home', '/threats', '/tools', '/mfa',
        '/awareness', '/quiz', '/resources', '/contact', '/about'
    ]
    for endpoint in protected_endpoints:
        res = client.get(endpoint, follow_redirects=False)
        assert res.status_code == 302, f"Endpoint {endpoint} allowed unauthenticated access! Status: {res.status_code}"
        assert '/login' in res.location, f"Endpoint {endpoint} did not redirect to /login"
    print(f"[PASS] Test 2: All {len(protected_endpoints)} protected content routes strictly require authentication.")

    # ---------------------------------------------------------
    # TEST 3: CSRF Protection Defense
    # ---------------------------------------------------------
    # Attempting POST without CSRF token must trigger 400 Bad Request
    csrf_reject = client.post('/login', data={'email': 'any@test.com', 'password': '123'})
    assert csrf_reject.status_code == 400, f"Expected 400 CSRF rejection, got {csrf_reject.status_code}"
    print("[PASS] Test 3: CSRF protection verified: unauthorized POST requests without token rejected with 400.")

    # ---------------------------------------------------------
    # TEST 4: User Registration with Hashing (CSRF bypassed for test client)
    # ---------------------------------------------------------
    app.config['WTF_CSRF_ENABLED'] = False
    test_client = app.test_client()

    with app.app_context():
        # Clean test user if exists
        test_email = "citizen@cybersuraksha.org"
        existing = User.query.filter_by(email=test_email).first()
        if existing:
            db.session.delete(existing)
            db.session.commit()

        # Signup POST request
        signup_res = test_client.post('/signup', data={
            'full_name': 'Rahul Verma',
            'email': test_email,
            'password': 'SecureCitizen@2026',
            'confirm_password': 'SecureCitizen@2026',
            'terms': 'y'
        }, follow_redirects=False)

        assert signup_res.status_code == 302, f"Signup failed with status {signup_res.status_code}"
        assert '/dashboard' in signup_res.location, f"Signup did not redirect to dashboard, got {signup_res.location}"

        # Verify user created in DB with salted hash (not plaintext!)
        created_user = User.query.filter_by(email=test_email).first()
        assert created_user is not None, "User not found in database!"
        assert created_user.password_hash != 'SecureCitizen@2026', "Password stored in plaintext!"
        assert bcrypt.check_password_hash(created_user.password_hash, 'SecureCitizen@2026'), "Password hash verification failed!"
    print("[PASS] Test 4: New user registration succeeds and stores salted bcrypt hash.")

    # ---------------------------------------------------------
    # TEST 5: Login with Valid Credentials
    # ---------------------------------------------------------
    login_client = app.test_client()
    login_res = login_client.post('/login', data={
        'email': 'admin@cybersuraksha.org',
        'password': 'AdminCyber@2026',
        'remember_me': 'y'
    }, follow_redirects=False)
    assert login_res.status_code == 302, f"Login failed with status {login_res.status_code}"
    assert '/dashboard' in login_res.location, f"Login did not redirect to dashboard, got {login_res.location}"

    # Verify authenticated user can now access dashboard
    dash_res = login_client.get('/dashboard')
    assert dash_res.status_code == 200, f"Authenticated user could not access dashboard! Status: {dash_res.status_code}"
    assert b"Cyber Suraksha" in dash_res.data
    print("[PASS] Test 5: Valid authentication logs in and grants access to Dashboard.")

    # ---------------------------------------------------------
    # TEST 6: Login with Wrong Password
    # ---------------------------------------------------------
    bad_client = app.test_client()
    bad_res = bad_client.post('/login', data={
        'email': 'admin@cybersuraksha.org',
        'password': 'WrongPassword123'
    }, follow_redirects=True)
    assert b"Invalid email or password" in bad_res.data
    print("[PASS] Test 6: Invalid password rejected with security warning.")

    # ---------------------------------------------------------
    # TEST 7: Logout & Session Invalidation
    # ---------------------------------------------------------
    logout_res = login_client.get('/logout', follow_redirects=False)
    assert logout_res.status_code == 302
    assert '/login' in logout_res.location

    # Attempting to re-enter dashboard after logout
    dash_after_logout = login_client.get('/dashboard', follow_redirects=False)
    assert dash_after_logout.status_code == 302, "Dashboard still accessible after logout!"
    assert '/login' in dash_after_logout.location
    print("[PASS] Test 7: Secure logout invalidates session and revokes access to internal content.")

    # ---------------------------------------------------------
    # TEST 8: Anti-Cache Security Headers
    # ---------------------------------------------------------
    test_headers = client.get('/login')
    assert 'no-store' in test_headers.headers.get('Cache-Control', ''), "Missing no-store in Cache-Control"
    assert test_headers.headers.get('Pragma') == 'no-cache', "Missing Pragma: no-cache"
    assert test_headers.headers.get('X-Frame-Options') == 'SAMEORIGIN', "Missing X-Frame-Options"
    print("[PASS] Test 8: Anti-cache and security headers prevent browser back-navigation leakage.")

    # Reset config
    app.config['WTF_CSRF_ENABLED'] = True

    print("=" * 60)
    print("ALL 8 CYBER SURAKSHA SECURITY & ACCESS TESTS PASSED!")
    print("=" * 60)

if __name__ == '__main__':
    run_tests()
