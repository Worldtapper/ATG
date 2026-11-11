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
    nav_match = re.search(r'<header[^>]*class=[\'"][^\'"]*navbar-wrapper[^\'"]*[\'"][^>]*>[\s\S]*?</header>', html)
    if not nav_match:
        print(f"[{p}] NO NAVBAR WRAPPER FOUND!")
        continue
    nav_html = nav_match.group(0)
    links = re.findall(r'<a[^>]+href=[\'"]([^\'"]+)[\'"][^>]*class=[\'"][^\'"]*nav-link[^\'"]*[\'"][^>]*>([\s\S]*?)</a>', nav_html)
    print(f"[{p}] Navbar length: {len(nav_html)} | Nav links: {[(l[0], re.sub(r'<[^>]+>', '', l[1]).strip()) for l in links]}")
    cta = re.search(r'start-your-project\.html', nav_html)
    toggle = re.search(r'mobileMenuToggle', nav_html)
    print(f"      CTA found: {bool(cta)} | Toggle found: {bool(toggle)}")
