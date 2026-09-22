const fs = require('fs');

let html = fs.readFileSync('./index.html', 'utf8');
html = html.replace('style.css?v=8', 'style.css?v=9');
fs.writeFileSync('./index.html', html, 'utf8');

let js = fs.readFileSync('./main.js', 'utf8');
js = js.replace('webgl.js?v=7', 'webgl.js?v=8');
fs.writeFileSync('./main.js', js, 'utf8');
