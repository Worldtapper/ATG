const fs = require('fs');
const path = require('path');

const errors = [];
const successes = [];

function checkFileExists(filePath, desc) {
    if (fs.existsSync(filePath)) {
        successes.push(`File exists: ${filePath} (${desc})`);
        return true;
    } else {
        errors.push(`Missing file: ${filePath} (${desc})`);
        return false;
    }
}

// 1. Check all required HTML pages
['services.html', 'metal-fabrication.html', 'interiors.html', 'start-your-project.html', 'index.html', 'gallery.html', 'company.html', 'contact.html', 'favourites.html'].forEach(f => {
    checkFileExists(f, 'Core HTML file');
});

// 2. Check all referenced images in services.html, metal-fabrication.html, interiors.html
function checkHtmlImages(file) {
    const html = fs.readFileSync(file, 'utf8');
    const imgMatches = [...html.matchAll(/src=["'](images\/[^"']+)["']/g)].map(m => m[1]);
    imgMatches.forEach(img => {
        const full = path.join(__dirname, '..', img);
        if (fs.existsSync(full)) {
            successes.push(`${file} -> image exists: ${img}`);
        } else {
            errors.push(`${file} -> missing image: ${img}`);
        }
    });
}

checkHtmlImages('services.html');
checkHtmlImages('metal-fabrication.html');
checkHtmlImages('interiors.html');

// 3. Check internal links in services.html, metal-fabrication.html, interiors.html
function checkHtmlLinks(file) {
    const html = fs.readFileSync(file, 'utf8');
    const linkMatches = [...html.matchAll(/href=["']([^"'#:]+\.html)(#[^"']*)?["']/g)].map(m => m[1]);
    const uniqueLinks = Array.from(new Set(linkMatches));
    uniqueLinks.forEach(target => {
        const full = path.join(__dirname, '..', target);
        if (fs.existsSync(full)) {
            successes.push(`${file} -> link target exists: ${target}`);
        } else {
            errors.push(`${file} -> broken link target: ${target}`);
        }
    });
}

checkHtmlLinks('services.html');
checkHtmlLinks('metal-fabrication.html');
checkHtmlLinks('interiors.html');

// 4. Check index.html blueprint preloader preservation
const indexHtml = fs.readFileSync('index.html', 'utf8');
if (indexHtml.includes('id="preloader"') && indexHtml.includes('blueprint')) {
    successes.push('index.html correctly preserves its exclusive blueprint preloader');
} else {
    errors.push('index.html preloader element missing or altered');
}

// 5. Check Material Reveal inclusion on internal pages
['services.html', 'metal-fabrication.html', 'interiors.html', 'start-your-project.html'].forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    if (content.includes('atg-transitions.css') && content.includes('atg-transitions.js')) {
        successes.push(`${f} correctly integrates Material Reveal preloader (CSS & JS)`);
    } else {
        errors.push(`${f} missing Material Reveal preloader integration`);
    }
});

// 6. Check navbar structure in services.html, metal-fabrication.html, interiors.html
['services.html', 'metal-fabrication.html', 'interiors.html'].forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    if (content.includes('navbar-wrapper') && content.includes('has-dropdown') && content.includes('mobile-menu-overlay')) {
        successes.push(`${f} has complete standard navbar & mobile overlay`);
    } else {
        errors.push(`${f} has incomplete navbar`);
    }
    if (content.includes('site-footer') && content.includes('ATG METAL WORKS')) {
        successes.push(`${f} has complete standard footer`);
    } else {
        errors.push(`${f} has incomplete footer`);
    }
});

// 7. Check Start Your Project has Division Selector
const sypHtml = fs.readFileSync('start-your-project.html', 'utf8');
if (sypHtml.includes('id="divisionPickerSection"') && sypHtml.includes('choiceDivMetal') && sypHtml.includes('choiceDivInteriors')) {
    successes.push('start-your-project.html contains Division Selector (Metal Fabrication & Interiors)');
} else {
    errors.push('start-your-project.html missing Division Selector markup');
}

console.log('\n--- VERIFICATION SUMMARY ---');
console.log(`Successes: ${successes.length}`);
console.log(`Errors: ${errors.length}`);
if (errors.length > 0) {
    console.error('Errors found:');
    errors.forEach(e => console.error('  - ' + e));
    process.exit(1);
} else {
    console.log('ALL VERIFICATION CHECKS PASSED PERFECTLY!');
}
