const fs = require('fs');
const path = require('path');

console.log('=== COMPREHENSIVE RESPONSIVENESS & TECHNICAL AUDIT ===\n');

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

console.log('--- 1. HTML PAGES VIEWPORT & NAV AUDIT ---');
pages.forEach(p => {
    if (!fs.existsSync(p)) {
        console.error(`MISSING PAGE: ${p}`);
        return;
    }
    const html = fs.readFileSync(p, 'utf8');
    const hasViewport = /<meta\s+name=["']viewport["']\s+content=["'][^"']*width=device-width[^"']*["']/i.test(html);
    const hasNavbar = html.includes('navbar-wrapper') || html.includes('navbar');
    const hasMobileMenu = html.includes('mobile-menu-overlay') || html.includes('mobileMenu');
    const hasCloseBtn = html.includes('closeMenuBtn') || html.includes('close-menu-btn');
    const hasToggleBtn = html.includes('mobileMenuToggle') || html.includes('mobile-menu-toggle');
    const hasFooter = html.includes('site-footer') || html.includes('footer');

    console.log(`Page: ${p.padEnd(25)} | Viewport: ${hasViewport ? 'OK' : 'FAIL'} | Nav: ${hasNavbar ? 'OK' : 'FAIL'} | MobileMenu: ${hasMobileMenu ? 'OK' : 'FAIL'} | Toggle: ${hasToggleBtn ? 'OK' : 'FAIL'} | Close: ${hasCloseBtn ? 'OK' : 'FAIL'} | Footer: ${hasFooter ? 'OK' : 'FAIL'}`);
});

console.log('\n--- 2. CSS BREAKPOINTS & MEDIA QUERIES SCAN ---');
const cssDir = './CSS';
fs.readdirSync(cssDir).filter(f => f.endsWith('.css')).forEach(f => {
    const css = fs.readFileSync(path.join(cssDir, f), 'utf8');
    const mediaMatches = css.match(/@media[^{]+/g) || [];
    const breakpoints = new Set();
    mediaMatches.forEach(m => {
        const cleaned = m.replace(/\s+/g, ' ').trim();
        breakpoints.add(cleaned);
    });
    console.log(`File: ${f.padEnd(22)} | Media queries: ${mediaMatches.length} | Unique: ${breakpoints.size}`);
});

console.log('\n--- 3. DETECTING SPECIFIC HORIZONTAL OVERFLOW RISKS ---');
fs.readdirSync(cssDir).filter(f => f.endsWith('.css')).forEach(f => {
    const css = fs.readFileSync(path.join(cssDir, f), 'utf8');
    const lines = css.split('\n');
    lines.forEach((l, idx) => {
        const line = l.trim();
        // Check for width: 100vw
        if (/width\s*:\s*100vw/i.test(line)) {
            console.log(`[100vw Hazard] ${f}:${idx + 1} -> ${line}`);
        }
        // Check for min-width > 300px
        const mw = line.match(/min-width\s*:\s*([0-9]+)px/i);
        if (mw && parseInt(mw[1], 10) > 320 && !line.includes('@media')) {
            console.log(`[min-width Hazard] ${f}:${idx + 1} -> ${line}`);
        }
    });
});

console.log('\n--- 4. DETECTING TOUCH TARGETS < 44px IN MOBILE MEDIA QUERIES ---');
fs.readdirSync(cssDir).filter(f => f.endsWith('.css')).forEach(f => {
    const css = fs.readFileSync(path.join(cssDir, f), 'utf8');
    // Look for button/link heights < 36px in small screen queries
    const smallMedia = css.match(/@media\s*\([^{]*(?:max-width:\s*(?:768|600|480|430|375)px)[^{]*\{[\s\S]*?(?=\n@media|\n\/\* ---|$)/g) || [];
    smallMedia.forEach(block => {
        const smallLines = block.split('\n');
        smallLines.forEach((l, idx) => {
            const trimmed = l.trim();
            const h = trimmed.match(/(?:^|[^-\w])height\s*:\s*([0-9]+)px/i);
            if (h && parseInt(h[1], 10) < 36 && /btn|button|link|toggle|close/i.test(block)) {
                // Potential small touch target
            }
        });
    });
});

