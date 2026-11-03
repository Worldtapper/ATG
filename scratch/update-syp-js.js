const fs = require('fs');

let js = fs.readFileSync('JS/start-your-project.js', 'utf8');

// Target the renderDesignsGrid function
const startIdx = js.indexOf('// Helper: Render the grid based on current filters');
const endIdx = js.indexOf('// Toggle design selection in the active enquiry');

if (startIdx === -1 || endIdx === -1) {
    console.error('ERROR: Could not find target boundaries');
    process.exit(1);
}

const replacement = `// Helper: Render the grid based on current filters (Organized by Category Sections & Compact Cards)
        function createCompactCardMarkup(design) {
            const isSelected = state.selectedDesignIds.includes(design.id);
            return \`
                <div class="syp-design-card \${isSelected ? 'is-selected' : ''}" data-design-id="\${escapeHtml(design.id)}" role="button" tabindex="0" aria-pressed="\${isSelected ? 'true' : 'false'}">
                    <div class="syp-design-thumb-wrap">
                        <img src="\${escapeHtml(design.image)}" alt="\${escapeHtml(design.name)}" class="syp-design-thumb" loading="lazy">
                        <div class="syp-design-check-badge">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        \${design.priceEstimate ? \`<span class="syp-design-price-tag">\${escapeHtml(design.priceEstimate)}</span>\` : ''}
                    </div>
                    <div class="syp-design-meta">
                        <div class="syp-design-meta-text">
                            <span class="syp-design-cat">\${escapeHtml(design.category)}</span>
                            <h4 class="syp-design-name">\${escapeHtml(design.name)}</h4>
                        </div>
                        <button type="button" class="syp-design-card-btn">
                            \${isSelected ? '✓ Selected' : '+ Select Design'}
                        </button>
                    </div>
                </div>
            \`;
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
                    designsGrid.innerHTML = \`
                        <div class="syp-search-empty-state">
                            <p class="syp-search-empty-title">No designs match "\${escapeHtml(state.searchQuery)}"</p>
                            <span class="syp-search-empty-hint">Try adjusting your keyword or clear the search to browse all categories.</span>
                        </div>
                    \`;
                    return;
                }

                designsGrid.innerHTML = \`
                    <div class="syp-search-results-bar">
                        <span>Showing <strong>\${pool.length}</strong> matching designs for "\${escapeHtml(state.searchQuery)}"</span>
                    </div>
                    <div class="syp-designs-section-grid">
                        \${pool.map(createCompactCardMarkup).join('')}
                    </div>
                \`;
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

                designsGrid.innerHTML = \`
                    <div class="syp-single-cat-header">
                        <button type="button" class="syp-cat-view-back-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                            <span>Back to All Disciplines</span>
                        </button>
                        <div class="syp-single-cat-info">
                            <h3 class="syp-single-cat-title">\${escapeHtml(state.activeCategoryFilter)}</h3>
                            <span class="syp-single-cat-count">\${filtered.length} Curated Designs Available</span>
                        </div>
                    </div>
                    <div class="syp-designs-section-grid">
                        \${filtered.map(createCompactCardMarkup).join('')}
                    </div>
                \`;
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
                sectionsHtml += \`
                    <div class="syp-category-section" data-cat="\${escapeHtml(catName)}">
                        <div class="syp-cat-section-header">
                            <div class="syp-cat-section-title-wrap">
                                <h3 class="syp-cat-section-title">\${escapeHtml(catName)}</h3>
                                <span class="syp-cat-section-count">\${catItems.length} Designs</span>
                            </div>
                            <button type="button" class="syp-cat-section-view-btn" data-view-cat="\${escapeHtml(catName)}">
                                <span>Browse All \${catItems.length} in \${escapeHtml(catName)}</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </button>
                        </div>
                        <div class="syp-designs-section-grid">
                            \${previewItems.map(createCompactCardMarkup).join('')}
                        </div>
                    </div>
                \`;
            }

            designsGrid.innerHTML = sectionsHtml;
            attachCardListeners();
        }
    }

    `;

js = js.slice(0, startIdx) + replacement + js.slice(endIdx);
fs.writeFileSync('JS/start-your-project.js', js, 'utf8');
console.log('SUCCESS: Updated renderDesignsGrid in JS/start-your-project.js');

