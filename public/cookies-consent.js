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

    // 3. Styles (Injected into <head>)
    const injectStyles = () => {
        if (document.getElementById('cookie-consent-styles')) return;
        const style = document.createElement('style');
        style.id = 'cookie-consent-styles';
        style.textContent = `
            :root {
                --cc-bg: rgba(255, 255, 255, 0.9);
                --cc-text: #0F172A;
                --cc-subtext: #475569;
                --cc-accent: #137fec;
                --cc-accent-hover: #0c66c2;
                --cc-accent-text: #ffffff;
                --cc-border: rgba(0, 0, 0, 0.08);
                --cc-toggle-bg: #E2E8F0;
                --cc-toggle-active: #10B981;
                --cc-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                --cc-radius: 1.5rem;
                --cc-font: var(--font-body, 'Manrope', -apple-system, sans-serif);
                --cc-blur: 12px;
            }

            html.dark :root,
            .dark {
                --cc-bg: rgba(15, 25, 35, 0.85);
                --cc-text: #F1F5F9;
                --cc-subtext: #94A3B8;
                --cc-border: rgba(255, 255, 255, 0.08);
                --cc-toggle-bg: #1E293B;
            }

            #cc-banner {
                position: fixed;
                bottom: 1.5rem;
                left: 1.5rem;
                width: calc(100% - 3rem);
                max-width: 440px;
                background: var(--cc-bg);
                backdrop-filter: blur(var(--cc-blur));
                -webkit-backdrop-filter: blur(var(--cc-blur));
                color: var(--cc-text);
                padding: 2rem;
                border-radius: var(--cc-radius);
                border: 1px solid var(--cc-border);
                box-shadow: var(--cc-shadow);
                z-index: 2147483640;
                font-family: var(--cc-font);
                font-size: 0.95rem;
                line-height: 1.6;
                opacity: 0;
                transform: translateY(2rem);
                transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                pointer-events: none;
                display: none;
            }

            #cc-banner.show {
                opacity: 1 !important;
                transform: translateY(0) !important;
                pointer-events: auto !important;
                display: block !important;
            }

            #cc-banner h3 {
                margin: 0 0 0.75rem 0;
                font-size: 1.25rem;
                font-weight: 800;
                letter-spacing: -0.02em;
                color: var(--cc-text);
            }

            #cc-banner p {
                margin: 0 0 1.75rem 0;
                color: var(--cc-subtext);
                font-size: 0.875rem;
                font-medium;
            }

            #cc-banner a {
                color: var(--cc-accent);
                text-decoration: none;
                font-weight: 700;
                border-bottom: 2px solid transparent;
                transition: border-color 0.2s;
            }

            #cc-banner a:hover {
                border-bottom-color: var(--cc-accent);
            }

            .cc-btn-group {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.75rem;
            }
            
            #cc-open-settings {
                grid-column: span 2;
                margin-top: 0.25rem;
            }

            .cc-btn {
                cursor: pointer;
                padding: 0.85rem 1.25rem;
                border: 1px solid transparent;
                border-radius: 1rem;
                font-size: 0.875rem;
                font-weight: 700;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                text-align: center;
                white-space: nowrap;
                user-select: none;
            }

            .cc-btn-accept {
                background: var(--cc-accent);
                color: var(--cc-accent-text);
                box-shadow: 0 4px 12px rgba(19, 127, 236, 0.25);
            }

            .cc-btn-accept:hover {
                background: var(--cc-accent-hover);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(19, 127, 236, 0.35);
            }

            .cc-btn-secondary {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid var(--cc-border);
                color: var(--cc-text);
            }

            .cc-btn-secondary:hover {
                background: var(--cc-border);
                transform: translateY(-2px);
            }

            /* Settings Panel Overlay */
            #cc-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(7, 14, 24, 0.6);
                backdrop-filter: blur(4px);
                z-index: 2147483645;
                display: none;
                opacity: 0;
                transition: opacity 0.4s ease;
            }

            #cc-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -45%);
                width: calc(100% - 2.5rem);
                max-width: 520px;
                background: var(--cc-bg);
                backdrop-filter: blur(25px);
                -webkit-backdrop-filter: blur(25px);
                border-radius: var(--cc-radius);
                border: 1px solid var(--cc-border);
                padding: 2.5rem;
                z-index: 2147483647;
                font-family: var(--cc-font);
                display: none;
                opacity: 0;
                transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
                max-height: 85vh;
                overflow-y: auto;
                box-shadow: 0 30px 60px -12px rgba(0,0,0,0.45);
            }

            #cc-modal.show {
                display: block;
                opacity: 1;
                transform: translate(-50%, -50%);
            }

            #cc-modal h3 {
                color: var(--cc-text);
                font-size: 1.5rem;
                font-weight: 800;
                letter-spacing: -0.02em;
                margin-top: 0;
            }

            .cc-setting-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.25rem 0;
                border-bottom: 1px solid var(--cc-border);
            }

            .cc-setting-item:last-child {
                border-bottom: none;
            }

            .cc-setting-info h4 {
                margin: 0;
                font-size: 1rem;
                font-weight: 700;
                color: var(--cc-text);
            }

            .cc-setting-info p {
                margin: 0.35rem 0 0 0;
                font-size: 0.8rem;
                color: var(--cc-subtext);
                max-width: 280px;
            }

            /* Switches */
            .cc-switch {
                position: relative;
                display: inline-block;
                width: 48px;
                height: 26px;
            }

            .cc-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .cc-slider {
                position: absolute;
                cursor: pointer;
                inset: 0;
                background-color: var(--cc-toggle-bg);
                transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
                border-radius: 26px;
                border: 1px solid var(--cc-border);
            }

            .cc-slider:before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 3px;
                bottom: 2px;
                background-color: white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
                border-radius: 50%;
            }

            input:checked + .cc-slider {
                background-color: var(--cc-toggle-active);
                border-color: transparent;
            }

            input:checked + .cc-slider:before {
                transform: translateX(21px);
            }

            input:disabled + .cc-slider {
                opacity: 0.4;
                cursor: not-allowed;
            }

            @media (prefers-reduced-motion: reduce) {
                #cc-banner, #cc-modal, #cc-modal-overlay {
                    transition: none !important;
                }
            }

            @media (max-width: 480px) {
                #cc-banner {
                    bottom: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    max-width: none !important;
                    border-radius: 2rem 2rem 0 0 !important;
                    padding: 2rem 1.5rem calc(1.5rem + env(safe-area-inset-bottom)) !important;
                    border-left: none;
                    border-right: none;
                    border-bottom: none;
                }
                .cc-btn-group { grid-template-columns: 1fr; }
                #cc-open-settings { grid-column: span 1; }
                #cc-modal {
                    padding: 2rem 1.5rem;
                    width: calc(100% - 1.5rem);
                }
            }
        `;
        document.head.appendChild(style);
    };

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
