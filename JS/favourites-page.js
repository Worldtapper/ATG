/**
 * ATG Metal Works & Interiors — Favourites Page Controller
 * Renders saved designs from localStorage, handles live removals, and provides empty state.
 */

document.addEventListener('DOMContentLoaded', () => {
    const favGrid = document.getElementById('favCardsGrid');
    const favCountEl = document.getElementById('favCountHeader');
    const emptyState = document.getElementById('favEmptyState');
    const clearAllBtn = document.getElementById('clearAllFavsBtn');
    const startProjectFavsBtn = document.getElementById('startProjectFavsBtn');

    if (!window.ATGFavourites || !window.ATG_UI) {
        console.error('[ATG] Favourites or UI module missing!');
        return;
    }

    // Setup card action delegation (View Details, Remove, Enquire)
    if (favGrid) {
        window.ATG_UI.setupCardDelegation(favGrid);
    }

    // Bind Clear All Favourites
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all your saved designs?')) {
                window.ATGFavourites.clearFavourites();
            }
        });
    }

    // Listen to favourites updates
    window.addEventListener('atg:favourites-updated', () => {
        renderFavourites();
    });

    // Initial render
    renderFavourites();

    function renderFavourites() {
        const savedIds = window.ATGFavourites.getFavourites();
        const allDesigns = window.ATG_CATALOGUE_DATA || [];

        // Match IDs with actual catalogue objects
        const savedDesigns = savedIds
            .map(id => allDesigns.find(d => d.id === id))
            .filter(Boolean);

        // Update header count
        const count = savedDesigns.length;
        if (favCountEl) {
            if (count === 1) {
                favCountEl.textContent = '1 Curated Design Concept';
            } else {
                favCountEl.textContent = `${count} Curated Design Concepts`;
            }
        }

        // Toggle Clear All and Start Project Buttons
        if (clearAllBtn) {
            clearAllBtn.style.display = count > 0 ? 'inline-flex' : 'none';
        }
        if (startProjectFavsBtn) {
            startProjectFavsBtn.style.display = count > 0 ? 'inline-flex' : 'none';
            if (count > 0) {
                startProjectFavsBtn.href = `start-your-project.html?designs=${encodeURIComponent(savedIds.join(','))}`;
            }
        }

        // Render Cards or Empty State
        if (count === 0) {
            if (favGrid) {
                favGrid.innerHTML = '';
                favGrid.style.display = 'none';
            }
            if (emptyState) {
                emptyState.style.display = 'block';
            }
        } else {
            if (emptyState) {
                emptyState.style.display = 'none';
            }
            if (favGrid) {
                favGrid.style.display = 'grid';
                const cardsHtml = savedDesigns
                    .map(design => window.ATG_UI.createDesignCardMarkup(design, { isFavouritesPage: true }))
                    .join('');
                favGrid.innerHTML = cardsHtml;
            }
        }
    }
});

