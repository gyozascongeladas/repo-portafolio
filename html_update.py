import re

with open('c:/Users/bonva/OneDrive/Desktop/portafolio/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update top nav
old_top_nav = '''            <nav class="top-nav">
                <div class="nav-col">Artista Visual</div>
                <div class="nav-col">Productor</div>
                <div class="nav-col right-align">Programador Creativo</div>
            </nav>'''

new_top_nav = '''            <nav class="top-nav">
                <div class="nav-col"><a href="#creditos-visuales" class="nav-link">Artista Visual</a></div>
                <div class="nav-col"><a href="#creditos-produccion" class="nav-link">Productor</a></div>
                <div class="nav-col right-align"><a href="#servicios" class="nav-link">Programador Creativo</a></div>
            </nav>'''
html = html.replace(old_top_nav, new_top_nav)

# 2. Add IDs to sections
html = html.replace('<div class="section-header no-border no-top-margin">', '<div class="section-header no-border no-top-margin" id="servicios">')
html = html.replace('<div class="section-header">\n            <h2 class="section-title">Créditos audiovisuales</h2>', '<div class="section-header" id="creditos-visuales">\n            <h2 class="section-title">Créditos audiovisuales</h2>')
html = html.replace('<div class="section-header">\n            <h2 class="section-title">Créditos de Producción</h2>', '<div class="section-header" id="creditos-produccion">\n            <h2 class="section-title">Créditos de Producción</h2>')
# I'll just regex replace the headers if exact match fails due to encoding
html = re.sub(r'<div class="section-header">\s*<h2 class="section-title">Cr.*?ditos audiovisuales</h2>', r'<div class="section-header" id="creditos-visuales">\n            <h2 class="section-title">Créditos audiovisuales</h2>', html)
html = re.sub(r'<div class="section-header">\s*<h2 class="section-title">Cr.*?ditos de Producci.*?n</h2>', r'<div class="section-header" id="creditos-produccion">\n            <h2 class="section-title">Créditos de Producción</h2>', html)

# 3. Update footer URLs
old_footer = '''        <footer class="section-3">
            <nav class="top-nav" style="margin-bottom: 2vh; margin-top: 10vh; border-top: 1px solid currentColor; padding-top: 2vh;">
                <div class="nav-col">VRITNI</div>
                <div class="nav-col"><a href="mailto:contact@yurei.com">EMAIL</a></div>
                <div class="nav-col"><a href="https://instagram.com/yurei9_">INSTAGRAM</a></div>
                <div class="nav-col right-align"><a href="#">SPOTIFY</a></div>
            </nav>
        </footer>'''

new_footer = '''        <footer class="section-3">
            <nav class="top-nav" style="margin-bottom: 2vh; margin-top: 10vh; border-top: 1px solid currentColor; padding-top: 2vh;">
                <div class="nav-col"><a href="https://www.instagram.com/vritni/" target="_blank">VRITNI</a></div>
                <div class="nav-col"><a href="mailto:ilovevritni@gmail.com">EMAIL</a></div>
                <div class="nav-col"><a href="https://www.instagram.com/yurei9_" target="_blank">INSTAGRAM</a></div>
                <div class="nav-col right-align"><a href="https://open.spotify.com/intl-es/artist/46RVjWubjJa8KED6QQN7vJ?si=_RNVvEyNTN2gse8ovIZ50g" target="_blank">SPOTIFY</a></div>
            </nav>
        </footer>'''
html = html.replace(old_footer, new_footer)

with open('c:/Users/bonva/OneDrive/Desktop/portafolio/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
