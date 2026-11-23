/**
 * ==========================================================================
 * CYBER SURAKSHA — Hybrid Internationalization (i18n) Engine
 * Multi-Language Full-Website Translation System
 * Supports: English (en), Hindi (hi), Telugu (te), Tamil (ta)
 * 
 * Features:
 * 1. Client-Side Curated Regional Dictionary (instant zero-latency UI)
 * 2. Automated Full-DOM Website Translation (translates 100% of the site)
 * 3. Seamless cross-page persistence via localStorage & session cookies
 * 4. Universal navbar & floating language switcher with clear abbreviations
 * ==========================================================================
 */

(function () {
  'use strict';

  /* ======================================================================
     CONFIGURATION — Supported Regional Languages
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
     HELPER: COOKIE MANAGEMENT
     ====================================================================== */
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function setTransCookie(langCode) {
    const domain = window.location.hostname;
    const isIpOrLocal = domain === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(domain);

    if (langCode === 'en') {
      // Clear translation cookie for English
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      if (!isIpOrLocal) {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${domain}; path=/;`;
      }
    } else {
      const val = `/en/${langCode}`;
      document.cookie = `googtrans=${val}; path=/;`;
      if (!isIpOrLocal) {
        document.cookie = `googtrans=${val}; domain=.${domain}; path=/;`;
      }
    }
  }

  function detectSavedLanguage() {
    const fromStorage = localStorage.getItem(STORAGE_KEY);
    if (fromStorage && SUPPORTED_LANGUAGES.some(l => l.code === fromStorage)) {
      return fromStorage;
    }
    const cookie = getCookie('googtrans');
    if (cookie) {
      const parts = cookie.split('/');
      const code = parts[parts.length - 1];
      if (code && SUPPORTED_LANGUAGES.some(l => l.code === code)) {
        return code;
      }
    }
    return 'en';
  }

  /* ======================================================================
     INITIALIZATION ON DOM LOAD
     ====================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    currentLang = detectSavedLanguage();

    // 1. Initialize Full-Page Automated Translation Engine
    initGoogleTranslate();

    // 2. Create Top Navbar Language Switcher (Universal)
    createNavbarLanguageSwitcher();

    // 3. Create Floating Language Selector (Bottom Right)
    createFloatingLanguageSelector();

    // 4. Apply Curated Local Translations to DOM
    applyTranslations(currentLang);
    updateSelectorUI(currentLang);

    // 5. If language is not English, ensure full translation is triggered
    if (currentLang !== 'en') {
      triggerFullPageTranslation(currentLang);
    }
  });

  /* ======================================================================
     AUTOMATED FULL-PAGE TRANSLATION ENGINE (Google Translate Integration)
     ====================================================================== */
  function initGoogleTranslate() {
    if (document.getElementById('google_translate_element')) return;

    // Create hidden mount point
    const gtDiv = document.createElement('div');
    gtDiv.id = 'google_translate_element';
    gtDiv.className = 'notranslate';
    gtDiv.style.display = 'none';
    document.body.appendChild(gtDiv);

    // Callback invoked when Google Translate library loads
    window.googleTranslateElementInit = function () {
      try {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,hi,te,ta',
          autoDisplay: false
        }, 'google_translate_element');

        if (currentLang && currentLang !== 'en') {
          setTimeout(() => {
            triggerFullPageTranslation(currentLang);
          }, 400);
        }
      } catch (e) {
        console.warn('Google Translate initialization note:', e);
      }
    };

    // Inject Google Translate script asynchronously
    if (!document.getElementById('googleTranslateScript')) {
      const script = document.createElement('script');
      script.id = 'googleTranslateScript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    }
  }

  function triggerFullPageTranslation(langCode) {
    setTransCookie(langCode);

    // If English, trigger reset or reload if translated
    if (langCode === 'en') {
      const combo = document.querySelector('.goog-te-combo');
      if (combo && combo.value !== 'en') {
        combo.value = 'en';
        combo.dispatchEvent(new Event('change'));
      }
      return;
    }

    // Try finding the Google Translate combo box
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
      if (combo.value !== langCode) {
        combo.value = langCode;
        combo.dispatchEvent(new Event('change'));
      }
    } else {
      // Retry for up to 3 seconds until script finishes loading
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        const c = document.querySelector('.goog-te-combo');
        if (c) {
          clearInterval(interval);
          if (c.value !== langCode) {
            c.value = langCode;
            c.dispatchEvent(new Event('change'));
          }
        } else if (attempts > 20) {
          clearInterval(interval);
        }
      }, 150);
    }
  }

  /* ======================================================================
     TOP NAVBAR LANGUAGE SWITCHER (Universal Mount)
     ====================================================================== */
  function createNavbarLanguageSwitcher() {
    if (document.getElementById('navLangSwitcherItem')) return;

    const pillGroup = document.createElement('div');
    pillGroup.id = 'navLangSwitcherItem';
    pillGroup.className = 'nav-lang-pill-group notranslate';
    pillGroup.setAttribute('role', 'group');
    pillGroup.setAttribute('aria-label', 'Language Switcher');

    SUPPORTED_LANGUAGES.forEach(lang => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `nav-lang-pill notranslate ${lang.code === currentLang ? 'active' : ''}`;
      pill.setAttribute('data-lang', lang.code);
      pill.setAttribute('title', `${lang.abbr} — ${lang.nativeName} (${lang.name})`);
      pill.innerHTML = `<span class="nav-lang-abbr notranslate">${lang.abbr}</span>`;

      pill.addEventListener('click', (e) => {
        e.preventDefault();
        switchLanguage(lang.code);
      });

      pillGroup.appendChild(pill);
    });

    // 1. Standard Site Navigation (.navbar-nav)
    const navList = document.querySelector('.navbar .navbar-nav');
    if (navList) {
      const navItem = document.createElement('li');
      navItem.className = 'nav-item d-flex align-items-center ms-lg-2 my-2 my-lg-0';
      navItem.appendChild(pillGroup);

      const accountDropdown = navList.querySelector('.dropdown');
      if (accountDropdown) {
        navList.insertBefore(navItem, accountDropdown);
      } else {
        navList.appendChild(navItem);
      }
      return;
    }

    // 2. Authentication Navigation (.navbar .d-flex)
    const authFlex = document.querySelector('.navbar .d-flex');
    if (authFlex) {
      pillGroup.classList.add('me-2');
      authFlex.insertBefore(pillGroup, authFlex.firstChild);
      return;
    }

    // 3. Fallback
    const navContainer = document.querySelector('.navbar .container-fluid, .navbar .container');
    if (navContainer) {
      navContainer.appendChild(pillGroup);
    }
  }

  /* ======================================================================
     FLOATING LANGUAGE SELECTOR (With Abbreviation Badges)
     ====================================================================== */
  function createFloatingLanguageSelector() {
    if (document.getElementById('langSelectorContainer')) return;

    const container = document.createElement('div');
    container.id = 'langSelectorContainer';
    container.className = 'lang-selector-container notranslate';

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'langToggleBtn';
    toggleBtn.className = 'lang-toggle-btn notranslate';
    toggleBtn.setAttribute('aria-label', 'Select Language');
    toggleBtn.setAttribute('title', 'Change Language / भाषा बदलें / భాష మార్చండి / மொழியை மாற்றவும்');

    const currentLangData = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];
    toggleBtn.innerHTML = `
      <i class="bi bi-translate"></i>
      <span class="lang-toggle-abbr-badge notranslate">${currentLangData.abbr}</span>
      <span class="lang-toggle-label notranslate">${currentLangData.nativeName}</span>
    `;

    // Dropdown panel
    const dropdown = document.createElement('div');
    dropdown.id = 'langDropdown';
    dropdown.className = 'lang-dropdown notranslate';

    const header = document.createElement('div');
    header.className = 'lang-dropdown-header notranslate';
    header.innerHTML = `
      <i class="bi bi-globe2 text-cyan"></i>
      <span class="notranslate">Select Language</span>
    `;
    dropdown.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'lang-grid notranslate';

    SUPPORTED_LANGUAGES.forEach(lang => {
      const langBtn = document.createElement('button');
      langBtn.className = `lang-option notranslate ${lang.code === currentLang ? 'active' : ''}`;
      langBtn.setAttribute('data-lang', lang.code);
      langBtn.innerHTML = `
        <span class="lang-abbr-tag notranslate">${lang.abbr}</span>
        <div class="lang-info notranslate">
          <span class="lang-native notranslate">${lang.nativeName}</span>
          <span class="lang-english notranslate">${lang.name}</span>
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
    container.appendChild(dropdown);
    container.appendChild(toggleBtn);
    document.body.appendChild(container);

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
      container.classList.toggle('expanded');
    });

    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) closeDropdown();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDropdown();
    });

    function closeDropdown() {
      dropdown.classList.remove('open');
      container.classList.remove('expanded');
    }
  }

  /* ======================================================================
     LANGUAGE SWITCHING HANDLER
     ====================================================================== */
  function switchLanguage(langCode) {
    if (!SUPPORTED_LANGUAGES.some(l => l.code === langCode)) return;
    const prevLang = currentLang;
    currentLang = langCode;
    localStorage.setItem(STORAGE_KEY, langCode);

    // 1. Update UI Selection Indicators
    updateSelectorUI(langCode);

    // 2. Apply Curated Local Dictionary
    applyTranslations(langCode);

    // 3. Trigger Full-DOM Translation Engine
    triggerFullPageTranslation(langCode);

    // 4. If reverting from another language to English, reload for pristine reset
    if (langCode === 'en' && prevLang !== 'en') {
      setTransCookie('en');
      window.location.reload();
      return;
    }

    // 5. Re-render visual stories if active
    if (typeof initVisualStories === 'function') {
      initVisualStories();
    }
  }

  /* ======================================================================
     LOCAL CURATED DICTIONARY TRANSLATOR
     ====================================================================== */
  function applyTranslations(lang) {
    if (typeof TRANSLATIONS === 'undefined') return;
    const langData = TRANSLATIONS[lang];
    if (!langData) return;

    // 1. Text elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (langData[key]) {
        // If element contains child icons or SVGs, replace only the text part
        const hasIcon = el.querySelector('i, svg, .bi');
        if (hasIcon && el.childNodes.length > 1) {
          let updated = false;
          Array.from(el.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              node.textContent = ' ' + langData[key];
              updated = true;
            }
          });
          if (!updated) {
            el.appendChild(document.createTextNode(' ' + langData[key]));
          }
        } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.setAttribute('placeholder', langData[key]);
        } else {
          el.textContent = langData[key];
        }
      }
    });

    // 2. Elements with data-i18n-html
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (langData[key]) {
        el.innerHTML = langData[key];
      }
    });

    // 3. Placeholders with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (langData[key]) {
        el.setAttribute('placeholder', langData[key]);
      }
    });

    document.documentElement.lang = lang;
  }

  /* ======================================================================
     UI STATE UPDATER
     ====================================================================== */
  function updateSelectorUI(langCode) {
    const langData = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    if (!langData) return;

    // 1. Update Navbar Pills
    document.querySelectorAll('.nav-lang-pill').forEach(pill => {
      const code = pill.getAttribute('data-lang');
      pill.classList.toggle('active', code === langCode);
    });

    // 2. Update Floating Toggle
    const toggleAbbr = document.querySelector('.lang-toggle-abbr-badge');
    if (toggleAbbr) toggleAbbr.textContent = langData.abbr;

    const toggleLabel = document.querySelector('.lang-toggle-label');
    if (toggleLabel) toggleLabel.textContent = langData.nativeName;

    // 3. Update Dropdown Checkmarks
    document.querySelectorAll('.lang-option').forEach(opt => {
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
     UTILITY HELPER
     ====================================================================== */
  function getTranslation(key) {
    if (typeof TRANSLATIONS === 'undefined') return null;
    const langData = TRANSLATIONS[currentLang];
    if (langData && langData[key]) return langData[key];
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) return TRANSLATIONS.en[key];
    return null;
  }

  // Global window interface
  window.CyberI18n = {
    getCurrentLang: () => currentLang,
    getTranslation: getTranslation,
    switchLanguage: switchLanguage,
    triggerFullPageTranslation: triggerFullPageTranslation,
    speak: function () {},
    speakText: function () {},
    stopSpeech: function () {},
    stopSpeaking: function () {}
  };

})();
