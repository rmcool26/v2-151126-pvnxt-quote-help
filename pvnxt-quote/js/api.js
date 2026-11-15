/* Data layer. Replace each method with the real API call; nothing else in the app talks to the network. */
let C;const H=location.hash,DB=[];
/* The single-file build embeds the JSON as <script type="application/json"> blocks; served folders use fetch. */
const inline=id=>{const e=document.getElementById(id);return e?Promise.resolve(JSON.parse(e.textContent)):null};
const api={
  catalog:()=>inline('catalog-data')||fetch('data/catalog.json').then(r=>r.json()),
  list:async()=>{await new Promise(r=>setTimeout(r,700));if(H.includes('error'))throw 0;if(H.includes('empty'))return[];
    if(!DB.length){const r=await(inline('quotes-data')||fetch('data/quotes.json').then(x=>x.json()));DB.push(...r.map(x=>newQ(x)))}return DB},
  save:q=>{if(!DB.includes(q))DB.unshift(q)},
  email:q=>Promise.resolve(),
  shareUrl:q=>'https://quote.pvnxt.com/q/'+q.id,
  payUrl:q=>'https://pay.pvnxt.com/'+q.id};
