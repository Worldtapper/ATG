/**
 * ATG Metal Works & Interiors — Company Overview Interactions
 * Handles scrollspy subnav, scroll animations, and the New-Gen Pinned Scroll Scrubber
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Intersection Observer for Fade-Up Animations --- */
    const animatedElements = document.querySelectorAll('.co-fade-up');
    
    if ('IntersectionObserver' in window) {
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
    } else {
        // Fallback if IntersectionObserver is not available
        animatedElements.forEach(el => el.classList.add('in-view'));
    }

    /* --- 2. Internal Sticky Sub-Nav ScrollSpy --- */
    const subnavLinks = document.querySelectorAll('.co-subnav-link');
    const sections = Array.from(subnavLinks).map(link => {
        const targetId = link.getAttribute('href');
        return document.querySelector(targetId);
    }).filter(Boolean);

    function updateActiveSubnav() {
        const scrollPosition = window.scrollY + 200; // offset for sticky header

        sections.forEach((section, index) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                subnavLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('is-active');
                    } else {
                        link.classList.remove('is-active');
                    }
                });
            }
        });
    }

    // Smooth scroll for sub-nav links
    subnavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const targetOffset = targetElement.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({
                    top: targetOffset,
                    behavior: 'smooth'
                });
                // Immediately set active state on click
                subnavLinks.forEach(l => l.classList.remove('is-active'));
                link.classList.add('is-active');
            }
        });
    });

    /* --- 3. New Gen Pinned Scroll Scrubber (Our Approach) --- */
    const approachContainer = document.getElementById('approach') || document.getElementById('approachScrollContainer') || document.querySelector('.co-approach-scroll-container');
    const stagePanes = document.querySelectorAll('.co-stage-pane');
    const imageLayers = document.querySelectorAll('.co-stage-img-layer');
    const stepperBtns = document.querySelectorAll('.co-step-btn');
    const scrubFill = document.getElementById('approachScrubFill');
    const activeStepNum = document.getElementById('activeStepNum');
    const approachImgPhase = document.getElementById('approachImgPhase');
    const approachStudioCode = document.getElementById('approachStudioCode');

    const stagePhases = {
        1: "Phase 01 • Discovery",
        2: "Phase 02 • Engineering",
        3: "Phase 03 • Fabrication",
        4: "Phase 04 • Installation"
    };

    let currentStep = 1;
    const totalSteps = 4;

    function setApproachStep(stepIndex) {
        if (stepIndex === currentStep) return;
        currentStep = stepIndex;

        // Update active classes on stage text cards with smooth depth transition
        stagePanes.forEach(pane => {
            const step = parseInt(pane.getAttribute('data-step'), 10);
            if (step === currentStep) {
                pane.classList.add('is-active');
            } else {
                pane.classList.remove('is-active');
            }
        });

        // Update active image layers with crossfade and scale
        imageLayers.forEach(layer => {
            const step = parseInt(layer.getAttribute('data-step'), 10);
            if (step === currentStep) {
                layer.classList.add('is-active');
            } else {
                layer.classList.remove('is-active');
            }
        });

        // Update stepper button indicators (active and passed stages)
        stepperBtns.forEach(btn => {
            const step = parseInt(btn.getAttribute('data-step'), 10);
            const isActive = (step === currentStep);
            const isPassed = (step < currentStep);
            btn.classList.toggle('is-active', isActive);
            btn.classList.toggle('is-passed', isPassed);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Update counter label (01, 02, 03, 04)
        if (activeStepNum) {
            activeStepNum.textContent = String(currentStep).padStart(2, '0');
        }

        // Dynamically update visual window badge text & technical readout
        if (approachImgPhase && stagePhases[currentStep]) {
            approachImgPhase.textContent = stagePhases[currentStep];
        }
        if (approachStudioCode) {
            approachStudioCode.textContent = `STAGE 0${currentStep} OF 04 • ATG SPEC`;
        }
    }

    function handleApproachScroll() {
        if (!approachContainer) return;

        const containerHeight = approachContainer.offsetHeight;
        const viewportHeight = window.innerHeight;
        const scrollDistance = containerHeight - viewportHeight;

        if (scrollDistance <= 0) return; // on mobile/small screens with auto height

        const rect = approachContainer.getBoundingClientRect();

        // Check if viewport is within the pinned scroll container range
        if (rect.top <= 0 && rect.bottom >= viewportHeight) {
            const scrolledWithin = -rect.top;
            const progress = Math.min(Math.max(scrolledWithin / scrollDistance, 0), 1);

            // Update scrub fill bar width smoothly in real time
            if (scrubFill) {
                const fillPercent = Math.min(100, Math.max(8, progress * 100));
                scrubFill.style.width = `${fillPercent}%`;
            }

            // Map progress to steps 1..4
            let step = Math.min(Math.floor(progress * totalSteps) + 1, totalSteps);
            setApproachStep(step);
        } else if (rect.top > 0) {
            // Before container
            if (scrubFill) scrubFill.style.width = '8%';
            setApproachStep(1);
        } else if (rect.bottom < viewportHeight) {
            // Past container
            if (scrubFill) scrubFill.style.width = '100%';
            setApproachStep(4);
        }
    }

    // Allow user to click any step button to jump directly with smooth scroll
    stepperBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetStep = parseInt(btn.getAttribute('data-step'), 10);
            setApproachStep(targetStep);

            if (approachContainer) {
                const containerTop = approachContainer.getBoundingClientRect().top + window.scrollY;
                const containerHeight = approachContainer.offsetHeight;
                const scrollDistance = containerHeight - window.innerHeight;
                if (scrollDistance > 0) {
                    const stepFraction = (targetStep - 0.5) / totalSteps;
                    const targetScroll = containerTop + (scrollDistance * stepFraction);
                    
                    window.scrollTo({
                        top: targetScroll,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    /* --- 4. Unified Optimized Scroll Handler --- */
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveSubnav();
                handleApproachScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial triggers
    updateActiveSubnav();
    handleApproachScroll();
});

