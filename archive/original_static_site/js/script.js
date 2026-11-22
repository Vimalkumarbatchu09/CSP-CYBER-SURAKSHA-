/**
 * ==========================================================================
 * CYBER SURAKSHA - Frontend JavaScript Logic
 * Modern Cybersecurity Awareness & Protection Platform
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarBehavior();
  initTooltipsAndToasts();
  initPasswordChecker();
  initPhishingChecker();
  initSecurityChecklist();
  initCyberQuiz();
  initDashboardScanner();
  initMfaSimulator();
  initFormValidations();
});

/* ==========================================================================
   1. GLOBAL NAVBAR & SCROLL BEHAVIOR
   ========================================================================== */
function initNavbarBehavior() {
  const navbar = document.querySelector('.navbar-cyber');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Active page detection
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Auto-collapse mobile navbar on link click
  const navCollapse = document.getElementById('cyberNavbar');
  if (navCollapse) {
    const navItems = navCollapse.querySelectorAll('.nav-link, .btn');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth < 992 && navCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      });
    });
  }
}

function initTooltipsAndToasts() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

/* ==========================================================================
   2. PASSWORD STRENGTH CHECKER (Pure Frontend)
   ========================================================================== */
function initPasswordChecker() {
  const passwordInput = document.getElementById('pwdInput');
  if (!passwordInput) return;

  const strengthBar = document.getElementById('pwdStrengthBar');
  const strengthLabel = document.getElementById('pwdStrengthLabel');
  const crackTime = document.getElementById('pwdCrackTime');
  const suggestionsBox = document.getElementById('pwdSuggestions');
  const toggleBtn = document.getElementById('togglePwdVisibility');

  // Show/Hide password toggle
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      toggleBtn.innerHTML = type === 'password' 
        ? '<i class="bi bi-eye"></i>' 
        : '<i class="bi bi-eye-slash text-cyan"></i>';
    });
  }

  passwordInput.addEventListener('input', () => {
    const pwd = passwordInput.value;
    evaluatePasswordStrength(pwd);
  });

  function evaluatePasswordStrength(pwd) {
    if (!pwd || pwd.length === 0) {
      if (strengthBar) {
        strengthBar.style.width = '0%';
        strengthBar.className = 'strength-meter-bar';
      }
      if (strengthLabel) strengthLabel.textContent = 'Enter a password';
      if (crackTime) crackTime.textContent = 'Instant';
      resetRules();
      if (suggestionsBox) suggestionsBox.innerHTML = '<li class="text-muted"><i class="bi bi-info-circle me-1"></i> Enter a password above to evaluate its security.</li>';
      return;
    }

    // Rules verification
    const hasMinLength = pwd.length >= 8;
    const hasLongLength = pwd.length >= 12;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

    // Common dangerous patterns
    const commonPatterns = ['password', '123456', '12345678', 'qwerty', 'admin', 'welcome', 'letmein', 'abc123'];
    const isCommon = commonPatterns.some(pat => pwd.toLowerCase().includes(pat));

    // Update rule checklist icons
    updateRuleState('rule-len', hasMinLength);
    updateRuleState('rule-upper', hasUpper);
    updateRuleState('rule-lower', hasLower);
    updateRuleState('rule-number', hasNumber);
    updateRuleState('rule-special', hasSpecial);

    // Score computation (0 to 4)
    let score = 0;
    if (hasMinLength) score += 1;
    if (hasLongLength) score += 1;
    if (hasLower && hasUpper) score += 1;
    if (hasNumber && hasSpecial) score += 1;
    if (isCommon) score = Math.max(0, score - 2);

    let strengthText = 'Weak';
    let barWidth = '25%';
    let barColor = 'bg-danger';
    let crackEstimate = 'Seconds to minutes';

    if (score === 0 || score === 1) {
      strengthText = 'Weak';
      barWidth = '25%';
      barColor = 'bg-danger';
      crackEstimate = 'Instant to 2 minutes';
    } else if (score === 2) {
      strengthText = 'Medium';
      barWidth = '50%';
      barColor = 'bg-warning';
      crackEstimate = 'A few hours to days';
    } else if (score === 3) {
      strengthText = 'Strong';
      barWidth = '75%';
      barColor = 'bg-info';
      crackEstimate = 'Months to hundreds of years';
    } else if (score >= 4) {
      strengthText = 'Very Strong';
      barWidth = '100%';
      barColor = 'bg-success';
      crackEstimate = 'Centuries to millennia';
    }

    if (strengthBar) {
      strengthBar.style.width = barWidth;
      strengthBar.className = `strength-meter-bar ${barColor}`;
    }
    if (strengthLabel) {
      strengthLabel.textContent = strengthText;
      strengthLabel.className = `fw-bold ${score >= 3 ? 'text-success' : score === 2 ? 'text-warning' : 'text-danger'}`;
    }
    if (crackTime) {
      crackTime.textContent = crackEstimate;
    }

    // Dynamic suggestions
    const suggestions = [];
    if (!hasMinLength) suggestions.push('Make your password at least 8 characters (12+ recommended).');
    if (!hasUpper) suggestions.push('Include at least one UPPERCASE letter (A-Z).');
    if (!hasLower) suggestions.push('Include at least one lowercase letter (a-z).');
    if (!hasNumber) suggestions.push('Add numerical digits (0-9).');
    if (!hasSpecial) suggestions.push('Include special symbols (e.g. @, #, $, %, !, &).');
    if (isCommon) suggestions.push('Avoid common dictionary words like "password" or sequential digits.');
    if (score >= 4) suggestions.push('Excellent! This password is highly resilient against brute-force attacks.');

    if (suggestionsBox) {
      suggestionsBox.innerHTML = suggestions.map(s => `
        <li class="${score >= 4 ? 'text-success' : 'text-warning'}">
          <i class="bi bi-${score >= 4 ? 'shield-check' : 'lightbulb'} me-1"></i> ${s}
        </li>
      `).join('');
    }
  }

  function updateRuleState(elementId, isValid) {
    const el = document.getElementById(elementId);
    if (!el) return;
    if (isValid) {
      el.classList.add('valid');
      el.classList.remove('invalid');
      const icon = el.querySelector('i');
      if (icon) icon.className = 'bi bi-check-circle-fill text-success';
    } else {
      el.classList.add('invalid');
      el.classList.remove('valid');
      const icon = el.querySelector('i');
      if (icon) icon.className = 'bi bi-circle text-muted';
    }
  }

  function resetRules() {
    ['rule-len', 'rule-upper', 'rule-lower', 'rule-number', 'rule-special'].forEach(id => {
      updateRuleState(id, false);
    });
  }
}

