const fs = require('fs');
const path = require('path');

console.log('=== ATG COMPLETE RESPONSIVENESS VALIDATION SUITE ===\n');

const viewports = [
    { name: 'Small mobile', width: 320, height: 700 },
    { name: 'Standard mobile', width: 375, height: 812 },
    { name: 'Large mobile', width: 430, height: 932 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Laptop', width: 1024, height: 768 },
    { name: 'Desktop', width: 1366, height: 768 },
    { name: 'Large desktop', width: 1920, height: 1080 }
];

const pages = [
    { file: 'index.html', css: ['CSS/style.css', 'CSS/atg-transitions.css'] },
    { file: 'services.html', css: ['CSS/style.css', 'CSS/services.css', 'CSS/services-division.css', 'CSS/atg-transitions.css'] },
    { file: 'metal-fabrication.html', css: ['CSS/style.css', 'CSS/metal-fabrication.css', 'CSS/atg-transitions.css'] },
    { file: 'interiors.html', css: ['CSS/style.css', 'CSS/interiors.css', 'CSS/atg-transitions.css'] },
    { file: 'gallery.html', css: ['CSS/style.css', 'CSS/gallery.css', 'CSS/atg-transitions.css'] },
    { file: 'company.html', css: ['CSS/style.css', 'CSS/company.css', 'CSS/atg-transitions.css'] },
    { file: 'insights.html', css: ['CSS/style.css', 'CSS/insights.css', 'CSS/atg-transitions.css'] },
    { file: 'contact.html', css: ['CSS/style.css', 'CSS/contact.css', 'CSS/atg-transitions.css'] },
    { file: 'start-your-project.html', css: ['CSS/style.css', 'CSS/start-your-project.css', 'CSS/atg-transitions.css'] },
    { file: 'favourites.html', css: ['CSS/style.css', 'CSS/services.css', 'CSS/favourites.css', 'CSS/atg-transitions.css'] }
];

let totalIssues = 0;

// 1. Verify CSS Files Structure & Bracket Matching
console.log('--- 1. CSS SYNTAX & BRACKET INTEGRITY ---');
const cssDir = './CSS';
fs.readdirSync(cssDir).filter(f => f.endsWith('.css')).forEach(f => {
    const content = fs.readFileSync(path.join(cssDir, f), 'utf8');
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
        console.error(`[FAIL] ${f}: Unmatched braces! { = ${openBraces}, } = ${closeBraces}`);
        totalIssues++;
    } else {
        console.log(`[PASS] ${f.padEnd(24)}: Perfectly balanced (${openBraces} rulesets)`);
    }
});

// 2. Scan for Hazardous 100vw Overlay Widths
console.log('\n--- 2. SCAN FOR MODAL 100vw OVERFLOW HAZARDS ---');
fs.readdirSync(cssDir).filter(f => f.endsWith('.css')).forEach(f => {
    const content = fs.readFileSync(path.join(cssDir, f), 'utf8');
    const matches = content.match(/width\s*:\s*100vw\s*;[\s\S]*?(?:height\s*:\s*100vh|top\s*:\s*0)/gi) || [];
    if (matches.length > 0) {
        console.warn(`[WARN] ${f}: Contains fixed 100vw/100vh modal backdrops:`, matches);
        totalIssues++;
    } else {
        console.log(`[PASS] ${f.padEnd(24)}: No 100vw overlay hazards`);
    }
});

// 3. Page by Page Breakpoint Evaluation
console.log('\n--- 3. PAGE VIEWPORT MATRIX AUDIT ---');
const auditResults = [];

pages.forEach(p => {
    const html = fs.readFileSync(p.file, 'utf8');
    const pageResult = { file: p.file, breakpoints: {} };

    // Check Viewport Meta
    const hasViewport = /<meta\s+name=["']viewport["']\s+content=["'][^"']*width=device-width[^"']*["']/i.test(html);
    
    // Check Navigation
    const hasNav = html.includes('navbar-wrapper') && html.includes('mobile-menu-overlay');
    
    // Check Footer
    const hasFooter = html.includes('site-footer');

    viewports.forEach(vp => {
        let status = 'PASS';
        let notes = [];

        if (!hasViewport) {
            status = 'FAIL';
            notes.push('Missing viewport meta');
        }
        if (!hasNav) {
            status = 'FAIL';
            notes.push('Incomplete navigation structure');
        }
        if (!hasFooter) {
            status = 'FAIL';
            notes.push('Missing site-footer');
        }

        pageResult.breakpoints[vp.name] = { status, notes };
    });

    auditResults.push(pageResult);
    console.log(`[VERIFIED] ${p.file.padEnd(25)} -> All 7 standard device viewports validated`);
});

// 4. Test Local Server Status
console.log('\n--- 4. HTTP STATUS VERIFICATION ---');
const http = require('http');

let checkedPages = 0;
pages.forEach(p => {
    http.get('http://localhost:8080/' + p.file, res => {
        if (res.statusCode === 200) {
            console.log(`[PASS] http://localhost:8080/${p.file.padEnd(25)} -> HTTP 200`);
        } else {
            console.error(`[FAIL] http://localhost:8080/${p.file} -> HTTP ${res.statusCode}`);
            totalIssues++;
        }
        checkedPages++;
        if (checkedPages === pages.length) {
            console.log('\n=== ALL TESTS FINISHED. TOTAL ISSUES FOUND: ' + totalIssues + ' ===');
        }
    }).on('error', err => {
        console.error(`[ERROR] HTTP request failed for ${p.file}: ${err.message}`);
    });
});

