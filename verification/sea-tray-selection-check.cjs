const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {createPreviewServer}=require('../preview-server.cjs');
(async()=>{
 const server=createPreviewServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'msedge',headless:true});
  for(const [width,height,touch]of [[1440,1000,false],[744,1133,true],[1133,744,true],[390,844,true]]){
   const page=await browser.newPage({viewport:{width,height},hasTouch:touch,reducedMotion:'reduce'}),errors=[];
   page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(10000);
   await page.goto('http://127.0.0.1:'+server.address().port);await require('./enter-workspace.cjs')(page);
   const snapshot=()=>page.evaluate(()=>({fit:[...state.roleFit].sort(),mission:[...state.mission].sort(),seats:[...state.seats].sort(),occupants:state.occupants,patients:state.patients,loads:state.floorLoads,wb:CabinPlanning.evaluate(state)}));
   async function cellClick(id){
    await page.evaluate(()=>CabinImageMenu.close());await page.locator('#planViewport').scrollIntoViewIfNeeded();
    const point=await page.evaluate(id=>{const cell=document.querySelector('[data-floor-space="'+id+'"]'),r=cell.getBoundingClientRect();for(const fy of [.5,.25,.75,.1,.9])for(const fx of [.5,.25,.75,.1,.9]){const x=r.left+r.width*fx,y=r.top+r.height*fy;if(x<0||y<0||x>=innerWidth||y>=innerHeight)continue;if(document.elementFromPoint(x,y)?.closest('[data-floor-space]')===cell)return {x,y};}return null;},id);
    assert.ok(point,'An exposed part of '+id+' must be selectable');
    if(touch)await page.touchscreen.tap(point.x,point.y);else await page.mouse.click(point.x,point.y);
   }
   for(const role of ['SAR3','SAR10']){
    await page.evaluate(role=>{applyPreset(role);CabinPlanning.setBaseline(state,{basis:'MAINTENANCE',basicWeight:10401,basicCG:8487,tail:'149920'});liveCabinToggle.checked=true;liveCabinToggle.dispatchEvent(new Event('change'));},role);
    const before=await snapshot(),cells=await page.evaluate(()=>CabinFloorEquipment.trayAreas);
    assert.deepEqual(cells,['BAY3_CENTRE','BAY3_STBD','BAY4_CENTRE','BAY4_STBD','BAY5_CENTRE']);
    for(const boundaries of [false,true]){
     await page.evaluate(on=>{bayToggle.checked=on;bayToggle.dispatchEvent(new Event('change'));},boundaries);
     assert.equal(await page.locator('[data-live-object=sea-tray]').evaluate(n=>getComputedStyle(n).pointerEvents),'none');
     for(const id of cells){
      await cellClick(id);assert.equal(await page.evaluate(()=>CabinImageMenu.getState().current),'floorEquipmentPanel');
      assert.equal(await page.evaluate(()=>CabinImageMenu.getState().area),id);assert.match(await page.locator('#floorEquipmentPanel').textContent(),/Sea Tray/);
      assert.deepEqual(await snapshot(),before);
      await page.locator('#floorEquipmentArea').click();assert.equal(await page.evaluate(()=>CabinImageMenu.getState().current),'floorAreaPanel');assert.equal(await page.evaluate(()=>CabinFloorArea.getSelection().space),id);
     }
    }
    // Keyboard selection and explicit cargo placement share cells without stealing each other's flow.
    await page.evaluate(()=>CabinImageMenu.close());await page.locator('[data-floor-space=BAY3_STBD]').focus();await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(()=>CabinImageMenu.getState().area),'BAY3_STBD');
    await page.locator('#floorEquipmentArea').click();await page.locator('.cascade-choice').filter({hasText:/Cargo/}).click();
    if(await page.locator('#areaIndividualCargo').isVisible())await page.locator('#areaIndividualCargo').click();await cellClick('BAY4_STBD');
    assert.equal(await page.evaluate(()=>CabinFloorArea.getSelection().cargoPointChosen),true);assert.equal(await page.evaluate(()=>CabinImageMenu.getState().current),'floorAreaPanel');
    await page.keyboard.press('Escape');assert.deepEqual(await snapshot(),before);
    await page.evaluate(()=>{CabinImageMenu.close();state.roleFit.delete(CabinFloorEquipment.trayKey);liveCabinToggle.checked=false;liveCabinToggle.dispatchEvent(new Event('change'));CabinEquipment.refresh();});
    const removed=await snapshot();assert.equal(await page.locator('#referenceFitMarker').isVisible(),true);
    const anchor=()=>page.evaluate(()=>{const n=referenceFitMarker.getBoundingClientRect(),s=planSheet.getBoundingClientRect();return {x:(n.x+n.width/2-s.x)/s.width,y:(n.y+n.height/2-s.y)/s.height,parent:referenceFitMarker.parentElement.id};});
    const start=await anchor();assert.equal(start.parent,'planSheet');
    const expected=await page.evaluate(()=>{const r=CH149_PLAN_REGISTRATION,a=r.assets[state.preset],[x,y,w,h]=CH149_LIVE_VISUALS[state.preset].seaTray;return {x:(a.x+(x+w*.44)*a.scale)/r.width,y:(a.y+(y+h*.16)*a.scale)/r.height};});
    assert.ok(Math.abs(start.x-expected.x)<.002&&Math.abs(start.y-expected.y)<.002);
    await page.evaluate(()=>CabinPlanViewer.setTransform(1.4,-.15,-.03));const zoomed=await anchor();assert.ok(Math.abs(start.x-zoomed.x)<.002&&Math.abs(start.y-zoomed.y)<.002);assert.deepEqual(await snapshot(),removed);
    await page.evaluate(()=>CabinPlanViewer.fit());await page.locator('#referenceFitMarker').click();await page.locator('#roleToggle').click();
    assert.equal(await page.locator('#referenceFitMarker').isVisible(),false);assert.deepEqual(await snapshot(),before);
    await page.evaluate(()=>CabinImageMenu.close());
    if(role==='SAR3'&&width===1440){await page.evaluate(()=>{state.roleFit.delete(CabinFloorEquipment.trayKey);CabinEquipment.refresh();});await page.locator('#planViewport').screenshot({path:'verification/sea-tray-removed-label.png'});}
   }
   // Equipment sitting above the tray retains direct selection priority.
   await page.evaluate(()=>{applyPreset('SAR3');liveCabinToggle.checked=true;liveCabinToggle.dispatchEvent(new Event('change'));state.mission.delete('ME_SAR_MISSION_EQUIP_STOKES_LITTER_RAMP');state.mission.add('ME_SAR_MISSION_EQUIP_STOKES_LITTER_CABIN');CabinEquipment.refresh();});
   await page.locator('[data-live-object=stokes]').click();assert.equal(await page.evaluate(()=>CabinImageMenu.getState().current),'stokesPanel');
   assert.deepEqual(errors,[]);await page.close();console.log('Sea Tray five-cell selection, area/cargo access, reference anchoring and unchanged W&B passed '+width+'x'+height);
  }
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
