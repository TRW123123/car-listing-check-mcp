import { shots } from './schema';
export type Market='de'|'us'|'uk'|'generic';
export interface Input {title?:string;description?:string;fields?:Record<string,string|number|boolean>;image_urls?:string[];photo_count?:number;photo_order?:string[];video_url?:string;has_walkaround_video?:boolean;market?:Market;language?:'auto'|'de'|'en'}
export type Check={id:string;category:string;status:'pass'|'warn'|'fail';message:string;fix:string};
export const scope='Checks supplied content only. Does not fetch or scrape any website, verify vehicle facts, inspect images, generate images or videos, or provide legal advice.';
// Ported from the aicarvideo.com / autohaus-video.de listing checker.
// Editorial guidance covers structure, condition disclosure and photo metadata.
// Numeric title/description/photo thresholds below are our editorial recommendations, not portal rules.
export function coreFields(market:Market,condition?:string){return ['make','model','price','currency','mileage','mileage_unit','fuel_type','transmission','condition','location',...(condition==='new'?[]:['first_registration','service_history']),...(market==='de'?['power','inspection_due',...(condition==='new'?['consumption','co2','energy_efficiency']:[])]:[]),...(market==='uk'?['inspection_due']:[]),...(market==='us'?['model_year','vin_provided']:[])];}
export function checklist(market:Market='generic',condition?:string){return {market,vehicle_condition:condition??'both',required_fields:coreFields(market,condition),additional_fields:['variant','body_type','color','doors','seats','previous_owners','accident_free','power_kw or power_hp','known_damage','contact_provided'],photo_shots:shots,photo_recommendation:'Recommended minimum: 8 distinct photos; ideal: 12–20. Cover the actual vehicle; add damage photos for known damage. These are recommendations, not portal requirements.',title_pattern:'Make + model + variant/engine + one useful key specification; recommended 30–80 characters.',description_structure:['Vehicle overview and core specifications','Condition and known issues','Documented service, inspection and repair history','Verified equipment in bullets','Full price, currency and mandatory charges','Location, contact and viewing next step'],market_guidance:market==='de'?'General guidance: new cars need applicable Pkw-EnVKV consumption, CO2 and energy-efficiency information. Check current requirements before publishing; this is not legal advice.':market==='us'?'State model year and VIN availability; explain title/accident history and full price including mandatory charges. Local requirements vary.':market==='uk'?'State registration, mileage units, MOT/inspection status and full price including mandatory charges. Local requirements vary.':'State registration/year, mileage units, condition, full price and contact route. Local requirements vary.',scope};}
const equipment: [string,RegExp][]=[['navigation',/\b(navigation|navi|sat[ -]?nav)\b/i],['heated seats',/heated seats?|sitzheizung/i],['LED headlights',/\bled\b/i],['adaptive cruise control',/adaptive cruise|abstands(tempomat|regel)|\bacc\b/i],['parking sensors',/parking sensors?|parksensor|einparkhilfe|\bpdc\b/i],['camera',/camera|kamera/i],['Apple CarPlay / Android Auto',/carplay|android auto/i],['tow bar',/tow ?bar|trailer hitch|anhängerkupplung|\bahk\b/i],['air conditioning',/air condition|klimaanlage|climate control/i],['alloy wheels',/alloy|leichtmetall/i],['sunroof',/sunroof|schiebedach|panorama/i]];
// Match whole tokens while ignoring accents, punctuation and case.
const tokens=(value:string):string[]=>value.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().match(/[\p{L}\p{N}]+/gu)??[];
const makeAliases=[['Volkswagen','VW'],['Volkswagen Nutzfahrzeuge','VW Nutzfahrzeuge'],['Mercedes','Mercedes-Benz','MB'],['BMW'],['Skoda','Škoda'],['Citroen','Citroën'],['Alfa','Alfa Romeo'],['Chevy','Chevrolet']];
const containsTokens=(title:string[],value:string)=>{const parts=tokens(value);return parts.length>0&&parts.every(part=>title.includes(part));};
export function checkListing(input:Input){
 const f=input.fields??{}, title=input.title??'',desc=input.description??'',text=title+'\n'+desc,low=text.toLowerCase(),market=input.market??'generic';
 const has=(k:string)=>f[k]!==undefined&&f[k]!=='';
 const missing=coreFields(market,f.condition as string).filter(k=>k==='power'?!has('power_kw')&&!has('power_hp'):k==='vin_provided'?f[k]!==true:!has(k));
 const checks:Check[]=[];
 const add=(id:string,category:string,status:Check['status'],message:string,fix:string)=>checks.push({id,category,status,message,fix:status==='pass'?'':fix});
 add('core_data','data',missing.length?'fail':'pass',missing.length?`Missing structured core data: ${missing.join(', ')}.`:'Structured core data supplied (not verified).','Supply the missing fields from vehicle records; do not guess. Text may contain data that this structured-field check cannot recognise.');
 add('title_length','title',title.length>=30&&title.length<=80?'pass':'warn',`Title has ${Array.from(title).length} characters; recommended window: 30–80, not a portal limit.`,'Use a concise make + model + variant + key specification title.');
 const titleTokens=tokens(title);
 const make=typeof f.make==='string'?f.make:'';
 const aliases=makeAliases.find(group=>group.some(alias=>tokens(alias).join(' ')===tokens(make).join(' ')))??[make];
 const identity=aliases.some(alias=>containsTokens(titleTokens,alias))&&typeof f.model==='string'&&containsTokens(titleTokens,f.model);
 const variantTokens=typeof f.variant==='string'?tokens(f.variant).slice(0,2):[];
 const spec=/\b(automatic|automatik|dsg|manual|hybrid|electric|diesel|petrol|tsi|tdi|kw|hp|ps|awd|4wd|ev)\b/i.test(title)||(variantTokens.length>0&&variantTokens.every(part=>titleTokens.includes(part)));
 add('title_content','title',identity&&spec?'pass':'warn','Title should identify make, model and a useful specification.','Include the verified make, model and engine, transmission or trim; provide fields to allow matching.');
 const words=title.toLowerCase().match(/[\p{L}\p{N}]+/gu)??[];
 add('title_repetition','title',words.some(w=>w.length>2&&words.filter(x=>x===w).length>=3)?'warn':'pass','Title repetition/keyword stuffing check.','Remove repeated keywords and unrelated search terms.');
 add('description_length','description',desc.length>=300&&desc.length<=5000?'pass':'warn',`Description has ${Array.from(desc).length} characters; recommended 300–5,000, not a portal limit.`,'Add useful factual detail or remove repetition; prioritise readability.');
 add('description_structure','description',desc.split(/\n/).filter(x=>x.trim()).length>=4?'pass':'warn','Check for readable sections or bullet lines.','Use sections for overview, condition, history, equipment, price and contact.');
 const unmentioned=equipment.filter(([,r])=>!r.test(text)).map(([name])=>name);
 add('equipment','description',unmentioned.length<=5?'pass':'warn',`Equipment topics not detected: ${unmentioned.join(', ')||'none'}. Keyword presence does not prove fitment.`,'List relevant equipment only if fitted and verified. Omit absent features; do not copy a specification from a similar car.');
 const condition=/condition|known issues|damage|scratch|wear|zustand|mängel|kratzer|gebrauchsspuren/i.test(desc);
 add('condition_disclosure','transparency',condition?'pass':'warn','Condition and known-issue wording check.','Describe visible wear, known defects and repair/accident history accurately; use unknown where necessary.');
 const urls=input.image_urls;
 const count=urls!==undefined?urls.length:input.photo_count??0;
 add('photo_count','photos',count>=8?'pass':count===0?'fail':'warn',`${count} photos reported. Recommended minimum 8; ideal 12–20 distinct views; no portal requirement implied.`,'Add distinct exterior, interior, odometer, trunk and tyre views, plus known damage.');
 const canonical=(u:string)=>{try{const x=new URL(u);x.hash='';return x.toString();}catch{return u.trim();}};
 const duplicates=urls?urls.length-new Set(urls.map(canonical)).size:0;
 add('photo_duplicates','photos',duplicates?'warn':urls?'pass':'warn',urls?`${duplicates} duplicate URL entries detected; different URLs may still show the same image.`:'No URLs supplied; duplicate images cannot be assessed.','Remove repeated URL entries and manually review visually similar images.');
 const formatIssues=urls?.filter(u=>{try{return !/^https?:$/.test(new URL(u).protocol);}catch{return true;}}).length??0;
 add('photo_url_format','photos',formatIssues?'warn':urls?'pass':'warn',urls?`${formatIssues} URL strings are not obvious HTTP(S) addresses. No URLs were fetched.`:'No image URL format hints available.','Supply ordinary HTTP(S) image URLs if available; extensions are not required.');
 const inferred=urls?.map(u=>{let name='';try{name=decodeURIComponent(new URL(u).pathname.split('/').pop()??'').toLowerCase();}catch{name=u.toLowerCase();}return /damage/.test(name)?'damage':/rear_seats/.test(name)?'interior_front':/interior/.test(name)?'interior_front':/wheel/.test(name)?'wheels':shots.find(s=>name.includes(s))??'unknown';});
 const order=input.photo_order??inferred??[];
 const absent=['interior_front','odometer','trunk','wheels'].filter(s=>!order.includes(s));
 // Extra detail shots do not interrupt the exterior/interior sequence.
 const stages:Record<string,number>={front_3_4:0,side:0,rear:0,interior_front:1,dashboard:1,trunk:2,wheels:2};
 const sequence=order.filter(shot=>stages[shot]!==undefined).map(shot=>stages[shot]);
 const ordered=sequence.every((stage,index)=>index===0||stage>=sequence[index-1]);
 add('photo_order','photos',order[0]==='front_3_4'&&!absent.length&&ordered?'pass':'warn',`Order based on ${input.photo_order?'supplied labels':inferred?'filename hints only':'no shot data'}; missing/unconfirmed views: ${absent.join(', ')||'none'}.`,'Start with a front 3/4 exterior view, then side/rear, interior, dashboard/odometer, trunk and wheels/tyres. Labels and filenames do not verify image content.');
 const damage=f.known_damage===true||f.accident_free===false||/\b(damage|scratch|dent|kratzer|schaden|unfallschaden)\b/i.test(desc);
 add('damage_photos','photos',!damage||order.includes('damage')?'pass':'warn',damage?'Damage/accident indication supplied; check supporting photos.':'No explicit damage indication detected; condition is not verified.','Add clear damage photos in context and close-up, and disclose known issues in the text.');
 add('walkaround','video',input.has_walkaround_video===true||!!input.video_url?'pass':'warn','Walkaround presence is based only on supplied metadata, not verified.','Add a walkaround video of the actual vehicle as a best-practice tip.');
 add('price_transparency','transparency',has('price')&&has('currency')?'pass':'warn','Full asking price and currency should be explicit.','Supply the total asking price and currency; explain mandatory charges and distinguish finance instalments.');
 add('contact','transparency',f.contact_provided===true||/\b(contact|call|phone|viewing|appointment|kontakt|telefon|besichtigung|termin)\b|[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(desc)?'pass':'warn','Actionable contact/viewing route wording check.','State an available contact route and how to arrange a viewing; test it before publishing.');
 const red=/no warranty|as seen|sold as is|ohne (?:garantie|gewährleistung)|gekauft wie gesehen|bastlerfahrzeug/i.test(text);
 add('red_flags','transparency',red?'warn':'pass','Potentially ambiguous warranty/condition wording check.','Replace vague blanket wording with specific disclosures; have dealer warranty wording reviewed by a qualified adviser. This is not legal advice.');
 const letters=text.replace(/[^\p{L}]/gu,'');const shouting=letters.length>15&&letters.replace(/[^\p{Lu}]/gu,'').length/letters.length>.7;
 const emoji=(text.match(/\p{Extended_Pictographic}/gu)??[]).length;
 add('formatting','formatting',shouting||emoji>5||/[!]{4,}/.test(text)?'warn':'pass','Shouting, excessive punctuation and emoji overload check.','Use sentence case, simple headings and restrained punctuation (recommended maximum five emoji).');
 if(market==='de'&&(f.condition==='new'||!has('condition'))){const absent=['consumption','co2','energy_efficiency'].filter(k=>!has(k));add('new_car_energy','market',absent.length?'warn':'pass','General guidance: new cars need applicable Pkw-EnVKV consumption, CO2 and energy-efficiency information; supplied values are not compliance-checked.','Confirm vehicle condition and add applicable consumption, CO2 and efficiency information. Check current requirements with a qualified adviser; not legal advice.');}
 const score=Math.round(checks.reduce((sum,c)=>sum+(c.status==='pass'?1:c.status==='warn'?.5:0),0)/checks.length*100);
 const top_fixes=checks.filter(c=>c.status!=='pass').sort((a,b)=>(a.status==='fail'?0:1)-(b.status==='fail'?0:1)).slice(0,5).map(c=>({id:c.id,priority:c.status==='fail'?'high':'medium',fix:c.fix}));
 const language=input.language&&input.language!=='auto'?input.language:/\b(und|fahrzeug|kilometerstand|sitzheizung|zustand|erstzulassung|getriebe)\b/i.test(low)?'de':'en';
 return {score,grade:score>=90?'A':score>=75?'B':score>=60?'C':score>=40?'D':'F',market,language,checks,top_fixes,missing_fields:missing,scope};
}
