import {describe,it,expect,vi} from 'vitest';
import {readFileSync} from 'node:fs';
import worker,{serverInfo} from '../src/index';
import {tools} from '../src/tools';
import {version} from '../package.json';
import {validate} from '../src/schema';
const read=(name:string)=>JSON.parse(readFileSync(new URL('../'+name,import.meta.url),'utf8'));
const cases=read('submission/test-cases.json') as {positive: {id:string;tool:string;arguments:Record<string,unknown>;expected:unknown}[];negative:unknown[]};
describe('submission reproducibility',()=>{
 it.each(cases.positive)('$id returns the documented local result',async c=>{
  const fetch=vi.spyOn(globalThis,'fetch').mockRejectedValue(Error('No network allowed'));
  const log=vi.spyOn(console,'log').mockImplementation(()=>{});
  try{
   const definition=tools.find(t=>t.name===c.tool)!;validate(c.arguments,definition.inputSchema);
   const response=await worker.fetch(new Request('https://local/mcp',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'tools/call',params:{name:c.tool,arguments:c.arguments}})}));
   const body=await response.json();expect(body.result.structuredContent).toEqual(c.expected);expect(body.result.isError).toBeUndefined();expect(fetch).not.toHaveBeenCalled();
   const output=JSON.stringify(body.result);expect(output).not.toMatch(/aicarvideo|autohaus-video|https?:\/\/|request_id|trace_id|upsell|discount/i);
  }finally{fetch.mockRestore();log.mockRestore();}
 });
 it('aligns release identity across discovery and registry',()=>{const registry=read('server.json');expect(serverInfo.version).toBe(version);expect(registry.version).toBe(version);expect(serverInfo.websiteUrl).toBe('https://aicarvideo.com');expect(registry.name).toBe('com.aicarvideo/car-listing-check');expect(registry.remotes).toEqual([{type:'streamable-http',url:'https://mcp.aicarvideo.com/mcp'}]);});
 it('respects submission character limits and exact case counts',()=>{
  const m=read('submission/metadata.json');for(const [key,max] of Object.entries({displayName:30,shortDescription:30,longDescription:2000,oneLiner:200})){expect(Array.from(m[key]).length).toBeLessThanOrEqual(max);}
  expect(m.displayName).not.toMatch(/MCP|Plugin/i);for(const s of m.starterPrompts)expect(Array.from(s).length).toBeLessThanOrEqual(128);
  expect(cases.positive).toHaveLength(5);expect(cases.negative).toHaveLength(3);
  for(const file of ['listing-openai.md','listing-claude.md']){const text=readFileSync(new URL('../submission/'+file,import.meta.url),'utf8');expect(text).toContain(m.longDescription);expect(text).toContain(String(Array.from(m.longDescription).length));}
 });
});
