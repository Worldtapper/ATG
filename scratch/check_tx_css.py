with open('app/assets/css/atg-transitions.css', 'r', encoding='utf-8') as f:
    app_css = f.read()
with open('CSS/atg-transitions.css', 'r', encoding='utf-8') as f:
    prod_css = f.read()

import re

# Find Concept 03 / Material Reveal section in both
app_tx3_idx = app_css.find('CONCEPT 03: MATERIAL REVEAL')
prod_tx3_idx = prod_css.find('CONCEPT 03: MATERIAL REVEAL')

print("app has Concept 03:", app_tx3_idx != -1)
print("prod has Concept 03:", prod_tx3_idx != -1)

# Check sheen animation, pattern, wordmark, caption, rules, exit motion in prod_css
for key in ['tx3-sheen', 'tx3-pattern', 'tx3-wordmark', 'tx3-caption', 'tx3-rule', 'tx-exit-down', 'tx3-bg']:
    print(f"prod has '{key}': {key in prod_css}")
