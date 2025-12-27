/**
 * @module contact
 * @description Tour de contrôle — Gestion de la transmission
 */

// ═══════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════

const CONFIG = {
    ANIMATION_DURATION: 800,
    SUCCESS_TIMEOUT: 5000,
    TRANSMISSION_DELAY: 2000
};

// ═══════════════════════════════════════════════════════════
// ANIMATIONS D'ENTRÉE
// ═══════════════════════════════════════════════════════════

function initEntryAnimations() {
    const tl = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 0.8 }
    });

    tl.from('.tower-callsign', {
        opacity: 0,
        y: -20
    })
    .from('.title-line', {
        opacity: 0,
        y: 30,
        stagger: 0.2
    }, '-=0.4')
    .from('.tower-subtitle', {
        opacity: 0,
        y: 20
    }, '-=0.4')
    .from('.monitor-unit', {
        opacity: 0,
        x: -30,
        stagger: 0.1
    }, '-=0.6')
    .from('.transmission-station', {
        opacity: 0,
        y: 30
    }, '-=0.8');
}

// ═══════════════════════════════════════════════════════════
// VALIDATION DE FORMULAIRE
// ═══════════════════════════════════════════════════════════

class FormValidator {
    constructor(form) {
        this.form = form;
        this.fields = Array.from(form.querySelectorAll('[required]'));
    }

    validateField(field) {
        const errorSpan = field.closest('.form-field').querySelector('.field-error');
        
        if (!field.validity.valid) {
            errorSpan.textContent = this.getErrorMessage(field);
            return false;
        }
        
        errorSpan.textContent = '';
        return true;
    }

    getErrorMessage(field) {
        if (field.validity.valueMissing) return 'Champ requis';
        if (field.validity.typeMismatch) return 'Format invalide';
        if (field.validity.tooShort) return `Min ${field.minLength} caractères`;
        return 'Valeur invalide';
    }

    validateAll() {
        return this.fields.every(field => this.validateField(field));
    }

    init() {
        this.fields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => {
                if (!field.validity.valid) this.validateField(field);
            });
        });
    }
}

// ═══════════════════════════════════════════════════════════
// CONTRÔLEUR DE TRANSMISSION
// ═══════════════════════════════════════════════════════════

class TransmissionController {
    constructor(form, acknowledgment) {
        this.form = form;
        this.ack = acknowledgment;
        this.validator = new FormValidator(form);
        this.button = form.querySelector('.btn-ptt');
        this.isTransmitting = false;
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (this.isTransmitting) return;
        if (!this.validator.validateAll()) return;

        await this.transmit();
    }

    async transmit() {
        this.isTransmitting = true;

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        this.setButtonState('transmitting');

        try {
            await this.simulateTransmission(data);
            this.showAcknowledgment();
            this.form.reset();
        } catch (error) {
            console.error('Transmission error:', error);
        } finally {
            this.isTransmitting = false;
            this.setButtonState('idle');
        }
    }

    simulateTransmission(data) {
        return new Promise(resolve => {
            console.log('📡 Transmission:', data);
            setTimeout(resolve, CONFIG.TRANSMISSION_DELAY);
        });
    }

    setButtonState(state) {
        if (state === 'transmitting') {
            this.button.dataset.originalHTML = this.button.innerHTML;
            this.button.innerHTML = `
                <span class="ptt-led" style="background: var(--warning);"></span>
                <span class="ptt-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                    </svg>
                </span>
                <span class="ptt-text">TRANSMISSION...</span>
                <span class="ptt-hint">EN COURS</span>
            `;
            this.button.disabled = true;
            gsap.to(this.button, { opacity: 0.7, duration: 0.3 });
        } else {
            this.button.innerHTML = this.button.dataset.originalHTML;
            this.button.disabled = false;
            gsap.to(this.button, { opacity: 1, duration: 0.3 });
        }
    }

    showAcknowledgment() {
        this.ack.hidden = false;

        gsap.fromTo(this.ack,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.4 }
        );

        setTimeout(() => {
            gsap.to(this.ack, {
                opacity: 0,
                y: -20,
                duration: 0.4,
                onComplete: () => { this.ack.hidden = true; }
            });
        }, CONFIG.SUCCESS_TIMEOUT);
    }

    init() {
        this.validator.init();
        this.form.addEventListener('submit', e => this.handleSubmit(e));

        // Raccourci Ctrl+Enter
        this.form.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.form.requestSubmit();
            }
        });
    }
}

// ═══════════════════════════════════════════════════════════
// ANIMATIONS DES INPUTS
// ═══════════════════════════════════════════════════════════

function initInputAnimations() {
    const inputs = document.querySelectorAll('.field-input');

    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                scale: 1.01,
                boxShadow: '0 0 20px rgba(255, 59, 59, 0.2)',
                duration: 0.3
            });
        });

        input.addEventListener('blur', () => {
            gsap.to(input, {
                scale: 1,
                boxShadow: 'none',
                duration: 0.3
            });
        });
    });
}

// ═══════════════════════════════════════════════════════════
// INITIALISATION
// ═══════════════════════════════════════════════════════════

function init() {
    const form = document.getElementById('contactForm');
    const ack = document.getElementById('acknowledgment');

    if (!form || !ack) {
        console.error('Required elements not found');
        return;
    }

    initEntryAnimations();
    initInputAnimations();

    const controller = new TransmissionController(form, ack);
    controller.init();

    console.log(
        '%c✈️ TOUR DE CONTRÔLE ACTIVE',
        'color: #ff3b3b; font-size: 16px; font-weight: bold; background: #0a0e27; padding: 8px; border: 2px solid #ff3b3b;'
    );
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

export { init, TransmissionController };