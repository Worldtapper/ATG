import glob, re

for f in ['index.html', 'services.html', 'company.html', 'gallery.html', 'contact.html']:
    with open(f, 'r', encoding='utf-8') as file:
        c = file.read()
        m = re.findall(r'<button[^>]*scroll-top[^>]*>', c)
        print(f, m)
