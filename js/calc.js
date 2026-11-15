/* Formatting helpers, price and subsidy maths, validation. */
const R=n=>'₹'+Math.round(n||0).toLocaleString('en-IN'),by=(a,i)=>a.find(x=>x.id==i)||a[0],tx=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function calc(q){const m=by(C.modules,q.mod),i=by(C.inverters,q.inv),n=+q.modules||0,k=n*m.wp/1000;
const parts=[['Solar modules',n*m.wp*m.p],['Inverter',i.p],['Structure',k*by(C.structures,q.struct).p],['DC cable',q.dc*by(C.dc,q.dcc).p],['AC cable',q.ac*by(C.ac,q.acc).p],['Earthing & LA',q.pits*C.earth.pit+q.la*C.earth.la],['Installation & commissioning',k*C.inst]];
if(q.battery)parts.push(['Battery',q.batKwh*C.battery.p]);if(q.clean)parts.push(['Cleaning system',k*C.clean.p]);
const auto=parts.reduce((a,p)=>a+p[1],0),list=q.over!==''?+q.over:auto,net=list-q.disc+ +q.addon,gst=net*C.gst/100,total=net+gst;
const kw=Math.min(k,3),cs=q.csub&&q.consumer=='Domestic'&&q.type!='Off-Grid'?Math.min(78000,30000*Math.min(kw,2)+18000*Math.max(0,kw-2)):0,
cost=total-cs-q.ssub,gen=k*120,mon=Math.min(gen,q.units)*q.tariff,pb=mon?cost/(mon*12):0;
return{m,i,k,parts,list,net,gst,total,cs,cost,mon,pb}}
const bad=q=>!q.name.trim()?'Customer name is required':!/^[+\d\s-]{10,}$/.test(q.phone)?'Enter a valid phone number':!(q.modules>0)?'Add at least one module':q.ms.reduce((a,b)=>a+ +b,0)!=100?'Milestones must total 100%':'';
