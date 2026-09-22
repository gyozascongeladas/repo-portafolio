import re

with open('c:/Users/bonva/OneDrive/Desktop/portafolio/js/webgl.js', 'r', encoding='utf-8') as f:
    js = f.read()

old_scale = '''            const targetScale = 1.0 - (scrollProgress * 0.65);
            textMesh.scale.setScalar(targetScale);'''

new_scale = '''            const baseScale = isMobile ? 0.4 : 1.0;
            const targetScale = baseScale - (scrollProgress * (baseScale - 0.35));
            textMesh.scale.setScalar(targetScale);'''

js = js.replace(old_scale, new_scale)

with open('c:/Users/bonva/OneDrive/Desktop/portafolio/js/webgl.js', 'w', encoding='utf-8') as f:
    f.write(js)
