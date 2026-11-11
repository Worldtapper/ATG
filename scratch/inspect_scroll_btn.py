with open('contact.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
btn = re.search(r'<button[^>]*class=\"[^\"]*scroll-top[^\"]*\"[\s\S]*?</button>', html)
if btn:
    print("Scroll btn:", btn.group(0))

with open('JS/contact.js', 'r', encoding='utf-8') as f:
    js = f.read()

for line in js.splitlines():
    if 'scroll' in line.lower() or 'btn' in line.lower():
        print("contact.js:", line[:100])
