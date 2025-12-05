/**
 * ============================================
 * LIGHTBOX - VISIONNEUSE D'IMAGES
 * Affiche les photos en plein écran avec navigation
 * ============================================
 */

'use strict';

/**
 * Classe Lightbox
 * Gère l'affichage et la navigation dans la galerie
 */
class Lightbox {
    constructor() {
        // État de la lightbox
        this.isOpen = false;
        this.currentIndex = 0;
        this.visibleItems = [];
        
        // Éléments DOM (seront créés dynamiquement)
        this.lightboxElement = null;
        this.imageElement = null;
        this.counterElement = null;
        this.prevButton = null;
        this.nextButton = null;
        this.closeButton = null;
        
        // Binding des méthodes pour conserver le contexte
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        
        // Initialisation
        this.init();
    }
    
    /**
     * Initialise la lightbox
     */
    init() {
        // Créer le DOM de la lightbox
        this.createLightboxDOM();
        
        // Attacher les événements aux liens de la galerie
        this.attachGalleryEvents();
        
        console.log('📷 Lightbox initialisée');
    }
    
    /**
     * Crée la structure HTML de la lightbox
     */
    createLightboxDOM() {
        // Conteneur principal
        this.lightboxElement = document.createElement('div');
        this.lightboxElement.className = 'lightbox';
        this.lightboxElement.setAttribute('role', 'dialog');
        this.lightboxElement.setAttribute('aria-modal', 'true');
        this.lightboxElement.setAttribute('aria-label', 'Visionneuse d\'images');
        this.lightboxElement.hidden = true;
        
        // Structure interne
        this.lightboxElement.innerHTML = `
            <button class="lightbox-close" aria-label="Fermer la visionneuse">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            
            <button class="lightbox-prev" aria-label="Image précédente">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            
            <div class="lightbox-content">
                <img class="lightbox-image" src="" alt="" />
            </div>
            
            <button class="lightbox-next" aria-label="Image suivante">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
            
            <div class="lightbox-counter">
                <span class="lightbox-current">1</span> / <span class="lightbox-total">1</span>
            </div>
        `;
        
        // Ajouter au body
        document.body.appendChild(this.lightboxElement);
        
        // Récupérer les références aux éléments
        this.imageElement = this.lightboxElement.querySelector('.lightbox-image');
        this.counterElement = this.lightboxElement.querySelector('.lightbox-counter');
        this.currentElement = this.lightboxElement.querySelector('.lightbox-current');
        this.totalElement = this.lightboxElement.querySelector('.lightbox-total');
        this.closeButton = this.lightboxElement.querySelector('.lightbox-close');
        this.prevButton = this.lightboxElement.querySelector('.lightbox-prev');
        this.nextButton = this.lightboxElement.querySelector('.lightbox-next');
        
        // Événements des boutons
        this.closeButton.addEventListener('click', this.close);
        this.prevButton.addEventListener('click', this.prev);
        this.nextButton.addEventListener('click', this.next);
        
        // Fermer en cliquant sur le fond
        this.lightboxElement.addEventListener('click', (e) => {
            if (e.target === this.lightboxElement) {
                this.close();
            }
        });
    }
    
