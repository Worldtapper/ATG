/**
 * ATG Metal Works & Interiors — Interiors Division Controller
 * Architecture: Horizontal Category Slider + Single Dynamic Collection
 * Features:
 *  - Filtering strictly to Interiors categories (Furniture, Cabinetry, Retail & Custom Interior Solutions)
 *  - Horizontal category slider with smooth scrolling, track dragging & arrow controls
 *  - Single dynamic cards grid with smooth fade transitions
 *  - Original ATG card styling with prices completely omitted
 *  - Heart favourite icon on card hover (and accessible on touch/mobile)
 *  - Full integration with window.ATGFavourites
 *  - View Details modal with comprehensive interior specs (no prices)
 *  - URL query synchronization (?category=...&design=...)
 */

(function () {
    'use strict';

    // Interiors category definitions in priority order
    const INTERIOR_CATEGORY_KEYS = [
        'Chairs',
        'Tables',
        'Custom Furniture',
        'Shelves & Storage',
        'Boutique Garment Racks & Retail Displays',
        'Kitchen Cabinets',
        'Wardrobes',
        'Interior Solutions'
    ];

    // Representative thumbnail fallbacks for the slider items
    const CATEGORY_THUMBNAILS = {
        'Chairs': 'images/chair-armchair-01.jpg',
        'Tables': 'images/table-boardroom-minimalist.jpg',
        'Custom Furniture': 'images/furniture-bar-cart-brass.jpg',
        'Shelves & Storage': 'images/shelf-display-books-ceramics.jpg',
        'Boutique Garment Racks & Retail Displays': 'images/rack-boutique-freestanding.jpg',
        'Kitchen Cabinets': 'images/kitchen-cabinet-01.jpg',
        'Wardrobes': 'images/wardrobe-bespoke-dressing.jpg',
        'Interior Solutions': 'images/interior-modern-fireplace.jpg'
    };

    // State
    let currentCategory = 'Chairs';
    let isTransitioning = false;
    let modalActiveDesignId = null;

    // DOM Elements
    let sliderTrack = null;
    let btnPrev = null;
    let btnNext = null;
    let collectionHeader = null;
    let collectionTitle = null;
    let collectionDesc = null;
    let collectionCount = null;
    let cardsGrid = null;
    let modalBackdrop = null;
    let modalContainer = null;
    let modalCloseBtn = null;

    /* ==========================================================================
       DATA HELPERS
       ========================================================================== */

    /**
     * Get all categories belonging to Interiors
     */
    function getInteriorCategories() {
        if (!window.ATG_CATEGORIES || !Array.isArray(window.ATG_CATEGORIES)) {
            return [];
        }
        return window.ATG_CATEGORIES.filter(cat => 
            INTERIOR_CATEGORY_KEYS.includes(cat.name) ||
            (cat.department !== 'Architectural Metalwork' && cat.department !== undefined)
        );
    }

    /**
     * Get category object by name
     */
    function getCategoryInfo(name) {
        const cats = getInteriorCategories();
        return cats.find(c => c.name.toLowerCase() === name.toLowerCase()) || {
            name: name,
            headline: `${name} Solutions`,
            desc: `Luxury contemporary ${name.toLowerCase()} crafted to exceptional interior standards.`
        };
    }

    /**
     * Get designs for a specific Interiors category
     */
    function getDesignsForCategory(catName) {
        if (!window.ATG_CATALOGUE_DATA || !Array.isArray(window.ATG_CATALOGUE_DATA)) {
            return [];
        }
        return window.ATG_CATALOGUE_DATA.filter(design => 
            INTERIOR_CATEGORY_KEYS.includes(design.category) &&
            design.category.toLowerCase() === catName.toLowerCase()
        );
    }

    /**
     * Get single design by ID
     */
    function getDesignById(id) {
        if (!window.ATG_CATALOGUE_DATA || !Array.isArray(window.ATG_CATALOGUE_DATA)) {
            return null;
        }
        return window.ATG_CATALOGUE_DATA.find(d => d.id === id) || null;
    }

    /**
     * Escape HTML string
     */
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Escape attribute string
     */
    function escapeAttr(str) {
        if (!str) return '';
        return String(str).replace(/"/g, '&quot;');
    }

    /* ==========================================================================
       CATEGORY SLIDER CONTROLLER
       ========================================================================== */

    function initCategorySlider() {
        if (!sliderTrack) return;

        const categories = getInteriorCategories();
        if (categories.length === 0) return;

        // Render slider items
        sliderTrack.innerHTML = categories.map(cat => {
            const designs = getDesignsForCategory(cat.name);
            const count = designs.length;
            const thumbImg = (designs.length > 0 && designs[0].image) 
                ? designs[0].image 
                : (CATEGORY_THUMBNAILS[cat.name] || 'images/dropdown_portfolio.png');
            const isActive = cat.name.toLowerCase() === currentCategory.toLowerCase();

            return `
                <button 
                    type="button" 
                    class="int-cat-item ${isActive ? 'is-active' : ''}" 
                    data-category="${escapeAttr(cat.name)}"
                    aria-selected="${isActive ? 'true' : 'false'}"
                    role="tab"
                >
                    <div class="int-cat-thumb">
                        <img 
                            src="${thumbImg}" 
                            alt="${escapeAttr(cat.name)}" 
                            class="int-cat-img" 
                            loading="lazy"
                            onerror="this.onerror=null; this.src='images/dropdown_portfolio.png';"
                        >
                    </div>
                    <div class="int-cat-meta">
                        <span class="int-cat-name">${escapeHtml(cat.name)}</span>
                        <span class="int-cat-count">${count} Designs</span>
                    </div>
                </button>
            `;
        }).join('');

        // Attach item click handlers
        sliderTrack.querySelectorAll('.int-cat-item').forEach(btn => {
            btn.addEventListener('click', function () {
                const catName = this.getAttribute('data-category');
                if (catName && catName.toLowerCase() !== currentCategory.toLowerCase()) {
                    selectCategory(catName);
                }
            });
        });

        // Prev / Next button listeners
        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                sliderTrack.scrollBy({ left: -280, behavior: 'smooth' });
            });
        }

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                sliderTrack.scrollBy({ left: 280, behavior: 'smooth' });
            });
        }

        // Enable Drag to Scroll on desktop
        initSliderDrag(sliderTrack);
    }

    function initSliderDrag(slider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('is-dragging');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('is-dragging');
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('is-dragging');
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 1.5;
            slider.scrollLeft = scrollLeft - walk;
        });
    }

    /**
     * Select and activate a category
     */
    function selectCategory(catName, shouldScrollTrack = true) {
        if (isTransitioning) return;
        isTransitioning = true;

        currentCategory = catName;

        // Update Slider UI active state
        if (sliderTrack) {
            const items = sliderTrack.querySelectorAll('.int-cat-item');
            items.forEach(item => {
                const isMatch = item.getAttribute('data-category').toLowerCase() === catName.toLowerCase();
                item.classList.toggle('is-active', isMatch);
                item.setAttribute('aria-selected', isMatch ? 'true' : 'false');

                if (isMatch && shouldScrollTrack) {
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            });
        }

        // Update URL query without page reload
        try {
            const url = new URL(window.location);
            url.searchParams.set('category', catName);
            window.history.replaceState({}, '', url);
        } catch (e) {}

        // Transition out existing cards
        if (cardsGrid) {
            cardsGrid.classList.add('is-animating-out');
            cardsGrid.classList.remove('is-animating-in');
        }

        setTimeout(() => {
            // Update Header Information
            updateCollectionHeader(catName);

            // Render new cards
            renderCollectionCards(catName);

            // Transition in new cards
            if (cardsGrid) {
                cardsGrid.classList.remove('is-animating-out');
                cardsGrid.classList.add('is-animating-in');
            }

            setTimeout(() => {
                isTransitioning = false;
            }, 300);
        }, 220);
    }

    /**
     * Update dynamic collection header
     */
    function updateCollectionHeader(catName) {
        const catInfo = getCategoryInfo(catName);
        const designs = getDesignsForCategory(catName);

        if (collectionTitle) {
            collectionTitle.textContent = catInfo.headline || `${catName} Collection`;
        }

        if (collectionDesc) {
            collectionDesc.textContent = catInfo.desc || `Curated contemporary ${catName.toLowerCase()} crafted with solid hardwoods, textured bouclé, and artisanal metals.`;
        }

        if (collectionCount) {
            collectionCount.textContent = `${designs.length} Designs`;
        }
    }

    /* ==========================================================================
       DYNAMIC CARDS RENDERING (PRICE STRICTLY OMITTED)
       ========================================================================== */

    function renderCollectionCards(catName) {
        if (!cardsGrid) return;

        const designs = getDesignsForCategory(catName);

        if (designs.length === 0) {
            cardsGrid.innerHTML = `
                <div class="int-empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <p style="font-size: 1.1rem; color: rgba(252, 231, 204, 0.7); margin-bottom: 16px;">
                        No interior designs found in this category.
                    </p>
                    <a href="start-your-project.html" class="btn btn-primary">Start a Bespoke Project</a>
                </div>
            `;
            return;
        }

        const favs = (window.ATGFavourites && typeof window.ATGFavourites.getFavourites === 'function')
            ? window.ATGFavourites.getFavourites()
            : [];

        cardsGrid.innerHTML = designs.map(design => {
            const isFav = favs.includes(design.id);
            const primaryImage = design.image || 'images/dropdown_portfolio.png';

            // Feature / status badge
            let statusBadge = '';
            if (design.featured) {
                statusBadge = '<span class="card-featured-badge">Featured</span>';
            }

            return `
                <article class="atg-design-card" data-id="${design.id}" data-category="${escapeAttr(design.category)}">
                    <div class="card-media-wrapper">
                        <img 
                            src="${primaryImage}" 
                            alt="${escapeAttr(design.name)}" 
                            class="card-img" 
                            loading="lazy" 
                            onerror="this.onerror=null; this.src='images/dropdown_portfolio.png';"
                        >
                        <div class="card-badge-row">
                            <span class="card-category-badge">${escapeHtml(design.category)}</span>
                            ${statusBadge}
                        </div>

                        <button 
                            type="button" 
                            class="atg-fav-btn ${isFav ? 'is-active' : ''}" 
                            data-action="toggle-fav"
                            data-id="${design.id}" 
                            aria-label="${isFav ? 'Remove ' + escapeAttr(design.name) + ' from favourites' : 'Save ' + escapeAttr(design.name) + ' to favourites'}"
                            aria-pressed="${isFav ? 'true' : 'false'}"
                            title="${isFav ? 'Remove from favourites' : 'Save to favourites'}"
                        >
                            <svg class="heart-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                    </div>

                    <div class="card-body">
                        <h3 class="card-title">${escapeHtml(design.name)}</h3>
                        <p class="card-desc">${escapeHtml(design.description || '')}</p>

                        <div class="card-meta">
                            <div class="card-meta-item">
                                <span class="meta-label">Materials:</span>
                                <span class="meta-value">${escapeHtml(design.materials || 'Solid Hardwood &amp; Architectural Metal')}</span>
                            </div>
                            <div class="card-meta-item">
                                <span class="meta-label">Finish:</span>
                                <span class="meta-value">${escapeHtml(design.finish || 'Hand-Rubbed Natural Oil &amp; Satin Lacquer')}</span>
                            </div>
                        </div>

                        <!-- PRICING COMPLETELY OMITTED -->

                        <div class="card-actions-row">
                            <button 
                                type="button" 
                                class="card-btn btn-details" 
                                data-action="view-details" 
                                data-id="${design.id}"
                                aria-label="View details for ${escapeAttr(design.name)}"
                            >
                                View Details
                            </button>
                            <a 
                                href="start-your-project.html?design=${encodeURIComponent(design.id)}" 
                                class="card-btn btn-enquire"
                                data-id="${design.id}"
                                aria-label="Enquire about ${escapeAttr(design.name)}"
                            >
                                Enquire
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </a>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    }

    /* ==========================================================================
       VIEW DETAILS MODAL (PRICE STRICTLY OMITTED)
       ========================================================================== */

    function openDetailsModal(designId) {
        const design = getDesignById(designId);
        if (!design || !modalBackdrop) return;

        modalActiveDesignId = designId;

        // Populate Image
        const mainImg = modalBackdrop.querySelector('#modalMainImg');
        if (mainImg) {
            mainImg.src = design.image || 'images/dropdown_portfolio.png';
            mainImg.alt = design.name;
        }

        // Category & Department
        const catChip = modalBackdrop.querySelector('#modalCategoryChip');
        if (catChip) catChip.textContent = design.category || 'Interiors';

        const deptTag = modalBackdrop.querySelector('#modalDepartmentTag');
        if (deptTag) deptTag.textContent = design.department || 'Furniture & Interiors';

        // Title & Description
        const titleEl = modalBackdrop.querySelector('#modalDesignTitle');
        if (titleEl) titleEl.textContent = design.name;

        const descEl = modalBackdrop.querySelector('#modalDescription');
        if (descEl) descEl.textContent = design.description || '';

        // Specs Table
        const dimEl = modalBackdrop.querySelector('#modalDimensions');
        if (dimEl) dimEl.textContent = design.dimensions || 'Bespoke / Custom Proportioned to Interior Scheme';

        const matEl = modalBackdrop.querySelector('#modalMaterials');
        if (matEl) matEl.textContent = design.materials || 'Solid Oak, Marble, Architectural Alloys & Fine Textures';

        const finEl = modalBackdrop.querySelector('#modalFinish');
        if (finEl) finEl.textContent = design.finish || 'Hand-Finished Natural Seal, Satin Brass, or Matte Powder Coat';

        // Enquire Button Link
        const enquireBtn = modalBackdrop.querySelector('#modalEnquireBtn');
        if (enquireBtn) {
            enquireBtn.href = `start-your-project.html?design=${encodeURIComponent(design.id)}`;
        }

        // Modal Favourite Button State
        const modalFavBtn = modalBackdrop.querySelector('#modalFavBtn');
        if (modalFavBtn && window.ATGFavourites) {
            const isFav = window.ATGFavourites.isFavourite(design.id);
            modalFavBtn.classList.toggle('is-active', isFav);
            const favText = modalFavBtn.querySelector('.fav-btn-text');
            if (favText) favText.textContent = isFav ? 'Saved' : 'Save';
        }

        // Open Modal
        modalBackdrop.classList.add('is-open');
        document.body.style.overflow = 'hidden';

        // Update URL query string
        try {
            const url = new URL(window.location);
            url.searchParams.set('design', design.id);
            window.history.replaceState({}, '', url);
        } catch (e) {}
    }

    function closeDetailsModal() {
        if (!modalBackdrop) return;
        modalBackdrop.classList.remove('is-open');
        document.body.style.overflow = '';
        modalActiveDesignId = null;

        // Clean design param from URL
        try {
            const url = new URL(window.location);
            url.searchParams.delete('design');
            window.history.replaceState({}, '', url);
        } catch (e) {}
    }

    /* ==========================================================================
       FAVOURITES & EVENT DELEGATION
       ========================================================================== */

    function handleCardEvents(e) {
        // Toggle Favourite Heart Button
        const favBtn = e.target.closest('[data-action="toggle-fav"]');
        if (favBtn) {
            e.preventDefault();
            e.stopPropagation();
            const id = favBtn.getAttribute('data-id');
            if (id && window.ATGFavourites) {
                const newState = window.ATGFavourites.toggleFavourite(id);
                updateCardFavButtons(id, newState);
            }
            return;
        }

        // View Details Button
        const detailsBtn = e.target.closest('[data-action="view-details"]');
        if (detailsBtn) {
            e.preventDefault();
            const id = detailsBtn.getAttribute('data-id');
            if (id) {
                openDetailsModal(id);
            }
            return;
        }
    }

    function updateCardFavButtons(id, isFav) {
        const btns = document.querySelectorAll(`.atg-fav-btn[data-id="${id}"]`);
        btns.forEach(btn => {
            btn.classList.toggle('is-active', isFav);
            btn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
            btn.setAttribute('aria-label', isFav ? 'Remove from favourites' : 'Save to favourites');
        });

        // Also update modal favourite button if active design matches
        if (modalActiveDesignId === id && modalBackdrop) {
            const modalFavBtn = modalBackdrop.querySelector('#modalFavBtn');
            if (modalFavBtn) {
                modalFavBtn.classList.toggle('is-active', isFav);
                const favText = modalFavBtn.querySelector('.fav-btn-text');
                if (favText) favText.textContent = isFav ? 'Saved' : 'Save';
            }
        }
    }

    /* ==========================================================================
       INITIALIZATION
       ========================================================================== */

    function init() {
        // Cache DOM elements
        sliderTrack = document.getElementById('catSliderTrack');
        btnPrev = document.getElementById('catSliderPrev');
        btnNext = document.getElementById('catSliderNext');
        collectionHeader = document.getElementById('collectionHeader');
        collectionTitle = document.getElementById('collectionTitle');
        collectionDesc = document.getElementById('collectionDesc');
        collectionCount = document.getElementById('collectionCount');
        cardsGrid = document.getElementById('interiorCardsGrid');
        modalBackdrop = document.getElementById('atgDesignModal');
        modalContainer = document.getElementById('modalContainer');
        modalCloseBtn = document.getElementById('modalCloseBtn');

        // Check URL parameters
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const catParam = urlParams.get('category');
            if (catParam) {
                const found = INTERIOR_CATEGORY_KEYS.find(c => c.toLowerCase() === catParam.toLowerCase());
                if (found) {
                    currentCategory = found;
                }
            }
            const designParam = urlParams.get('design');
            if (designParam) {
                setTimeout(() => openDetailsModal(designParam), 350);
            }
        } catch (e) {}

        // Initialize Slider
        initCategorySlider();

        // Initial Collection Render
        updateCollectionHeader(currentCategory);
        renderCollectionCards(currentCategory);

        // Attach Card Grid Event Delegation
        if (cardsGrid) {
            cardsGrid.addEventListener('click', handleCardEvents);
        }

        // Attach Modal Listeners
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeDetailsModal);
        }

        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', (e) => {
                if (e.target === modalBackdrop) {
                    closeDetailsModal();
                }
            });
        }

        // Modal Favourite Button
        const modalFavBtn = document.getElementById('modalFavBtn');
        if (modalFavBtn) {
            modalFavBtn.addEventListener('click', () => {
                if (modalActiveDesignId && window.ATGFavourites) {
                    const newState = window.ATGFavourites.toggleFavourite(modalActiveDesignId);
                    updateCardFavButtons(modalActiveDesignId, newState);
                }
            });
        }

        // Modal Share Button
        const modalShareBtn = document.getElementById('modalShareBtn');
        if (modalShareBtn) {
            modalShareBtn.addEventListener('click', () => {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href).then(() => {
                        const shareText = modalShareBtn.querySelector('.share-btn-text');
                        if (shareText) {
                            const orig = shareText.textContent;
                            shareText.textContent = 'Copied!';
                            setTimeout(() => { shareText.textContent = orig; }, 2000);
                        }
                    });
                }
            });
        }

        // Global Keydown (Escape to close modal)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('is-open')) {
                closeDetailsModal();
            }
        });

        // Listen for global favourites updates from other components
        window.addEventListener('atg:favourites-updated', (e) => {
            if (e.detail && e.detail.id) {
                updateCardFavButtons(e.detail.id, e.detail.isFavourite);
            }
        });
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

