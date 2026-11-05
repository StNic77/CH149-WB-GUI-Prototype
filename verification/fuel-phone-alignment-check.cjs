const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {createPreviewServer}=require('../preview-server.cjs');
(async()=>{const server=createPreviewServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'msedge',headless:true});
for(const [width,height] of [[390,844],[844,390]]){
 const page=await browser.newPage({viewport:{width,height},hasTouch:true});
 await page.goto('http://127.0.0.1:'+server.address().port);await require('./enter-workspace.cjs')(page);
 await page.evaluate(()=>{applyPreset('SAR3');state.planning={...(state.planning||{}),fuel:2000};CabinEquipment.refresh();});
 await page.locator('#fuelLayerToggle').check();
 const geometry=await page.evaluate(()=>{
  const v=document.querySelector('#planViewport').getBoundingClientRect(),items=[...document.querySelectorAll('.fuel-bay-label')].map(n=>{const r=n.getBoundingClientRect();return {id:n.dataset.fuelBayLabel,left:r.left-v.left,right:r.right-v.left,width:r.width};}),cells=[...document.querySelectorAll('.fuel-strip-cell')].map(n=>{const r=n.getBoundingClientRect();return {bay:n.dataset.fuelBay,left:r.left-v.left,right:r.right-v.left,width:r.width};});
  const layer=document.querySelector('#fuelQuantityLayer').getBoundingClientRect();return {viewport:{width:v.width,height:v.height},layer:{left:layer.left-v.left,right:layer.right-v.left,width:layer.width},sheet:(()=>{const r=document.querySelector('#planSheet').getBoundingClientRect();return {left:r.left-v.left,width:r.width};})(),items,cells};
 });
 assert.equal(geometry.cells.length,5,JSON.stringify(geometry));
 assert.ok(Math.abs(geometry.layer.left-geometry.items[0].left)<1&&Math.abs(geometry.layer.right-geometry.items.at(-1).right)<1,JSON.stringify(geometry));
 for(const cell of geometry.cells){const bay=geometry.items.find(x=>x.id===cell.bay);assert.ok(bay,JSON.stringify({cell,geometry}));assert.ok(Math.abs(cell.left-bay.left)<1&&Math.abs(cell.right-bay.right)<1,JSON.stringify({cell,bay,geometry}));}
 await page.screenshot({path:`verification/fuel-phone-alignment-${width}x${height}.png`});
 console.log(`Fuel cells align to their bay bounds at ${width}x${height}: ${JSON.stringify(geometry.cells)}`);await page.close();
 }
}finally{await browser?.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
