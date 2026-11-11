const fs = require('fs');
const path = require('path');

const cssDir = './CSS';
const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));

console.log('=== DETAILED TYPOGRAPHY & OVERFLOW CHECK ACROSS ALL CSS FILES ===\n');

cssFiles.forEach(file => {
    const content = fs.readFileSync(path.join(cssDir, file), 'utf8');
    const lines = content.split('\n');
    const warnings = [];

    lines.forEach((l, i) => {
        const line = l.trim();
        // Check clamps with min >= 2.5rem
        const clampMatch = line.match(/clamp\(\s*([2-9](?:\.[0-9]+)?rem|[3-9][0-9]px)/i);
        if (clampMatch) {
            warnings.push(`Line ${i + 1}: clamp with large minimum (${clampMatch[1]}): "${line}"`);
        }

        // Check padding on containers > 40px without media query
        if (/padding\s*:\s*[0-9]+px\s+([5-9][0-9]|1[0-9]{2})px/i.test(line) && !line.includes('@media')) {
            warnings.push(`Line ${i + 1}: Large horizontal padding: "${line}"`);
        }

        // Check grid-template-columns with fixed px
        if (/grid-template-columns\s*:[^;]*(?:[3-9][0-9]{2}px)/i.test(line)) {
            warnings.push(`Line ${i + 1}: Fixed grid columns >= 300px: "${line}"`);
        }
    });

    if (warnings.length > 0) {
        console.log(`FILE: ${file}`);
        warnings.forEach(w => console.log(`   * ${w}`));
        console.log('');
    }
});

