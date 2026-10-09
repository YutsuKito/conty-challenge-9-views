import {mkdirSync,writeFileSync} from 'node:fs';import {synthetic,measure} from '../src/dataset.js';import {classify} from '../src/service.js';
const data=synthetic();mkdirSync('data',{recursive:true});writeFileSync('data/synthetic.json',JSON.stringify(data,null,2)+'\n');const m=measure(data,classify);
console.log(`seed ${data.seed}`);console.log(`legitimate ${m.legitimate} suspicious ${m.suspicious}`);console.log(`false_positives ${m.false_positives}`);console.log(`false_positive_rate ${m.false_positive_rate.toFixed(2)}%`);console.log(`true_positives ${m.true_positives}/${m.suspicious}`);
