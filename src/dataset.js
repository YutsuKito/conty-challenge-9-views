function rng(seed){let n=seed>>>0;return()=>{n=(n*1664525+1013904223)>>>0;return n/4294967296;};}
export function synthetic(seed=20261009){const rand=rng(seed),data=[];
 for(let k=0;k<120;k++){
   const base=30+Math.floor(rand()*170),peakAt=5+Math.floor(rand()*12);
   let kind='steady';let views=Array.from({length:24},(_,i)=>Math.max(0,Math.round(base*(.8+rand()*.4+Math.sin(i/3)*.15))));
   if(k%3===0){kind='organic_viral';const amplitude=base*(15+rand()*50);views=views.map((v,i)=>v+Math.round(amplitude*Math.exp(-Math.pow((i-peakAt)/3,2))));}
   if(k%3===1){kind='organic_live_event';views=views.map((v,i)=>v+(i>=peakAt&&i<peakAt+2?Math.round(base*(10+rand()*30)):0));}
   data.push({id:`legit_${k}`,label:'legitimate',kind,views});
 }
 for(let k=0;k<40;k++){
   const base=40+Math.floor(rand()*60),p=base*(40+Math.floor(rand()*20));
   const views=Array.from({length:24},(_,i)=>i<8||i>=15?base+Math.floor(rand()*8):p);
   data.push({id:`suspicious_${k}`,label:'suspicious',kind:'mechanical_plateau',views});
 }
 return {seed,examples:data};
}
export function measure(data,classify){const legit=data.examples.filter(x=>x.label==='legitimate'),positives=legit.filter(x=>classify(x.views).classification==='suspicious');const suspicious=data.examples.filter(x=>x.label==='suspicious');return {legitimate:legit.length,suspicious:suspicious.length,false_positives:positives.length,false_positive_rate:Number((100*positives.length/legit.length).toFixed(2)),true_positives:suspicious.filter(x=>classify(x.views).classification==='suspicious').length};}
