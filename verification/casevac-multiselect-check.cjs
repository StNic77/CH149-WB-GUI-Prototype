const assert=require('node:assert/strict'),path=require('node:path');
const browsers=require(process.env.PLAYWRIGHT_MODULE||'playwright'),{createPreviewServer}=require('../preview-server.cjs');
(async()=>{const server=createPreviewServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{const engine=process.env.PLAYWRIGHT_ENGINE||'chromium';browser=await browsers[engine].launch(engine==='chromium'?{channel:process.env.PLAYWRIGHT_CHANNEL||'msedge',headless:true}:{headless:true});
 for(const [width,height]of [[1440,1000],[744,1133],[1133,744],[390,844]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<1200}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(10000);await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>!!window.CabinActions);
  await page.evaluate(()=>{applyPreset('CASEVAC');CabinPlanning.setBaseline(state,{basis:'MAINTENANCE',basicWeight:10401,basicCG:8487,tail:'149920'});CabinEquipment.refresh();CabinCasevac.open('FWD_STBD');});
  const before=await page.evaluate(()=>({signature:CabinEquipment.signature(state),wb:CabinPlanning.evaluate(state).wb}));
  const select=id=>page.locator('[data-casevac-select="'+id+'"]');
  assert.equal(await page.locator('#casevacAddSelected').isDisabled(),true);
  await select('FWD_STBD_TOP').check();await select('FWD_STBD_MIDDLE').check();
  assert.equal(await page.locator('.casevac-selected').count(),2);assert.equal(await page.locator('#imageMenu').isVisible(),true);
  assert.equal(await page.evaluate(()=>CabinEquipment.signature(state)),before.signature);
  // Cross-rack navigation keeps the draft without adding any patient.
  await page.locator('[data-casevac-rack="AFT_PORT"]').click();assert.equal(await page.locator('[data-casevac-select]').count(),2);assert.equal(await select('AFT_PORT_TOP').count(),0);await select('AFT_PORT_BOTTOM').check();assert.match(await page.locator('#casevacSelectionCount').textContent(),/^3 positions/);
  await page.screenshot({path:path.join(__dirname,'casevac-multiselect-'+width+'.png')});
  await page.locator('#casevacAddSelected').click();await page.waitForFunction(()=>!CabinImageMenu.getState().open);
  const after=await page.evaluate(()=>{const result=CabinPlanning.evaluate(state),ids=Object.keys(state.patients),expected=ids.reduce((n,id)=>n+CH149_DATA.patientPositions[id].weight,0),moment=ids.reduce((n,id)=>n+CH149_DATA.patientPositions[id].weight*CH149_DATA.patientPositions[id].arm,0);return {ids,wb:result.wb,issues:result.issues,expected,moment};});assert.deepEqual(after.ids.sort(),['AFT_PORT_BOTTOM','FWD_STBD_MIDDLE','FWD_STBD_TOP']);assert.ok(Math.abs(after.wb.auwExact-before.wb.auwExact-after.expected)<1e-6);assert.ok(Math.abs(after.wb.opM-before.wb.opM-after.moment)<1e-6);assert.deepEqual(after.issues,[]);
  await page.evaluate(()=>CabinCasevac.open('FWD_STBD'));assert.equal(await select('FWD_STBD_TOP').isDisabled(),true);assert.equal(await select('FWD_STBD_MIDDLE').isDisabled(),true);assert.equal(await page.locator('#casevacToggle').isDisabled(),true);
  // Closing a draft leaves the aircraft untouched and clears the next draft.
  await select('FWD_STBD_BOTTOM').check();await page.locator('#imageMenuClose').click();await page.evaluate(()=>CabinCasevac.open('FWD_STBD'));assert.equal(await select('FWD_STBD_BOTTOM').isChecked(),false);assert.equal(await page.locator('#casevacAddSelected').isDisabled(),true);
  // Validate the complete batch before adding any patients.
  const rejected=await page.evaluate(()=>{const before=JSON.stringify(state.patients),r=CabinCasevac.addPatients(state,['FWD_STBD_BOTTOM','AFT_PORT_TOP']),duplicate=CabinCasevac.addPatients(state,['FWD_STBD_BOTTOM','FWD_STBD_BOTTOM']);return {ok:r.ok,duplicate:duplicate.ok,unchanged:before===JSON.stringify(state.patients)};});assert.deepEqual(rejected,{ok:false,duplicate:false,unchanged:true});
  await page.evaluate(()=>{state.roleFit.delete(CabinCasevac.key('AFT_STBD'));CabinCasevac.open('AFT_STBD');});for(const input of await page.locator('[data-casevac-select]').all())assert.equal(await input.isDisabled(),true);
  await page.evaluate(()=>{CabinCasevac.open('FWD_STBD');});await select('FWD_STBD_BOTTOM').check();await page.evaluate(()=>{state.roleFit.delete(CabinCasevac.key('FWD_STBD'));});await page.locator('#casevacAddSelected').click();assert.equal(await page.locator('#imageMenu').isVisible(),true);assert.equal(await page.evaluate(()=>!!state.patients.FWD_STBD_BOTTOM),false);assert.match(await page.locator('#casevacPanel').textContent(),/occupied or unavailable/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);assert.deepEqual(errors,[]);await page.close();console.log(engine+': CASEVAC draft, cross-rack batch, weights/moments, cancel, occupied/unavailable and stale-state checks passed '+width+' × '+height);
 }
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
