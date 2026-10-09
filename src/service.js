import {fail,required} from './http.js';
export function classify(series) {
 required(Array.isArray(series)&&series.length>=12&&series.length<=500,'Série precisa de 12 a 500 horas');
 required(series.every(v=>Number.isSafeInteger(v)&&v>=0),'Views por hora devem ser inteiras não negativas');
 const sorted=[...series].sort((a,b)=>a-b);const baseline=Math.max(1,sorted[Math.floor(series.length*.25)]);
 const peak=Math.max(...series);const peakRatio=peak/baseline;
 let highPlateau=0,run=0,repetition=0,seq=1,abruptDrop=1,abruptRise=1;
 for(let i=0;i<series.length;i++){
   if(series[i]>=baseline*10&&series[i]>=500)run++;else run=0;
   highPlateau=Math.max(highPlateau,run);
   if(i>0){if(series[i]===series[i-1]&&series[i]>=500)seq++;else seq=1;repetition=Math.max(repetition,seq);
     abruptDrop=Math.max(abruptDrop,series[i-1]/Math.max(1,series[i]));
     abruptRise=Math.max(abruptRise,series[i]/Math.max(1,series[i-1]));
   }
 }
 const signals={baseline_views:baseline,peak_views:peak,peak_to_baseline:Number(peakRatio.toFixed(2)),high_plateau_hours:highPlateau,identical_high_hours:repetition,max_hourly_drop_ratio:Number(abruptDrop.toFixed(2)),max_hourly_rise_ratio:Number(abruptRise.toFixed(2))};
 // Deliberadamente conservador: um pico isolado, por maior que seja, NÃO basta.
 if(peakRatio>=20&&highPlateau>=4&&repetition>=4&&abruptDrop>=12)
   return {classification:'suspicious',reason:'Platô alto repetido por várias horas seguido de queda abrupta; combinação compatível com tráfego automatizado.',signals};
 if(peakRatio>=30&&highPlateau>=4&&abruptRise>=15&&abruptDrop>=15&&repetition>=3)
   return {classification:'suspicious',reason:'Subida extrema, sequência mecânica de valores e queda brusca observadas em conjunto.',signals};
 if(peakRatio>=15)
   return {classification:'inconclusive',reason:'Pico elevado sem combinação suficiente de sinais; pode ser distribuição orgânica. Não acusar automaticamente.',signals};
 return {classification:'legitimate',reason:'Não há combinação de repetição mecânica, escalada e queda para classificar como suspeito.',signals};
}
