import os

pages = [
    'index.html',
    'services.html',
    'start-your-project.html',
    'company.html',
    'contact.html',
    'favourites.html',
    'gallery.html',
    'insights.html'
]

print("=== ATG TRANSITIONS VERIFICATION ===")
all_passed = True
for page in pages:
    with open(page, 'r', encoding='utf-8') as f:
        c = f.read()
    has_css = 'CSS/atg-transitions.css' in c
    has_js = 'JS/atg-transitions.js' in c
    if page == 'index.html':
        has_preloader_html = 'id="preloader"' in c and 'class="v3"' in c
        has_preloader_js = 'JS/preloader.js' in c
        status = has_css and has_js and has_preloader_html and has_preloader_js
        print(f"[{'PASS' if status else 'FAIL'}] index.html: hasCss={has_css}, hasJs={has_js}, bpPreloader={has_preloader_html and has_preloader_js}")
    else:
        status = has_css and has_js
        print(f"[{'PASS' if status else 'FAIL'}] {page}: hasCss={has_css}, hasJs={has_js}")
    if not status:
        all_passed = False

# Check CSS files
for css_file in ['CSS/atg-transitions.css', 'assets/css/atg-transitions.css']:
    with open(css_file, 'r', encoding='utf-8') as f:
        c = f.read()
    has_reveal = 'atg-tx--material-reveal' in c
    has_sheen = 'tx3-sheen' in c
    has_exit = 'tx-exit-down' in c
    status = has_reveal and has_sheen and has_exit
    print(f"[{'PASS' if status else 'FAIL'}] {css_file}: materialReveal={has_reveal}, sheen={has_sheen}, exitDown={has_exit}")
    if not status:
        all_passed = False

# Check JS files
for js_file in ['JS/atg-transitions.js', 'assets/js/atg-transitions.js']:
    with open(js_file, 'r', encoding='utf-8') as f:
        c = f.read()
    has_concept = "concept: 'material-reveal'" in c
    has_reveal = 'revealIncoming' in c
    has_intercept = 'interceptLinks' in c
    status = has_concept and has_reveal and has_intercept
    print(f"[{'PASS' if status else 'FAIL'}] {js_file}: concept=material-reveal ({has_concept}), revealIncoming={has_reveal}, intercept={has_intercept}")
    if not status:
        all_passed = False

if all_passed:
    print("\n>>> ALL TRANSITIONS CHECKS PASSED 100%! <<<")
else:
    print("\n>>> CHECKS FAILED! <<<")
