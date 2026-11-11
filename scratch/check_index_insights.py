with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
s10 = re.search(r'<section[^>]*class=[\'"][^\'"]*insights-section[\s\S]*?</section>', text)
if s10:
    print("=== INSIGHTS SECTION (INDEX) ===")
    print(s10.group(0)[:1200])
