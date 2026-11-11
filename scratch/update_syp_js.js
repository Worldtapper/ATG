const fs = require('fs');

let code = fs.readFileSync('JS/start-your-project.js', 'utf8');

// 1. Add division to state
if (!code.includes("division: 'metal'")) {
    code = code.replace(
        "handling: 'supply_delivery', // 'supply_delivery' | 'supply_installation' | 'custom_project'",
        "division: 'metal', // 'metal' | 'interiors'\r\n        handling: 'supply_delivery', // 'supply_delivery' | 'supply_installation' | 'custom_project'"
    );
}

// 2. Add DIVISION_CONFIG right before initHeroActions
const divisionConfigCode = `
    /* ==========================================================================
       DIVISION CONFIGURATION & CAPABILITY DICTIONARY
       ========================================================================== */
    const DIVISION_CONFIG = {
        metal: {
            name: 'Metal Fabrication',
            categories: [
                'Gates',
                'Doors',
                'Staircases',
                'Railings & Balustrades',
                'Metal Fabrication',
                'Structural Steel',
                'Aluminium & Glass'
            ],
            pathBCategories: [
                { value: 'Gates & Fencing', label: 'Architectural Gates & Perimeter Fencing' },
                { value: 'Railings & Staircases', label: 'Precision Railings & Monolithic Staircases' },
                { value: 'Metal Fabrication', label: 'Bespoke Architectural Metal Fabrication' },
                { value: 'Structural Steel', label: 'Heavy Structural Steel & Pergolas' },
                { value: 'Aluminium & Glass', label: 'Aluminium Systems & Architectural Glazing' },
                { value: 'Other Metalwork', label: 'Other Bespoke Metal Solution' }
            ],
            step1Categories: [
                { value: 'Gates & Fencing', label: 'Gates & Perimeter Fencing' },
                { value: 'Railings & Staircases', label: 'Railings & Monolithic Staircases' },
                { value: 'Metal Fabrication', label: 'Bespoke Architectural Metal Fabrication' },
                { value: 'Structural Steel', label: 'Heavy Structural Steel & Pergolas' },
                { value: 'Aluminium & Glass', label: 'Aluminium Systems & Architectural Glazing' },
                { value: 'Multiple Metal Works', label: 'Full Multi-Discipline Metal Package' }
            ],
            materials: [
                { value: 'Structural Mild Steel', label: 'Mild Steel / Heavy Wrought Iron', checked: true },
                { value: 'Architectural Stainless Steel (304/316)', label: 'Stainless Steel (304 / Marine 316)', checked: false },
                { value: 'Solid Brass / Bronze Accents', label: 'Solid Brass & Patinated Bronze', checked: false },
                { value: 'Heavy Gauge Galvanised Steel', label: 'Galvanised Box Sections (Anti-Corrosion)', checked: false },
                { value: 'Aluminium Profiles & Glazing', label: 'Aluminium Extrusions & Safety Glass', checked: false },
                { value: 'Not sure yet — Need ATG Recommendation', label: 'Not sure yet — Guide me', checked: false }
            ]
        },
        interiors: {
            name: 'Interiors',
            categories: [
                'Tables',
                'Chairs',
                'Kitchen Cabinets',
                'Wardrobes',
                'Shelves & Storage',
                'Boutique Garment Racks & Retail Displays',
                'Custom Furniture',
                'Interior Solutions'
            ],
            pathBCategories: [
                { value: 'Tables & Seating', label: 'Executive Tables & Sculptural Chairs' },
                { value: 'Kitchen Cabinets & Islands', label: 'Luxury Kitchen Cabinetry & Islands' },
                { value: 'Wardrobes & Dressing Rooms', label: 'Bespoke Walk-in Dressing Suites' },
                { value: 'Shelving & Retail Displays', label: 'Architectural Shelving & Vitrines' },
                { value: 'Custom Furniture', label: 'Bespoke Architectural Furniture' },
                { value: 'Turnkey Commercial Interiors', label: 'Corporate & Commercial Fit-outs' },
                { value: 'Other Interiors', label: 'Other Bespoke Interior Solution' }
            ],
            step1Categories: [
                { value: 'Tables & Seating', label: 'Executive Tables & Sculptural Seating' },
                { value: 'Kitchen Cabinets', label: 'Luxury Kitchen Cabinets & Islands' },
                { value: 'Wardrobes & Dressing Rooms', label: 'Bespoke Dressing Rooms & Wardrobes' },
                { value: 'Shelving & Storage', label: 'Architectural Shelving & Displays' },
                { value: 'Custom Furniture', label: 'Bespoke Architectural Furniture' },
                { value: 'Commercial Fit-outs', label: 'Corporate & Commercial Interiors' },
                { value: 'Multiple Interior Works', label: 'Full Multi-Discipline Interior Package' }
            ],
            materials: [
                { value: 'Seasoned Hardwoods (Iroko / Teak / Walnut)', label: 'Seasoned Hardwoods (Iroko / Teak / Walnut)', checked: true },
                { value: 'Natural Marble & Travertine Stone', label: 'Natural Marble & Honed Travertine', checked: false },
                { value: 'Premium Bouclé, Velvet & Top-Grain Leather', label: 'Tactile Bouclé, Velvet & Leather', checked: false },
                { value: 'Fluted Acoustic Timber Slats', label: 'Acoustic Fluted Timber Panels', checked: false },
                { value: 'Architectural Brass & Cold-Rolled Metal', label: 'Brushed Brass & Metal Accents', checked: false },
                { value: 'Not sure yet — Need ATG Recommendation', label: 'Not sure yet — Guide me', checked: false }
            ]
        }
    };

    /* Helper: Update category chips dynamically */
    function updateCategoryChipsForDivision(division) {
        const chipsContainer = document.getElementById('sypCategoryChips');
        if (!chipsContainer) return;

        const config = DIVISION_CONFIG[division] || DIVISION_CONFIG.metal;
        let html = '<button type=\"button\" class=\"syp-cat-chip is-active\" data-cat=\"all\">All ' + config.name + ' Disciplines</button>';
        config.categories.forEach(cat => {
            html += '<button type=\"button\" class=\"syp-cat-chip\" data-cat=\"' + escapeHtml(cat) + '\">' + escapeHtml(cat) + '</button>';
        });
        chipsContainer.innerHTML = html;

        chipsContainer.querySelectorAll('.syp-cat-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                chipsContainer.querySelectorAll('.syp-cat-chip').forEach(c => c.classList.remove('is-active'));
                chip.classList.add('is-active');
                state.activeCategoryFilter = chip.getAttribute('data-cat') || 'all';
                if (typeof window.ATG_RE_RENDER_DESIGNS === 'function') {
                    window.ATG_RE_RENDER_DESIGNS();
                }
            });
        });
    }

    /* Helper: Update select dropdowns for active division */
    function updateDropdownsForDivision(division) {
        const config = DIVISION_CONFIG[division] || DIVISION_CONFIG.metal;
        const customCat = document.getElementById('customProjectCategory');
        const projCat = document.getElementById('projectCategory');

        if (customCat) {
            let html = '<option value=\"\" disabled selected>Select category...</option>';
            config.pathBCategories.forEach(item => {
                html += '<option value=\"' + escapeHtml(item.value) + '\">' + escapeHtml(item.label) + '</option>';
            });
            customCat.innerHTML = html;
        }

        if (projCat) {
            let html = '<option value=\"\" disabled selected>Select category...</option>';
            config.step1Categories.forEach(item => {
                html += '<option value=\"' + escapeHtml(item.value) + '\">' + escapeHtml(item.label) + '</option>';
            });
            projCat.innerHTML = html;
        }
    }

    /* Helper: Update Step 2 materials checkboxes for active division */
    function updateMaterialsForDivision(division) {
        const container = document.getElementById('materialChips');
        if (!container) return;

        const config = DIVISION_CONFIG[division] || DIVISION_CONFIG.metal;
        let html = '';
        config.materials.forEach(mat => {
            html += '<label class=\"syp-chip-check' + (mat.checked ? ' is-checked' : '') + '\">' +
                    '<input type=\"checkbox\" name=\"materials\" value=\"' + escapeHtml(mat.value) + '\"' + (mat.checked ? ' checked' : '') + '>' +
                    '<span>' + escapeHtml(mat.label) + '</span>' +
                    '</label>';
        });
        container.innerHTML = html;

        container.querySelectorAll('.syp-chip-check').forEach(chip => {
            const input = chip.querySelector('input');
            if (input) {
                input.addEventListener('change', () => {
                    chip.classList.toggle('is-checked', input.checked);
                    updateReviewScreen();
                });
            }
        });
    }

    /* Helper: Division Selection Controller */
    function initDivisionSelection() {
        const choiceMetal = document.getElementById('choiceDivMetal');
        const choiceInteriors = document.getElementById('choiceDivInteriors');

        function setDivision(division) {
            state.division = division;
            if (choiceMetal) {
                const isMetal = division === 'metal';
                choiceMetal.classList.toggle('is-active', isMetal);
                choiceMetal.setAttribute('aria-checked', isMetal ? 'true' : 'false');
            }
            if (choiceInteriors) {
                const isInteriors = division === 'interiors';
                choiceInteriors.classList.toggle('is-active', isInteriors);
                choiceInteriors.setAttribute('aria-checked', isInteriors ? 'true' : 'false');
            }

            updateCategoryChipsForDivision(division);
            updateDropdownsForDivision(division);
            updateMaterialsForDivision(division);

            state.activeCategoryFilter = 'all';
            if (typeof window.ATG_RE_RENDER_DESIGNS === 'function') {
                window.ATG_RE_RENDER_DESIGNS();
            }
            updateReviewScreen();
        }

        if (choiceMetal) {
            choiceMetal.addEventListener('click', () => setDivision('metal'));
            choiceMetal.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    setDivision('metal');
                }
            });
        }

        if (choiceInteriors) {
            choiceInteriors.addEventListener('click', () => setDivision('interiors'));
            choiceInteriors.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    setDivision('interiors');
                }
            });
        }

        window.ATG_SET_DIVISION = setDivision;
    }
`;

