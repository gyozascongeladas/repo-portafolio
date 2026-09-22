import re

with open('c:/Users/bonva/OneDrive/Desktop/portafolio/js/animations.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Update offset
js = js.replace('offset: -220', 'offset: -160')

# 2. Add back to top logic
btt_logic = '''
    // 7. Back to Top invisible button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        gsap.ticker.add(() => {
            if (window.scrollY > 150) {
                backToTop.style.pointerEvents = 'auto';
            } else {
                backToTop.style.pointerEvents = 'none';
            }
        });
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            lenis.scrollTo(0);
        });
    }
}
'''
js = re.sub(r'\}\s*$', btt_logic, js)

with open('c:/Users/bonva/OneDrive/Desktop/portafolio/js/animations.js', 'w', encoding='utf-8') as f:
    f.write(js)
