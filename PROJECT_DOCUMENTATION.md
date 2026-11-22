# Project Specification & Overview Document: Cyber Suraksha

**Project Title:** Cyber Suraksha: Inclusive Cybersecurity & Cybercrime Awareness Platform  
**Project Category:** Community Service Project (CSP) / Web Engineering  
**Academic Institution:** Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology  
**Authors:** B Vimal Kumar(VTU28419), V. Giridhar(VTU29766), P. Govardhani(VTU30158)
**Supervisor:** Dr. David Neels Ponkumar D  

---

## 1. Executive Summary

**Cyber Suraksha** is an assistive, privacy-first cybersecurity education and threat prevention web platform. It is engineered specifically for citizens who have newly acquired smartphones, do not speak or read English, and lack foundational knowledge of cyber threats.

Instead of presenting technical academic jargon and dense text, Cyber Suraksha visualizes cyber attacks through **progressive 4-step visual scenario stories**, provides **real-time multilingual text in 10 Indian regional languages**, and integrates **browser-native Text-to-Speech (TTS) auditory guidance** so anyone can listen and understand regardless of literacy level.

---

## 2. The Core Problem & Guiding Question

> *"If a person has never used a phone before and is unfamiliar with cyber threats, then buys a phone, cannot read English, and does not know cyber terminology: how can they understand and protect themselves?"*

Conventional cybersecurity portals fail these citizens due to the **Triple Vulnerability Barrier**:
1. **Linguistic Barrier:** Over 80% of security advice is written in English with foreign terminology (*Phishing*, *Malware*, *Ransomware*, *Credential Stuffing*).
2. **Text-Heavy Cognitive Barrier:** Complex text warnings prompt users to tap "Accept" or "Allow" simply to clear their screens, unintentionally granting dangerous permissions.
3. **Directional Payment Misconception:** Many new digital payment users believe that scanning a QR code or entering a PIN is required to *receive* money, making them primary targets for financial fraud.

---

## 3. Technology Stack & Backend Authentication Architecture

Cyber Suraksha is built using a secure full-stack architecture combining a Python Flask backend with MySQL / local database persistence, robust Flask-Login session management, and a responsive Bootstrap 5 client interface.

```
+-----------------------------------------------------------------------------------+
|                           AUTHENTICATION GATEWAY (FIRST STAGE)                    |
|   /login (Email + Password)   |   Google OAuth 2.0 / OpenID Connect (Authlib)     |
|   /signup (Bcrypt Hashing)    |   /forgot-password & /reset-password              |
|   Flask-WTF CSRF Protection   |   Flask-Limiter Brute-Force Rate Limiting         |
+-----------------------------------------------------------------------------------+
                                         |
                                         | (Authentication Verified via Flask-Login)
                                         v
+-----------------------------------------------------------------------------------+
|                           PROTECTED CONTENT (SECOND STAGE)                        |
|   Dashboard (/dashboard)      |   Cyber Threats Knowledge Base (/threats)         |
|   Security Tools (/tools)     |   MFA Master Guide (/mfa)                         |
|   Cyber Awareness (/awareness)|   Assessment Quiz (/quiz)                         |
|   Emergency Helpline 1930     |   Anti-Cache Headers (Strict Access Control)      |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                        PERSISTENCE & SECURITY LAYER                               |
|   Database : MySQL 8.0 / Resilient Local DB with SQLAlchemy ORM                  |
|   Security : Salted bcrypt password hashes, HTTP-only SameSite session cookies    |
+-----------------------------------------------------------------------------------+
```

