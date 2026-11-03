const fs = require('fs');

let css = fs.readFileSync('CSS/style.css', 'utf8');

// 1. Replace the Mobile Menu Toggle base styles
const oldToggle = `.mobile-menu-toggle {
    display: none;
    color: var(--clr-cream);
    background: transparent;
    border: none;
}`;

const newToggle = `.mobile-menu-toggle {
    display: none;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    padding: 0;
    background: rgba(244, 209, 148, 0.08);
    border: 1px solid rgba(244, 209, 148, 0.28);
    border-radius: 12px;
    color: var(--clr-gold);
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    outline: none;
}

.mobile-menu-toggle:hover {
    background: var(--clr-gold);
    color: var(--clr-black);
    border-color: var(--clr-gold);
    transform: scale(1.05);
    box-shadow: 0 4px 16px rgba(244, 209, 148, 0.3);
}

.mobile-menu-toggle:focus-visible {
    box-shadow: 0 0 0 3px rgba(244, 209, 148, 0.4);
}

.mobile-menu-toggle svg {
    width: 22px;
    height: 22px;
    transition: transform 0.25s ease;
}`;

// 2. Replace Mobile Menu Overlay styles
const startOverlayMarker = '/* --- Mobile Menu Overlay --- */';
const endOverlayMarker = '/* --- Stats Section --- */';

const startOverlayIdx = css.indexOf(startOverlayMarker);
const endOverlayIdx = css.indexOf(endOverlayMarker);

if (startOverlayIdx === -1 || endOverlayIdx === -1) {
    console.error('ERROR: Could not find overlay markers');
    process.exit(1);
}

const newOverlaySection = `/* --- Mobile Menu Overlay (Luxury Architectural Experience) --- */
.mobile-menu-overlay {
    position: fixed;
    inset: 0;
    background: rgba(1, 1, 2, 0.96);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.45s;
    visibility: hidden;
    overflow: hidden;
}

.mobile-menu-overlay.open {
    transform: translateX(0);
    visibility: visible;
}

.mobile-menu-header {
    padding: 18px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(252, 231, 204, 0.1);
    background: rgba(12, 12, 16, 0.6);
}

.mobile-menu-header .logo {
    font-size: 1.45rem;
    color: var(--clr-gold);
}

.close-menu-btn {
    width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(244, 209, 148, 0.08);
    border: 1px solid rgba(244, 209, 148, 0.25);
    color: var(--clr-cream);
    cursor: pointer;
    transition: all 0.25s ease;
    padding: 0;
}

.close-menu-btn:hover {
    background: var(--clr-gold);
    color: var(--clr-black);
    border-color: var(--clr-gold);
    transform: rotate(90deg);
}

.mobile-nav-links {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 24px 28px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.mobile-nav-item, .mobile-accordion-btn {
    font-family: var(--font-heading);
    font-size: clamp(1.3rem, 5vw, 1.85rem);
    font-weight: 500;
    color: var(--clr-cream);
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    text-align: left;
    text-decoration: none;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: color 0.2s ease, transform 0.2s ease;
}

.mobile-nav-item:hover, .mobile-accordion-btn:hover {
    color: var(--clr-gold);
    transform: translateX(6px);
}

.mobile-nav-item.active {
    color: var(--clr-gold);
    position: relative;
    padding-left: 14px;
}

.mobile-nav-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 20px;
    background: var(--clr-gold);
    border-radius: 2px;
}

.mobile-accordion-btn .arrow {
    font-size: 0.9rem;
    color: var(--clr-gold);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.mobile-accordion.active .mobile-accordion-btn .arrow {
    transform: rotate(180deg);
}

.mobile-accordion-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
    opacity: 0;
}

.mobile-accordion.active .mobile-accordion-content {
    max-height: 450px;
    opacity: 1;
    margin: 8px 0 16px;
    padding-left: 8px;
}

.mobile-accordion-content a {
    display: block;
    padding: 8px 14px;
    font-size: 0.98rem;
    color: rgba(252, 231, 204, 0.72);
    text-decoration: none;
    border-left: 2px solid rgba(244, 209, 148, 0.2);
    margin: 4px 0;
    transition: all 0.2s ease;
}

.mobile-accordion-content a:hover {
    color: var(--clr-gold);
    border-left-color: var(--clr-gold);
    background: rgba(244, 209, 148, 0.06);
    padding-left: 18px;
}

.mobile-menu-footer {
    padding: 20px 24px 28px;
    border-top: 1px solid rgba(252, 231, 204, 0.1);
    background: rgba(12, 12, 16, 0.8);
}

.full-width {
    width: 100%;
}

`;

