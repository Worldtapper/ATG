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
  const content = fs.readFileSync(p, 'utf8');
  const headMatch = content.match(/<head>([\s\S]*?)<\/head>/i);
  const head = headMatch ? headMatch[1] : '';
  const cssMatches = [...head.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)].map(m => m[0]);
  const scriptMatches = [...content.matchAll(/<script[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi)].map(m => m[1]);

  console.log(`\n=== ${p} ===`);
  console.log('CSS:', cssMatches.map(m => {
    const href = m.match(/href=["']([^"']+)["']/i);
    return href ? href[1] : m;
  }));
  console.log('Scripts:', scriptMatches);
});

