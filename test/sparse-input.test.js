import test from 'node:test';import assert from 'node:assert/strict';import {classify} from '../src/service.js';
test('série com horas ausentes é rejeitada em vez de produzir sinais NaN',()=>{
  const sparse=new Array(24);sparse[0]=10;sparse[23]=20;
  assert.throws(()=>classify(sparse),{status:400});
});