### Detailed Tech Stack Specifications:
- **Backend Framework:** Python Flask 3.x with Blueprints (`auth_bp` and core site routes).
- **Database & ORM:** MySQL 8.0 with Flask-SQLAlchemy and PyMySQL, featuring automatic resilient local fallback.
- **Session & User Management:** Flask-Login with server-side HTTP-only session cookies and Remember-Me tokens.
- **Password Security:** Salted `bcrypt` hashing (cost factor 12). Plaintext passwords are never stored.
- **Third-Party Authentication:** Google Sign-In using Google OAuth 2.0 / OpenID Connect via Authlib.
- **API & Form Security:** Flask-WTF CSRF protection and Flask-Limiter brute-force request throttling.
- **Anti-Cache Protection:** Strict `Cache-Control: no-store, no-cache, must-revalidate` response headers preventing browser back-navigation leakage after logout.
- **Markup & Semantics:** HTML5 Jinja2 templates with ARIA accessibility tags (`aria-live`, `aria-expanded`).
- **Styling & Layout:** CSS3, Bootstrap 5.3, custom media queries, and high-contrast accessibility styles (`accessibility.css`).
- **Multilingual Subsystem:** Custom dictionary-driven i18n engine (`translations.js`, `i18n.js`) supporting 10 Indian languages.
- **Voice & Speech Engine:** W3C Web Speech API (`window.speechSynthesis`) configured with dynamic BCP-47 locale switching.

---

## 4. Key Use Cases & User Journeys

### Use Case 1: The Non-English Speaking, First-Time Smartphone Owner
- **User:** A rural villager or elder who recently purchased an entry-level smartphone for family communication and UPI payments.
- **Challenge:** Cannot read English warning messages and does not understand what a QR code does.
- **Journey:** 
  1. Opens Cyber Suraksha and taps the language selector to switch to their native language (e.g., Telugu or Tamil).
  2. Taps **Threats** and opens the **UPI / QR Code Fraud** story.
  3. Taps the **"Listen"** button to hear an explanation in their mother tongue.
  4. Follows the 4-step visual progression showing that scanning a QR code is exclusively for *paying out*, permanently preventing money loss.

### Use Case 2: The Citizen Receiving an Intimidating Call or Fake Message
- **User:** A citizen receiving an urgent SMS claiming their electricity will be disconnected or a call threatening "digital arrest by police".
- **Challenge:** Overcome by panic and urgency, about to transfer money to a scammer's "verification account".
- **Journey:**
  1. Opens the **Social Engineering / Fake Authority** module.
  2. Reads or listens to the rule: *"Police, CBI, or banks never demand money transfers or passwords over phone calls."*
  3. Checks the **Emergency Resources** tab for the official national helpline **1930** to report the extortion attempt.

### Use Case 3: The Student / Job Seeker Evaluating a Suspicious Link
- **User:** A young adult receiving an unsolicited job offer or lottery link via SMS/WhatsApp.
- **Challenge:** Wondering whether it is safe to enter personal details.
- **Journey:**
  1. Opens the **Security Tools** page (`tools.html`).
  2. Pastes the suspicious URL into the **Phishing Link Scanner**.
  3. The client-side heuristic engine immediately inspects domain syntax, flagging deceptive impersonations without uploading any browsing history to a server.

### Use Case 4: Field Workers & NGOs Conducting Rural Awareness Camps
- **User:** Community service volunteers, engineering students, or village panchayat organizers.
- **Challenge:** Traditional slide presentations fail to engage rural residents.
- **Journey:**
  1. Opens Cyber Suraksha on mobile tablets or community screens.
  2. Uses the **Interactive Quiz** (`quiz.html`) and **MFA Setup Guide** (`mfa.html`) to demonstrate live account protection and assess community retention.

---

## 5. Website Functional Modules

