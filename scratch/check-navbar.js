const fs = require('fs');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const match = content.match(/<header[\s\S]*?<\/header>/i);
  if (match) {
    console.log(file, 'header length:', match[0].length);
  } else {
    console.log(file, 'NO HEADER TAG MATCH');
  }
});

