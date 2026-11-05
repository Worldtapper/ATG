/**
 * ATG Metal Works & Interiors — Catalogue UI Component
 * Reusable card rendering, interactive design details modal, and enquiry routing.
 * Shared across services.html and favourites.html.
 */

(function () {
    let lastActiveTriggerElement = null;
    let modalElement = null;

    /**
     * Build HTML markup for a single design card
     * @param {object} design
     * @param {object} options { isFavouritesPage: boolean }
     * @returns {string} HTML string
     */
    function createDesignCardMarkup(design, options = {}) {
        if (!design) return '';

        const isFav = window.ATGFavourites ? window.ATGFavourites.isFavourite(design.id) : false;
        const isFavPage = options.isFavouritesPage === true;

        // Price formatting
        let priceHtml = '';
        if (design.priceEstimate) {
            priceHtml = `<span class="card-price">${escapeHtml(design.priceEstimate)}</span>`;
        } else if (design.priceType === 'quote') {
            priceHtml = `<span class="card-price is-quote">Request a Quote</span>`;
        } else if (design.priceLabel) {
            priceHtml = `<span class="card-price">${escapeHtml(design.priceLabel)}</span>`;
        } else if (design.price) {
            priceHtml = `<span class="card-price">₦${Number(design.price).toLocaleString('en-NG')}</span>`;
        } else {
            priceHtml = `<span class="card-price is-quote">Request a Quote</span>`;
        }

        // Status badge
        let statusBadge = '';
        if (design.designStatus === 'Design Concept') {
            statusBadge = `<span class="card-status-badge is-concept">Design Concept</span>`;
        } else if (design.designStatus === 'Fabricated to Order') {
            statusBadge = `<span class="card-status-badge is-order">Made to Order</span>`;
        } else if (design.featured) {
            statusBadge = `<span class="card-featured-badge">Featured</span>`;
        }

        // Style tags preview (up to 2 tags)
        const tagsHtml = Array.isArray(design.styleTags) && design.styleTags.length > 0
            ? design.styleTags.slice(0, 2).map(tag => `<span class="card-tag">${escapeHtml(tag)}</span>`).join('')
            : '';

        // Primary image
        const primaryImage = design.image || 'images/mega_menu_services.png';

        return `
            <article class="atg-design-card" data-id="${design.id}" data-category="${escapeAttr(design.category)}">
                <div class="card-media-wrapper">
                    <img 
                        src="${primaryImage}" 
                        alt="${escapeAttr(design.name)}" 
                        class="card-img" 
                        loading="lazy" 
                        onerror="this.onerror=null; this.src='images/mega_menu_services.png';"
                    >
                    <div class="card-badge-row">
                        <span class="card-category-badge">${escapeHtml(design.category)}</span>
                        ${statusBadge}
                    </div>

                    <button 
                        type="button" 
                        class="atg-fav-btn ${isFav ? 'is-active' : ''}" 
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
                    <div class="card-tags-row">
                        ${tagsHtml}
                    </div>

                    <h3 class="card-title">${escapeHtml(design.name)}</h3>
                    <p class="card-desc">${escapeHtml(design.description)}</p>

                    <div class="card-meta">
                        <div class="card-meta-item">
                            <span class="meta-label">Materials:</span>
                            <span class="meta-value">${escapeHtml(truncate(design.materials, 55))}</span>
                        </div>
                    </div>

                    <div class="card-pricing-row">
                        ${priceHtml}
                    </div>

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
                    ${isFavPage ? `
                        <button 
                            type="button" 
                            class="card-remove-fav-btn" 
                            data-action="remove-fav" 
                            data-id="${design.id}"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            Remove from Saved
                        </button>
                    ` : ''}
                </div>
            </article>
        `;
    }

    /**
     * Create the advanced architectural modal DOM element if it doesn't exist
     */
    function ensureModalDOM() {
        if (document.getElementById('atgDesignModal')) {
            modalElement = document.getElementById('atgDesignModal');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'atg-modal-backdrop';
        modal.id = 'atgDesignModal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('aria-labelledby', 'modalDesignTitle');

        modal.innerHTML = `
            <div class="atg-modal-container" id="modalContainer" tabIndex="-1">
                <button type="button" class="atg-modal-close-btn" id="modalCloseBtn" aria-label="Close design details">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div class="atg-modal-grid">
                    <!-- Left Column: Gallery & Architectural Assurance -->
                    <div class="modal-gallery-column">
                        <div class="modal-main-img-box" id="modalImgWrapper">
                            <img id="modalMainImg" src="" alt="Design concept view" class="modal-main-img">
                            <div class="modal-img-badges">
                                <span class="modal-category-chip" id="modalCategoryChip"></span>
                                <span class="modal-status-badge" id="modalStatusBadge"></span>
                            </div>
                            <button type="button" class="modal-zoom-btn" id="modalZoomBtn" aria-label="Inspect high-resolution image" title="Inspect Full View">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    <line x1="11" y1="8" x2="11" y2="14"></line>
                                    <line x1="8" y1="11" x2="14" y2="11"></line>
                                </svg>
                            </button>
                        </div>

                        <!-- Thumbnails Strip -->
                        <div class="modal-thumbs-strip" id="modalThumbsStrip" role="tablist" aria-label="Image thumbnails"></div>

                        <!-- Turnkey Architectural Assurance Trio -->
                        <div class="modal-assurance-card">
                            <h4 class="assurance-card-title">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                Architectural Craft &amp; Engineering Assurance
                            </h4>
                            <ul class="assurance-list">
                                <li class="assurance-item">
                                    <span class="assurance-icon-bullet">&#x2713;</span>
                                    <div>
                                        <strong>Certified Structural Spec:</strong> Heavy-gauge structural steel, architectural alloys &amp; high-durability primers.
                                    </div>
                                </li>
                                <li class="assurance-item">
                                    <span class="assurance-icon-bullet">&#x2713;</span>
                                    <div>
                                        <strong>Blueprint-to-Site Customization:</strong> Form, dimensions &amp; load capacities calibrated to architectural drawings.
                                    </div>
                                </li>
                                <li class="assurance-item">
                                    <span class="assurance-icon-bullet">&#x2713;</span>
                                    <div>
                                        <strong>Turnkey Delivery &amp; Rigging:</strong> White-glove logistics &amp; master on-site installation across Nigeria.
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Right Column: Details, Segmented Tabs & Actions -->
                    <div class="modal-details-column">
                        <div class="modal-header-meta">
                            <div class="modal-header-left">
                                <span class="modal-ref-id" id="modalRefId">REF: ATG-DES-00</span>
                                <span class="modal-department-tag" id="modalDepartmentTag">Department</span>
                            </div>
                            <div class="modal-header-actions">
                                <button type="button" class="modal-tool-btn" id="modalShareBtn" aria-label="Copy design link" title="Copy direct link to this design">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                    </svg>
                                    <span class="share-btn-text" id="modalShareText">Share</span>
                                </button>
                                <button type="button" class="modal-fav-toggle-btn atg-fav-btn" id="atgModalFavBtn" aria-label="Save to favourites">
                                    <svg class="heart-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                    <span class="fav-btn-text">Save</span>
                                </button>
                            </div>
                        </div>

                        <h2 class="modal-design-title" id="modalDesignTitle">Design Title</h2>
                        
                        <div class="modal-pricing-container">
                            <div class="modal-price-badge" id="modalPriceBadge">Request a Quote</div>
                            <div class="modal-estimate-box" id="modalEstimateBox">
                                <svg class="estimate-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                <span class="estimate-text" id="modalEstimateText"></span>
                            </div>
                        </div>

                        <!-- Segmented Navigation Tabs -->
                        <div class="modal-tabs-nav" role="tablist" aria-label="Design Specification Tabs">
                            <button type="button" class="modal-tab-btn is-active" data-tab="specs" role="tab" aria-selected="true" aria-controls="tabPaneSpecs" id="tabBtnSpecs">
                                Overview &amp; Specs
                            </button>
                            <button type="button" class="modal-tab-btn" data-tab="materials" role="tab" aria-selected="false" aria-controls="tabPaneMaterials" id="tabBtnMaterials">
                                Finishes &amp; Materials
                            </button>
                            <button type="button" class="modal-tab-btn" data-tab="roadmap" role="tab" aria-selected="false" aria-controls="tabPaneRoadmap" id="tabBtnRoadmap">
                                Estimate &amp; Roadmap
                            </button>
                            <button type="button" class="modal-tab-btn" data-tab="custom" role="tab" aria-selected="false" aria-controls="tabPaneCustom" id="tabBtnCustom">
                                Customisation &amp; CAD
                            </button>
                        </div>

                        <!-- Tab Panes Container -->
                        <div class="modal-tab-panes">
                            <!-- Pane 1: Overview & Specs -->
                            <div class="modal-tab-pane is-active" id="tabPaneSpecs" role="tabpanel" aria-labelledby="tabBtnSpecs">
                                <div class="modal-description-box">
                                    <p id="modalDescription"></p>
                                </div>

                                <div class="modal-specs-table">
                                    <div class="spec-table-row" id="specDimensionsRow">
                                        <span class="spec-table-label">Dimensions</span>
                                        <span class="spec-table-value" id="modalDimensions"></span>
                                    </div>
                                    <div class="spec-table-row" id="specMaterialsRow">
                                        <span class="spec-table-label">Materials</span>
                                        <span class="spec-table-value" id="modalMaterials"></span>
                                    </div>
                                    <div class="spec-table-row" id="specFinishRow">
                                        <span class="spec-table-label">Standard Finish</span>
                                        <span class="spec-table-value" id="modalFinish"></span>
                                    </div>
                                    <div class="spec-table-row">
                                        <span class="spec-table-label">Application</span>
                                        <span class="spec-table-value" id="modalSuitability">High-End Residential, Commercial &amp; Hospitality Projects</span>
                                    </div>
                                    <div class="spec-table-row">
                                        <span class="spec-table-label">Fabrication Lead Time</span>
                                        <span class="spec-table-value">2 &ndash; 4 Weeks from technical CAD approval</span>
                                    </div>
                                </div>

                                <div class="modal-style-tags-row">
                                    <span class="tags-row-label">Design Attributes:</span>
                                    <div class="modal-style-tags" id="modalStyleTags"></div>
                                </div>
                            </div>

                            <!-- Pane 2: Finishes & Materials (Interactive Swatches) -->
                            <div class="modal-tab-pane" id="tabPaneMaterials" role="tabpanel" aria-labelledby="tabBtnMaterials">
                                <div class="modal-pane-lead">
                                    ATG metalwork undergoes multi-stage surface preparation, chemical degreasing, zinc-rich anti-corrosion primer, and thermoset architectural powder coating or luxury electroplating.
                                </div>

                                <div class="modal-finish-selector">
                                    <div class="finish-selector-header">
                                        <span class="finish-selector-title">Available Architectural Metal Finishes:</span>
                                        <span class="finish-active-name" id="modalFinishActiveName">Obsidian Matte Black</span>
                                    </div>

                                    <div class="finish-swatches-grid" role="radiogroup" aria-label="Select an architectural finish" id="modalSwatchesGrid">
                                        <button type="button" class="finish-swatch is-active" data-name="Obsidian Matte Black" data-desc="Deep architectural velvet matte powder coat with zero glare and high scratch resistance." aria-checked="true" role="radio" title="Obsidian Matte Black">
                                            <span class="swatch-color" style="background: #17171a;"></span>
                                            <span class="swatch-name">Obsidian Black</span>
                                        </button>
                                        <button type="button" class="finish-swatch" data-name="Satin Brushed Brass" data-desc="Luxury warm brass finish with directional satin brushing and protective clear protective seal." aria-checked="false" role="radio" title="Satin Brushed Brass">
                                            <span class="swatch-color" style="background: #c8a251;"></span>
                                            <span class="swatch-name">Brushed Brass</span>
                                        </button>
                                        <button type="button" class="finish-swatch" data-name="Textured Graphite" data-desc="Industrial heavy-duty textured dark graphite coating engineered for severe weather and high traffic." aria-checked="false" role="radio" title="Textured Graphite">
                                            <span class="swatch-color" style="background: #2e3236;"></span>
                                            <span class="swatch-name">Textured Graphite</span>
                                        </button>
                                        <button type="button" class="finish-swatch" data-name="Industrial Raw Clear Steel" data-desc="Exposed structural welds and heat tints sealed under diamond-clear satin anti-rust polyurethane." aria-checked="false" role="radio" title="Industrial Raw Clear Steel">
                                            <span class="swatch-color" style="background: #555c63;"></span>
                                            <span class="swatch-name">Raw Clear Steel</span>
                                        </button>
                                        <button type="button" class="finish-swatch" data-name="Champagne Bronze" data-desc="Contemporary metallic champagne bronze tone with micro-metallic luster suited for luxury interior joinery." aria-checked="false" role="radio" title="Champagne Bronze">
                                            <span class="swatch-color" style="background: #7d5f44;"></span>
                                            <span class="swatch-name">Champagne Bronze</span>
                                        </button>
                                    </div>

                                    <div class="finish-feedback-card" id="modalFinishFeedbackCard">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                        <span id="modalFinishFeedbackText">Deep architectural velvet matte powder coat with zero glare and high scratch resistance.</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Pane 3: Estimate Breakdown & Roadmap -->
                            <div class="modal-tab-pane" id="tabPaneRoadmap" role="tabpanel" aria-labelledby="tabBtnRoadmap">
                                <div class="estimate-breakdown-card">
                                    <h4 class="roadmap-card-title">Estimate Scope &amp; Transparency</h4>
                                    <p class="roadmap-card-desc">
                                        All ATG quotations are backed by transparent structural engineering takeoffs. Every estimate accounts for structural steel section weight, laser-cutting runtime, artisan welding, multi-stage coating, and site rigging.
                                    </p>
                                </div>

                                <div class="milestones-timeline">
                                    <div class="milestone-step">
                                        <div class="milestone-number">01</div>
                                        <div class="milestone-content">
                                            <h5>CAD Technical Review &amp; Site Survey</h5>
                                            <p>1 &ndash; 3 Business Days &bull; Physical laser site measurement or architect blueprint integration, structural load review, and shop-drawing approval.</p>
                                        </div>
                                    </div>
                                    <div class="milestone-step">
                                        <div class="milestone-number">02</div>
                                        <div class="milestone-content">
                                            <h5>Workshop Precision Fabrication</h5>
                                            <p>2 &ndash; 4 Weeks &bull; CNC laser cutting, precision TIG/MIG metal forming, artisanal surface finishing, and full workshop pre-assembly test fit.</p>
                                        </div>
                                    </div>
                                    <div class="milestone-step">
                                        <div class="milestone-number">03</div>
                                        <div class="milestone-content">
                                            <h5>Delivery &amp; Master Installation</h5>
                                            <p>1 &ndash; 3 Days &bull; Direct white-glove transit, mechanical anchoring, alignment verification, motorisation commissioning, and handover.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Pane 4: Customisation & CAD -->
                            <div class="modal-tab-pane" id="tabPaneCustom" role="tabpanel" aria-labelledby="tabBtnCustom">
                                <div class="modal-pane-lead" id="modalCustomisation">
                                    Dimensions, materials, finishes, and hardware tailored to project requirements.
                                </div>

                                <div class="custom-options-grid">
                                    <div class="custom-opt-box">
                                        <h6>Millimeter-Accurate Sizing</h6>
                                        <p>Every piece is fabricated to match existing architectural reveals, ceiling heights, or structural openings without fillers.</p>
                                    </div>
                                    <div class="custom-opt-box">
                                        <h6>Motorisation &amp; Smart Access</h6>
                                        <p>Concealed high-torque Italian motors, magnetic shear locks, biometric sensors, and home automation relays.</p>
                                    </div>
                                    <div class="custom-opt-box">
                                        <h6>Infill &amp; Glazing Variants</h6>
                                        <p>Fluted glass, acoustic laminated panels, perforated metal screens, brass inlays, or seasoned iroko/walnut hardwoods.</p>
                                    </div>
                                    <div class="custom-opt-box">
                                        <h6>Architect Blueprint Support</h6>
                                        <p>Direct ingestion of AutoCAD (.dwg), Revit (.rvt), and SketchUp models for immediate project takeoff.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Sticky Modal Action Toolbar -->
                        <div class="modal-cta-box">
                            <div class="modal-cta-buttons-row">
                                <a href="#" class="btn btn-primary modal-enquire-btn" id="modalEnquireBtn">
                                    Start Project with This Design
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </a>
                                <a href="#" target="_blank" rel="noopener" class="btn modal-whatsapp-btn" id="modalWhatsAppBtn">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                                    WhatsApp Technical Inquiry
                                </a>
                            </div>
                            <p class="modal-disclaimer">Custom dimensions, materials, and finishes are tailored to architectural blueprints and confirmed during site technical review.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modalElement = modal;

        bindModalEvents();
    }

    /**
     * Bind modal events: tabs, swatches, share link, zoom, backdrop, escape, and keyboard trap
     */
    function bindModalEvents() {
        if (!modalElement) return;

        const closeBtn = document.getElementById('modalCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeDesignModal);
        }

        // Close on backdrop click (outside container)
        modalElement.addEventListener('click', (e) => {
            if (e.target === modalElement) {
                closeDesignModal();
            }
        });

        // Close on Escape & trap focus
        document.addEventListener('keydown', (e) => {
            if (!modalElement.classList.contains('is-open')) return;

            if (e.key === 'Escape') {
                e.preventDefault();
                closeDesignModal();
                return;
            }

            // Focus trap
            if (e.key === 'Tab') {
                const focusable = modalElement.querySelectorAll(
                    'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusable.length === 0) return;

                const firstEl = focusable[0];
                const lastEl = focusable[focusable.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstEl) {
                        e.preventDefault();
                        lastEl.focus();
                    }
                } else {
                    if (document.activeElement === lastEl) {
                        e.preventDefault();
                        firstEl.focus();
                    }
                }
            }
        });

        // Segmented Tabs Switching
        const tabButtons = modalElement.querySelectorAll('.modal-tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabKey = btn.getAttribute('data-tab');
                switchModalTab(tabKey);
            });
        });

        // Interactive Finish Swatches
        const swatches = modalElement.querySelectorAll('.finish-swatch');
        swatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                swatches.forEach(s => {
                    s.classList.remove('is-active');
                    s.setAttribute('aria-checked', 'false');
                });
                swatch.classList.add('is-active');
                swatch.setAttribute('aria-checked', 'true');

                const name = swatch.getAttribute('data-name') || '';
                const desc = swatch.getAttribute('data-desc') || '';
                const activeNameEl = document.getElementById('modalFinishActiveName');
                const feedbackTextEl = document.getElementById('modalFinishFeedbackText');

                if (activeNameEl) activeNameEl.textContent = name;
                if (feedbackTextEl) feedbackTextEl.textContent = desc;
            });
        });

        // Share / Copy Link Button
        const shareBtn = document.getElementById('modalShareBtn');
        const shareText = document.getElementById('modalShareText');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                const modalFavBtn = document.getElementById('atgModalFavBtn');
                const designId = modalFavBtn ? modalFavBtn.getAttribute('data-id') : '';
                if (!designId) return;

                const baseUrl = window.location.origin + window.location.pathname.replace('favourites.html', 'services.html');
                const shareUrl = `${baseUrl}?design=${encodeURIComponent(designId)}`;

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(shareUrl).then(() => {
                        if (shareText) shareText.textContent = 'Copied!';
                        shareBtn.classList.add('is-copied');
                        setTimeout(() => {
                            if (shareText) shareText.textContent = 'Share';
                            shareBtn.classList.remove('is-copied');
                        }, 2200);
                    }).catch(() => {
                        prompt('Copy link to this design:', shareUrl);
                    });
                } else {
                    prompt('Copy link to this design:', shareUrl);
                }
            });
        }

        // Image Zoom Preview Affordance
        const zoomBtn = document.getElementById('modalZoomBtn');
        const imgWrapper = document.getElementById('modalImgWrapper');
        if (zoomBtn && imgWrapper) {
            zoomBtn.addEventListener('click', () => {
                imgWrapper.classList.toggle('is-zoomed');
            });
        }

        // Modal favourite button toggle
        const modalFavBtn = document.getElementById('atgModalFavBtn');
        if (modalFavBtn) {
            modalFavBtn.addEventListener('click', () => {
                const id = modalFavBtn.getAttribute('data-id');
                if (id && window.ATGFavourites) {
                    window.ATGFavourites.toggleFavourite(id);
                }
            });
        }
    }

    /**
     * Switch active tab in the design modal
     * @param {string} tabKey ('specs' | 'materials' | 'roadmap' | 'custom')
     */
    function switchModalTab(tabKey) {
        if (!modalElement) return;

        const tabButtons = modalElement.querySelectorAll('.modal-tab-btn');
        const tabPanes = modalElement.querySelectorAll('.modal-tab-pane');

        tabButtons.forEach(btn => {
            const isMatch = btn.getAttribute('data-tab') === tabKey;
            btn.classList.toggle('is-active', isMatch);
            btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });

        tabPanes.forEach(pane => {
            const paneTab = pane.id.replace('tabPane', '').toLowerCase();
            const isMatch = paneTab === tabKey.toLowerCase();
            pane.classList.toggle('is-active', isMatch);
        });
    }

    /**
     * Open details modal for a specific design ID
     * @param {string} designId
     * @param {HTMLElement} triggerEl
     */
    function openDesignModal(designId, triggerEl = null) {
        ensureModalDOM();

        if (typeof window.getATGDesignById !== 'function') {
            window.getATGDesignById = function(id) {
                if (!id || !window.ATG_CATALOGUE_DATA) return null;
                var t = String(id).toLowerCase().trim();
                return window.ATG_CATALOGUE_DATA.find(function(d) {
                    return d.id && d.id.toLowerCase() === t;
                }) || null;
            };
        }

        const design = window.getATGDesignById(designId);
        if (!design) {
            console.warn('[ATG] Design not found for ID:', designId);
            return;
        }

        lastActiveTriggerElement = triggerEl || document.activeElement;

        // Reset to first tab
        switchModalTab('specs');

        // Reset zoom state
        const imgWrapper = document.getElementById('modalImgWrapper');
        if (imgWrapper) imgWrapper.classList.remove('is-zoomed');

        // Populate Fields
        const modalRefId = document.getElementById('modalRefId');
        const modalDepartmentTag = document.getElementById('modalDepartmentTag');
        const modalDesignTitle = document.getElementById('modalDesignTitle');
        const modalPriceBadge = document.getElementById('modalPriceBadge');
        const modalEstimateBox = document.getElementById('modalEstimateBox');
        const modalEstimateText = document.getElementById('modalEstimateText');
        const modalDescription = document.getElementById('modalDescription');
        const modalMaterials = document.getElementById('modalMaterials');
        const modalFinish = document.getElementById('modalFinish');
        const modalDimensions = document.getElementById('modalDimensions');
        const modalCustomisation = document.getElementById('modalCustomisation');
        const modalSuitability = document.getElementById('modalSuitability');
        const modalStyleTags = document.getElementById('modalStyleTags');
        const modalCategoryChip = document.getElementById('modalCategoryChip');
        const modalStatusBadge = document.getElementById('modalStatusBadge');
        const modalMainImg = document.getElementById('modalMainImg');
        const modalThumbsStrip = document.getElementById('modalThumbsStrip');
        const modalEnquireBtn = document.getElementById('modalEnquireBtn');
        const modalWhatsAppBtn = document.getElementById('modalWhatsAppBtn');
        const modalFavBtn = document.getElementById('atgModalFavBtn');

        if (modalRefId) modalRefId.textContent = `REF: ${design.id.toUpperCase()}`;
        if (modalDepartmentTag) modalDepartmentTag.textContent = design.department || 'Bespoke Works';
        if (modalDesignTitle) modalDesignTitle.textContent = design.name;
        if (modalCategoryChip) modalCategoryChip.textContent = design.category;

        // Design status badge
        if (modalStatusBadge) {
            if (design.designStatus) {
                modalStatusBadge.style.display = 'inline-flex';
                modalStatusBadge.textContent = design.designStatus;
                modalStatusBadge.className = 'modal-status-badge ' + (design.designStatus === 'Design Concept' ? 'is-concept' : 'is-verified');
            } else {
                modalStatusBadge.style.display = 'none';
            }
        }

        // Price & Estimate Assumptions
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
                modalPriceBadge.textContent = `₦${Number(design.price).toLocaleString('en-NG')}`;
                modalPriceBadge.classList.remove('is-quote');
            } else {
                modalPriceBadge.textContent = 'Request a Quote';
                modalPriceBadge.classList.add('is-quote');
            }
        }

        if (modalEstimateBox && modalEstimateText) {
            if (design.estimateAssumptions) {
                modalEstimateBox.style.display = 'flex';
                modalEstimateText.textContent = `Estimate Basis: ${design.estimateAssumptions}`;
            } else {
                modalEstimateBox.style.display = 'none';
            }
        }

        if (modalDescription) modalDescription.textContent = design.description;
        if (modalMaterials) modalMaterials.textContent = design.materials || 'Bespoke structural specification';
        if (modalFinish) modalFinish.textContent = design.finish || 'Custom high-durability architectural finish';
        if (modalDimensions) modalDimensions.textContent = design.dimensions || 'Tailored to site architectural dimensions';
        if (modalCustomisation) modalCustomisation.textContent = design.customisation || 'Dimensions, materials, finishes, and hardware tailored to project requirements.';
        if (modalSuitability) {
            modalSuitability.textContent = design.department === 'Shelving & Display Solutions'
                ? 'Luxury Retail Showrooms, Boutiques, Commercial & High-End Residential'
                : 'High-End Residential Estates, Corporate Headquarters & Hospitality';
        }

        // Reset Swatches to first active
        const swatches = modalElement.querySelectorAll('.finish-swatch');
        if (swatches.length > 0) {
            swatches.forEach((s, idx) => {
                s.classList.toggle('is-active', idx === 0);
                s.setAttribute('aria-checked', idx === 0 ? 'true' : 'false');
            });
            const first = swatches[0];
            const activeNameEl = document.getElementById('modalFinishActiveName');
            const feedbackTextEl = document.getElementById('modalFinishFeedbackText');
            if (activeNameEl) activeNameEl.textContent = first.getAttribute('data-name');
            if (feedbackTextEl) feedbackTextEl.textContent = first.getAttribute('data-desc');
        }

        // Style Tags
        if (modalStyleTags) {
            modalStyleTags.innerHTML = '';
            if (Array.isArray(design.styleTags) && design.styleTags.length > 0) {
                design.styleTags.forEach(tag => {
                    const span = document.createElement('span');
                    span.className = 'modal-tag-chip';
                    span.textContent = tag;
                    modalStyleTags.appendChild(span);
                });
            }
        }

        // Gallery & Thumbnails
        const gallery = Array.isArray(design.gallery) && design.gallery.length > 0
            ? design.gallery
            : [design.image || 'images/mega_menu_services.png'];

        if (modalMainImg) {
            modalMainImg.src = gallery[0];
            modalMainImg.alt = `${design.name} - View`;
        }

        if (modalThumbsStrip) {
            modalThumbsStrip.innerHTML = '';
            gallery.forEach((imgSrc, idx) => {
                const thumb = document.createElement('button');
                thumb.type = 'button';
                thumb.className = `modal-thumb-btn ${idx === 0 ? 'is-active' : ''}`;
                thumb.setAttribute('aria-label', `View image ${idx + 1} of ${design.name}`);
                thumb.innerHTML = `<img src="${imgSrc}" alt="Thumbnail ${idx + 1}" onerror="this.src='images/mega_menu_services.png'">`;

                thumb.addEventListener('click', () => {
                    modalThumbsStrip.querySelectorAll('.modal-thumb-btn').forEach(btn => btn.classList.remove('is-active'));
                    thumb.classList.add('is-active');
                    if (modalMainImg) {
                        modalMainImg.style.opacity = '0.35';
                        setTimeout(() => {
                            modalMainImg.src = imgSrc;
                            modalMainImg.style.opacity = '1';
                        }, 120);
                    }
                });

                modalThumbsStrip.appendChild(thumb);
            });
        }

        // Enquiry link with prefilled query
        if (modalEnquireBtn) {
            modalEnquireBtn.href = `start-your-project.html?design=${encodeURIComponent(design.id)}`;
        }

        // WhatsApp direct technical link
        if (modalWhatsAppBtn) {
            const waMsg = encodeURIComponent(
                `Hello ATG Metal Works & Interiors,

I am interested in consulting on the design:
*${design.name}*
Ref Code: ${design.id.toUpperCase()}
Category: ${design.category}

Please share availability for technical review and CAD shop drawings.`
            );
            modalWhatsAppBtn.href = `https://wa.me/2348023358828?text=${waMsg}`;
        }

        // Favourite Button State
        if (modalFavBtn) {
            modalFavBtn.setAttribute('data-id', design.id);
            if (window.ATGFavourites) {
                window.ATGFavourites.updateDOM();
            }
        }

        // Open animation & scroll lock
        document.body.style.overflow = 'hidden';
        modalElement.classList.add('is-open');
        modalElement.setAttribute('aria-hidden', 'false');

        // Focus close button
        setTimeout(() => {
            const closeBtn = document.getElementById('modalCloseBtn');
            if (closeBtn) closeBtn.focus();
        }, 80);
    }

    /**
     * Close the modal
     */
    function closeDesignModal() {
        if (!modalElement || !modalElement.classList.contains('is-open')) return;

        modalElement.classList.remove('is-open');
        modalElement.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        if (lastActiveTriggerElement && typeof lastActiveTriggerElement.focus === 'function') {
            lastActiveTriggerElement.focus();
        }
    }

    /**
     * Delegate card events (favourite toggle, view details, remove favourite)
     * @param {HTMLElement} rootContainer
     */
    function setupCardDelegation(rootContainer) {
        if (!rootContainer) return;

        rootContainer.addEventListener('click', (e) => {
            // 1. Favourite Button Click
            const favBtn = e.target.closest('.atg-fav-btn');
            if (favBtn) {
                e.preventDefault();
                e.stopPropagation();
                const id = favBtn.getAttribute('data-id');
                if (id && window.ATGFavourites) {
                    window.ATGFavourites.toggleFavourite(id);
                }
                return;
            }

            // 2. Remove from Saved Click (Favourites page)
            const removeBtn = e.target.closest('[data-action="remove-fav"]');
            if (removeBtn) {
                e.preventDefault();
                e.stopPropagation();
                const id = removeBtn.getAttribute('data-id');
                if (id && window.ATGFavourites) {
                    window.ATGFavourites.removeFavourite(id);
                }
                return;
            }

            // 3. View Details Click
            const detailsBtn = e.target.closest('[data-action="view-details"]');
            if (detailsBtn) {
                e.preventDefault();
                const id = detailsBtn.getAttribute('data-id');
                if (id) {
                    openDesignModal(id, detailsBtn);
                }
                return;
            }

            // 4. Click on Card Media or Title to View Details
            const cardClickTarget = e.target.closest('.card-media-wrapper, .card-title');
            if (cardClickTarget) {
                const card = cardClickTarget.closest('.atg-design-card');
                if (card) {
                    const id = card.getAttribute('data-id');
                    if (id) {
                        openDesignModal(id, cardClickTarget);
                    }
                    return;
                }
            }
        });
    }

    // Helper functions
    function truncate(str, max = 50) {
        if (!str) return '';
        if (str.length <= max) return str;
        return str.substring(0, max) + '...';
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

    function escapeAttr(str) {
        if (!str) return '';
        return String(str).replace(/"/g, '&quot;');
    }

    // Expose API globally
    window.ATG_UI = {
        createDesignCardMarkup: createDesignCardMarkup,
        openDesignModal: openDesignModal,
        closeDesignModal: closeDesignModal,
        setupCardDelegation: setupCardDelegation,
        ensureModalDOM: ensureModalDOM
    };

    // Auto setup on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureModalDOM);
    } else {
        ensureModalDOM();
    }
})();
