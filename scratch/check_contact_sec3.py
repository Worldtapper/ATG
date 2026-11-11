with open('contact.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
sec3 = re.search(r'<section[^>]*id=["\']contact-form["\'][\s\S]*?</section>', text)
if sec3:
    print(sec3.group(0))
