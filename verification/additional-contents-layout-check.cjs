const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {createPreviewServer}=require('../preview-server.cjs');
(async()=>{const server=createPreviewServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'msedge',headless:true});
for(const [width,height,touch,zone] of [[1440,1000,false,'SAR_CABINET_TOP'],[744,1133,true,'SAR_CABINET_MIDDLE'],[1133,744,true,'SAR_CABINET_TOP']]){
 const page=await browser.newPage({viewport:{width,height},hasTouch:touch});
 await page.goto('http://127.0.0.1:'+server.address().port);await require('./enter-workspace.cjs')(page);
 await page.evaluate(id=>{applyPreset('SAR3');window.CabinEquipmentUI.openLocation(id);},zone);
 await page.locator('#equipmentInstalled').click();await page.locator('.equipment-extra-weight>summary').click();
 const input=page.locator('.equipment-extra-weight input[type=number]'),button=page.locator('.equipment-extra-weight button');
 const formLayout=await page.locator('.equipment-extra-weight form').evaluate(n=>({display:getComputedStyle(n).display,columns:getComputedStyle(n).gridTemplateColumns}));
 assert.equal(formLayout.display,'grid',JSON.stringify(formLayout));
 const a=await input.boundingBox(),b=await button.boundingBox();assert.ok(a&&b);
 if(touch&&width>height){assert.ok(a.x+a.width<=b.x||b.x+b.width<=a.x,JSON.stringify({a,b,width,height,zone}));}
 else assert.ok(a.y+a.height<=b.y||b.y+b.height<=a.y,JSON.stringify({a,b,width,height,zone}));
 await input.fill('12.5');assert.equal(await input.inputValue(),'12.5');assert.equal(await button.isEnabled(),true);
 await button.click();assert.equal(await page.evaluate(id=>state.stowageLoads[id],zone),12.5);
 await page.evaluate(id=>window.CabinEquipmentUI.openLocation(id),zone);await page.locator('#equipmentInstalled').click();await page.locator('.equipment-extra-weight>summary').click();
 assert.equal(await page.locator('.equipment-extra-weight input').inputValue(),'12.5');
 await page.screenshot({path:`verification/additional-contents-${width}x${height}.png`});
 console.log(`Passed ${width}x${height} ${touch?'touch':'desktop'} ${zone}: separate controls, editable value, independent apply, persisted display`);await page.close();
 }
}finally{await browser?.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
