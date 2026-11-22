/**
 * visual-stories.js — Animated Visual Story Cards & Video Explainer for Cyber Suraksha
 *
 * Explains 8 common cyber threats through:
 * 1. Verified Animated Explainer Videos from YouTube for each cyber attack.
 * 2. Simple step-by-step visual emoji scenarios aimed at first-time phone users
 *    who do not understand English or technical jargon.
 * 3. Text-to-Speech audio narration in 10 Indian languages.
 *
 * Public API:
 *   initVisualStories()           — auto-called on DOMContentLoaded
 *   playStory(storyId, mode)      — opens the full-screen modal (mode: 'video' | 'story')
 */

/* ------------------------------------------------------------------ */
/*  Translation helper                                                 */
/* ------------------------------------------------------------------ */

function getTranslation(key) {
    try {
        if (typeof TRANSLATIONS !== 'undefined') {
            const lang =
                (typeof window !== 'undefined' && window.CyberI18n && window.CyberI18n.getCurrentLang()) ||
                (typeof currentLanguage !== 'undefined' && currentLanguage) ||
                localStorage.getItem('cyber_suraksha_language') ||
                localStorage.getItem('preferredLanguage') ||
                'en';
            if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
                return TRANSLATIONS[lang][key];
            }
            if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) {
                return TRANSLATIONS['en'][key];
            }
        }
    } catch (_) {
        /* fallback below */
    }
    return FALLBACK_TEXT[key] || key;
}

/* ------------------------------------------------------------------ */
/*  English fallback strings                                           */
/* ------------------------------------------------------------------ */

const FALLBACK_TEXT = {
    /* Story titles */
    threat_phishing: 'Phishing — The Fake Bank Message',
    threat_malware: 'Malware — The Free Game Trap',
    threat_ransomware: 'Ransomware — Your Photos Locked Forever',
    threat_password: 'Password Attack — "123456" is Not Safe',
    threat_identity: 'Identity Theft — Someone Using Your Aadhaar',
    threat_social_engineering: 'Social Engineering — The Fake Police Call',
    threat_upi_scam: 'UPI / QR Scam — QR Code = Money Going OUT',
    threat_data_breach: 'Data Breach — Your Password is on the Internet',

    /* ---- Phishing ---- */
    story_phishing_step1_title: 'You get a message',
    story_phishing_step1_desc: 'You receive a message that looks like it\u2019s from your bank.',
    story_phishing_step2_title: 'Urgent warning!',
    story_phishing_step2_desc: 'The message says \u201cYour account will be blocked! Click here now!\u201d',
    story_phishing_step3_title: 'You click the link',
    story_phishing_step3_desc: 'You click the link and enter your password on a FAKE website.',
    story_phishing_step4_title: 'Money stolen!',
    story_phishing_step4_desc: 'The criminal steals your money using your password.',
    story_phishing_prevention: 'Never click links in messages. Go directly to your bank\u2019s app.',

    /* ---- Malware ---- */
    story_malware_step1_title: 'Free game ad',
    story_malware_step1_desc: 'You see an ad: \u201cDownload this popular game for FREE!\u201d',
    story_malware_step2_title: 'You download it',
    story_malware_step2_desc: 'You download the game from an unknown website.',
    story_malware_step3_title: 'Hidden virus!',
    story_malware_step3_desc: 'A hidden virus installs itself on your phone.',
    story_malware_step4_title: 'Your data exposed',
    story_malware_step4_desc: 'The virus can see your photos, messages, and passwords.',
    story_malware_prevention: 'Only download apps from official app stores (Google Play / Apple Store).',

    /* ---- Ransomware ---- */
    story_ransomware_step1_title: 'Your precious files',
    story_ransomware_step1_desc: 'You have precious family photos and documents on your phone.',
    story_ransomware_step2_title: 'Unknown attachment',
    story_ransomware_step2_desc: 'You open an attachment from an unknown email.',
    story_ransomware_step3_title: 'Files locked!',
    story_ransomware_step3_desc: 'ALL your photos and files are suddenly locked with a password.',
    story_ransomware_step4_title: 'Ransom demand',
    story_ransomware_step4_desc: 'A criminal demands \u20b950,000 to unlock your files.',
    story_ransomware_prevention: 'Keep backup copies of important files on a separate device.',

    /* ---- Password Attack ---- */
    story_password_step1_title: 'Simple password',
    story_password_step1_desc: 'You create a simple password like \u201c123456\u201d or your birthday.',
    story_password_step2_title: 'Robot guessing',
    story_password_step2_desc: 'A computer program tries millions of passwords per second.',
    story_password_step3_title: 'Cracked instantly!',
    story_password_step3_desc: 'Your simple password is cracked in less than 1 second.',
    story_password_step4_title: 'All accounts taken',
    story_password_step4_desc: 'The attacker now controls your email, social media, and bank account.',
    story_password_prevention: 'Use long passwords with letters, numbers, and symbols. Never reuse passwords.',

    /* ---- Identity Theft ---- */
    story_identity_step1_title: 'Aadhaar shared online',
    story_identity_step1_desc: 'You share a photo of your Aadhaar card on social media.',
    story_identity_step2_title: 'Details copied',
    story_identity_step2_desc: 'A criminal copies your Aadhaar number and personal details.',
    story_identity_step3_title: 'Loan in your name!',
    story_identity_step3_desc: 'They take a loan of \u20b95,00,000 in YOUR name.',
    story_identity_step4_title: 'Legal trouble',
    story_identity_step4_desc: 'You receive legal notices for a loan you never took.',
    story_identity_prevention: 'Never post photos of ID cards, PAN cards, or Aadhaar online.',

    /* ---- Social Engineering ---- */
    story_social_step1_title: 'A scary phone call',
    story_social_step1_desc: 'You receive a call: \u201cThis is the Cyber Crime Police.\u201d',
    story_social_step2_title: 'Threat of arrest',
    story_social_step2_desc: 'They say: \u201cYour Aadhaar is linked to a crime. Pay fine immediately or get arrested!\u201d',
    story_social_step3_title: 'You pay in fear',
    story_social_step3_desc: 'In fear, you transfer \u20b91,00,000 to their account.',
    story_social_step4_title: 'It was a scam!',
    story_social_step4_desc: 'The caller was a criminal. Real police NEVER ask for money on the phone.',
    story_social_prevention: 'Hang up. Call 100 or visit your local police station to verify.',

    /* ---- UPI / QR Scam ---- */
    story_upi_step1_title: 'Promise of money',
    story_upi_step1_desc: 'Someone says: \u201cI\u2019ll send you \u20b910,000. Just scan this QR code to receive.\u201d',
    story_upi_step2_title: 'You scan the code',
    story_upi_step2_desc: 'You scan the QR code thinking you\u2019ll RECEIVE money.',
    story_upi_step3_title: 'Money goes OUT!',
    story_upi_step3_desc: 'Scanning a QR code means SENDING money, not receiving!',
    story_upi_step4_title: 'Scammed!',
    story_upi_step4_desc: '\u20b910,000 goes FROM your account to the scammer.',
    story_upi_prevention: 'Remember: QR codes are ONLY for paying. You NEVER need to scan to receive money.',

    /* ---- Data Breach ---- */
    story_breach_step1_title: 'You register online',
    story_breach_step1_desc: 'You register on a shopping website with your email and password.',
    story_breach_step2_title: 'Website hacked!',
    story_breach_step2_desc: 'Hackers break into that website\u2019s database.',
    story_breach_step3_title: 'Passwords leaked',
    story_breach_step3_desc: 'Your email and password are now available on the dark web.',
    story_breach_step4_title: 'All accounts at risk',
    story_breach_step4_desc: 'If you used the same password elsewhere, ALL your accounts are at risk.',
    story_breach_prevention: 'Use different passwords for every website. Enable two-step verification.',

    /* UI strings */
    watch_story: 'Watch Story',
    watch_video_animated: 'Watch Animated Video',
    tab_video: '🎬 Animated Video',
    tab_story: '📖 Step-by-Step Story',
    back_to_page: 'Back to Webpage',
    listen_step: 'Listen Aloud',
    next_step: 'Next',
    prev_step: 'Back',
    close_story: 'Close',
    done: 'Done',
    stay_safe: '\u2705 How to Stay Safe',
    step_label: 'Step',
};

