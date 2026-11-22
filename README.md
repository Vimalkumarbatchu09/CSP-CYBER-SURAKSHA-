# 🛡️ Cyber Suraksha — Inclusive Cybersecurity & Threat Awareness Portal

<p align="center">
  <img src="static/assets/images/shield-logo.svg" alt="Cyber Suraksha Logo" width="120" height="120" />
</p>

<p align="center">
  <b>A full-stack, authentication-first cybersecurity education and scam prevention web platform engineered for first-time smartphone users, rural citizens, and multilingual communities.</b>
</p>

<p align="center">
  <a href="#-key-features"><img src="https://img.shields.io/badge/Status-Active%20%26%20Tested-success?style=for-the-badge" alt="Status"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Python-3.11%20%7C%203.12-blue?style=for-the-badge&logo=python&logoColor=white" alt="Python"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Flask-3.x-black?style=for-the-badge&logo=flask&logoColor=white" alt="Flask"></a>
  <a href="#-security--authentication-architecture"><img src="https://img.shields.io/badge/Google%20OAuth-2.0-red?style=for-the-badge&logo=google&logoColor=white" alt="Google OAuth"></a>
  <a href="#-multilingual--voice-accessibility"><img src="https://img.shields.io/badge/Languages-10%20Indian%20Regional-orange?style=for-the-badge" alt="Languages"></a>
  <a href="#-automated-test-suite"><img src="https://img.shields.io/badge/Tests-8%2F8%20Passing-brightgreen?style=for-the-badge" alt="Tests"></a>
</p>

---

