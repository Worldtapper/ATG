import os, re

pages = [
    'index.html',
    'services.html',
    'gallery.html',
    'company.html',
    'insights.html',
    'contact.html',
    'start-your-project.html',
    'favourites.html'
]

print("=== PAGE AUDIT ===")
for p in pages:
    if not os.path.exists(p):
        print(f"MISSING: {p}")
        continue
    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()

    css_links = re.findall(r'<link[^>]+rel=[\'"]stylesheet[\'"][^>]*>', html, re.IGNORECASE)
    js_scripts = re.findall(r'<script[^>]+src=[\'"][^\'"]+[\'"][^>]*>', html, re.IGNORECASE)
    has_tx_css = any('atg-transitions.css' in l for l in css_links)
    has_tx_js = any('atg-transitions.js' in s for s in js_scripts)
    has_preloader_div = bool(re.search(r'id=[\'"]preloader[\'"]', html))
    has_hamburger = bool(re.search(r'hamburger|nav-toggle|mobile-toggle|menu-toggle', html, re.IGNORECASE))
    has_mobile_menu = bool(re.search(r'mobile-menu|mobileMenu|nav-mobile', html, re.IGNORECASE))
    has_modal = bool(re.search(r'modal', html, re.IGNORECASE))

    print(f"\n[{p}]")
    print(f"  tx_css: {has_tx_css}")
    print(f"  tx_js: {has_tx_js}")
    print(f"  #preloader element: {has_preloader_div}")
    print(f"  hamburger/toggle: {has_hamburger}")
    print(f"  mobile menu: {has_mobile_menu}")
    print(f"  modal markup in html: {has_modal}")
    print(f"  CSS files loaded:")
    for l in css_links:
        href = re.search(r'href=[\'"]([^\'"]+)[\'"]', l)
        if href:
            print(f"    - {href.group(1)}")
    print(f"  JS files loaded:")
    for s in js_scripts:
        src = re.search(r'src=[\'"]([^\'"]+)[\'"]', s)
        if src:
            print(f"    - {src.group(1)}")
