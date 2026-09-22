import { initThree } from './js/webgl.js?v=8';
import { initAnimations } from './js/animations.js?v=7';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar Entorno WebGL (Shaders + 3D Text)
    initThree();

    // 2. Inicializar Animaciones (GSAP + Lenis Smooth Scroll)
    initAnimations();
});
