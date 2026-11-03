import {checkListing,checklist,type Input,type Market} from './logic';
import {validate} from './schema';
import {tools} from './tools';
export interface Env {ANALYTICS?:{writeDataPoint(point:{blobs:string[];doubles:number[]}):void}}
export const serverInfo={name:'car-listing-check',title:'Car Listing Check',version:'0.1.0',websiteUrl:'https://autohaus-video.de',_meta:{developer:'Autohaus-Video'}};
const versions=['2025-03-26','2025-06-18','2025-11-25'];
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, GET, OPTIONS','Access-Control-Allow-Headers':'content-type, accept, mcp-protocol-version, mcp-session-id','Access-Control-Max-Age':'86400'};
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{...cors,'content-type':'application/json','cache-control':'no-store'}});
const error=(id:unknown,code:number,message:string,status=200)=>json({jsonrpc:'2.0',id,error:{code,message}},status);
// No IPs are logged or persisted. Best-effort isolate-local limiter; not a global security boundary.
const buckets=new Map<string,{start:number;count:number}>();
function limited(ip:string|null){if(!ip)return false;const now=Date.now();for(const [k,v] of buckets)if(now-v.start>=60000)buckets.delete(k);let b=buckets.get(ip);if(!b){if(buckets.size>=2048)return true;b={start:now,count:0};buckets.set(ip,b);}return ++b.count>120;}
async function readBody(req:Request){const reader=req.body?.getReader();if(!reader)throw Error('Supply a JSON-RPC body.');const decoder=new TextDecoder('utf-8',{fatal:true});let body='',size=0,timedOut=false;const timer=setTimeout(()=>{timedOut=true;void reader.cancel().catch(()=>{});},5000);try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>300000){await reader.cancel();throw Error('Request exceeds 300,000 bytes.');}body+=decoder.decode(value,{stream:true});}if(timedOut)throw Error('Request body timed out after five seconds.');body+=decoder.decode();return body;}finally{clearTimeout(timer);reader.releaseLock();}}
export default {async fetch(req:Request,env:Env={}):Promise<Response>{
 const path=new URL(req.url).pathname;
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(path==='/health'&&req.method==='GET')return json({status:'ok'});
 if(path==='/'&&req.method==='GET')return new Response('Car Listing Check\nChecks supplied vehicle listings for completeness and presentation.\nWebsite and documentation: https://autohaus-video.de\nPOST JSON-RPC to /mcp. No website fetching or scraping.\n',{headers:{...cors,'content-type':'text/plain; charset=utf-8'}});
 if(path!=='/mcp')return json({error:'Route not found. Use /health or POST /mcp.'},404);
 if(req.method!=='POST')return new Response(JSON.stringify({error:'Use POST /mcp with JSON-RPC; GET streaming is not offered.'}),{status:405,headers:{...cors,'content-type':'application/json',Allow:'POST, OPTIONS'}});
 if(limited(req.headers.get('cf-connecting-ip')))return json({error:'Too many requests. Retry after one minute.'},429);
 if(!req.headers.get('content-type')?.toLowerCase().includes('application/json'))return error(null,-32600,'Use Content-Type: application/json.',415);
 const version=req.headers.get('mcp-protocol-version');if(version&&!versions.includes(version))return error(null,-32600,'Unsupported mcp-protocol-version; use 2025-03-26, 2025-06-18 or 2025-11-25.',400);
 let rpc:Record<string,unknown>;
 try{const parsed:unknown=JSON.parse(await readBody(req));if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))return error(null,-32600,'Supply one JSON-RPC object; batches are not supported.',400);rpc=parsed as Record<string,unknown>;}catch{return error(null,-32700,'Could not read JSON. Supply valid JSON within 300,000 bytes and five seconds.',400);}
 const id=rpc.id??null;
 if(rpc.jsonrpc!=='2.0'||typeof rpc.method!=='string'||(rpc.id!==undefined&&rpc.id!==null&&typeof rpc.id!=='string'&&typeof rpc.id!=='number')||(rpc.params!==undefined&&(!rpc.params||typeof rpc.params!=='object'||Array.isArray(rpc.params))))return error(null,-32600,'Invalid JSON-RPC envelope or params.',400);
 const params=(rpc.params??{}) as Record<string,unknown>;
 // Notifications never receive a JSON-RPC response, including unknown notifications.
 if(!('id' in rpc))return new Response(null,{status:202,headers:cors});
 const reply=(result:unknown)=>json({jsonrpc:'2.0',id,result});
 switch(rpc.method){
 case 'initialize':return reply({protocolVersion:typeof params.protocolVersion==='string'&&versions.includes(params.protocolVersion)?params.protocolVersion:'2025-06-18',capabilities:{tools:{listChanged:false}},serverInfo});
 case 'ping':return reply({});
 case 'tools/list':return reply({tools});
 case 'tools/call':{
 const start=performance.now();let ok=false;const definition=tools.find(t=>t.name===params.name);
 try{if(!definition)throw Error('Unknown tool. Use tools/list to see available tools.');const args=params.arguments??{};validate(args,definition.inputSchema);const input=args as Input;const result=definition.name==='check_car_listing'?checkListing(input):checklist(input.market as Market|undefined,(args as {vehicle_condition?:string}).vehicle_condition);ok=true;return reply({structuredContent:result,content:[{type:'text',text:'score' in result?`Listing score: ${result.score}/100 (${result.grade}). ${result.top_fixes.length} prioritised fixes. Checks use supplied content only.`:'Checklist ready: fields, photo order, title and description recommendations. Not legal advice.'}]});
 }catch(e){return reply({isError:true,content:[{type:'text',text:e instanceof Error?e.message:'Unable to check this input. Verify the tool name and argument formats.'}]});}
 finally{const ms=Math.round((performance.now()-start)*1000)/1000;const tool=definition?.name??'unknown';console.log(JSON.stringify({evt:'tool_call',tool,ok,ms}));try{if(env.ANALYTICS)env.ANALYTICS.writeDataPoint({blobs:[tool,String(ok)],doubles:[ms]});}catch{/* Monitoring must not fail a tool call. */}}
 }
 default:return error(id,-32601,'Unknown method. Supported: initialize, ping, tools/list, tools/call and notifications/initialized.');
 }
}};
