const http = require('http');
const fs = require('fs');

const pages = [
    'index.html',
    'services.html',
    'metal-fabrication.html',
    'interiors.html',
    'gallery.html',
    'company.html',
    'insights.html',
    'contact.html',
    'start-your-project.html',
    'favourites.html'
];

function fetchUrl(urlPath) {
    return new Promise((resolve) => {
        const req = http.get('http://localhost:8080/' + urlPath, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({ status: res.statusCode, data });
            });
        });
        req.on('error', (err) => {
            resolve({ status: 500, error: err.message });
        });
    });
}

async function run() {
    console.log('=== VERIFYING ALL PAGES ON LOCAL HTTP SERVER ===\n');
    let hasFailures = false;

    for (const page of pages) {
        const res = await fetchUrl(page);
        if (res.status === 200) {
            console.log(`[PASS] ${page.padEnd(25)} -> HTTP 200 (Length: ${res.data.length} bytes)`);

            // Extract all linked assets: CSS, JS, images
            const cssLinks = (res.data.match(/href=["'](CSS\/[^"']+)["']/g) || []).map(s => s.replace(/href=["']|["']/g, ''));
            const jsLinks = (res.data.match(/src=["'](JS\/[^"']+)["']/g) || []).map(s => s.replace(/src=["']|["']/g, ''));
            const imgLinks = (res.data.match(/src=["'](images\/[^"']+)["']/g) || []).map(s => s.replace(/src=["']|["']/g, ''));

            for (const asset of [...cssLinks, ...jsLinks]) {
                const assetRes = await fetchUrl(asset);
                if (assetRes.status !== 200) {
                    console.error(`   [FAIL ASSET] ${page} links ${asset} -> HTTP ${assetRes.status}`);
                    hasFailures = true;
                }
            }
        } else {
            console.error(`[FAIL] ${page.padEnd(25)} -> HTTP ${res.status}`);
            hasFailures = true;
        }
    }

    if (!hasFailures) {
        console.log('\n[SUCCESS] All 10 HTML pages and all their CSS/JS dependencies loaded with HTTP 200!');
    }
}

run();

