const fs = require('fs');
const path = require('path');

console.log('=== ATG GALLERY PAGE REDESIGN & UPGRADE VERIFICATION ===\n');

let errors = 0;

function assert(condition, message) {
    if (!condition) {
        console.error('❌ FAIL:', message);
        errors++;
    } else {
        console.log('✅ PASS:', message);
    }
}

// 1. Files existence
const htmlPath = path.resolve('gallery.html');
const cssPath = path.resolve('CSS/gallery.css');
const jsPath = path.resolve('JS/gallery.js');
const dataPath = path.resolve('JS/gallery-data.js');

assert(fs.existsSync(htmlPath), 'gallery.html exists');
assert(fs.existsSync(cssPath), 'CSS/gallery.css exists');
assert(fs.existsSync(jsPath), 'JS/gallery.js exists');
assert(fs.existsSync(dataPath), 'JS/gallery-data.js exists');

// 2. HTML Structure
const html = fs.readFileSync(htmlPath, 'utf8');

assert(html.includes('THE ATG PROJECT COLLECTION'), 'Hero eyebrow present');
assert(html.includes('CRAFTED WITH PURPOSE'), 'Hero title present');
assert(html.includes('BUILT TO INSPIRE'), 'Hero title accent present');
assert(html.includes('EVERY PROJECT TELLS A STORY'), 'Introduction section present');
assert(html.includes('FEATURED COMMISSION'), 'Featured project spotlight section present');
assert(html.includes('id="featuredProjectBtn"'), 'Featured project view button present');
assert(html.includes('data-division="all"'), 'Division tab All present');
assert(html.includes('data-division="Metal Fabrication"'), 'Division tab Metal Fabrication present');
assert(html.includes('data-division="Interiors"'), 'Division tab Interiors present');
assert(html.includes('id="galleryCategoryChips"'), 'Dynamic category chips container present');
assert(html.includes('id="galleryGrid"'), 'Portfolio grid container present');
assert(html.includes('id="atgProjectModal"'), 'Project details modal container present');
assert(html.includes('id="modalViewerImg"'), 'Modal gallery main viewer image present');
assert(html.includes('id="modalPrevImg"') && html.includes('id="modalNextImg"'), 'Modal gallery prev/next controls present');
assert(html.includes('id="modalThumbsStrip"'), 'Modal gallery thumbnail strip present');
assert(!html.includes('modal-pricing-container') && !html.includes('card-pricing-row'), 'NO pricing elements in HTML');
assert(html.includes('INSPIRED BY WHAT YOU SEE'), 'Enquiry section present');
assert(html.includes('class="site-footer"'), 'Standard site-footer class present');
assert(html.includes('footer-massive-text'), 'Massive footer watermark present');

// 3. Stylesheet and Script links
assert(html.includes('CSS/gallery.css'), 'Links CSS/gallery.css');
assert(html.includes('CSS/atg-transitions.css'), 'Links CSS/atg-transitions.css');
assert(html.includes('JS/gallery-data.js'), 'Loads JS/gallery-data.js');
assert(html.includes('JS/gallery.js'), 'Loads JS/gallery.js');
assert(html.includes('JS/atg-transitions.js'), 'Loads JS/atg-transitions.js');

// 4. Data verification
const dataCode = fs.readFileSync(dataPath, 'utf8');
const fakeWindow = {};
new Function('window', dataCode)(fakeWindow);

assert(Array.isArray(fakeWindow.ATG_GALLERY_PROJECTS), 'ATG_GALLERY_PROJECTS is array');
assert(fakeWindow.ATG_GALLERY_PROJECTS.length === 18, `Contains exactly 18 completed projects (got ${fakeWindow.ATG_GALLERY_PROJECTS.length})`);

const metalProjects = fakeWindow.ATG_GALLERY_PROJECTS.filter(p => p.division === 'Metal Fabrication');
const interiorProjects = fakeWindow.ATG_GALLERY_PROJECTS.filter(p => p.division === 'Interiors');

assert(metalProjects.length === 8, `Exactly 8 Metal Fabrication projects (got ${metalProjects.length})`);
assert(interiorProjects.length === 10, `Exactly 10 Interiors projects (got ${interiorProjects.length})`);

fakeWindow.ATG_GALLERY_PROJECTS.forEach(p => {
    assert(!!p.id && !!p.title && !!p.division && !!p.category && !!p.image && !!p.status, `Project [${p.id}] has complete structured admin-compatible fields`);
});

// 5. Image verification on disk
const imgRegex = /src="([^"]+\.(?:jpg|png|webp|svg))"/g;
let match;
const htmlImages = new Set();
while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    if (src.startsWith('images/')) {
        htmlImages.add(src);
    }
}

console.log(`\nTesting ${htmlImages.size} images directly referenced in gallery.html...`);
htmlImages.forEach(img => {
    assert(fs.existsSync(path.resolve(img)), `HTML Image exists: ${img}`);
});

console.log(`\nTesting all project images & gallery photos across 18 projects...`);
let missingPhotos = 0;
fakeWindow.ATG_GALLERY_PROJECTS.forEach(p => {
    if (!fs.existsSync(path.resolve(p.image))) {
        console.error(`❌ Missing main image for [${p.id}]: ${p.image}`);
        missingPhotos++;
    }
    p.gallery?.forEach(img => {
        if (!fs.existsSync(path.resolve(img))) {
            console.error(`❌ Missing gallery photo for [${p.id}]: ${img}`);
            missingPhotos++;
        }
    });
});
assert(missingPhotos === 0, `All project photographs exist on disk (missing: ${missingPhotos})`);

// 6. JS verification
const jsCode = fs.readFileSync(jsPath, 'utf8');
assert(!jsCode.includes('priceEstimate'), 'JS/gallery.js has NO priceEstimate');
assert(jsCode.includes('window.ATG_GALLERY'), 'JS/gallery.js exposes window.ATG_GALLERY API');
assert(jsCode.includes('setDivision') && jsCode.includes('setCategory'), 'JS/gallery.js supports dynamic division and category filtering');
assert(jsCode.includes('renderModalGalleryImages'), 'JS/gallery.js supports multi-image carousel modal');

console.log(`\n========================================`);
if (errors === 0) {
    console.log('🎉 ALL GALLERY VERIFICATIONS PASSED WITH ZERO ERRORS!');
} else {
    console.error(`⚠️ VERIFICATION FAILED WITH ${errors} ERRORS.`);
    process.exit(1);
}

