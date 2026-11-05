/**
 * ATG Metal Works & Interiors — Gallery Portfolio Controller
 * Vanilla JavaScript Engine for Editorial Architectural Portfolio,
 * Dynamic Multi-Category Filtering, Deep-linking, and Project Detail Modal.
 */

(function () {
    'use strict';

    // State
    const state = {
        activeCategory: 'all',
        activeProjectId: null,
        projects: window.ATG_GALLERY_PROJECTS || []
    };

    let modalElement = null;
    let lastActiveTrigger = null;

    document.addEventListener('DOMContentLoaded', initGallery);

    function initGallery() {
        if (!state.projects || state.projects.length === 0) {
            console.warn('[ATG Gallery] No gallery projects loaded.');
            return;
        }

        // Cache DOM elements
        const gridContainer = document.getElementById('galleryGrid');
        const countBadge = document.getElementById('galleryTotalCount');
        const emptyState = document.getElementById('galleryEmptyState');
        const heroExploreBtn = document.getElementById('heroExploreBtn');

        // Initialise URL Parameters
        parseInitialUrl();

        // Calculate and Render Category Badges
        initCategoryFilterUI();

        // Render Initial Grid
        renderProjectsGrid();

        // Bind Category Tab Clicks
        bindCategoryTabs();

        // Ensure Project Modal DOM is ready
        ensureProjectModalDOM();

        // Check if direct project modal was requested in URL
        checkDirectProjectModal();

        // Hero Smooth Scroll
        if (heroExploreBtn) {
            heroExploreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById('galleryExplore');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    }

    /* ==========================================================================
       1. URL PARAMETER SYNCHRONIZATION
       ========================================================================== */
    function parseInitialUrl() {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has('category')) {
            const cat = urlParams.get('category').trim();
            if (isValidCategory(cat)) {
                state.activeCategory = cat;
            }
        }
    }

    function syncUrl() {
        if (!window.history || !window.history.replaceState) return;

        const params = new URLSearchParams();
        if (state.activeCategory !== 'all') {
            params.set('category', state.activeCategory);
        }
        if (state.activeProjectId) {
            params.set('project', state.activeProjectId);
        }

        const queryString = params.toString();
        const newUrl = window.location.pathname + (queryString ? '?' + queryString : '');
        window.history.replaceState({ atgGalleryState: state }, '', newUrl);
    }

    function isValidCategory(catName) {
        if (!catName || catName.toLowerCase() === 'all') return true;
        const valid = [
            'metal fabrication',
            'interior projects',
            'furniture & joinery',
            'commercial projects',
            'residential projects'
        ];
        return valid.includes(catName.toLowerCase());
    }

    /* ==========================================================================
       2. CATEGORY FILTER TABS & COUNT BADGES
       ========================================================================== */
    function initCategoryFilterUI() {
        const counts = {
            all: state.projects.length,
            'metal fabrication': 0,
            'interior projects': 0,
            'furniture & joinery': 0,
            'commercial projects': 0,
            'residential projects': 0
        };

        state.projects.forEach(p => {
            if (Array.isArray(p.categories)) {
                p.categories.forEach(c => {
                    const low = c.toLowerCase();
                    if (counts[low] !== undefined) {
                        counts[low]++;
                    }
                });
            }
        });

        // Update count badges inside category tabs
        document.querySelectorAll('.gallery-tab-btn').forEach(btn => {
            const cat = btn.getAttribute('data-category') || 'all';
            const countSpan = btn.querySelector('.tab-count');
            const low = cat.toLowerCase();

            if (countSpan && counts[low] !== undefined) {
                countSpan.textContent = counts[low];
            }

            // Sync active state
            const isMatch = low === state.activeCategory.toLowerCase();
            btn.classList.toggle('is-active', isMatch);
            btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });
    }

    function bindCategoryTabs() {
        const tabs = document.querySelectorAll('.gallery-tab-btn');
        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                const cat = btn.getAttribute('data-category') || 'all';

                tabs.forEach(t => {
                    t.classList.remove('is-active');
                    t.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('is-active');
                btn.setAttribute('aria-selected', 'true');

                state.activeCategory = cat;
                renderProjectsGrid();
                syncUrl();

                // Scroll tab into view if overflowing on mobile
                btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            });
        });
    }

    /* ==========================================================================
       3. EDITORIAL PROJECT GRID RENDERING
       ========================================================================== */
    function renderProjectsGrid() {
        const gridContainer = document.getElementById('galleryGrid');
        const emptyState = document.getElementById('galleryEmptyState');
        const activeCountEl = document.getElementById('galleryActiveCount');
        const catTitleEl = document.getElementById('galleryCurrentCatTitle');

        if (!gridContainer) return;

        // Filter projects
        let filtered = state.projects;
        if (state.activeCategory !== 'all') {
            const target = state.activeCategory.toLowerCase();
            filtered = state.projects.filter(p => {
                return Array.isArray(p.categories) && p.categories.some(c => c.toLowerCase() === target);
            });
        }

        // Update Count
        if (activeCountEl) {
            activeCountEl.textContent = `${filtered.length} Curated Project${filtered.length === 1 ? '' : 's'}`;
        }
        if (catTitleEl) {
            catTitleEl.textContent = state.activeCategory === 'all' ? 'All Portfolio Works' : state.activeCategory;
        }

        // Empty state check
        if (filtered.length === 0) {
            gridContainer.innerHTML = '';
            gridContainer.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        gridContainer.style.display = 'grid';

        // Render Cards with editorial asymmetrical layout classes
        gridContainer.innerHTML = filtered.map((project, idx) => {
            return createProjectCardMarkup(project, idx);
        }).join('');

        // Delegate clicks on project cards
        bindProjectCardEvents(gridContainer);
    }

    function createProjectCardMarkup(project, index) {
        const aspectClass = project.aspect ? `item--${project.aspect}` : 'item--standard';
        const primaryCat = Array.isArray(project.categories) && project.categories.length > 0
            ? project.categories[0]
            : 'Architectural';

        const categoryPills = Array.isArray(project.categories)
            ? project.categories.map(c => `<span class="proj-badge-pill">${escapeHtml(c)}</span>`).join('')
            : '';

        return `
            <article class="gallery-project-card ${aspectClass}" data-project-id="${escapeHtml(project.id)}" tabindex="0" role="button" aria-label="View project details: ${escapeHtml(project.title)}">
                <div class="card-media-shell">
                    <img 
                        src="${escapeHtml(project.image)}" 
                        alt="${escapeHtml(project.title)}" 
                        class="card-project-img" 
                        loading="lazy"
                        onerror="this.onerror=null; this.src='images/dropdown_portfolio.png';"
                    >
                    <div class="card-editorial-scrim"></div>

                    ${project.video ? `
                        <div class="card-motion-indicator" title="Includes workshop motion progression">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            <span>Motion</span>
                        </div>
                    ` : ''}

                    <div class="card-top-badges">
                        <div class="badges-wrap">
                            ${categoryPills}
                        </div>
                        <span class="location-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            ${escapeHtml(project.location)}
                        </span>
                    </div>

                    <div class="card-editorial-meta">
                        <div class="meta-headline-row">
                            <span class="meta-sector">${escapeHtml(project.sector || 'ATG Bespoke Works')}</span>
                            <span class="meta-ref">${escapeHtml(project.id.toUpperCase())}</span>
                        </div>
                        <h3 class="meta-project-title">${escapeHtml(project.title)}</h3>
                        <p class="meta-project-desc">${escapeHtml(truncate(project.overview, 110))}</p>

                        <div class="meta-action-row">
                            <button type="button" class="view-project-btn" data-action="view-details" data-project-id="${escapeHtml(project.id)}" aria-label="View details for ${escapeHtml(project.title)}">
                                View Details
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    function bindProjectCardEvents(container) {
        container.querySelectorAll('.gallery-project-card').forEach(card => {
            const id = card.getAttribute('data-project-id');

            // Click
            card.addEventListener('click', (e) => {
                e.preventDefault();
                openProjectDetailModal(id, card);
            });

            // Keyboard Enter / Space
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openProjectDetailModal(id, card);
                }
            });
        });
    }

    /* ==========================================================================
       4. INTERACTIVE PROJECT DETAIL MODAL
       ========================================================================== */
    function ensureProjectModalDOM() {
        if (document.getElementById('atgProjectDetailModal')) {
            modalElement = document.getElementById('atgProjectDetailModal');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'atg-project-modal-backdrop';
        modal.id = 'atgProjectDetailModal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('aria-labelledby', 'prjModalTitle');

        modal.innerHTML = `
            <div class="atg-project-modal-container" id="prjModalContainer" tabIndex="-1">
                <button type="button" class="atg-modal-close-btn" id="prjModalCloseBtn" aria-label="Close project modal">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div class="prj-modal-scrollable">
                    <!-- Modal Hero Banner -->
                    <div class="prj-modal-hero">
                        <img id="prjModalHeroImg" src="" alt="Project view" class="prj-modal-hero-img">
                        <div class="prj-modal-hero-overlay"></div>
                        <div class="prj-modal-hero-badges">
                            <span class="prj-hero-sector" id="prjModalSector">Sector</span>
                            <span class="prj-hero-location" id="prjModalLocation">Location</span>
                        </div>
                    </div>

                    <!-- Modal Body Grid -->
                    <div class="prj-modal-body-grid">
                        <!-- Main Left Column -->
                        <div class="prj-modal-main-col">
                            <div class="prj-modal-header">
                                <div class="prj-ref-row">
                                    <span class="prj-modal-ref" id="prjModalRef">REF: ATG-PRJ-00</span>
                                    <div class="prj-categories-wrap" id="prjModalCategoriesWrap"></div>
                                </div>
                                <h2 class="prj-modal-title" id="prjModalTitle">Project Title</h2>
                                <p class="prj-modal-subtitle" id="prjModalSubtitle">Architectural Subtitle</p>
                            </div>

                            <div class="prj-modal-section">
                                <h4 class="prj-section-title">Architectural Scope &amp; Brief</h4>
                                <p class="prj-modal-overview" id="prjModalOverview"></p>
                            </div>

                            <!-- Additional Gallery Media Strip -->
                            <div class="prj-modal-section" id="prjModalGallerySection">
                                <h4 class="prj-section-title">Project Perspectives &amp; Execution Photos</h4>
                                <div class="prj-modal-gallery-strip" id="prjModalGalleryStrip"></div>
                            </div>

                            <!-- Execution & Engineering Notes -->
                            <div class="prj-modal-section">
                                <h4 class="prj-section-title">Precision Engineering &amp; Execution Highlights</h4>
                                <ul class="prj-details-list" id="prjModalDetailsList"></ul>
                            </div>
                        </div>

                        <!-- Sidebar Right Column: Specifications & CTA -->
                        <div class="prj-modal-side-col">
                            <div class="prj-specs-card">
                                <h4 class="prj-specs-title">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                    Technical Specifications
                                </h4>
                                <div class="prj-spec-item">
                                    <span class="prj-spec-label">Structural Materials</span>
                                    <span class="prj-spec-val" id="prjModalMaterials"></span>
                                </div>
                                <div class="prj-spec-item">
                                    <span class="prj-spec-label">Architectural Finish</span>
                                    <span class="prj-spec-val" id="prjModalFinish"></span>
                                </div>
                                <div class="prj-spec-item">
                                    <span class="prj-spec-label">Project Execution</span>
                                    <span class="prj-spec-val">Turnkey Workshop Fabrication &amp; Site Erection by ATG</span>
                                </div>
                                <div class="prj-spec-item">
                                    <span class="prj-spec-label">Engineering Standards</span>
                                    <span class="prj-spec-val">Full CAD Shop Drawings &bull; Certified Weld Tolerances</span>
                                </div>
                            </div>

                            <!-- Start Your Project CTA Card -->
                            <div class="prj-cta-card">
                                <h5>Bring This Standard to Your Space</h5>
                                <p>Initiate a technical consultation, site survey, or blueprint takeoff inspired by this project.</p>
                                <a href="#" class="btn btn-primary full-width" id="prjModalStartBtn">
                                    Start Project with This Reference
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </a>
                                <a href="#" target="_blank" rel="noopener" class="btn modal-whatsapp-btn full-width" id="prjModalWhatsAppBtn">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                                    Direct WhatsApp Inquiry
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Related Projects Footer Section -->
                    <div class="prj-modal-related" id="prjModalRelatedSection">
                        <h4 class="prj-related-title">Related Completed Projects</h4>
                        <div class="prj-related-grid" id="prjModalRelatedGrid"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modalElement = modal;

        bindModalEvents();
    }

    function bindModalEvents() {
        if (!modalElement) return;

        const closeBtn = document.getElementById('prjModalCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeProjectDetailModal);
        }

        // Close on backdrop click (outside container)
        modalElement.addEventListener('click', (e) => {
            if (e.target === modalElement) {
                closeProjectDetailModal();
            }
        });

        // Close on Escape & trap focus
        document.addEventListener('keydown', (e) => {
            if (!modalElement.classList.contains('is-open')) return;

            if (e.key === 'Escape') {
                e.preventDefault();
                closeProjectDetailModal();
                return;
            }

            // Tab trap
            if (e.key === 'Tab') {
                const focusable = modalElement.querySelectorAll(
                    'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusable.length === 0) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        });
    }

    function openProjectDetailModal(projectId, triggerEl = null) {
        ensureProjectModalDOM();

        const project = window.getATGProjectById ? window.getATGProjectById(projectId) : null;
        if (!project) {
            console.warn('[ATG Gallery] Project not found for ID:', projectId);
            return;
        }

        lastActiveTrigger = triggerEl || document.activeElement;
        state.activeProjectId = project.id;
        syncUrl();

        // Populate modal fields
        const heroImg = document.getElementById('prjModalHeroImg');
        const sectorEl = document.getElementById('prjModalSector');
        const locationEl = document.getElementById('prjModalLocation');
        const refEl = document.getElementById('prjModalRef');
        const categoriesWrap = document.getElementById('prjModalCategoriesWrap');
        const titleEl = document.getElementById('prjModalTitle');
        const subtitleEl = document.getElementById('prjModalSubtitle');
        const overviewEl = document.getElementById('prjModalOverview');
        const galleryStrip = document.getElementById('prjModalGalleryStrip');
        const detailsList = document.getElementById('prjModalDetailsList');
        const materialsEl = document.getElementById('prjModalMaterials');
        const finishEl = document.getElementById('prjModalFinish');
        const startBtn = document.getElementById('prjModalStartBtn');
        const whatsAppBtn = document.getElementById('prjModalWhatsAppBtn');
        const relatedGrid = document.getElementById('prjModalRelatedGrid');

        if (heroImg) {
            heroImg.src = project.image;
            heroImg.alt = project.title;
        }
        if (sectorEl) sectorEl.textContent = project.sector || 'ATG Bespoke Works';
        if (locationEl) locationEl.textContent = project.location || 'Nigeria';
        if (refEl) refEl.textContent = `REF: ${project.id.toUpperCase()}`;
        if (titleEl) titleEl.textContent = project.title;
        if (subtitleEl) subtitleEl.textContent = project.subtitle || project.sector || '';
        if (overviewEl) overviewEl.textContent = project.overview || '';
        if (materialsEl) materialsEl.textContent = project.materials || 'High-tensile structural specification';
        if (finishEl) finishEl.textContent = project.finish || 'Custom architectural multi-stage finish';

        // Category Badges
        if (categoriesWrap) {
            categoriesWrap.innerHTML = '';
            if (Array.isArray(project.categories)) {
                project.categories.forEach(c => {
                    const span = document.createElement('span');
                    span.className = 'prj-cat-pill';
                    span.textContent = c;
                    categoriesWrap.appendChild(span);
                });
            }
        }

        // Additional Image Gallery
        if (galleryStrip) {
            galleryStrip.innerHTML = '';
            const allImages = Array.isArray(project.gallery) && project.gallery.length > 0
                ? project.gallery
                : [project.image];

            allImages.forEach((imgSrc, idx) => {
                const thumb = document.createElement('button');
                thumb.type = 'button';
                thumb.className = `prj-thumb-item ${idx === 0 ? 'is-active' : ''}`;
                thumb.setAttribute('aria-label', `View perspective ${idx + 1}`);
                thumb.innerHTML = `<img src="${imgSrc}" alt="Perspective ${idx + 1}" onerror="this.src='images/dropdown_portfolio.png'">`;

                thumb.addEventListener('click', () => {
                    galleryStrip.querySelectorAll('.prj-thumb-item').forEach(b => b.classList.remove('is-active'));
                    thumb.classList.add('is-active');
                    if (heroImg) {
                        heroImg.style.opacity = '0.35';
                        setTimeout(() => {
                            heroImg.src = imgSrc;
                            heroImg.style.opacity = '1';
                        }, 120);
                    }
                });

                galleryStrip.appendChild(thumb);
            });
        }

        // Execution Details Bullet List
        if (detailsList) {
            detailsList.innerHTML = '';
            if (Array.isArray(project.details) && project.details.length > 0) {
                project.details.forEach(itemText => {
                    const li = document.createElement('li');
                    li.innerHTML = `<span class="detail-bullet">&#x2713;</span><div>${escapeHtml(itemText)}</div>`;
                    detailsList.appendChild(li);
                });
            } else {
                detailsList.innerHTML = `<li><span class="detail-bullet">&#x2713;</span><div>Fully customized fabrication to architectural specifications.</div></li>`;
            }
        }

        // Start Your Project Pre-selection CTA Link
        if (startBtn) {
            startBtn.href = `start-your-project.html?project=${encodeURIComponent(project.id)}`;
        }

        // WhatsApp Direct Link
        if (whatsAppBtn) {
            const waMsg = encodeURIComponent(
                `Hello ATG Metal Works & Interiors,

I am consulting regarding the completed gallery project:
*${project.title}*
Ref Code: ${project.id.toUpperCase()}
Location: ${project.location}

Please share availability for an architectural consultation and site review.`
            );
            whatsAppBtn.href = `https://wa.me/2348023358828?text=${waMsg}`;
        }

        // Related Projects
        if (relatedGrid) {
            relatedGrid.innerHTML = '';
            if (Array.isArray(project.related) && project.related.length > 0) {
                project.related.forEach(relId => {
                    const relProject = window.getATGProjectById ? window.getATGProjectById(relId) : null;
                    if (relProject) {
                        const item = document.createElement('div');
                        item.className = 'prj-related-card';
                        item.innerHTML = `
                            <div class="related-img-wrap">
                                <img src="${escapeHtml(relProject.image)}" alt="${escapeHtml(relProject.title)}" loading="lazy">
                            </div>
                            <div class="related-meta">
                                <span class="related-cat">${escapeHtml(relProject.categories[0] || 'ATG Work')}</span>
                                <h5 class="related-title">${escapeHtml(relProject.title)}</h5>
                            </div>
                        `;
                        item.addEventListener('click', () => {
                            openProjectDetailModal(relProject.id);
                            const modalScrollable = document.querySelector('.prj-modal-scrollable');
                            if (modalScrollable) modalScrollable.scrollTop = 0;
                        });
                        relatedGrid.appendChild(item);
                    }
                });
            }
        }

        // Open modal & lock background scroll
        document.body.style.overflow = 'hidden';
        modalElement.classList.add('is-open');
        modalElement.setAttribute('aria-hidden', 'false');

        // Scroll modal to top
        const scrollBox = modalElement.querySelector('.prj-modal-scrollable');
        if (scrollBox) scrollBox.scrollTop = 0;

        // Focus close button
        setTimeout(() => {
            const closeBtn = document.getElementById('prjModalCloseBtn');
            if (closeBtn) closeBtn.focus();
        }, 80);
    }

    function closeProjectDetailModal() {
        if (!modalElement || !modalElement.classList.contains('is-open')) return;

        modalElement.classList.remove('is-open');
        modalElement.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        state.activeProjectId = null;
        syncUrl();

        if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
            lastActiveTrigger.focus();
        }
    }

    function checkDirectProjectModal() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('project')) {
            const prjId = urlParams.get('project').trim();
            if (prjId) {
                setTimeout(() => {
                    openProjectDetailModal(prjId);
                }, 150);
            }
        }
    }

    /* ==========================================================================
       UTILITIES
       ========================================================================== */
    function truncate(str, max) {
        if (!str) return '';
        if (str.length <= max) return str;
        return str.substring(0, max).trim() + '...';
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Expose Global API
    window.ATG_GALLERY = {
        openProject: openProjectDetailModal,
        closeProject: closeProjectDetailModal,
        setCategory: function (cat) {
            state.activeCategory = cat;
            initCategoryFilterUI();
            renderProjectsGrid();
            syncUrl();
        }
    };
})();