/* ------------------------------------------------------------------ */
/*  Visual Stories & Verified Animated Explainer Videos                */
/* ------------------------------------------------------------------ */

const VISUAL_STORIES = [
    /* 1 — Phishing */
    {
        id: 'phishing',
        youtubeId: 'OMk0RZA5mE8',
        videoTitle: 'What Is Phishing? Animated Explainer',
        channel: 'PowerCert Animated Videos',
        icon: 'bi-envelope-exclamation-fill',
        colorClass: 'danger',
        titleKey: 'threat_phishing',
        steps: [
            { emoji: '📱', titleKey: 'story_phishing_step1_title', descKey: 'story_phishing_step1_desc', level: 'safe',    animation: 'fadeInUp' },
            { emoji: '💬', titleKey: 'story_phishing_step2_title', descKey: 'story_phishing_step2_desc', level: 'warning', animation: 'fadeInUp' },
            { emoji: '🔗', titleKey: 'story_phishing_step3_title', descKey: 'story_phishing_step3_desc', level: 'danger',  animation: 'fadeInUp' },
            { emoji: '💸', titleKey: 'story_phishing_step4_title', descKey: 'story_phishing_step4_desc', level: 'danger',  animation: 'fadeInUp' },
        ],
        preventionKey: 'story_phishing_prevention',
    },

    /* 2 — Malware */
    {
        id: 'malware',
        youtubeId: 'Hvz6ecYxBsQ',
        videoTitle: 'What is Malware? Animated Explainer',
        channel: 'Kaspersky',
        icon: 'bi-bug-fill',
        colorClass: 'warning',
        titleKey: 'threat_malware',
        steps: [
            { emoji: '🎮', titleKey: 'story_malware_step1_title', descKey: 'story_malware_step1_desc', level: 'safe',    animation: 'fadeInUp' },
            { emoji: '⬇️', titleKey: 'story_malware_step2_title', descKey: 'story_malware_step2_desc', level: 'warning', animation: 'fadeInUp' },
            { emoji: '🐛', titleKey: 'story_malware_step3_title', descKey: 'story_malware_step3_desc', level: 'danger',  animation: 'fadeInUp' },
            { emoji: '📷', titleKey: 'story_malware_step4_title', descKey: 'story_malware_step4_desc', level: 'danger',  animation: 'fadeInUp' },
        ],
        preventionKey: 'story_malware_prevention',
    },

    /* 3 — Ransomware */
    {
        id: 'ransomware',
        youtubeId: 'fls3dTUqkOE',
        videoTitle: 'What is Ransomware? How Does It Work?',
        channel: 'Eye on Tech',
        icon: 'bi-file-earmark-lock2-fill',
        colorClass: 'dark',
        titleKey: 'threat_ransomware',
        steps: [
            { emoji: '📷', titleKey: 'story_ransomware_step1_title', descKey: 'story_ransomware_step1_desc', level: 'safe',    animation: 'fadeInUp' },
            { emoji: '📎', titleKey: 'story_ransomware_step2_title', descKey: 'story_ransomware_step2_desc', level: 'warning', animation: 'fadeInUp' },
            { emoji: '🔒', titleKey: 'story_ransomware_step3_title', descKey: 'story_ransomware_step3_desc', level: 'danger',  animation: 'fadeInUp' },
            { emoji: '💰', titleKey: 'story_ransomware_step4_title', descKey: 'story_ransomware_step4_desc', level: 'danger',  animation: 'fadeInUp' },
        ],
        preventionKey: 'story_ransomware_prevention',
    },

    /* 4 — Password Attack */
    {
        id: 'password',
        youtubeId: '0RLH4SNAfjA',
        videoTitle: 'How to Make Strong Passwords! Secure Our World',
        channel: 'CISA',
        icon: 'bi-key-fill',
        colorClass: 'info',
        titleKey: 'threat_password',
        steps: [
            { emoji: '🔑', titleKey: 'story_password_step1_title', descKey: 'story_password_step1_desc', level: 'safe',    animation: 'fadeInUp' },
            { emoji: '🤖', titleKey: 'story_password_step2_title', descKey: 'story_password_step2_desc', level: 'warning', animation: 'fadeInUp' },
            { emoji: '💨', titleKey: 'story_password_step3_title', descKey: 'story_password_step3_desc', level: 'danger',  animation: 'fadeInUp' },
            { emoji: '📧', titleKey: 'story_password_step4_title', descKey: 'story_password_step4_desc', level: 'danger',  animation: 'fadeInUp' },
        ],
        preventionKey: 'story_password_prevention',
    },

    /* 5 — Identity Theft */
    {
        id: 'identity',
        youtubeId: 'aorPsj3e8ug',
        videoTitle: 'What is Identity Theft? Animated Explanation',
        channel: 'Easy Peasy Finance',
        icon: 'bi-person-badge-fill',
        colorClass: 'secondary',
        titleKey: 'threat_identity',
        steps: [
            { emoji: '🪪', titleKey: 'story_identity_step1_title', descKey: 'story_identity_step1_desc', level: 'safe',    animation: 'fadeInUp' },
            { emoji: '👤', titleKey: 'story_identity_step2_title', descKey: 'story_identity_step2_desc', level: 'warning', animation: 'fadeInUp' },
            { emoji: '🏦', titleKey: 'story_identity_step3_title', descKey: 'story_identity_step3_desc', level: 'danger',  animation: 'fadeInUp' },
            { emoji: '⚖️', titleKey: 'story_identity_step4_title', descKey: 'story_identity_step4_desc', level: 'danger',  animation: 'fadeInUp' },
        ],
        preventionKey: 'story_identity_prevention',
    },

    /* 6 — Social Engineering */
    {
        id: 'social_engineering',
        youtubeId: 'lczewNvAnZk',
        videoTitle: 'What is Social Engineering? Animated Security Explainer',
        channel: 'Kaspersky',
        icon: 'bi-telephone-inbound-fill',
        colorClass: 'primary',
        titleKey: 'threat_social_engineering',
        steps: [
            { emoji: '📞', titleKey: 'story_social_step1_title', descKey: 'story_social_step1_desc', level: 'safe',    animation: 'fadeInUp' },
            { emoji: '👮', titleKey: 'story_social_step2_title', descKey: 'story_social_step2_desc', level: 'warning', animation: 'fadeInUp' },
            { emoji: '😰', titleKey: 'story_social_step3_title', descKey: 'story_social_step3_desc', level: 'danger',  animation: 'fadeInUp' },
            { emoji: '💸', titleKey: 'story_social_step4_title', descKey: 'story_social_step4_desc', level: 'danger',  animation: 'fadeInUp' },
        ],
        preventionKey: 'story_social_prevention',
    },

    /* 7 — UPI / QR Scam */
    {
        id: 'upi_scam',
        youtubeId: '5V9X_85b4t0',
        videoTitle: 'What Is Quishing & QR Scams? How Hackers Steal Your Data',
        channel: 'IBM Technology',
        icon: 'bi-qr-code-scan',
        colorClass: 'success',
        titleKey: 'threat_upi_scam',
        steps: [
            { emoji: '📲', titleKey: 'story_upi_step1_title', descKey: 'story_upi_step1_desc', level: 'safe',    animation: 'fadeInUp' },
            { emoji: '🔍', titleKey: 'story_upi_step2_title', descKey: 'story_upi_step2_desc', level: 'warning', animation: 'fadeInUp' },
            { emoji: '💸', titleKey: 'story_upi_step3_title', descKey: 'story_upi_step3_desc', level: 'danger',  animation: 'fadeInUp' },
            { emoji: '😱', titleKey: 'story_upi_step4_title', descKey: 'story_upi_step4_desc', level: 'danger',  animation: 'fadeInUp' },
        ],
        preventionKey: 'story_upi_prevention',
    },

    /* 8 — Data Breach */
    {
        id: 'data_breach',
        youtubeId: 'oJOBpd3SQv0',
        videoTitle: 'What is a Data Breach? Animated Explainer',
        channel: 'Cybersecurity Awareness',
        icon: 'bi-database-fill-exclamation',
        colorClass: 'danger',
        titleKey: 'threat_data_breach',
        steps: [
            { emoji: '📧', titleKey: 'story_breach_step1_title', descKey: 'story_breach_step1_desc', level: 'safe',    animation: 'fadeInUp' },
            { emoji: '💥', titleKey: 'story_breach_step2_title', descKey: 'story_breach_step2_desc', level: 'warning', animation: 'fadeInUp' },
            { emoji: '🌐', titleKey: 'story_breach_step3_title', descKey: 'story_breach_step3_desc', level: 'danger',  animation: 'fadeInUp' },
            { emoji: '🔓', titleKey: 'story_breach_step4_title', descKey: 'story_breach_step4_desc', level: 'danger',  animation: 'fadeInUp' },
        ],
        preventionKey: 'story_breach_prevention',
    },
];

