/**
 * ============================================
 * VALIDATION DU FORMULAIRE DE CONTACT
 * Validation côté client avec messages d'erreur
 * ============================================
 */

'use strict';

/**
 * Classe FormValidator
 * Gère la validation du formulaire de contact
 */
class FormValidator {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        
        if (!this.form) return;
        
        // Configuration des règles de validation
        this.rules = {
            name: {
                required: true,
                minLength: 2,
                messages: {
                    required: 'Veuillez entrer votre nom',
                    minLength: 'Le nom doit contenir au moins 2 caractères'
                }
            },
            email: {
                required: true,
                email: true,
                messages: {
                    required: 'Veuillez entrer votre email',
                    email: 'Veuillez entrer une adresse email valide'
                }
            },
            'project-type': {
                required: true,
                messages: {
                    required: 'Veuillez sélectionner un type de projet'
                }
            },
            message: {
                required: true,
                minLength: 10,
                messages: {
                    required: 'Veuillez entrer votre message',
                    minLength: 'Le message doit contenir au moins 10 caractères'
                }
            }
        };
        
        // Initialisation
        this.init();
    }
    
    /**
     * Initialise les écouteurs d'événements
     */
    init() {
        // Validation à la soumission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Validation en temps réel sur les champs
        const fields = this.form.querySelectorAll('.form-input, .form-select, .form-textarea');
        fields.forEach(field => {
            // Validation au blur (quand on quitte le champ)
            field.addEventListener('blur', () => this.validateField(field));
            
            // Retirer l'erreur quand on commence à taper
            field.addEventListener('input', () => this.clearError(field));
        });
        
        console.log('✅ Validation du formulaire initialisée');
    }
    
    /**
     * Gère la soumission du formulaire
     * @param {Event} e - Événement de soumission
     */
    handleSubmit(e) {
        e.preventDefault();
        
        // Valider tous les champs
        const isValid = this.validateAll();
        
        if (isValid) {
            this.showSuccess();
        }
    }
    
    /**
     * Valide tous les champs du formulaire
     * @returns {boolean} - True si tous les champs sont valides
     */
    validateAll() {
        let isValid = true;
        
        // Parcourir toutes les règles
        Object.keys(this.rules).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field && !this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    /**
     * Valide un champ individuel
     * @param {HTMLElement} field - Champ à valider
     * @returns {boolean} - True si le champ est valide
     */
    validateField(field) {
        const fieldName = field.name;
        const rules = this.rules[fieldName];
        
        // Si pas de règles pour ce champ, il est valide
        if (!rules) return true;
        
        const value = field.value.trim();
        
        // Vérifier chaque règle
        
        // Required
        if (rules.required && !value) {
            this.showError(field, rules.messages.required);
            return false;
        }
        
        // MinLength
        if (rules.minLength && value.length < rules.minLength) {
            this.showError(field, rules.messages.minLength);
            return false;
        }
        
        // Email
        if (rules.email && value && !this.isValidEmail(value)) {
            this.showError(field, rules.messages.email);
            return false;
        }
        
        // Si toutes les validations passent
        this.clearError(field);
        this.showValid(field);
        return true;
    }
    
    /**
     * Vérifie si un email est valide
     * @param {string} email - Email à vérifier
     * @returns {boolean} - True si l'email est valide
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Affiche une erreur sur un champ
     * @param {HTMLElement} field - Champ en erreur
     * @param {string} message - Message d'erreur
     */
    showError(field, message) {
        // Ajouter la classe d'erreur
        field.classList.add('error');
        field.classList.remove('valid');
        
        // Trouver ou créer le conteneur d'erreur
        const errorElement = field.parentElement.querySelector('.form-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('visible');
        }
        
        // Accessibilité : annoncer l'erreur
        field.setAttribute('aria-invalid', 'true');
    }
    
    /**
     * Retire l'erreur d'un champ
     * @param {HTMLElement} field - Champ à nettoyer
     */
    clearError(field) {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
        
        const errorElement = field.parentElement.querySelector('.form-error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('visible');
        }
    }
    
    /**
     * Affiche l'état valide sur un champ
     * @param {HTMLElement} field - Champ valide
     */
    showValid(field) {
        field.classList.add('valid');
    }
    
    /**
     * Affiche le message de succès
     */
    showSuccess() {
        // Créer le message de succès
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.setAttribute('role', 'alert');
        successMessage.innerHTML = `
            <div class="form-success-icon" aria-hidden="true">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            </div>
            <h3 class="form-success-title">Message envoyé !</h3>
            <p class="form-success-text">
                Merci pour votre message. Je vous répondrai dans les plus brefs délais, 
                généralement sous 24 heures.
            </p>
            <button type="button" class="form-success-button">Envoyer un autre message</button>
        `;
        
        // Remplacer le formulaire par le message de succès
        this.form.style.display = 'none';
        this.form.parentElement.appendChild(successMessage);
        
        // Animation d'entrée
        setTimeout(() => {
            successMessage.classList.add('visible');
        }, 10);
        
        // Bouton pour réinitialiser
        const resetButton = successMessage.querySelector('.form-success-button');
        resetButton.addEventListener('click', () => {
            this.resetForm(successMessage);
        });
        
        // Focus sur le message pour l'accessibilité
        successMessage.focus();
    }
    
    /**
     * Réinitialise le formulaire
     * @param {HTMLElement} successMessage - Message de succès à retirer
     */
    resetForm(successMessage) {
        // Retirer le message de succès
        successMessage.classList.remove('visible');
        
        setTimeout(() => {
            successMessage.remove();
            
            // Réafficher et réinitialiser le formulaire
            this.form.style.display = '';
            this.form.reset();
            
            // Retirer tous les états de validation
            const fields = this.form.querySelectorAll('.form-input, .form-select, .form-textarea');
            fields.forEach(field => {
                field.classList.remove('valid', 'error');
                field.removeAttribute('aria-invalid');
            });
            
            // Focus sur le premier champ
            const firstField = this.form.querySelector('.form-input');
            if (firstField) firstField.focus();
        }, 300);
    }
}

/**
 * ============================================
 * INITIALISATION
 * ============================================
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser la validation sur le formulaire de contact
    new FormValidator('.contact-form');
});

