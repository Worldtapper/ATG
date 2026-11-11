import glob

for f in glob.glob('*.html'):
    with open(f, 'r', encoding='utf-8') as file:
        c = file.read()
        if 'scroll-top' in c:
            print(f"{f} has scroll-top button")
