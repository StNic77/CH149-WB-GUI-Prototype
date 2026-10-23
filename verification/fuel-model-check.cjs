const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),c={window:{}};
for(const name of ['fuel-source.js','fuel-reference.js','fuel-model.js'])vm.runInNewContext(fs.readFileSync(path.join(root,name),'utf8'),c);
const model=c.window.CabinFuel,data=c.window.CH149_FUEL_SOURCE;
const clean=x=>JSON.parse(JSON.stringify(x));
// Independent source execution verifies the pinned block rather than duplicating its formula.
const ref={},sourceRoot=path.join(root,'../CH-149-615-WB - Active Dev');
if(fs.existsSync(path.join(sourceRoot,'config.js'))&&fs.existsSync(path.join(sourceRoot,'compute.js')))vm.runInNewContext(fs.readFileSync(path.join(sourceRoot,'config.js'),'utf8')+'\n'+fs.readFileSync(path.join(sourceRoot,'compute.js'),'utf8')+'\nglobalThis.solve=solveFuelTanksFromTotal;',ref);
assert.equal(data.maxFuelKg,4152);
for(let total=0;total<=4152;total++){
 const result=model.evaluate({total,landing:0});
 if(ref.solve)assert.deepEqual(clean(result.fuel.tanks),clean(ref.solve(total)));
 assert.equal(result.w,total);
 assert.equal(result.m,Object.entries(result.fuel.tanks).reduce((n,[k,w])=>n+w*data.fuelTankArms[k],0));
}
const input={total:2000,landing:300},before=JSON.stringify(input),base={weight:11000,moment:11000*8000};
const auto=model.evaluate(input,base);assert.equal(JSON.stringify(input),before);assert.equal(auto.plot.track[0].fuel,2000);assert.equal(auto.plot.track.at(-1).fuel,300);assert.equal(auto.plot.departure.w,13000);
const manual=model.evaluate({manualTanks:true,tanks:{T1:500,T2:400,T3:300},landing:300},base);
assert.equal(manual.w,1200);assert.equal(manual.plot.track.length,0);assert.equal(manual.plot.manual,true);assert.ok(manual.advisory);
for(const bad of [-1,4153,NaN,Infinity])assert.throws(()=>model.evaluate({total:bad,landing:0}));
assert.throws(()=>model.evaluate({total:100,landing:101}));assert.throws(()=>model.evaluate({manualTanks:true,tanks:{T1:3000,T2:2000},landing:0}));
assert.deepEqual(clean(model.allowances(11000)).map(x=>x.maxFuelKg),[4152,4152]);
assert.deepEqual(clean(model.allowances(12000)).map(x=>x.maxFuelKg),[3600,4000]);
assert.deepEqual(clean(model.allowances(15500)).map(x=>x.maxFuelKg),[100,500]);
assert.equal(model.allowances(16001)[1].overweightWithoutFuel,true);
assert.equal(model.allowances(12000.4)[0].maxFuelKg,3599);
assert.throws(()=>model.allowances(null));
console.log('Fuel: all 4,153 whole-kg quantities, cap, manual mode, burn endpoints, allowances and input preservation passed.'+(ref.solve?' Active Dev solver parity passed.':' Active Dev unavailable; live-source parity skipped.'));
