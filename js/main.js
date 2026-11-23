document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Language Handling ---
    const defaultLang = 'en';
    let currentLang = localStorage.getItem('site_lang') || defaultLang;

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

    // --- 2. Layout Initialization (Inlined Header/Footer) ---
    async function loadLayout() {
        // Highlighting active nav links
        highlightActiveNav();

        // Initialize mobile menu events
        initMobileMenu();

        // Update year in footer
        const yearSpan = document.getElementById('year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }

        // Run translations on the entire page, including dynamically loaded content
        setLanguage(currentLang);

        // Run email obfuscation on elements with email-lnk class
        initEmailObfuscation();

        // Dispatch layoutLoaded event so pages can run specific initializations
        document.dispatchEvent(new CustomEvent('layoutLoaded'));
    }

    function ensureTeachingLinks() {
        const desktopNav = document.querySelector('nav .hidden.md\\:flex');
        if (desktopNav && !desktopNav.querySelector('a[href="teaching.html"]')) {
            const cvLink = desktopNav.querySelector('a[href="cv.html"]');
            const teachingLink = document.createElement('a');
            teachingLink.href = 'teaching.html';
            teachingLink.dataset.i18n = 'nav.teaching';
            teachingLink.className = 'teaching-nav nav-link inline-flex items-center rounded-full bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors';
            teachingLink.textContent = 'Teaching';
            desktopNav.insertBefore(teachingLink, cvLink);
        }

        const mobileNav = document.querySelector('#mobile-menu > div');
        if (mobileNav && !mobileNav.querySelector('a[href="teaching.html"]')) {
            const cvLink = mobileNav.querySelector('a[href="cv.html"]');
            const teachingLink = document.createElement('a');
            teachingLink.href = 'teaching.html';
            teachingLink.id = 'mobile-nav-teaching';
            teachingLink.className = 'col-span-2 flex items-center justify-center gap-2 p-3 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md hover:from-indigo-700 hover:to-violet-700 transition-all duration-200 group';
            teachingLink.innerHTML = '<span data-i18n="nav.teaching" class="text-xs font-bold">Teaching &amp; Courses</span>';
            mobileNav.insertBefore(teachingLink, cvLink);
        }
    }

    function highlightActiveNav() {
        let path = window.location.pathname;
        let page = path.split("/").pop();
        if (page === "" || page === "index.html") {
            page = "index.html";
        }

        ensureTeachingLinks();

        // Desktop nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === page) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }

        });

        // Mobile nav links
        const mobileLinks = document.querySelectorAll('#mobile-menu a');
        mobileLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isTeaching = href === 'teaching.html';
            if (href === page) {
                link.className = isTeaching
                    ? "col-span-2 flex items-center justify-center gap-2 p-3 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-700 to-violet-700 text-white shadow-md ring-2 ring-indigo-300 transition-all duration-200 group"
                    : "flex flex-col items-center justify-center p-3 rounded-xl border border-indigo-100 bg-indigo-50/50 text-indigo-600 shadow-sm transition-all duration-200";
                const svg = link.querySelector('svg');
                if (svg) svg.className = isTeaching ? "w-5 h-5 text-white" : "w-6 h-6 mb-1 text-indigo-600";
            } else if (isTeaching) {
                link.className = "col-span-2 flex items-center justify-center gap-2 p-3 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md hover:from-indigo-700 hover:to-violet-700 transition-all duration-200 group";
                const svg = link.querySelector('svg');
                if (svg) svg.className = "w-5 h-5 text-white";
            } else {
                link.className = "flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-white text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-all duration-200 group";
                const svg = link.querySelector('svg');
                if (svg) svg.className = "w-6 h-6 mb-1 text-slate-500 group-hover:text-indigo-600 transition-colors";
            }
        });

        // Only show ATS toggle on cv.html page
        const atsContainer = document.getElementById('ats-toggle-container');
        const atsMobileContainer = document.getElementById('ats-toggle-mobile-container');
        if (page === 'cv.html') {
            if (atsContainer) {
                atsContainer.classList.remove('hidden');
                atsContainer.classList.add('flex');
            }
            if (atsMobileContainer) {
                atsMobileContainer.classList.remove('hidden');
            }
        }
    }

    function initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    function initEmailObfuscation() {
        const emailLinks = document.querySelectorAll('.email-lnk');
        emailLinks.forEach(link => {
            const updateEmail = () => {
                const user = link.getAttribute('data-user');
                const domain = link.getAttribute('data-domain');
                if (user && domain) {
                    link.setAttribute('href', `mailto:${user}@${domain}`);
                }
            };
            link.addEventListener('mouseover', updateEmail);
            link.addEventListener('focus', updateEmail);
            link.addEventListener('click', updateEmail);
        });
    }

    // Start loading the layout
    loadLayout();
});
