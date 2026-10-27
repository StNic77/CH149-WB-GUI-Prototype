const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),{createPreviewServer}=require('../preview-server.cjs');
(async()=>{const server=createPreviewServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'msedge',headless:true});
for(const [width,height]of [[1440,1000],[744,1133],[1133,744]]){
 const page=await browser.newPage({viewport:{width,height},hasTouch:true,reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(10000);
 await page.goto('http://127.0.0.1:'+server.address().port);await require('./enter-workspace.cjs')(page);
 await page.evaluate(()=>{applyPreset('SAR3');CabinPlanning.setBaseline(state,{basis:'MAINTENANCE',basicWeight:10401,basicCG:8487,tail:'149920'});state.planning={...state.planning,fuel:1500,reserve:300};CabinEquipment.refresh();const t=document.getElementById('cgLayerToggle');t.checked=true;t.dispatchEvent(new Event('change'));});
 const before=await page.evaluate(()=>CabinEquipment.signature(state));
 await page.locator('#cgFullEnvelopeDetails>summary').click();assert.ok(await page.locator('[data-burn-path=auto]').count());
 assert.equal(await page.locator('[data-burn-path]').getAttribute('marker-mid'),null);assert.equal(await page.locator('[data-burn-path]').getAttribute('marker-end'),null);assert.equal(await page.locator('[data-burn-path]').evaluate(n=>getComputedStyle(n).strokeDasharray),'none');
 const trace=await page.evaluate(()=>{const r=CabinCGEnvelope.flight(state);return {first:r.burnTrack[0],last:r.burnTrack.at(-1),takeoff:r.takeoff,landing:r.landing};});
 assert.ok(Math.abs(trace.first.cg-trace.takeoff.cg)<=.5);assert.ok(Math.abs(trace.last.w-trace.landing.weight)<=.5);assert.equal(trace.last.fuel,300);
 assert.equal(await page.locator('[data-cg-track=landing][data-muted=true] [data-cg-marker=landing]').count(),1);assert.equal(await page.locator('.cg-cabin-label-card').count(),1);
 await page.locator('[data-cg-condition=both]').click();assert.equal(await page.locator('[data-condition-range]').count(),2);assert.equal(await page.locator('.cg-cabin-label-card').count(),2);
 const bands=await page.locator('[data-condition-range]').evaluateAll(nodes=>nodes.map(n=>({y:Number(n.getAttribute('y')),h:Number(n.getAttribute('height')),kind:n.dataset.conditionRange})));assert.ok(Math.abs(bands[0].y+bands[0].h-bands[1].y)<.01);
 if(width===1440)await page.locator('#cgLayerSummary').screenshot({path:'verification/oct27-cg-auto-both.png'});
 await page.locator('[data-cg-condition=landing]').click();assert.equal(await page.locator('[data-condition-range=takeoff]').count(),0);assert.equal(await page.locator('[data-full-point=takeoff]').getAttribute('data-muted'),'true');
 assert.equal(await page.evaluate(()=>CabinEquipment.signature(state)),before);
 await page.evaluate(()=>{state.planning={...state.planning,fuelMode:'manual',tanks:{T1:500,T2:400,T3:300,T4:0,T5:0}};CabinEquipment.refresh();});assert.equal(await page.locator('[data-burn-path]').count(),0);assert.match(await page.locator('#cgFullEnvelopeDetails').textContent(),/unavailable with manual/);
 await page.evaluate(()=>{const t=document.getElementById('cgLayerToggle');t.checked=false;t.dispatchEvent(new Event('change'));applyPreset('SAR3');CabinEquipment.refresh();});
 // Removed SWS remains available directly from both image modes, with the same load restored.
 const weight=await page.evaluate(()=>CabinPlanning.evaluate(state).wb.auwExact);
 await page.locator('[data-live-object=sensor-workstation]').click();await page.locator('#roleToggle').click();await page.evaluate(()=>CabinImageMenu.close());
 await page.locator('[data-live-object=sensor-access]').click();await page.locator('#roleToggle').click();assert.ok(Math.abs(await page.evaluate(()=>CabinPlanning.evaluate(state).wb.auwExact)-weight)<1e-6);
 await page.evaluate(()=>{CabinImageMenu.close();state.roleFit.delete('RF_SENSOR_SYSTEMS_SENSOR_WORKSTATION');liveCabinToggle.checked=false;liveCabinToggle.dispatchEvent(new Event('change'));});
 await page.locator('[data-reference-item=sensor-access]').click();await page.locator('#roleToggle').click();assert.equal(await page.locator('[data-reference-item=sensor-workstation]').count(),1);
 // A single shared control replaces colliding absent alternatives; installed options exclude their counterpart.
 await page.evaluate(()=>{CabinImageMenu.close();liveCabinToggle.checked=true;liveCabinToggle.dispatchEvent(new Event('change'));seatToggle.checked=true;for(const id of ['C5','C6','P7','P8','P13','P14']){delete state.occupants[id];state.seats.delete(id);}CabinEquipment.refresh();});
 assert.equal(await page.locator('[data-seat-choice]').count(),2);for(const id of ['C5','C6','P7','P8','P13','P14'])assert.equal(await page.locator('[data-seat-marker='+id+']').count(),0);
 await page.locator('[data-seat-choice=BAY5_STBD_SEATING]').click();await page.locator('#seatMenu [data-seat=P7]').click();await page.locator('#toggleSeat').click();assert.equal(await page.evaluate(()=>state.seats.has('P7')),true);
 assert.equal(await page.locator('#crewSeatList [data-seat=C6]').isDisabled(),true);assert.equal(await page.locator('[data-seat-marker=C6]').count(),0);
 await page.evaluate(()=>{state.seats.add('P8');CabinImageMenu.close();CabinEquipment.refresh();});
 const row=await page.evaluate(()=>['P7','P8'].map(id=>{const n=document.querySelector('[data-live-object=seat-'+id+']');return {y:parseFloat(n.style.top),w:parseFloat(n.style.width),h:parseFloat(n.style.height)};}));assert.deepEqual(row[0],row[1]);
 for(const role of ['TRANSPORT','CASEVAC','SAR10']){await page.evaluate(role=>{applyPreset(role);state.seats.delete('C6');delete state.occupants.C6;state.seats.add('P7');state.seats.add('P8');CabinEquipment.refresh();},role);const seats=await page.evaluate(()=>['P7','P8'].map(id=>{const n=document.querySelector('[data-live-object=seat-'+id+']');return {y:n.style.top,w:n.style.width,h:n.style.height};}));assert.deepEqual(seats[0],seats[1]);}
 await page.evaluate(()=>applyPreset('SAR3'));
 for(const [crew,pair]of [['C5',['P13','P14']],['C6',['P7','P8']]]){await page.evaluate(([c,ps])=>{ps.forEach(p=>state.seats.delete(p));state.seats.add(c);CabinEquipment.refresh();},[crew,pair]);for(const p of pair){assert.equal(await page.locator('#seatList [data-seat='+p+']').isDisabled(),true);assert.equal(await page.locator('[data-seat-marker='+p+']').count(),0);}await page.evaluate(([c,ps])=>{state.seats.delete(c);ps.forEach(p=>state.seats.add(p));CabinEquipment.refresh();},[crew,pair]);assert.equal(await page.locator('#crewSeatList [data-seat='+crew+']').isDisabled(),true);}
 // Cells stay in front of boundaries while seats retain their own upper layer.
 await page.evaluate(()=>{bayToggle.checked=true;bayToggle.dispatchEvent(new Event('change'));});assert.ok(await page.evaluate(()=>Number(getComputedStyle(document.querySelector('.floor-area-layer')).zIndex)>Number(getComputedStyle(bayLayer).zIndex)));
 await page.locator('#planViewport').scrollIntoViewIfNeeded();const cell=page.locator('.floor-space-cell[data-floor-space=BAY2_CENTRE]');
 if(await cell.count()){await cell.tap();assert.equal(await page.locator('#imageMenu').isVisible(),true);}
 // Symbol anchors follow the actual pictured stretcher and rack in Port Aft.
 await page.evaluate(()=>{CabinImageMenu.close();applyPreset('SAR3');setView('pta');});await page.waitForFunction(()=>cabinImage.complete&&cabinImage.naturalWidth>0);
 assert.equal(await page.locator('[data-equipment-marker="item:RF_SAR_EQUIPMENT_DIVE_O2_BOTTLE_RACK"]').count(),1);
 const marker=page.locator('[data-equipment-marker]').filter({has:page.locator('svg')});assert.ok(await marker.count()>0);
 await page.locator('[data-equipment-marker="item:RF_SAR_EQUIPMENT_DIVE_O2_BOTTLE_RACK"]').tap();assert.match(await page.locator('#equipmentPanel').textContent(),/Dive Bottle/);await page.locator('#roleToggle').click();assert.equal(await page.locator('[data-equipment-marker="item:RF_SAR_EQUIPMENT_DIVE_O2_BOTTLE_RACK"]').count(),0);
 await page.evaluate(()=>{CabinImageMenu.close();setView('ramp');});await page.waitForFunction(()=>cabinImage.complete&&cabinImage.naturalWidth>0);await page.locator('#planViewport').scrollIntoViewIfNeeded();
 await page.waitForTimeout(150);await page.evaluate(()=>{window.shelfEvents=[];for(const t of ['pointerdown','click'])planViewport.addEventListener(t,e=>shelfEvents.push({type:t,x:e.clientX,y:e.clientY,target:e.target.id,selected:state.selectedLoc}),true);});const nearShelf=await page.evaluate(()=>{const svg=document.getElementById('rampShelfZones'),p=CH149_RAMP_SHELF_REGIONS.regions.RAMP_PORT_AFT.points;const a=p[0],b=p.at(-1),point=new DOMPoint((a[0]+b[0])/2*2880,(a[1]+b[1])/2*1620).matrixTransform(svg.getScreenCTM());return {x:point.x,y:point.y-10,target:document.elementFromPoint(point.x,point.y-10)?.outerHTML.slice(0,300)};});await page.touchscreen.tap(nearShelf.x,nearShelf.y);assert.equal(await page.locator('#imageMenu').isVisible(),true,JSON.stringify({nearShelf,events:await page.evaluate(()=>shelfEvents),hidden:await page.locator('#rampShelfZones').getAttribute('hidden')}));
 // Simulate portrait/landscape keyboard viewports, checking clipping against both body and viewport.
 await page.evaluate(()=>{CabinImageMenu.close();CabinFuelUI.open();});await page.locator('#fuelCompactForm [name=reserve]').fill('475');
 for(const visibleHeight of [330,220]){await page.locator('#fuelCompactForm [name=reserve]').focus();await page.evaluate(h=>{Object.defineProperties(visualViewport,{height:{configurable:true,value:h},offsetTop:{configurable:true,value:70}});visualViewport.dispatchEvent(new Event('resize'));},visibleHeight);await page.waitForTimeout(120);
  const bounds=await page.locator('#fuelCompactForm [name=reserve]').evaluate(n=>{const r=n.getBoundingClientRect(),b=imageMenuBody.getBoundingClientRect();return {top:r.top,bottom:r.bottom,bodyTop:b.top,bodyBottom:b.bottom};});assert.ok(bounds.top>=Math.max(70,bounds.bodyTop)&&bounds.bottom<=Math.min(70+visibleHeight,bounds.bodyBottom),JSON.stringify(bounds));assert.equal(await page.locator('#fuelCompactForm [name=reserve]').inputValue(),'475');
 }
 await page.evaluate(()=>{delete visualViewport.height;delete visualViewport.offsetTop;visualViewport.dispatchEvent(new Event('resize'));CabinImageMenu.close();});
 if(width===1440){await page.evaluate(()=>{setView('plan');const t=document.getElementById('cgLayerToggle');t.checked=true;t.dispatchEvent(new Event('change'));});await page.locator('[data-cg-condition=both]').click();await page.locator('#cgLayerSummary').screenshot({path:'verification/oct27-cg-both.png'});}
 assert.deepEqual(errors,[]);await page.close();console.log('Oct 27 CG, seats, image access, symbols, touch targets and full input visibility passed '+width+' × '+height);
}
}finally{await browser?.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
