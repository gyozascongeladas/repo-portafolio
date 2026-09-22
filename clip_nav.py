# -*- coding: utf-8 -*-
import re

with open('c:/Users/bonva/OneDrive/Desktop/portafolio/js/animations.js', 'r', encoding='utf-8') as f:
    js = f.read()

clip_logic = '''
    // 5. Navbar Magico (Ocultar texto HTML debajo del top 100px para que el WebGL 3D se vea)
    const scrollContainers = document.querySelectorAll('.bottom-half, .third-part');
    const NAVBAR_HEIGHT = 100; // Altura de la "navbar transparente"
    
    gsap.ticker.add(() => {
        scrollContainers.forEach(el => {
            const rect = el.getBoundingClientRect();
            // Si el contenedor ha pasado la linea del navbar
            if (rect.top < NAVBAR_HEIGHT) {
                const clipTop = NAVBAR_HEIGHT - rect.top;
                if (clipTop > 0) {
                    el.style.clipPath = \inset(\px 0 0 0)\;
                }
            } else {
                el.style.clipPath = 'none';
            }
        });
    });
'''

js = re.sub(r'\}\s*$', '\n' + clip_logic + '\n}', js)

with open('c:/Users/bonva/OneDrive/Desktop/portafolio/js/animations.js', 'w', encoding='utf-8') as f:
    f.write(js)
