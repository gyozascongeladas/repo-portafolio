import re

with open('c:/Users/bonva/OneDrive/Desktop/portafolio/js/webgl.js', 'r', encoding='utf-8') as f:
    js = f.read()

old_y = '''            // Posici\u00f3n Y: Inicia en 3.5, sube hasta 7.0 (borde superior de la pantalla)
            const stickyPositionY = 3.5 + (scrollProgress * 3.5);
            
            // Posici\u00f3n X: Se desliza hacia el centro al encogerse
            const isMobile = window.innerWidth <= 768;'''

new_y = '''            const isMobile = window.innerWidth <= 768;
            
            // Posicion Y: En movil inicia mas abajo porque es mas pequeño
            const initialY = isMobile ? 1.5 : 3.5;
            const stickyPositionY = initialY + (scrollProgress * (7.0 - initialY));
            
            // Posicion X: Se desliza hacia el centro al encogerse'''

# Since encoding might mess up the \u00f3n, we'll just use simple replace on the code without comments