/* ==========================================================================
   3. PHISHING AWARENESS CHECKER (Frontend Demonstration)
   ========================================================================== */
function initPhishingChecker() {
  const phishingInput = document.getElementById('phishingInput');
  const checkBtn = document.getElementById('btnCheckPhishing');
  const resultBox = document.getElementById('phishingResult');
  if (!phishingInput || !checkBtn || !resultBox) return;

  // Preset sample buttons
  const sampleBad1 = document.getElementById('samplePhish1');
  const sampleBad2 = document.getElementById('samplePhish2');
  const sampleGood = document.getElementById('sampleSafe');

  if (sampleBad1) {
    sampleBad1.addEventListener('click', () => {
      phishingInput.value = 'http://paypa1-security-verification.xyz/login?account=urgent';
      analyzePhishingInput();
    });
  }
  if (sampleBad2) {
    sampleBad2.addEventListener('click', () => {
      phishingInput.value = 'URGENT: Your bank account will be closed in 24 hours. Verify your OTP now at http://192.168.1.105/auth';
      analyzePhishingInput();
    });
  }
  if (sampleGood) {
    sampleGood.addEventListener('click', () => {
      phishingInput.value = 'https://www.paypal.com/signin';
      analyzePhishingInput();
    });
  }

  checkBtn.addEventListener('click', analyzePhishingInput);
  phishingInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') analyzePhishingInput();
  });

  function analyzePhishingInput() {
    const text = phishingInput.value.trim();
    if (!text) {
      alert('Please enter a URL or message to analyze.');
      return;
    }

    const lower = text.toLowerCase();
    const warnings = [];
    let riskLevel = 'Safe';
    let riskColor = 'success';
    let riskBadge = 'Low Risk / Safe';

    // Heuristics
    const suspiciousKeywords = [
      'urgent', 'account suspended', 'verify your account', 'verify your identity',
      'claim prize', 'winner', 'lottery', 'wire transfer', 'otp', 'password reset immediately',
      'unauthorized transaction', 'restricted access', 'click here now', 'bank alert'
    ];

    const suspiciousTLDs = ['.xyz', '.top', '.ru', '.buzz', '.click', '.tk', '.work', '.cn', '.gq'];
    const typoSquats = ['paypa1', 'amaz0n', 'netfl1x', 'g00gle', 'micros0ft', 'appl-id', 'faceb00k'];

    // 1. Insecure protocol
    if (lower.startsWith('http://')) {
      warnings.push('Insecure connection: The link uses unencrypted "http://" instead of secure "https://".');
    }

    // 2. IP address as domain
    if (/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(lower)) {
      warnings.push('Raw IP Address detected instead of a legitimate registered domain name.');
    }

    // 3. Typo-squatting
    typoSquats.forEach(brand => {
      if (lower.includes(brand)) {
        warnings.push(`Deceptive brand imitation detected (looks like an impostor: "${brand}").`);
      }
    });

    // 4. Suspicious TLD
    suspiciousTLDs.forEach(tld => {
      if (lower.includes(tld)) {
        warnings.push(`High-risk Top-Level Domain detected (${tld}), commonly exploited in phishing campaigns.`);
      }
    });

    // 5. Urgent language / pressure tactics
    suspiciousKeywords.forEach(kw => {
      if (lower.includes(kw)) {
        warnings.push(`Psychological urgency keyword detected: "${kw}". Scammers often manufacture panic.`);
      }
    });

    // 6. Suspicious characters
    if (lower.includes('@') && lower.includes('http')) {
      warnings.push('Suspicious URL structure containing "@" character, frequently used to obscure the true destination.');
    }

    // Scoring
    if (warnings.length >= 3) {
      riskLevel = 'High Risk';
      riskColor = 'danger';
      riskBadge = 'High Risk Detected';
    } else if (warnings.length >= 1) {
      riskLevel = 'Suspicious';
      riskColor = 'warning';
      riskBadge = 'Suspicious Indicators Found';
    } else {
      riskLevel = 'Safe';
      riskColor = 'success';
      riskBadge = 'No Obvious Flags (Safe)';
    }

    resultBox.classList.remove('d-none');
    resultBox.innerHTML = `
      <div class="card bg-card border-${riskColor} p-4 mt-3">
        <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <div class="d-flex align-items-center gap-2">
            <span class="badge bg-${riskColor} px-3 py-2 fs-6">
              <i class="bi bi-${riskColor === 'success' ? 'shield-check' : riskColor === 'warning' ? 'exclamation-triangle' : 'shield-x'} me-1"></i>
              ${riskBadge}
            </span>
          </div>
          <span class="text-muted small"><i class="bi bi-clock me-1"></i> Checked just now</span>
        </div>

        <h5 class="text-white mb-2">Analysis Breakdown:</h5>
        ${warnings.length > 0 ? `
          <ul class="mb-3 text-secondary ps-3">
            ${warnings.map(w => `<li class="mb-1 text-light"><strong class="text-${riskColor}">Warning:</strong> ${w}</li>`).join('')}
          </ul>
        ` : `
          <p class="text-secondary mb-3">No common phishing keywords, deceptive domains, or insecure URL formats were identified in this sample.</p>
        `}

        <div class="p-3 rounded bg-secondary bg-opacity-10 border border-secondary border-opacity-25">
          <strong class="text-cyan"><i class="bi bi-info-circle me-1"></i> Educational Note:</strong>
          <p class="mb-0 text-secondary small">
            This is a frontend awareness heuristic tool designed for college demonstration. Always verify the domain in your browser's address bar, never share OTPs, and directly visit official portals rather than clicking unsolicited links.
          </p>
        </div>
      </div>
    `;
  }
}

