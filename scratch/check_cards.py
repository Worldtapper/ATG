import re

pages = ['index.html', 'services.html', 'gallery.html', 'company.html', 'insights.html', 'favourites.html']

for page in pages:
    with open(page, 'r', encoding='utf-8') as f:
        html = f.read()
    
    sections = re.findall(r'<section[^>]*>[\s\S]*?</section>', html)
    print(f"\n==================== {page} (length {len(html)}) ====================")
    for i, s in enumerate(sections):
        id_match = re.search(r'id=[\'"]([^\'"]+)[\'"]', s)
        class_match = re.search(r'class=[\'"]([^\'"]+)[\'"]', s)
        h2 = re.search(r'<h[1-3][^>]*>([\s\S]*?)</h[1-3]>', s)
        h2_text = re.sub(r'<[^>]+>', '', h2.group(1)).strip() if h2 else 'No heading'
        sec_id = id_match.group(1) if id_match else ''
        sec_cls = class_match.group(1) if class_match else ''
        print(f"  Sec {i+1}: id='{sec_id}' class='{sec_cls}' | Heading: {h2_text[:40]}")
