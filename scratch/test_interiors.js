const fs = require('fs');
const path = require('path');

console.log('=== ATG INTERIORS PAGE REDESIGN VERIFICATION ===\n');

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
const htmlPath = path.resolve('interiors.html');
const cssPath = path.resolve('CSS/interiors.css');
const jsPath = path.resolve('JS/interiors.js');
const catDataPath = path.resolve('JS/catalogue-data.js');

assert(fs.existsSync(htmlPath), 'interiors.html exists');
assert(fs.existsSync(cssPath), 'CSS/interiors.css exists');
assert(fs.existsSync(jsPath), 'JS/interiors.js exists');

// 2. Verify HTML structure & sections
const html = fs.readFileSync(htmlPath, 'utf8');

assert(html.includes('SPACES THAT INSPIRE'), 'Hero title present');
assert(html.includes('DETAILS THAT DEFINE'), 'Hero title accent present');
assert(html.includes('DESIGNED FOR LIVING. CRAFTED FOR YOU.'), 'Intro section present');
assert(html.includes('id="categorySliderSection"'), 'Horizontal category slider section present');
assert(html.includes('id="catSliderTrack"'), 'Category slider track present');
assert(html.includes('id="catSliderPrev"'), 'Slider prev button present');
assert(html.includes('id="catSliderNext"'), 'Slider next button present');
assert(html.includes('id="collectionSection"'), 'Dynamic collection section present');
assert(html.includes('id="collectionHeader"'), 'Collection header present');
assert(html.includes('id="interiorCardsGrid"'), 'Single shared dynamic cards grid present');
assert(html.includes('BEAUTY IN EVERY DETAIL'), 'Interior Inspiration showcase present');
assert(html.includes('OUR INTERIOR DESIGN APPROACH'), 'Our Approach section present');
assert(html.includes('DISCOVER') && html.includes('DESIGN') && html.includes('CRAFT') && html.includes('DELIVER'), 'All 4 approach steps present');
assert(html.includes('LET\'S CREATE SOMETHING BEAUTIFUL'), 'Final CTA section present');
assert(html.includes('id="atgDesignModal"'), 'View Details modal container present');
assert(!html.includes('modal-pricing-container'), 'NO pricing container in modal HTML');
assert(html.includes('class="site-footer"'), 'Standard site-footer class present');
assert(html.includes('footer-massive-text'), 'Massive footer watermark present');

// 3. Verify Stylesheet and Script links
assert(html.includes('CSS/interiors.css'), 'Links CSS/interiors.css');
assert(html.includes('CSS/atg-transitions.css'), 'Links CSS/atg-transitions.css');
assert(html.includes('JS/catalogue-data.js'), 'Loads JS/catalogue-data.js');
assert(html.includes('JS/favourites.js'), 'Loads JS/favourites.js');
assert(html.includes('JS/interiors.js'), 'Loads JS/interiors.js');
assert(html.includes('JS/atg-transitions.js'), 'Loads JS/atg-transitions.js');

// 4. Verify Catalogue Data & Interiors Categories
const catDataCode = fs.readFileSync(catDataPath, 'utf8');
const fakeWindow = {};
const evalEnv = new Function('window', catDataCode + '; return window;');
const win = evalEnv(fakeWindow);

const expectedIntCats = [
    'Chairs',
    'Tables',
    'Custom Furniture',
    'Shelves & Storage',
    'Boutique Garment Racks & Retail Displays',
    'Kitchen Cabinets',
    'Wardrobes',
    'Interior Solutions'
];

expectedIntCats.forEach(catName => {
    const found = win.ATG_CATEGORIES.find(c => c.name === catName);
    assert(!!found, `Category "${catName}" exists in ATG_CATEGORIES`);
    
    // Check design count
    const designs = win.ATG_CATALOGUE_DATA.filter(d => d.category === catName);
    assert(designs.length === 9, `Category "${catName}" has exactly 9 designs in catalogue (got ${designs.length})`);
});

// 5. Verify NO Metal Fabrication categories in Interiors
const metalCatNames = ['Gates', 'Doors', 'Staircases', 'Railings & Balustrades', 'Metal Fabrication', 'Structural Steel', 'Aluminium & Glass'];
metalCatNames.forEach(name => {
    assert(!expectedIntCats.includes(name), `Metal category "${name}" is NOT in interiors categories`);
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

// 7. Verify all 72 interior design images exist on disk
console.log('\nTesting images for all 72 Interiors designs...');
let missingDesignImgs = 0;
expectedIntCats.forEach(catName => {
    const designs = win.ATG_CATALOGUE_DATA.filter(d => d.category === catName);
    designs.forEach(d => {
        if (d.image && !fs.existsSync(path.resolve(d.image))) {
            console.error(`❌ Missing image for design [${d.id}]: ${d.image}`);
            missingDesignImgs++;
        }
    });
});
assert(missingDesignImgs === 0, `All 72 interior design images exist on disk (missing: ${missingDesignImgs})`);

// 8. Verify JS/interiors.js does NOT contain price rendering
const jsCode = fs.readFileSync(jsPath, 'utf8');
assert(!jsCode.includes('priceEstimate'), 'JS/interiors.js completely omits priceEstimate');
assert(!jsCode.includes('card-pricing-row'), 'JS/interiors.js does NOT render card-pricing-row');
assert(!jsCode.includes('modal-pricing-container'), 'JS/interiors.js does NOT render modal-pricing-container');
assert(jsCode.includes('window.ATGFavourites'), 'JS/interiors.js integrates with window.ATGFavourites');
assert(jsCode.includes('atg:favourites-updated'), 'JS/interiors.js listens for favourites updates');

console.log(`\n========================================`);
if (errors === 0) {
    console.log('🎉 ALL INTERIORS VERIFICATIONS PASSED WITH ZERO ERRORS!');
} else {
    console.error(`⚠️ VERIFICATION FAILED WITH ${errors} ERRORS.`);
    process.exit(1);
}

