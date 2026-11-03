const fs = require('fs');

const pages = [
  'index.html',
  'services.html',
  'start-your-project.html',
  'company.html',
  'contact.html',
  'favourites.html',
  'gallery.html',
  'insights.html'
];

pages.forEach(p => {
  if (fs.existsSync(p)) {
    const content = fs.readFileSync(p, 'utf8');
    const hasPreloader = content.includes('preloader');
    const hasTransitions = content.includes('atg-transitions');
    console.log(`${p}: preloader=${hasPreloader}, transitions=${hasTransitions}`);
  } else {
    console.log(`${p}: NOT FOUND`);
  }
});

