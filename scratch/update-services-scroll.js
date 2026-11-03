const fs = require('fs');

let js = fs.readFileSync('JS/services.js', 'utf8');

// 1. Add updateScrollDownButton calls
// In openOverviewMode
js = js.replace(
    "if (updateUrl) {\n            updateBrowserUrl('services.html');\n        }",
    "if (updateUrl) {\n            updateBrowserUrl('services.html');\n        }\n        updateScrollDownButton();"
);

// In openAllDesignsMode
js = js.replace(
    "syncActiveNavChip();\n        renderAllDesignsGrid();",
    "syncActiveNavChip();\n        renderAllDesignsGrid();\n        updateScrollDownButton();"
);

// In openCategoryMode
js = js.replace(
    "renderFocusedCategoryGrid();\n        syncActiveNavChip();",
    "renderFocusedCategoryGrid();\n        syncActiveNavChip();\n        updateScrollDownButton();"
);

// 2. Add initScrollDownAffordance and updateScrollDownButton implementation
const helperFunctions = `
    /* ==========================================================================
       SCROLL DOWN BUTTON (FOR SHOWROOM & ALL DESIGNS)
       ========================================================================== */

    function initScrollDownAffordance() {
        const btn = document.getElementById('catalogueScrollDownBtn');
        if (!btn) return;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToCatalogueTop();
        });

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY || window.pageYOffset;
            if (scrollY > 1400) {
                btn.classList.add('is-scrolled-past');
            } else {
                btn.classList.remove('is-scrolled-past');
            }
        }, { passive: true });
    }

    function updateScrollDownButton() {
        const btn = document.getElementById('catalogueScrollDownBtn');
        if (!btn) return;
        const shouldShow = (state.mode === 'overview' || state.mode === 'all');
        btn.classList.toggle('is-visible', shouldShow);

        const textSpan = btn.querySelector('.scroll-btn-text');
        if (textSpan) {
            textSpan.textContent = (state.mode === 'all') ? 'Scroll to All Designs' : 'Scroll to Showroom';
        }
    }
`;

// Add initScrollDownAffordance() call inside DOMContentLoaded
js = js.replace(
    "initCategoryNavBar();",
    "initCategoryNavBar();\n    initScrollDownAffordance();"
);

// Add the helper functions before the closing of the file or before scrollToCatalogueTop
js = js.replace(
    "function scrollToCatalogueTop() {",
    helperFunctions + "\n    function scrollToCatalogueTop() {"
);

fs.writeFileSync('JS/services.js', js, 'utf8');
console.log('SUCCESS: Updated JS/services.js with Scroll Down Button logic');

