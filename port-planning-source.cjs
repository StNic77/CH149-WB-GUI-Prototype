// Deliberate source-only import. Existing aircraft catalogue and geometry are never refreshed.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=__dirname,source=path.join(root,'../CH-149-615-WB - Active Dev');
const files=Object.fromEntries(['config.js','mission.js','accounting.js','compute.js','app.js'].map(name=>[name,fs.readFileSync(path.join(source,name),'utf8')]));
function block(file,start,end){const a=files[file].indexOf(start),b=files[file].indexOf(end,a+start.length);if(a<0||b<0)throw Error('Source structure changed: '+file);return files[file].slice(a,b);}
const context={};
vm.runInNewContext(files['config.js']+'\n'+block('mission.js','const LEGACY_STOWAGE_LIMITS','function stowageMarker')+'\nglobalThis.result={data:AC,limits:stowageLimits()};',context);
const {data,limits}=context.result;
const bayRows=block('app.js','  // RFM constraints:','  const clamp =');
const bayLimits={};for(const m of bayRows.matchAll(/findKey\("(bay\d+)"\),\s*max:\s*(\d+)/g))bayLimits[m[1].toUpperCase()]=Number(m[2]);
if(Object.keys(bayLimits).length!==7)throw Error('Review source bay limits.');
const snapshot={source:{configVersion:data.meta.configVersion,files:Object.fromEntries(Object.entries(files).map(([name,text])=>[name,crypto.createHash('sha256').update(text).digest('hex')]))},stowageLimits:limits,stowageNames:Object.fromEntries(Object.entries(data.stowage).map(([id,row])=>[id,row.name])),bayLimits,envelope:data.envelope};
fs.writeFileSync(path.join(root,'planning-source.js'),'/* Pinned limits/envelope and provenance; equipment remains in config-data.js. */\nwindow.CH149_PLANNING_SOURCE='+JSON.stringify(snapshot,null,2)+';\n');
const mission=block('mission.js','function missionLocations','function roleMissionLocationWarning')+block('mission.js','function missionDefaultAllocation','function missionIssues');
const accounting=files['accounting.js'].replace(/^normalizeAccountingConfiguration\(\);\r?\n/m,'');
const compute=files['compute.js'].slice(0,files['compute.js'].indexOf('/* =========================\r\n   ACCEPTANCE INVALIDATION'));
if(!compute.includes('function computeWB(')||compute.length<1000)throw Error('Review compute block.');
fs.writeFileSync(path.join(root,'planning-reference.js'),'/* Pinned Active Dev function bodies. Startup normalization is omitted; all state is private. */\nwindow.CabinPlanningReferenceFactory=function(AC,STORE){\n'+mission+'\n'+accounting+'\n'+compute+'\nreturn {computeWB,missionRows,stowageLimits,computeRoleFitAdjustment,computeSeatTotals};\n};\n');
console.log('Pinned reference accounting, calculations and limits without source-app UI or persistence.');
