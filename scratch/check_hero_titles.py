import re, glob

css_files = glob.glob('CSS/*.css')
print("=== HERO TITLE FONT SIZES ===")
for f in css_files:
    with open(f, 'r', encoding='utf-8') as fp:
        css = fp.read()
    
    matches = re.findall(r'(\.[a-zA-Z0-9_-]*(?:hero-title|header-title|page-title)[^{]*\{[^}]*\})', css)
    for m in matches:
        font_size = re.search(r'font-size\s*:\s*([^;]+);', m)
        sel = m[:m.find('{')].strip()
        print(f"[{f}] {sel} -> font-size: {font_size.group(1) if font_size else 'N/A'}")
