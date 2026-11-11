with open('company.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
pos_app = html.find('id="approach"')
print("approach found at:", pos_app)
pos_comm = html.find('id="commitment"')
print("commitment found at:", pos_comm)
print("\nCurrent section markup:")
print(html[pos_app-50:pos_app+800])
