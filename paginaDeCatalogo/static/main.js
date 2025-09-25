document.addEventListener('DOMContentLoaded', () => {

    const SELECTORS = {
        header: '#header',
        navMenu: '#nav-menu',
        mobileMenuButton: '#mobile-menu-button',
        navLinks: '#nav-menu a',
        navList: '#menu-header-ul',
        navListItems: '#menu-header-ul li',
        divIntroImagen : '.intro-imagen',
        sections: 'section[id]',
        themeToggleButton: '#theme-toggle-button',
        accordionTriggers: '.accordion-trigger',
        contactForm: '#contact-form',
        formStatus: '#form-status',
        modalContainer: '#modal-container',
        modalBody: '#modal-body',
        modalClose: '[data-micromodal-close]',
        openPopupButtons: '.open-popup-btn'
    };

    const initTheme = () => {
        const themeToggleButton = document.querySelector(SELECTORS.themeToggleButton);
        if (!themeToggleButton) return;
        const applyTheme = (theme) => {
            document.documentElement.classList.toggle('dark', theme === 'dark');
            setTimeout(() => window.lucide?.createIcons(), 50);
        };
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'));
        themeToggleButton.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            applyTheme(isDark ? 'dark' : 'light');
        });
    };

    const initMobileMenu = () => {
        const navMenu = document.querySelector(SELECTORS.navMenu);
        const mobileMenuButton = document.querySelector(SELECTORS.mobileMenuButton);
        if (!navMenu || !mobileMenuButton) return;
        mobileMenuButton.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('mobile-open');
            mobileMenuButton.classList.toggle('open');
            mobileMenuButton.setAttribute('aria-expanded', isOpen);
        });
        document.querySelectorAll(SELECTORS.navLinks).forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('mobile-open');
                mobileMenuButton.classList.remove('open');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            });
        });
    };
    
    const initHeaderScroll = () => {
        const header = document.querySelector(SELECTORS.header);
        if (!header) return;
        const handleScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    };

    const initAccordion = () => {
        document.querySelectorAll(SELECTORS.accordionTriggers).forEach(trigger => {
            trigger.addEventListener('click', () => {
                const item = trigger.parentElement;
                const isOpen = item.classList.toggle('active');
                trigger.setAttribute('aria-expanded', isOpen);
            });
        });
    };
    
    const initScrollSpy = () => {
        const sections = document.querySelectorAll(SELECTORS.sections);
        const navList = document.querySelector(SELECTORS.navList);
        if (!navList) return;
        const navItems = new Map();
        document.querySelectorAll(SELECTORS.navListItems).forEach(item => {
            const link = item.querySelector('a')?.getAttribute('href')?.substring(1);
            if (link) navItems.set(link, item);
        });
        const updatePillPosition = () => {
            if (window.innerWidth < 768) return;
            const activeLi = navList.querySelector('.nav-active');
            if (activeLi) {
                navList.style.setProperty('--left', `${activeLi.offsetLeft}px`);
                navList.style.setProperty('--width', `${activeLi.offsetWidth}px`);
            }
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navItems.forEach((item, key) => item.classList.toggle('nav-active', key === id));
                    updatePillPosition();
                }
            });
        }, { rootMargin: '-40% 0px -60% 0px' });
        sections.forEach(section => observer.observe(section));
        window.addEventListener('resize', updatePillPosition);
        setTimeout(updatePillPosition, 100);
    };

    const initContactForm = () => {
        const form = document.querySelector(SELECTORS.contactForm);
        const statusEl = document.querySelector(SELECTORS.formStatus);
        if (!form || !statusEl) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            statusEl.textContent = 'Enviando...';
            statusEl.style.color = 'var(--muted-foreground)';
            setTimeout(() => {
                statusEl.textContent = '¡Mensaje enviado con éxito!';
                statusEl.style.color = 'green';
                form.reset();
                setTimeout(() => statusEl.textContent = '', 3000);
            }, 1500);
        });
    };

    const initPopupModal = () => {
        const modalContainer = document.querySelector(SELECTORS.modalContainer);
        const modalBody = document.querySelector(SELECTORS.modalBody);
        if (!modalContainer || !modalBody) return;
        const openModal = async (url) => {
            try {
                modalContainer.classList.add('is-open');
                document.body.style.overflow = 'hidden';
                modalBody.innerHTML = '<p>Cargando...</p>';
                const response = await fetch(url);
                if (!response.ok) throw new Error('Respuesta del servidor no fue OK.');
                const htmlContent = await response.text();
                modalBody.innerHTML = htmlContent;
                window.lucide?.createIcons();
            } catch (error) {
                modalBody.innerHTML = `<p>Error al mostrar el producto: ${error.message}</p>`;
            }
        };
        const closeModal = () => {
            modalContainer.classList.remove('is-open');
            document.body.style.overflow = '';
            modalBody.innerHTML = '';
        };
        document.body.addEventListener('click', (e) => {
            const button = e.target.closest(SELECTORS.openPopupButtons);
            if (button) {
                e.preventDefault();
                const productUrl = button.dataset.url;
                if (productUrl) openModal(productUrl);
            }
        });
        modalContainer.addEventListener('click', (e) => {
            if (e.target.matches(SELECTORS.modalClose) || e.target.classList.contains('modal-overlay')) {
                closeModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && modalContainer.classList.contains('is-open')) {
                closeModal();
            }
        });
    };

    const initAnimacionImagenIntro = () => {
        const divIntroImagen = document.querySelector(SELECTORS.divIntroImagen);
        if (!divIntroImagen) return;

        divIntroImagen.addEventListener('mouseenter', () => {
            divIntroImagen.classList.add('animate-rotar');
            divIntroImagen.classList.remove('animate-rotar-reverse');
        });

        divIntroImagen.addEventListener('mouseleave', () => {
            divIntroImagen.classList.add('animate-rotar-reverse');
            divIntroImagen.classList.remove('animate-rotar');        });
    };


    
    // Inicializar todos los módulos
    initTheme();
    initMobileMenu();
    initHeaderScroll();
    initAccordion();
    initScrollSpy();
    initContactForm();
    initPopupModal();
    initAnimacionImagenIntro();
});