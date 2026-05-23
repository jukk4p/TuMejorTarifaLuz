/**
 * @name CookieConsent v2.0 - High Performance & Privacy First
 * @description GDPR, LOPDGDD & Google Consent Mode v2 (GCMv2) compliant.
 * @license MIT - No dependencies.
 */
(function () {
    'use strict';

    // 1. Configuration & Constants
    const STORAGE_KEY = 'cookie_consent_preferences';
    const LINK_POLITICA = '/politica-cookies';

    // Default GCMv2 defaults (pre-acceptance)
    // Should be set by the site owner in the <head> before this script if possible, 
    // but we define them here as fallback.
    const GCM_DEFAULTS = {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied',
        'functionality_storage': 'denied',
        'personalization_storage': 'denied',
        'security_storage': 'granted', // Mandatory
        'wait_for_update': 500
    };

    // 2. Bot Detection - Only skip UI, but allow logic for diagnostic tools if needed
    const isBot = navigator.webdriver || /bot|crawler|spider|crawling/i.test(navigator.userAgent);

    // 3. Styles (Loaded natively in globals.css)
    const injectStyles = () => {};

    // 4. HTML Elements Injection
    const createElements = () => {
        const banner = document.createElement('div');
        banner.id = 'cc-banner';
        banner.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                <div style="background: var(--cc-accent); color: white; padding: 0.4rem; border-radius: 0.6rem; display: flex; align-items: center; justify-content: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <h3 style="margin: 0">Privacidad</h3>
            </div>
            <p>Utilizamos cookies para optimizar tu experiencia y analizar el tráfico. Consulta nuestra <a href="${LINK_POLITICA}">Política de Cookies</a>.</p>
            <div class="cc-btn-group">
                <button class="cc-btn cc-btn-accept" id="cc-accept-all">Aceptar todo</button>
                <button class="cc-btn cc-btn-secondary" id="cc-reject-all">Solo esenciales</button>
                <button class="cc-btn cc-btn-secondary" id="cc-open-settings">Configurar</button>
            </div>
        `;
        document.body.appendChild(banner);

        const overlay = document.createElement('div');
        overlay.id = 'cc-modal-overlay';
        document.body.appendChild(overlay);

        const modal = document.createElement('div');
        modal.id = 'cc-modal';
        modal.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
                <div style="background: var(--cc-accent); color: white; padding: 0.5rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <h3 style="margin: 0">Ajustes de Privacidad</h3>
            </div>
            <p style="font-size: 0.875rem; color: var(--cc-subtext); margin-bottom: 2rem; line-height: 1.6;">
                Nos tomamos en serio tu privacidad. Selecciona qué tipo de cookies deseas permitir. Las cookies técnicas son obligatorias para el funcionamiento del sitio.
            </p>
            
            <div class="cc-setting-item">
                <div class="cc-setting-info">
                    <h4>Técnicas</h4>
                    <p>Necesarias para seguridad y funciones core.</p>
                </div>
                <label class="cc-switch"><input type="checkbox" checked disabled><span class="cc-slider"></span></label>
            </div>

            <div class="cc-setting-item">
                <div class="cc-setting-info">
                    <h4>Análisis</h4>
                    <p>Para mejorar nuestros servicios mediante el uso estadístico.</p>
                </div>
                <label class="cc-switch"><input type="checkbox" id="cc-opt-analytics"><span class="cc-slider"></span></label>
            </div>

            <div class="cc-setting-item">
                <div class="cc-setting-info">
                    <h4>Personalización</h4>
                    <p>Recuerdan tus preferencias y mejoran la interfaz.</p>
                </div>
                <label class="cc-switch"><input type="checkbox" id="cc-opt-preferences"><span class="cc-slider"></span></label>
            </div>

            <div class="cc-setting-item">
                <div class="cc-setting-info">
                    <h4>Publicidad</h4>
                    <p>Permiten ofrecerte contenido y ofertas más relevantes.</p>
                </div>
                <label class="cc-switch"><input type="checkbox" id="cc-opt-marketing"><span class="cc-slider"></span></label>
            </div>

            <div style="margin-top: 2.5rem;">
                <button class="cc-btn cc-btn-accept" id="cc-save-settings" style="width: 100%">Guardar mi selección</button>
            </div>
        `;
        document.body.appendChild(modal);
    };

    // 5. Logic
    const updateGTMConsent = (choices) => {
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                'analytics_storage': choices.analytics ? 'granted' : 'denied',
                'ad_storage': choices.marketing ? 'granted' : 'denied',
                'ad_user_data': choices.marketing ? 'granted' : 'denied',
                'ad_personalization': choices.marketing ? 'granted' : 'denied',
                'personalization_storage': choices.preferences ? 'granted' : 'denied',
                'functionality_storage': choices.preferences ? 'granted' : 'denied',
            });
        }

        // Emit Custom Events
        const hasAcceptedAny = choices.analytics || choices.marketing || choices.preferences;
        const eventName = hasAcceptedAny ? 'cookieConsentGranted' : 'cookieConsentDenied';
        window.dispatchEvent(new CustomEvent(eventName, { detail: choices }));
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': eventName,
            'cookie_preferences': choices
        });
    };

    const saveConsents = (choices) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            timestamp: Date.now(),
            choices
        }));
        updateGTMConsent(choices);
        hideBanner();
        hideModal();
    };

    const hideBanner = () => {
        const banner = document.getElementById('cc-banner');
        banner.classList.remove('show');
        setTimeout(() => banner.style.display = 'none', 400);
    };

    const showBanner = () => {
        const banner = document.getElementById('cc-banner');
        banner.style.display = 'block';
        requestAnimationFrame(() => banner.classList.add('show'));
    };

    const showModal = () => {
        const overlay = document.getElementById('cc-modal-overlay');
        const modal = document.getElementById('cc-modal');
        overlay.style.display = 'block';
        modal.style.display = 'block';
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            modal.classList.add('show');
        });
    };

    const hideModal = () => {
        const overlay = document.getElementById('cc-modal-overlay');
        const modal = document.getElementById('cc-modal');
        overlay.style.opacity = '0';
        modal.classList.remove('show');
        setTimeout(() => {
            overlay.style.display = 'none';
            modal.style.display = 'none';
        }, 400);
    };

    // Global re-open function
    window.openCookieSettings = () => {
        const prefs = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (prefs) {
            document.getElementById('cc-opt-analytics').checked = prefs.choices.analytics;
            document.getElementById('cc-opt-marketing').checked = prefs.choices.marketing;
            document.getElementById('cc-opt-preferences').checked = prefs.choices.preferences;
        }
        showModal();
    };

    // 6. Initialization
    const init = () => {
        if (typeof window !== 'undefined' && window.location && window.location.pathname.startsWith('/admin')) {
            return;
        }
        injectStyles();
        createElements();

        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const data = JSON.parse(stored);
                updateGTMConsent(data.choices);
            } catch (e) {
                showBanner();
            }
        } else if (!isBot) {
            showBanner();
        }

        // Event Listeners
        document.getElementById('cc-accept-all').onclick = () => {
            saveConsents({ analytics: true, marketing: true, preferences: true });
        };

        document.getElementById('cc-reject-all').onclick = () => {
            saveConsents({ analytics: false, marketing: false, preferences: false });
        };

        document.getElementById('cc-open-settings').onclick = showModal;

        document.getElementById('cc-modal-overlay').onclick = hideModal;

        document.getElementById('cc-save-settings').onclick = () => {
            saveConsents({
                analytics: document.getElementById('cc-opt-analytics').checked,
                marketing: document.getElementById('cc-opt-marketing').checked,
                preferences: document.getElementById('cc-opt-preferences').checked
            });
        };
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