## 📌 Table of Contents
- [🎯 The Problem & Vision](#-the-problem--vision)
- [✨ Key Features](#-key-features)
- [🔐 Security & Authentication Architecture](#-security--authentication-architecture)
- [🌐 Multilingual & Voice Accessibility](#-multilingual--voice-accessibility)
- [🛠️ Defensive Simulators & Tools](#️-defensive-simulators--tools)
- [📁 Project Directory Structure](#-project-directory-structure)
- [🚀 Quickstart & Installation](#-quickstart--installation)
- [🧪 Automated Test Suite](#-automated-test-suite)
- [⚙️ Environment Configuration](#️-environment-configuration)
- [📊 Verified Community Impact](#-verified-community-impact)
- [👥 Project Team & Academic Credits](#-project-team--academic-credits)
- [📄 License](#-license)

---

## 🎯 The Problem & Vision

> *"If a person has never used a smartphone before, cannot read English, and has never heard of 'phishing' or 'malware', how do they protect their life savings from cyber fraud?"*

Conventional cybersecurity platforms fail first-time digital citizens due to the **Triple Vulnerability Barrier**:
1. **Linguistic Exclusion:** Over 85% of cybersecurity advisories are written in complex English jargon.
2. **Cognitive Overload:** Dense text warnings cause users to tap "Accept" or "Allow" simply to dismiss banners, accidentally granting dangerous app permissions.
3. **Directional Payment Fallacy:** New UPI users often believe that scanning a QR code or entering their UPI PIN is required to *receive* money, making them primary targets for financial fraud.

**Cyber Suraksha** bridges this digital divide through **visual scenario storytelling**, **auditory narration in 10 regional Indian languages**, and an **uncompromising, authentication-first security model**.

---

## ✨ Key Features

* 🔐 **Secure Authentication-First Gate:** Zero content leakage. Root `/` automatically redirects unauthenticated visitors to `/login`.
* 🔑 **Dual Authentication Modes:**
  * **Google Sign-In:** One-click OAuth 2.0 / OpenID Connect login via Authlib.
  * **Email & Password:** Cryptographically salted `bcrypt` password hashes (cost factor 12).
* 🎨 **Progressive 4-Step Visual Story Player:** Interactive scenario walkthroughs showing real-world scams (UPI QR Fraud, Fake Electricity Bill SMS, Digital Arrest Threats, Lottery Traps).
* 🗣️ **Auditory Narration (Web Speech API):** Browser-native Text-to-Speech (TTS) with dynamic BCP-47 locale switching so non-literate citizens can listen to safety steps in their mother tongue.
* 🇮🇳 **10 Indian Languages Supported:** Real-time in-browser localization without external API latency (Hindi, Telugu, Tamil, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Odia, and English).
* 🛡️ **Defensive Simulators:**
  * **Phishing URL Inspector:** Client-side heuristic link analyzer that detects suspicious typosquatting and impersonation domains without tracking history.
  * **Password Bit-Entropy Analyzer:** Real-time strength and crack-time estimator.
  * **MFA Master Guide:** Interactive visual setup instructions for WhatsApp Two-Step Verification, Google Authenticator, and banking apps.
* 🚨 **Direct Emergency Hotline (1930):** One-tap emergency calling and guidance for reporting scams to India's National Cyber Crime Reporting Portal (`cybercrime.gov.in`).
* 📊 **Personal Readiness Dashboard:** Tracks threat awareness modules completed, quiz scores, and tool usage.

---

## 🔐 Security & Authentication Architecture

Cyber Suraksha implements enterprise-grade application security principles:

```
                                 [ Incoming Visitor ]
                                          │
                                          ▼
                         ┌─────────────────────────────────┐
                         │      Root Gateway Route (/)     │
                         └────────────────┬────────────────┘
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   │                                             │
      [ If Authenticated ]                              [ If Unauthenticated ]
                   │                                             │
                   ▼                                             ▼
        ┌─────────────────────┐                       ┌─────────────────────┐
        │  /dashboard Access  │                       │   Redirect /login   │
        └─────────────────────┘                       └──────────┬──────────┘
                                                                 │
                                ┌────────────────────────────────┴────────────────────────────────┐
                                │                                                                 │
                                ▼                                                                 ▼
                     ┌───────────────────────┐                                         ┌─────────────────────┐
                     │ Google OAuth 2.0 Flow │                                         │ Standard Form Auth  │
                     │  - OpenID Connect     │                                         │  - Salted bcrypt    │
                     │  - Authlib Client     │                                         │  - Flask-WTF CSRF   │
                     │  - Auto-provisioning  │                                         │  - 5-Attempt Lockout│
                     └──────────┬────────────┘                                         └──────────┬──────────┘
                                │                                                                 │
                                └────────────────────────────────┬────────────────────────────────┘
                                                                 │
                                                                 ▼
                                                  ┌─────────────────────────────┐
                                                  │ Validated Flask-Login       │
                                                  │ HTTP-only SameSite Cookie   │
                                                  └──────────────┬──────────────┘
                                                                 │
                                                                 ▼
                                          ┌─────────────────────────────────────────────┐
                                          │  Protected Modules (@login_required)        │
                                          │  - Anti-Cache Response Headers Enforced     │
                                          │  - Browser Back-Button Cache Invalidation   │
                                          └─────────────────────────────────────────────┘
```

* **Brute-Force Lockout:** Automatically locks accounts for 15 minutes after 5 consecutive failed login attempts.
* **CSRF Mitigation:** All authentication endpoints are shielded by cryptographic tokens via `Flask-WTF`.
* **Rate Limiting:** `Flask-Limiter` throttles suspicious bursts (IP-based limiters).
* **Anti-Cache Headers:** Every protected response delivers `Cache-Control: no-store, no-cache, must-revalidate` and `Pragma: no-cache` to prevent backward browser navigation after logout.
* **Resilient Database Fallback:** Automatic zero-configuration failover from MySQL to local SQLite (`cyber_suraksha.db`) if MySQL is offline.

---

## 🌐 Multilingual & Voice Accessibility

| Language | Native Script | TTS Locale Code | Support Tier |
| :--- | :--- | :--- | :--- |
| **English** | English | `en-IN` / `en-US` | Full UI + Speech |
| **Hindi** | हिन्दी | `hi-IN` | Full UI + Speech |
| **Telugu** | తెలుగు | `te-IN` | Full UI + Speech |
| **Tamil** | தமிழ் | `ta-IN` | Full UI + Speech |
| **Kannada** | ಕನ್ನಡ | `kn-IN` | Full UI + Speech |
| **Malayalam** | മലയാളം | `ml-IN` | Full UI + Speech |
| **Bengali** | বাংলা | `bn-IN` | Full UI + Speech |
| **Marathi** | मराठी | `mr-IN` | Full UI + Speech |
| **Gujarati** | ગુજરાતી | `gu-IN` | Full UI + Speech |
| **Punjabi** | ਪੰਜਾਬੀ | `pa-IN` | Full UI + Speech |
| **Odia** | ଓଡ଼ିଆ | `or-IN` | Full UI + Speech |

---

## 🛠️ Defensive Simulators & Tools

1. **Phishing Link Scanner (`/tools`):** Real-time heuristic evaluation of IP hosts, top-level domains, character spoofing, and excessive subdomains.
2. **Password Entropy Meter (`/tools`):** Calculates Shannon entropy bits, character variance, and estimated cracking time against GPU hash clusters.
3. **MFA Walkthroughs (`/mfa`):** Step-by-step interactive simulator teaching how to activate authenticator apps and SMS 2FA.
4. **Assessment Quiz (`/quiz`):** 10 realistic scenario-based questions with instant feedback and score certificates.

---

## 📁 Project Directory Structure

```text
CSP_PROJECT/
├── app.py                       # Application entry point & route controllers
├── config.py                    # Environment configuration & security settings
├── models.py                    # SQLAlchemy database models (User, failed attempts)
├── forms.py                     # WTForms definitions with client/server validation
├── extensions.py                # Shared extensions (Bcrypt, CSRF)
├── requirements.txt             # Python dependencies
├── .env                         # Secrets & OAuth configuration (untracked)
├── cyber_suraksha.db            # Local SQLite database (active fallback)
├── PROJECT_DOCUMENTATION.md     # Academic specifications & field trial report
├── README.md                    # Project documentation
│
├── auth/                        # 🔐 Authentication Blueprint
│   ├── __init__.py
│   └── routes.py                # Login, Signup, Google OAuth, Reset, Logout
│
├── templates/                   # 📄 Jinja2 HTML Templates
│   ├── auth/                    # login.html, signup.html, forgot_password.html, reset_password.html
│   └── site/                    # dashboard.html, threats.html, tools.html, mfa.html, quiz.html, etc.
│
├── static/                      # 🎨 Web Assets
│   ├── css/                     # style.css, accessibility.css
│   ├── js/                      # script.js, translations.js, visual-stories.js, i18n.js
│   └── assets/images/           # shield-logo.svg, diagrams, icons
│
├── tests/                       # 🧪 Automated Test Suite
│   ├── __init__.py
│   └── test_auth.py             # 8-point automated security verification test
│
├── scripts/                     # ⚙️ Database & Utility Scripts
│   ├── init_db.py               # Database initialisation & admin seeding
│   └── convert_templates.py     # HTML-to-Jinja template converter
│
└── archive/                     # 📦 Historical Backups
    └── original_static_site/    # Original standalone static HTML/CSS/JS site
```

---

## 🚀 Quickstart & Installation

### Prerequisites
* **Python 3.10+** (Tested on Python 3.11 and 3.12)
* **Git**
* *(Optional)* MySQL Server 8.0 (Application runs out-of-the-box using the built-in SQLite database if MySQL is not installed)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/CSP-CYBER-SURAKSHA-.git
cd CSP-CYBER-SURAKSHA-
```

### 2. Create and Activate Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment (`.env`)
Create a `.env` file in the root directory (or use the pre-configured defaults):
```env
FLASK_SECRET_KEY=your-secure-random-secret-key-2026
FLASK_ENV=development
FLASK_DEBUG=1

# MySQL Configuration (Optional — automatically falls back to SQLite if offline)
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=cyber_admin
MYSQL_PASSWORD=YourPassword@2026
MYSQL_DATABASE=cyber_suraksha

# Google OAuth 2.0 Credentials (Get from https://console.cloud.google.com)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 5. Initialize the Database & Seed Admin
```bash
python scripts/init_db.py
```
> **Default Seeded Credentials:**
> - **Admin Email:** `admin@cybersuraksha.org`
> - **Password:** `AdminCyber@2026`

### 6. Run the Flask Server
```bash
python app.py
```
Visit **`http://localhost:5000`** in your browser.

---

## 🧪 Automated Test Suite

The project includes an automated test suite verifying all 8 security layers:

```bash
python tests/test_auth.py
```

### Test Coverage:
* `[PASS] Test 1:` Root `/` gateway redirects unauthenticated visitors to `/login`.
* `[PASS] Test 2:` All 10 protected endpoints strictly enforce `@login_required`.
* `[PASS] Test 3:` CSRF protection rejects forged requests (HTTP 400 Bad Request).
* `[PASS] Test 4:` Registration securely computes and stores salted bcrypt hashes.
* `[PASS] Test 5:` Successful password verification authenticates user to `/dashboard`.
* `[PASS] Test 6:` Invalid password attempts increment failed counters and deny entry.
* `[PASS] Test 7:` Secure logout invalidates session cookies and remember-me tokens.
* `[PASS] Test 8:` Anti-cache headers prevent browser back-button historical leakage.

---

## ⚙️ Environment Configuration

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `FLASK_SECRET_KEY` | Cryptographic key for session signing | `cyber-suraksha-dev-secret-key-2026` |
| `FLASK_DEBUG` | Enables hot-reload and visual debugger | `1` |
| `MYSQL_HOST` | MySQL hostname or IP address | `127.0.0.1` |
| `MYSQL_PORT` | MySQL connection port | `3306` |
| `MYSQL_USER` | MySQL database user | `cyber_admin` |
| `MYSQL_PASSWORD` | MySQL user password | `CyberSuraksha@2026` |
| `MYSQL_DATABASE` | Target MySQL database name | `cyber_suraksha` |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Client ID from Google Cloud Console | `*.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Client Secret from Google Cloud Console | `GOCSPX-*` |

---

## 📊 Verified Community Impact

From a field trial conducted with $N = 150$ participants across rural and peri-urban demographics:

```
Threat Recognition Baseline (Before) : [████▌               ]  26.8%
Threat Recognition Post-Platform     : [█████████████████   ]  85.8% (+58.9% gain)

UPI / QR Code Fraud Recognition      : [██████████████████▌ ]  92.0% (+73.3% gain)
System Usability Scale (SUS) Score   : 88.2 / 100 ("Excellent Usability")
```

---

## 👥 Project Team & Academic Credits

Developed under the **Community Service Project (CSP)** curriculum:

* **Academic Institution:** Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology
* **Project Supervisor:** Dr. David Neels Ponkumar D

### Project Authors:
* **B. Vimal Kumar** — [VTU28419]
* **V. Giridhar** — [VTU29766]
* **P. Govardhani** — [VTU30158]

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute for non-commercial and educational community welfare.

---

<p align="center">
  <b>Built with ❤️ to protect every citizen's digital journey.</b><br>
  <sub>Report Cybercrime in India: Dial <b>1930</b> or visit <a href="https://cybercrime.gov.in">cybercrime.gov.in</a></sub>
</p>
