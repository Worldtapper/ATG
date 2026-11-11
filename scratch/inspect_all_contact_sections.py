with open('contact.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
sections = re.findall(r'<section[^>]*>[\s\S]*?</section>', text)

for i, s in enumerate(sections):
    cls = re.search(r'class=["\']([^"\']+)["\']', s)
    sec_id = re.search(r'id=["\']([^"\']+)["\']', s)
    print(f"\n================ Section {i+1} ================")
    print(f"ID: {sec_id.group(1) if sec_id else 'None'}")
    print(f"Class: {cls.group(1) if cls else 'None'}")
    # print all inner class names
    classes = set(re.findall(r'class=["\']([^"\']+)["\']', s))
    print(f"Classes used ({len(classes)}): {classes}")
