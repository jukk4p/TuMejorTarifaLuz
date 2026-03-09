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

    // 2. Bot Detection
    if (navigator.webdriver || /bot|crawler|spider|crawling/i.test(navigator.userAgent)) {
        return;
    }

    // 3. Styles (Injected into <head>)
    const injectStyles = () => {
        if (document.getElementById('cookie-consent-styles')) return;
        const style = document.createElement('style');
        style.id = 'cookie-consent-styles';
        style.textContent = `
            :root {
                --cc-bg: #ffffff;
                --cc-text: #1e293b;
                --cc-subtext: #64748b;
                --cc-accent: #137fec;
                --cc-accent-text: #ffffff;
                --cc-border: #e2e8f0;
                --cc-toggle-bg: #cbd5e1;
                --cc-toggle-active: #10b981;
                --cc-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                --cc-radius: 1.25rem;
                --cc-font: var(--font-display, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
            }

            /* Handle dark mode via CSS class (Next-themes) */
            html.dark :root,
            .dark {
                --cc-bg: #101922;
                --cc-text: #f8fafc;
                --cc-subtext: #94a3b8;
                --cc-accent: #137fec;
                --cc-accent-text: #ffffff;
                --cc-border: #1e293b;
                --cc-toggle-bg: #1a2632;
                --cc-toggle-active: #10b981;
            }

            /* Fallback for system preference if no class is present */
            @media (prefers-color-scheme: dark) {
                :root:not(.light) {
                    --cc-bg: #101922;
                    --cc-text: #f8fafc;
                    --cc-subtext: #94a3b8;
                    --cc-accent: #137fec;
                    --cc-accent-text: #ffffff;
                    --cc-border: #1e293b;
                    --cc-toggle-bg: #1a2632;
                }
            }

            #cc-banner {
                position: fixed;
                bottom: 1.5rem;
                left: 1.5rem;
                width: calc(100% - 3rem);
                max-width: 420px;
                background: var(--cc-bg);
                color: var(--cc-text);
                padding: 1.75rem;
                border-radius: var(--cc-radius);
                border: 1px solid var(--cc-border);
                box-shadow: var(--cc-shadow);
                z-index: 2147483640;
                font-family: var(--cc-font);
                font-size: 0.9rem;
                line-height: 1.5;
                opacity: 0;
                transform: translateY(2rem);
                transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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
                margin: 0 0 0.5rem 0;
                font-size: 1.1rem;
                font-weight: 700;
                color: var(--cc-text);
            }

            #cc-banner p {
                margin: 0 0 1.5rem 0;
                color: var(--cc-subtext);
                font-size: 0.85rem;
            }

            #cc-banner a {
                color: var(--cc-accent);
                text-decoration: underline;
                font-weight: 500;
            }

            .cc-btn-group {
                display: flex;
                flex-wrap: wrap;
                gap: 0.75rem;
            }

            .cc-btn {
                cursor: pointer;
                padding: 0.65rem 1.25rem;
                border: 1px solid transparent;
                border-radius: 0.75rem;
                font-size: 0.8rem;
                font-weight: 600;
                transition: all 0.2s ease;
                flex: 1 1 auto;
                text-align: center;
                white-space: nowrap;
            }

            .cc-btn-accept {
                background: var(--cc-accent);
                color: var(--cc-accent-text);
            }

            .cc-btn-accept:hover {
                filter: brightness(1.1);
                transform: translateY(-1px);
            }

            .cc-btn-secondary {
                background: transparent;
                border: 1px solid var(--cc-border);
                color: var(--cc-text);
            }

            .cc-btn-secondary:hover {
                background: var(--cc-border);
            }

            /* Settings Panel Overlay */
            #cc-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.7);
                backdrop-filter: blur(8px);
                z-index: 2147483645;
                display: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            #cc-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -45%);
                width: calc(100% - 2rem);
                max-width: 500px;
                background: var(--cc-bg);
                border-radius: var(--cc-radius);
                padding: 2rem;
                z-index: 2147483647;
                font-family: var(--cc-font);
                display: none;
                opacity: 0;
                transition: transform 0.4s ease, opacity 0.4s ease;
                max-height: 90vh;
                overflow-y: auto;
            }

            #cc-modal.show {
                display: block;
                opacity: 1;
                transform: translate(-50%, -50%);
            }

            #cc-modal h3 {
                color: var(--cc-text);
                font-weight: 700;
            }

            .cc-setting-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 0;
                border-bottom: 1px solid var(--cc-border);
            }

            .cc-setting-item:last-child {
                border-bottom: none;
            }

            .cc-setting-info h4 {
                margin: 0;
                font-size: 0.9rem;
                font-weight: 600;
            }

            .cc-setting-info p {
                margin: 0.25rem 0 0 0;
                font-size: 0.75rem;
                color: var(--cc-subtext);
            }

            /* Switches */
            .cc-switch {
                position: relative;
                display: inline-block;
                width: 40px;
                height: 22px;
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
                transition: .3s;
                border-radius: 22px;
            }

            .cc-slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .3s;
                border-radius: 50%;
            }

            input:checked + .cc-slider {
                background-color: var(--cc-toggle-active);
            }

            input:checked + .cc-slider:before {
                transform: translateX(18px);
            }

            input:disabled + .cc-slider {
                opacity: 0.5;
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
                    border-radius: 1.5rem 1.5rem 0 0 !important;
                    padding-bottom: calc(1.75rem + env(safe-area-inset-bottom)) !important;
                }
                .cc-btn { flex: 1 1 100%; }
                #cc-modal {
                    padding: 1.5rem;
                    width: calc(100% - 1rem);
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
            <h3>Valoramos tu privacidad</h3>
            <p>Utilizamos cookies propias y de terceros para analizar nuestros servicios y mostrarte publicidad relacionada con tus preferencias. Lee nuestra <a href="${LINK_POLITICA}">Política de Cookies</a>.</p>
            <div class="cc-btn-group">
                <button class="cc-btn cc-btn-accept" id="cc-accept-all">Aceptar todo</button>
                <button class="cc-btn cc-btn-secondary" id="cc-reject-all">Solo esenciales</button>
                <button class="cc-btn cc-btn-secondary" id="cc-open-settings">Personalizar</button>
            </div>
        `;
        document.body.appendChild(banner);

        const overlay = document.createElement('div');
        overlay.id = 'cc-modal-overlay';
        document.body.appendChild(overlay);

        const modal = document.createElement('div');
        modal.id = 'cc-modal';
        modal.innerHTML = `
            <div style="margin-bottom: 2rem">
                <h3 style="margin-top:0">Configuración de Cookies</h3>
                <p style="font-size: 0.8rem; color: var(--cc-subtext)">Selecciona qué tipo de cookies deseas permitir. Las necesarias no se pueden desactivar ya que el sitio las requiere para funcionar.</p>
            </div>
            
            <div class="cc-setting-item">
                <div class="cc-setting-info">
                    <h4>Técnicas / Necesarias</h4>
                    <p>Necesarias para el funcionamiento base del sitio.</p>
                </div>
                <label class="cc-switch"><input type="checkbox" checked disabled><span class="cc-slider"></span></label>
            </div>

            <div class="cc-setting-item">
                <div class="cc-setting-info">
                    <h4>Analíticas</h4>
                    <p>Nos ayudan a entender cómo usas la web para mejorarla.</p>
                </div>
                <label class="cc-switch"><input type="checkbox" id="cc-opt-analytics"><span class="cc-slider"></span></label>
            </div>

            <div class="cc-setting-item">
                <div class="cc-setting-info">
                    <h4>Publicitarias / Marketing</h4>
                    <p>Permiten mostrarte anuncios personalizados en otros sitios.</p>
                </div>
                <label class="cc-switch"><input type="checkbox" id="cc-opt-marketing"><span class="cc-slider"></span></label>
            </div>

            <div class="cc-setting-item">
                <div class="cc-setting-info">
                    <h4>Preferencias</h4>
                    <p>Permiten recordar tus ajustes como el idioma o tema.</p>
                </div>
                <label class="cc-switch"><input type="checkbox" id="cc-opt-preferences"><span class="cc-slider"></span></label>
            </div>

            <div class="cc-btn-group" style="margin-top: 2rem">
                <button class="cc-btn cc-btn-accept" id="cc-save-settings">Guardar selección</button>
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
        } else {
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
