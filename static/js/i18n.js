/**
 * ==========================================================================
 * CYBER SURAKSHA — Internationalization (i18n) & Text-to-Speech Engine
 * Multi-Language Support + Read Aloud Functionality
 * ==========================================================================
 */

(function () {
  'use strict';

  /* ======================================================================
     CONFIGURATION
     ====================================================================== */
  const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  ];

  // BCP 47 lang tags for Web Speech API
  const TTS_LANG_MAP = {
    en: 'en-IN',
    hi: 'hi-IN',
    te: 'te-IN',
    ta: 'ta-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    mr: 'mr-IN',
    bn: 'bn-IN',
    gu: 'gu-IN',
    pa: 'pa-IN'
  };

  const STORAGE_KEY = 'cyber_suraksha_language';
  let currentLang = 'en';

  /* ======================================================================
     INITIALIZATION
     ====================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    currentLang = localStorage.getItem(STORAGE_KEY) || 'en';
    createLanguageSelector();
    applyTranslations(currentLang);
    initTextToSpeech();
  });

  /* ======================================================================
     LANGUAGE SELECTOR — Floating UI Component
     ====================================================================== */
  function createLanguageSelector() {
    // Create the floating container
    const container = document.createElement('div');
    container.id = 'langSelectorContainer';
    container.className = 'lang-selector-container';

    // Main toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'langToggleBtn';
    toggleBtn.className = 'lang-toggle-btn';
    toggleBtn.setAttribute('aria-label', 'Select Language');
    toggleBtn.setAttribute('title', 'Change Language / भाषा बदलें');

    const currentLangData = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];
    toggleBtn.innerHTML = `
      <i class="bi bi-translate"></i>
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

    // Language grid
    const grid = document.createElement('div');
    grid.className = 'lang-grid';

    SUPPORTED_LANGUAGES.forEach(lang => {
      const langBtn = document.createElement('button');
      langBtn.className = `lang-option ${lang.code === currentLang ? 'active' : ''}`;
      langBtn.setAttribute('data-lang', lang.code);
      langBtn.innerHTML = `
        <span class="lang-flag">${lang.flag}</span>
        <span class="lang-native">${lang.nativeName}</span>
        <span class="lang-english">${lang.name}</span>
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
    currentLang = langCode;
    localStorage.setItem(STORAGE_KEY, langCode);
    applyTranslations(langCode);
    updateSelectorUI(langCode);

    // Stop any ongoing TTS
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    updateTTSButtons();

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
          // Preserve icon, update text node only
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

    // Update toggle button label
    const label = document.querySelector('.lang-toggle-label');
    if (label) label.textContent = langData.nativeName;

    // Update active state in grid
    const options = document.querySelectorAll('.lang-option');
    options.forEach(opt => {
      const code = opt.getAttribute('data-lang');
      opt.classList.toggle('active', code === langCode);

      // Update checkmark
      const existingCheck = opt.querySelector('.lang-check');
      if (code === langCode && !existingCheck) {
        const check = document.createElement('i');
        check.className = 'bi bi-check-circle-fill lang-check';
        opt.appendChild(check);
      } else if (code !== langCode && existingCheck) {
        existingCheck.remove();
      }
    });
  }

  /* ======================================================================
     TEXT-TO-SPEECH — Read Aloud Functionality
     ====================================================================== */
  let isSpeaking = false;
  let currentUtterance = null;

  function initTextToSpeech() {
    if (!('speechSynthesis' in window)) return;

    // Add TTS buttons to major content sections
    addTTSButtons();

    // Add global "Read Page" button
    createGlobalTTSButton();
  }

  function addTTSButtons() {
    // Add listen buttons to sections that have data-tts-section attribute
    const sections = document.querySelectorAll('[data-tts-section]');
    sections.forEach(section => {
      // Don't add duplicate buttons
      if (section.querySelector('.tts-section-btn')) return;

      const btn = document.createElement('button');
      btn.className = 'tts-section-btn';
      btn.setAttribute('title', 'Listen to this section');
      btn.innerHTML = '<i class="bi bi-volume-up-fill"></i>';

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = extractReadableText(section);
        if (isSpeaking) {
          stopSpeaking();
        } else {
          speakText(text, btn);
        }
      });

      // Insert at the beginning of section or after the first heading
      const heading = section.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        heading.style.position = 'relative';
        heading.appendChild(btn);
      } else {
        section.style.position = 'relative';
        section.insertBefore(btn, section.firstChild);
      }
    });
  }

  function createGlobalTTSButton() {
    const btn = document.createElement('button');
    btn.id = 'globalTTSBtn';
    btn.className = 'global-tts-btn';
    btn.setAttribute('title', 'Read full page aloud');
    btn.innerHTML = `
      <i class="bi bi-megaphone-fill"></i>
      <span class="global-tts-label" data-i18n="btn_listen">Listen</span>
    `;

    btn.addEventListener('click', () => {
      if (isSpeaking) {
        stopSpeaking();
        btn.classList.remove('speaking');
        const label = btn.querySelector('.global-tts-label');
        if (label) label.textContent = getTranslation('btn_listen') || 'Listen';
        btn.querySelector('i').className = 'bi bi-megaphone-fill';
      } else {
        const mainContent = document.querySelector('main') || document.body;
        const text = extractReadableText(mainContent);
        speakText(text, btn);
        btn.classList.add('speaking');
        const label = btn.querySelector('.global-tts-label');
        if (label) label.textContent = getTranslation('btn_stop_listen') || 'Stop';
        btn.querySelector('i').className = 'bi bi-stop-circle-fill';
      }
    });

    document.body.appendChild(btn);
  }

  function speakText(text, triggerBtn) {
    if (!('speechSynthesis' in window) || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = TTS_LANG_MAP[currentLang] || 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(currentLang));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      isSpeaking = true;
      if (triggerBtn) triggerBtn.classList.add('speaking');
    };

    utterance.onend = () => {
      isSpeaking = false;
      if (triggerBtn) triggerBtn.classList.remove('speaking');
      resetGlobalTTSButton();
    };

    utterance.onerror = () => {
      isSpeaking = false;
      if (triggerBtn) triggerBtn.classList.remove('speaking');
      resetGlobalTTSButton();
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    isSpeaking = false;

    // Reset all TTS buttons
    document.querySelectorAll('.tts-section-btn.speaking').forEach(btn => {
      btn.classList.remove('speaking');
    });
    resetGlobalTTSButton();
  }

  function resetGlobalTTSButton() {
    const globalBtn = document.getElementById('globalTTSBtn');
    if (globalBtn) {
      globalBtn.classList.remove('speaking');
      const label = globalBtn.querySelector('.global-tts-label');
      if (label) label.textContent = getTranslation('btn_listen') || 'Listen';
      const icon = globalBtn.querySelector('i');
      if (icon) icon.className = 'bi bi-megaphone-fill';
    }
  }

  function updateTTSButtons() {
    // Update labels based on current language
    const globalBtn = document.getElementById('globalTTSBtn');
    if (globalBtn) {
      const label = globalBtn.querySelector('.global-tts-label');
      if (label && !isSpeaking) {
        label.textContent = getTranslation('btn_listen') || 'Listen';
      }
    }
  }

  function extractReadableText(element) {
    // Extract only visible, meaningful text (skip nav, footer, scripts, buttons)
    const skipTags = ['SCRIPT', 'STYLE', 'NAV', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'IFRAME', 'SVG'];
    const skipClasses = ['lang-selector-container', 'global-tts-btn', 'tts-section-btn', 'lang-dropdown',
      'story-overlay', 'footer-cyber', 'navbar-cyber'];

    let text = '';

    function walk(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const trimmed = node.textContent.trim();
        if (trimmed) text += trimmed + '. ';
        return;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return;
      if (skipTags.includes(node.tagName)) return;
      if (node.classList && skipClasses.some(c => node.classList.contains(c))) return;
      if (node.hidden || node.style.display === 'none' || node.classList.contains('d-none')) return;

      for (const child of node.childNodes) {
        walk(child);
      }
    }

    walk(element);
    return text.replace(/\.\s*\./g, '.').replace(/\s+/g, ' ').trim();
  }

  /* ======================================================================
     UTILITY — Get Translation Helper
     ====================================================================== */
  function getTranslation(key) {
    if (typeof TRANSLATIONS === 'undefined') return null;
    const langData = TRANSLATIONS[currentLang];
    if (langData && langData[key]) return langData[key];
    // Fallback to English
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) return TRANSLATIONS.en[key];
    return null;
  }

  // Expose globally for other scripts
  window.CyberI18n = {
    getCurrentLang: () => currentLang,
    getTranslation: getTranslation,
    switchLanguage: switchLanguage,
    speakText: (text) => speakText(text, null),
    stopSpeaking: stopSpeaking
  };

})();

