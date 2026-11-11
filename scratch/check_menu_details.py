with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('id="mobileMenu"')
if start != -1:
    print(text[start-30:start+2500])