/* ==========================================================================
   4. CYBER SECURITY CHECKLIST (Dynamic Calculator & LocalStorage)
   ========================================================================== */
function initSecurityChecklist() {
  const checklistForm = document.getElementById('cyberChecklistForm');
  if (!checklistForm) return;

  const checkboxes = checklistForm.querySelectorAll('.checklist-item');
  const progressBar = document.getElementById('checklistProgressBar');
  const percentText = document.getElementById('checklistPercent');
  const statusBadge = document.getElementById('checklistStatusBadge');
  const resetBtn = document.getElementById('btnResetChecklist');

  // Load stored state if available
  const stored = JSON.parse(localStorage.getItem('cyber_checklist_state') || '[]');
  checkboxes.forEach((cb, idx) => {
    if (stored[idx]) cb.checked = true;
    cb.addEventListener('change', updateChecklistProgress);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      checkboxes.forEach(cb => cb.checked = false);
      localStorage.removeItem('cyber_checklist_state');
      updateChecklistProgress();
    });
  }

  updateChecklistProgress();

  function updateChecklistProgress() {
    let checkedCount = 0;
    const state = [];

    checkboxes.forEach(cb => {
      if (cb.checked) checkedCount++;
      state.push(cb.checked);
    });

    localStorage.setItem('cyber_checklist_state', JSON.stringify(state));

    const total = checkboxes.length || 8;
    const percent = Math.round((checkedCount / total) * 100);

    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }
    if (percentText) {
      percentText.textContent = `${percent}%`;
    }

    if (statusBadge) {
      if (percent < 40) {
        statusBadge.textContent = 'High Exposure';
        statusBadge.className = 'badge badge-risk-critical';
      } else if (percent < 75) {
        statusBadge.textContent = 'Moderate Defense';
        statusBadge.className = 'badge badge-risk-medium';
      } else if (percent < 100) {
        statusBadge.textContent = 'Strongly Hardened';
        statusBadge.className = 'badge badge-safe';
      } else {
        statusBadge.textContent = 'Optimal Protection';
        statusBadge.className = 'badge badge-safe bg-success text-white';
      }
    }
  }
}

