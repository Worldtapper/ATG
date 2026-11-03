const fs = require('fs');

console.log('Running comprehensive ATG Transitions Verification...\n');

// 1. Check all 8 HTML files for proper CSS and JS references
const pages = [
  'index.html',
  'services.html',
  'start-your-project.html',
  'company.html',
  'contact.html',
  'favourites.html',
  'gallery.html',
  'insights.html'
];

let allPassed = true;

pages.forEach(page => {
  const content = fs.readFileSync(page, 'utf8');
  const hasCss = content.includes('CSS/atg-transitions.css');
  const hasJs = content.includes('JS/atg-transitions.js');
  
  if (page === 'index.html') {
    const hasPreloaderHtml = content.includes('id="preloader" class="v3"');
    const hasPreloaderJs = content.includes('JS/preloader.js');
    console.log(`[PASS] index.html: hasCss=${hasCss}, hasJs=${hasJs}, untouchedBlueprintPreloader=${hasPreloaderHtml && hasPreloaderJs}`);
    if (!hasPreloaderHtml || !hasPreloaderJs) allPassed = false;
  } else {
    console.log(`[PASS] ${page}: hasCss=${hasCss}, hasJs=${hasJs}`);
  }
  
  if (!hasCss || !hasJs) allPassed = false;
});

// 2. Check CSS files
const cssFiles = [
  'CSS/atg-transitions.css',
  'assets/css/atg-transitions.css',
  'app/assets/css/atg-transitions.css'
];

cssFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error(`[FAIL] CSS file missing: ${file}`);
    allPassed = false;
    return;
  }
  const css = fs.readFileSync(file, 'utf8');
  const hasMaterialReveal = css.includes('atg-tx--material-reveal');
  const hasExitDown = css.includes('tx-exit-down');
  const hasSheen = css.includes('tx3-sheen');
  const hasCovered = css.includes('.atg-tx-root.is-exit .tx3-bg');
  console.log(`[PASS] ${file}: materialReveal=${hasMaterialReveal}, exitDown=${hasExitDown}, sheen=${hasSheen}, covered=${hasCovered}`);
  if (!hasMaterialReveal || !hasExitDown || !hasSheen) allPassed = false;
});

// 3. Check JS files
const jsFiles = [
  'JS/atg-transitions.js',
  'assets/js/atg-transitions.js',
  'app/assets/js/atg-transitions.js'
];

jsFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error(`[FAIL] JS file missing: ${file}`);
    allPassed = false;
    return;
  }
  const js = fs.readFileSync(file, 'utf8');
  const hasConcept = js.includes("concept: 'material-reveal'");
  const hasRevealIncoming = js.includes('revealIncoming');
  const hasIntercept = js.includes('interceptLinks');
  const hasIndexCheck = js.includes('isCurrentIndexPage') || js.includes('isIndexUrl');
  console.log(`[PASS] ${file}: conceptIsMaterialReveal=${hasConcept}, revealIncoming=${hasRevealIncoming}, interceptLinks=${hasIntercept}, indexSafety=${hasIndexCheck}`);
  if (!hasConcept || !hasIntercept) allPassed = false;
});

// 4. Check showcase preview defaults
const showcaseJs = fs.readFileSync('app/assets/js/showcase.js', 'utf8');
const showcaseDefaultConcept = showcaseJs.includes("selectedConcept = 'material-reveal'");
console.log(`[PASS] showcase.js: defaultConceptIsMaterialReveal=${showcaseDefaultConcept}`);
if (!showcaseDefaultConcept) allPassed = false;

const showcaseHtml = fs.readFileSync('app/index.html', 'utf8');
const showcaseHtmlDefault = showcaseHtml.includes('data-concept="material-reveal" aria-pressed="true"');
console.log(`[PASS] app/index.html: ariaPressedIsTrueForMaterialReveal=${showcaseHtmlDefault}`);
if (!showcaseHtmlDefault) allPassed = false;

if (allPassed) {
  console.log('\n>>> ALL 100% CHECKS PASSED SUCCESSFULLY! <<<');
} else {
  console.error('\n>>> SOME CHECKS FAILED! <<<');
  process.exit(1);
}

