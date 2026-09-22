const fs = require('fs');
let js = fs.readFileSync('./js/animations.js', 'utf8');

const clip_logic = \
    // 5. Navbar Magico
    const scrollContainers = document.querySelectorAll('.bottom-half, .third-part');
    const NAVBAR_HEIGHT = 100;
    
    gsap.ticker.add(() => {
        scrollContainers.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < NAVBAR_HEIGHT) {
                const clipTop = NAVBAR_HEIGHT - rect.top;
                if (clipTop > 0) {
                    el.style.clipPath = \\\inset(\\\px 0 0 0)\\\;
                }
            } else {
                el.style.clipPath = 'none';
            }
        });
    });
\;

js = js.replace(/\\}\\s*$/, '\\n' + clip_logic + '\\n}');
fs.writeFileSync('./js/animations.js', js, 'utf8');