/* ==========================================================================
   5. CYBERSECURITY AWARENESS QUIZ ENGINE
   ========================================================================== */
const quizQuestions = [
  {
    question: "What is Phishing?",
    options: [
      "A legitimate method used by banks to verify passwords over email",
      "A fraudulent attempt to steal sensitive information by masquerading as a trustworthy entity",
      "A programming language used for cyber defense",
      "An automated backup protocol for cloud databases"
    ],
    answer: 1,
    explanation: "Phishing is a social engineering attack where attackers deceive individuals into sharing sensitive data such as login credentials, credit card numbers, or OTPs."
  },
  {
    question: "What does MFA stand for and why is it important?",
    options: [
      "Multiple Firewall Architecture — stops DDoS attacks",
      "Multi-Factor Authentication — adds extra verification layers beyond passwords",
      "Master File Access — gives users full administrative rights",
      "Modular Fiber Adapter — boosts internet transmission speeds"
    ],
    answer: 1,
    explanation: "Multi-Factor Authentication (MFA) requires two or more verification methods (e.g. password + phone code), protecting your account even if your password is stolen."
  },
  {
    question: "Should you ever share a One-Time Password (OTP) with a caller claiming to be your bank representative?",
    options: [
      "Yes, if they verify your account number and name first",
      "Yes, if they claim it is urgent to reverse a fraudulent charge",
      "Never. Legitimate banks and support teams will never ask for your OTP",
      "Only if they send you an official-looking SMS first"
    ],
    answer: 2,
    explanation: "Never disclose OTPs to anyone. Real banks and services will NEVER contact you requesting your one-time passcode. Sharing an OTP allows scammers to authorize transactions."
  },
  {
    question: "What makes a password strong and resilient against brute-force attacks?",
    options: [
      "Using your pet's name followed by '123'",
      "A combination of at least 12+ characters including upper, lower, numbers, and symbols",
      "A short 6-digit PIN that is easy to memorize",
      "Reusing the same complex password on all accounts"
    ],
    answer: 1,
    explanation: "A strong password has sufficient length (12-16+ characters), contains diverse character types (upper, lower, digits, symbols), and avoids predictable dictionary words or personal information."
  },
  {
    question: "You receive an unexpected SMS: 'Your parcel is delayed. Click here to confirm address: bit.ly/3xX9P'. What should you do?",
    options: [
      "Click immediately to see if someone sent you a surprise gift",
      "Reply with your credit card details to pay the delivery fee",
      "Do not click the shortened link; inspect the courier service via their official application or website",
      "Forward the link to all your friends to see if it belongs to them"
    ],
    answer: 2,
    explanation: "Unexpected SMS delivery notifications with shortened links are typical 'Smishing' attacks designed to install malware or steal payment details."
  },
  {
    question: "What is Ransomware?",
    options: [
      "Software that speeds up your operating system",
      "Malicious software that encrypts a victim's files and demands payment to restore access",
      "A free antivirus tool provided by Microsoft",
      "A hardware component that prevents unauthorized Wi-Fi access"
    ],
    answer: 1,
    explanation: "Ransomware is malicious software designed to block access to a computer system or encrypt confidential files until a sum of money (ransom) is paid."
  },
  {
    question: "Why should you avoid using the same password across multiple online accounts?",
    options: [
      "Because password managers will not let you duplicate passwords",
      "Because if one service suffers a data breach, attackers will test that password on all your other accounts (credential stuffing)",
      "It consumes too much internet bandwidth",
      "Browser memory will get corrupted"
    ],
    answer: 1,
    explanation: "When you reuse passwords, a single breach on an obscure website exposes your primary email, banking, and social media accounts to credential stuffing."
  },
  {
    question: "What is the best practice when connecting to public airport or cafe Wi-Fi?",
    options: [
      "Perform online net banking and wire transfers right away",
      "Disable all device firewalls for faster connection speeds",
      "Use a Virtual Private Network (VPN) and avoid entering sensitive credentials on unencrypted sites",
      "Share your network folder with all local devices"
    ],
    answer: 2,
    explanation: "Public Wi-Fi is often unsecured and prone to eavesdropping / Man-in-the-Middle (MitM) attacks. Always use a trusted VPN to encrypt your traffic."
  }
];

