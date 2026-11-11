with open('CSS/contact.css', 'r', encoding='utf-8') as f:
    c = f.read()

import re

def print_section(title, pattern):
    print(f"=== {title} ===")
    matches = re.findall(pattern, c)
    for m in matches[:10]:
        print(m)
        print("-" * 30)

print_section("FORM WRAPPER & SPLIT", r'(\.cp-(?:form|split|input|error|checkbox)[^{]*\{[^}]*\})')
