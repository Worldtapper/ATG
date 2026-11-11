import re

with open('contact.html', 'r', encoding='utf-8') as f:
    html = f.read()

form = re.search(r'<form[\s\S]*?</form>', html)
if form:
    print(form.group(0))
