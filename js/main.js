/**
 * ============================================
 * PORTFOLIO LUCAS MARTIN - PHOTOGRAPHE
 * Script principal
 * ============================================
 */

'use strict';

/**
 * ============================================
 * FILTRES DE LA GALERIE PORTFOLIO
 * Gère le filtrage des photos par catégorie
 * ============================================
 */
const initPortfolioFilters = () => {
    // Sélection des éléments
    const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Si pas de filtres ou d'items, on arrête
    if (filterButtons.length === 0 || galleryItems.length === 0) return;
    
    /**
     * Filtre les éléments de la galerie selon la catégorie
     * @param {string} category - Catégorie à afficher ('all' pour tout)
     */
    const filterGallery = (category) => {
        galleryItems.forEach((item, index) => {
            const itemCategory = item.dataset.category;
            const shouldShow = category === 'all' || itemCategory === category;
            
            if (shouldShow) {
                // Afficher l'élément avec animation
                item.classList.remove('hidden');
                item.classList.add('visible');
                
                // Délai progressif pour effet cascade
                const delay = (index % 12) * 50;
                item.style.animationDelay = `${delay}ms`;
            } else {
                // Cacher l'élément
                item.classList.add('hidden');
                item.classList.remove('visible');
            }
        });
    };
    
    /**
     * Met à jour l'état actif des boutons
     * @param {HTMLElement} activeButton - Bouton à activer
     */
    const updateActiveButton = (activeButton) => {
        filterButtons.forEach(btn => {
            btn.classList.remove('portfolio-filter-btn--active', 'active');
            btn.setAttribute('aria-pressed', 'false');
        });
        
        activeButton.classList.add('portfolio-filter-btn--active', 'active');
        activeButton.setAttribute('aria-pressed', 'true');
    };
    
    // Écouteurs d'événements sur les boutons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Mise à jour de l'état actif
            updateActiveButton(button);
            
            // Filtrage de la galerie
            filterGallery(filter);
        });
    });
    
    // Afficher tous les éléments au chargement avec animation
    galleryItems.forEach((item, index) => {
        item.classList.add('visible');
        const delay = (index % 12) * 50;
        item.style.animationDelay = `${delay}ms`;
    });
};

/**
 * ============================================
 * ANIMATION AU SCROLL - INTERSECTION OBSERVER
 * Révèle les éléments quand ils entrent dans le viewport
 * ============================================
 */
const initScrollAnimations = () => {
    const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale');
    
    if (revealElements.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optionnel : arrêter d'observer après révélation
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => revealObserver.observe(el));
};

/**
 * ============================================
 * MENU MOBILE
 * Gère l'ouverture/fermeture du menu hamburger
 * ============================================
 */
const initMobileMenu = () => {
    const menuToggle = document.querySelector('.header-menu-toggle');
    const nav = document.querySelector('.header-nav');
    const body = document.body;
    
    if (!menuToggle || !nav) return;
    
    const toggleMenu = () => {
        const isOpen = body.classList.contains('nav-open');
        
        if (isOpen) {
            // Fermer le menu
            body.classList.remove('nav-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Ouvrir le menu de navigation');
        } else {
            // Ouvrir le menu
            body.classList.add('nav-open');
            menuToggle.setAttribute('aria-expanded', 'true');
            menuToggle.setAttribute('aria-label', 'Fermer le menu de navigation');
        }
    };
    
    // Clic sur le bouton hamburger
    menuToggle.addEventListener('click', toggleMenu);
    
    // Fermer le menu quand on clique sur un lien
    const navLinks = nav.querySelectorAll('.header-nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (body.classList.contains('nav-open')) {
                toggleMenu();
            }
        });
    });
    
    // Fermer avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && body.classList.contains('nav-open')) {
            toggleMenu();
            menuToggle.focus();
        }
    });
};

/**
 * ============================================
 * HEADER AU SCROLL
 * Ajoute une classe au header quand on scroll
 * ============================================
 */
const initHeaderScroll = () => {
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    const updateHeader = () => {
        const scrollY = window.scrollY;
        
        // Ajouter/retirer la classe selon la position de scroll
        if (scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        lastScrollY = scrollY;
        ticking = false;
    };
    
    // Debounce avec requestAnimationFrame
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });
    
    // Vérifier au chargement
    updateHeader();
};

/**
 * ============================================
 * BOUTON RETOUR EN HAUT
 * Affiche/cache le bouton selon le scroll
 * ============================================
 */
const initBackToTop = () => {
    const backToTopBtn = document.querySelector('.back-to-top-fixed');
    
    if (!backToTopBtn) return;
    
    let ticking = false;
    
    const toggleButton = () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(toggleButton);
            ticking = true;
        }
    }, { passive: true });
    
    // Scroll vers le haut au clic
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

/**
 * ============================================
 * ANNÉE DYNAMIQUE DANS LE FOOTER
 * Met à jour l'année du copyright automatiquement
 * ============================================
 */
const initCurrentYear = () => {
    const yearElement = document.getElementById('current-year');
    
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
};

/**
 * ============================================
 * INITIALISATION
 * Lance toutes les fonctions au chargement du DOM
 * ============================================
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation des modules
    initMobileMenu();
    initHeaderScroll();
    initScrollAnimations();
    initPortfolioFilters();
    initBackToTop();
    initCurrentYear();
    
    console.log('🎨 Portfolio Lucas Martin - Scripts chargés');
});

