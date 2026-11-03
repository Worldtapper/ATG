const fs = require('fs');

let js = fs.readFileSync('JS/catalogue-ui.js', 'utf8');

// 1. Card price formatting
const oldCardPrice = `        // Price formatting
        let priceHtml = '';
        if (design.priceType === 'quote') {
            priceHtml = \`<span class="card-price is-quote">Request a Quote</span>\`;
        } else if (design.priceLabel) {
            priceHtml = \`<span class="card-price">\${escapeHtml(design.priceLabel)}</span>\`;
        } else if (design.price) {
            priceHtml = \`<span class="card-price">₦\${Number(design.price).toLocaleString('en-NG')}</span>\`;
        } else {
            priceHtml = \`<span class="card-price is-quote">Request a Quote</span>\`;
        }`;

const newCardPrice = `        // Price formatting
        let priceHtml = '';
        if (design.priceEstimate) {
            priceHtml = \`<span class="card-price">\${escapeHtml(design.priceEstimate)}</span>\`;
        } else if (design.priceType === 'quote') {
            priceHtml = \`<span class="card-price is-quote">Request a Quote</span>\`;
        } else if (design.priceLabel) {
            priceHtml = \`<span class="card-price">\${escapeHtml(design.priceLabel)}</span>\`;
        } else if (design.price) {
            priceHtml = \`<span class="card-price">₦\${Number(design.price).toLocaleString('en-NG')}</span>\`;
        } else {
            priceHtml = \`<span class="card-price is-quote">Request a Quote</span>\`;
        }`;

// 2. Modal price badge formatting
const oldModalPrice = `        // Price & Estimate Assumptions
        if (modalPriceBadge) {
            if (design.priceType === 'quote') {
                modalPriceBadge.textContent = 'Request a Quote';
                modalPriceBadge.classList.add('is-quote');
            } else if (design.priceLabel) {
                modalPriceBadge.textContent = design.priceLabel;
                modalPriceBadge.classList.remove('is-quote');
            } else if (design.price) {
                modalPriceBadge.textContent = \`₦\${Number(design.price).toLocaleString('en-NG')}\`;
                modalPriceBadge.classList.remove('is-quote');
            } else {
                modalPriceBadge.textContent = 'Request a Quote';
                modalPriceBadge.classList.add('is-quote');
            }
        }`;

const newModalPrice = `        // Price & Estimate Assumptions
        if (modalPriceBadge) {
            if (design.priceEstimate) {
                modalPriceBadge.textContent = design.priceEstimate;
                modalPriceBadge.classList.remove('is-quote');
            } else if (design.priceType === 'quote') {
                modalPriceBadge.textContent = 'Request a Quote';
                modalPriceBadge.classList.add('is-quote');
            } else if (design.priceLabel) {
                modalPriceBadge.textContent = design.priceLabel;
                modalPriceBadge.classList.remove('is-quote');
            } else if (design.price) {
                modalPriceBadge.textContent = \`₦\${Number(design.price).toLocaleString('en-NG')}\`;
                modalPriceBadge.classList.remove('is-quote');
            } else {
                modalPriceBadge.textContent = 'Request a Quote';
                modalPriceBadge.classList.add('is-quote');
            }
        }`;

// Normalize line endings for replacement
const normalize = s => s.replace(/\r\n/g, '\n');

let normJs = normalize(js);
const normOldCardPrice = normalize(oldCardPrice);
const normNewCardPrice = normalize(newCardPrice);
const normOldModalPrice = normalize(oldModalPrice);
const normNewModalPrice = normalize(newModalPrice);

if (normJs.includes(normOldCardPrice)) {
    normJs = normJs.replace(normOldCardPrice, normNewCardPrice);
    console.log('Replaced card price in normJs');
} else {
    console.error('Could not find normOldCardPrice');
}

if (normJs.includes(normOldModalPrice)) {
    normJs = normJs.replace(normOldModalPrice, normNewModalPrice);
    console.log('Replaced modal price in normJs');
} else {
    console.error('Could not find normOldModalPrice');
}

// Convert back to CRLF
fs.writeFileSync('JS/catalogue-ui.js', normJs.replace(/\n/g, '\r\n'), 'utf8');
console.log('SUCCESS: Updated JS/catalogue-ui.js');

