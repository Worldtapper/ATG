const fs = require('fs');

// 1. Update services.html
let html = fs.readFileSync('services.html', 'utf8');

const startMarker = '<section class="sd-divisions-section" id="divisions">';
const endMarker = '<section class="sd-offer-section" id="capabilities">';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error('Markers not found in services.html', { startIndex, endIndex });
    process.exit(1);
}

// Find the last </section> before endMarker
const sub = html.substring(startIndex, endIndex);
const lastSec = sub.lastIndexOf('</section>');
const replaceEnd = startIndex + lastSec + '</section>'.length;

const newSectionHtml = `<section class="sd-divisions-section" id="divisions">
            <div class="sd-container">
                <div class="sd-section-header sd-reveal">
                    <div class="sd-eyebrow">
                        <span class="sd-eyebrow-dot"></span>
                        <span>Core Specialisations</span>
                    </div>
                    <h2 class="sd-section-title">Choose Your Division</h2>
                    <p class="sd-section-desc">
                        Select a division to discover our specialised capabilities, engineered solutions, and dedicated design catalogues.
                    </p>
                </div>

                <div class="sd-division-split-grid">

                    <!-- DIVISION 01: METAL FABRICATION -->
                    <a href="metal-fabrication.html" class="sd-div-hero-card sd-reveal sd-delay-1" id="metalFabricationDivision" aria-label="Explore Metal Fabrication Division">
                        <div class="sd-div-hero-bg">
                            <img src="images/gate-ribbed-motorised.jpg" alt="Metal Fabrication - Architectural Gates, Doors and Structural Steel" class="sd-div-hero-img" loading="lazy">
                            <div class="sd-div-hero-overlay"></div>
                            <div class="sd-div-hero-sheen"></div>
                        </div>

                        <div class="sd-div-hero-content">
                            <span class="sd-div-hero-tag">Division 01</span>
                            <div class="sd-div-hero-text">
                                <h3 class="sd-div-hero-title">Metal Fabrication</h3>
                                <p class="sd-div-hero-desc">Precision-crafted metalwork, built to last.</p>
                            </div>
                            <div class="sd-div-hero-cta">
                                <span class="sd-div-cta-label">Explore Division</span>
                                <span class="sd-div-cta-icon" aria-hidden="true">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </a>

                    <!-- DIVISION 02: INTERIORS -->
                    <a href="interiors.html" class="sd-div-hero-card sd-reveal sd-delay-2" id="interiorsDivision" aria-label="Explore Interiors Division">
                        <div class="sd-div-hero-bg">
                            <img src="images/kitchen-luxury-dark-graphite.jpg" alt="Interiors - Contemporary Furniture, Kitchens and Custom Craftsmanship" class="sd-div-hero-img" loading="lazy">
                            <div class="sd-div-hero-overlay"></div>
                            <div class="sd-div-hero-sheen"></div>
                        </div>

                        <div class="sd-div-hero-content">
                            <span class="sd-div-hero-tag">Division 02</span>
                            <div class="sd-div-hero-text">
                                <h3 class="sd-div-hero-title">Interiors</h3>
                                <p class="sd-div-hero-desc">Thoughtfully crafted spaces and furniture.</p>
                            </div>
                            <div class="sd-div-hero-cta">
                                <span class="sd-div-cta-label">Explore Division</span>
                                <span class="sd-div-cta-icon" aria-hidden="true">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </a>

                </div>
            </div>
        </section>`;

html = html.substring(0, startIndex) + newSectionHtml + html.substring(replaceEnd);
fs.writeFileSync('services.html', html, 'utf8');
console.log('Successfully updated services.html Section 02!');

// 2. Update CSS/services-division.css
let css = fs.readFileSync('CSS/services-division.css', 'utf8');

const cssStartMarker = '/* ==========================================================================\r\n   SECTION 02: CHOOSE YOUR DIVISION';
const cssStartMarkerAlt = '/* ==========================================================================\n   SECTION 02: CHOOSE YOUR DIVISION';
let cStartIndex = css.indexOf(cssStartMarker);
if (cStartIndex === -1) cStartIndex = css.indexOf(cssStartMarkerAlt);

const cssEndMarker = '/* ==========================================================================\r\n   SECTION 03:';
const cssEndMarkerAlt = '/* ==========================================================================\n   SECTION 03:';
let cEndIndex = css.indexOf(cssEndMarker);
if (cEndIndex === -1) cEndIndex = css.indexOf(cssEndMarkerAlt);

if (cStartIndex === -1 || cEndIndex === -1) {
    console.error('CSS markers not found', { cStartIndex, cEndIndex });
    process.exit(1);
}

