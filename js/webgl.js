import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import gsap from 'gsap';

export function initThree() {
    const canvas = document.getElementById('webgl-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();


    // Cámara ajustada para el texto grande
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    // 1. Plano de Fondo con Shader de Ruido Perlin
    const bgGeometry = new THREE.PlaneGeometry(100, 100);
    const bgMaterial = new THREE.ShaderMaterial({
        uniforms: {
            u_time: { value: 0 },
            u_color: { value: new THREE.Color('#111111') },
            u_scroll: { value: 0 },
            u_clickPos: { value: new THREE.Vector2(-1, -1) },
            u_clickTime: { value: -100.0 },
            u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float u_time;
            uniform vec3 u_color;
            uniform float u_scroll;
            uniform vec2 u_clickPos;
            uniform float u_clickTime;
            uniform vec2 u_resolution;
            varying vec2 vUv;

            // Simplex 2D noise algorithm
            vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
            float snoise(vec2 v){
                const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                vec2 i  = floor(v + dot(v, C.yy) );
                vec2 x0 = v -   i + dot(i, C.xx);
                vec2 i1;
                i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;
                i = mod(i, 289.0);
                vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                m = m*m;
                m = m*m;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 ox = floor(x + 0.5);
                vec3 a0 = x - ox;
                m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                vec3 g;
                g.x  = a0.x  * x0.x  + h.x  * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }

            void main() {
                // Escala general del espacio
                vec2 st = vUv * 2.0;
                
                // Efecto 1: Desplazamiento por Scroll
                st.y -= u_scroll * 0.2; 
                
                // Efecto 2: Onda expansiva al hacer clic
                float dist = distance(vUv, u_clickPos);
                float timeSinceClick = u_time - u_clickTime;
                
                if (timeSinceClick < 4.0 && u_clickTime > 0.0) {
                    float wave = sin(dist * 40.0 - timeSinceClick * 15.0);
                    float decay = exp(-dist * 4.0) * exp(-timeSinceClick * 2.0);
                    st += normalize(vUv - u_clickPos) * wave * decay * 0.08;
                }
                
                // Distorsión del espacio (Domain Warping) para crear remolinos líquidos
                float swirl1 = snoise(st + u_time * 0.1);
                float swirl2 = snoise(st + vec2(5.2, 1.3) - u_time * 0.08);
                
                // Las coordenadas distorsionadas simulan los fluidos empujándose unos a otros
                vec2 st_distorted = st + vec2(swirl1, swirl2) * 0.8;
                
                // Generar el patrón principal de manchas de aceite
                float noise = snoise(st_distorted * 1.5 + u_time * 0.05);
                float n = (noise + 1.0) * 0.5; // Normalizar a 0.0 - 1.0
                
                // Tensión superficial analógica (Aceite vs Agua): 
                // En lugar de transiciones suaves (blur), usamos cortes afilados con un mínimo smoothstep 
                // para simular los bordes definidos de las gotas de aceite (Liquid Light Show).
                float oil1 = smoothstep(0.35, 0.42, n);
                float oil2 = smoothstep(0.60, 0.67, n);
                
                // Colores analógicos con contraste interno controlado
                // En vez de oscurecer al 30% absoluto (que destruye el contraste con el texto),
                // oscurecemos solo un 35% relativo al color original.
                vec3 shadow = mix(u_color, vec3(0.0), 0.35); 
                vec3 highlight = mix(u_color, vec3(1.0), 0.25);

                
                // Mezcla en capas sólidas (blobs de aceite sobreponiéndose)
                vec3 finalColor = mix(shadow, u_color, oil1);
                finalColor = mix(finalColor, highlight, oil2);
                
                // Opacidad moderada para integrarse orgánicamente con el CSS
                gl_FragColor = vec4(finalColor, 0.4);
            }
        `,
        transparent: true,
        depthWrite: false
    });
    
    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
    bgMesh.position.z = -10;
    scene.add(bgMesh);

    // 2. Geometría de Texto 3D Magnético
    let textMesh;
        const fontLoader = new FontLoader();
    
    fontLoader.load('https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json', (font) => {
        const textGeometry = new TextGeometry('*yurei*', {
            font: font,
            size: 3.5,
            height: 0.8,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 3
        });
        
        textGeometry.center();

        // Material sólido pero con un ligero brillo para acentuar el volumen 3D
        const textMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.1, // Un toque sutil para reflejar luz
            roughness: 0.3, // Más liso para que los brillos destaquen más
        });

        textMesh = new THREE.Mesh(textGeometry, textMaterial);
        
        // Ajuste inicial para empatar con la altura de la página
        textMesh.position.y = 3.5; 
        textMesh.position.x = -2.0; // Desplazamiento a la izquierda alineado al DOM
        scene.add(textMesh);
        
        // --- TEXTO VRITNI PARA NAVBAR CON LETTER SPACING ---
        
        
        // Actualizar colores iniciales luego de cargar
        updateColors();
        updateResponsiveScale();
    });

    // Función para manejar el diseño responsivo 3D
    const updateResponsiveScale = () => {
        if (textMesh) {
            const isMobile = window.innerWidth < 768;
            // Escalar el texto proporcionalmente si la pantalla es más angosta que 1000px
            const scale = Math.min(1.0, window.innerWidth / 1000);
            textMesh.scale.set(scale, scale, scale);
            
            // En móvil lo centramos (x=0), en escritorio lo dejamos alineado a la izquierda (x=-2.0)
            textMesh.position.x = isMobile ? 0 : -2.0;
        }
    };

    // 3. Sistema de Iluminación para resaltar el texto y darle más volumen
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // Más luz base
    scene.add(ambientLight);
    
    // Luz direccional más fuerte para generar brillos frontales
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // Luz de contorno (Rim light) intensa para separar el texto del fondo
    const rimLight = new THREE.PointLight(0xffffff, 8, 20);
    rimLight.position.set(-5, 2, -5);
    scene.add(rimLight);

    // Variables globales para el manejo de color
    const colorBg = new THREE.Color();
    const colorTitle = new THREE.Color();

    // Función para sincronizar con los colores CSS generados
    const updateColors = () => {
        const root = document.documentElement;
        const bodyBg = getComputedStyle(root).getPropertyValue('--bg-color').trim();
        const titleColor = getComputedStyle(root).getPropertyValue('--title-color').trim();
        
        if(bodyBg && bodyBg.length > 0) colorBg.setStyle(bodyBg);
        if(titleColor && titleColor.length > 0) colorTitle.setStyle(titleColor);
        
        // Aplicar el color base inmediatamente al texto si estamos arriba
        if (textMesh && !wasInBottom) {
            textMesh.material.color.copy(colorTitle);
            rimLight.color.copy(colorTitle);
        }
    };
    
    // Observamos los cambios de estilo en el HTML por si los colores cambian dinámicamente
    const observer = new MutationObserver(() => updateColors());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    setTimeout(updateColors, 100); // Primer tick manual

    // 4. Lógica de Tracking 3D Magnético y Giros (Rolls)
    let mouse = new THREE.Vector2();
    let targetRotation = new THREE.Vector2();
    
    // Variables para acumular giros completos independientes del mouse
    let baseRotationX = 0;
    let baseRotationY = 0;

    window.addEventListener('pointermove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        
        // Rango de rotación magnética + giros base
        targetRotation.x = baseRotationX + mouse.y * 0.25;
        targetRotation.y = baseRotationY + mouse.x * 0.25;
    });

    // Detección de scroll activo
    let isScrolling = false;
    let scrollTimeout = null;
    let targetScroll = 0;
    let currentScroll = 0;

    window.addEventListener('scroll', () => {
        targetScroll = window.scrollY / window.innerHeight; // Normalizado
        
        isScrolling = true;
        if(scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 150);
    });

    // Detección de clics/toques para la onda expansiva en el líquido
    window.addEventListener('pointerdown', (e) => {
        bgMaterial.uniforms.u_clickPos.value.x = e.clientX / window.innerWidth;
        // UV y coord es invertido
        bgMaterial.uniforms.u_clickPos.value.y = 1.0 - (e.clientY / window.innerHeight);
        
        // Grabamos el tiempo exacto del click (el reloj ya está inicializado abajo, pero para ser seguros)
        bgMaterial.uniforms.u_clickTime.value = clock ? clock.getElapsedTime() : 0;
    });

    // Referencias a secciones para detectar los cruces
    const topHalf = document.querySelector('.top-half');
    const bottomHalf = document.querySelector('.bottom-half');
    const thirdPart = document.querySelector('.third-part');
    let currentSectionIndex = 0; // 0 = top, 1 = bottom, 2 = third

    // Loop de Render
    const clock = new THREE.Clock();
    let lastFlipTime = 0;
    
    function tick() {
        const elapsedTime = clock.getElapsedTime();
        bgMaterial.uniforms.u_time.value = elapsedTime;
        
        // Suavizado del scroll para el shader (Lerp)
        currentScroll += (targetScroll - currentScroll) * 0.05;
        bgMaterial.uniforms.u_scroll.value = currentScroll;


        // Lógica de transición de 3 secciones con GSAP
        let newSectionIndex = 0;
        
        if (thirdPart && thirdPart.getBoundingClientRect().top < window.innerHeight / 2) {
            newSectionIndex = 2;
        } else if (bottomHalf && bottomHalf.getBoundingClientRect().top < window.innerHeight / 2) {
            newSectionIndex = 1;
        }
        
        if (newSectionIndex !== currentSectionIndex) {
            currentSectionIndex = newSectionIndex;
            
            // Disparo de giro completo (Flip) del logo 3D
            if (Math.random() > 0.5) baseRotationX += Math.PI * 2;
            else baseRotationY += Math.PI * 2;
            targetRotation.x = baseRotationX + mouse.y * 0.25;
            targetRotation.y = baseRotationY + mouse.x * 0.25;
            
            // Decidir colores objetivo
            let targetBg, targetText;
            
            // Obtener el color de la tercera sección desde el CSS (se genera dinámicamente)
            const rootStyles = getComputedStyle(document.documentElement);
            const cssThirdBg = rootStyles.getPropertyValue('--third-bg-color').trim();
            const cssThirdText = rootStyles.getPropertyValue('--third-text-color').trim();
            const colorThirdBg = new THREE.Color(cssThirdBg || 0x000000);
            const colorThirdText = new THREE.Color(cssThirdText || 0xffffff);

            if (currentSectionIndex === 0) {
                targetBg = colorBg; 
                targetText = colorTitle;
            } else if (currentSectionIndex === 1) {
                targetBg = colorTitle; 
                targetText = colorBg;
            } else {
                targetBg = colorThirdBg; 
                targetText = colorThirdText;
            }

            // Animar colores con GSAP
            gsap.to(bgMaterial.uniforms.u_color.value, { r: targetBg.r, g: targetBg.g, b: targetBg.b, duration: 0.8 });
            if (textMesh) {
                gsap.to(textMesh.material.color, { r: targetText.r, g: targetText.g, b: targetText.b, duration: 0.8 });
                gsap.to(rimLight.color, { r: targetText.r, g: targetText.g, b: targetText.b, duration: 0.8 });
            }
        }

        if (textMesh) {
            // Suavizado del movimiento magnético (Lerp) mucho más lento y pesado
            textMesh.rotation.x += (targetRotation.x - textMesh.rotation.x) * 0.02;
            textMesh.rotation.y += (targetRotation.y - textMesh.rotation.y) * 0.02;
            
            // Lógica de scroll sticky: Sube y se encoge hasta la parte superior de la pantalla
            // progress va de 0.0 a 1.0 a medida que bajamos los primeros 500 pixeles
            const scrollProgress = Math.min(1.0, window.scrollY / 500);
            
            const isMobile = window.innerWidth <= 768;
            
            // Posición Y: Inicia en 3.5 para quedar entre Instagram y About
            const initialY = 3.5;
            const stickyPositionY = initialY + (scrollProgress * (7.0 - initialY));
            
            // Posición X: Se desliza hacia el centro al encogerse
            const startX = isMobile ? 0 : -2.0;
            const targetX = 0; // Centrado exacto
            textMesh.position.x = startX + (scrollProgress * (targetX - startX));

            // Escala: En móvil siempre se mantiene cercano a 0.4. En desktop baja de 1.0 a 0.35
            const baseScale = isMobile ? 0.4 : 1.0;
            const targetScale = baseScale - (scrollProgress * (baseScale - 0.35));
            textMesh.scale.setScalar(targetScale);
            
            // Efecto de levitación/incandescencia acentuado en reposo (reducido al encogerse)
            textMesh.position.y = stickyPositionY + Math.sin(elapsedTime * 2.0) * (0.4 * targetScale);
        }

        

        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
    tick();

    // Responsive Canvas
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Actualizar la resolución en el shader para que los píxeles sigan siendo cuadrados perfectos
        if (bgMaterial && bgMaterial.uniforms.u_resolution) {
            bgMaterial.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
        }
        
        updateResponsiveScale();
    });
}
