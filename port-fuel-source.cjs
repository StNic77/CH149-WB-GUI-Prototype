// Deliberate fuel-only import. Never refresh the equipment catalogue here.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=__dirname,sourceRoot=path.join(root,'../CH-149-615-WB - Active Dev');
const config=fs.readFileSync(path.join(sourceRoot,'config.js'),'utf8');
const compute=fs.readFileSync(path.join(sourceRoot,'compute.js'),'utf8');
const app=fs.readFileSync(path.join(sourceRoot,'app.js'),'utf8');
const context={};vm.runInNewContext(config+'\nglobalThis.data=AC;',context,{timeout:5000});
const source=context.data,hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const snapshot={source:{configVersion:source.meta.configVersion,files:Object.fromEntries([['config.js',config],['compute.js',compute],['app.js',app]].map(([name,text])=>[name,hash(text)])),scope:'Fuel-only pinned snapshot; source app remains read-only.'},maxFuelKg:Math.min(4152,source.maxFuelKg),fuelTankArms:source.fuelTankArms,fuelStages:source.fuelStages,tankBays:{T1:6,T2:3,T3:2,T4:1,T5:4},auwTargets:[15600,16000]};
const start=compute.indexOf('function solveFuelTanksFromTotal('),end=compute.indexOf('function cgBand(',start);
if(start<0||end<0||snapshot.maxFuelKg!==4152)throw Error('Review changed source before importing fuel.');
fs.writeFileSync(path.join(root,'fuel-source.js'),'/* Pinned Active Dev fuel data. Regenerate deliberately with port-fuel-source.cjs. */\nwindow.CH149_FUEL_SOURCE='+JSON.stringify(snapshot,null,2)+';\n');
fs.writeFileSync(path.join(root,'fuel-reference.js'),'/* Unmodified fuel helper block from Active Dev compute.js. Private dependencies supplied by fuel-model.js. */\nwindow.CabinFuelReferenceFactory=function(AC,STORE,computeWB){\nconst roundKg=Math.round,roundMm=Math.round;\nconst cgFromMoment=(w,m)=>w>0?m/w:null;\n'+compute.slice(start,end)+'\nreturn {solveFuelTanksFromTotal,computeFuelTotals,computeBurnTrack,computeLandingPoint,fuelPlotState};\n};\n');
console.log('Pinned fuel configuration and reference helpers only.');