const newCssBlock = `/* ==========================================================================
   SECTION 02: CHOOSE YOUR DIVISION (THE PRIMARY VISUAL FOCUS)
   ========================================================================== */
.sd-divisions-section {
    position: relative;
    padding: 70px 0 100px;
    background: radial-gradient(circle at 50% 0%, rgba(244, 209, 148, 0.05) 0%, transparent 70%);
}

.sd-division-split-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
}

.sd-div-hero-card {
    position: relative;
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 580px;
    padding: 48px 44px;
    text-decoration: none;
    color: var(--clr-cream);
    border: 1px solid rgba(244, 209, 148, 0.22);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(244, 209, 148, 0.2);
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                border-color 0.4s ease,
                box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;
    background: #08080a;
}

.sd-div-hero-card:hover {
    transform: translateY(-8px);
    border-color: rgba(244, 209, 148, 0.65);
    box-shadow: 0 35px 80px rgba(0, 0, 0, 0.75), 0 0 40px rgba(244, 209, 148, 0.22);
}

/* Background image and overlays */
.sd-div-hero-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
    z-index: 1;
}

.sd-div-hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    filter: brightness(0.85) contrast(1.08);
    transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease;
}

.sd-div-hero-card:hover .sd-div-hero-img {
    transform: scale(1.07);
    filter: brightness(0.95) contrast(1.12);
}

.sd-div-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, 
                rgba(1, 1, 2, 0.2) 0%, 
                rgba(1, 1, 2, 0.45) 45%, 
                rgba(1, 1, 2, 0.94) 100%);
    transition: background 0.5s ease;
}

.sd-div-hero-card:hover .sd-div-hero-overlay {
    background: linear-gradient(180deg, 
                rgba(1, 1, 2, 0.1) 0%, 
                rgba(1, 1, 2, 0.4) 40%, 
                rgba(1, 1, 2, 0.92) 100%);
}

.sd-div-hero-sheen {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 100%, rgba(244, 209, 148, 0.12) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.6s ease;
    pointer-events: none;
}

.sd-div-hero-card:hover .sd-div-hero-sheen {
    opacity: 1;
}

/* Content */
.sd-div-hero-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    width: 100%;
}

.sd-div-hero-tag {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    padding: 6px 14px;
    background: rgba(1, 1, 2, 0.75);
    border: 1px solid rgba(244, 209, 148, 0.35);
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--clr-gold);
    margin-bottom: 24px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

.sd-div-hero-text {
    margin-bottom: 32px;
}

.sd-div-hero-title {
    font-size: clamp(2.1rem, 3.2vw, 2.85rem);
    font-family: var(--font-heading);
    font-weight: 700;
    color: var(--clr-cream);
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 12px;
    transition: color 0.3s ease;
}

.sd-div-hero-card:hover .sd-div-hero-title {
    color: #ffffff;
}

.sd-div-hero-desc {
    font-size: 1.05rem;
    line-height: 1.6;
    color: rgba(252, 231, 204, 0.85);
    font-weight: 300;
    max-width: 440px;
}

/* Elegant CTA link container */
.sd-div-hero-cta {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    align-self: flex-start;
    padding: 14px 24px;
    background: rgba(12, 12, 16, 0.75);
    border: 1px solid rgba(244, 209, 148, 0.35);
    border-radius: var(--border-radius-sm);
    color: var(--clr-cream);
    font-family: var(--font-heading);
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.sd-div-cta-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--clr-gold);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
}

.sd-div-hero-card:hover .sd-div-hero-cta {
    background: var(--clr-gold);
    color: var(--clr-black);
    border-color: var(--clr-gold);
    box-shadow: 0 8px 24px rgba(244, 209, 148, 0.4);
    transform: translateY(-2px);
}

.sd-div-hero-card:hover .sd-div-cta-icon {
    color: var(--clr-black);
    transform: translateX(6px);
}

\r\n`;

css = css.substring(0, cStartIndex) + newCssBlock + css.substring(cEndIndex);

// Add responsive rules if not present
if (!css.includes('.sd-division-split-grid {')) {
    css = css.replace(
        '.sd-quality-grid {\r\n        grid-template-columns: repeat(2, 1fr);',
        `.sd-division-split-grid {\r\n        grid-template-columns: 1fr 1fr;\r\n        gap: 24px;\r\n    }\r\n    .sd-div-hero-card {\r\n        min-height: 500px;\r\n        padding: 36px 30px;\r\n    }\r\n    .sd-quality-grid {\r\n        grid-template-columns: repeat(2, 1fr);`
    );
    css = css.replace(
        '.sd-division-grid {\r\n        grid-template-columns: 1fr;\r\n        gap: 28px;\r\n    }',
        `.sd-division-split-grid {\r\n        grid-template-columns: 1fr;\r\n        gap: 24px;\r\n    }\r\n    .sd-div-hero-card {\r\n        min-height: 440px;\r\n        padding: 32px 24px;\r\n    }\r\n    .sd-div-hero-title {\r\n        font-size: 2.1rem;\r\n    }`
    );
}

fs.writeFileSync('CSS/services-division.css', css, 'utf8');
console.log('Successfully updated CSS/services-division.css Section 02!');
