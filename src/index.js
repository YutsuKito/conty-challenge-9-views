import {http} from './http.js';import {classify} from './service.js';
export function createApp(){return http({},[['POST',/^\/classify$/, (s,b)=>classify(b.views)]]);}
if(process.argv[1]&&import.meta.url===new URL(`file://${process.argv[1]}`).href)createApp().listen(3009,()=>console.log('http://localhost:3009'));
