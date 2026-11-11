import os, re, glob

css_files = glob.glob('CSS/*.css')
print("=== CSS FILES AND MEDIA QUERIES ===")
for f in css_files:
    with open(f, 'r', encoding='utf-8') as fp:
        css = fp.read()
    
    # Find all media queries
    mqs = re.findall(r'@media\s*\(([^)]+)\)', css)
    # Find any potentially problematic fixed widths
    fixed_widths = re.findall(r'width\s*:\s*([0-9]{3,4}px)', css)
    # Find overflow-x
    overflows = re.findall(r'overflow-x\s*:\s*([^;]+);', css)
    
    print(f"\n[{f}] ({len(css)} bytes)")
    print(f"  Media queries ({len(mqs)}): {set(mqs)}")
    print(f"  Fixed widths >= 100px: {set(fixed_widths[:10])}")
    print(f"  overflow-x rules: {set(overflows)}")
