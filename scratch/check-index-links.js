const fs = require('fs');

const pages = [
  'services.html',
  'start-your-project.html',
  'company.html',
  'contact.html',
  'favourites.html',
  'gallery.html',
  'insights.html'
];

pages.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const matches = [...c.matchAll(/href=["']([^"']*)["']/gi)]
    .map(m => m[1])
    .filter(h => h.includes('index') || h === '/' || h === './');
  console.log(f, matches);
});