/* ------------------------------------------------------------------ */
/*  Internal State                                                     */
/* ------------------------------------------------------------------ */

let _activeStoryId = null;
let _activeStepIndex = 0;
let _autoPlayTimer = null;
let _isPaused = false;
let _currentTab = 'video'; // 'video' | 'story'

/* ------------------------------------------------------------------ */
/*  Initialization                                                     */
/* ------------------------------------------------------------------ */

function initVisualStories() {
    const mainContainer = document.getElementById('visualStoriesContainer');
    if (mainContainer) {
        _renderAllStoryCards(mainContainer);
    }

    const previewContainer = document.getElementById('visualStoriesPreview');
    if (previewContainer) {
        renderPreviewCards(previewContainer);
    }
}

/* ------------------------------------------------------------------ */
/*  Render All 8 Cards (threats.html)                                  */
/* ------------------------------------------------------------------ */

function _renderAllStoryCards(container) {
    container.innerHTML = '';
    const row = document.createElement('div');
    row.className = 'row g-4';

    VISUAL_STORIES.forEach(function (story) {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-lg-4 col-xl-3';
        renderStoryCard(story, col);
        row.appendChild(col);
    });

    container.appendChild(row);
}

/* ------------------------------------------------------------------ */
/*  Single Story Card (with Video Preview & Dual Actions)              */
/* ------------------------------------------------------------------ */

