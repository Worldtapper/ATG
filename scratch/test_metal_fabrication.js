const fs = require('fs');
const path = require('path');

console.log('=== ATG METAL FABRICATION PAGE REDESIGN VERIFICATION ===\n');

let errors = 0;

function assert(condition, message) {
    if (!condition) {
        console.error('❌ FAIL:', message);
        errors++;
    } else {
        console.log('✅ PASS:', message);
    }
}

// 1. Verify files exist
const htmlPath = path.resolve('metal-fabrication.html');
const cssPath = path.resolve('CSS/metal-fabrication.css');
const jsPath = path.resolve('JS/metal-fabrication.js');
const catDataPath = path.resolve('JS/catalogue-data.js');
const favsPath = path.resolve('JS/favourites.js');

assert(fs.existsSync(htmlPath), 'metal-fabrication.html exists');
assert(fs.existsSync(cssPath), 'CSS/metal-fabrication.css exists');
assert(fs.existsSync(jsPath), 'JS/metal-fabrication.js exists');

// 2. Verify HTML structure & sections
const html = fs.readFileSync(htmlPath, 'utf8');

assert(html.includes('ENGINEERED TO DEFINE'), 'Hero title present');
assert(html.includes('CRAFTED TO LAST'), 'Hero title accent present');
assert(html.includes('WHERE STRENGTH MEETS DESIGN'), 'Intro section present');
assert(html.includes('id="categorySliderSection"'), 'Horizontal category slider section present');
assert(html.includes('id="catSliderTrack"'), 'Category slider track present');
assert(html.includes('id="catSliderPrev"'), 'Slider prev button present');
assert(html.includes('id="catSliderNext"'), 'Slider next button present');
assert(html.includes('id="collectionSection"'), 'Dynamic collection section present');
assert(html.includes('id="collectionHeader"'), 'Collection header present');
assert(html.includes('id="metalCardsGrid"'), 'Single shared dynamic cards grid present');
assert(html.includes('PRECISION IN EVERY DETAIL'), 'Craftsmanship showcase present');
assert(html.includes('OUR FABRICATION PROCESS'), 'Our Process section present');
assert(html.includes('HAVE AN ARCHITECTURAL PROJECT IN MIND'), 'Final CTA section present');
assert(html.includes('id="atgDesignModal"'), 'View Details modal container present');
assert(!html.includes('modal-pricing-container'), 'NO pricing container in modal HTML');

// 3. Verify Stylesheet and Script links
assert(html.includes('CSS/metal-fabrication.css'), 'Links CSS/metal-fabrication.css');
assert(html.includes('CSS/atg-transitions.css'), 'Links CSS/atg-transitions.css');
assert(html.includes('JS/catalogue-data.js'), 'Loads JS/catalogue-data.js');
assert(html.includes('JS/favourites.js'), 'Loads JS/favourites.js');
assert(html.includes('JS/metal-fabrication.js'), 'Loads JS/metal-fabrication.js');
assert(html.includes('JS/atg-transitions.js'), 'Loads JS/atg-transitions.js');

// 4. Verify Catalogue Data & Metal Categories
const catDataCode = fs.readFileSync(catDataPath, 'utf8');
const fakeWindow = {};
const evalEnv = new Function('window', catDataCode + '; return window;');
const win = evalEnv(fakeWindow);

const metalCats = win.ATG_CATEGORIES.filter(c => c.department === 'Architectural Metalwork');
assert(metalCats.length === 7, `Found exactly 7 Architectural Metalwork categories (got ${metalCats.length})`);

const expectedCats = [
    'Gates',
    'Doors',
    'Staircases',
    'Railings & Balustrades',
    'Metal Fabrication',
    'Structural Steel',
    'Aluminium & Glass'
];

expectedCats.forEach(catName => {
    const found = metalCats.find(c => c.name === catName);
    assert(!!found, `Category "${catName}" exists in ATG_CATEGORIES with department "Architectural Metalwork"`);
    
    // Check design count
    const designs = win.ATG_CATALOGUE_DATA.filter(d => d.category === catName);
    assert(designs.length === 9, `Category "${catName}" has exactly 9 designs in catalogue (got ${designs.length})`);
});

// 5. Verify NO Interiors categories or designs in metal categories
const interiorCatNames = ['Chairs', 'Tables', 'Custom Furniture', 'Shelves & Storage', 'Kitchen Cabinets', 'Wardrobes', 'Interior Solutions'];
interiorCatNames.forEach(name => {
    assert(!metalCats.some(c => c.name === name), `Interiors category "${name}" is NOT in metal categories`);
});

// 6. Verify image paths referenced exist on disk
const imgRegex = /src="([^"]+\.(?:jpg|png|webp|svg))"/g;
let match;
const testedImages = new Set();
while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    if (src.startsWith('images/')) {
        testedImages.add(src);
    }
}

console.log(`\nTesting ${testedImages.size} images referenced in HTML...`);
testedImages.forEach(img => {
    const diskPath = path.resolve(img);
    assert(fs.existsSync(diskPath), `Image exists on disk: ${img}`);
});

// 7. Verify all 63 metal fabrication design images exist on disk
console.log('\nTesting images for all 63 Metal Fabrication designs...');
let missingDesignImgs = 0;
expectedCats.forEach(catName => {
    const designs = win.ATG_CATALOGUE_DATA.filter(d => d.category === catName);
    designs.forEach(d => {
        if (d.image && !fs.existsSync(path.resolve(d.image))) {
            console.error(`❌ Missing image for design [${d.id}]: ${d.image}`);
            missingDesignImgs++;
        }
    });
});
assert(missingDesignImgs === 0, `All 63 metal design images exist on disk (missing: ${missingDesignImgs})`);

// 8. Verify JS/metal-fabrication.js does NOT contain price rendering
const jsCode = fs.readFileSync(jsPath, 'utf8');
assert(!jsCode.includes('priceEstimate'), 'JS/metal-fabrication.js completely omits priceEstimate');
assert(!jsCode.includes('card-pricing-row'), 'JS/metal-fabrication.js does NOT render card-pricing-row');
assert(!jsCode.includes('modal-pricing-container'), 'JS/metal-fabrication.js does NOT render modal-pricing-container');
assert(jsCode.includes('window.ATGFavourites'), 'JS/metal-fabrication.js integrates with window.ATGFavourites');
assert(jsCode.includes('atg:favourites-updated'), 'JS/metal-fabrication.js listens for favourites updates');

console.log(`\n========================================`);
if (errors === 0) {
    console.log('🎉 ALL VERIFICATIONS PASSED WITH ZERO ERRORS!');
} else {
    console.error(`⚠️ VERIFICATION FAILED WITH ${errors} ERRORS.`);
    process.exit(1);
}

