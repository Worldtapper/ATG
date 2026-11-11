const fs = require('fs');
const path = require('path');

const cssDir = './CSS';
const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));

console.log('=== CSS RESPONSIVENESS AUDIT SCAN ===\n');

cssFiles.forEach(file => {
    const content = fs.readFileSync(path.join(cssDir, file), 'utf8');
    const lines = content.split('\n');
    const issues = [];

    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const trimmed = line.trim();

        // 1. 100vw hazards (causes horizontal scrollbar on Windows due to scrollbar width)
        if (/width\s*:\s*100vw/i.test(trimmed) && !/modal|overlay|backdrop|fixed|absolute/i.test(trimmed)) {
            issues.push(`Line ${lineNum}: 'width: 100vw' can cause horizontal scrollbar on desktop: "${trimmed}"`);
        }

        // 2. Fixed widths >= 320px outside of media queries
        const widthMatch = trimmed.match(/(?:^|[^-\w])width\s*:\s*([0-9]+)px/i);
        if (widthMatch) {
            const px = parseInt(widthMatch[1], 10);
            if (px >= 320 && !trimmed.includes('max-width') && !trimmed.includes('calc')) {
                // Check if inside a small mobile media query or not
                issues.push(`Line ${lineNum}: Fixed width ${px}px (potential overflow on mobile <= ${px}px): "${trimmed}"`);
            }
        }

        // 3. Fixed min-width >= 320px
        const minWidthMatch = trimmed.match(/min-width\s*:\s*([0-9]+)px/i);
        if (minWidthMatch) {
            const px = parseInt(minWidthMatch[1], 10);
            if (px >= 320) {
                issues.push(`Line ${lineNum}: Fixed min-width ${px}px (potential overflow on small phones < ${px}px): "${trimmed}"`);
            }
        }
    });

    console.log(`FILE: ${file} (${issues.length} potential fixed-size patterns detected)`);
    if (issues.length > 0) {
        issues.slice(0, 10).forEach(iss => console.log(`   - ${iss}`));
        if (issues.length > 10) console.log(`   ... and ${issues.length - 10} more`);
    }
    console.log('');
});