function initCyberQuiz() {
  const quizBox = document.getElementById('quizContainer');
  if (!quizBox) return;

  let currentQuestion = 0;
  let userAnswers = new Array(quizQuestions.length).fill(null);

  const questionText = document.getElementById('quizQuestionText');
  const optionsBox = document.getElementById('quizOptionsContainer');
  const questionCount = document.getElementById('quizQuestionCounter');
  const quizProgress = document.getElementById('quizProgressBar');
  const prevBtn = document.getElementById('quizPrevBtn');
  const nextBtn = document.getElementById('quizNextBtn');
  const resultCard = document.getElementById('quizResultCard');
  const quizBody = document.getElementById('quizActiveBody');

  function renderQuestion(index) {
    const q = quizQuestions[index];
    if (!q) return;

    if (questionText) questionText.textContent = `${index + 1}. ${q.question}`;
    if (questionCount) questionCount.textContent = `Question ${index + 1} of ${quizQuestions.length}`;

    const percent = Math.round(((index + 1) / quizQuestions.length) * 100);
    if (quizProgress) quizProgress.style.width = `${percent}%`;

    if (optionsBox) {
      optionsBox.innerHTML = q.options.map((opt, i) => {
        const isSelected = userAnswers[index] === i;
        return `
          <div class="quiz-option-card p-3 mb-2 rounded border ${isSelected ? 'border-info bg-primary bg-opacity-10' : 'border-secondary border-opacity-25 bg-card'} cursor-pointer" 
               style="cursor: pointer; transition: all 0.2s ease;"
               onclick="window.selectQuizOption(${index}, ${i})">
            <div class="form-check">
              <input class="form-check-input cyber-checkbox" type="radio" name="quizOpt" id="opt_${i}" ${isSelected ? 'checked' : ''}>
              <label class="form-check-label text-light w-100" for="opt_${i}" style="cursor: pointer;">
                ${opt}
              </label>
            </div>
          </div>
        `;
      }).join('');
    }

    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) {
      nextBtn.textContent = index === quizQuestions.length - 1 ? 'Finish & See Results' : 'Next Question';
    }
  }

  window.selectQuizOption = function(qIdx, optIdx) {
    userAnswers[qIdx] = optIdx;
    renderQuestion(qIdx);
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion(currentQuestion);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (userAnswers[currentQuestion] === null) {
        alert('Please choose an answer to proceed.');
        return;
      }

      if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        renderQuestion(currentQuestion);
      } else {
        // Compute Results
        displayQuizResults();
      }
    });
  }

  function displayQuizResults() {
    let score = 0;
    userAnswers.forEach((ans, idx) => {
      if (ans === quizQuestions[idx].answer) score++;
    });

    const percentage = Math.round((score / quizQuestions.length) * 100);
    let title = 'Cyber Guardian';
    let badgeColor = 'success';
    let advice = 'Outstanding! You possess sharp cybersecurity awareness and follow safe cyber hygiene principles.';

    if (percentage < 50) {
      title = 'Security Novice';
      badgeColor = 'danger';
      advice = 'You are at high risk of online scams and attacks. We strongly suggest reviewing our Awareness and Threats sections to strengthen your knowledge.';
    } else if (percentage < 80) {
      title = 'Security Trainee';
      badgeColor = 'warning';
      advice = 'Good baseline understanding, but you have a few vulnerability blind spots. Review password hygiene and phishing red flags.';
    }

    if (quizBody) quizBody.classList.add('d-none');
    if (resultCard) {
      resultCard.classList.remove('d-none');
      resultCard.innerHTML = `
        <div class="text-center p-4">
          <div class="mb-3">
            <span class="badge bg-${badgeColor} px-4 py-2 fs-5 text-uppercase">
              <i class="bi bi-shield-check me-2"></i>${title}
            </span>
          </div>
          <h2 class="display-4 fw-bold text-white mb-1">${score} / ${quizQuestions.length}</h2>
          <p class="fs-5 text-cyan mb-4 font-mono">Score: ${percentage}%</p>
          <div class="alert alert-dark border border-${badgeColor} text-start p-4 mx-auto mb-4" style="max-width: 650px;">
            <h6 class="text-white fw-bold mb-2"><i class="bi bi-award me-2 text-cyan"></i>Security Recommendation:</h6>
            <p class="text-secondary mb-0">${advice}</p>
          </div>

          <div class="d-flex justify-content-center gap-3 flex-wrap">
            <button class="btn btn-cyber-primary" id="btnRetakeQuiz">
              <i class="bi bi-arrow-repeat me-1"></i> Retake Quiz
            </button>
            <button class="btn btn-cyber-outline" id="btnReviewAnswers">
              <i class="bi bi-card-checklist me-1"></i> Review Explanations
            </button>
          </div>

          <div id="quizReviewContainer" class="text-start mt-4 d-none" style="max-width: 750px; margin: 0 auto;">
            <hr class="border-secondary mb-4">
            <h5 class="text-white mb-3">Detailed Answers & Explanations:</h5>
            ${quizQuestions.map((q, i) => {
              const isCorrect = userAnswers[i] === q.answer;
              return `
                <div class="p-3 mb-3 rounded bg-card border ${isCorrect ? 'border-success' : 'border-danger'}">
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="fw-bold text-white">${i + 1}. ${q.question}</span>
                    <span class="badge ${isCorrect ? 'bg-success' : 'bg-danger'}">${isCorrect ? 'Correct' : 'Incorrect'}</span>
                  </div>
                  <p class="mb-1 text-secondary small">Your Choice: <strong class="${isCorrect ? 'text-success' : 'text-danger'}">${q.options[userAnswers[i]] || 'None'}</strong></p>
                  ${!isCorrect ? `<p class="mb-1 text-secondary small">Correct Answer: <strong class="text-success">${q.options[q.answer]}</strong></p>` : ''}
                  <div class="mt-2 p-2 bg-secondary bg-opacity-10 rounded border border-secondary border-opacity-25 small text-cyan">
                    <strong>Why:</strong> ${q.explanation}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

      document.getElementById('btnRetakeQuiz')?.addEventListener('click', () => {
        currentQuestion = 0;
        userAnswers = new Array(quizQuestions.length).fill(null);
        resultCard.classList.add('d-none');
        quizBody.classList.remove('d-none');
        renderQuestion(0);
      });

      document.getElementById('btnReviewAnswers')?.addEventListener('click', () => {
        const reviewBox = document.getElementById('quizReviewContainer');
        if (reviewBox) reviewBox.classList.toggle('d-none');
      });
    }
  }

  // Initial render
  renderQuestion(0);
}

