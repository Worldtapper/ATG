document.addEventListener('DOMContentLoaded', () => {
    /* --- Navbar Scroll Effect --- */
    const navbarWrapper = document.getElementById('navbarWrapper');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbarWrapper.classList.add('scrolled');
        } else {
            navbarWrapper.classList.remove('scrolled');
        }
    });

    /* --- Mobile Menu Toggle & Navigation (Universal & Accessible) --- */
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    function openMobileMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'true');
        if (closeMenuBtn) closeMenuBtn.focus();
    }

    function closeMobileMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        if (mobileMenuToggle) {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.focus();
        }
    }

    function toggleMenu() {
        if (!mobileMenu) return;
        if (mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMenu);
    }
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMobileMenu);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });

    // Close on clicking any link inside the mobile menu
    if (mobileMenu) {
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-item:not(.mobile-accordion-btn), .mobile-accordion-content a, .mobile-menu-footer a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
    }

    /* --- Mobile Accordion --- */
    const accordionBtns = document.querySelectorAll('.mobile-accordion-btn');

    accordionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const accordion = this.parentElement;
            
            // Close other accordions
            document.querySelectorAll('.mobile-accordion').forEach(acc => {
                if (acc !== accordion) {
                    acc.classList.remove('active');
                }
            });

            // Toggle current accordion
            accordion.classList.toggle('active');
        });
    });

    /* --- Stats Intersection & Count Up --- */
    const fadeUpElements = document.querySelectorAll('.fade-up');
    
    const animateNumbers = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If this is a stat item, trigger count up
                const numberElement = entry.target.querySelector('.stat-number');
                if (numberElement && !numberElement.classList.contains('counted')) {
                    const target = +numberElement.getAttribute('data-target');
                    const duration = 2000; // ms
                    const frameDuration = 1000 / 60;
                    const totalFrames = Math.round(duration / frameDuration);
                    let frame = 0;
                    
                    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

                    const counter = setInterval(() => {
                        frame++;
                        const progress = easeOutQuart(frame / totalFrames);
                        const currentCount = Math.round(target * progress);
                        
                        numberElement.innerText = currentCount;
                        
                        if (frame === totalFrames) {
                            clearInterval(counter);
                            numberElement.innerText = target;
                            numberElement.classList.add('counted');
                        }
                    }, frameDuration);
                }
                
                // Unobserve after animating once
                observer.unobserve(entry.target);
            }
        });
    };

    const statsObserver = new IntersectionObserver(animateNumbers, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    fadeUpElements.forEach(el => {
        statsObserver.observe(el);
    });

    /* --- Video Modal Logic --- */
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const closeVideoBtn = document.getElementById('closeVideoBtn');
    const modalVideoTitle = document.getElementById('modalVideoTitle');
    const modalVideoCategory = document.getElementById('modalVideoCategory');
    
    // Select all elements with a data-video attribute
    const videoTriggers = document.querySelectorAll('[data-video]');

    videoTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent anchor jump
            const videoSrc = trigger.getAttribute('data-video');
            const projectTitle = trigger.getAttribute('data-title') || 'Project Showcase';
            const projectCat = trigger.getAttribute('data-category') || 'ATG PROJECT SHOWCASE';

            if (videoSrc && modalVideo) {
                if (modalVideoTitle) modalVideoTitle.textContent = projectTitle;
                if (modalVideoCategory) modalVideoCategory.textContent = projectCat;

                modalVideo.src = videoSrc;
                modalVideo.load();
                videoModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Slight delay to allow modal transition before playing
                setTimeout(() => {
                    modalVideo.play().catch(err => console.log('Autoplay blocked:', err));
                }, 250);
            }
        });
    });

    function closeVideoModal() {
        if (!videoModal) return;
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
        if (modalVideo) {
            modalVideo.pause();
            // Wait for modal transition to finish before clearing src
            setTimeout(() => {
                modalVideo.src = ''; 
            }, 350);
        }
    }

    if (closeVideoBtn) {
        closeVideoBtn.addEventListener('click', closeVideoModal);
    }

    if (videoModal) {
        // Close modal if clicking outside the content (on the backdrop)
        videoModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('video-modal-backdrop') || e.target.classList.contains('video-modal')) {
                closeVideoModal();
            }
        });
    }

    // Keyboard ESC to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });

    /* --- Portfolio Card Live Hover Video Preview --- */
    const portfolioCards = document.querySelectorAll('.portfolio-item');
    portfolioCards.forEach(card => {
        const bgVideo = card.querySelector('.portfolio-bg-video');
        if (bgVideo) {
            card.addEventListener('mouseenter', () => {
                const playPromise = bgVideo.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                        // Autoplay policy or unready state handled gracefully
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                bgVideo.pause();
            });
        }
    });

    /* --- Testimonial Carousel --- */
    const track = document.getElementById('testimonialTrack');
    const nextBtn = document.getElementById('carouselNextBtn');
    const prevBtn = document.getElementById('carouselPrevBtn');

    if (track && nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            const cardWidth = track.querySelector('.testimonial-card').offsetWidth;
            track.scrollBy({ left: cardWidth + 30, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            const cardWidth = track.querySelector('.testimonial-card').offsetWidth;
            track.scrollBy({ left: -(cardWidth + 30), behavior: 'smooth' });
        });
    }

    /* --- Scroll to Top --- */
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 800) {
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

});
