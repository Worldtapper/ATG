const fs = require('fs');

let css = fs.readFileSync('CSS/favourites.css', 'utf8');

const addition = `

@media (max-width: 480px) {
    .favourites-page {
        padding-top: 75px;
    }

    .favourites-header-section {
        padding: 24px 14px 16px;
    }

    .fav-header-container {
        padding: 22px 16px;
        gap: 18px;
    }

    .fav-title {
        font-size: clamp(1.75rem, 7.5vw, 2.2rem);
    }

    .fav-subtitle {
        font-size: 0.92rem;
    }

    .fav-header-controls {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
        width: 100%;
    }

    .fav-count-pill,
    .clear-all-favs-btn {
        width: 100%;
        justify-content: center;
        min-height: 42px;
    }

    .favourites-content-section {
        padding: 10px 14px 50px;
    }

    .fav-empty-state {
        padding: 50px 18px;
    }
}

@media (max-width: 360px) {
    .fav-title {
        font-size: 1.6rem;
    }
}
`;

if (!css.includes('clamp(1.75rem, 7.5vw, 2.2rem)')) {
    css += addition;
    fs.writeFileSync('CSS/favourites.css', css, 'utf8');
    console.log('Successfully appended responsive media queries to CSS/favourites.css');
} else {
    console.log('Already includes responsive media queries in CSS/favourites.css');
}

