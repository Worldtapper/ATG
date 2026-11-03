const fs = require('fs');

// 1. Update services.html directory counts
let html = fs.readFileSync('services.html', 'utf8');
html = html.replace(/<span class="dir-count" data-dir-cat="([^"]+)">\d+<\/span>/g, '<span class="dir-count" data-dir-cat="$1">9</span>');
fs.writeFileSync('services.html', html, 'utf8');
console.log('Updated services.html directory counts to 9');

// 2. Update JS/services.js initDirectoryLinks
let js = fs.readFileSync('JS/services.js', 'utf8');
const target = `    function initDirectoryLinks() {
        const dirLinks = document.querySelectorAll('.directory-link');
        dirLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                let rawCat = link.getAttribute('data-category');
                if (!rawCat) return;
                openCategoryMode(rawCat, true);
            });
        });
    }`;

const replacement = `    function initDirectoryLinks() {
        const dirLinks = document.querySelectorAll('.directory-link');
        dirLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                let rawCat = link.getAttribute('data-category');
                if (!rawCat) return;
                openCategoryMode(rawCat, true);
            });
        });

        // Sync directory badge counters with live catalogue data
        document.querySelectorAll('[data-dir-cat]').forEach(counter => {
            const catName = counter.getAttribute('data-dir-cat');
            if (catName) {
                const count = allDesigns.filter(d => d.category.toLowerCase() === catName.toLowerCase()).length;
                if (count > 0) counter.textContent = count;
            }
        });
    }`;

// Normalize line endings
const normJs = js.replace(/\r\n/g, '\n');
const normTarget = target.replace(/\r\n/g, '\n');
const normReplacement = replacement.replace(/\r\n/g, '\n');

if (normJs.includes(normTarget)) {
    const updatedNormJs = normJs.replace(normTarget, normReplacement);
    fs.writeFileSync('JS/services.js', updatedNormJs.replace(/\n/g, '\r\n'), 'utf8');
    console.log('Updated JS/services.js initDirectoryLinks');
} else {
    console.error('Could not find target in JS/services.js');
}

