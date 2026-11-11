with open('JS/favourites.js', 'r', encoding='utf-8') as f:
    text = f.read()

print("favourites.js length:", len(text))
print(text[:1500])