    /**
     * Attache les événements aux liens de la galerie
     */
    attachGalleryEvents() {
        const galleryLinks = document.querySelectorAll('.gallery-link[data-lightbox]');
        
        galleryLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.open(index);
            });
        });
    }
    
    /**
     * Récupère les items visibles (non filtrés)
     * @returns {Array} - Liste des éléments visibles
     */
    getVisibleItems() {
        const allItems = document.querySelectorAll('.gallery-item');
        return Array.from(allItems).filter(item => !item.classList.contains('hidden'));
    }
    
    /**
     * Ouvre la lightbox sur une image
     * @param {number} clickedIndex - Index de l'image cliquée dans la liste complète
     */
    open(clickedIndex) {
        // Récupérer les items visibles
        this.visibleItems = this.getVisibleItems();
        
        if (this.visibleItems.length === 0) return;
        
        // Trouver l'index dans les items visibles
        const allItems = document.querySelectorAll('.gallery-item');
        const clickedItem = allItems[clickedIndex];
        
        // Trouver l'index de cet item dans les visibles
        this.currentIndex = this.visibleItems.indexOf(clickedItem);
        
        // Si l'item cliqué n'est pas visible (ne devrait pas arriver), prendre le premier
        if (this.currentIndex === -1) {
            this.currentIndex = 0;
        }
        
        // Afficher la lightbox
        this.isOpen = true;
        this.lightboxElement.hidden = false;
        document.body.style.overflow = 'hidden';
        
        // Charger l'image
        this.updateImage();
        
        // Écouter les touches clavier
        document.addEventListener('keydown', this.handleKeydown);
        
        // Focus sur le bouton fermer pour l'accessibilité
        setTimeout(() => this.closeButton.focus(), 100);
    }
    
    /**
     * Ferme la lightbox
     */
    close() {
        this.isOpen = false;
        this.lightboxElement.hidden = true;
        document.body.style.overflow = '';
        
        // Retirer l'écouteur clavier
        document.removeEventListener('keydown', this.handleKeydown);
        
        // Remettre le focus sur l'élément qui a ouvert la lightbox
        const currentItem = this.visibleItems[this.currentIndex];
        if (currentItem) {
            const link = currentItem.querySelector('.gallery-link');
            if (link) link.focus();
        }
    }
    
    /**
     * Affiche l'image suivante
     */
    next() {
        if (this.visibleItems.length <= 1) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.visibleItems.length;
        this.updateImage();
    }
    
    /**
     * Affiche l'image précédente
     */
    prev() {
        if (this.visibleItems.length <= 1) return;
        
        this.currentIndex = (this.currentIndex - 1 + this.visibleItems.length) % this.visibleItems.length;
        this.updateImage();
    }
    
    /**
     * Met à jour l'image affichée
     */
    updateImage() {
        const currentItem = this.visibleItems[this.currentIndex];
        if (!currentItem) return;
        
        const link = currentItem.querySelector('.gallery-link');
        const img = currentItem.querySelector('.gallery-image');
        
        if (link && img) {
            // Animation de transition
            this.imageElement.style.opacity = '0';
            
            setTimeout(() => {
                // Mettre à jour l'image
                this.imageElement.src = link.href;
                this.imageElement.alt = img.alt;
                
                // Mettre à jour le compteur
                this.currentElement.textContent = this.currentIndex + 1;
                this.totalElement.textContent = this.visibleItems.length;
                
                // Afficher l'image
                this.imageElement.style.opacity = '1';
            }, 150);
        }
        
        // Gérer la visibilité des boutons prev/next
        this.updateNavigationButtons();
    }
    
    /**
     * Met à jour la visibilité des boutons de navigation
     */
    updateNavigationButtons() {
        const hasMultipleImages = this.visibleItems.length > 1;
        
        this.prevButton.style.display = hasMultipleImages ? 'flex' : 'none';
        this.nextButton.style.display = hasMultipleImages ? 'flex' : 'none';
    }
    
    /**
     * Gère les événements clavier
     * @param {KeyboardEvent} e - Événement clavier
     */
    handleKeydown(e) {
        if (!this.isOpen) return;
        
        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                this.close();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.next();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.prev();
                break;
            case 'Tab':
                // Piéger le focus dans la lightbox
                this.trapFocus(e);
                break;
        }
    }
    
    /**
     * Piège le focus dans la lightbox (accessibilité)
     * @param {KeyboardEvent} e - Événement clavier
     */
    trapFocus(e) {
        const focusableElements = this.lightboxElement.querySelectorAll(
            'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
}

/**
 * ============================================
 * INITIALISATION
 * ============================================
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser la lightbox seulement si on est sur une page avec galerie
    if (document.querySelector('.gallery-link[data-lightbox]')) {
        new Lightbox();
    }
});

