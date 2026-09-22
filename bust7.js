const fs = require('fs');

let html = fs.readFileSync('./index.html', 'utf8');
html = html.replace('style.css?v=9', 'style.css?v=10');
fs.writeFileSync('./index.html', html, 'utf8');

let js = fs.readFileSync('./main.js', 'utf8');
js = js.replace('animations.js?v=5', 'animations.js?v=6');
fs.writeFileSync('./main.js', js, 'utf8');
