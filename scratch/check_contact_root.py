with open('CSS/contact.css', 'r', encoding='utf-8') as f:
    css = f.read()

print("Original CSS/contact.css length:", len(css))
# Check if :root exists
print(":root in contact.css:", ':root' in css)
if ':root' in css:
    pos = css.find(':root')
    print(css[pos:pos+300])