/* ==========================================================================
   6. USER DASHBOARD MOCK SCANNER
   ========================================================================== */
function initDashboardScanner() {
  const scanBtn = document.getElementById('btnStartSecurityScan');
  const scanModalEl = document.getElementById('securityScanModal');
  if (!scanBtn || !scanModalEl) return;

  const bsScanModal = new bootstrap.Modal(scanModalEl);
  const scanStatusText = document.getElementById('scanStatusMessage');
  const scanProgressBar = document.getElementById('scanModalProgress');
  const scanLog = document.getElementById('scanTerminalLog');

  scanBtn.addEventListener('click', () => {
    bsScanModal.show();
    runSimulatedScan();
  });

  function runSimulatedScan() {
    if (!scanStatusText || !scanProgressBar || !scanLog) return;
    scanProgressBar.style.width = '10%';
    scanStatusText.textContent = 'Initializing cyber diagnostic probes...';
    scanLog.innerHTML = `<div class="text-muted font-mono">> Initiating Cyber Suraksha local audit...</div>`;

    const steps = [
      { p: 30, text: 'Auditing browser security settings & cookie policies...', log: '> [PASS] TLS 1.3 encryption verified.' },
      { p: 55, text: 'Evaluating credential entropy and MFA protocols...', log: '> [PASS] Two-factor authentication active on primary identity.' },
      { p: 80, text: 'Scanning network ports and DNS security records...', log: '> [PASS] No unencrypted proxy leaks identified.' },
      { p: 100, text: 'System posture audit complete. Device secure!', log: '> [COMPLETE] Security posture indexed: 84/100 Protected.' }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        scanProgressBar.style.width = `${step.p}%`;
        scanStatusText.textContent = step.text;
        scanLog.innerHTML += `<div class="text-cyan font-mono">${step.log}</div>`;
        scanLog.scrollTop = scanLog.scrollHeight;

        if (index === steps.length - 1) {
          setTimeout(() => {
            const auditBtn = document.getElementById('scanDoneBtn');
            if (auditBtn) auditBtn.classList.remove('d-none');
          }, 400);
        }
      }, (index + 1) * 900);
    });
  }
}