function renderStoryCard(story, container) {
    var card = document.createElement('div');
    card.className = 'visual-story-card card shadow-sm h-100 border-0';
    card.setAttribute('data-story-id', story.id);
    card.style.cursor = 'pointer';

    // Header
    var header = document.createElement('div');
    header.className = 'card-header bg-' + story.colorClass + ' text-white d-flex align-items-center justify-content-between py-2 px-3';
    header.innerHTML =
        '<div class="d-flex align-items-center gap-2 text-truncate">' +
        '  <i class="bi ' + story.icon + ' fs-5"></i>' +
        '  <span class="fw-bold small text-truncate">' + _esc(getTranslation(story.titleKey)) + '</span>' +
        '</div>' +
        '<span class="badge bg-light text-dark px-2 py-1 small" style="font-size:0.7rem;"><i class="bi bi-youtube text-danger me-1"></i>Video</span>';

    // Body
    var body = document.createElement('div');
    body.className = 'card-body p-3 d-flex flex-column';

    // YouTube Thumbnail Preview with Play Overlay
    var thumbBox = document.createElement('div');
    thumbBox.className = 'position-relative rounded overflow-hidden mb-3';
    thumbBox.style.cssText = 'height:130px; background:#000; box-shadow:0 4px 12px rgba(0,0,0,0.3);';
    thumbBox.innerHTML =
        '<img src="https://img.youtube.com/vi/' + story.youtubeId + '/mqdefault.jpg" alt="' + _esc(story.videoTitle) + '" style="width:100%;height:100%;object-fit:cover;opacity:0.85;">' +
        '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3);transition:all .2s ease;">' +
        '  <div style="width:44px;height:44px;border-radius:50%;background:#ef4444;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 0 15px rgba(239,68,68,0.7);">' +
        '    <i class="bi bi-play-fill fs-3" style="margin-left:2px;"></i>' +
        '  </div>' +
        '</div>';
    thumbBox.addEventListener('click', function (e) {
        e.stopPropagation();
        playStory(story.id, 'video');
    });
    body.appendChild(thumbBox);

    // Emoji Preview
    var emojiRow = document.createElement('div');
    emojiRow.className = 'text-center mb-3 py-1 rounded bg-black bg-opacity-25';
    emojiRow.style.cssText = 'font-size:1.35rem;letter-spacing:0.35rem;';
    story.steps.forEach(function (step) {
        emojiRow.textContent += step.emoji;
    });
    body.appendChild(emojiRow);

    // Action Buttons
    var btnGroup = document.createElement('div');
    btnGroup.className = 'mt-auto d-flex flex-column gap-2';

    var videoBtn = document.createElement('button');
    videoBtn.className = 'btn btn-danger btn-sm w-100 fw-semibold d-flex align-items-center justify-content-center gap-1';
    videoBtn.innerHTML = '<i class="bi bi-play-circle-fill"></i> ' + _esc(getTranslation('watch_video_animated'));
    videoBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        playStory(story.id, 'video');
    });

    var storyBtn = document.createElement('button');
    storyBtn.className = 'btn btn-outline-' + story.colorClass + ' btn-sm w-100 fw-semibold d-flex align-items-center justify-content-center gap-1';
    storyBtn.innerHTML = '<i class="bi bi-book-half"></i> ' + _esc(getTranslation('tab_story'));
    storyBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        playStory(story.id, 'story');
    });

    btnGroup.appendChild(videoBtn);
    btnGroup.appendChild(storyBtn);
    body.appendChild(btnGroup);

    card.appendChild(header);
    card.appendChild(body);

    card.addEventListener('click', function () {
        playStory(story.id, 'video');
    });

    container.appendChild(card);
}

/* ------------------------------------------------------------------ */
/*  Preview Cards for index.html                                       */
/* ------------------------------------------------------------------ */

function renderPreviewCards(container) {
    container.innerHTML = '';
    var featured = ['phishing', 'upi_scam', 'social_engineering', 'password'];
    var row = document.createElement('div');
    row.className = 'row g-3';

    featured.forEach(function (id) {
        var story = VISUAL_STORIES.find(function (s) { return s.id === id; });
        if (!story) return;

        var col = document.createElement('div');
        col.className = 'col-6 col-md-3';

        var card = document.createElement('div');
        card.className = 'visual-story-card card text-center border-0 shadow-sm h-100';
        card.style.cursor = 'pointer';

        var body = document.createElement('div');
        body.className = 'card-body py-3 px-2 d-flex flex-column align-items-center justify-content-between';

        var thumb = document.createElement('div');
        thumb.className = 'position-relative rounded overflow-hidden mb-2 w-100';
        thumb.style.cssText = 'height:90px;background:#000;';
        thumb.innerHTML =
            '<img src="https://img.youtube.com/vi/' + story.youtubeId + '/mqdefault.jpg" alt="' + _esc(story.videoTitle) + '" style="width:100%;height:100%;object-fit:cover;opacity:0.85;">' +
            '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3);">' +
            '  <i class="bi bi-play-circle-fill text-danger fs-3" style="filter:drop-shadow(0 0 8px rgba(0,0,0,0.8));"></i>' +
            '</div>';

        var title = document.createElement('h6');
        title.className = 'card-title mb-2 fw-bold text-white text-truncate w-100';
        title.style.fontSize = '0.8rem';
        title.textContent = getTranslation(story.titleKey);

        var btn = document.createElement('button');
        btn.className = 'btn btn-sm btn-danger w-100 py-1 text-nowrap';
        btn.style.fontSize = '0.75rem';
        btn.innerHTML = '<i class="bi bi-play-fill"></i> ' + _esc(getTranslation('watch_story'));
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            playStory(story.id, 'video');
        });

        body.appendChild(thumb);
        body.appendChild(title);
        body.appendChild(btn);
        card.appendChild(body);

        card.addEventListener('click', function () {
            playStory(story.id, 'video');
        });

        col.appendChild(card);
        row.appendChild(col);
    });

    container.appendChild(row);
}

