const fs = require('fs');
const path = require('path');

const pages = [
    { file: 'index.html', css: ['CSS/style.css'] },
    { file: 'services.html', css: ['CSS/style.css', 'CSS/services.css', 'CSS/services-division.css'] },
    { file: 'metal-fabrication.html', css: ['CSS/style.css', 'CSS/metal-fabrication.css'] },
    { file: 'interiors.html', css: ['CSS/style.css', 'CSS/interiors.css'] },
    { file: 'gallery.html', css: ['CSS/style.css', 'CSS/gallery.css'] },
    { file: 'company.html', css: ['CSS/style.css', 'CSS/company.css'] },
    { file: 'insights.html', css: ['CSS/style.css', 'CSS/insights.css'] },
    { file: 'contact.html', css: ['CSS/style.css', 'CSS/contact.css'] },
    { file: 'start-your-project.html', css: ['CSS/style.css', 'CSS/start-your-project.css'] },
    { file: 'favourites.html', css: ['CSS/style.css', 'CSS/favourites.css'] }
];

console.log('=== PAGE-BY-PAGE DETAILED COMPONENT AUDIT ===\n');

pages.forEach(p => {
    console.log(`\n========================================`);
    console.log(`PAGE: ${p.file}`);
    console.log(`========================================`);
    const html = fs.readFileSync(p.file, 'utf8');

    // Check headings, sections, containers
    const sections = (html.match(/<section[^>]*>/g) || []).map(s => {
        const idMatch = s.match(/id=["']([^"']+)["']/);
        const classMatch = s.match(/class=["']([^"']+)["']/);
        return { id: idMatch ? idMatch[1] : '', class: classMatch ? classMatch[1] : '' };
    });
    console.log(`Sections count: ${sections.length}`);
    sections.forEach(s => console.log(`   - Section id="${s.id}" class="${s.class}"`));

    // Check if images have width/height or classes
    const imgMatches = html.match(/<img[^>]+>/g) || [];
    let imgWithoutAlt = 0;
    imgMatches.forEach(img => {
        if (!img.includes('alt=')) imgWithoutAlt++;
    });
    console.log(`Images: ${imgMatches.length} total, ${imgWithoutAlt} missing alt`);

    // Check form inputs
    const formMatches = html.match(/<form[^>]*>[\s\S]*?<\/form>/g) || [];
    console.log(`Forms count: ${formMatches.length}`);

    // Check modals
    const modalMatches = html.match(/class=["'][^"']*modal[^"']*["']/g) || [];
    console.log(`Modal references: ${modalMatches.length}`);
});