/* ==========================================================================
   7. MULTI-FACTOR AUTHENTICATION SIMULATOR (mfa.html)
   ========================================================================== */
function initMfaSimulator() {
  const step1Form = document.getElementById('mfaDemoStep1');
  const step2Box = document.getElementById('mfaDemoStep2');
  const step3Success = document.getElementById('mfaDemoSuccess');
  const otpInput = document.getElementById('mfaDemoOtpInput');
  const verifyOtpBtn = document.getElementById('btnVerifyOtp');
  const simulatedOtpDisplay = document.getElementById('demoSimulatedOtp');
  const resetMfaBtn = document.getElementById('btnResetMfaDemo');

  if (!step1Form || !step2Box) return;

  let generatedOtp = '482910';

  step1Form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Generate random 6-digit OTP
    generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    if (simulatedOtpDisplay) simulatedOtpDisplay.textContent = generatedOtp;

    step1Form.classList.add('d-none');
    step2Box.classList.remove('d-none');
  });

  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', () => {
      const entered = otpInput ? otpInput.value.trim() : '';
      if (entered === generatedOtp) {
        step2Box.classList.add('d-none');
        if (step3Success) step3Success.classList.remove('d-none');
      } else {
        alert('Invalid OTP code. Please enter the simulated 6-digit code shown on screen.');
      }
    });
  }

  if (resetMfaBtn) {
    resetMfaBtn.addEventListener('click', () => {
      if (step3Success) step3Success.classList.add('d-none');
      if (step2Box) step2Box.classList.add('d-none');
      step1Form.classList.remove('d-none');
      if (otpInput) otpInput.value = '';
    });
  }
}

