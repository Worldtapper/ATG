import re, glob

css_files = glob.glob('CSS/*.css')
print("=== SCAN FOR FIXED WIDTHS > 300px ===")
for f in css_files:
    with open(f, 'r', encoding='utf-8') as fp:
        lines = fp.readlines()
    
    for i, line in enumerate(lines):
        m = re.search(r'(?:min-width|width)\s*:\s*([3-9][0-9]{2}px|[1-9][0-9]{3}px)', line)
        if m:
            # Check if inside a media query or if it has max-width
            val = m.group(1)
            # print snippet
            snippet = line.strip()
            # print surrounding selector
            selector = 'unknown'
            for j in range(i, max(-1, i-15), -1):
                if '{' in lines[j]:
                    selector = lines[j].strip()
                    break
            print(f"{f}:{i+1} [{val}] {selector} -> {snippet}")
