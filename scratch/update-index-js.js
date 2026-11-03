const fs = require('fs');

let js = fs.readFileSync('JS/index.js', 'utf8');

const targetBlock = `    /* --- Mobile Menu Toggle --- */
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    function toggleMenu() {
        mobileMenu.classList.toggle('open');
        // Prevent body scroll when menu is open
        if (mobileMenu.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    mobileMenuToggle.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);

    /* --- Mobile Accordion --- */
    const accordionBtns = document.querySelectorAll('.mobile-accordion-btn');

    accordionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
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
    });`;

const replacementBlock = `    /* --- Mobile Menu Toggle & Navigation (Universal & Accessible) --- */
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
    });`;

// Normalize CRLF
const normJs = js.replace(/\r\n/g, '\n');
const normTarget = targetBlock.replace(/\r\n/g, '\n');
const normReplacement = replacementBlock.replace(/\r\n/g, '\n');

if (normJs.includes(normTarget)) {
    const updated = normJs.replace(normTarget, normReplacement);
    fs.writeFileSync('JS/index.js', updated.replace(/\n/g, '\r\n'), 'utf8');
    console.log('SUCCESS: Updated mobile menu logic in JS/index.js');
} else {
    console.error('ERROR: Could not find targetBlock in JS/index.js');
}

