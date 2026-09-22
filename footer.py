import re

with open('c:/Users/bonva/OneDrive/Desktop/portafolio/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

footer_pattern = r'<footer class="section-3">.*?</footer>'
new_footer = '''<footer class="section-3">
            <nav class="top-nav" style="margin-bottom: 2vh; margin-top: 10vh; border-top: 1px solid currentColor; padding-top: 2vh;">
                <div class="nav-col">VRITNI</div>
                <div class="nav-col"><a href="mailto:contact@yurei.com">EMAIL</a></div>
                <div class="nav-col"><a href="https://instagram.com/yurei9_">INSTAGRAM</a></div>
                <div class="nav-col right-align"><a href="#">SPOTIFY</a></div>
            </nav>
        </footer>'''

html = re.sub(footer_pattern, new_footer, html, flags=re.DOTALL)

with open('c:/Users/bonva/OneDrive/Desktop/portafolio/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
