const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {createPreviewServer}=require('../preview-server.cjs');
(async()=>{const server=createPreviewServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'msedge',headless:true});
for(const [width,height,touch] of [[1133,744,true],[1366,1024,true],[744,1133,true],[1440,1000,false]]){
const page=await browser.newPage({viewport:{width,height},hasTouch:touch});
await page.goto('http://127.0.0.1:'+server.address().port);await require('./enter-workspace.cjs')(page);
await page.evaluate(()=>{applyPreset('SAR3');CabinFloorArea.openById('BAY2_CENTRE');document.querySelector('#areaBayCargo').click();});
await page.waitForTimeout(100);const compact=touch&&width>height;
assert.equal(await page.locator('#imageMenu').evaluate(n=>n.classList.contains('load-landscape')),compact);
async function row(input,button){const a=await page.locator(input).boundingBox(),b=await page.locator(button).boundingBox();assert.ok(a&&b);if(compact){assert.ok(a.width<=145,JSON.stringify(a));assert.ok(Math.abs(a.y+a.height-b.y-b.height)<3,JSON.stringify({a,b}));}}
await row('#areaLoadForm [name=weight]','#areaLoadForm button[type=submit]');
await row('#areaLoadForm [name=weight]','#areaCancelLoad');
await page.screenshot({path:'verification/load-landscape-entry-'+width+'.png'});await page.locator('#areaLoadForm [name=weight]').fill('123.456');await page.locator('#areaLoadForm button[type=submit]').click();
await page.evaluate(()=>CabinCargo.openBay('BAY2_CENTRE'));await page.waitForTimeout(80);
await row('#cargoEditForm [name=weight]','#cargoEditForm button[type=submit]');
await page.locator('#cargoEditForm [name=weight]').fill('125');await page.locator('#cargoEditForm button[type=submit]').click();
assert.equal(await page.evaluate(()=>state.floorLoads.find(r=>r.kind==='bay'&&r.area==='BAY2_CENTRE').weight),125);
await page.evaluate(()=>CabinEquipmentUI.openLocation('SAR_CABINET_MIDDLE'));await page.locator('#equipmentInstalled').click();await page.locator('.equipment-extra-weight>summary').click();
await page.locator('.equipment-extra-weight input').fill('12.5');await row('.equipment-extra-weight input','.equipment-extra-weight button');await page.locator('.equipment-extra-weight button').click();assert.equal(await page.evaluate(()=>state.stowageLoads.SAR_CABINET_MIDDLE),12.5);
await page.screenshot({path:'verification/load-landscape-'+width+'.png'});await page.close();console.log('Compact load layout and saved bay/shelf weights passed '+width+'x'+height);
}
}finally{await browser?.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