/* ------------------------------------------------------------------ */
/*  playStory — Full-Screen Animated Story & Video Player              */
/* ------------------------------------------------------------------ */

function playStory(storyId, initialMode) {
    var story = VISUAL_STORIES.find(function (s) { return s.id === storyId; });
    if (!story) return;

    _activeStoryId = storyId;
    _activeStepIndex = 0;
    _isPaused = false;
    _currentTab = initialMode === 'story' ? 'story' : 'video';

    // Remove any previous overlay
    _removeOverlay();

    /* ---- Overlay Element ---- */
    var overlay = document.createElement('div');
    overlay.className = 'story-overlay active';
    overlay.id = 'storyOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', getTranslation(story.titleKey));
    overlay.style.cssText =
        'position:fixed;inset:0;z-index:99999;background:rgba(2,6,18,0.95);' +
        'backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);' +
        'display:flex;align-items:center;justify-content:center;' +
        'opacity:1;pointer-events:auto;transition:opacity .25s ease;';

    /* Inner modal container */
    var inner = document.createElement('div');
    inner.className = 'story-overlay-inner';
    inner.id = 'storyModalInner';
    inner.style.cssText =
        'pointer-events:auto;background:linear-gradient(160deg, #0d1527 0%, #080f1e 100%);' +
        'color:#fff;border:1.5px solid rgba(0,242,254,0.4);border-radius:1.25rem;' +
        'max-width:720px;width:95%;max-height:94vh;overflow-y:auto;display:flex;' +
        'flex-direction:column;position:relative;' +
        'box-shadow:0 20px 60px rgba(0,0,0,0.9), 0 0 35px rgba(0,242,254,0.2);';

    /* ---- Header Bar ---- */
    var hdr = document.createElement('div');
    hdr.style.cssText =
        'padding:1rem 1.25rem;border-bottom:1px solid rgba(255,255,255,0.1);' +
        'display:flex;align-items:center;justify-content:space-between;color:#fff;position:sticky;top:0;background:rgba(13,21,39,0.95);backdrop-filter:blur(10px);z-index:10;';

    var hdrTitle = document.createElement('div');
    hdrTitle.className = 'd-flex align-items-center gap-2';
    hdrTitle.innerHTML =
        '<i class="bi ' + story.icon + ' fs-4 text-' + story.colorClass + '"></i>' +
        '<div>' +
        '  <h5 class="fw-bold mb-0 text-white" style="font-size:1.1rem;">' + _esc(getTranslation(story.titleKey)) + '</h5>' +
        '</div>';

    // Guaranteed-clickable Close Button (X)
    var closeBtn = document.createElement('button');
    closeBtn.className = 'story-close-btn';
    closeBtn.id = 'storyCloseBtn';
    closeBtn.setAttribute('type', 'button');
    closeBtn.setAttribute('aria-label', getTranslation('close_story') || 'Close');
    closeBtn.setAttribute('title', 'Close (X) and return to webpage');
    closeBtn.innerHTML = '<i class="bi bi-x-lg" style="pointer-events:none;font-size:1.2rem;"></i>';

    closeBtn.onclick = function (e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        _closeStory();
    };
    closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        _closeStory();
    });

    hdr.appendChild(hdrTitle);
    hdr.appendChild(closeBtn);
    inner.appendChild(hdr);

    /* ---- Mode Switcher Tabs ---- */
    var tabsBar = document.createElement('div');
    tabsBar.className = 'story-mode-tabs';
    tabsBar.innerHTML =
        '<button type="button" class="story-mode-tab ' + (_currentTab === 'video' ? 'active' : '') + '" id="tabBtnVideo">' +
        '  <i class="bi bi-youtube text-danger me-1"></i> ' + _esc(getTranslation('tab_video')) +
        '</button>' +
        '<button type="button" class="story-mode-tab ' + (_currentTab === 'story' ? 'active' : '') + '" id="tabBtnStory">' +
        '  <i class="bi bi-collection-play me-1"></i> ' + _esc(getTranslation('tab_story')) +
        '</button>';

    inner.appendChild(tabsBar);

    /* ---- Dynamic Content Container ---- */
    var contentBox = document.createElement('div');
    contentBox.id = 'storyContentBox';
    contentBox.style.cssText = 'padding:1.25rem;flex:1;display:flex;flex-direction:column;';
    inner.appendChild(contentBox);

    overlay.appendChild(inner);
    document.body.appendChild(overlay);

    // Prevent body scrolling while modal is open
    document.body.style.overflow = 'hidden';

    // Backdrop click-to-close
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            _closeStory();
        }
    });

    // Keyboard navigation (Escape key to exit)
    document.addEventListener('keydown', _storyKeyHandler);

    // Hook tab buttons
    document.getElementById('tabBtnVideo').addEventListener('click', function () {
        _switchTab(story, 'video');
    });
    document.getElementById('tabBtnStory').addEventListener('click', function () {
        _switchTab(story, 'story');
    });

    // Initial render
    _renderActiveTab(story);
}

/* ------------------------------------------------------------------ */
/*  Tab Switching                                                      */
/* ------------------------------------------------------------------ */

function _switchTab(story, newTab) {
    if (_currentTab === newTab) return;
    _currentTab = newTab;

    // Stop auto-play and speech if switching away
    _stopAutoPlay();
    _stopSpeech();

    var tabVideo = document.getElementById('tabBtnVideo');
    var tabStory = document.getElementById('tabBtnStory');
    if (tabVideo) tabVideo.className = 'story-mode-tab ' + (_currentTab === 'video' ? 'active' : '');
    if (tabStory) tabStory.className = 'story-mode-tab ' + (_currentTab === 'story' ? 'active' : '');

    _renderActiveTab(story);
}

