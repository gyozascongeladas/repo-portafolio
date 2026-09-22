const fs = require('fs');
let js = fs.readFileSync('./main.js', 'utf8');
js = js.replace('animations.js?v=6', 'animations.js?v=7');
fs.writeFileSync('./main.js', js, 'utf8');
