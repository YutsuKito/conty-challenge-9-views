import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {classify} from '../src/service.js';import {synthetic,measure} from '../src/dataset.js';
test('robô mecânico sustenta platô alto com queda abrupta',()=>{const s=[...Array(8).fill(80),...Array(8).fill(8000),...Array(8).fill(80)];const r=classify(s);assert.equal(r.classification,'suspicious');assert.ok(r.reason.length>20);assert.ok(r.signals.identical_high_hours>=4);});
test('pico viral plausível não é confundido com pico comprado',()=>{const s=Array.from({length:24},(_,i)=>Math.floor(90+6000*Math.exp(-Math.pow((i-12)/3,2))));assert.notEqual(classify(s).classification,'suspicious');});
test('abstenção conservadora diante de pico isolado sem sinais',()=>{const s=Array(24).fill(80);s[11]=8500;assert.equal(classify(s).classification,'inconclusive');});
test('dataset reproduzível e FPR calculado igual ao README',()=>{const a=synthetic(),b=synthetic();assert.deepEqual(a,b);const m=measure(a,classify);const readme=readFileSync(new URL('../README.md',import.meta.url),'utf8');const expected=/FPR_DATASET=(\d+\.\d+)%/.exec(readme);assert.ok(expected,'README deve conter FPR_DATASET');assert.equal(m.false_positive_rate.toFixed(2),expected[1]);assert.ok(m.true_positives>0);});
test('rejeita dados insuficientes ou negativos',()=>{assert.throws(()=>classify([1,2]));assert.throws(()=>classify([...Array(12).fill(5),-1]));});

test('arquivo gerado em disco corresponde exatamente ao gerador',()=>{const data=JSON.parse(readFileSync(new URL('../data/synthetic.json',import.meta.url),'utf8'));assert.deepEqual(data,synthetic());});

test('platô mecânico com queda a zero permanece suspeito',()=>{const s=[...Array(8).fill(80),...Array(8).fill(8000),...Array(8).fill(0)];assert.equal(classify(s).classification,'suspicious');});
test('crescimento orgânico irregular com viralização e queda gradual não é suspeito',()=>{const s=[74,92,105,121,160,245,480,910,1800,3100,4900,6500,7200,6900,6100,5000,3900,3000,2300,1700,1200,820,550,360];assert.notEqual(classify(s).classification,'suspicious');});
test('platô alto variável sem repetição mecânica exige abstenção',()=>{const s=[...Array(8).fill(80),7100,7600,7300,7800,7400,7900,7200,7700,...Array(8).fill(90)];assert.equal(classify(s).classification,'inconclusive');});