function _renderActiveTab(story) {
    var contentBox = document.getElementById('storyContentBox');
    if (!contentBox) return;

    if (_currentTab === 'video') {
        _renderVideoView(story, contentBox);
    } else {
        _renderStoryView(story, contentBox);
    }
}

/* ------------------------------------------------------------------ */
/*  Tab 1: YouTube Animated Video Player                               */
/* ------------------------------------------------------------------ */

function _renderVideoView(story, container) {
    container.innerHTML = '';

    // Responsive 16:9 YouTube Video Embed
    var videoWrap = document.createElement('div');
    videoWrap.className = 'story-video-wrapper';
    videoWrap.innerHTML =
        '<iframe id="storyVideoIframe" ' +
        '  src="https://www.youtube-nocookie.com/embed/' + story.youtubeId + '?autoplay=1&rel=0&modestbranding=1" ' +
        '  title="' + _esc(story.videoTitle) + '" ' +
        '  frameborder="0" ' +
        '  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
        '  allowfullscreen>' +
        '</iframe>';
    container.appendChild(videoWrap);

    // Video Meta Details & Badges
    var meta = document.createElement('div');
    meta.className = 'd-flex align-items-center justify-content-between flex-wrap gap-2 mb-3';
    meta.innerHTML =
        '<div class="d-flex align-items-center gap-2">' +
        '  <span class="badge bg-danger"><i class="bi bi-play-circle-fill me-1"></i> Animated Attack Explainer</span>' +
        '  <span class="text-secondary small"><i class="bi bi-award me-1"></i> ' + _esc(story.channel) + '</span>' +
        '</div>' +
        '<button type="button" class="btn btn-sm btn-outline-info story-tts-btn" id="videoSpeechBtn">' +
        '  <i class="bi bi-volume-up-fill me-1"></i> ' + _esc(getTranslation('listen_step')) +
        '</button>';
    container.appendChild(meta);

    // Audio narration for this threat
    var speechBtn = meta.querySelector('#videoSpeechBtn');
    if (speechBtn) {
        speechBtn.addEventListener('click', function () {
            var textToSpeak = getTranslation(story.titleKey) + '. ' + getTranslation(story.preventionKey);
            _speakText(textToSpeak, speechBtn);
        });
    }

    // Prevention Advice Box
    var prevBox = document.createElement('div');
    prevBox.className = 'story-prevention mb-3';
    prevBox.style.cssText = 'padding:1rem 1.25rem;border-radius:.75rem;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.4);';
    prevBox.innerHTML =
        '<div class="fw-bold text-success mb-1 fs-6"><i class="bi bi-shield-check me-2"></i>' + _esc(getTranslation('stay_safe')) + '</div>' +
        '<div class="text-light small">' + _esc(getTranslation(story.preventionKey)) + '</div>';
    container.appendChild(prevBox);

    // Bottom Action Bar
    var actions = document.createElement('div');
    actions.className = 'd-flex align-items-center justify-content-between flex-wrap gap-2 pt-2 border-top border-secondary border-opacity-25 mt-auto';

    var switchBtn = document.createElement('button');
    switchBtn.className = 'btn btn-outline-info btn-sm';
    switchBtn.innerHTML = '<i class="bi bi-collection-play me-1"></i> ' + _esc(getTranslation('tab_story'));
    switchBtn.onclick = function () { _switchTab(story, 'story'); };

    var exitBtn = document.createElement('button');
    exitBtn.className = 'btn btn-outline-light btn-sm';
    exitBtn.id = 'videoExitBtn';
    exitBtn.innerHTML = '<i class="bi bi-x-circle me-1"></i> ' + _esc(getTranslation('back_to_page'));
    exitBtn.onclick = _closeStory;

    actions.appendChild(switchBtn);
    actions.appendChild(exitBtn);
    container.appendChild(actions);
}

/* ------------------------------------------------------------------ */
/*  Tab 2: Step-by-Step Scenario Simulation                           */
/* ------------------------------------------------------------------ */

function _renderStoryView(story, container) {
    container.innerHTML = '';

    /* Progress bar */
    var progressBar = document.createElement('div');
    progressBar.className = 'story-progress-bar d-flex align-items-center justify-content-center gap-2 py-2';
    progressBar.id = 'storyProgressBar';
    story.steps.forEach(function (step, i) {
        var dot = document.createElement('span');
        dot.className = 'story-progress-dot';
        dot.setAttribute('data-index', i);
        dot.style.cssText =
            'width:14px;height:14px;border-radius:50%;background:rgba(255,255,255,0.2);transition:all .3s ease;cursor:pointer;';
        dot.addEventListener('click', function () { _goToStep(story, i); });
        progressBar.appendChild(dot);
    });
    container.appendChild(progressBar);

    /* Step content area */
    var stepArea = document.createElement('div');
    stepArea.className = 'story-step-area';
    stepArea.id = 'storyStepArea';
    stepArea.style.cssText = 'padding:1.25rem 1rem;flex:1;min-height:240px;position:relative;color:#fff;';
    container.appendChild(stepArea);

    /* Prevention area */
    var prevArea = document.createElement('div');
    prevArea.className = 'story-prevention';
    prevArea.id = 'storyPrevention';
    prevArea.style.cssText =
        'display:none;padding:1rem 1.25rem;margin-bottom:1rem;border-radius:.75rem;' +
        'background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.4);color:#fff;';
    prevArea.innerHTML =
        '<div class="fw-bold text-success mb-1 fs-6"><i class="bi bi-shield-check me-2"></i>' + _esc(getTranslation('stay_safe')) + '</div>' +
        '<div class="text-light small">' + _esc(getTranslation(story.preventionKey)) + '</div>';
    container.appendChild(prevArea);

    /* Controls */
    var controls = document.createElement('div');
    controls.className = 'story-controls d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-25 mt-auto';

    var prevBtn = document.createElement('button');
    prevBtn.className = 'btn btn-sm btn-outline-light';
    prevBtn.id = 'storyPrevBtn';
    prevBtn.innerHTML = '<i class="bi bi-chevron-left me-1"></i>' + _esc(getTranslation('prev_step'));
    prevBtn.addEventListener('click', function () { _prevStep(story); });

    var stepIndicator = document.createElement('span');
    stepIndicator.id = 'storyStepIndicator';
    stepIndicator.className = 'text-light small font-mono';

    var nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-sm btn-primary';
    nextBtn.id = 'storyNextBtn';
    nextBtn.innerHTML = _esc(getTranslation('next_step')) + '<i class="bi bi-chevron-right ms-1"></i>';
    nextBtn.addEventListener('click', function () { _nextStep(story); });

    controls.appendChild(prevBtn);
    controls.appendChild(stepIndicator);
    controls.appendChild(nextBtn);
    container.appendChild(controls);

    // Bottom exit bar
    var exitBar = document.createElement('div');
    exitBar.className = 'd-flex justify-content-center mt-3';
    var exitBtn = document.createElement('button');
    exitBtn.className = 'btn btn-sm btn-outline-secondary';
    exitBtn.innerHTML = '<i class="bi bi-x-circle me-1"></i> ' + _esc(getTranslation('back_to_page'));
    exitBtn.onclick = _closeStory;
    exitBar.appendChild(exitBtn);
    container.appendChild(exitBar);

    _renderStep(story, _activeStepIndex);
    _startAutoPlay(story);
}

