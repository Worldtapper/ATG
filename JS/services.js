/**
 * ATG Metal Works & Interiors — Services Design Catalogue Discovery Engine
 * Luxury Architectural Showroom & Interactive Design Catalogue
 * 
 * Features:
 * - 4-Featured Designs per Category Showroom Overview
 * - Instant "Browse All [Category]" Focused View with Scoped Search & Materials Filtering
 * - Complete "All Designs" Collection View
 * - URL Query Param & Browser History (Back / Forward) Synchronization
 * - Integrated Favourites & "Start Your Project" Pre-selection Coordination
 * - Full Keyboard & Mobile Touch Accessibility
 */

document.addEventListener('DOMContentLoaded', () => {
    // Verify required dependencies
    if (!window.ATG_CATALOGUE_DATA || !window.ATG_UI) {
        console.error('[ATG] Catalogue data or UI module missing!');
        return;
    }

    const allDesigns = window.ATG_CATALOGUE_DATA || [];
    const categoriesMeta = window.ATG_CATEGORIES || [];

    // --- DOM Elements ---
    // Hero Search & Actions
    const heroSearchInput = document.getElementById('heroSearchInput');
    const heroSearchActionBtn = document.getElementById('heroSearchActionBtn');
    const heroClearSearchBtn = document.getElementById('heroClearSearchBtn');
    const exploreDesignsBtn = document.getElementById('exploreDesignsBtn');

    // Category Navigation Bar
    const categoryNavBar = document.getElementById('categoryNavBar');
    const categoryChipsContainer = document.getElementById('categoryChipsContainer');
    const catNavScrollLeft = document.getElementById('catNavScrollLeft');
    const catNavScrollRight = document.getElementById('catNavScrollRight');

    // View Containers
    const categoryOverviewView = document.getElementById('categoryOverviewView');
    const focusedCategoryView = document.getElementById('focusedCategoryView');
    const allDesignsView = document.getElementById('allDesignsView');

    // Focused Category View Controls
    const backToCategoriesBtn = document.getElementById('backToCategoriesBtn');
    const focusedDeptPill = document.getElementById('focusedDeptPill');
    const focusedCountPill = document.getElementById('focusedCountPill');
    const focusedCategoryTitle = document.getElementById('focusedCategoryTitle');
    const focusedCategoryDesc = document.getElementById('focusedCategoryDesc');
    const focusedSearchInput = document.getElementById('focusedSearchInput');
    const focusedClearSearchBtn = document.getElementById('focusedClearSearchBtn');
    const focusedMaterialSelect = document.getElementById('focusedMaterialSelect');
    const focusedSortSelect = document.getElementById('focusedSortSelect');
    const focusedResultsMeta = document.getElementById('focusedResultsMeta');
    const focusedCardsGrid = document.getElementById('focusedCardsGrid');
    const focusedEmptyState = document.getElementById('focusedEmptyState');
    const focusedResetSearchBtn = document.getElementById('focusedResetSearchBtn');

    // All Designs View Controls
    const allBackToCategoriesBtn = document.getElementById('allBackToCategoriesBtn');
    const allDesignsBadge = document.getElementById('allDesignsBadge');
    const allDesignsSearchInput = document.getElementById('allDesignsSearchInput');
    const allClearSearchBtn = document.getElementById('allClearSearchBtn');
    const allCategorySelect = document.getElementById('allCategorySelect');
    const allMaterialSelect = document.getElementById('allMaterialSelect');
    const allSortSelect = document.getElementById('allSortSelect');
    const allResultCountText = document.getElementById('allResultCountText');
    const allResetFiltersBtn = document.getElementById('allResetFiltersBtn');
    const allCardsGrid = document.getElementById('allCardsGrid');
    const allEmptyState = document.getElementById('allEmptyState');
    const allEmptyResetBtn = document.getElementById('allEmptyResetBtn');

    // --- Category Aliases for 100% Backward Compatibility ---
    const CATEGORY_ALIASES = {
        'gates': 'Gates',
        'gates & entrance designs': 'Gates',
        'gates and entrance designs': 'Gates',
        'gates & entrance': 'Gates',
        'gates & fencing': 'Gates',
        'gates and fencing': 'Gates',
        'doors': 'Doors',
        'door': 'Doors',
        'staircases': 'Staircases',
        'staircase': 'Staircases',
        'stairs': 'Staircases',
        'railings & staircases': 'Staircases',
        'railings & balustrades': 'Railings & Balustrades',
        'railings and balustrades': 'Railings & Balustrades',
        'railings': 'Railings & Balustrades',
        'balustrades': 'Railings & Balustrades',
        'metal fabrication': 'Metal Fabrication',
        'precision metal fabrication': 'Metal Fabrication',
        'structural steel': 'Structural Steel',
        'tables': 'Tables',
        'table': 'Tables',
        'chairs': 'Chairs',
        'chair': 'Chairs',
        'custom furniture': 'Custom Furniture',
        'furniture': 'Custom Furniture',
        'shelves & storage': 'Shelves & Storage',
        'shelving & storage': 'Shelves & Storage',
        'shelves': 'Shelves & Storage',
        'shelving': 'Shelves & Storage',
        'wall shelves': 'Shelves & Storage',
        'floating shelves': 'Shelves & Storage',
        'metal shelves': 'Shelves & Storage',
        'metal-and-wood shelves': 'Shelves & Storage',
        'storage shelving': 'Shelves & Storage',
        'display shelves': 'Shelves & Storage',
        'boutique garment racks': 'Boutique Garment Racks & Retail Displays',
        'boutique garment racks & retail displays': 'Boutique Garment Racks & Retail Displays',
        'retail display stands': 'Boutique Garment Racks & Retail Displays',
        'retail displays': 'Boutique Garment Racks & Retail Displays',
        'garment racks': 'Boutique Garment Racks & Retail Displays',
        'kitchen cabinets': 'Kitchen Cabinets',
        'kitchen cabinets & wardrobes': 'Kitchen Cabinets',
        'kitchens': 'Kitchen Cabinets',
        'wardrobes': 'Wardrobes',
        'wardrobe': 'Wardrobes',
        'dressing suite': 'Wardrobes',
        'aluminium & glass': 'Aluminium & Glass',
        'aluminium and glass': 'Aluminium & Glass',
        'interior partitions': 'Aluminium & Glass',
        'interior solutions': 'Interior Solutions',
        'interior design': 'Interior Solutions',
        'office & commercial interiors': 'Interior Solutions'
    };

    // --- State Engine ---
    const state = {
        mode: 'overview', // 'overview' | 'category' | 'all'
        activeCategory: 'Gates',
        categoryQuery: '',
        categoryMaterial: 'all',
        categorySort: 'featured',
        allQuery: '',
        allCategory: 'all',
        allMaterial: 'all',
        allSort: 'featured'
    };

    // 1. Initialise Component Elements & Navigation
    initCategoryNavBar();
    initScrollDownAffordance();
    initOverviewShowroom();
    initAllCategoryDropdown();
    setupEventDelegation();
    initDirectoryLinks();

    // 2. Parse Initial URL State
    parseUrlState();

    // 3. Listen to Popstate for Browser History Navigation (Back / Forward)
    window.addEventListener('popstate', (e) => {
        parseUrlState(false);
    });

    // 4. Listen to Global Favourites Updates
    window.addEventListener('atg:favourites-updated', () => {
        if (window.ATGFavourites) {
            window.ATGFavourites.updateDOM();
        }
    });

    // 5. Auto-open modal if ?design=ID is present
    const initParams = new URLSearchParams(window.location.search);
    if (initParams.has('design')) {
        const targetId = initParams.get('design').trim();
        if (targetId && window.ATG_UI && window.ATG_UI.openDesignModal) {
            setTimeout(() => {
                window.ATG_UI.openDesignModal(targetId);
            }, 200);
        }
    }

    /* ==========================================================================
       CATEGORY NAVIGATION BAR
       ========================================================================== */

    function initCategoryNavBar() {
        if (!categoryChipsContainer) return;

        // Build HTML for chips
        let chipsHtml = `
            <button type="button" class="category-nav-chip is-active" data-nav="overview" role="tab" aria-selected="true">
                <span class="chip-label">Overview</span>
                <span class="chip-count">Showroom</span>
            </button>
            <button type="button" class="category-nav-chip" data-nav="all" role="tab" aria-selected="false">
                <span class="chip-label">All Designs</span>
                <span class="chip-count">${allDesigns.length}</span>
            </button>
        `;

        categoriesMeta.forEach(cat => {
            const catDesigns = allDesigns.filter(d => d.category === cat.name);
            chipsHtml += `
                <button type="button" class="category-nav-chip" data-nav="category" data-cat="${escapeAttr(cat.name)}" role="tab" aria-selected="false">
                    <span class="chip-label">${escapeHtml(cat.name)}</span>
                    <span class="chip-count">${catDesigns.length}</span>
                </button>
            `;
        });

        categoryChipsContainer.innerHTML = chipsHtml;

        // Bind clicks on chips
        const chips = categoryChipsContainer.querySelectorAll('.category-nav-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const navType = chip.getAttribute('data-nav');
                if (navType === 'overview') {
                    openOverviewMode(true);
                } else if (navType === 'all') {
                    openAllDesignsMode('', 'all', true);
                } else if (navType === 'category') {
                    const catName = chip.getAttribute('data-cat');
                    openCategoryMode(catName, true);
                }
            });
        });

        // Horizontal Scroll Buttons
        initScrollAffordance();
    }

    function initScrollAffordance() {
        if (!categoryChipsContainer) return;

        const updateScrollButtons = () => {
            const scrollLeft = categoryChipsContainer.scrollLeft;
            const maxScroll = categoryChipsContainer.scrollWidth - categoryChipsContainer.clientWidth - 4;

            if (catNavScrollLeft) {
                catNavScrollLeft.style.opacity = scrollLeft > 10 ? '1' : '0.2';
                catNavScrollLeft.style.pointerEvents = scrollLeft > 10 ? 'auto' : 'none';
            }
            if (catNavScrollRight) {
                catNavScrollRight.style.opacity = scrollLeft < maxScroll ? '1' : '0.2';
                catNavScrollRight.style.pointerEvents = scrollLeft < maxScroll ? 'auto' : 'none';
            }
        };

        if (catNavScrollLeft) {
            catNavScrollLeft.addEventListener('click', () => {
                categoryChipsContainer.scrollBy({ left: -260, behavior: 'smooth' });
            });
        }
        if (catNavScrollRight) {
            catNavScrollRight.addEventListener('click', () => {
                categoryChipsContainer.scrollBy({ left: 260, behavior: 'smooth' });
            });
        }

        categoryChipsContainer.addEventListener('scroll', updateScrollButtons, { passive: true });
        window.addEventListener('resize', updateScrollButtons, { passive: true });
        updateScrollButtons();
    }

    function syncActiveNavChip() {
        if (!categoryChipsContainer) return;

        const chips = categoryChipsContainer.querySelectorAll('.category-nav-chip');
        chips.forEach(chip => {
            const navType = chip.getAttribute('data-nav');
            let isMatch = false;

            if (state.mode === 'overview' && navType === 'overview') {
                isMatch = true;
            } else if (state.mode === 'all' && navType === 'all') {
                isMatch = true;
            } else if (state.mode === 'category' && navType === 'category') {
                const catName = chip.getAttribute('data-cat');
                if (catName && catName.toLowerCase() === state.activeCategory.toLowerCase()) {
                    isMatch = true;
                }
            }

            chip.classList.toggle('is-active', isMatch);
            chip.setAttribute('aria-selected', isMatch ? 'true' : 'false');

            if (isMatch) {
                chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });
    }

    /* ==========================================================================
       VIEW 1: OVERVIEW SHOWROOM (4 FEATURED DESIGNS PER CATEGORY)
       ========================================================================== */

    function initOverviewShowroom() {
        if (!categoryOverviewView) return;

        let overviewHtml = '';

        categoriesMeta.forEach(cat => {
            const catDesigns = allDesigns.filter(d => d.category === cat.name);
            const totalCount = catDesigns.length;

            // Select exactly 9 featured designs (3x3 grid)
            let featuredDesigns = catDesigns.filter(d => d.featured === true);
            if (featuredDesigns.length < 9) {
                const nonFeatured = catDesigns.filter(d => !d.featured);
                featuredDesigns = [...featuredDesigns, ...nonFeatured].slice(0, 9);
            } else if (featuredDesigns.length > 9) {
                featuredDesigns = featuredDesigns.slice(0, 9);
            }

            const cardsMarkup = featuredDesigns.map(design => window.ATG_UI.createDesignCardMarkup(design)).join('');
            const slug = slugify(cat.name);

            overviewHtml += `
                <section class="catalogue-category-section" id="cat-section-${slug}" data-category="${escapeAttr(cat.name)}">
                    <div class="category-section-header">
                        <div class="cat-header-info">
                            <div class="cat-header-badge-row">
                                <span class="cat-dept-badge">${escapeHtml(cat.department)}</span>
                                <span class="cat-count-badge">${totalCount} Designs</span>
                            </div>
                            <h2 class="cat-section-title">${escapeHtml(cat.headline || cat.name)}</h2>
                            <p class="cat-section-desc">${escapeHtml(cat.desc)}</p>
                        </div>
                        <button type="button" class="btn-browse-category" data-action="browse-category" data-category="${escapeAttr(cat.name)}" aria-label="Browse all ${escapeAttr(cat.name)} designs">
                            Browse All ${escapeHtml(cat.name)}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </button>
                    </div>

                    <div class="featured-cards-grid">
                        ${cardsMarkup}
                    </div>

                    <div class="category-section-footer">
                        <button type="button" class="btn-browse-category-outline" data-action="browse-category" data-category="${escapeAttr(cat.name)}" aria-label="Explore full ${escapeAttr(cat.name)} catalogue">
                            Browse All ${escapeHtml(cat.name)} (${totalCount} Curated Designs)
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </button>
                    </div>
                </section>
            `;
        });

        categoryOverviewView.innerHTML = overviewHtml;
    }

    function openOverviewMode(updateUrl = true) {
        state.mode = 'overview';

        if (categoryOverviewView) categoryOverviewView.style.display = 'block';
        if (focusedCategoryView) focusedCategoryView.style.display = 'none';
        if (allDesignsView) allDesignsView.style.display = 'none';

        syncActiveNavChip();

        if (updateUrl) {
            updateBrowserUrl('services.html');
        }
    }

    /* ==========================================================================
       VIEW 2: FOCUSED CATEGORY CATALOGUE VIEW
       ========================================================================== */

    function openCategoryMode(categoryName, updateUrl = true, scrollToTop = true) {
        // Resolve alias or fallback
        const resolvedName = resolveCategoryName(categoryName);
        state.mode = 'category';
        state.activeCategory = resolvedName;
        state.categoryQuery = '';
        state.categoryMaterial = 'all';
        state.categorySort = 'featured';

        // Reset controls
        if (focusedSearchInput) focusedSearchInput.value = '';
        if (focusedClearSearchBtn) focusedClearSearchBtn.style.display = 'none';
        if (focusedMaterialSelect) focusedMaterialSelect.value = 'all';
        if (focusedSortSelect) focusedSortSelect.value = 'featured';

        // Get metadata
        const meta = categoriesMeta.find(c => c.name.toLowerCase() === resolvedName.toLowerCase()) || {
            name: resolvedName,
            department: 'Architectural Discipline',
            headline: resolvedName,
            desc: `Curated ATG collection of architectural ${resolvedName.toLowerCase()} crafted to precise engineering specifications.`
        };

        // Populate Header
        if (focusedDeptPill) focusedDeptPill.textContent = meta.department;
        if (focusedCategoryTitle) focusedCategoryTitle.textContent = meta.headline || meta.name;
        if (focusedCategoryDesc) focusedCategoryDesc.textContent = meta.desc;

        // Toggle Views
        if (categoryOverviewView) categoryOverviewView.style.display = 'none';
        if (allDesignsView) allDesignsView.style.display = 'none';
        if (focusedCategoryView) focusedCategoryView.style.display = 'block';

        syncActiveNavChip();
        renderFocusedCategoryGrid();

        if (updateUrl) {
            const slug = slugify(resolvedName);
            updateBrowserUrl(`services.html?category=${encodeURIComponent(slug)}`);
        }

        if (scrollToTop) {
            scrollToCatalogueTop();
        }
    }

    function renderFocusedCategoryGrid() {
        if (!focusedCardsGrid) return;

        // Filter by category
        let list = allDesigns.filter(d => d.category.toLowerCase() === state.activeCategory.toLowerCase());
        const totalInCategory = list.length;

        // Apply scoped search query
        if (state.categoryQuery && state.categoryQuery.length > 0) {
            const words = state.categoryQuery.toLowerCase().split(/\s+/).filter(w => w.length > 0);
            list = list.filter(item => {
                const combined = getSearchableText(item);
                return words.every(w => combined.includes(w));
            });
        }

        // Apply material filter
        if (state.categoryMaterial !== 'all') {
            const matFilter = state.categoryMaterial.toLowerCase();
            list = list.filter(item => {
                const matText = (item.materials || '').toLowerCase();
                if (matFilter === 'steel') return matText.includes('steel') || matText.includes('iron');
                if (matFilter === 'brass') return matText.includes('brass') || matText.includes('bronze');
                if (matFilter === 'glass') return matText.includes('glass') || matText.includes('glaze');
                if (matFilter === 'wood') return matText.includes('wood') || matText.includes('oak') || matText.includes('teak') || matText.includes('walnut') || matText.includes('iroko');
                if (matFilter === 'marble') return matText.includes('marble') || matText.includes('travertine') || matText.includes('stone') || matText.includes('quartzite');
                return true;
            });
        }

        // Apply sort
        list = sortDesignsList(list, state.categorySort);

        // Update counts
        if (focusedCountPill) {
            focusedCountPill.textContent = `${totalInCategory} Designs Available`;
        }
        if (focusedResultsMeta) {
            if (list.length === totalInCategory && (!state.categoryQuery || state.categoryQuery.length === 0)) {
                focusedResultsMeta.innerHTML = `Showing all <strong>${list.length}</strong> designs in <em>${escapeHtml(state.activeCategory)}</em>`;
            } else {
                focusedResultsMeta.innerHTML = `Showing <strong>${list.length}</strong> of ${totalInCategory} designs in <em>${escapeHtml(state.activeCategory)}</em>`;
            }
        }

        // Render Cards or Empty State
        if (list.length === 0) {
            focusedCardsGrid.innerHTML = '';
            focusedCardsGrid.style.display = 'none';
            if (focusedEmptyState) focusedEmptyState.style.display = 'block';
        } else {
            if (focusedEmptyState) focusedEmptyState.style.display = 'none';
            focusedCardsGrid.style.display = 'grid';
            focusedCardsGrid.innerHTML = list.map(d => window.ATG_UI.createDesignCardMarkup(d)).join('');
        }
    }

    /* ==========================================================================
       VIEW 3: ALL DESIGNS COMPREHENSIVE CATALOGUE VIEW
       ========================================================================== */

    function initAllCategoryDropdown() {
        if (!allCategorySelect) return;

        let optionsHtml = `<option value="all">All Categories (${allDesigns.length})</option>`;
        categoriesMeta.forEach(cat => {
            const count = allDesigns.filter(d => d.category === cat.name).length;
            optionsHtml += `<option value="${escapeAttr(cat.name)}">${escapeHtml(cat.name)} (${count})</option>`;
        });

        allCategorySelect.innerHTML = optionsHtml;
    }

    function openAllDesignsMode(query = '', category = 'all', updateUrl = true, scrollToTop = true) {
        state.mode = 'all';
        state.allQuery = query || '';
        state.allCategory = category || 'all';
        state.allMaterial = 'all';
        state.allSort = 'featured';

        // Sync inputs
        if (allDesignsSearchInput) allDesignsSearchInput.value = state.allQuery;
        if (allClearSearchBtn) allClearSearchBtn.style.display = state.allQuery ? 'flex' : 'none';
        if (allCategorySelect) allCategorySelect.value = state.allCategory;
        if (allMaterialSelect) allMaterialSelect.value = 'all';
        if (allSortSelect) allSortSelect.value = 'featured';

        // Toggle Views
        if (categoryOverviewView) categoryOverviewView.style.display = 'none';
        if (focusedCategoryView) focusedCategoryView.style.display = 'none';
        if (allDesignsView) allDesignsView.style.display = 'block';

        syncActiveNavChip();
        renderAllDesignsGrid();

        if (updateUrl) {
            const params = new URLSearchParams();
            params.set('category', 'all');
            if (state.allQuery) params.set('search', state.allQuery);
            if (state.allCategory !== 'all') params.set('filterCategory', state.allCategory);
            updateBrowserUrl(`services.html?${params.toString()}`);
        }

        if (scrollToTop) {
            scrollToCatalogueTop();
        }
    }

    function renderAllDesignsGrid() {
        if (!allCardsGrid) return;

        let list = [...allDesigns];

        // 1. Category Filter
        if (state.allCategory !== 'all') {
            list = list.filter(d => d.category.toLowerCase() === state.allCategory.toLowerCase());
        }

        // 2. Search Query Filter
        if (state.allQuery && state.allQuery.length > 0) {
            const words = state.allQuery.toLowerCase().split(/\s+/).filter(w => w.length > 0);
            list = list.filter(item => {
                const text = getSearchableText(item);
                return words.every(w => text.includes(w));
            });
        }

        // 3. Material Filter
        if (state.allMaterial !== 'all') {
            const matFilter = state.allMaterial.toLowerCase();
            list = list.filter(item => {
                const matText = (item.materials || '').toLowerCase();
                if (matFilter === 'steel') return matText.includes('steel') || matText.includes('iron');
                if (matFilter === 'brass') return matText.includes('brass') || matText.includes('bronze');
                if (matFilter === 'glass') return matText.includes('glass') || matText.includes('glaze');
                if (matFilter === 'wood') return matText.includes('wood') || matText.includes('oak') || matText.includes('teak') || matText.includes('walnut') || matText.includes('iroko');
                if (matFilter === 'marble') return matText.includes('marble') || matText.includes('travertine') || matText.includes('stone') || matText.includes('quartzite');
                return true;
            });
        }

        // 4. Sort
        list = sortDesignsList(list, state.allSort);

        // 5. Update Count & Meta
        if (allResultCountText) {
            if (list.length === allDesigns.length) {
                allResultCountText.innerHTML = `Showing all <strong>${list.length}</strong> design concepts`;
            } else {
                let txt = `Showing <strong>${list.length}</strong> of ${allDesigns.length} design concepts`;
                if (state.allCategory !== 'all') {
                    txt += ` in <em>${escapeHtml(state.allCategory)}</em>`;
                }
                if (state.allQuery) {
                    txt += ` matching &ldquo;${escapeHtml(state.allQuery)}&rdquo;`;
                }
                allResultCountText.innerHTML = txt;
            }
        }

        const isFiltered = state.allQuery || state.allCategory !== 'all' || state.allMaterial !== 'all' || state.allSort !== 'featured';
        if (allResetFiltersBtn) {
            allResetFiltersBtn.style.display = isFiltered ? 'inline-flex' : 'none';
        }

        // 6. Render
        if (list.length === 0) {
            allCardsGrid.innerHTML = '';
            allCardsGrid.style.display = 'none';
            if (allEmptyState) allEmptyState.style.display = 'block';
        } else {
            if (allEmptyState) allEmptyState.style.display = 'none';
            allCardsGrid.style.display = 'grid';
            allCardsGrid.innerHTML = list.map(d => window.ATG_UI.createDesignCardMarkup(d)).join('');
        }
    }

    /* ==========================================================================
       EVENT BINDINGS & DELEGATION
       ========================================================================== */

    function setupEventDelegation() {
        // Hero Search Handlers
        if (heroSearchActionBtn && heroSearchInput) {
            const executeHeroSearch = () => {
                const query = heroSearchInput.value.trim();
                if (query.length > 0) {
                    openAllDesignsMode(query, 'all', true);
                } else {
                    openOverviewMode(true);
                    scrollToCatalogueTop();
                }
            };

            heroSearchActionBtn.addEventListener('click', executeHeroSearch);
            heroSearchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    executeHeroSearch();
                }
            });

            heroSearchInput.addEventListener('input', (e) => {
                if (heroClearSearchBtn) {
                    heroClearSearchBtn.style.display = e.target.value.trim() ? 'flex' : 'none';
                }
            });
        }

        if (heroClearSearchBtn && heroSearchInput) {
            heroClearSearchBtn.addEventListener('click', () => {
                heroSearchInput.value = '';
                heroClearSearchBtn.style.display = 'none';
                heroSearchInput.focus();
            });
        }

        if (exploreDesignsBtn) {
            exploreDesignsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                scrollToCatalogueTop();
            });
        }

        // Back to All Categories Buttons
        if (backToCategoriesBtn) {
            backToCategoriesBtn.addEventListener('click', () => {
                const lastCat = state.activeCategory;
                openOverviewMode(true);
                // Scroll to the specific category section
                setTimeout(() => {
                    const sec = document.getElementById(`cat-section-${slugify(lastCat)}`);
                    if (sec) {
                        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                        scrollToCatalogueTop();
                    }
                }, 50);
            });
        }

        if (allBackToCategoriesBtn) {
            allBackToCategoriesBtn.addEventListener('click', () => {
                openOverviewMode(true);
                scrollToCatalogueTop();
            });
        }

        // Focused Category Controls Handlers
        if (focusedSearchInput) {
            focusedSearchInput.addEventListener('input', (e) => {
                state.categoryQuery = e.target.value.trim();
                if (focusedClearSearchBtn) {
                    focusedClearSearchBtn.style.display = state.categoryQuery ? 'flex' : 'none';
                }
                renderFocusedCategoryGrid();
            });
        }

        if (focusedClearSearchBtn && focusedSearchInput) {
            focusedClearSearchBtn.addEventListener('click', () => {
                focusedSearchInput.value = '';
                state.categoryQuery = '';
                focusedClearSearchBtn.style.display = 'none';
                renderFocusedCategoryGrid();
                focusedSearchInput.focus();
            });
        }

        if (focusedResetSearchBtn && focusedSearchInput) {
            focusedResetSearchBtn.addEventListener('click', () => {
                focusedSearchInput.value = '';
                state.categoryQuery = '';
                state.categoryMaterial = 'all';
                if (focusedMaterialSelect) focusedMaterialSelect.value = 'all';
                if (focusedClearSearchBtn) focusedClearSearchBtn.style.display = 'none';
                renderFocusedCategoryGrid();
            });
        }

        if (focusedMaterialSelect) {
            focusedMaterialSelect.addEventListener('change', (e) => {
                state.categoryMaterial = e.target.value;
                renderFocusedCategoryGrid();
            });
        }

        if (focusedSortSelect) {
            focusedSortSelect.addEventListener('change', (e) => {
                state.categorySort = e.target.value;
                renderFocusedCategoryGrid();
            });
        }

        // All Designs Controls Handlers
        if (allDesignsSearchInput) {
            allDesignsSearchInput.addEventListener('input', (e) => {
                state.allQuery = e.target.value.trim();
                if (allClearSearchBtn) {
                    allClearSearchBtn.style.display = state.allQuery ? 'flex' : 'none';
                }
                renderAllDesignsGrid();
                syncAllDesignsUrl();
            });
        }

        if (allClearSearchBtn && allDesignsSearchInput) {
            allClearSearchBtn.addEventListener('click', () => {
                allDesignsSearchInput.value = '';
                state.allQuery = '';
                allClearSearchBtn.style.display = 'none';
                renderAllDesignsGrid();
                syncAllDesignsUrl();
                allDesignsSearchInput.focus();
            });
        }

        if (allCategorySelect) {
            allCategorySelect.addEventListener('change', (e) => {
                state.allCategory = e.target.value;
                renderAllDesignsGrid();
                syncAllDesignsUrl();
            });
        }

        if (allMaterialSelect) {
            allMaterialSelect.addEventListener('change', (e) => {
                state.allMaterial = e.target.value;
                renderAllDesignsGrid();
            });
        }

        if (allSortSelect) {
            allSortSelect.addEventListener('change', (e) => {
                state.allSort = e.target.value;
                renderAllDesignsGrid();
            });
        }

        if (allResetFiltersBtn) {
            allResetFiltersBtn.addEventListener('click', resetAllDesignsFilters);
        }

        if (allEmptyResetBtn) {
            allEmptyResetBtn.addEventListener('click', resetAllDesignsFilters);
        }

        // Delegate "Browse All [Category]" clicks from Category Overview
        if (categoryOverviewView) {
            categoryOverviewView.addEventListener('click', (e) => {
                const browseBtn = e.target.closest('[data-action="browse-category"]');
                if (browseBtn) {
                    e.preventDefault();
                    const catName = browseBtn.getAttribute('data-category');
                    if (catName) {
                        openCategoryMode(catName, true);
                    }
                }
            });

            // Card click actions delegation (Favourite button, View Details)
            window.ATG_UI.setupCardDelegation(categoryOverviewView);
        }

        if (focusedCardsGrid) {
            window.ATG_UI.setupCardDelegation(focusedCardsGrid);
        }

        if (allCardsGrid) {
            window.ATG_UI.setupCardDelegation(allCardsGrid);
        }
    }

    function resetAllDesignsFilters() {
        state.allQuery = '';
        state.allCategory = 'all';
        state.allMaterial = 'all';
        state.allSort = 'featured';

        if (allDesignsSearchInput) allDesignsSearchInput.value = '';
        if (allClearSearchBtn) allClearSearchBtn.style.display = 'none';
        if (allCategorySelect) allCategorySelect.value = 'all';
        if (allMaterialSelect) allMaterialSelect.value = 'all';
        if (allSortSelect) allSortSelect.value = 'featured';

        renderAllDesignsGrid();
        syncAllDesignsUrl();
    }

    function syncAllDesignsUrl() {
        if (!window.history || !window.history.replaceState) return;

        const params = new URLSearchParams();
        params.set('category', 'all');
        if (state.allQuery) params.set('search', state.allQuery);
        if (state.allCategory !== 'all') params.set('filterCategory', state.allCategory);

        updateBrowserUrl(`services.html?${params.toString()}`, true);
    }

    /* ==========================================================================
       DIRECTORY LINKS HANDLER
       ========================================================================== */

    function initDirectoryLinks() {
        const dirLinks = document.querySelectorAll('.directory-link');
        dirLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                let rawCat = link.getAttribute('data-category');
                if (!rawCat) return;
                openCategoryMode(rawCat, true);
            });
        });

        // Sync directory badge counters with live catalogue data
        document.querySelectorAll('[data-dir-cat]').forEach(counter => {
            const catName = counter.getAttribute('data-dir-cat');
            if (catName) {
                const count = allDesigns.filter(d => d.category.toLowerCase() === catName.toLowerCase()).length;
                if (count > 0) counter.textContent = count;
            }
        });
    }

    /* ==========================================================================
       URL PARSING & ROUTING ENGINE
       ========================================================================== */

    function parseUrlState(updateUrl = false) {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has('search')) {
            const query = urlParams.get('search').trim();
            const filterCat = urlParams.get('filterCategory') || 'all';
            openAllDesignsMode(query, filterCat, updateUrl, false);
            return;
        }

        if (urlParams.has('category')) {
            const rawCat = urlParams.get('category').trim();
            const lowerCat = rawCat.toLowerCase();

            if (lowerCat === 'all' || lowerCat === 'all designs' || lowerCat === 'all-designs') {
                openAllDesignsMode('', 'all', updateUrl, false);
                return;
            }

            if (lowerCat === 'overview' || lowerCat === 'showroom') {
                openOverviewMode(updateUrl);
                return;
            }

            const resolved = resolveCategoryName(rawCat);
            openCategoryMode(resolved, updateUrl, false);
            return;
        }

        // Default: Overview Showroom Mode
        openOverviewMode(updateUrl);
    }

    function resolveCategoryName(rawName) {
        if (!rawName) return 'Gates';
        const cleaned = rawName.trim().toLowerCase();

        // 1. Direct match in aliases
        if (CATEGORY_ALIASES[cleaned]) {
            return CATEGORY_ALIASES[cleaned];
        }

        // 2. Direct match in categoriesMeta
        for (const cat of categoriesMeta) {
            if (cat.name.toLowerCase() === cleaned || slugify(cat.name) === cleaned) {
                return cat.name;
            }
        }

        // 3. Substring matching
        for (const cat of categoriesMeta) {
            const lowerCat = cat.name.toLowerCase();
            if (lowerCat.includes(cleaned) || cleaned.includes(lowerCat)) {
                return cat.name;
            }
        }

        return 'Gates';
    }

    function updateBrowserUrl(urlPath, replace = false) {
        if (!window.history) return;
        try {
            if (replace) {
                window.history.replaceState({ atgState: state }, '', urlPath);
            } else {
                window.history.pushState({ atgState: state }, '', urlPath);
            }
        } catch (err) {
            console.warn('[ATG] Could not update browser history state:', err);
        }
    }

    
    /* ==========================================================================
       SCROLL DOWN BUTTON (FOR SHOWROOM & ALL DESIGNS)
       ========================================================================== */

    function initScrollDownAffordance() {
        const btn = document.getElementById('catalogueScrollDownBtn');
        if (!btn) return;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToCatalogueTop();
        });

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY || window.pageYOffset;
            if (scrollY > 1400) {
                btn.classList.add('is-scrolled-past');
            } else {
                btn.classList.remove('is-scrolled-past');
            }
        }, { passive: true });
    }

    function updateScrollDownButton() {
        const btn = document.getElementById('catalogueScrollDownBtn');
        if (!btn) return;
        const shouldShow = (state.mode === 'overview' || state.mode === 'all');
        btn.classList.toggle('is-visible', shouldShow);

        const textSpan = btn.querySelector('.scroll-btn-text');
        if (textSpan) {
            textSpan.textContent = (state.mode === 'all') ? 'Scroll to All Designs' : 'Scroll to Showroom';
        }
    }

    function scrollToCatalogueTop() {
        const target = document.getElementById('catalogue-explorer');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /* ==========================================================================
       UTILITY HELPERS
       ========================================================================== */

    function getSearchableText(item) {
        const name = item.name || '';
        const cat = item.category || '';
        const dept = item.department || '';
        const desc = item.description || '';
        const mat = item.materials || '';
        const fin = item.finish || '';
        const dim = item.dimensions || '';
        const cust = item.customisation || '';
        const tags = Array.isArray(item.styleTags) ? item.styleTags.join(' ') : '';
        const kw = Array.isArray(item.keywords) ? item.keywords.join(' ') : '';

        return `${name} ${cat} ${dept} ${desc} ${mat} ${fin} ${dim} ${cust} ${tags} ${kw}`.toLowerCase();
    }

    function sortDesignsList(items, criterion) {
        const list = [...items];

        switch (criterion) {
            case 'name-asc':
                return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

            case 'name-desc':
                return list.sort((a, b) => (b.name || '').localeCompare(a.name || ''));

            case 'price-asc':
                return list.sort((a, b) => {
                    const priceA = (a.price !== null && a.price !== undefined) ? Number(a.price) : Infinity;
                    const priceB = (b.price !== null && b.price !== undefined) ? Number(b.price) : Infinity;
                    return priceA - priceB;
                });

            case 'price-desc':
                return list.sort((a, b) => {
                    const priceA = (a.price !== null && a.price !== undefined) ? Number(a.price) : -1;
                    const priceB = (b.price !== null && b.price !== undefined) ? Number(b.price) : -1;
                    return priceB - priceA;
                });

            case 'featured':
            default:
                return list.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return 0;
                });
        }
    }

    function slugify(text) {
        return (text || '')
            .toString()
            .toLowerCase()
            .trim()
            .replace(/&/g, 'and')
            .replace(/[\s\W-]+/g, '-');
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function escapeAttr(str) {
        if (!str) return '';
        return String(str).replace(/"/g, '&quot;');
    }
});
