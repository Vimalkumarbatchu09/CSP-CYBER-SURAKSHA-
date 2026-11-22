/**
 * ==========================================================================
 * CYBER SURAKSHA — Internationalization (i18n) Engine
 * Native Multi-Language Localization (English, Hindi, Telugu, Tamil)
 * Fast client-side translation with clear abbreviation selectors
 * ==========================================================================
 */

(function () {
  'use strict';

  /* ======================================================================
     CONFIGURATION — 4 Primary Regional Languages with Clear Abbreviations
     ====================================================================== */
  const SUPPORTED_LANGUAGES = [
    { code: 'en', abbr: 'EN', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'hi', abbr: 'HI', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'te', abbr: 'TE', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', abbr: 'TA', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' }
  ];

  const STORAGE_KEY = 'cyber_suraksha_language';
  let currentLang = 'en';

  /* ======================================================================
     INITIALIZATION
     ====================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
      currentLang = saved;
    } else {
      currentLang = 'en';
    }

    // 1. Create top navbar language selector with clear abbreviations in the starting
    createNavbarLanguageSwitcher();

    // 2. Create floating language switcher with clear abbreviation badges
    createFloatingLanguageSelector();

    // 3. Apply translations to all DOM elements
    applyTranslations(currentLang);
    updateSelectorUI(currentLang);
  });

  /* ======================================================================
     TOP NAVBAR LANGUAGE SWITCHER — Prominent Segmented Control at Starting
     ====================================================================== */
  function createNavbarLanguageSwitcher() {
    const navList = document.querySelector('.navbar .navbar-nav');
    if (!navList || document.getElementById('navLangSwitcherItem')) return;

    const navItem = document.createElement('li');
    navItem.id = 'navLangSwitcherItem';
    navItem.className = 'nav-item d-flex align-items-center ms-lg-2 my-2 my-lg-0';

    const pillGroup = document.createElement('div');
    pillGroup.className = 'nav-lang-pill-group';
    pillGroup.setAttribute('role', 'group');
    pillGroup.setAttribute('aria-label', 'Language Switcher');

    SUPPORTED_LANGUAGES.forEach(lang => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `nav-lang-pill ${lang.code === currentLang ? 'active' : ''}`;
      pill.setAttribute('data-lang', lang.code);
      pill.setAttribute('title', `${lang.abbr} — ${lang.nativeName} (${lang.name})`);
      pill.innerHTML = `
        <span class="nav-lang-abbr">${lang.abbr}</span>
        <span class="nav-lang-label d-none d-xl-inline ms-1">${lang.name}</span>
      `;

      pill.addEventListener('click', (e) => {
        e.preventDefault();
        switchLanguage(lang.code);
      });

      pillGroup.appendChild(pill);
    });

    navItem.appendChild(pillGroup);

    // Insert right before account dropdown or at the end
    const accountDropdown = navList.querySelector('.dropdown');
    if (accountDropdown) {
      navList.insertBefore(navItem, accountDropdown);
    } else {
      navList.appendChild(navItem);
    }
  }

  /* ======================================================================
     FLOATING LANGUAGE SELECTOR — With Clear Abbreviations at the Starting
     ====================================================================== */
  function createFloatingLanguageSelector() {
    if (document.getElementById('langSelectorContainer')) return;

    const container = document.createElement('div');
    container.id = 'langSelectorContainer';
    container.className = 'lang-selector-container';

    // Main toggle button displaying current language abbreviation
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'langToggleBtn';
    toggleBtn.className = 'lang-toggle-btn';
    toggleBtn.setAttribute('aria-label', 'Select Language');
    toggleBtn.setAttribute('title', 'Change Language / भाषा बदलें / భాష మార్చండి / மொழியை மாற்றவும்');

    const currentLangData = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];
    toggleBtn.innerHTML = `
      <i class="bi bi-translate"></i>
      <span class="lang-toggle-abbr-badge">${currentLangData.abbr}</span>
      <span class="lang-toggle-label">${currentLangData.nativeName}</span>
    `;

    // Dropdown panel
    const dropdown = document.createElement('div');
    dropdown.id = 'langDropdown';
    dropdown.className = 'lang-dropdown';

    // Header
    const header = document.createElement('div');
    header.className = 'lang-dropdown-header';
    header.innerHTML = `
      <i class="bi bi-globe2 text-cyan"></i>
      <span data-i18n="lang_select">Select Language</span>
    `;
    dropdown.appendChild(header);

    // Language list / grid with clear abbreviations in starting
    const grid = document.createElement('div');
    grid.className = 'lang-grid';

    SUPPORTED_LANGUAGES.forEach(lang => {
      const langBtn = document.createElement('button');
      langBtn.className = `lang-option ${lang.code === currentLang ? 'active' : ''}`;
      langBtn.setAttribute('data-lang', lang.code);
      langBtn.innerHTML = `
        <span class="lang-abbr-tag">${lang.abbr}</span>
        <div class="lang-info">
          <span class="lang-native">${lang.nativeName}</span>
          <span class="lang-english">${lang.name}</span>
        </div>
        ${lang.code === currentLang ? '<i class="bi bi-check-circle-fill lang-check"></i>' : ''}
      `;

      langBtn.addEventListener('click', () => {
        switchLanguage(lang.code);
        closeDropdown();
      });

      grid.appendChild(langBtn);
    });

    dropdown.appendChild(grid);

    // Assemble
    container.appendChild(dropdown);
    container.appendChild(toggleBtn);
    document.body.appendChild(container);

    // Toggle dropdown
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
      container.classList.toggle('expanded');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        closeDropdown();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDropdown();
    });

    function closeDropdown() {
      dropdown.classList.remove('open');
      container.classList.remove('expanded');
    }
  }

  /* ======================================================================
     LANGUAGE SWITCHING — Apply Translations to DOM
     ====================================================================== */
  function switchLanguage(langCode) {
    if (!SUPPORTED_LANGUAGES.some(l => l.code === langCode)) return;
    currentLang = langCode;
    localStorage.setItem(STORAGE_KEY, langCode);
    applyTranslations(langCode);
    updateSelectorUI(langCode);

    // Re-render visual stories if present
    if (typeof initVisualStories === 'function') {
      initVisualStories();
    }
  }

  function applyTranslations(lang) {
    if (typeof TRANSLATIONS === 'undefined') return;
    const langData = TRANSLATIONS[lang];
    if (!langData) return;

    // Find all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (langData[key]) {
        // Check if element has child elements we shouldn't overwrite
        const hasIconChild = el.querySelector('i, svg, .bi');
        if (hasIconChild && el.childNodes.length > 1) {
          const textNodes = Array.from(el.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
          if (textNodes.length > 0) {
            textNodes[textNodes.length - 1].textContent = ' ' + langData[key];
          }
        } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.setAttribute('placeholder', langData[key]);
        } else {
          el.textContent = langData[key];
        }
      }
    });

    // Update data-i18n-html (for elements needing innerHTML)
    const htmlElements = document.querySelectorAll('[data-i18n-html]');
    htmlElements.forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (langData[key]) {
        el.innerHTML = langData[key];
      }
    });

    // Update document language attribute
    document.documentElement.lang = lang;
  }

  function updateSelectorUI(langCode) {
    const langData = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    if (!langData) return;

    // 1. Update Navbar pills active state
    document.querySelectorAll('.nav-lang-pill').forEach(pill => {
      const code = pill.getAttribute('data-lang');
      pill.classList.toggle('active', code === langCode);
    });

    // 2. Update floating toggle button abbreviation badge & label
    const toggleAbbr = document.querySelector('.lang-toggle-abbr-badge');
    if (toggleAbbr) toggleAbbr.textContent = langData.abbr;

    const toggleLabel = document.querySelector('.lang-toggle-label');
    if (toggleLabel) toggleLabel.textContent = langData.nativeName;

    // 3. Update active state in floating dropdown
    const options = document.querySelectorAll('.lang-option');
    options.forEach(opt => {
      const code = opt.getAttribute('data-lang');
      const isActive = (code === langCode);
      opt.classList.toggle('active', isActive);

      const existingCheck = opt.querySelector('.lang-check');
      if (isActive && !existingCheck) {
        const check = document.createElement('i');
        check.className = 'bi bi-check-circle-fill lang-check';
        opt.appendChild(check);
      } else if (!isActive && existingCheck) {
        existingCheck.remove();
      }
    });
  }

  /* ======================================================================
     UTILITY — Get Translation Helper
     ====================================================================== */
  function getTranslation(key) {
    if (typeof TRANSLATIONS === 'undefined') return null;
    const langData = TRANSLATIONS[currentLang];
    if (langData && langData[key]) return langData[key];
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) return TRANSLATIONS.en[key];
    return null;
  }

  // Safe global exports (with clean no-op stubs for speech methods)
  window.CyberI18n = {
    getCurrentLang: () => currentLang,
    getTranslation: getTranslation,
    switchLanguage: switchLanguage,
    speak: function () {},
    speakText: function () {},
    stopSpeech: function () {},
    stopSpeaking: function () {}
  };

})();
