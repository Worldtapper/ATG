with open('CSS/style.css', 'r', encoding='utf-8') as f:
    style = f.read()

import re
root = re.search(r':root\s*\{[^}]*\}', style)
if root:
    print(root.group(0))
