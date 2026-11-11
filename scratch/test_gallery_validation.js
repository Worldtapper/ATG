const fs = require('fs');

console.log('=== RUNNING ATG GALLERY VALIDATION ===');

// 1. Verify HTML Structure
const html = fs.readFileSync('gallery.html', 'utf8');

const requiredIds = [
    'mobileMenu', 'navbarWrapper', 'galleryHero', 'galleryFilterBar',
    'countAll', 'countMetal', 'countInteriors', 'galleryShowcase',
    'galleryGrid', 'galleryEmpty', 'galleryCta', 'atgProjectModal',
    'modalContainer', 'modalCloseBtn', 'modalViewerImg', 'modalPrevBtn',
    'modalNextBtn', 'modalCounter', 'modalThumbsStrip', 'modalBadge',
    'modalTitle', 'modalSubtitle', 'modalOverview', 'modalLocation',
    'modalMaterials', 'modalFinish', 'modalStatus', 'modalNotesList',
    'modalActionBtn', 'atgFloatingFavBtn', 'scrollTopBtn'
];

let allFound = true;
requiredIds.forEach(id => {
    if (!html.includes(`id="${id}"`)) {
        console.error('MISSING ID in HTML:', id);
        allFound = false;
    }
});

if (allFound) {
    console.log(`[PASS] All ${requiredIds.length} critical element IDs are present in gallery.html`);
}

// 2. Verify Scripts
const scripts = ['JS/index.js', 'JS/favourites.js', 'JS/gallery-data.js', 'JS/gallery.js', 'JS/atg-transitions.js'];
scripts.forEach(s => {
    if (!html.includes(`src="${s}"`)) {
        console.error('[FAIL] Missing script in HTML:', s);
    } else {
        console.log('[PASS] Script linked:', s);
    }
});

// 3. Verify Stylesheets
const cssFiles = ['CSS/style.css', 'CSS/gallery.css', 'CSS/atg-transitions.css'];
cssFiles.forEach(c => {
    if (!html.includes(`href="${c}"`)) {
        console.error('[FAIL] Missing CSS in HTML:', c);
    } else {
        console.log('[PASS] Stylesheet linked:', c);
    }
});

// 4. Verify Gallery Data & Curated Projects
global.window = {};
eval(fs.readFileSync('JS/gallery-data.js', 'utf8'));

const all = window.ATG_GALLERY_PROJECTS;
console.log(`[INFO] Total projects in data repository: ${all.length}`);

const curated = all.filter(p => p.curated);
console.log(`[INFO] Curated showcase projects: ${curated.length}`);

if (curated.length !== 6) {
    console.error('[FAIL] Expected exactly 6 curated projects, found:', curated.length);
} else {
    console.log('[PASS] Exactly 6 curated projects defined.');
}

const metal = curated.filter(p => p.division === 'Metal Fabrication');
const interiors = curated.filter(p => p.division === 'Interiors');

console.log(`[INFO] Metal Fabrication projects (${metal.length}):`);
metal.forEach(p => console.log(`   - [${p.id}] ${p.title} (${p.category})`));

console.log(`[INFO] Interiors projects (${interiors.length}):`);
interiors.forEach(p => console.log(`   - [${p.id}] ${p.title} (${p.category})`));

if (metal.length === 3 && interiors.length === 3) {
    console.log('[PASS] Balanced 3 per division achieved.');
} else {
    console.error('[FAIL] Division balance mismatch: metal=' + metal.length + ', interiors=' + interiors.length);
}

// 5. Verify Images on Disk
let imageIssues = 0;
curated.forEach(p => {
    if (!fs.existsSync(p.image)) {
        console.error(`[FAIL] Cover image not found: ${p.image} for project ${p.id}`);
        imageIssues++;
    }
    p.gallery.forEach((img, idx) => {
        if (!fs.existsSync(img)) {
            console.error(`[FAIL] Gallery image [${idx}] not found: ${img} for project ${p.id}`);
            imageIssues++;
        }
    });
});

if (imageIssues === 0) {
    console.log('[PASS] All cover and multi-photo gallery images verified on disk.');
}

// 6. Check for Price Leaks
const allText = JSON.stringify(curated);
if (/₦|NGN|\$|price|cost/i.test(allText)) {
    console.warn('[WARN] Possible price references detected in curated text:', allText.match(/(?:₦|NGN|\$)\s*[0-9,]+/gi));
} else {
    console.log('[PASS] Zero price references detected.');
}

console.log('=== VALIDATION COMPLETE ===');

