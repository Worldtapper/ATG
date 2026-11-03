/**
 * ATG Metal Works & Interiors — Start Your Project Controller
 * Vanilla JavaScript Engine for Interactive Project Initiation
 */

(function () {
    'use strict';

    // Application State
    const state = {
        handling: 'supply_delivery', // 'supply_delivery' | 'supply_installation' | 'custom_project'
        path: 'designs', // 'designs' | 'custom'
        selectedDesignIds: [],
        currentStep: 1,
        activeCategoryFilter: 'all',
        activeSourceView: 'catalogue', // 'catalogue' | 'favourites'
        searchQuery: '',
        uploadedFiles: [], // [{ id, name, size, type, dataUrl }]
        formData: {
            projectType: 'Residential',
            projectTitle: '',
            projectCategory: '',
            projectLocation: '',
            projectQuantity: '',
            projectDimensions: '',
            projectDescription: '',
            // Conditional: Delivery
            deliveryAddress: '',
            deliveryInstructions: '',
            // Conditional: Installation
            installPropertyStatus: '',
            installSiteAccess: '',
            installRequirements: '',
            // Conditional: Custom
            customOutcomeGoal: '',
            customConstraints: '',
            // Step 2
            materials: ['Structural Mild Steel'],
            preferredFinish: 'Electrostatic Matte Powder Coat (Anti-Corrosion)',
            preferredColour: 'Obsidian Matte Black (ATG Standard)',
            budgetRange: 'Flexible / To be estimated by ATG',
            preferredTimeframe: 'Flexible / High Quality Priority',
            customisationNotes: '',
            // Step 3
            custFullName: '',
            custPhone: '',
            custEmail: '',
            custContactMethod: 'WhatsApp',
            custMessage: '',
            confirmedAccuracy: false
        }
    };

    // DOM Ready Initialization
    document.addEventListener('DOMContentLoaded', () => {
        initHeroActions();
        initHandlingSelection();
        initPathTabs();
        initCatalogueAndFavourites();
        initMultiStepForm();
        initFileUploader();
        initReviewAndSubmission();
        parseUrlParameters();
    });

    /* ==========================================================================
       1. HERO ACTIONS & SMOOTH SCROLLING
       ========================================================================== */
    function initHeroActions() {
        const heroStartBtn = document.getElementById('heroStartBtn');
        if (heroStartBtn) {
            heroStartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById('handlingSection');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    }

    /* ==========================================================================
       2. PROJECT HANDLING SELECTION (Cards A, B, C)
       ========================================================================== */
    function initHandlingSelection() {
        const handlingCards = document.querySelectorAll('.syp-handling-card');
        const conditionDelivery = document.getElementById('conditionDelivery');
        const conditionInstallation = document.getElementById('conditionInstallation');
        const conditionCustom = document.getElementById('conditionCustom');

        function updateHandlingUI(selectedHandling) {
            state.handling = selectedHandling;

            handlingCards.forEach(card => {
                const isSelected = card.getAttribute('data-handling') === selectedHandling;
                card.classList.toggle('is-selected', isSelected);
                card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
            });

            // Toggle conditional field blocks in Step 1
            if (conditionDelivery) {
                conditionDelivery.style.display = (selectedHandling === 'supply_delivery') ? 'block' : 'none';
            }
            if (conditionInstallation) {
                conditionInstallation.style.display = (selectedHandling === 'supply_installation') ? 'block' : 'none';
            }
            if (conditionCustom) {
                conditionCustom.style.display = (selectedHandling === 'custom_project') ? 'block' : 'none';
            }

            // Sync with Review Screen
            updateReviewScreen();
        }

        handlingCards.forEach(card => {
            // Click handler
            card.addEventListener('click', () => {
                const handling = card.getAttribute('data-handling');
                updateHandlingUI(handling);
            });

            // Keyboard accessibility (Space or Enter)
            card.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    const handling = card.getAttribute('data-handling');
                    updateHandlingUI(handling);
                }
            });
        });

        // Initialize with default
        updateHandlingUI(state.handling);
    }

    /* ==========================================================================
       3. PATH TABS (Path A: Choose from Designs vs Path B: Custom Idea)
       ========================================================================== */
    function initPathTabs() {
        const tabDesigns = document.getElementById('tabPathDesigns');
        const tabCustom = document.getElementById('tabPathCustom');
        const panelDesigns = document.getElementById('panelPathDesigns');
        const panelCustom = document.getElementById('panelPathCustom');

        function switchPath(path) {
            state.path = path;
            const isDesigns = path === 'designs';

            if (tabDesigns && tabCustom && panelDesigns && panelCustom) {
                tabDesigns.classList.toggle('is-active', isDesigns);
                tabDesigns.setAttribute('aria-selected', isDesigns ? 'true' : 'false');

                tabCustom.classList.toggle('is-active', !isDesigns);
                tabCustom.setAttribute('aria-selected', !isDesigns ? 'true' : 'false');

                panelDesigns.classList.toggle('is-active', isDesigns);
                panelCustom.classList.toggle('is-active', !isDesigns);
            }

            updateReviewScreen();
        }

        if (tabDesigns) {
            tabDesigns.addEventListener('click', () => switchPath('designs'));
        }
        if (tabCustom) {
            tabCustom.addEventListener('click', () => switchPath('custom'));
        }

        // Custom Concept inputs sync with state
        const customCat = document.getElementById('customProjectCategory');
        const customDesc = document.getElementById('customProjectDescription');
        const customGoal = document.getElementById('customProjectGoal');

        if (customCat) {
            customCat.addEventListener('change', (e) => {
                const projectCategory = document.getElementById('projectCategory');
                if (projectCategory && e.target.value) {
                    projectCategory.value = e.target.value;
                }
                updateReviewScreen();
            });
        }

        if (customDesc) {
            customDesc.addEventListener('input', (e) => {
                const projectDesc = document.getElementById('projectDescription');
                if (projectDesc && (!projectDesc.value || projectDesc.dataset.synced === 'true')) {
                    projectDesc.value = e.target.value;
                    projectDesc.dataset.synced = 'true';
                }
                updateReviewScreen();
            });
        }

        if (customGoal) {
            customGoal.addEventListener('input', updateReviewScreen);
        }
    }

    /* ==========================================================================
       4. CATALOGUE & FAVOURITES INTEGRATION
       ========================================================================== */
    function initCatalogueAndFavourites() {
        const designsGrid = document.getElementById('sypDesignsGrid');
        const emptyFavourites = document.getElementById('sypEmptyFavouritesState');
        const catTotalCount = document.getElementById('catTotalCount');
        const favTotalCount = document.getElementById('favTotalCount');
        const pillCatalogue = document.getElementById('pillViewCatalogue');
        const pillFavourites = document.getElementById('pillViewFavourites');
        const searchInput = document.getElementById('sypSearchInput');
        const clearSearchBtn = document.getElementById('sypClearSearchBtn');
        const categoryChips = document.querySelectorAll('.syp-cat-chip');
        const clearAllTrayBtn = document.getElementById('trayClearAllBtn');

        const allDesigns = window.ATG_CATALOGUE_DATA || [];

        // Update count badges
        if (catTotalCount) catTotalCount.textContent = allDesigns.length;
        updateFavouritesCount();

        // Listen to global favourites updates from window.ATGFavourites
        window.addEventListener('atg:favourites-updated', () => {
            updateFavouritesCount();
            if (state.activeSourceView === 'favourites') {
                renderDesignsGrid();
            }
        });

        // Pill switches: Studio Catalogue vs Favourites
        if (pillCatalogue) {
            pillCatalogue.addEventListener('click', () => {
                state.activeSourceView = 'catalogue';
                pillCatalogue.classList.add('is-active');
                if (pillFavourites) pillFavourites.classList.remove('is-active');
                renderDesignsGrid();
            });
        }

        if (pillFavourites) {
            pillFavourites.addEventListener('click', () => {
                state.activeSourceView = 'favourites';
                pillFavourites.classList.add('is-active');
                if (pillCatalogue) pillCatalogue.classList.remove('is-active');
                renderDesignsGrid();
            });
        }

        // Category Filter Chips
        categoryChips.forEach(chip => {
            chip.addEventListener('click', () => {
                categoryChips.forEach(c => c.classList.remove('is-active'));
                chip.classList.add('is-active');
                state.activeCategoryFilter = chip.getAttribute('data-cat') || 'all';
                renderDesignsGrid();
            });
        });

        // Live Search Input
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value.trim().toLowerCase();
                if (clearSearchBtn) {
                    clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
                }
                renderDesignsGrid();
            });
        }

        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                state.searchQuery = '';
                clearSearchBtn.style.display = 'none';
                renderDesignsGrid();
            });
        }

        // Clear All Tray Selection
        if (clearAllTrayBtn) {
            clearAllTrayBtn.addEventListener('click', () => {
                state.selectedDesignIds = [];
                renderSelectedDesignsTray();
                renderDesignsGrid();
                updateReviewScreen();
            });
        }

        // Initial render
        renderDesignsGrid();

        // Helper: Update Favourites Count badge
        function updateFavouritesCount() {
            const favIds = (window.ATGFavourites && typeof window.ATGFavourites.getFavourites === 'function')
                ? window.ATGFavourites.getFavourites()
                : [];
            if (favTotalCount) favTotalCount.textContent = favIds.length;
        }

        // Helper: Render the grid based on current filters (Organized by Category Sections & Compact Cards)
        function createCompactCardMarkup(design) {
            const isSelected = state.selectedDesignIds.includes(design.id);
            return `
                <div class="syp-design-card ${isSelected ? 'is-selected' : ''}" data-design-id="${escapeHtml(design.id)}" role="button" tabindex="0" aria-pressed="${isSelected ? 'true' : 'false'}">
                    <div class="syp-design-thumb-wrap">
                        <img src="${escapeHtml(design.image)}" alt="${escapeHtml(design.name)}" class="syp-design-thumb" loading="lazy">
                        <div class="syp-design-check-badge">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        ${design.priceEstimate ? `<span class="syp-design-price-tag">${escapeHtml(design.priceEstimate)}</span>` : ''}
                    </div>
                    <div class="syp-design-meta">
                        <div class="syp-design-meta-text">
                            <span class="syp-design-cat">${escapeHtml(design.category)}</span>
                            <h4 class="syp-design-name">${escapeHtml(design.name)}</h4>
                        </div>
                        <button type="button" class="syp-design-card-btn">
                            ${isSelected ? '✓ Selected' : '+ Select Design'}
                        </button>
                    </div>
                </div>
            `;
        }

        function attachCardListeners() {
            if (!designsGrid) return;
            designsGrid.querySelectorAll('.syp-design-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = card.getAttribute('data-design-id');
                    toggleDesignSelection(id);
                });

                card.addEventListener('keydown', (e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        const id = card.getAttribute('data-design-id');
                        toggleDesignSelection(id);
                    }
                });
            });

            // Category section "View All" buttons
            designsGrid.querySelectorAll('[data-view-cat]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetCat = btn.getAttribute('data-view-cat');
                    if (targetCat) {
                        state.activeCategoryFilter = targetCat;
                        categoryChips.forEach(c => {
                            const isMatch = (c.getAttribute('data-cat') || '').toLowerCase() === targetCat.toLowerCase();
                            c.classList.toggle('is-active', isMatch);
                            if (isMatch) {
                                c.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                            }
                        });
                        renderDesignsGrid();
                    }
                });
            });

            // Back to all categories button
            designsGrid.querySelectorAll('.syp-cat-view-back-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    state.activeCategoryFilter = 'all';
                    categoryChips.forEach(c => {
                        c.classList.toggle('is-active', c.getAttribute('data-cat') === 'all');
                    });
                    renderDesignsGrid();
                });
            });
        }

        function renderDesignsGrid() {
            if (!designsGrid) return;

            let pool = allDesigns;

            // Filter by source (Catalogue vs Favourites)
            if (state.activeSourceView === 'favourites') {
                const favIds = (window.ATGFavourites && typeof window.ATGFavourites.getFavourites === 'function')
                    ? window.ATGFavourites.getFavourites()
                    : [];

                pool = allDesigns.filter(d => favIds.includes(d.id));

                if (pool.length === 0) {
                    designsGrid.style.display = 'none';
                    if (emptyFavourites) emptyFavourites.style.display = 'block';
                    return;
                } else {
                    designsGrid.style.display = 'block';
                    if (emptyFavourites) emptyFavourites.style.display = 'none';
                }
            } else {
                designsGrid.style.display = 'block';
                if (emptyFavourites) emptyFavourites.style.display = 'none';
            }

            // Filter by Search Query
            if (state.searchQuery) {
                const q = state.searchQuery;
                pool = pool.filter(d => {
                    const nameMatch = d.name && d.name.toLowerCase().includes(q);
                    const catMatch = d.category && d.category.toLowerCase().includes(q);
                    const descMatch = d.description && d.description.toLowerCase().includes(q);
                    const matMatch = d.materials && d.materials.toLowerCase().includes(q);
                    return nameMatch || catMatch || descMatch || matMatch;
                });

                if (pool.length === 0) {
                    designsGrid.innerHTML = `
                        <div class="syp-search-empty-state">
                            <p class="syp-search-empty-title">No designs match "${escapeHtml(state.searchQuery)}"</p>
                            <span class="syp-search-empty-hint">Try adjusting your keyword or clear the search to browse all categories.</span>
                        </div>
                    `;
                    return;
                }

                designsGrid.innerHTML = `
                    <div class="syp-search-results-bar">
                        <span>Showing <strong>${pool.length}</strong> matching designs for "${escapeHtml(state.searchQuery)}"</span>
                    </div>
                    <div class="syp-designs-section-grid">
                        ${pool.map(createCompactCardMarkup).join('')}
                    </div>
                `;
                attachCardListeners();
                return;
            }

            // If a specific category filter is active (not 'all')
            if (state.activeCategoryFilter !== 'all') {
                const targetFilter = state.activeCategoryFilter.toLowerCase();
                const filtered = allDesigns.filter(d => {
                    const cat = (d.category || '').toLowerCase();
                    return cat === targetFilter || cat.includes(targetFilter);
                });

                designsGrid.innerHTML = `
                    <div class="syp-single-cat-header">
                        <button type="button" class="syp-cat-view-back-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                            <span>Back to All Disciplines</span>
                        </button>
                        <div class="syp-single-cat-info">
                            <h3 class="syp-single-cat-title">${escapeHtml(state.activeCategoryFilter)}</h3>
                            <span class="syp-single-cat-count">${filtered.length} Curated Designs Available</span>
                        </div>
                    </div>
                    <div class="syp-designs-section-grid">
                        ${filtered.map(createCompactCardMarkup).join('')}
                    </div>
                `;
                attachCardListeners();
                return;
            }

            // Overview Mode: "All Disciplines" — Group into Compact Category Sections!
            // Get unique ordered list of categories
            const categoriesMap = {};
            allDesigns.forEach(d => {
                if (!categoriesMap[d.category]) {
                    categoriesMap[d.category] = [];
                }
                categoriesMap[d.category].push(d);
            });

            let sectionsHtml = '';
            for (const [catName, catItems] of Object.entries(categoriesMap)) {
                // Show 3 preview designs per category in section overview
                const previewItems = catItems.slice(0, 3);
                sectionsHtml += `
                    <div class="syp-category-section" data-cat="${escapeHtml(catName)}">
                        <div class="syp-cat-section-header">
                            <div class="syp-cat-section-title-wrap">
                                <h3 class="syp-cat-section-title">${escapeHtml(catName)}</h3>
                                <span class="syp-cat-section-count">${catItems.length} Designs</span>
                            </div>
                            <button type="button" class="syp-cat-section-view-btn" data-view-cat="${escapeHtml(catName)}">
                                <span>Browse All ${catItems.length} in ${escapeHtml(catName)}</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </button>
                        </div>
                        <div class="syp-designs-section-grid">
                            ${previewItems.map(createCompactCardMarkup).join('')}
                        </div>
                    </div>
                `;
            }

            designsGrid.innerHTML = sectionsHtml;
            attachCardListeners();
        }
    }

    // Toggle design selection in the active enquiry
    function toggleDesignSelection(designId) {
        if (!designId) return;

        const idx = state.selectedDesignIds.indexOf(designId);
        if (idx > -1) {
            state.selectedDesignIds.splice(idx, 1);
        } else {
            state.selectedDesignIds.push(designId);
        }

        renderSelectedDesignsTray();
        updatePathDesignCounter();

        // Update cards visual state in grid
        const cards = document.querySelectorAll(`.syp-design-card[data-design-id="${designId}"]`);
        cards.forEach(card => {
            const isSelected = state.selectedDesignIds.includes(designId);
            card.classList.toggle('is-selected', isSelected);
            const btn = card.querySelector('.syp-design-card-btn');
            if (btn) {
                btn.textContent = isSelected ? '✓ Selected for Project' : '+ Select This Design';
            }
        });

        // Pre-fill Step 1 fields if first design selected and fields are empty
        if (state.selectedDesignIds.length > 0) {
            const allDesigns = window.ATG_CATALOGUE_DATA || [];
            const firstDesign = allDesigns.find(d => d.id === state.selectedDesignIds[0]);
            if (firstDesign) {
                const titleInput = document.getElementById('projectTitle');
                const catInput = document.getElementById('projectCategory');
                const descInput = document.getElementById('projectDescription');

                if (titleInput && !titleInput.value) {
                    titleInput.value = `Enquiry: ${firstDesign.name}`;
                }
                if (catInput && (!catInput.value || catInput.value === '')) {
                    catInput.value = firstDesign.category;
                }
                if (descInput && !descInput.value) {
                    descInput.value = `I am interested in customizing and implementing the ${firstDesign.name} design (${firstDesign.category}).`;
                }
            }
        }

        updateReviewScreen();
    }

    // Render the selected designs tray
    function renderSelectedDesignsTray() {
        const tray = document.getElementById('selectedDesignsTray');
        const list = document.getElementById('selectedDesignsList');
        const badge = document.getElementById('trayCounterBadge');

        if (!tray || !list) return;

        if (state.selectedDesignIds.length === 0) {
            tray.style.display = 'none';
            return;
        }

        tray.style.display = 'block';
        if (badge) {
            badge.textContent = `${state.selectedDesignIds.length} Design${state.selectedDesignIds.length > 1 ? 's' : ''}`;
        }

        const allDesigns = window.ATG_CATALOGUE_DATA || [];

        list.innerHTML = state.selectedDesignIds.map(id => {
            const design = allDesigns.find(d => d.id === id);
            if (!design) return '';
            return `
                <div class="syp-tray-chip" data-design-id="${escapeHtml(id)}">
                    <img src="${escapeHtml(design.image)}" alt="${escapeHtml(design.name)}" class="syp-tray-chip-thumb">
                    <span>${escapeHtml(design.name)}</span>
                    <button type="button" class="syp-tray-chip-remove" aria-label="Remove ${escapeHtml(design.name)}" title="Remove from enquiry">&times;</button>
                </div>
            `;
        }).join('');

        // Wire remove buttons (removes from enquiry, does NOT delete from user's favourites!)
        list.querySelectorAll('.syp-tray-chip-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const parent = btn.closest('.syp-tray-chip');
                if (parent) {
                    const id = parent.getAttribute('data-design-id');
                    toggleDesignSelection(id);
                }
            });
        });
    }

    function updatePathDesignCounter() {
        const countBadge = document.getElementById('activeDesignSelectionCount');
        if (countBadge) {
            const len = state.selectedDesignIds.length;
            countBadge.textContent = `${len} selected`;
        }
    }

    /* ==========================================================================
       5. MULTI-STEP FORM CONTROLLER
       ========================================================================== */
    function initMultiStepForm() {
        const btnStep1Next = document.getElementById('btnStep1Next');
        const btnStep2Prev = document.getElementById('btnStep2Prev');
        const btnStep2Next = document.getElementById('btnStep2Next');
        const btnStep3Prev = document.getElementById('btnStep3Prev');

        // Stepper Nodes Navigation (Clicking 01, 02, 03)
        document.querySelectorAll('.syp-step-node').forEach(node => {
            node.setAttribute('role', 'button');
            node.setAttribute('tabindex', '0');
            node.addEventListener('click', () => {
                const targetStep = parseInt(node.getAttribute('data-step'), 10);
                if (!targetStep || targetStep === state.currentStep) return;

                // Navigating backwards is always allowed
                if (targetStep < state.currentStep) {
                    goToStep(targetStep);
                    return;
                }

                // Navigating forwards requires step validations
                if (state.currentStep === 1) {
                    if (validateStep1()) {
                        if (targetStep === 3) {
                            if (validateStep2()) {
                                goToStep(3);
                            } else {
                                goToStep(2);
                            }
                        } else {
                            goToStep(2);
                        }
                    }
                } else if (state.currentStep === 2) {
                    if (validateStep2()) {
                        goToStep(3);
                    }
                }
            });

            node.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    node.click();
                }
            });
        });

        // Step 1: Radio buttons for project type
        const typeRadios = document.querySelectorAll('input[name="projectType"]');
        typeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                document.querySelectorAll('.syp-pill-radio').forEach(p => p.classList.remove('is-checked'));
                radio.closest('.syp-pill-radio').classList.add('is-checked');
                state.formData.projectType = radio.value;
                updateReviewScreen();
            });
        });

        // Step 2: Checkbox chips for materials
        const materialCheckboxes = document.querySelectorAll('input[name="materials"]');
        materialCheckboxes.forEach(chk => {
            chk.addEventListener('change', () => {
                chk.closest('.syp-chip-check').classList.toggle('is-checked', chk.checked);
                const checkedVals = Array.from(document.querySelectorAll('input[name="materials"]:checked')).map(c => c.value);
                state.formData.materials = checkedVals;
                updateReviewScreen();
            });
        });

        // Navigation bindings
        if (btnStep1Next) {
            btnStep1Next.addEventListener('click', () => {
                if (validateStep1()) {
                    goToStep(2);
                }
            });
        }

        if (btnStep2Prev) {
            btnStep2Prev.addEventListener('click', () => {
                goToStep(1);
            });
        }

        if (btnStep2Next) {
            btnStep2Next.addEventListener('click', () => {
                if (validateStep2()) {
                    goToStep(3);
                }
            });
        }

        if (btnStep3Prev) {
            btnStep3Prev.addEventListener('click', () => {
                goToStep(2);
            });
        }

        // Live input listeners to clear validation errors
        ['projectTitle', 'projectCategory', 'projectLocation', 'projectDescription'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    input.classList.remove('is-invalid');
                    const err = document.getElementById(`err${capitalize(id)}`);
                    if (err) err.textContent = '';
                    updateReviewScreen();
                });
            }
        });

        ['custFullName', 'custPhone', 'custEmail'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    input.classList.remove('is-invalid');
                    const err = document.getElementById(`err${capitalize(id)}`);
                    if (err) err.textContent = '';
                    updateReviewScreen();
                });
            }
        });

        const chkConfirm = document.getElementById('chkConfirmAccuracy');
        if (chkConfirm) {
            chkConfirm.addEventListener('change', () => {
                const err = document.getElementById('errConfirmAccuracy');
                if (err && chkConfirm.checked) err.textContent = '';
            });
        }
    }

    // Step Switcher
    function goToStep(targetStep) {
        state.currentStep = targetStep;

        // Toggle form step visibility
        document.querySelectorAll('.syp-form-step').forEach(stepPane => {
            const stepNum = parseInt(stepPane.getAttribute('data-step'), 10);
            stepPane.classList.toggle('is-active', stepNum === targetStep);
        });

        // Update Stepper Nodes and connecting lines
        for (let i = 1; i <= 3; i++) {
            const node = document.getElementById(`stepNode${i}`);
            if (node) {
                node.classList.toggle('is-active', i === targetStep);
                node.classList.toggle('is-passed', i < targetStep);
            }
            if (i < 3) {
                const line = document.getElementById(`stepLine${i}`);
                if (line) {
                    line.classList.toggle('is-passed', i < targetStep);
                }
            }
        }

        updateReviewScreen();

        // Scroll to form top smoothly
        const formShell = document.querySelector('.syp-form-shell');
        if (formShell) {
            formShell.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Step 1 Validation
    function validateStep1() {
        let isValid = true;

        const title = document.getElementById('projectTitle');
        const cat = document.getElementById('projectCategory');
        const loc = document.getElementById('projectLocation');
        const desc = document.getElementById('projectDescription');

        if (!title || !title.value.trim()) {
            showError('projectTitle', 'errProjectTitle', 'Please enter a project title or name.');
            isValid = false;
        }

        if (!cat || !cat.value) {
            showError('projectCategory', 'errProjectCategory', 'Please select a primary project category.');
            isValid = false;
        }

        if (!loc || !loc.value.trim()) {
            showError('projectLocation', 'errProjectLocation', 'Please enter the project location (City / State).');
            isValid = false;
        }

        if (!desc || !desc.value.trim()) {
            showError('projectDescription', 'errProjectDescription', 'Please describe your project scope or vision.');
            isValid = false;
        }

        return isValid;
    }

    // Step 2 Validation
    function validateStep2() {
        // Collect current selections
        const finish = document.getElementById('preferredFinish');
        const colour = document.getElementById('preferredColour');
        const budget = document.getElementById('budgetRange');
        const timeframe = document.getElementById('preferredTimeframe');
        const customNotes = document.getElementById('customisationNotes');

        if (finish) state.formData.preferredFinish = finish.value;
        if (colour) state.formData.preferredColour = colour.value;
        if (budget) state.formData.budgetRange = budget.value;
        if (timeframe) state.formData.preferredTimeframe = timeframe.value;
        if (customNotes) state.formData.customisationNotes = customNotes.value;

        return true;
    }

    // Step 3 Validation
    function validateStep3() {
        let isValid = true;

        const name = document.getElementById('custFullName');
        const phone = document.getElementById('custPhone');
        const email = document.getElementById('custEmail');
        const chkConfirm = document.getElementById('chkConfirmAccuracy');

        if (!name || name.value.trim().length < 2) {
            showError('custFullName', 'errCustFullName', 'Please enter your full name (at least 2 characters).');
            isValid = false;
        }

        if (!phone || !isValidPhone(phone.value.trim())) {
            showError('custPhone', 'errCustPhone', 'Please enter a valid phone number (at least 8 digits).');
            isValid = false;
        }

        if (!email || !isValidEmail(email.value.trim())) {
            showError('custEmail', 'errCustEmail', 'Please enter a valid email address.');
            isValid = false;
        }

        if (!chkConfirm || !chkConfirm.checked) {
            const errConfirm = document.getElementById('errConfirmAccuracy');
            if (errConfirm) errConfirm.textContent = 'Please confirm that the information provided is accurate.';
            isValid = false;
        }

        return isValid;
    }

    function showError(inputId, errId, msg) {
        const input = document.getElementById(inputId);
        const err = document.getElementById(errId);
        if (input) input.classList.add('is-invalid');
        if (err) err.textContent = msg;
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
        return cleaned.length >= 8 && /^\d+$/.test(cleaned);
    }

    /* ==========================================================================
       6. FILE UPLOADER (DRAG & DROP + LOCAL PREVIEW)
       ========================================================================== */
    function initFileUploader() {
        const dropzone = document.getElementById('sypDropzone');
        const fileInput = document.getElementById('sypFileInput');
        const browseTrigger = document.getElementById('browseTriggerBtn');
        const filesTray = document.getElementById('sypFilesTray');
        const filesGrid = document.getElementById('sypFilesGrid');
        const fileCountBadge = document.getElementById('fileCountBadge');

        if (!dropzone || !fileInput) return;

        // Browse trigger click
        if (browseTrigger) {
            browseTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                fileInput.click();
            });
        }

        // Drag and drop events
        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.add('is-dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.remove('is-dragover');
            });
        });

        dropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            if (dt && dt.files && dt.files.length) {
                handleUploadedFiles(dt.files);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length) {
                handleUploadedFiles(e.target.files);
            }
        });

        function handleUploadedFiles(fileList) {
            const MAX_SIZE = 10 * 1024 * 1024; // 10MB
            const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'];

            Array.from(fileList).forEach(file => {
                if (!ALLOWED_TYPES.includes(file.type)) {
                    alert(`"${file.name}" is not a supported file type. Please upload JPG, PNG, WEBP, or PDF.`);
                    return;
                }
                if (file.size > MAX_SIZE) {
                    alert(`"${file.name}" exceeds the 10MB limit.`);
                    return;
                }

                const fileObj = {
                    id: 'file_' + Math.random().toString(36).substring(2, 9),
                    name: file.name,
                    size: formatFileSize(file.size),
                    type: file.type,
                    dataUrl: null
                };

                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        fileObj.dataUrl = event.target.result;
                        state.uploadedFiles.push(fileObj);
                        renderFilesList();
                    };
                    reader.readAsDataURL(file);
                } else {
                    state.uploadedFiles.push(fileObj);
                    renderFilesList();
                }
            });
        }

        function renderFilesList() {
            if (!filesTray || !filesGrid) return;

            if (state.uploadedFiles.length === 0) {
                filesTray.style.display = 'none';
                if (fileCountBadge) fileCountBadge.textContent = '0';
                updateReviewScreen();
                return;
            }

            filesTray.style.display = 'block';
            if (fileCountBadge) fileCountBadge.textContent = state.uploadedFiles.length;

            filesGrid.innerHTML = state.uploadedFiles.map(f => {
                const isPdf = f.type === 'application/pdf';
                return `
                    <div class="syp-file-card" data-file-id="${f.id}">
                        ${isPdf ? `
                            <div class="syp-file-doc-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </div>
                        ` : `
                            <img src="${f.dataUrl || 'images/hero_interior.png'}" alt="${escapeHtml(f.name)}" class="syp-file-thumb">
                        `}
                        <div class="syp-file-meta">
                            <div class="syp-file-name" title="${escapeHtml(f.name)}">${escapeHtml(f.name)}</div>
                            <div class="syp-file-size">${escapeHtml(f.size)}</div>
                        </div>
                        <button type="button" class="syp-file-remove-btn" aria-label="Remove ${escapeHtml(f.name)}" title="Remove file">&times;</button>
                    </div>
                `;
            }).join('');

            filesGrid.querySelectorAll('.syp-file-remove-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const card = btn.closest('.syp-file-card');
                    if (card) {
                        const id = card.getAttribute('data-file-id');
                        state.uploadedFiles = state.uploadedFiles.filter(item => item.id !== id);
                        renderFilesList();
                    }
                });
            });

            updateReviewScreen();
        }
    }

    /* ==========================================================================
       7. LIVE REVIEW COMPILER & FORM SUBMISSION
       ========================================================================== */
    function initReviewAndSubmission() {
        const form = document.getElementById('sypProjectForm');
        const successScreen = document.getElementById('successScreen');
        const successRefCode = document.getElementById('successRefCode');
        const btnDownloadSummary = document.getElementById('btnDownloadSummary');
        const btnStartAnotherProject = document.getElementById('btnStartAnotherProject');

        // Review Jump / Edit Buttons
        document.querySelectorAll('.syp-edit-link').forEach(btn => {
            btn.addEventListener('click', () => {
                const step = parseInt(btn.getAttribute('data-jump-step'), 10) || 1;
                const targetSelector = btn.getAttribute('data-jump-target');

                goToStep(step);

                if (targetSelector) {
                    const el = document.querySelector(targetSelector);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });

        // Form Submit Handler
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                if (!validateStep1()) {
                    goToStep(1);
                    return;
                }

                if (!validateStep2()) {
                    goToStep(2);
                    return;
                }

                if (!validateStep3()) {
                    return;
                }

                // Compile structured project enquiry payload
                const refCode = generateReferenceCode();
                const payload = compileEnquiryPayload(refCode);

                // Expose globally for future API connector
                window.ATG = window.ATG || {};
                window.ATG.getProjectEnquiryPayload = () => payload;
                console.log('[ATG Metal Works & Interiors] Project Enquiry Compiled Successfully:', payload);

                // Show Success Screen
                if (successRefCode) successRefCode.textContent = refCode;
                form.style.display = 'none';
                if (successScreen) {
                    successScreen.style.display = 'block';
                    successScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }

        // Download JSON brief action
        if (btnDownloadSummary) {
            btnDownloadSummary.addEventListener('click', () => {
                if (window.ATG && typeof window.ATG.getProjectEnquiryPayload === 'function') {
                    const payload = window.ATG.getProjectEnquiryPayload();
                    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `ATG-Project-Brief-${payload.referenceCode}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
            });
        }

        // Start Another Project Reset
        if (btnStartAnotherProject) {
            btnStartAnotherProject.addEventListener('click', () => {
                form.reset();
                state.selectedDesignIds = [];
                state.uploadedFiles = [];
                state.currentStep = 1;

                if (successScreen) successScreen.style.display = 'none';
                form.style.display = 'block';

                renderSelectedDesignsTray();
                goToStep(1);
            });
        }
    }

    function updateReviewScreen() {
        // 1. Handling
        const revHandling = document.getElementById('revHandling');
        const revHandlingSub = document.getElementById('revHandlingSub');
        if (revHandling && revHandlingSub) {
            if (state.handling === 'supply_delivery') {
                revHandling.textContent = 'Supply & Delivery';
                revHandlingSub.textContent = 'Option A • Direct Studio Delivery to Specified Site';
            } else if (state.handling === 'supply_installation') {
                revHandling.textContent = 'Supply & Installation';
                revHandlingSub.textContent = 'Option B • Full Turnkey Production & Master Site Mounting';
            } else {
                revHandling.textContent = 'Custom Project';
                revHandlingSub.textContent = 'Option C • Bespoke Concept Engineering from Scratch';
            }
        }

        // 2. Selected Designs / Custom concept
        const revDesigns = document.getElementById('revDesigns');
        const revDesignsSub = document.getElementById('revDesignsSub');
        if (revDesigns && revDesignsSub) {
            const allDesigns = window.ATG_CATALOGUE_DATA || [];
            if (state.selectedDesignIds.length > 0) {
                const names = state.selectedDesignIds.map(id => {
                    const d = allDesigns.find(item => item.id === id);
                    return d ? d.name : id;
                });
                revDesigns.textContent = names.join(', ');
                revDesignsSub.textContent = `${state.selectedDesignIds.length} Studio Concept${state.selectedDesignIds.length > 1 ? 's' : ''} Selected`;
            } else {
                revDesigns.textContent = 'Custom Design Concept';
                revDesignsSub.textContent = 'Path B • Bespoke Architectural Specification';
            }
        }

        // 3. Project Scope
        const revTitle = document.getElementById('revTitle');
        const revScopeSummary = document.getElementById('revScopeSummary');
        const titleInput = document.getElementById('projectTitle');
        const catInput = document.getElementById('projectCategory');
        const locInput = document.getElementById('projectLocation');

        if (revTitle) {
            revTitle.textContent = (titleInput && titleInput.value.trim()) ? titleInput.value.trim() : 'Project Title';
        }
        if (revScopeSummary) {
            const t = state.formData.projectType || 'Residential';
            const c = (catInput && catInput.value) ? catInput.value : 'Architectural Metalwork';
            const l = (locInput && locInput.value.trim()) ? locInput.value.trim() : 'Location Pending';
            revScopeSummary.textContent = `${t} • ${c} • ${l}`;
        }

        // 4. Materials & Finishes
        const revMaterials = document.getElementById('revMaterials');
        const revFinishSummary = document.getElementById('revFinishSummary');
        const finishInput = document.getElementById('preferredFinish');
        const colourInput = document.getElementById('preferredColour');

        if (revMaterials) {
            const mats = Array.from(document.querySelectorAll('input[name="materials"]:checked')).map(c => c.value);
            revMaterials.textContent = mats.length ? mats.join(', ') : 'Mild Steel / Wrought Iron';
        }
        if (revFinishSummary) {
            const f = finishInput ? finishInput.value : 'Matte Powder Coat';
            const col = colourInput ? colourInput.value : 'Obsidian Black';
            revFinishSummary.textContent = `${f} • ${col}`;
        }

        // 5. Budget & Timeframe
        const revBudget = document.getElementById('revBudget');
        const revTimeframe = document.getElementById('revTimeframe');
        const budgetInput = document.getElementById('budgetRange');
        const timeInput = document.getElementById('preferredTimeframe');

        if (revBudget) revBudget.textContent = budgetInput ? budgetInput.value : 'Flexible / To be estimated';
        if (revTimeframe) revTimeframe.textContent = timeInput ? timeInput.value : 'Flexible Priority';

        // 6. Client & Files
        const revClient = document.getElementById('revClient');
        const revClientSub = document.getElementById('revClientSub');
        const nameInput = document.getElementById('custFullName');
        const contactMethod = document.getElementById('custContactMethod');

        if (revClient) {
            revClient.textContent = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'Client Name';
        }
        if (revClientSub) {
            const m = contactMethod ? contactMethod.value : 'WhatsApp';
            revClientSub.textContent = `${m} Preferred • ${state.uploadedFiles.length} File${state.uploadedFiles.length !== 1 ? 's' : ''} Attached`;
        }
    }

    function generateReferenceCode() {
        const rand = Math.floor(1000 + Math.random() * 9000);
        return `ATG-PRJ-2026-${rand}`;
    }

    function compileEnquiryPayload(refCode) {
        const getVal = (id) => {
            const el = document.getElementById(id);
            return el ? el.value.trim() : '';
        };

        return {
            referenceCode: refCode,
            submissionTimestamp: new Date().toISOString(),
            status: 'RECEIVED_PENDING_ARCHITECTURAL_REVIEW',
            projectHandling: state.handling,
            designPath: state.path,
            selectedDesignIds: state.selectedDesignIds,
            projectDetails: {
                projectType: state.formData.projectType,
                title: getVal('projectTitle'),
                category: getVal('projectCategory'),
                location: getVal('projectLocation'),
                quantity: getVal('projectQuantity'),
                dimensions: getVal('projectDimensions'),
                description: getVal('projectDescription'),
                // Handling-specific conditional metadata
                delivery: {
                    address: getVal('deliveryAddress'),
                    instructions: getVal('deliveryInstructions')
                },
                installation: {
                    propertyStatus: getVal('installPropertyStatus'),
                    siteAccess: getVal('installSiteAccess'),
                    mountingRequirements: getVal('installRequirements')
                },
                custom: {
                    desiredOutcome: getVal('customOutcomeGoal'),
                    knownConstraints: getVal('customConstraints'),
                    conceptCategory: getVal('customProjectCategory'),
                    conceptDescription: getVal('customProjectDescription')
                }
            },
            specifications: {
                materials: Array.from(document.querySelectorAll('input[name="materials"]:checked')).map(c => c.value),
                surfaceFinish: getVal('preferredFinish'),
                colourPalette: getVal('preferredColour'),
                budgetFramework: getVal('budgetRange'),
                targetTimeframe: getVal('preferredTimeframe'),
                customisationNotes: getVal('customisationNotes')
            },
            attachments: state.uploadedFiles.map(f => ({
                id: f.id,
                name: f.name,
                size: f.size,
                type: f.type
            })),
            customer: {
                fullName: getVal('custFullName'),
                phone: getVal('custPhone'),
                email: getVal('custEmail'),
                preferredContactMethod: getVal('custContactMethod'),
                additionalMessage: getVal('custMessage'),
                accuracyConfirmed: true
            }
        };
    }

    /* ==========================================================================
       8. URL PARAMETER PRE-SELECTION (?design=ID or ?designs=ID1,ID2)
       ========================================================================== */
    function parseUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const galleryProjectId = urlParams.get('project') || urlParams.get('gallery');

        // Handle Gallery Project Pre-selection
        if (galleryProjectId) {
            const galleryProjects = window.ATG_GALLERY_PROJECTS || [];
            const prj = galleryProjects.find(p => p.id.toLowerCase() === galleryProjectId.toLowerCase());

            if (prj) {
                // Populate Step 1 fields
                const titleInput = document.getElementById('projectTitle');
                const catInput = document.getElementById('projectCategory');
                const locInput = document.getElementById('projectLocation');
                const descInput = document.getElementById('projectDescription');

                if (titleInput && !titleInput.value) {
                    titleInput.value = `Bespoke Commission: ${prj.title}`;
                    state.formData.projectTitle = titleInput.value;
                }

                if (catInput) {
                    const primaryCat = (prj.categories && prj.categories[0]) || '';
                    for (const opt of catInput.options) {
                        if (opt.value && (primaryCat.toLowerCase().includes(opt.value.toLowerCase()) || opt.value.toLowerCase().includes(primaryCat.toLowerCase()))) {
                            catInput.value = opt.value;
                            state.formData.projectCategory = opt.value;
                            break;
                        }
                    }
                }

                if (locInput && !locInput.value && prj.location) {
                    locInput.value = prj.location;
                    state.formData.projectLocation = locInput.value;
                }

                if (descInput && !descInput.value) {
                    descInput.value = `Enquiry inspired by ATG Gallery Commission: ${prj.title} (Ref: ${prj.id.toUpperCase()}) in ${prj.location}.\n\nScope & Architectural Vision:\n${prj.overview}`;
                    state.formData.projectDescription = descInput.value;
                }

                // Project Type radio
                if (prj.sector && prj.sector.toLowerCase().includes('commercial')) {
                    const commRadio = document.querySelector('input[name="projectType"][value="Commercial"]');
                    if (commRadio) {
                        commRadio.checked = true;
                        state.formData.projectType = 'Commercial';
                    }
                } else {
                    const resRadio = document.querySelector('input[name="projectType"][value="Residential"]');
                    if (resRadio) {
                        resRadio.checked = true;
                        state.formData.projectType = 'Residential';
                    }
                }

                // Show the visual reference card
                const refCard = document.getElementById('sypGalleryRefCard');
                const refTitle = document.getElementById('sypRefTitle');
                const refLoc = document.getElementById('sypRefLocation');
                const refCat = document.getElementById('sypRefCategory');
                const refImg = document.getElementById('sypRefImg');

                if (refCard) {
                    refCard.style.display = 'flex';
                    if (refTitle) refTitle.textContent = prj.title;
                    if (refLoc) refLoc.textContent = prj.location || 'Nigeria';
                    if (refCat) refCat.textContent = (prj.categories && prj.categories.join(' • ')) || prj.sector;
                    if (refImg) {
                        refImg.src = prj.image;
                        refImg.alt = prj.title;
                    }
                }

                // Smooth scroll to form
                setTimeout(() => {
                    const formShell = document.querySelector('.syp-form-shell');
                    if (formShell) {
                        formShell.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 250);
            }
        }
        const singleDesign = urlParams.get('design');
        const multiDesigns = urlParams.get('designs');
        const fromFav = urlParams.get('from') === 'favourites';

        const allDesigns = window.ATG_CATALOGUE_DATA || [];
        let idsToSelect = [];

        if (singleDesign) {
            idsToSelect.push(singleDesign);
        }
        if (multiDesigns) {
            const split = multiDesigns.split(',').map(s => s.trim());
            idsToSelect.push(...split);
        }

        if (idsToSelect.length > 0) {
            idsToSelect.forEach(id => {
                const match = allDesigns.find(d => d.id === id);
                if (match && !state.selectedDesignIds.includes(id)) {
                    state.selectedDesignIds.push(id);
                }
            });

            renderSelectedDesignsTray();
            updatePathDesignCounter();

            // Highlight card if in grid
            idsToSelect.forEach(id => {
                const card = document.querySelector(`.syp-design-card[data-design-id="${id}"]`);
                if (card) card.classList.add('is-selected');
            });

            // Smooth scroll to form or creation section
            setTimeout(() => {
                const creationSec = document.getElementById('creationSection');
                if (creationSec) {
                    creationSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        } else if (fromFav) {
            // User came from Favourites page wanting to start project with saved designs
            const pillFav = document.getElementById('pillViewFavourites');
            if (pillFav) pillFav.click();

            setTimeout(() => {
                const creationSec = document.getElementById('creationSection');
                if (creationSec) {
                    creationSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        }
    }

    /* Utility Helpers */
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function escapeHtml(str) {
        if (typeof str !== 'string') return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

})();

