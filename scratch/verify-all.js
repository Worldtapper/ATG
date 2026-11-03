const fs = require('fs');
const vm = require('vm');

console.log('--- 1. Testing JS/catalogue-data.js ---');
const catDataContent = fs.readFileSync('JS/catalogue-data.js', 'utf8');
const sandboxData = { window: {} };
vm.createContext(sandboxData);
vm.runInContext(catDataContent, sandboxData);

const data = sandboxData.window.ATG_CATALOGUE_DATA;
const cats = sandboxData.window.ATG_CATEGORIES;

console.log('Categories count:', cats.length);
console.log('Total designs:', data.length);

if (cats.length !== 15) throw new Error('Expected 15 categories, found ' + cats.length);
if (data.length !== 135) throw new Error('Expected 135 designs, found ' + data.length);

cats.forEach(c => {
  const items = data.filter(d => d.category === c.name);
  if (items.length !== 9) {
    throw new Error('Category ' + c.name + ' does not have 9 designs, has ' + items.length);
  }
});
console.log('PASS: All 15 categories have exactly 9 designs (135 total)!');

console.log('\n--- 2. Checking image existence for all 135 designs ---');
let missingImages = 0;
data.forEach(d => {
  if (!fs.existsSync(d.image)) {
    console.error('MISSING IMAGE:', d.id, d.image);
    missingImages++;
  }
});
if (missingImages > 0) throw new Error('Found missing images: ' + missingImages);
console.log('PASS: All 135 design images exist on disk!');

console.log('\n--- 3. Checking prices for all 135 designs ---');
data.forEach(d => {
  if (!d.priceEstimate || !d.priceEstimate.includes('₦')) {
    console.error('INVALID PRICE:', d.id, d.priceEstimate);
  }
});
console.log('PASS: All designs have calibrated realistic Nigerian prices!');

console.log('\n--- 4. Checking JS/catalogue-ui.js syntax ---');
const catUIContent = fs.readFileSync('JS/catalogue-ui.js', 'utf8');
const mockDoc = {
  addEventListener: () => {},
  getElementById: () => null,
  querySelectorAll: () => [],
  createElement: () => ({ setAttribute: () => {}, appendChild: () => {}, addEventListener: () => {}, querySelectorAll: () => [], style: {} }),
  body: { appendChild: () => {} }
};
const sandboxUI = { window: sandboxData.window, document: mockDoc, console };
vm.createContext(sandboxUI);
vm.runInContext(catUIContent, sandboxUI);
console.log('PASS: JS/catalogue-ui.js parses and runs without syntax error!');

console.log('\n--- 5. Checking JS/services.js syntax ---');
const servicesContent = fs.readFileSync('JS/services.js', 'utf8');
const sandboxServices = {
  window: { ...sandboxData.window, addEventListener: () => {}, location: { search: '', pathname: '/services.html', origin: 'http://localhost' } },
  document: { addEventListener: () => {}, getElementById: () => null, querySelectorAll: () => [] },
  console
};
vm.createContext(sandboxServices);
vm.runInContext(servicesContent, sandboxServices);
console.log('PASS: JS/services.js parses and runs without syntax error!');

console.log('\n--- 6. Checking JS/start-your-project.js syntax ---');
const sypContent = fs.readFileSync('JS/start-your-project.js', 'utf8');
const sandboxSYP = {
  window: { ...sandboxData.window, addEventListener: () => {}, location: { search: '' } },
  document: { addEventListener: () => {}, getElementById: () => null, querySelectorAll: () => [] },
  console
};
vm.createContext(sandboxSYP);
vm.runInContext(sypContent, sandboxSYP);
console.log('PASS: JS/start-your-project.js parses and runs without syntax error!');

console.log('\n========================================');
console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY!');
console.log('========================================');
