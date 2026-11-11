with open('company.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
pos_app = html.find('id="approach"')
pos_comm = html.find('id="commitment"')

approach_html = html[pos_app:pos_comm]
print(f"Total approach section length: {len(approach_html)}")
panes = re.findall(r'<div class="co-stage-pane[^>]*>[\s\S]*?</div>\s*</div>\s*</div>', approach_html)
print(f"Found panes: {len(panes)}")
