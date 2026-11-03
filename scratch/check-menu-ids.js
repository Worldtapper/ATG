const fs = require('fs');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html') && !f.includes('preloader'));

htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  console.log(f, {
    hasToggle: content.includes('id="mobileMenuToggle"'),
    hasClose: content.includes('id="closeMenuBtn"'),
    hasMenu: content.includes('id="mobileMenu"')
  });
});

