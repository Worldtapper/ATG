with open('CSS/contact.css', 'r', encoding='utf-8') as f:
    text = f.read()

import re
rules = re.findall(r'([^{]+)\{([^}]+)\}', text)
print(f"Total CSS rules in contact.css: {len(rules)}")
# Print rules mentioning fixed widths, positions, paddings in key sections
for selector, body in rules:
    sel = selector.strip()
    if any(k in sel for k in ['scroll-top', 'form', 'split', 'input', 'hero', 'cards', 'office', 'process', 'faq', 'newsletter']):
        if any(b in body for b in ['width', 'padding', 'position', 'bottom', 'right', 'grid-template']):
            print(f"{sel[:45]:45} -> {body.strip().replace(chr(10), ' ')[:90]}")
