const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// Remove CSS line
content = content.replace(/[ \t]*<link[^>]+href=["']CSS\/atg-transitions\.css["'][^>]*>\r?\n?/, '');

// Remove JS line
content = content.replace(/[ \t]*<script[^>]+src=["']JS\/atg-transitions\.js["'][^>]*><\/script>\r?\n?/, '');

fs.writeFileSync('index.html', content, 'utf8');
console.log('Removed transition preloader references from index.html successfully.');

