with open('contact.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
form_match = re.search(r'<form[^>]*class=["\']cp-form["\'][^>]*>[\s\S]*?</form>', text)
if not form_match:
    form_match = re.search(r'<form[\s\S]*?</form>', text)

if form_match:
    print("Found form:")
    print(form_match.group(0))
else:
    print("No form found!")
