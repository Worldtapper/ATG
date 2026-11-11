/**
 * ATG Metal Works & Interiors — Gallery & Architectural Portfolio Engine
 * Clean, Luxury, Minimalist Portfolio Controller
 * 
 * Features:
 * - Simple 3-tier division filtering (All Projects, Metal Fabrication, Interiors)
 * - Focused curated project showcase (3 per division, easily fed from future backend API)
 * - Smooth fade-and-slide card transitions
 * - Interactive multi-photo lightbox modal with carousel navigation and thumbnail strip
 * - Keyboard navigation (Esc to close, Left/Right arrows for photos)
 * - Clean URL query synchronization (?division=...&project=...)
 * - Zero pricing leaks anywhere
 */

(function () {
    'use strict';

    // Application State
    const state = {
        activeDivision: 'all',    // 'all' | 'Metal Fabrication' | 'Interiors'
        currentProject: null,     // Currently active modal project object
        currentPhotoIndex: 0      // Currently displayed photo index in modal
    };

    // DOM Elements Cache
    let gridEl = null;
    let emptyEl = null;
    let filterButtons = [];
    let modalEl = null;
    let modalContainerEl = null;
    let modalCloseBtn = null;
    let modalViewerImg = null;
    let modalPrevBtn = null;
    let modalNextBtn = null;
    let modalCounterEl = null;
    let modalThumbsStrip = null;
    let modalBadgeEl = null;
    let modalTitleEl = null;
    let modalSubtitleEl = null;
    let modalOverviewEl = null;
    let modalLocationEl = null;
    let modalMaterialsEl = null;
    let modalFinishEl = null;
    let modalStatusEl = null;
    let modalNotesList = null;
    let modalActionBtn = null;

    /* ==========================================================================
       1. DATA ACCESS (BACKEND-READY)
       ========================================================================== */

    /**
     * Retrieve all projects from data source.
     * Ready for drop-in replacement with an async fetch('/api/projects') later.
     */
    function getAllProjects() {
        if (!window.ATG_GALLERY_PROJECTS || !Array.isArray(window.ATG_GALLERY_PROJECTS)) {
            return [];
        }
        return window.ATG_GALLERY_PROJECTS;
    }

    /**
     * Get curated projects (3 per division = 6 total for clean minimalist design).
     * If curated flags exist, use those; otherwise slice up to 3 per division.
     */
    function getCuratedProjects() {
        const all = getAllProjects();
        const flagged = all.filter(p => p.curated);
        if (flagged.length > 0) {
            return flagged;
        }

        // Fallback: take top 3 Metal Fabrication + top 3 Interiors
        const metal = all.filter(p => p.division && p.division.toLowerCase() === 'metal fabrication').slice(0, 3);
        const interiors = all.filter(p => p.division && p.division.toLowerCase() === 'interiors').slice(0, 3);
        return [...metal, ...interiors];
    }

    /**
     * Get project by ID (searches all projects so direct links work)
     */
    function getProjectById(id) {
        return getAllProjects().find(p => p.id === id) || null;
    }

    /**
     * Filter projects by active division ('all' | 'Metal Fabrication' | 'Interiors')
     */
    function getFilteredProjects() {
        const curated = getCuratedProjects();
        if (!state.activeDivision || state.activeDivision.toLowerCase() === 'all') {
            return curated;
        }
        return curated.filter(p => p.division && p.division.toLowerCase() === state.activeDivision.toLowerCase());
    }

    /* ==========================================================================
       2. STRING SANITIZATION HELPERS
       ========================================================================== */

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function escapeAttr(str) {
        if (!str) return '';
        return String(str).replace(/"/g, '&quot;');
    }

    /* ==========================================================================
       3. GRID RENDERING & FILTERING
       ========================================================================== */

    function renderGrid() {
        if (!gridEl) return;

        const projects = getFilteredProjects();

        if (projects.length === 0) {
            gridEl.innerHTML = '';
            if (emptyEl) emptyEl.style.display = 'block';
            return;
        }

        if (emptyEl) emptyEl.style.display = 'none';

        const html = projects.map(proj => {
            const photoCount = proj.gallery && Array.isArray(proj.gallery) ? proj.gallery.length : 1;
            const subtitlePart = proj.category ? escapeHtml(proj.category) : escapeHtml(proj.division);
            const locationPart = proj.location ? escapeHtml(proj.location) : 'Nigeria';

            return `
                <article class="project-card" data-id="${escapeAttr(proj.id)}" tabindex="0" role="button" aria-label="View ${escapeHtml(proj.title)} architectural details">
                    <div class="project-card-thumb">
                        <img 
                            src="${escapeAttr(proj.image)}" 
                            alt="${escapeHtml(proj.title)}" 
                            class="project-card-img" 
                            loading="lazy"
                        >
                        <span class="project-card-badge">${escapeHtml(proj.division)}</span>
                        <span class="project-card-photo-pill">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                            ${photoCount} Photos
                        </span>
                    </div>

                    <div class="project-card-content">
                        <div class="project-card-meta">${locationPart} &bull; ${subtitlePart}</div>
                        <h3 class="project-card-title">${escapeHtml(proj.title)}</h3>
                        <p class="project-card-desc">${escapeHtml(proj.overview)}</p>
                        
                        <div class="project-card-footer">
                            <span class="project-card-link">
                                View Project Details
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </span>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        gridEl.innerHTML = html;

        // Attach click & enter key handlers to cards
        gridEl.querySelectorAll('.project-card').forEach(card => {
            const id = card.getAttribute('data-id');
            card.addEventListener('click', () => openModal(id));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(id);
                }
            });
        });
    }

    /**
     * Switch division filter with smooth animation
     */
    function setDivision(division) {
        state.activeDivision = division || 'all';

        // Update button active states
        filterButtons.forEach(btn => {
            const btnDiv = btn.getAttribute('data-division');
            const isActive = (state.activeDivision.toLowerCase() === 'all' && (!btnDiv || btnDiv.toLowerCase() === 'all')) ||
                             (btnDiv && btnDiv.toLowerCase() === state.activeDivision.toLowerCase());

            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // URL Query Sync
        syncUrlParams();

        // Animate grid change
        if (gridEl) {
            gridEl.classList.add('is-animating-out');
            setTimeout(() => {
                renderGrid();
                gridEl.classList.remove('is-animating-out');
                gridEl.classList.add('is-animating-in');
                setTimeout(() => {
                    gridEl.classList.remove('is-animating-in');
                }, 250);
            }, 180);
        } else {
            renderGrid();
        }
    }

    /**
     * Update counts on filter buttons
     */
    function updateCounts() {
        const allCurated = getCuratedProjects();
        const metalCount = allCurated.filter(p => p.division && p.division.toLowerCase() === 'metal fabrication').length;
        const interiorsCount = allCurated.filter(p => p.division && p.division.toLowerCase() === 'interiors').length;

        const countAll = document.getElementById('countAll');
        const countMetal = document.getElementById('countMetal');
        const countInteriors = document.getElementById('countInteriors');

        if (countAll) countAll.textContent = allCurated.length;
        if (countMetal) countMetal.textContent = metalCount;
        if (countInteriors) countInteriors.textContent = interiorsCount;
    }

    /* ==========================================================================
       4. INTERACTIVE LIGHTBOX MODAL
       ========================================================================== */

    function openModal(projectId) {
        const proj = getProjectById(projectId);
        if (!proj || !modalEl) return;

        state.currentProject = proj;
        state.currentPhotoIndex = 0;

        // Populate text content
        if (modalBadgeEl) {
            modalBadgeEl.textContent = `${proj.division}${proj.category ? ' • ' + proj.category : ''}`;
        }
        if (modalTitleEl) modalTitleEl.textContent = proj.title || 'Architectural Project';
        if (modalSubtitleEl) modalSubtitleEl.textContent = proj.subtitle || '';
        if (modalOverviewEl) modalOverviewEl.textContent = proj.overview || '';
        if (modalLocationEl) modalLocationEl.textContent = proj.location || 'Nigeria';
        if (modalMaterialsEl) modalMaterialsEl.textContent = proj.materials || 'Architectural specification';
        if (modalFinishEl) modalFinishEl.textContent = proj.finish || 'Standard ATG protective coating';
        if (modalStatusEl) modalStatusEl.textContent = proj.status || 'Completed Commission';

        // Engineering Notes list
        if (modalNotesList) {
            if (proj.details && Array.isArray(proj.details) && proj.details.length > 0) {
                modalNotesList.innerHTML = proj.details.map(d => `<li>${escapeHtml(d)}</li>`).join('');
                modalNotesList.style.display = 'block';
            } else {
                modalNotesList.style.display = 'none';
            }
        }

        // Commission CTA button link pre-filled with project title
        if (modalActionBtn) {
            const projectParam = encodeURIComponent(proj.title || '');
            modalActionBtn.href = `start-your-project.html?project=${projectParam}`;
        }

        // Setup image gallery
        renderModalGallery();

        // Show modal
        modalEl.classList.add('is-open');
        modalEl.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // URL sync with project ID
        syncUrlParams(proj.id);
    }

    function closeModal() {
        if (!modalEl) return;
        modalEl.classList.remove('is-open');
        modalEl.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        state.currentProject = null;

        // Remove project param from URL
        syncUrlParams(null);
    }

    function getGalleryImages() {
        if (!state.currentProject) return [];
        if (state.currentProject.gallery && Array.isArray(state.currentProject.gallery) && state.currentProject.gallery.length > 0) {
            return state.currentProject.gallery;
        }
        if (state.currentProject.image) {
            return [state.currentProject.image];
        }
        return [];
    }

    function renderModalGallery() {
        const images = getGalleryImages();
        const total = images.length;

        if (total === 0) return;

        if (state.currentPhotoIndex >= total) {
            state.currentPhotoIndex = 0;
        }

        const currentImgUrl = images[state.currentPhotoIndex];

        // Main Viewer Image
        if (modalViewerImg) {
            modalViewerImg.src = currentImgUrl;
            modalViewerImg.alt = `${state.currentProject.title} — Photograph ${state.currentPhotoIndex + 1}`;
        }

        // Counter
        if (modalCounterEl) {
            modalCounterEl.textContent = `${state.currentPhotoIndex + 1} / ${total}`;
        }

        // Thumbnails Strip
        if (modalThumbsStrip) {
            if (total <= 1) {
                modalThumbsStrip.style.display = 'none';
            } else {
                modalThumbsStrip.style.display = 'flex';
                modalThumbsStrip.innerHTML = images.map((imgUrl, idx) => `
                    <button 
                        type="button" 
                        class="modal-thumb-item ${idx === state.currentPhotoIndex ? 'is-active' : ''}" 
                        data-index="${idx}" 
                        aria-label="View photo ${idx + 1}"
                    >
                        <img src="${escapeAttr(imgUrl)}" alt="Thumbnail ${idx + 1}">
                    </button>
                `).join('');

                modalThumbsStrip.querySelectorAll('.modal-thumb-item').forEach(thumb => {
                    thumb.addEventListener('click', () => {
                        const idx = parseInt(thumb.getAttribute('data-index'), 10);
                        if (!isNaN(idx)) {
                            state.currentPhotoIndex = idx;
                            renderModalGallery();
                        }
                    });
                });
            }
        }

        // Arrows visibility (hide if only 1 image)
        if (modalPrevBtn) modalPrevBtn.style.display = total > 1 ? 'flex' : 'none';
        if (modalNextBtn) modalNextBtn.style.display = total > 1 ? 'flex' : 'none';
    }

    function nextPhoto() {
        const images = getGalleryImages();
        if (images.length <= 1) return;
        state.currentPhotoIndex = (state.currentPhotoIndex + 1) % images.length;
        renderModalGallery();
    }

    function prevPhoto() {
        const images = getGalleryImages();
        if (images.length <= 1) return;
        state.currentPhotoIndex = (state.currentPhotoIndex - 1 + images.length) % images.length;
        renderModalGallery();
    }

    /* ==========================================================================
       5. URL QUERY PARAMS SYNCHRONIZATION
       ========================================================================== */

    function syncUrlParams(projectId) {
        if (!window.history || !window.history.replaceState) return;

        const url = new URL(window.location.href);

        // Division param
        if (state.activeDivision && state.activeDivision.toLowerCase() !== 'all') {
            url.searchParams.set('division', state.activeDivision);
        } else {
            url.searchParams.delete('division');
        }

        // Project param
        if (projectId) {
            url.searchParams.set('project', projectId);
        } else if (projectId === null) {
            url.searchParams.delete('project');
        }

        window.history.replaceState(null, '', url.toString());
    }

    function initFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const divParam = urlParams.get('division');
        const projParam = urlParams.get('project');

        if (divParam) {
            const valid = ['metal fabrication', 'interiors', 'all'];
            if (valid.includes(divParam.toLowerCase())) {
                state.activeDivision = divParam.toLowerCase() === 'metal fabrication' ? 'Metal Fabrication' :
                                       divParam.toLowerCase() === 'interiors' ? 'Interiors' : 'all';
            }
        }

        // Open specific project if specified in URL
        if (projParam) {
            setTimeout(() => {
                openModal(projParam);
            }, 100);
        }
    }

    /* ==========================================================================
       6. INITIALIZATION & EVENT LISTENERS
       ========================================================================== */

    function init() {
        // Cache DOM elements
        gridEl = document.getElementById('galleryGrid');
        emptyEl = document.getElementById('galleryEmpty');
        filterButtons = Array.from(document.querySelectorAll('.filter-btn'));

        modalEl = document.getElementById('atgProjectModal');
        modalContainerEl = document.getElementById('modalContainer');
        modalCloseBtn = document.getElementById('modalCloseBtn');
        modalViewerImg = document.getElementById('modalViewerImg');
        modalPrevBtn = document.getElementById('modalPrevBtn');
        modalNextBtn = document.getElementById('modalNextBtn');
        modalCounterEl = document.getElementById('modalCounter');
        modalThumbsStrip = document.getElementById('modalThumbsStrip');
        modalBadgeEl = document.getElementById('modalBadge');
        modalTitleEl = document.getElementById('modalTitle');
        modalSubtitleEl = document.getElementById('modalSubtitle');
        modalOverviewEl = document.getElementById('modalOverview');
        modalLocationEl = document.getElementById('modalLocation');
        modalMaterialsEl = document.getElementById('modalMaterials');
        modalFinishEl = document.getElementById('modalFinish');
        modalStatusEl = document.getElementById('modalStatus');
        modalNotesList = document.getElementById('modalNotesList');
        modalActionBtn = document.getElementById('modalActionBtn');

        // Setup filter button listeners
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const div = btn.getAttribute('data-division') || 'all';
                setDivision(div);
            });
        });

        // Setup Modal Listeners
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeModal);
        }

        if (modalEl) {
            modalEl.addEventListener('click', (e) => {
                // If clicked on backdrop outside container, close
                if (e.target === modalEl) {
                    closeModal();
                }
            });
        }

        if (modalPrevBtn) {
            modalPrevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                prevPhoto();
            });
        }

        if (modalNextBtn) {
            modalNextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                nextPhoto();
            });
        }

        // Global Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (!modalEl || !modalEl.classList.contains('is-open')) return;

            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                prevPhoto();
            } else if (e.key === 'ArrowRight') {
                nextPhoto();
            }
        });

        // Initialize state from URL params
        initFromUrl();

        // Update counts and render grid
        updateCounts();
        setDivision(state.activeDivision);
    }

    // Expose Global API for inline hooks
    window.ATG_GALLERY = {
        setDivision: setDivision,
        openModal: openModal,
        closeModal: closeModal
    };

    // Run on DOM Ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
