with open('CSS/style.css', 'r', encoding='utf-8') as f:
    style = f.read()

import re
matches = re.findall(r'(\.scroll-top-btn[^{]*\{[^}]*\})', style)
for m in matches:
    print(m)
