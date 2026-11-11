with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Inspect services-section
s5 = re.search(r'<section[^>]*class=[\'"][^\'"]*services-section[\s\S]*?</section>', text)
if s5:
    print("=== SERVICES SECTION (INDEX) ===")
    print(s5.group(0)[:1200])

# Inspect portfolio-section
s6 = re.search(r'<section[^>]*class=[\'"][^\'"]*portfolio-section[\s\S]*?</section>', text)
if s6:
    print("\n=== PORTFOLIO SECTION (INDEX) ===")
    print(s6.group(0)[:1200])
