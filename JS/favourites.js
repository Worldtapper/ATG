/**
 * ATG Metal Works & Interiors — Global Favourites Manager
 * Persistent client-side favourites using localStorage.
 * Dispatches global events and auto-mounts the floating favourites shortcut.
 */

(function () {
    const STORAGE_KEY = 'atg_favourite_designs';

    const ATGFavourites = {
        /**
         * Safely retrieve array of saved design IDs
         * @returns {string[]}
         */
        getFavourites: function () {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) return [];
                const parsed = JSON.parse(raw);
                if (!Array.isArray(parsed)) return [];
                // Clean and ensure unique non-empty strings
                const clean = Array.from(new Set(parsed.filter(id => typeof id === 'string' && id.trim().length > 0)));
                return clean;
            } catch (err) {
                console.warn('[ATG] Could not parse favourites from storage, resetting:', err);
                return [];
            }
        },

        /**
         * Check if a design ID is saved
         * @param {string} id
         * @returns {boolean}
         */
        isFavourite: function (id) {
            if (!id) return false;
            return this.getFavourites().includes(id);
        },

        /**
         * Toggle saved status for a design ID
         * @param {string} id
         * @returns {boolean} New saved state
         */
        toggleFavourite: function (id) {
            if (!id) return false;
            let favs = this.getFavourites();
            const exists = favs.includes(id);
            if (exists) {
                favs = favs.filter(item => item !== id);
            } else {
                favs.push(id);
            }
            this._save(favs);
            this._notify(id, !exists);
            return !exists;
        },

        /**
         * Add a design ID
         * @param {string} id
         */
        addFavourite: function (id) {
            if (!id) return;
            const favs = this.getFavourites();
            if (!favs.includes(id)) {
                favs.push(id);
                this._save(favs);
                this._notify(id, true);
            }
        },

        /**
         * Remove a design ID
         * @param {string} id
         */
        removeFavourite: function (id) {
            if (!id) return;
            let favs = this.getFavourites();
            if (favs.includes(id)) {
                favs = favs.filter(item => item !== id);
                this._save(favs);
                this._notify(id, false);
            }
        },

        /**
         * Get count of saved designs
         * @returns {number}
         */
        getFavouriteCount: function () {
            return this.getFavourites().length;
        },

        /**
         * Clear all saved designs
         */
        clearFavourites: function () {
            this._save([]);
            this._notify(null, false);
        },

        /**
         * Internal save helper
         * @private
         */
        _save: function (favs) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
            } catch (err) {
                console.error('[ATG] Failed to persist favourites to localStorage:', err);
            }
        },

        /**
         * Internal event notifier & DOM updater
         * @private
         */
        _notify: function (changedId, isSaved) {
            const count = this.getFavouriteCount();
            const favs = this.getFavourites();

            // Update badge & buttons in DOM
            this.updateDOM();

            // Dispatch custom event
            const event = new CustomEvent('atg:favourites-updated', {
                detail: {
                    changedId: changedId,
                    isSaved: isSaved,
                    count: count,
                    favourites: favs
                }
            });
            window.dispatchEvent(event);
        },

        /**
         * Synchronise UI elements (floating badge, heart icons on cards & modal)
         */
        updateDOM: function () {
            const favs = this.getFavourites();
            const count = favs.length;

            // Update floating shortcut badge
            const badge = document.getElementById('atgFavBadge');
            const floatingBtn = document.getElementById('atgFloatingFavBtn');
            if (badge) {
                badge.textContent = count;
                badge.setAttribute('data-count', count);
                if (count > 0) {
                    badge.classList.add('has-items');
                } else {
                    badge.classList.remove('has-items');
                }
            }
            if (floatingBtn) {
                floatingBtn.setAttribute(
                    'aria-label',
                    count === 1 ? 'View 1 saved design' : `View ${count} saved designs`
                );
                if (count > 0) {
                    floatingBtn.classList.add('has-favourites');
                } else {
                    floatingBtn.classList.remove('has-favourites');
                }
            }

            // Update all favourite buttons currently in DOM
            const heartBtns = document.querySelectorAll('.atg-fav-btn[data-id]');
            heartBtns.forEach(btn => {
                const id = btn.getAttribute('data-id');
                const isFav = favs.includes(id);
                if (isFav) {
                    btn.classList.add('is-active');
                    btn.setAttribute('aria-pressed', 'true');
                    btn.setAttribute('title', 'Remove from favourites');
                } else {
                    btn.classList.remove('is-active');
                    btn.setAttribute('aria-pressed', 'false');
                    btn.setAttribute('title', 'Save to favourites');
                }
            });

            // Update modal favourite button if open
            const modalFavBtn = document.getElementById('atgModalFavBtn');
            if (modalFavBtn) {
                const modalId = modalFavBtn.getAttribute('data-id');
                const isFav = favs.includes(modalId);
                const textSpan = modalFavBtn.querySelector('.fav-btn-text');
                if (isFav) {
                    modalFavBtn.classList.add('is-active');
                    modalFavBtn.setAttribute('aria-pressed', 'true');
                    if (textSpan) textSpan.textContent = 'Saved in Favourites';
                } else {
                    modalFavBtn.classList.remove('is-active');
                    modalFavBtn.setAttribute('aria-pressed', 'false');
                    if (textSpan) textSpan.textContent = 'Save to Favourites';
                }
            }
        },

        /**
         * Mount global floating Favourites shortcut
         */
        initFloatingButton: function () {
            if (document.getElementById('atgFloatingFavBtn')) {
                this.updateDOM();
                return;
            }

            const btn = document.createElement('a');
            btn.href = 'favourites.html';
            btn.className = 'atg-floating-fav-btn';
            btn.id = 'atgFloatingFavBtn';
            btn.setAttribute('aria-label', 'View saved designs');
            btn.setAttribute('title', 'Saved Designs');
            btn.innerHTML = `
                <svg class="floating-fav-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span class="atg-fav-badge" id="atgFavBadge">0</span>
            `;

            document.body.appendChild(btn);
            this.updateDOM();
        }
    };

    // Expose to window
    window.ATGFavourites = ATGFavourites;

    // Initialize on DOM load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            ATGFavourites.initFloatingButton();
        });
    } else {
        ATGFavourites.initFloatingButton();
    }
})();

