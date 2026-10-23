const assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),{createPreviewServer}=require('../preview-server.cjs');
(async()=>{const server=createPreviewServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'msedge',headless:true});
for(const [width,height]of [[1440,1000],[834,1194],[390,844]]){const page=await browser.newPage({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:'+server.address().port);
 await page.evaluate(()=>{state.floorLoads=[];state.mission.clear();});
 // Removing every load never consumes a user-visible cargo slot.
 for(let i=0;i<8;i++){const slot=await page.evaluate(()=>{const r=CabinCargo.add(state,{area:'BAY3_CENTRE',kind:'individual',weight:10,arm:7375});renderSeats();const label=CabinCargo.label(r.entry);CabinCargo.remove(state,r.entry.id);return label;});assert.equal(slot,'Cargo 1');}
 const initial=await page.evaluate(()=>{const bay=CabinCargo.add(state,{area:'BAY1_PORT',kind:'bay',weight:1}).entry;const cargo=Array.from({length:4},()=>CabinCargo.add(state,{area:'BAY3_CENTRE',kind:'individual',weight:10,arm:7375}).entry);renderSeats();return {bay,cargo};});
 assert.deepEqual(initial.cargo.map(x=>x.slot),[1,2,3,4]);assert.equal(initial.bay.slot,undefined);
 assert.equal(await page.locator(`[data-cargo-id="${initial.bay.id}"] span`).textContent(),'B1');
 const reused=await page.evaluate(id=>{CabinCargo.remove(state,id);const r=CabinCargo.add(state,{area:'BAY4_PORT',kind:'individual',weight:12,arm:8375});renderSeats();return r.entry;},initial.cargo[1].id);assert.equal(reused.slot,2);assert.ok(reused.id>initial.cargo[3].id);
 assert.deepEqual(await page.evaluate(()=>state.floorLoads.filter(x=>x.kind==='individual').map(x=>x.slot)),[1,3,4,2]);
 assert.equal(await page.evaluate(()=>CabinCargo.add(state,{area:'RAMP',kind:'individual',weight:1,arm:12893}).ok),false);
 await page.evaluate(()=>{for(const row of [...state.floorLoads])if(row.kind==='individual')CabinCargo.remove(state,row.id);CabinCargo.add(state,{area:'BAY3_CENTRE',kind:'individual',weight:10,arm:7375});renderSeats();});
 assert.deepEqual(await page.evaluate(()=>state.floorLoads.filter(x=>x.kind==='individual').map(x=>x.slot)),[1]);
 assert.equal(await page.locator('.cargo-symbol[data-cargo-kind=individual]').getAttribute('data-limit-status'),'unreviewed');
 // Every ramp entry reflects the aggregate, including other cargo and bay weight.
 const ramp=await page.evaluate(()=>{state.floorLoads=[];const cargo=[150,150].map(weight=>CabinCargo.add(state,{area:'RAMP',kind:'individual',weight,arm:12893}).entry);renderSeats();return cargo;});
 assert.equal(await page.locator('.cargo-symbol[data-limit-status=ok]').count(),2);
 const bay=await page.evaluate(()=>{const r=CabinCargo.add(state,{area:'RAMP',kind:'bay',weight:1});renderSeats();return r.entry;});
 assert.equal(await page.locator('.cargo-symbol[data-limit-status=caution]').count(),3);assert.match(await page.locator(`[data-cargo-id="${ramp[0].id}"]`).getAttribute('aria-label'),/Hinge moment proxy/);
 await page.locator(`[data-cargo-id="${ramp[0].id}"]`).click();assert.match(await page.locator('#cargoLimitAlert').innerText(),/451.5 kg·m exceeds 450/);
 const alert=await page.locator('#cargoLimitAlert').boundingBox(),menu=await page.locator('#imageMenuBody').boundingBox();assert.ok(alert.y>=menu.y&&alert.y+alert.height<=menu.y+menu.height+1,'Limit caution should be visible without scrolling');
 await page.evaluate(()=>CabinImageMenu.close());await page.locator('[data-summary-id="planning"]>summary').click();
 assert.equal(await page.locator('[data-load-remove]').count(),3);assert.match(await page.locator(`[data-load-open="${bay.id}"]`).innerText(),/Ramp weight/);
 await page.locator(`[data-load-remove="${bay.id}"]`).click();assert.equal(await page.locator('.cargo-symbol[data-limit-status=ok]').count(),2);assert.equal(await page.locator('[data-load-remove]').count(),2);
 // Stowed litter changes marker status; deploying it clears that contribution.
 await page.evaluate(()=>{CabinStokes.install(state,'RAMP');renderSeats();});assert.equal(await page.locator('.cargo-symbol[data-limit-status=caution]').count(),2);
 await page.evaluate(()=>{CabinStokes.move(state,'ME_SAR_MISSION_EQUIP_STOKES_LITTER_RAMP','CABIN_DEPLOYED');renderSeats();});assert.equal(await page.locator('.cargo-symbol[data-limit-status=ok]').count(),2);
 await page.locator(`[data-load-remove="${ramp[0].id}"]`).click();const last=await page.evaluate(()=>{const row=CabinCargo.add(state,{area:'RAMP',kind:'individual',weight:10,arm:12893}).entry;renderSeats();return row;});assert.equal(last.slot,1);assert.equal(await page.locator(`[data-cargo-id="${last.id}"] span`).textContent(),'1');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);assert.deepEqual(errors,[]);
 if(width===1440)await page.locator('#aircraftSummary').screenshot({path:path.join(__dirname,'cargo-slots-sidebar.png')});await page.close();
}
console.log('Cargo slots 1–4 reuse correctly; bay labels are independent; aggregate status colours, visible cautions and sidebar removal pass at desktop/tablet/phone sizes.');
}finally{await browser?.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
