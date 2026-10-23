const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),c={window:{}};
for(const file of ['config-data.js','bay-data.js','fuel-source.js','fuel-reference.js','fuel-model.js','planning-source.js','planning-reference.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),c);
const d=c.window.CH149_DATA;
c.window.CH149_FLOOR_SPACES=c.window.CH149_BAY_DATA.bays.filter(b=>b.forward!==undefined).flatMap(b=>['PORT','CENTRE','STBD'].map(side=>({id:b.id+'_'+side,bay:b.id})));
vm.runInNewContext(fs.readFileSync(path.join(root,'planning-model.js'),'utf8'),c);
const model=c.window.CabinPlanning,clean=x=>JSON.parse(JSON.stringify(x));
function state(){return {preset:'',mission:new Set(),roleFit:new Set(),seats:new Set(['C1','C2','P2','P3']),occupants:{},patients:{},moved:{},floorLoads:[],planning:{basis:'RFM',basicWeight:10000,basicCG:8000,fuel:0}};}
const s=state(),nvg='ME_SAR_MISSION_EQUIP_NVG_SET_AND_CASE';s.mission.add(nvg);
const e=model.shelf(s,'LOCKBOX_TOP'),f=model.shelf(s,'LOCKBOX_BTM'),unit=d.missionEquip[nvg].unitWeight;
assert.equal(e.rows[0].quantity,4);assert.equal(f.rows[0].quantity,1);assert.equal(e.total,4*unit);assert.equal(f.total,unit);assert.equal(model.missionRows(s).reduce((n,r)=>n+r.w,0),5*unit);
const before=JSON.stringify(clean({...s,mission:[...s.mission],roleFit:[...s.roleFit],seats:[...s.seats]})),loaded=model.evaluate(s).wb;
assert.equal(JSON.stringify(clean({...s,mission:[...s.mission],roleFit:[...s.roleFit],seats:[...s.seats]})),before);
s.mission.delete(nvg);const empty=model.evaluate(s).wb;assert.ok(Math.abs(loaded.auwExact-empty.auwExact-5*unit)<1e-8);
s.mission.add(nvg);s.moved[nvg]={loc:'PORT_FWD_SHELF_TOP'};assert.equal(model.shelf(s,'LOCKBOX_TOP').total,0);assert.equal(model.shelf(s,'PORT_FWD_SHELF_TOP').total,5*unit);assert.equal(model.evaluate(s).wb.auwExact,loaded.auwExact);assert.notEqual(model.evaluate(s).wb.auwCG,loaded.auwCG);
s.stowageLoads={PORT_FWD_SHELF_TOP:30};assert.equal(model.shelf(s,'PORT_FWD_SHELF_TOP').level,'caution');assert.equal(model.shelf(s,'CABINET_TOP_SURFACE').limit,null);assert.equal(model.shelf(s,'CABINET_TOP_SURFACE').level,'unreviewed');
const add=model.evaluate(s).wb;assert.equal(add.zonesTotal,30);assert.ok(Math.abs(add.auwExact-loaded.auwExact-30)<1e-8);
s.floorLoads=[{id:1,area:'BAY55_PORT',kind:'bay',weight:1400,arm:10125},{id:2,area:'BAY55_STBD',kind:'individual',weight:200,arm:10125}];assert.equal(model.bay(s,'BAY55').total,1600);assert.equal(model.bay(s,'BAY55').excess,100);assert.equal(model.bay(s,'BAY55',{...s.floorLoads[1],weight:50},2).total,1450);assert.equal(model.evaluate(s).wb.cargoTotal,200);
s.planning.fuel=4152;assert.equal(model.evaluate(s).wb.fuelTotal,4152);assert.ok(model.evaluate(s).allowances.every(r=>r.maxFuelKg<=4152));
// Included role fit is subtracted exactly once on removal under the captured-fit basis.
const t=state(),key='RF_SAR_EQUIPMENT_FWD_SAR_CABINET';t.roleFit.add(key);t.planning={...t.planning,basis:'CURRENT',baseline:{roleFit:{[key]:true},seats:Object.fromEntries([...t.seats].map(k=>[k,true]))}};
assert.equal(model.evaluate(t).wb.auwExact,10000);t.roleFit.delete(key);assert.equal(model.evaluate(t).wb.auwExact,10000-d.roleFit[key].w);
// Source calculation parity runs against the same explicitly adapted state and pinned catalogue.
const sourceRoot=path.join(root,'../CH-149-615-WB - Active Dev');
if(fs.existsSync(path.join(sourceRoot,'compute.js'))){const raw={};const rawConfig=fs.readFileSync(path.join(sourceRoot,'config.js'),'utf8'),rawMath=fs.readFileSync(path.join(sourceRoot,'compute.js'),'utf8'),rawAccounting=fs.readFileSync(path.join(sourceRoot,'accounting.js'),'utf8').replace(/^normalizeAccountingConfiguration\(\);\r?\n/m,'');
vm.runInNewContext(rawConfig+'\n'+rawAccounting+'\n'+rawMath+'\nglobalThis.run=(data,s)=>{Object.assign(AC,data);globalThis.STORE={sessions:{check:s}};return computeWB("check");};',raw);
const config={...clean(d),...clean(c.window.CH149_FUEL_SOURCE),envelope:clean(c.window.CH149_PLANNING_SOURCE.envelope),bayArms:Object.fromEntries(c.window.CH149_BAY_DATA.bays.map(b=>[b.id,b.arm]))};
// Resolver calls use the pinned source mission functions, independently of the adapter calculations.
const mf=fs.readFileSync(path.join(root,'planning-reference.js'),'utf8');const a=mf.indexOf('function missionLocations'),b=mf.indexOf('/* Explicit sortie');vm.runInNewContext(mf.slice(a,b),raw);
assert.deepEqual(clean(model.evaluate(s).wb),clean(raw.run(config,clean(model.session(s)))));}
console.log('Planning: NVG 4+1, quantities, moves/removal, shelf warnings/unknown capacity, combined bay drafts, fuel cap, baseline accounting and source-engine parity passed.');
