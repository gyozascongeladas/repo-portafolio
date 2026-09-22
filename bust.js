const fs = require('fs');
let js = fs.readFileSync('./main.js', 'utf8');
js = js.replace('animations.js?v=3', 'animations.js?v=4');
fs.writeFileSync('./main.js', js, 'utf8');
