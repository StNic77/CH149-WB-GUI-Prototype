const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),{createPreviewServer}=require('../preview-server.cjs');
(async()=>{const server=createPreviewServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'msedge',headless:true});
for(const [width,height,touch]of [[1440,1000,false],[1366,1024,true],[1133,744,true]]){
 const page=await browser.newPage({viewport:{width,height},hasTouch:touch,reducedMotion:'reduce'}),errors=[];page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port);await require('./enter-workspace.cjs')(page);await page.evaluate(()=>{applyPreset('SAR3');CabinRampArea.open();});
 await page.locator('#rampCargoOptions').click();await page.locator('#rampCargoAdd').click();await page.locator('#planViewport').scrollIntoViewIfNeeded();
 const point=await page.evaluate(()=>{const m=CabinBayLayer.getDisplayMapping(),r=planSheet.getBoundingClientRect();return {x:r.left+(m.aftX+(m.rampAftX-m.aftX)*.55)/m.width*r.width,y:r.top+m.centerY/m.height*r.height};});
 if(touch)await page.touchscreen.tap(point.x,point.y);else await page.mouse.click(point.x,point.y);
 const weight=page.locator('#areaLoadForm [name=weight]');assert.equal(await weight.isVisible(),true);await page.waitForTimeout(120);
 const before=await page.locator('#imageMenu').boundingBox();if(touch)await weight.tap();else await weight.click();await page.keyboard.type('301');await page.waitForTimeout(120);const after=await page.locator('#imageMenu').boundingBox();
 assert.ok(Math.abs(before.x-after.x)<1&&Math.abs(before.y-after.y)<1&&Math.abs(before.width-after.width)<1,JSON.stringify({width,before,after}));assert.equal(await weight.inputValue(),'301');
 // Existing load editor and value replacement follow the same no-snap rule.
 await page.evaluate(()=>{CabinImageMenu.close();const result=CabinCargo.add(state,{area:'RAMP',kind:'individual',weight:25,arm:12893});if(!result.ok)throw Error(result.reason);CabinCargo.open(result.entry.id);});await page.waitForTimeout(120);const editor=page.locator('#cargoEditForm [name=weight]'),old=await page.locator('#imageMenu').boundingBox();if(touch)await editor.tap();else await editor.click();await page.keyboard.type('75');await page.waitForTimeout(120);const edited=await page.locator('#imageMenu').boundingBox();assert.ok(Math.abs(old.x-edited.x)<1&&Math.abs(old.y-edited.y)<1&&Math.abs(old.width-edited.width)<1,JSON.stringify({old,edited}));assert.equal(await editor.inputValue(),'75');
 // Keyboard shrink can constrain the menu, without automatically centering it.
 await page.evaluate(()=>{Object.defineProperties(visualViewport,{height:{configurable:true,value:330},offsetTop:{configurable:true,value:70}});visualViewport.dispatchEvent(new Event('resize'));});await page.waitForTimeout(120);
 const visible=await editor.evaluate(n=>{const r=n.getBoundingClientRect(),b=imageMenuBody.getBoundingClientRect();return r.top>=Math.max(70,b.top)&&r.bottom<=Math.min(400,b.bottom);});assert.equal(visible,true);
 assert.deepEqual(errors,[]);await page.close();console.log('Ramp floor-point/new and existing cargo stay anchored while entering values; keyboard bounds pass '+width+' × '+height+(touch?' touch':' desktop'));
}
}finally{await browser?.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
