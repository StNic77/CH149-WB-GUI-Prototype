const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),{createPreviewServer}=require('../preview-server.cjs');
(async()=>{const server=createPreviewServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{
 browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'msedge',headless:true});
 const matrix={SAR3:['cabinet','forward','pta','stbd','ramp'],SAR10:['cabinet','forward','ramp'],TRANSPORT:['forward','ramp'],CASEVAC:['forward','ramp']};
 for(const [width,height,touch]of [[1440,1000,false],[744,1133,true],[1133,744,true],[390,844,true]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:touch,reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(10000);
  await page.goto('http://127.0.0.1:'+server.address().port);await require('./enter-workspace.cjs')(page);
  const snapshot=()=>page.evaluate(()=>({fit:[...state.roleFit].sort(),mission:[...state.mission].sort(),seats:[...state.seats].sort(),occupants:state.occupants,patients:state.patients,loads:state.floorLoads,planning:state.planning,wb:CabinPlanning.evaluate(state)}));
  for(const [role,allowed]of Object.entries(matrix)){
   await page.evaluate(role=>{applyPreset(role);CabinPlanning.setBaseline(state,{basis:'MAINTENANCE',basicWeight:10401,basicCG:8487,tail:'149920'});state.planning.fuel=500;CabinEquipment.refresh();},role);
   const before=await snapshot();await page.locator('#viewControl').click();
   for(const view of ['cabinet','forward','pta','stbd','ramp']){
    assert.equal(await page.locator('[data-viewtab='+view+']').isDisabled(),!allowed.includes(view),role+' '+view);
    assert.equal(await page.locator('#viewPicker option[value='+view+']').evaluate(n=>n.disabled),!allowed.includes(view),role+' '+view+' picker');
   }
   if(role!=='SAR3'){assert.equal(await page.locator('#detailImageHelp').isVisible(),true);assert.match(await page.locator('#detailImageHelp').textContent(),/W&B controls remain available/);}
   await page.locator('#viewControl').click();
   for(const id of ['portAft','stbdAft'])assert.equal(await page.locator('[data-shelf-access='+id+']').isDisabled(),role!=='SAR3');
   // Direct navigation, restored sessions and equipment links cannot load misleading images.
   for(const view of ['cabinet','forward','pta','stbd','ramp']){
    await page.evaluate(view=>setView(view),view);
    if(allowed.includes(view)){
     await page.waitForFunction(()=>cabinImage.complete&&cabinImage.naturalWidth>0);assert.equal(await page.locator('#cabinImage').isVisible(),true);assert.equal(await page.locator('#planUnavailable').isVisible(),false);
     const source=await page.locator('#cabinImage').getAttribute('src');assert.ok(source&&!source.includes('SAR10_reference'));
    }else{
     assert.equal(await page.locator('#cabinImage').getAttribute('src'),null);assert.equal(await page.locator('#planViewport').isVisible(),false);assert.equal(await page.locator('#planUnavailable').isVisible(),true);
     assert.match(await page.locator('#planUnavailable').textContent(),/Equipment, contents and W&B controls remain available/);
    }
    assert.deepEqual(await snapshot(),before);
   }
   // Shared location editors still work with no aft reference image.
   await page.evaluate(()=>{setView('pta');CabinEquipmentUI.openLocation('OVERHEAD_PORT');});
   assert.equal(await page.locator('#equipmentPanel').isVisible(),true);assert.match(await page.locator('#equipmentPanel').textContent(),/Overhead/i);assert.deepEqual(await snapshot(),before);
   await page.evaluate(()=>{CabinImageMenu.close();setView('plan');CabinPTA.open();});
   assert.equal(await page.locator('#ptaPanel').isVisible(),true);assert.equal(await page.locator('#ptaCloseup').isDisabled(),role!=='SAR3');
   if(role!=='SAR3')assert.equal(await page.locator('#ptaCloseupImageHelp').isVisible(),true);
   if(await page.evaluate(()=>state.mission.has('ME_SAR_MISSION_EQUIP_RESCUE_BASKET_STBD'))){await page.evaluate(()=>{CabinImageMenu.close();CabinBasket.open('STBD');});assert.equal(await page.locator('#basketAftView').isDisabled(),role!=='SAR3');}
   await page.evaluate(()=>{CabinImageMenu.close();setView('ramp');});assert.equal(await page.locator('#cabinImage').getAttribute('src'),'images/Rear Shelves.png');assert.deepEqual(await snapshot(),before);
   if(role==='SAR10'&&width===1440){await page.evaluate(()=>setView('plan'));await page.locator('#viewControl').click();await page.locator('#compactViewControls').screenshot({path:'verification/detail-image-disabled-views.png'});await page.locator('#viewControl').click();}
  }
  // Re-enabling SAR-3 restores shortcuts and their helpful original titles.
  await page.evaluate(()=>applyPreset('SAR3'));assert.equal(await page.locator('[data-shelf-access=portAft]').isDisabled(),false);assert.equal(await page.locator('[data-shelf-access=portAft]').getAttribute('title'),'Open Port Aft View');
  assert.deepEqual(errors,[]);await page.close();console.log('Detail image matrix, guarded navigation and retained loading/W&B passed '+width+'x'+height);
 }
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