/* ------------------------------------------------------------------ */
/*  Step Rendering Details                                             */
/* ------------------------------------------------------------------ */

var _levelColors = { safe: '#28a745', warning: '#ffc107', danger: '#dc3545' };

function _renderStep(story, index) {
    _activeStepIndex = index;
    var step = story.steps[index];
    var area = document.getElementById('storyStepArea');
    if (!area) return;

    var stepEl = document.createElement('div');
    stepEl.className = 'story-step active ' + step.animation;
    stepEl.style.cssText = 'text-align:center;animation:vs-' + step.animation + ' .45s ease forwards;';

    // Level indicator bar
    var bar = document.createElement('div');
    bar.style.cssText =
        'height:6px;border-radius:3px;margin:0 auto 1rem;width:80%;max-width:200px;' +
        'background:' + _levelColors[step.level] + ';transition:background .3s;';
    stepEl.appendChild(bar);

    // Large emoji
    var emoji = document.createElement('div');
    emoji.className = 'story-emoji';
    emoji.style.cssText = 'font-size:4.5rem;line-height:1.1;margin-bottom:0.75rem;filter:drop-shadow(0 0 15px rgba(255,255,255,0.2));';
    emoji.textContent = step.emoji;
    stepEl.appendChild(emoji);

    // Title
    var title = document.createElement('h5');
    title.className = 'fw-bold text-white mb-2';
    title.textContent = getTranslation(step.titleKey);
    stepEl.appendChild(title);

    // Description
    var desc = document.createElement('p');
    desc.className = 'text-light opacity-90 mb-3';
    desc.style.fontSize = '1.02rem';
    desc.textContent = getTranslation(step.descKey);
    stepEl.appendChild(desc);

    // Listen aloud button for this step
    var listenBtn = document.createElement('button');
    listenBtn.className = 'btn btn-sm btn-outline-info rounded-pill px-3 py-1';
    listenBtn.innerHTML = '<i class="bi bi-volume-up-fill me-1"></i> ' + _esc(getTranslation('listen_step'));
    listenBtn.addEventListener('click', function () {
        var text = getTranslation(step.titleKey) + '. ' + getTranslation(step.descKey);
        _speakText(text, listenBtn);
    });
    stepEl.appendChild(listenBtn);

    area.innerHTML = '';
    area.appendChild(stepEl);

    _updateDots(story, index);
    _updateControls(story, index);

    var prevArea = document.getElementById('storyPrevention');
    if (prevArea) prevArea.style.display = index === story.steps.length - 1 ? 'block' : 'none';
}

function _updateDots(story, activeIndex) {
    var bar = document.getElementById('storyProgressBar');
    if (!bar) return;
    var dots = bar.querySelectorAll('.story-progress-dot');
    dots.forEach(function (dot, i) {
        var step = story.steps[i];
        if (i < activeIndex) {
            dot.style.background = _levelColors[step.level];
            dot.style.transform = 'scale(1)';
        } else if (i === activeIndex) {
            dot.style.background = _levelColors[step.level];
            dot.style.transform = 'scale(1.4)';
            dot.style.boxShadow = '0 0 0 3px ' + _levelColors[step.level] + '40';
        } else {
            dot.style.background = 'rgba(255,255,255,0.2)';
            dot.style.transform = 'scale(1)';
            dot.style.boxShadow = 'none';
        }
    });
}

function _updateControls(story, index) {
    var prevBtn = document.getElementById('storyPrevBtn');
    var nextBtn = document.getElementById('storyNextBtn');
    var indicator = document.getElementById('storyStepIndicator');

    if (prevBtn) {
        prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
    }
    if (nextBtn) {
        var isLast = index === story.steps.length - 1;
        nextBtn.innerHTML = isLast
            ? _esc(getTranslation('done')) + ' <i class="bi bi-check-lg ms-1"></i>'
            : _esc(getTranslation('next_step')) + ' <i class="bi bi-chevron-right ms-1"></i>';
        nextBtn.className = isLast ? 'btn btn-sm btn-success' : 'btn btn-sm btn-primary';
    }
    if (indicator) {
        indicator.textContent = getTranslation('step_label') + ' ' + (index + 1) + ' / ' + story.steps.length;
    }
}

function _nextStep(story) {
    if (!story) story = VISUAL_STORIES.find(function (s) { return s.id === _activeStoryId; });
    if (!story) return;

    if (_activeStepIndex < story.steps.length - 1) {
        _renderStep(story, _activeStepIndex + 1);
        _resetAutoPlay(story);
    } else {
        _stopAutoPlay();
        var prevArea = document.getElementById('storyPrevention');
        if (prevArea) prevArea.style.display = 'block';

        var nextBtn = document.getElementById('storyNextBtn');
        if (nextBtn) {
            nextBtn.innerHTML = '<i class="bi bi-x-circle me-1"></i>' + _esc(getTranslation('close_story'));
            nextBtn.className = 'btn btn-sm btn-outline-light';
            nextBtn.onclick = _closeStory;
        }
    }
}

