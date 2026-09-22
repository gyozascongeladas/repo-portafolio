const fs = require('fs');
let js = fs.readFileSync('./js/webgl.js', 'utf8');

js = js.replace('const stickyPositionY = 3.5 + (scrollProgress * 3.5);', 
    'const isMobile = window.innerWidth <= 768;\\n            const initialY = isMobile ? 1.5 : 3.5;\\n            const stickyPositionY = initialY + (scrollProgress * (7.0 - initialY));');

js = js.replace('const isMobile = window.innerWidth <= 768;', ''); // Remove the original isMobile declaration

fs.writeFileSync('./js/webgl.js', js, 'utf8');
