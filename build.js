/* node build.js  ->  dist/pvnxt-quote.html (one file: CSS, JS and data inlined; works in any preview pane) */
const fs=require('fs'),r=f=>fs.readFileSync(f,'utf8');
let h=r('index.html');
h=h.replace(/<link rel="stylesheet" href="(css\/[^"]+)">/g,(_,f)=>`<style>\n${r(f)}</style>`);
h=h.replace(/<script src="(js\/[^"]+)"><\/script>/g,(_,f)=>`<script>\n${r(f)}</script>`);
const data=`<script type="application/json" id="catalog-data">${r('data/catalog.json')}</script>\n<script type="application/json" id="quotes-data">${r('data/quotes.json')}</script>\n`;
h=h.replace('<script>',data+'<script>');
fs.mkdirSync('dist',{recursive:true});fs.writeFileSync('dist/pvnxt-quote.html',h);console.log('dist/pvnxt-quote.html',h.length,'bytes');
