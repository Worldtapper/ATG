const fs = require('fs');
const path = require('path');

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

pages.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error(`File ${file} does not exist!`);
    return;
  }

  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Add CSS before </head> if not already present
  if (!content.includes('CSS/atg-transitions.css') && !content.includes('atg-transitions.css')) {
    const headCloseIndex = content.lastIndexOf('</head>');
    if (headCloseIndex !== -1) {
      const insertion = '    <link rel="stylesheet" href="CSS/atg-transitions.css">\n';
      content = content.slice(0, headCloseIndex) + insertion + content.slice(headCloseIndex);
      changed = true;
      console.log(`Added CSS/atg-transitions.css to ${file}`);
    } else {
      console.warn(`No </head> tag found in ${file}`);
    }
  } else {
    console.log(`CSS already present in ${file}`);
  }

  // 2. Add JS before </body> if not already present
  if (!content.includes('JS/atg-transitions.js') && !content.includes('atg-transitions.js')) {
    const bodyCloseIndex = content.lastIndexOf('</body>');
    if (bodyCloseIndex !== -1) {
      const insertion = '    <script src="JS/atg-transitions.js"></script>\n';
      content = content.slice(0, bodyCloseIndex) + insertion + content.slice(bodyCloseIndex);
      changed = true;
      console.log(`Added JS/atg-transitions.js to ${file}`);
    } else {
      console.warn(`No </body> tag found in ${file}`);
    }
  } else {
    console.log(`JS already present in ${file}`);
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Successfully updated ${file}`);
  }
});

console.log('Injection complete.');