if (!code.includes('DIVISION_CONFIG')) {
    code = code.replace('    /* ==========================================================================\r\n       1. HERO ACTIONS', divisionConfigCode + '\r\n    /* ==========================================================================\r\n       1. HERO ACTIONS');
}

// 3. Add initDivisionSelection() to DOMContentLoaded
if (!code.includes('initDivisionSelection();')) {
    code = code.replace(
        'initHandlingSelection();',
        'initDivisionSelection();\r\n        initHandlingSelection();'
    );
}

// 4. In initCatalogueAndFavourites, register window.ATG_RE_RENDER_DESIGNS = renderDesignsGrid
if (!code.includes('window.ATG_RE_RENDER_DESIGNS = renderDesignsGrid;')) {
    code = code.replace(
        'renderDesignsGrid();',
        'window.ATG_RE_RENDER_DESIGNS = renderDesignsGrid;\r\n        renderDesignsGrid();'
    );
}

// 5. In renderDesignsGrid(), filter pool by division
if (!code.includes('currentDivCats.includes(d.category)')) {
    code = code.replace(
        'let pool = allDesigns;',
        `let pool = allDesigns;
            const currentDivConfig = DIVISION_CONFIG[state.division] || DIVISION_CONFIG.metal;
            const currentDivCats = currentDivConfig.categories;
            pool = pool.filter(d => currentDivCats.includes(d.category));
            if (catTotalCount) catTotalCount.textContent = pool.length;`
    );
}

