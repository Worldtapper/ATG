const fs = require('fs');

console.log('Testing transition logic flow...');

// Mock localStorage / sessionStorage
const store = {};
const mockSessionStorage = {
  getItem: (k) => store[k] || null,
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; }
};

// Test 1: Navigation from company.html to services.html
console.log('\n--- Test 1: Navigation from company.html to services.html ---');
mockSessionStorage.setItem('atg_nav_active', '1');
mockSessionStorage.setItem('atg_nav_time', String(Date.now()));
console.log('SessionStorage set:', store);

// Services.html loads
console.log('services.html incoming check:');
const isIndex = false;
if (mockSessionStorage.getItem('atg_nav_active') === '1' && !isIndex) {
  mockSessionStorage.removeItem('atg_nav_active');
  mockSessionStorage.removeItem('atg_nav_time');
  console.log('Incoming reveal triggered on services.html! Storage cleared:', store);
} else {
  console.log('No reveal triggered');
}

// Test 2: Navigation to index.html
console.log('\n--- Test 2: Navigation to index.html ---');
mockSessionStorage.setItem('atg_nav_active', '1');
const isIndexTarget = true;
if (mockSessionStorage.getItem('atg_nav_active') === '1') {
  mockSessionStorage.removeItem('atg_nav_active');
  if (isIndexTarget) {
    console.log('Arrived at index.html: Suppressed Material Reveal! Blueprint preloader runs untouched. Storage cleared:', store);
  }
}

// Test 3: Direct reload of services.html
console.log('\n--- Test 3: Direct reload of services.html ---');
if (mockSessionStorage.getItem('atg_nav_active') === '1') {
  console.log('Unexpected transition on reload');
} else {
  console.log('Direct reload loads normally without transition overlay! Exactly as desired.');
}

