const fs = require('fs');

let html = fs.readFileSync('start-your-project.html', 'utf8');

const regex = /<div class="syp-cat-chips-scroll" id="sypCategoryChips">[\s\S]*?<\/div>/;

const newChips = `<div class="syp-cat-chips-scroll" id="sypCategoryChips">
                        <button type="button" class="syp-cat-chip is-active" data-cat="all">All Disciplines</button>
                        <button type="button" class="syp-cat-chip" data-cat="Gates">Gates</button>
                        <button type="button" class="syp-cat-chip" data-cat="Doors">Doors</button>
                        <button type="button" class="syp-cat-chip" data-cat="Staircases">Staircases</button>
                        <button type="button" class="syp-cat-chip" data-cat="Railings &amp; Balustrades">Railings &amp; Balustrades</button>
                        <button type="button" class="syp-cat-chip" data-cat="Metal Fabrication">Metal Fabrication</button>
                        <button type="button" class="syp-cat-chip" data-cat="Structural Steel">Structural Steel</button>
                        <button type="button" class="syp-cat-chip" data-cat="Chairs">Chairs</button>
                        <button type="button" class="syp-cat-chip" data-cat="Tables">Tables</button>
                        <button type="button" class="syp-cat-chip" data-cat="Custom Furniture">Custom Furniture</button>
                        <button type="button" class="syp-cat-chip" data-cat="Shelves &amp; Storage">Shelves &amp; Storage</button>
                        <button type="button" class="syp-cat-chip" data-cat="Boutique Garment Racks &amp; Retail Displays">Boutique Racks &amp; Displays</button>
                        <button type="button" class="syp-cat-chip" data-cat="Kitchen Cabinets">Kitchen Cabinets</button>
                        <button type="button" class="syp-cat-chip" data-cat="Wardrobes">Wardrobes</button>
                        <button type="button" class="syp-cat-chip" data-cat="Aluminium &amp; Glass">Aluminium &amp; Glass</button>
                        <button type="button" class="syp-cat-chip" data-cat="Interior Solutions">Interior Solutions</button>
                    </div>`;

if (regex.test(html)) {
    html = html.replace(regex, newChips);
    fs.writeFileSync('start-your-project.html', html, 'utf8');
    console.log('SUCCESS: Updated sypCategoryChips in start-your-project.html');
} else {
    console.error('ERROR: Could not find sypCategoryChips regex match');
}

