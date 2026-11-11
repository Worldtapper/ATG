const fs = require('fs');

let html = fs.readFileSync('start-your-project.html', 'utf8');

// 1. Add services-division.css if not present
if (!html.includes('CSS/services-division.css')) {
    html = html.replace(
        '<link rel="stylesheet" href="CSS/start-your-project.css">',
        '<link rel="stylesheet" href="CSS/services-division.css">\r\n    <link rel="stylesheet" href="CSS/start-your-project.css">'
    );
}

// 2. Add Division Selector right before <!-- Active Design Paths Tabs -->
const divPickerHtml = `                <!-- Division Selector: Metal Fabrication vs Interiors -->
                <div class="syp-division-picker-section" id="divisionPickerSection">
                    <div class="syp-section-eyebrow">CHOOSE YOUR DIVISION</div>
                    <div class="syp-division-grid" role="radiogroup" aria-label="Select Project Division">
                        <div class="syp-division-choice is-active" role="radio" aria-checked="true" tabindex="0" data-division="metal" id="choiceDivMetal">
                            <div class="syp-div-choice-info">
                                <span class="syp-div-choice-badge">Division 01</span>
                                <h3 class="syp-div-choice-title">Metal Fabrication</h3>
                                <p class="syp-div-choice-sub">Gates, Doors, Floating Stairs, Railings, Structural Steel &amp; Architectural Glazing</p>
                            </div>
                            <div class="syp-div-radio-indicator"></div>
                        </div>
                        <div class="syp-division-choice" role="radio" aria-checked="false" tabindex="0" data-division="interiors" id="choiceDivInteriors">
                            <div class="syp-div-choice-info">
                                <span class="syp-div-choice-badge">Division 02</span>
                                <h3 class="syp-div-choice-title">Interiors</h3>
                                <p class="syp-div-choice-sub">Bespoke Dining Tables, Accent Chairs, Architectural Kitchens, Wardrobes &amp; Commercial Solutions</p>
                            </div>
                            <div class="syp-div-radio-indicator"></div>
                        </div>
                    </div>
                </div>\r\n\r\n`;

if (!html.includes('id="divisionPickerSection"')) {
    html = html.replace(
        '                <!-- Active Design Paths Tabs -->',
        divPickerHtml + '                <!-- Active Design Paths Tabs -->'
    );
}

fs.writeFileSync('start-your-project.html', html, 'utf8');
console.log('Successfully updated start-your-project.html');

