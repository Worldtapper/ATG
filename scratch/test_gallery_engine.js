const fs = require('fs');

console.log('=== RUNNING SIMULATED ENGINE TEST FOR JS/gallery.js ===');

// Mock browser globals
global.window = {
    location: {
        href: 'http://localhost/gallery.html',
        search: ''
    },
    history: {
        replaceState: function (state, title, url) {
            // console.log('URL state changed to:', url);
        }
    }
};

global.document = {
    readyState: 'complete',
    body: { style: { overflow: '' } },
    getElementById: function (id) {
        return {
            id: id,
            style: {},
            classList: {
                add: function () {},
                remove: function () {},
                toggle: function () {},
                contains: function () { return false; }
            },
            setAttribute: function () {},
            getAttribute: function () { return null; },
            addEventListener: function () {},
            querySelectorAll: function () { return []; },
            innerHTML: '',
            textContent: ''
        };
    },
    querySelectorAll: function (selector) {
        return [];
    },
    addEventListener: function () {}
};

global.URL = function(urlStr) {
    return {
        searchParams: {
            set: function () {},
            delete: function () {},
            get: function () { return null; }
        },
        toString: function () { return urlStr; }
    };
};

global.URLSearchParams = function() {
    return {
        get: function () { return null; }
    };
};

// Load data
eval(fs.readFileSync('JS/gallery-data.js', 'utf8'));

// Load gallery engine
eval(fs.readFileSync('JS/gallery.js', 'utf8'));

console.log('[PASS] window.ATG_GALLERY initialized:', typeof window.ATG_GALLERY);
console.log('[PASS] setDivision type:', typeof window.ATG_GALLERY.setDivision);
console.log('[PASS] openModal type:', typeof window.ATG_GALLERY.openModal);
console.log('[PASS] closeModal type:', typeof window.ATG_GALLERY.closeModal);

// Test calling setDivision
window.ATG_GALLERY.setDivision('Metal Fabrication');
console.log('[PASS] setDivision("Metal Fabrication") executed without errors.');

window.ATG_GALLERY.setDivision('Interiors');
console.log('[PASS] setDivision("Interiors") executed without errors.');

window.ATG_GALLERY.setDivision('all');
console.log('[PASS] setDivision("all") executed without errors.');

console.log('=== ENGINE TEST COMPLETE ===');
