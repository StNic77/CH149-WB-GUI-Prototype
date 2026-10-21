// Read-only reference access. Write only the reduced prototype catalogue and provenance.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=__dirname,sourceFile=path.join(root,'../CH-149-615-WB - Active Dev/config.js');
const sourceText=fs.readFileSync(sourceFile,'utf8'),context={};
vm.runInNewContext(sourceText+'\nglobalThis.reference=AC;',context,{timeout:5000});
const source=context.reference;
const fields=['meta','stowage','missionEquip','roleFit','presets','crewSeats','paxSeats','patientPositions','bayArms','ramp','crewEquipmentPlacement'];
for(const field of fields)if(!source[field]||typeof source[field]!=='object')throw Error('Missing reference catalogue: '+field);
const reduced=Object.fromEntries(fields.map(field=>[field,source[field]]));
const current={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'config-data.js'),'utf8'),current);
const backup=path.join(root,'references',`config-snapshot-v${current.window.CH149_DATA.meta.configVersion}-before-v${source.meta.configVersion}.json`);
if(current.window.CH149_DATA.meta.configVersion!==source.meta.configVersion&&!fs.existsSync(backup))fs.writeFileSync(backup,JSON.stringify(current.window.CH149_DATA,null,2));
fs.writeFileSync(path.join(root,'config-data.js'),'window.CH149_DATA='+JSON.stringify(reduced)+';\n');
const hash=crypto.createHash('sha256').update(sourceText).digest('hex').toUpperCase();
const bayContext={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'bay-data.js'),'utf8'),bayContext);
const bayData=bayContext.window.CH149_BAY_DATA;
for(const bay of bayData.bays){if(!Number.isFinite(source.bayArms[bay.id]))throw Error('Missing source bay arm: '+bay.id);if(bay.armDecision){bay.sourceArm=source.bayArms[bay.id];}else bay.arm=source.bayArms[bay.id];}
Object.assign(bayData.source,{configVersion:source.meta.configVersion,sha256:hash,verified:new Date().toISOString().slice(0,10)});
fs.writeFileSync(path.join(root,'bay-data.js'),'/* Source catalogue plus explicit user bay-arm decisions. */\nwindow.CH149_BAY_DATA = '+JSON.stringify(bayData,null,2)+';\n');
fs.writeFileSync(path.join(root,'config-source.json'),JSON.stringify({file:'../CH-149-615-WB - Active Dev/config.js',configVersion:source.meta.configVersion,sha256:hash,refreshedAt:new Date().toISOString(),fields,scope:'Pinned reduced catalogue; no credentials, aircraft acceptance, fuel or whole-aircraft calculation integration.',prototypeOverrides:bayData.bays.filter(bay=>bay.armDecision).map(bay=>({bay:bay.id,arm:bay.arm,sourceArm:bay.sourceArm,decision:bay.armDecision}))},null,2));
console.log('Refreshed prototype catalogue from reference configuration '+source.meta.configVersion+'; explicit bay-arm decisions retained.');
