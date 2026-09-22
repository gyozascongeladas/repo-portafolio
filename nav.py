import re

with open('c:/Users/bonva/OneDrive/Desktop/portafolio/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

nav_pattern = r'<nav class="top-nav">.*?</nav>'
new_nav = '''<nav class="top-nav">
                <div class="nav-col">Artista Visual</div>
                <div class="nav-col">Productor</div>
                <div class="nav-col right-align">Programador Creativo</div>
            </nav>'''

html = re.sub(nav_pattern, new_nav, html, flags=re.DOTALL)

with open('c:/Users/bonva/OneDrive/Desktop/portafolio/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
