import re

with open('c:/Users/bonva/OneDrive/Desktop/portafolio/js/webgl.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Remove logoMesh declaration
js = re.sub(r'let logoMesh;\n', '', js)
js = re.sub(r'logoMesh = new THREE.Group\(\);.*?\n\s+scene\.add\(logoMesh\);', '', js, flags=re.DOTALL)
js = re.sub(r'if \(logoMesh\) \{.*?\n\s+\}\n\s+\}', '', js, flags=re.DOTALL)

with open('c:/Users/bonva/OneDrive/Desktop/portafolio/js/webgl.js', 'w', encoding='utf-8') as f:
    f.write(js)
