const fs = require('fs');
let js = fs.readFileSync('./main.js', 'utf8');
js = js.replace('webgl.js?v=5', 'webgl.js?v=6');
fs.writeFileSync('./main.js', js, 'utf8');