/* ==========================================================================
   8. FORM VALIDATION & DEMO HELPERS (Login, Signup, Contact)
   ========================================================================== */
function initFormValidations() {
  // Login Form
  const loginForm = document.getElementById('cyberLoginForm');
  const autofillBtn = document.getElementById('btnDemoAutofill');

  if (autofillBtn && loginForm) {
    autofillBtn.addEventListener('click', () => {
      const emailInput = document.getElementById('loginEmail');
      const pwdInput = document.getElementById('loginPassword');
      if (emailInput) emailInput.value = 'demo.student@cybersuraksha.edu';
      if (pwdInput) pwdInput.value = 'Suraksha@2026#Secure';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!loginForm.checkValidity()) {
        e.stopPropagation();
        loginForm.classList.add('was-validated');
        return;
      }
      alert('Demo Authentication Successful! Redirecting to Security Dashboard...');
      window.location.href = 'dashboard.html';
    });
  }

  // Sign Up Form
  const signupForm = document.getElementById('cyberSignupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pwd = document.getElementById('signupPassword')?.value;
      const pwdConfirm = document.getElementById('signupConfirmPassword')?.value;

      if (pwd !== pwdConfirm) {
        alert('Passwords do not match! Please verify your password entry.');
        return;
      }

      if (!signupForm.checkValidity()) {
        e.stopPropagation();
        signupForm.classList.add('was-validated');
        return;
      }

      alert('Account registered successfully in demonstration mode! Please log in.');
      window.location.href = 'login.html';
    });
  }

  // Contact Form
  const contactForm = document.getElementById('cyberContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        e.stopPropagation();
        contactForm.classList.add('was-validated');
        return;
      }

      const alertBox = document.getElementById('contactSuccessAlert');
      if (alertBox) {
        alertBox.classList.remove('d-none');
      } else {
        alert('Thank you for contacting Cyber Suraksha! Your inquiry has been submitted in demonstration mode.');
      }
      contactForm.reset();
      contactForm.classList.remove('was-validated');
    });
  }
}
