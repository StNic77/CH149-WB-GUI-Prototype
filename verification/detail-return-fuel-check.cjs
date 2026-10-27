const assert=require('node:assert/strict');
const browsers=require(process.env.PLAYWRIGHT_MODULE||'playwright'),{createPreviewServer}=require('../preview-server.cjs');
(async()=>{const server=createPreviewServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;const engine=process.env.PLAYWRIGHT_ENGINE||'chromium';
try{browser=await browsers[engine].launch(engine==='chromium'?{channel:process.env.PLAYWRIGHT_CHANNEL||'msedge',headless:true}:{headless:true});
for(const [width,height]of [[390,844],[844,390],[744,1133],[1133,744],[1440,1000]]){
const page=await browser.newPage({viewport:{width,height}}),errors=[];page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:'+server.address().port);await require('./enter-workspace.cjs')(page);await page.waitForFunction(()=>!!window.CabinViewControls);
assert.equal(await page.locator('#detailReturn2D').isVisible(),false);
// Enter book fuel before choosing the first Role, through the actual fuel panel.
await page.evaluate(()=>CabinFuelUI.open());await page.locator('#fuelCompactForm [name="total"]').fill('258');await page.locator('#fuelCompactForm [type="submit"]').click();assert.equal(await page.evaluate(()=>state.planning.fuel),258);
async function role(name){if(await page.locator('#roleControl').getAttribute('aria-expanded')!=='true')await page.locator('#roleControl').click();await page.locator('[data-preset="'+name+'"]').click();if(await page.locator('#roleResetDialog').isVisible())await page.locator('#confirmRoleReset').click();assert.equal(await page.evaluate(()=>state.preset),name);}
await role('SAR3');assert.equal(await page.evaluate(()=>state.planning.fuel),258);
await page.evaluate(()=>{state.planning={...state.planning,fuel:1000,fuelMode:'manual',tanks:{T1:500,T2:250,T3:250,T4:0,T5:0},reserve:400};CabinCargo.add(state,{area:'RAMP',kind:'bay',weight:25});});const fuel=await page.evaluate(()=>{const p=state.planning;return {fuel:p.fuel,fuelMode:p.fuelMode,tanks:p.tanks,reserve:p.reserve};});
await role('TRANSPORT');assert.deepEqual(await page.evaluate(()=>{const p=state.planning;return {fuel:p.fuel,fuelMode:p.fuelMode,tanks:p.tanks,reserve:p.reserve};}),fuel);assert.equal(await page.evaluate(()=>state.floorLoads.length),0);
// Every detail exposes a stationary top-right escape, even with side controls hidden.
await page.locator('#sideControlsToggle').click();for(const view of ['cabinet','forward','pta','ramp','stbd']){await page.evaluate(view=>setView(view),view);await page.locator('.photo-wrap').scrollIntoViewIfNeeded();await page.waitForFunction(()=>cabinImage.complete&&cabinImage.naturalWidth>0);assert.equal(await page.locator('#detailReturn2D').isVisible(),true);const geometry=await page.evaluate(()=>{const p=document.querySelector('.photo-wrap').getBoundingClientRect(),b=document.getElementById('detailReturn2D').getBoundingClientRect();return {p:p.toJSON(),b:b.toJSON()};});assert.ok(Math.abs(geometry.p.right-geometry.b.right-8)<2);assert.ok(Math.abs(geometry.b.top-geometry.p.top-8)<2);await page.locator('#detailReturn2D').click();assert.equal(await page.evaluate(()=>state.view),'plan');assert.equal(await page.locator('#detailReturn2D').isVisible(),false);}
assert.deepEqual(errors,[]);await page.close();console.log(engine+': detail return and retained Role fuel passed '+width+' × '+height);
}
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
