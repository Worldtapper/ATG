const fs = require('fs');

let css = fs.readFileSync('CSS/start-your-project.css', 'utf8');

const addition = `

@media (max-width: 480px) {
    .syp-hero {
        padding: 90px 16px 40px;
    }

    .syp-hero-title {
        font-size: clamp(1.85rem, 8vw, 2.2rem);
    }

    .syp-hero-desc {
        font-size: 1rem;
        margin-bottom: 24px;
    }

    .syp-form-body {
        padding: 20px 14px;
    }

    .syp-step-header {
        padding: 18px 14px;
    }

    .syp-step-title {
        font-size: 1.3rem;
    }

    .syp-handling-card {
        padding: 20px 16px;
    }

    .syp-source-bar {
        padding: 14px 12px;
    }

    .syp-step-actions .btn {
        width: 100%;
        min-height: 44px;
    }
}

@media (max-width: 360px) {
    .syp-hero-title {
        font-size: 1.7rem;
    }

    .syp-section-title {
        font-size: 1.65rem;
    }
}
`;

if (!css.includes('clamp(1.85rem, 8vw, 2.2rem)')) {
    css += addition;
    fs.writeFileSync('CSS/start-your-project.css', css, 'utf8');
    console.log('Successfully appended responsive media queries to CSS/start-your-project.css');
} else {
    console.log('Already includes responsive media queries in CSS/start-your-project.css');
}

