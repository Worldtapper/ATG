/**
 * ATG Metal Works & Interiors — Services & Divisions Controller
 * Manages scroll-triggered animations, navigation anchors, and responsive behavior
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        initScrollReveals();
        initSmoothAnchors();
    });

    /**
     * Scroll-triggered reveals using IntersectionObserver
     */
    function initScrollReveals() {
        const revealElements = document.querySelectorAll('.sd-reveal');
        if (!revealElements.length) return;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        obs.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px'
            });

            revealElements.forEach(el => observer.observe(el));
        } else {
            // Fallback for older browsers
            revealElements.forEach(el => el.classList.add('is-revealed'));
        }
    }

    /**
     * Smooth scrolling for in-page anchors (e.g., #divisions)
     */
    function initSmoothAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;

                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    const navHeight = 90;
                    const elementPosition = targetEl.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
})();

