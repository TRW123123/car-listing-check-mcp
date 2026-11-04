import {describe,it,expect,vi} from 'vitest';
import {checkListing,checklist,type Input} from '../src/logic';
import {checkInput,validate} from '../src/schema';
import {tools} from '../src/tools';
import Ajv from 'ajv';
const complete:Input={title:'Volkswagen Golf 1.5 TSI Automatic',description:'Overview: Volkswagen Golf with automatic transmission.\nCondition: minor wear, no known issues.\nHistory: documented service records available for review.\nEquipment: navigation, heated seats, LED, adaptive cruise control, parking sensors, camera, Apple CarPlay, tow bar, air conditioning, alloy wheels and sunroof.\nContact: call to arrange a viewing and confirm mandatory charges.',fields:{make:'Volkswagen',model:'Golf',price:18900,currency:'EUR',first_registration:'2021-06',mileage:42000,mileage_unit:'km',fuel_type:'Petrol',transmission:'Automatic',condition:'used',location:'Berlin',service_history:'Records available'},photo_count:12,photo_order:['front_3_4','side','rear','interior_front','odometer','trunk','wheels'],has_walkaround_video:true};
describe('scoring',()=>{
 const dealer:Input={title:'VW Golf 8 1.5 TSI Life DSG, Navi, LED, ACC, Rückfahrkamera, 1. Hand',fields:{make:'Volkswagen',model:'Golf',variant:'1.5 TSI Life DSG',transmission:'Automatik (DSG)'},market:'de',language:'de',image_urls:['front_3_4','side','rear','rear_3_4','interior','dashboard','rear_seats','trunk','wheel','engine','odometer','damage_front'].map(name=>`https://autohaus-beispiel.de/fahrzeuge/golf8-4711/${name}.jpg`)};
 it('accepts the exact German dealer title and standard filename order',()=>{
  const result=checkListing(dealer);
  for(const id of ['title_content','photo_order']){
   expect(result.checks.find(check=>check.id===id)?.status).toBe('pass');
   expect(result.top_fixes.some(fix=>fix.id===id)).toBe(false);
  }
 });
 it.each([['Volkswagen','VW'],['VW','Volkswagen'],['Mercedes-Benz','Mercedes'],['Mercedes','MB'],['MB','Mercedes-Benz'],['BMW','BMW'],['Volkswagen Nutzfahrzeuge','VW Nutzfahrzeuge'],['Skoda','Škoda'],['Citroën','Citroen'],['Alfa Romeo','Alfa'],['Chevrolet','Chevy']])('matches make %s to title alias %s',(make,alias)=>{
  const result=checkListing({title:`${alias} Example 1.5 Turbo`,fields:{make,model:'Example',variant:'1.5 Turbo Premium'}});
  expect(result.checks.find(check=>check.id==='title_content')?.status).toBe('pass');
 });
 it.each(['DSG','Automatik','automatic'])('recognises transmission %s',transmission=>{
  expect(checkListing({title:`VW Golf ${transmission}`,fields:{make:'Volkswagen',model:'Golf'}}).checks.find(check=>check.id==='title_content')?.status).toBe('pass');
 });
 it.each(['VW Golfish 1.5 TSI','BMW Golf 1.5 TSI','VW Golf 2.0 Turbo'])('still warns on unmatched identity or specification: %s',title=>{
  expect(checkListing({title,fields:{make:'Volkswagen',model:'Golf',variant:'1.5 Premium'}}).checks.find(check=>check.id==='title_content')?.status).toBe('warn');
 });
 it.each([[4,0,1,2,3,5,6,7,8,9,10,11],[0,4,1,2,3,5,6,7,8,9,10,11]])('warns on interior-first or exterior-after-interior filename order %#',(...indices)=>{
  const result=checkListing({...dealer,image_urls:indices.map(index=>dealer.image_urls![index])});
  expect(result.checks.find(check=>check.id==='photo_order')?.status).toBe('warn');
 });

 it('gives a complete generic listing A with schema-valid output',()=>{const r=checkListing(complete);expect(r.score).toBeGreaterThanOrEqual(90);const ajv=new Ajv();expect(ajv.validate(tools[0].outputSchema,r),JSON.stringify(ajv.errors)).toBe(true);});
 it('prioritises missing core data and zero photos',()=>{const r=checkListing({title:'Car'});expect(r.score).toBeLessThan(60);expect(r.missing_fields).toContain('make');expect(r.top_fixes[0].priority).toBe('high');});
 it('accepts zero mileage and false accident-free without inventing facts',()=>{const r=checkListing({...complete,fields:{...complete.fields,mileage:0,accident_free:false}});expect(r.missing_fields).not.toContain('mileage');expect(r.checks.find(c=>c.id==='damage_photos')?.status).toBe('warn');});
 it('detects duplicates, gives URLs precedence and warns on invalid format',()=>{const r=checkListing({title:'Car',photo_count:99,image_urls:['https://example.org/a.jpg','https://example.org/a.jpg#copy','file:///tmp/a']});expect(r.checks.find(c=>c.id==='photo_duplicates')?.status).toBe('warn');expect(r.checks.find(c=>c.id==='photo_count')?.message).toContain('3 photos');expect(r.checks.find(c=>c.id==='photo_url_format')?.status).toBe('warn');});
 it('uses only filename hints and explicit labels override them',()=>{const r=checkListing({...complete,photo_order:['rear'],image_urls:['https://example.org/front_3_4.jpg']});expect(r.checks.find(c=>c.id==='photo_order')?.status).toBe('warn');});
 it('detects German keywords and red flags',()=>{const r=checkListing({title:'VW Golf',description:'Fahrzeug Zustand Sitzheizung ohne Gewährleistung'});expect(r.language).toBe('de');expect(r.checks.find(c=>c.id==='red_flags')?.status).toBe('warn');expect(r.checks.find(c=>c.id==='equipment')?.message).not.toContain('heated seats');});
 it('warns on shouting, emoji overload and stuffing',()=>{const r=checkListing({title:'GOLF GOLF GOLF SUPER CAR',description:'WOW!!!! 😀😀😀😀😀😀'});expect(r.checks.find(c=>c.id==='formatting')?.status).toBe('warn');expect(r.checks.find(c=>c.id==='title_repetition')?.status).toBe('warn');});
 it('adds German new car guidance and missing energy fields',()=>{const r=checkListing({title:'New car',market:'de',fields:{condition:'new'}});expect(r.missing_fields).toContain('co2');expect(r.checks.find(c=>c.id==='new_car_energy')?.message).toContain('not compliance-checked');});
 it.each(['de','us','uk','generic'] as const)('provides a schema-valid %s checklist',market=>{const ajv=new Ajv();expect(ajv.validate(tools[1].outputSchema,checklist(market))).toBe(true);});
 it('varies market fields and new/used guidance',()=>{expect(checklist('us').required_fields).toContain('model_year');expect(checklist('uk').required_fields).toContain('inspection_due');expect(checklist('generic','new').required_fields).not.toContain('service_history');});
 it.each([{},{title:' '},{title:'a'.repeat(301)},{description:'a'.repeat(20001)},{title:'x',photo_count:-1},{title:'x',image_urls:Array(101).fill('x')},{title:'x',fields:{first_registration:'2024-13'}},{title:'x',market:'fr'},{title:'x',fields:{price:'20'}},{title:'x',unexpected:true}])('rejects invalid arguments %#',args=>{expect(()=>validate(args,checkInput)).toThrow();});
 it('runs maximum listing scoring comfortably below 10ms average after warmup',()=>{const large={...complete,description:'Condition and equipment details.\n'.repeat(625).slice(0,20000),image_urls:Array.from({length:100},(_,i)=>`https://example.org/${i}.jpg`)};for(let i=0;i<20;i++)checkListing(large);const start=performance.now();for(let i=0;i<200;i++)checkListing(large);const ms=(performance.now()-start)/200;console.info(`Large listing scoring average: ${ms.toFixed(3)} ms (local wall time, not Workers CPU).`);expect(ms).toBeLessThan(10);});
});

