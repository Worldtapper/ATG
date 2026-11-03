/**
 * ATG Metal Works - Insights Page Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Intersection Observer for Animations ---
    const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-fade-left, .animate-fade-right, .animate-zoom, .ip-stagger-fade-up, .animate-cinematic-title');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));

    // --- Parallax Effect for Hero Background ---
    const heroBg = document.querySelector('.ip-hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    const smoothLinks = document.querySelectorAll('.smooth-scroll');
    smoothLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // --- Scroll to Top Button ---
    const scrollTopBtn = document.getElementById('ipScrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Filter Chips Interaction ---
    const filterChips = document.querySelectorAll('.ip-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Remove active class from all chips
            filterChips.forEach(c => c.classList.remove('active'));
            // Add active class to clicked chip
            chip.classList.add('active');
            
            // In a real application, this would trigger content filtering
            // For now, it just demonstrates the visual interaction
        });
    });

    // --- Stats Counter Animation ---
    const statNumbers = document.querySelectorAll('.ip-stat-number');
    let hasAnimatedStats = false;
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimatedStats) {
                hasAnimatedStats = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            stat.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            stat.innerText = target;
                        }
                    };
                    updateCounter();
                });
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.ip-stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // --- Newsletter Submission ---
    const newsletterForm = document.getElementById('ipNewsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('ipEmail');
            if (emailInput.checkValidity()) {
                newsletterForm.classList.add('success');
                emailInput.value = '';
            }
        });
    }
});
