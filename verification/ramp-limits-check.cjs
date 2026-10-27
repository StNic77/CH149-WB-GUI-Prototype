const prepare=require('./compact-test-navigation.cjs');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),context={window:{}};vm.createContext(context);
for(const file of ['config-data.js','ramp-limits.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const rules=context.window.CabinRampLimits,limits=rules.limits;
assert.deepEqual(JSON.parse(JSON.stringify(limits)),{hinge:11393,end:14393,maxClosed:350,maxOpen:450,hingeMomentMax:450});
const reference=path.join(root,'../CH-149-615-WB - Active Dev/config.js');
if(fs.existsSync(reference)){const source=fs.readFileSync(reference,'utf8'),sourceLimits=JSON.parse(source.match(/const AC_RAMP = (\{[\s\S]*?\});/)[1]);assert.deepEqual(JSON.parse(JSON.stringify(limits)),sourceLimits);}
const row=(weight,arm,area='RAMP',id=1)=>({id,kind:'individual',area,weight,arm,installed:true});
const state=loads=>({floorLoads:loads,mission:new Set()});
assert.equal(rules.assess(state([row(300,12893)])).momentOK,true);
assert.equal(rules.assess(state([row(300.001,12893)])).momentOK,false);
for(const [weight,closed,open]of [[350,true,true],[350.001,false,true],[450,false,true],[450.001,false,false]]){const result=rules.assess(state([row(weight,11393)]));assert.equal(result.closedOK,closed);assert.equal(result.openOK,open);assert.equal(result.momentOK,true);}
assert.equal(rules.assess(state([row(150,14393)])).momentOK,true);
assert.equal(rules.assess(state([row(150.001,14393)])).momentOK,false);
const mixed=state([row(100,12893),{...row(100,12893,'RAMP',2),kind:'bay'},row(100,12000,'BAY6_CENTRE',3)]);
assert.equal(rules.assess(mixed).weight,300);assert.equal(rules.assess(mixed).moment,360.7);
// Replacing an entry excludes its previous value; hidden layers do not change totals.
assert.equal(rules.assess(mixed,row(50,12893),1).weight,250);
mixed.floorLoads[1].installed=false;assert.equal(rules.assess(mixed).weight,200);
const equipment=state([]);equipment.mission.add('ME_SAR_MISSION_EQUIP_STOKES_LITTER_RAMP');
let result=rules.assess(equipment);assert.equal(result.weight,49);assert.ok(Math.abs(result.moment-85.211)<1e-8);
for(const key of ['ME_RAMP_SHELF_PORT_FWD','ME_RAMP_SHELF_PORT_AFT','ME_RAMP_SHELF_STBD_FWD','ME_RAMP_SHELF_STBD_AFT'])equipment.mission.add(key);
assert.equal(rules.assess(equipment).weight,49);
equipment.mission.delete('ME_SAR_MISSION_EQUIP_STOKES_LITTER_RAMP');equipment.mission.add('ME_SAR_MISSION_EQUIP_STOKES_LITTER_CABIN');assert.equal(rules.assess(equipment).weight,0);
assert.ok(rules.assess(state([row(1,14394)])).warnings.some(x=>x.includes('arms')));
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),{createPreviewServer}=require('../preview-server.cjs');
(async()=>{const server=createPreviewServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{browser=await chromium.launch(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{headless:true});
for(const [width,height]of [[1440,1000],[834,1194],[390,844]]){
 const page=await browser.newPage({viewport:{width,height},hasTouch:width<1000}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:'+server.address().port);await prepare(page);await page.locator('#controlHand').selectOption('left');
 await page.evaluate(()=>{state.floorLoads=[];state.mission.clear();CabinRampArea.open();});
 await page.locator('#rampCargoOptions').click();assert.match(await page.locator('#rampAreaPanel').innerText(),/Closed: 350 kg/);
 // Explicit Cargo starts position selection; the ramp remains a single region.
 await page.locator('#rampCargoAdd').click();assert.equal(await page.locator('#imageMenu').isVisible(),false);
 const box=await page.locator('#rampAreaTarget').boundingBox();if(width<1000)await page.touchscreen.tap(box.x+box.width*.75,box.y+box.height*.7);else await page.mouse.click(box.x+box.width*.75,box.y+box.height*.7);
 assert.ok(Math.abs(await page.evaluate(()=>CabinFloorArea.getSelection().estimatedArm)-13643)<=Math.ceil(3000/box.width),JSON.stringify({box,selection:await page.evaluate(()=>CabinFloorArea.getSelection())}));
 await page.locator('#areaLoadForm [name="weight"]').fill('160');assert.match(await page.locator('#areaRampStatus').innerText(),/Ramp hinge moment/);
 // Drag the small draft marker to a different longitudinal/lateral position.
 // Hide the floating editor while exercising the marker beneath it on a phone.
 if(width<650)await page.evaluate(()=>CabinImageMenu.suspend());const dragBox=await page.locator('#rampAreaTarget').boundingBox();const marker=await page.locator('#floorCargoPoint').boundingBox();if(width<1000){const cdp=await page.context().newCDPSession(page),x=dragBox.x+dragBox.width*.25,y=dragBox.y+dragBox.height*.3;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:marker.x+marker.width/2,y:marker.y+marker.height/2}]});for(let step=1;step<=5;step++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:marker.x+marker.width/2+(x-marker.x-marker.width/2)*step/5,y:marker.y+marker.height/2+(y-marker.y-marker.height/2)*step/5}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();}else{await page.mouse.move(marker.x+marker.width/2,marker.y+marker.height/2);await page.mouse.down();await page.mouse.move(dragBox.x+dragBox.width*.25,dragBox.y+dragBox.height*.3,{steps:5});await page.mouse.up();}
 if(width<650)await page.evaluate(()=>CabinImageMenu.resume());
 assert.ok(Math.abs(await page.evaluate(()=>CabinFloorArea.getSelection().estimatedArm)-12143)<=Math.ceil(3000/box.width),JSON.stringify({width,box,selection:await page.evaluate(()=>CabinFloorArea.getSelection())}));assert.equal(await page.locator('#areaLoadForm [name="weight"]').inputValue(),'160');
 await page.locator('#areaLoadForm [type="submit"]').click();assert.equal(await page.evaluate(()=>state.floorLoads[0].armSource),'floor-estimate');
 assert.ok(Math.abs(await page.evaluate(()=>state.floorLoads[0].arm)-12143)<=Math.ceil(3000/box.width));
 await page.evaluate(()=>{state.floorLoads=[];CabinCargo.openBay('RAMP');});await page.locator('#cargoEditForm [name="weight"]').fill('10');await page.locator('#cargoEditForm [type="submit"]').click();assert.equal(await page.evaluate(()=>state.floorLoads[0].arm),12893);
 await page.evaluate(()=>{state.floorLoads=[];CabinRampArea.open();});
 await page.locator('#rampCargoOptions').click();await page.locator('#rampCargoAdd').click();await page.keyboard.press('Escape');assert.equal(await page.locator('#rampAreaPanel').isVisible(),true);assert.equal(await page.evaluate(()=>state.floorLoads.length),0);
 const invalid=await page.evaluate(()=>[11392,14394].map(arm=>CabinCargo.add(state,{area:'RAMP',kind:'individual',weight:1,arm})));assert.ok(invalid.every(x=>!x.ok));assert.equal(await page.evaluate(()=>state.floorLoads.length),0);
 for(const arm of [11393,14393]){const accepted=await page.evaluate(arm=>{const r=CabinCargo.add(state,{area:'RAMP',kind:'individual',weight:1,arm});if(r.ok)CabinCargo.remove(state,r.entry.id);return r.ok;},arm);assert.equal(accepted,true);}
 const record=await page.evaluate(()=>CabinCargo.add(state,{area:'RAMP',kind:'individual',weight:300,arm:12893}));assert.equal(record.ok,true);
 const before=await page.evaluate(()=>JSON.stringify(state.floorLoads));assert.equal(await page.evaluate(id=>CabinCargo.update(state,id,{arm:15000}).ok,record.entry.id),false);assert.equal(await page.evaluate(()=>JSON.stringify(state.floorLoads)),before);
 await page.evaluate(id=>CabinCargo.open(id),record.entry.id);await page.locator('#cargoEditForm [name="weight"]').fill('301');assert.match(await page.locator('#cargoRampStatus').innerText(),/451.5 kg·m exceeds 450/);
 await page.locator('#cargoEditForm [type="submit"]').click();assert.equal(await page.evaluate(()=>state.floorLoads[0].weight),301);assert.match(await page.locator('[data-ramp-summary]').textContent(),/Ramp hinge moment/);
 await page.evaluate(()=>{CabinCargo.update(state,state.floorLoads[0].id,{weight:250});CabinStokes.install(state,'RAMP');renderSeats();CabinRampArea.open();});await page.locator('#rampCargoOptions').click();assert.match(await page.locator('#rampAreaPanel').innerText(),/299 kg total/);assert.match(await page.locator('#rampAreaPanel').innerText(),/460.21 kg·m exceeds 450/);if(width===1440)await page.locator('#imageMenu').screenshot({path:path.join(__dirname,'ramp-limits-preview.png')});
 await page.evaluate(()=>{CabinStokes.move(state,'ME_SAR_MISSION_EQUIP_STOKES_LITTER_RAMP','CABIN_DEPLOYED');renderSeats();CabinRampArea.open();});await page.locator('#rampCargoOptions').click();assert.match(await page.locator('#rampAreaPanel').innerText(),/250 kg total/);assert.doesNotMatch(await page.locator('#rampAreaPanel').innerText(),/exceeds/);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);assert.deepEqual(errors,[]);await page.close();
}
console.log('Ramp checks pass: source constants, arm bounds, closed/open weights, aggregate hinge moments, Stokes/shelf accounting, atomic invalid edits and responsive draft warnings.');
}finally{await browser?.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