function _prevStep(story) {
    if (!story) story = VISUAL_STORIES.find(function (s) { return s.id === _activeStoryId; });
    if (!story) return;
    if (_activeStepIndex > 0) {
        _renderStep(story, _activeStepIndex - 1);
        _resetAutoPlay(story);
    }
}

function _goToStep(story, index) {
    if (!story) story = VISUAL_STORIES.find(function (s) { return s.id === _activeStoryId; });
    if (!story || index < 0 || index >= story.steps.length) return;
    _renderStep(story, index);
    _resetAutoPlay(story);
}

/* ------------------------------------------------------------------ */
/*  Auto-play for Story Steps                                          */
/* ------------------------------------------------------------------ */

function _startAutoPlay(story) {
    _stopAutoPlay();
    _autoPlayTimer = setInterval(function () {
        if (_isPaused || _currentTab !== 'story') return;
        var s = story || VISUAL_STORIES.find(function (item) { return item.id === _activeStoryId; });
        if (!s) { _stopAutoPlay(); return; }
        if (_activeStepIndex < s.steps.length - 1) {
            _nextStep(s);
        } else {
            _stopAutoPlay();
        }
    }, 4500);
}

function _stopAutoPlay() {
    if (_autoPlayTimer) {
        clearInterval(_autoPlayTimer);
        _autoPlayTimer = null;
    }
}

function _resetAutoPlay(story) {
    _stopAutoPlay();
    _startAutoPlay(story);
}

/* ------------------------------------------------------------------ */
/*  Text-to-Speech Helper                                              */
/* ------------------------------------------------------------------ */

function _speakText(text, btnElement) {
    if (typeof window !== 'undefined' && window.CyberI18n && typeof window.CyberI18n.speak === 'function') {
        window.CyberI18n.speak(text);
        return;
    }

    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    var utterance = new SpeechSynthesisUtterance(text);
    var lang =
        (typeof currentLanguage !== 'undefined' && currentLanguage) ||
        localStorage.getItem('cyber_suraksha_language') ||
        'en';

    var langMap = {
        en: 'en-US', hi: 'hi-IN', te: 'te-IN', ta: 'ta-IN',
        kn: 'kn-IN', ml: 'ml-IN', mr: 'mr-IN', bn: 'bn-IN',
        gu: 'gu-IN', pa: 'pa-IN'
    };
    utterance.lang = langMap[lang] || 'en-US';
    utterance.rate = 0.9;

    if (btnElement) {
        var original = btnElement.innerHTML;
        btnElement.innerHTML = '<i class="bi bi-soundwave text-warning me-1"></i> Speaking...';
        utterance.onend = function () { btnElement.innerHTML = original; };
        utterance.onerror = function () { btnElement.innerHTML = original; };
    }

    window.speechSynthesis.speak(utterance);
}

function _stopSpeech() {
    if (typeof window !== 'undefined' && window.CyberI18n && typeof window.CyberI18n.stopSpeech === 'function') {
        window.CyberI18n.stopSpeech();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}

/* ------------------------------------------------------------------ */
/*  Keyboard Navigation                                                */
/* ------------------------------------------------------------------ */

function _storyKeyHandler(e) {
    if (!_activeStoryId) return;
    if (e.key === 'Escape') {
        e.preventDefault();
        _closeStory();
    } else if (_currentTab === 'story') {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            _nextStep();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            _prevStep();
        }
    }
}

/* ------------------------------------------------------------------ */
/*  Close and Exit Modal (100% Guaranteed to Return to Webpage)        */
/* ------------------------------------------------------------------ */

function _closeStory() {
    _stopAutoPlay();
    _stopSpeech();
    _activeStoryId = null;
    _activeStepIndex = 0;

    var overlay = document.getElementById('storyOverlay');
    if (overlay) {
        // Stop any running video iframe immediately
        var iframes = overlay.querySelectorAll('iframe');
        iframes.forEach(function (iframe) {
            try {
                iframe.src = '';
            } catch (_) {}
        });

        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';

        setTimeout(function () {
            _removeOverlay();
        }, 200);
    }

    // Always restore webpage scrolling
    document.body.style.overflow = '';
    document.removeEventListener('keydown', _storyKeyHandler);
}

function _removeOverlay() {
    var existing = document.getElementById('storyOverlay');
    if (existing) {
        existing.remove();
    }
    document.body.style.overflow = '';
}

/* ------------------------------------------------------------------ */
/*  Critical Keyframe Styles                                           */
/* ------------------------------------------------------------------ */

(function _injectKeyframes() {
    if (document.getElementById('vsStoryKeyframes')) return;
    var style = document.createElement('style');
    style.id = 'vsStoryKeyframes';
    style.textContent =
        '@keyframes vs-fadeInUp{' +
            'from{opacity:0;transform:translateY(20px)}' +
            'to{opacity:1;transform:translateY(0)}' +
        '}' +
        '.story-overlay{transition:opacity .25s ease;}' +
        '.story-overlay.active{opacity:1!important;pointer-events:auto!important;}' +
        '.story-close-btn{pointer-events:auto!important;cursor:pointer!important;}' +
        '@media(max-width:576px){' +
            '.story-overlay-inner{width:96%!important;max-height:96vh!important;border-radius:.85rem!important;}' +
            '.story-emoji{font-size:3.5rem!important;}' +
        '}';
    document.head.appendChild(style);
})();

/* ------------------------------------------------------------------ */
/*  DOM Ready Listener                                                 */
/* ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', initVisualStories);

/* ------------------------------------------------------------------ */
/*  HTML Escaping Utility                                              */
/* ------------------------------------------------------------------ */

function _esc(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// Expose globally
if (typeof window !== 'undefined') {
    window.initVisualStories = initVisualStories;
    window.playStory = playStory;
    window._closeStory = _closeStory;
    window.VISUAL_STORIES = VISUAL_STORIES;
}