// 3. Media query responsive navbar overhaul
const responsiveStartMarker = '/* --- Responsive --- */\n@media (max-width: 1024px) {';
const responsiveIdx = css.indexOf('/* --- Responsive --- */');

if (responsiveIdx === -1) {
    console.error('ERROR: Could not find /* --- Responsive --- */');
    process.exit(1);
}

const navbarResponsiveCSS = `/* --- Universal Responsive Navbar & Navigation System --- */
@media (max-width: 1199px) and (min-width: 992px) {
    .nav-links {
        gap: 20px;
    }
    .nav-link {
        font-size: 0.9rem;
    }
    .navbar {
        padding: 9px 18px 9px 24px;
    }
    .navbar .btn-primary {
        padding: 8px 18px;
        font-size: 0.82rem;
    }
}

@media (max-width: 991px) {
    .nav-links {
        display: none !important;
    }

    .mobile-menu-toggle {
        display: inline-flex !important;
    }

    .navbar-wrapper {
        top: 14px;
        padding: 0 16px;
    }

    .navbar-wrapper.scrolled {
        top: 8px;
    }

    .navbar {
        padding: 9px 16px 9px 22px;
        border-radius: 16px;
    }

    .navbar .btn-primary {
        display: inline-flex;
        padding: 8px 16px;
        font-size: 0.82rem;
        border-radius: 20px;
    }
}

@media (max-width: 767px) {
    .navbar-wrapper {
        top: 10px;
        padding: 0 12px;
    }

    .navbar-wrapper.scrolled {
        top: 6px;
    }

    .navbar {
        padding: 8px 12px 8px 18px;
        border-radius: 14px;
        background: rgba(1, 1, 2, 0.88);
    }

    .logo {
        font-size: 1.35rem;
    }

    .navbar .btn-primary {
        display: none !important;
    }

    .mobile-menu-toggle {
        width: 38px;
        height: 38px;
        border-radius: 10px;
    }

    .mobile-menu-toggle svg {
        width: 20px;
        height: 20px;
    }
}

@media (max-width: 400px) {
    .navbar-wrapper {
        top: 8px;
        padding: 0 8px;
    }

    .navbar {
        padding: 7px 10px 7px 14px;
        border-radius: 12px;
    }

    .logo {
        font-size: 1.25rem;
    }
}

`;

// Normalize CRLF to LF
let normCss = css.replace(/\r\n/g, '\n');
const normOldToggle = oldToggle.replace(/\r\n/g, '\n');
const normNewToggle = newToggle.replace(/\r\n/g, '\n');

if (normCss.includes(normOldToggle)) {
    normCss = normCss.replace(normOldToggle, normNewToggle);
    console.log('Replaced mobile-menu-toggle in CSS');
} else {
    console.error('Could not find oldToggle in CSS');
}

// Replace overlay
const normStartOverlayIdx = normCss.indexOf(startOverlayMarker);
const normEndOverlayIdx = normCss.indexOf(endOverlayMarker);
normCss = normCss.slice(0, normStartOverlayIdx) + newOverlaySection + normCss.slice(normEndOverlayIdx);
console.log('Replaced mobile-menu-overlay in CSS');

// Insert navbar responsive rules right after /* --- Responsive --- */
const normRespMarker = '/* --- Responsive --- */';
const normRespIdx = normCss.indexOf(normRespMarker);
if (normRespIdx !== -1) {
    normCss = normCss.slice(0, normRespIdx) + navbarResponsiveCSS + normCss.slice(normRespIdx);
    console.log('Inserted navbarResponsiveCSS');
}

fs.writeFileSync('CSS/style.css', normCss.replace(/\n/g, '\r\n'), 'utf8');
console.log('SUCCESS: Updated CSS/style.css with luxury responsive navbar styles');

