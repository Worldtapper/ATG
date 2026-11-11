with open('insights.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
cards = re.findall(r'<article[^>]*class=[\'"][^\'"]*ip-card[^\'"]*[\'"][^>]*>[\s\S]*?</article>', text)
print(f"Total ip-cards in insights.html: {len(cards)}")
for c in cards[:3]:
    h3 = re.search(r'<h3[^>]*>([\s\S]*?)</h3>', c)
    btn = re.search(r'<(?:a|button)[^>]*class=[\'"][^\'"]*(?:btn|read|link)[^\'"]*[\'"][^>]*>([\s\S]*?)</(?:a|button)>', c)
    print("Title:", h3.group(1).strip() if h3 else "N/A")
    print("Action:", btn.group(0) if btn else "None")
