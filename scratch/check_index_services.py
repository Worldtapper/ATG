with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
s5 = re.search(r'<section[^>]*class=[\'"][^\'"]*services-section[\s\S]*?</section>', text)
if s5:
    cards = re.findall(r'<a[^>]+class=[\'"][^\'"]*service-card[^\'"]*[\'"][^>]*>[\s\S]*?</a>', s5.group(0))
    print(f"Total service cards in index.html: {len(cards)}")
    for c in cards:
        title = re.search(r'<h3[^>]*>([\s\S]*?)</h3>', c)
        href = re.search(r'href=[\'"]([^\'"]*)[\'"]', c)
        print(f"  - Title: {title.group(1).strip() if title else 'N/A'} | href: {href.group(1) if href else 'N/A'}")
