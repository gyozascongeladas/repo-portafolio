import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
    // 1. Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing fluido brutal
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });
    
    // Sincronizar Lenis con GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. Animación Scroll Reveal (Texto empujado desde abajo)
    const rows = document.querySelectorAll('.service-row, .credit-row');
    
    rows.forEach(row => {
        // En style.css las rows tienen clip-path para que actúen como máscara
        gsap.fromTo(row.children, 
            { 
                y: 60, 
                opacity: 0,
                skewY: 5 // Efecto distorsión sutil al entrar
            }, 
            {
                y: 0,
                opacity: 1,
                skewY: 0,
                duration: 1.2,
                ease: 'power4.out', // Desaceleración violenta (brutalista)
                stagger: 0.1, // Elementos de la fila entran secuencialmente
                scrollTrigger: {
                    trigger: row,
                    start: 'top 90%', // Activa cuando el borde superior llega al 90% del viewport
                    toggleActions: 'play none none reverse' // Animación bidireccional
                }
            }
        );
    });

    // 3. Hover Effects Dinámicos (Imágenes/Placeholders)
    const placeholders = document.querySelectorAll('.placeholder-large, .placeholder-full, .placeholder-small');
    
    placeholders.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(el, { 
                scale: 0.95, 
                skewX: 1.5, 
                skewY: -1, 
                duration: 0.4, 
                ease: 'power3.out' 
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { 
                scale: 1, 
                skewX: 0, 
                skewY: 0, 
                duration: 0.8, 
                ease: 'elastic.out(1, 0.3)' // Rebote elástico
            });
        });
    });
    // 4. Entrada suave del About
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        gsap.fromTo(aboutSection, 
            { y: 60, opacity: 0, skewY: 5 },
            { y: 0, opacity: 1, skewY: 0, duration: 1.2, ease: 'power4.out', delay: 0.2 }
        );
    }

    // 5. Navbar Mágico
    const scrollContainers = document.querySelectorAll('.bottom-half, .third-part');
    const NAVBAR_HEIGHT = 100;
    
    gsap.ticker.add(() => {
        scrollContainers.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < NAVBAR_HEIGHT) {
                const clipTop = NAVBAR_HEIGHT - rect.top;
                if (clipTop > 0) {
                    el.style.clipPath = `inset(${clipTop}px 0 0 0)`;
                }
            } else {
                el.style.clipPath = 'none';
            }
        });
    });
}
