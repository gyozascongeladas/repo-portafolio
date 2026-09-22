const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Update top nav
const old_top_nav = \            <nav class="top-nav">
                <div class="nav-col">Artista Visual</div>
                <div class="nav-col">Productor</div>
                <div class="nav-col right-align">Programador Creativo</div>
            </nav>\;

const new_top_nav = \            <nav class="top-nav">
                <div class="nav-col"><a href="#creditos-visuales" class="nav-link">Artista Visual</a></div>
                <div class="nav-col"><a href="#creditos-produccion" class="nav-link">Productor</a></div>
                <div class="nav-col right-align"><a href="#servicios" class="nav-link">Programador Creativo</a></div>
            </nav>\;
html = html.replace(old_top_nav, new_top_nav);

// 2. Add IDs
html = html.replace('<div class="section-header no-border no-top-margin">', '<div class="section-header no-border no-top-margin" id="servicios">');
// Reemplazar usando regex sin importar los caracteres raros
html = html.replace(/<div class="section-header">\\s*<h2 class="section-title">Cr[\\s\\S]*?ditos audiovisuales<\\/h2>/g, '<div class="section-header" id="creditos-visuales">\\n            <h2 class="section-title">Créditos audiovisuales</h2>');
html = html.replace(/<div class="section-header">\\s*<h2 class="section-title">Cr[\\s\\S]*?ditos de Producci[\\s\\S]*?n<\\/h2>/g, '<div class="section-header" id="creditos-produccion">\\n            <h2 class="section-title">Créditos de Producción</h2>');

// 3. Update footer
const old_footer = \        <footer class="section-3">
            <nav class="top-nav" style="margin-bottom: 2vh; margin-top: 10vh; border-top: 1px solid currentColor; padding-top: 2vh;">
                <div class="nav-col">VRITNI</div>
                <div class="nav-col"><a href="mailto:contact@yurei.com">EMAIL</a></div>
                <div class="nav-col"><a href="https://instagram.com/yurei9_">INSTAGRAM</a></div>
                <div class="nav-col right-align"><a href="#">SPOTIFY</a></div>
            </nav>
        </footer>\;

const new_footer = \        <footer class="section-3">
            <nav class="top-nav" style="margin-bottom: 2vh; margin-top: 10vh; border-top: 1px solid currentColor; padding-top: 2vh;">
                <div class="nav-col"><a href="https://www.instagram.com/vritni/" target="_blank">VRITNI</a></div>
                <div class="nav-col"><a href="mailto:ilovevritni@gmail.com">EMAIL</a></div>
                <div class="nav-col"><a href="https://www.instagram.com/yurei9_" target="_blank">INSTAGRAM</a></div>
                <div class="nav-col right-align"><a href="https://open.spotify.com/intl-es/artist/46RVjWubjJa8KED6QQN7vJ?si=_RNVvEyNTN2gse8ovIZ50g" target="_blank">SPOTIFY</a></div>
            </nav>
        </footer>\;
html = html.replace(old_footer, new_footer);

fs.writeFileSync('index.html', html, 'utf8');