// 6. In parseUrlParameters(), handle division and cat
const urlParamsHook = `
        const divisionParam = (urlParams.get('division') || urlParams.get('dept') || '').toLowerCase();
        const catParam = urlParams.get('cat') || urlParams.get('category');

        if (divisionParam === 'interiors' || divisionParam === 'interior') {
            if (typeof window.ATG_SET_DIVISION === 'function') window.ATG_SET_DIVISION('interiors');
        } else if (divisionParam === 'metal' || divisionParam === 'metal-fabrication') {
            if (typeof window.ATG_SET_DIVISION === 'function') window.ATG_SET_DIVISION('metal');
        } else if (catParam) {
            // Check if catParam belongs to interiors
            const isInteriorCat = DIVISION_CONFIG.interiors.categories.some(c => c.toLowerCase() === catParam.toLowerCase());
            if (isInteriorCat && typeof window.ATG_SET_DIVISION === 'function') {
                window.ATG_SET_DIVISION('interiors');
            } else if (typeof window.ATG_SET_DIVISION === 'function') {
                window.ATG_SET_DIVISION('metal');
            }
        }

        if (catParam) {
            state.activeCategoryFilter = catParam;
            const targetChip = document.querySelector(\`.syp-cat-chip[data-cat="\${catParam}"]\`);
            if (targetChip) {
                document.querySelectorAll('.syp-cat-chip').forEach(c => c.classList.remove('is-active'));
                targetChip.classList.add('is-active');
            }
            if (typeof window.ATG_RE_RENDER_DESIGNS === 'function') window.ATG_RE_RENDER_DESIGNS();
        }
`;

if (!code.includes('divisionParam')) {
    code = code.replace(
        'const galleryProjectId = urlParams.get(\'project\') || urlParams.get(\'gallery\');',
        'const galleryProjectId = urlParams.get(\'project\') || urlParams.get(\'gallery\');' + urlParamsHook
    );
}

fs.writeFileSync('JS/start-your-project.js', code, 'utf8');
console.log('Successfully updated JS/start-your-project.js');

