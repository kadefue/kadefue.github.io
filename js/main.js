document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Language Handling ---
    const defaultLang = 'en';
    let currentLang = localStorage.getItem('site_lang') || defaultLang;

    // Initialize Language
    setLanguage(currentLang);

    // Provide global access to setLanguage (for onclick events)
    window.changeLanguage = function (lang) {
        setLanguage(lang);
    };

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('site_lang', lang);
        document.documentElement.lang = lang;

        // Update all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = getNestedTranslation(translations[lang], key);
            if (translation) {
                // If the element has children (like active class indicators), handle carefully
                // For now, we assume simple text replacement or innerHTML if needed
                el.innerHTML = translation;
            }
        });

        // Update Toggle Buttons State
        updateLanguageToggles(lang);
    }

    function getNestedTranslation(obj, keyPath) {
        return keyPath.split('.').reduce((prev, curr) => {
            return prev ? prev[curr] : null;
        }, obj);
    }

    function updateLanguageToggles(lang) {
        const enBtns = document.querySelectorAll('.lang-btn-en');
        const swBtns = document.querySelectorAll('.lang-btn-sw');

        enBtns.forEach(btn => {
            if (lang === 'en') {
                btn.classList.add('font-bold', 'text-indigo-600', 'underline');
                btn.classList.remove('text-slate-500');
            } else {
                btn.classList.remove('font-bold', 'text-indigo-600', 'underline');
                btn.classList.add('text-slate-500');
            }
        });

        swBtns.forEach(btn => {
            if (lang === 'sw') {
                btn.classList.add('font-bold', 'text-indigo-600', 'underline');
                btn.classList.remove('text-slate-500');
            } else {
                btn.classList.remove('font-bold', 'text-indigo-600', 'underline');
                btn.classList.add('text-slate-500');
            }
        });
    }

    // --- 2. Mobile Menu Handling ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        // Remove existing listeners to avoid duplicates if this script runs multiple times
        // actually standard DOMContentLoaded runs once, so simple addEventListener is fine
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- 3. Dynamic Year ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
