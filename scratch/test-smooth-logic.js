const fs = require('fs');

console.log('Testing smooth transition logic...');

// Test 1: Navigation to index.html from any page
function isIndexUrl(href) {
  if (!href) return false;
  try {
    const url = new URL(href, 'http://localhost:3000/services.html');
    const path = (url.pathname || '').toLowerCase().replace(/\\/g, '/');
    const file = path.split('/').pop();
    return file === '' || file === 'index.html' || file === 'index' || path === '/' || path.endsWith('/');
  } catch(e) {
    return false;
  }
}

console.log('index.html:', isIndexUrl('index.html')); // true
console.log('./index.html:', isIndexUrl('./index.html')); // true
console.log('/index.html:', isIndexUrl('/index.html')); // true
console.log('http://localhost:3000/index.html:', isIndexUrl('http://localhost:3000/index.html')); // true
console.log('services.html:', isIndexUrl('services.html')); // false
console.log('gallery.html:', isIndexUrl('gallery.html')); // false
console.log('start-your-project.html:', isIndexUrl('start-your-project.html')); // false
