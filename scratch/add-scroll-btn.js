const fs = require('fs');

let html = fs.readFileSync('services.html', 'utf8');

const target = '    </main>';
const scrollBtnHtml = `        <!-- Floating Automatic Scroll Down Button for Showroom & All Designs -->
        <button type="button" class="catalogue-scroll-down-btn" id="catalogueScrollDownBtn" aria-label="Scroll down to designs catalogue">
            <span class="scroll-btn-dot"></span>
            <span class="scroll-btn-text">Scroll to Designs</span>
            <span class="scroll-btn-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
            </span>
        </button>
    </main>`;

if (html.includes(target)) {
    html = html.replace(target, scrollBtnHtml);
    fs.writeFileSync('services.html', html, 'utf8');
    console.log('SUCCESS: Inserted catalogueScrollDownBtn in services.html');
} else {
    console.error('Target not found in services.html');
}