describe('listing language',()=>{
 it.each([
  'Scheckheftgepflegt. Erstzulassung 06/2021, 42.000 km. Unfallfrei, Nichtraucherfahrzeug. Ausstattung: Navi, Head-Up-Display, LED und ACC.',
  'Scheckheftgepflegt', 'Erstzulassung 2021', 'TÜV neu', 'Unfallfrei', 'Ausstattung: LED', 'Nichtraucherfahrzeug',
  'Großer Kofferraum', 'Rückfahrkamera', 'TÜV neu'.normalize('NFD'),
  'Wir bieten Ihnen einen gepflegten Golf mit Navi, Head-Up-Display und LED an.',
  'Mit LED, nur 42000 km.', 'Das Auto ist sehr gepflegt.', 'scheckheftgepflegt, navi, led',
 ])('detects German without overrides: %s',description=>{
  expect(checkListing({description}).language).toBe('de');
  expect(checkListing({title:description,language:'auto'}).language).toBe('de');
 });
 it.each([
  'Ford Focus Automatic',
  'Full service history, accident free, non-smoker. First registration June 2021. Equipment: Navi, Head-Up-Display, LED. Only 42000 km. Call for a viewing.',
  'LED Navi Head-Up-Display 42000 km',
  'Skoda Superb with LED headlights and 50000 km. One owner, excellent condition.',
  'BMW 320d, sunroof, automatic transmission. Service records available.',
 ])('keeps English listings English: %s',description=>expect(checkListing({description}).language).toBe('en'));
 it.each(['de','DE','at','AT','ch','CH','us','uk','generic'] as const)('respects market and explicit language for %s',market=>{
  const german=['de','DE','at','AT','ch','CH'].includes(market);
  const input={description:german?'Full service history.':'Scheckheftgepflegt',market};
  validate(input,checkInput);
  for(const language of [undefined,'auto'] as const){
   const result=checkListing({...input,language});
   expect(result.language).toBe(german||market==='generic'?'de':'en');
   expect(new Ajv().validate(tools[0].outputSchema,result)).toBe(true);
   if(['at','AT','ch','CH'].includes(market)){
    expect(result.market).toBe('generic');
    expect(result.checks.some(check=>check.id==='new_car_energy')).toBe(false);
   }
  }
  for(const language of ['de','en'] as const){
   validate({...input,language},checkInput);
   expect(checkListing({...input,language}).language).toBe(language);
  }
 });
 it.each(['de','en'] as const)('respects explicit %s without market',language=>{
  expect(checkListing({description:language==='de'?'Full service history':'Scheckheftgepflegt',language}).language).toBe(language);
 });
 it('rejects unsupported language values',()=>expect(()=>validate({title:'Car',language:'fr'},checkInput)).toThrow());
});
