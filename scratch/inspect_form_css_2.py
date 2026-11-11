with open('CSS/contact.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start = 0
for idx, line in enumerate(lines):
    if '.cp-input-group label' in line:
        start = idx
        break

print(''.join(lines[start:start+100]))
