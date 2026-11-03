/**
 * ATG Metal Works - Contact Page Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Intersection Observer for Animations ---
    const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-fade-left, .animate-fade-right, .animate-blur, .animate-zoom, .cp-stagger-fade-up, .cp-process-timeline');
    
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
    const heroBg = document.querySelector('.cp-hero-bg');
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
    const scrollTopBtn = document.getElementById('cpScrollTopBtn');
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

    // --- FAQ Accordion ---
    const accordionTriggers = document.querySelectorAll('.cp-accordion-trigger');
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.cp-accordion-item');
            
            // Close all others
            document.querySelectorAll('.cp-accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current
            item.classList.toggle('active');
        });
    });

    // --- Form Validation & Submission ---
    const contactForm = document.getElementById('premiumContactForm');
    
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, select, textarea');

        // Real-time validation removal
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.checkValidity()) {
                    input.closest('.cp-input-group, .cp-checkbox-group').classList.remove('invalid');
                }
            });
            input.addEventListener('change', () => {
                if (input.checkValidity()) {
                    input.closest('.cp-input-group, .cp-checkbox-group').classList.remove('invalid');
                }
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    isValid = false;
                    const group = input.closest('.cp-input-group, .cp-checkbox-group');
                    if (group) group.classList.add('invalid');
                }
            });

            if (isValid) {
                contactForm.classList.add('loading');
                
                // Simulate API call
                setTimeout(() => {
                    contactForm.classList.remove('loading');
                    contactForm.classList.add('success');
                    contactForm.reset();
                }, 1500);
            }
        });

        // --- Handle Incoming Design Enquiry Pre-fill ---
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const designId = urlParams.get('design');
            if (designId) {
                const projectMsg = document.getElementById('projectMsg');
                const serviceReq = document.getElementById('serviceReq');
                const design = window.ATG_CATALOGUE_DATA ? window.ATG_CATALOGUE_DATA.find(d => d.id === designId) : null;
                
                const designName = design ? design.name : designId.toUpperCase();
                const designCategory = design ? design.category : 'Bespoke Fabrication';

                if (projectMsg) {
                    projectMsg.value = `Hello ATG Team, I am interested in commissioning "${designName}" (${designCategory}, Ref: ${designId.toUpperCase()}). Please provide details on site measurements, material customization options, and an architectural quotation.`;
                    projectMsg.dispatchEvent(new Event('input', { bubbles: true }));
                }

                if (serviceReq && design) {
                    const catLower = design.category.toLowerCase();
                    if (catLower.includes('metal') || catLower.includes('steel') || catLower.includes('gate') || catLower.includes('railing')) {
                        serviceReq.value = 'metal_fab';
                    } else if (catLower.includes('interior') || catLower.includes('furniture') || catLower.includes('wardrobe') || catLower.includes('cabinet')) {
                        serviceReq.value = 'interior';
                    } else if (catLower.includes('commercial') || catLower.includes('office')) {
                        serviceReq.value = 'commercial';
                    } else {
                        serviceReq.value = 'residential';
                    }
                    serviceReq.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // Scroll smoothly to the form and highlight
                const formSection = document.getElementById('contact-form');
                if (formSection) {
                    setTimeout(() => {
                        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        const formWrapper = contactForm.closest('.cp-form-wrapper');
                        if (formWrapper) {
                            formWrapper.style.transition = 'box-shadow 0.6s ease, border-color 0.6s ease';
                            formWrapper.style.borderColor = 'var(--clr-gold)';
                            formWrapper.style.boxShadow = '0 0 35px rgba(244, 209, 148, 0.25)';
                            setTimeout(() => {
                                formWrapper.style.boxShadow = '';
                            }, 3000);
                        }
                    }, 300);
                }
            }
        } catch (err) {
            console.warn('[ATG] Could not prefill design enquiry:', err);
        }
    }

    // --- Newsletter Submission ---
    const newsletterForm = document.getElementById('cpNewsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]');
            if (email.checkValidity()) {
                newsletterForm.classList.add('success');
                email.value = '';
            }
        });
    }
});
