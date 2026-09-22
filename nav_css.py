import re

with open('c:/Users/bonva/OneDrive/Desktop/portafolio/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace the mobile .top-nav rule
old_rule = '''    .top-nav {
        flex-direction: column;
        gap: 2vh;
        align-items: center;
        text-align: center;
    }'''

new_rule = '''    .top-nav {
        flex-direction: row;
        justify-content: space-between;
        font-size: 9px;
        gap: 2vw;
    }'''

css = css.replace(old_rule, new_rule)

with open('c:/Users/bonva/OneDrive/Desktop/portafolio/style.css', 'w', encoding='utf-8') as f:
    f.write(css)