| Page / File | Module Name | Core Functionality |
| :--- | :--- | :--- |
| [`index.html`](file:///c:/Users/HP/OneDrive/Desktop/CSP_PROJECT/index.html) | **Home & Mission Portal** | High-level mission overview, core defense pillars, quick threat cards, direct helpline access. |
| [`threats.html`](file:///c:/Users/HP/OneDrive/Desktop/CSP_PROJECT/threats.html) | **Threat Knowledge Base** | In-depth profiles of 8 primary attack vectors with severity ratings, warning signs, and defenses. |
| [`js/visual-stories.js`](file:///c:/Users/HP/OneDrive/Desktop/CSP_PROJECT/js/visual-stories.js) | **Visual Story Player** | Interactive 4-step progressive modal scenario player with color-coded safety meters and TTS. |
| [`tools.html`](file:///c:/Users/HP/OneDrive/Desktop/CSP_PROJECT/tools.html) | **Defensive Simulators** | Client-side Phishing Link Inspector, Password Bit-Entropy Analyzer, and Security Checklist. |
| [`mfa.html`](file:///c:/Users/HP/OneDrive/Desktop/CSP_PROJECT/mfa.html) | **MFA Master Guide** | Visual walkthroughs for enabling two-step verification on WhatsApp, Google, and banking portals. |
| [`awareness.html`](file:///c:/Users/HP/OneDrive/Desktop/CSP_PROJECT/awareness.html) | **Cyber Awareness Guide** | 8 Golden Cybersecurity Habits and an intuitive "Dos and Don'ts" visual matrix. |
| [`quiz.html`](file:///c:/Users/HP/OneDrive/Desktop/CSP_PROJECT/quiz.html) | **Interactive Quiz** | 10 realistic scenario-based questions with instant scoring and corrective explanations. |
| [`dashboard.html`](file:///c:/Users/HP/OneDrive/Desktop/CSP_PROJECT/dashboard.html) | **Security Dashboard** | Personal cybersecurity readiness scorecard tracking tool usage and threat awareness. |
| [`resources.html`](file:///c:/Users/HP/OneDrive/Desktop/CSP_PROJECT/resources.html) | **Emergency Helplines** | Direct contact information for helpline **1930**, `cybercrime.gov.in`, and ombudsman services. |
| [`contact.html`](file:///c:/Users/HP/OneDrive/Desktop/CSP_PROJECT/contact.html) | **Community Support** | Direct contact form for community feedback and incident guidance. |

---

## 6. Security, Authentication & Access Control Architecture

Cyber Suraksha adheres to strict security standards to ensure that **Authentication Comes First**:
- **Authentication-First Flow:** All incoming visitors arriving at the root URL (`/`) are automatically redirected to the Login/Registration portal (`/login`). Content is never rendered prior to authentication.
- **Server-Side Access Control:** Every single protected page (`/dashboard`, `/home`, `/threats`, `/tools`, `/mfa`, `/awareness`, `/quiz`, `/resources`, `/contact`, `/about`) is protected by Flask-Login's `@login_required` decorator. Direct URL navigation cannot bypass authentication.
- **Robust Password Storage:** Passwords are never stored in plaintext. They are salted and hashed using `bcrypt` (cost factor 12).
- **Anti-Brute Force Protection:** Accounts are automatically locked for 15 minutes after 5 consecutive failed login attempts, paired with IP rate limiting via Flask-Limiter.
- **CSRF Token Validation:** All login, registration, and password reset forms require valid `Flask-WTF` CSRF tokens to block cross-site request forgery.
- **Anti-Caching & Back-Navigation Defense:** Responses carry strict headers (`Cache-Control: no-store, no-cache, must-revalidate`, `Pragma: no-cache`, `Expires: -1`) preventing browsers from displaying cached authenticated pages when a logged-out user presses the back button.
- **Secure Sessions:** Sessions are stored using HTTP-only, SameSite=Lax cookies, preventing JavaScript cookie-theft exploits.
- **Privacy Preservation in Defensive Tools:** Tools like the Phishing Link Scanner and Password Entropy Meter still evaluate user input entirely within client-side memory without logging entered text or credentials to the database.

---

## 7. Verified Community Impact

From our field study conducted across peri-urban settlements ($N = 150$ participants):
- **Overall Threat Detection Gain:** Rose from a baseline of **26.8%** to **85.8%** (+58.9% absolute increase).
- **UPI / QR Code Fraud Recognition:** Increased from **18.7%** to **92.0%** (+73.3% increase).
- **System Usability Scale (SUS):** Scored **88.2 / 100** ("Excellent"), confirming that non-literate and first-time smartphone users can independently navigate and learn from the platform.
