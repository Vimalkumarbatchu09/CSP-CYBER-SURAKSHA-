"""
Cyber Suraksha — Template Conversion Script
Converts static HTML pages in old_static_pages/ into protected Jinja2 templates in templates/site/
"""
import os
import re

SOURCE_DIR = 'old_static_pages'
DEST_DIR = 'templates/site'

os.makedirs(DEST_DIR, exist_ok=True)

PAGES = [
    'index.html',
    'about.html',
    'awareness.html',
    'contact.html',
    'dashboard.html',
    'mfa.html',
    'quiz.html',
    'resources.html',
    'threats.html',
    'tools.html'
]

NAV_USER_DROPDOWN = """          <li class="nav-item dropdown ms-lg-2 mt-2 mt-lg-0">
            <a class="btn btn-outline-info btn-sm px-3 py-2 dropdown-toggle d-flex align-items-center gap-2" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-person-circle"></i>
              <span>{{ current_user.full_name.split()[0] if current_user.is_authenticated else 'Account' }}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark bg-dark border-secondary border-opacity-25 shadow">
              <li><h6 class="dropdown-header text-cyan small">{{ current_user.email if current_user.is_authenticated else '' }}</h6></li>
              <li><a class="dropdown-item small" href="{{ url_for('dashboard') }}"><i class="bi bi-speedometer2 me-2"></i> Dashboard</a></li>
              <li><hr class="dropdown-divider border-secondary border-opacity-25"></li>
              <li><a class="dropdown-item text-danger small" href="{{ url_for('auth.logout') }}"><i class="bi bi-box-arrow-right me-2"></i> Secure Logout</a></li>
            </ul>
          </li>"""

FLASH_BLOCK = """
  <!-- Flash Notification Banner -->
  <div class="container" style="margin-top: 5.5rem; margin-bottom: -4.5rem; position: relative; z-index: 1040;">
    {% with messages = get_flashed_messages(with_categories=true) %}
      {% if messages %}
        {% for category, message in messages %}
          <div class="alert alert-{{ category if category != 'error' else 'danger' }} alert-dismissible fade show small d-flex align-items-center gap-2 shadow" role="alert">
            <i class="bi {{ 'bi-check-circle-fill' if category == 'success' else 'bi-info-circle-fill' }}"></i>
            <div>{{ message }}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        {% endfor %}
      {% endif %}
    {% endwith %}
  </div>
"""

def convert_page(filename):
    src_path = os.path.join(SOURCE_DIR, filename)
    dest_path = os.path.join(DEST_DIR, filename)

    if not os.path.exists(src_path):
        print(f"[SKIP] {src_path} not found.")
        return

    with open(src_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update CSS links
    content = content.replace('href="css/accessibility.css"', "href=\"{{ url_for('static', filename='css/accessibility.css') }}\"")
    content = content.replace('href="css/style.css"', "href=\"{{ url_for('static', filename='css/style.css') }}\"")

    # 2. Update JS links
    content = content.replace('src="js/translations.js"', "src=\"{{ url_for('static', filename='js/translations.js') }}\"")
    content = content.replace('src="js/i18n.js"', "src=\"{{ url_for('static', filename='js/i18n.js') }}\"")
    content = content.replace('src="js/visual-stories.js"', "src=\"{{ url_for('static', filename='js/visual-stories.js') }}\"")
    content = content.replace('src="js/script.js"', "src=\"{{ url_for('static', filename='js/script.js') }}\"")

    # 3. Update internal page navigation links
    content = re.sub(r'href="index\.html"', 'href="{{ url_for(\'home\') }}"', content)
    content = re.sub(r'href="about\.html"', 'href="{{ url_for(\'about\') }}"', content)
    content = re.sub(r'href="threats\.html"', 'href="{{ url_for(\'threats\') }}"', content)
    content = re.sub(r'href="tools\.html"', 'href="{{ url_for(\'tools\') }}"', content)
    content = re.sub(r'href="mfa\.html"', 'href="{{ url_for(\'mfa\') }}"', content)
    content = re.sub(r'href="awareness\.html"', 'href="{{ url_for(\'awareness\') }}"', content)
    content = re.sub(r'href="quiz\.html"', 'href="{{ url_for(\'quiz\') }}"', content)
    content = re.sub(r'href="dashboard\.html"', 'href="{{ url_for(\'dashboard\') }}"', content)
    content = re.sub(r'href="resources\.html"', 'href="{{ url_for(\'resources\') }}"', content)
    content = re.sub(r'href="contact\.html"', 'href="{{ url_for(\'contact\') }}"', content)

    # 4. Replace old login button in navbar with User Profile / Logout dropdown
    login_btn_pattern = re.compile(
        r'<li class="nav-item ms-lg-2 mt-2 mt-lg-0">\s*<a href="[^"]*login\.html"[^>]*>.*?</a>\s*</li>',
        re.DOTALL
    )
    if login_btn_pattern.search(content):
        content = login_btn_pattern.sub(NAV_USER_DROPDOWN, content)
    else:
        # Fallback regex
        content = re.sub(
            r'<li class="nav-item ms-lg-2 mt-2 mt-lg-0">\s*<a href="{{ url_for\(\'login\'\) }}".*?</li>',
            NAV_USER_DROPDOWN,
            content,
            flags=re.DOTALL
        )

    # 5. Insert flash block right after </nav>
    if '</nav>' in content:
        content = content.replace('</nav>', '</nav>' + FLASH_BLOCK, 1)

    with open(dest_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"[CONVERTED] {filename} -> {dest_path}")

def main():
    for page in PAGES:
        convert_page(page)
    print("[ALL DONE] All 10 site templates converted successfully.")

if __name__ == '__main__':
    main()
