const fs = require('fs');

let css = fs.readFileSync('CSS/start-your-project.css', 'utf8');

// Find boundary of .syp-designs-grid up to /* Empty Favourites State */
const startMarker = '/* Designs Grid */';
const endMarker = '/* Empty Favourites State */';

const startIdx = css.indexOf(startMarker);
const endIdx = css.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
    console.error('ERROR: Could not find markers in CSS');
    process.exit(1);
}

const replacement = `/* Designs Grid & Category Sections */
.syp-designs-grid {
    margin-bottom: 28px;
}

/* Category Sections in All Disciplines Overview */
.syp-category-section {
    background: linear-gradient(180deg, rgba(20, 20, 26, 0.6) 0%, rgba(12, 12, 16, 0.8) 100%);
    border: 1px solid rgba(252, 231, 204, 0.08);
    border-radius: 16px;
    padding: 22px 24px;
    margin-bottom: 28px;
    transition: border-color 0.3s ease;
}

.syp-category-section:hover {
    border-color: rgba(244, 209, 148, 0.2);
}

.syp-cat-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 18px;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(252, 231, 204, 0.07);
}

.syp-cat-section-title-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
}

.syp-cat-section-title {
    font-family: var(--font-heading, sans-serif);
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--clr-white, #ffffff);
    margin: 0;
}

.syp-cat-section-count {
    font-size: 0.76rem;
    font-weight: 700;
    color: var(--clr-gold, #F4D194);
    background: rgba(244, 209, 148, 0.1);
    border: 1px solid rgba(244, 209, 148, 0.2);
    padding: 3px 9px;
    border-radius: 12px;
}

.syp-cat-section-view-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(244, 209, 148, 0.08);
    border: 1px solid rgba(244, 209, 148, 0.25);
    color: var(--clr-gold, #F4D194);
    font-size: 0.8rem;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.25s ease;
}

.syp-cat-section-view-btn:hover {
    background: var(--clr-gold, #F4D194);
    color: var(--clr-black, #010102);
    transform: translateX(3px);
}

/* Grids for Section and Single Category Views */
.syp-designs-section-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
}

@media (max-width: 991px) {
    .syp-designs-section-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }
}

@media (max-width: 575px) {
    .syp-designs-section-grid {
        grid-template-columns: 1fr;
        gap: 14px;
    }
}

/* Single Category View Banner */
.syp-single-cat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 14px;
    margin-bottom: 22px;
    padding: 16px 20px;
    background: linear-gradient(180deg, rgba(22, 22, 30, 0.8) 0%, rgba(14, 14, 18, 0.9) 100%);
    border: 1px solid rgba(244, 209, 148, 0.22);
    border-radius: 14px;
}

.syp-cat-view-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: 1px solid rgba(244, 209, 148, 0.35);
    color: var(--clr-gold, #F4D194);
    font-size: 0.82rem;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.syp-cat-view-back-btn:hover {
    background: rgba(244, 209, 148, 0.15);
    border-color: var(--clr-gold, #F4D194);
    transform: translateX(-2px);
}

.syp-single-cat-info {
    text-align: right;
}

.syp-single-cat-title {
    font-family: var(--font-heading, sans-serif);
    font-size: 1.25rem;
    color: var(--clr-white, #ffffff);
    margin: 0 0 2px;
}

.syp-single-cat-count {
    font-size: 0.78rem;
    color: var(--clr-gold, #F4D194);
}

/* Search results & empty state */
.syp-search-results-bar {
    padding: 12px 18px;
    margin-bottom: 20px;
    background: rgba(244, 209, 148, 0.08);
    border: 1px solid rgba(244, 209, 148, 0.2);
    border-radius: 10px;
    font-size: 0.88rem;
    color: var(--clr-cream, #FCE7CC);
}

.syp-search-empty-state {
    text-align: center;
    padding: 48px 20px;
    background: rgba(18, 18, 24, 0.5);
    border: 1px dashed rgba(244, 209, 148, 0.2);
    border-radius: 14px;
}

.syp-search-empty-title {
    font-family: var(--font-heading, sans-serif);
    font-size: 1.15rem;
    color: var(--clr-white, #ffffff);
    margin: 0 0 8px;
}

.syp-search-empty-hint {
    font-size: 0.85rem;
    color: rgba(252, 231, 204, 0.7);
}

/* Selectable Design Card — Compact & Luxury */
.syp-design-card {
    position: relative;
    background: linear-gradient(180deg, rgba(20, 20, 28, 0.9) 0%, rgba(12, 12, 16, 0.98) 100%);
    border: 1px solid rgba(252, 231, 204, 0.12);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
}

.syp-design-card:hover {
    border-color: rgba(244, 209, 148, 0.45);
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.55);
}

.syp-design-card.is-selected {
    border-color: var(--clr-gold, #F4D194);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.65), 0 0 18px rgba(244, 209, 148, 0.25);
}

.syp-design-thumb-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 10;
    background: #000;
    overflow: hidden;
}

.syp-design-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
}

.syp-design-card:hover .syp-design-thumb {
    transform: scale(1.05);
}

.syp-design-check-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(14, 14, 18, 0.85);
    border: 1.5px solid rgba(252, 231, 204, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: transparent;
    transition: all 0.25s ease;
    z-index: 2;
}

.syp-design-card.is-selected .syp-design-check-badge {
    background: var(--clr-gold, #F4D194);
    border-color: var(--clr-gold, #F4D194);
    color: var(--clr-black, #010102);
    box-shadow: 0 0 10px var(--clr-gold, #F4D194);
}

.syp-design-price-tag {
    position: absolute;
    bottom: 8px;
    left: 8px;
    background: rgba(1, 1, 2, 0.88);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(244, 209, 148, 0.35);
    color: var(--clr-gold, #F4D194);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    padding: 3px 8px;
    border-radius: 6px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    z-index: 2;
}

.syp-design-meta {
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: space-between;
    gap: 10px;
}

.syp-design-meta-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.syp-design-cat {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--clr-gold, #F4D194);
    text-transform: uppercase;
}

.syp-design-name {
    font-family: var(--font-heading, sans-serif);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--clr-white, #ffffff);
    margin: 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.syp-design-card-btn {
    width: 100%;
    padding: 7px 10px;
    background: rgba(244, 209, 148, 0.08);
    border: 1px solid rgba(244, 209, 148, 0.22);
    border-radius: 7px;
    color: var(--clr-cream, #FCE7CC);
    font-size: 0.76rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
}

.syp-design-card:hover .syp-design-card-btn {
    border-color: rgba(244, 209, 148, 0.4);
    background: rgba(244, 209, 148, 0.14);
}

.syp-design-card.is-selected .syp-design-card-btn {
    background: var(--clr-gold, #F4D194);
    border-color: var(--clr-gold, #F4D194);
    color: var(--clr-black, #010102);
    font-weight: 700;
}

`;

css = css.slice(0, startIdx) + replacement + css.slice(endIdx);
fs.writeFileSync('CSS/start-your-project.css', css, 'utf8');
console.log('SUCCESS: Updated CSS/start-your-project.css');

