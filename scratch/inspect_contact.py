import re

with open('contact.html', 'r', encoding='utf-8') as f:
    html = f.read()

sections = re.findall(r'<section[^>]*>', html)
print(f"Total sections found: {len(sections)}")
for s in sections:
    print("  ", s)

form = re.search(r'<form[\s\S]*?</form>', html)
if form:
    print("\n--- FORM TAG ---")
    print(form.group(0)[:500])
