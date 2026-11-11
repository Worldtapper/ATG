import re

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

for p in pages:
    with open(p, 'r', encoding='utf-8') as f:
        html = f.read()
    
    menu = re.search(r'<div[^>]*class=[\'"][^\'"]*mobile-menu[^\'"]*[\'"][^>]*>[\s\S]*?</div>\s*</div>', html)
    toggle = re.search(r'<button[^>]*class=[\'"][^\'"]*mobile-menu-toggle[^\'"]*[\'"][^>]*>', html)
    print(f"\n[{p}]")
    print(f"  toggle found: {bool(toggle)}")
    if toggle:
        print(f"    toggle id: {toggle.group(0)}")
    has_menu = 'id="mobileMenu"' in html or "id='mobileMenu'" in html
    print(f"  has mobileMenu id: {has_menu}")
    has_close = 'id="closeMenuBtn"' in html or "id='closeMenuBtn'" in html
    print(f"  has closeMenuBtn id: {has_close}")
    has_dropdown = 'class="mobile-dropdown' in html or 'data-toggle="dropdown"' in html or 'mobile-nav-item' in html
    print(f"  mobile dropdown/nav items present: {has_dropdown}")
