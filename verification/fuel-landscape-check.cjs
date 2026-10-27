const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),{createPreviewServer}=require('../preview-server.cjs');
(async()=>{const server=createPreviewServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'msedge',headless:true});
for(const [width,height]of [[1133,744],[1024,768],[844,390],[744,1133],[390,844]]){
 const page=await browser.newPage({viewport:{width,height},hasTouch:true,isMobile:true,reducedMotion:'reduce'}),errors=[];page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port);await require('./enter-workspace.cjs')(page);
 await page.evaluate(()=>{applyPreset('SAR3');CabinPlanning.setBaseline(state,{basis:'MAINTENANCE',basicWeight:10401,basicCG:8487,tail:'149920'});state.planning={...state.planning,fuel:1500,reserve:300};CabinEquipment.refresh();CabinFuelUI.open();});
 const wide=width>height&&width>=700;await page.waitForFunction(wide=>imageMenu.classList.contains('fuel-landscape')===wide,wide);
 const unchanged=await page.evaluate(()=>JSON.stringify(state.planning));
 const geometry=await page.evaluate(()=>{const rect=n=>n.getBoundingClientRect().toJSON();return {menu:rect(imageMenu),fields:[...document.querySelectorAll('.fuel-main-fields input,.fuel-main-fields select')].map(rect),actions:[...document.querySelectorAll('.fuel-primary-actions button')].map(rect)};});
 if(wide){assert.ok(geometry.menu.width>700);assert.ok(geometry.fields.every(r=>Math.abs(r.y-geometry.fields[0].y)<1));assert.ok(Math.abs(geometry.actions[0].y-geometry.actions[1].y)<1);}else{assert.ok(geometry.menu.width<=420);assert.ok(geometry.fields[0].y<geometry.fields[1].y&&geometry.fields[1].y<geometry.fields[2].y);}
 assert.ok(geometry.menu.x>=0&&geometry.menu.x+geometry.menu.width<=width+1);assert.equal(await page.locator('#fuelAllowances').isVisible(),false);
 await page.locator('#fuelClose').click();assert.equal(await page.locator('#imageMenu').isVisible(),false);assert.equal(await page.evaluate(()=>JSON.stringify(state.planning)),unchanged);
 await page.evaluate(()=>CabinFuelUI.open());await page.locator('#fuelCompactForm [name=total]').fill('1800');await page.locator('#fuelCompactForm [name=reserve]').fill('400');
 for(const vvHeight of [330,220]){await page.locator('#fuelCompactForm [name=reserve]').focus();await page.evaluate(h=>{Object.defineProperties(visualViewport,{height:{configurable:true,value:h},offsetTop:{configurable:true,value:40}});visualViewport.dispatchEvent(new Event('resize'));},vvHeight);await page.waitForTimeout(100);
  const visible=await page.locator('#fuelCompactForm [name=reserve]').evaluate(n=>{const r=n.getBoundingClientRect(),b=imageMenuBody.getBoundingClientRect();return r.top>=Math.max(40,b.top)&&r.bottom<=Math.min(40+visualViewport.height,b.bottom);});assert.equal(visible,true);assert.equal(await page.locator('#fuelCompactForm [name=reserve]').inputValue(),'400');if(wide)assert.ok((await page.locator('#imageMenu').boundingBox()).width>700);
 }
 await page.evaluate(()=>{delete visualViewport.height;delete visualViewport.offsetTop;visualViewport.dispatchEvent(new Event('resize'));});await page.locator('#fuelCompactForm [type=submit]').click();assert.equal(await page.evaluate(()=>state.planning.fuel),1800);assert.equal(await page.evaluate(()=>state.planning.reserve),400);
 await page.evaluate(()=>CabinFuelUI.open());await page.locator('#fuelCompactForm [name=mode]').selectOption('manual');assert.equal(await page.locator('.fuel-tanks').isVisible(),true);
 if(wide){const tanks=await page.locator('.fuel-tanks input').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().y));assert.ok(tanks.every(y=>Math.abs(y-tanks[0])<1));}
 for(const [name,value]of [['T1','500'],['T2','400'],['T3','300'],['T4','200'],['T5','100']])await page.locator('#fuelCompactForm [name='+name+']').fill(value);
 await page.locator('#fuelCompactForm [type=submit]').click();assert.equal(await page.evaluate(()=>state.planning.fuelMode),'manual');assert.equal(await page.evaluate(()=>state.planning.fuel),1500);
 await page.evaluate(()=>CabinFuelUI.open());if(width===1133){await page.locator('#imageMenu').screenshot({path:'verification/fuel-landscape-mini-manual.png'});await page.locator('#fuelCompactForm [name=mode]').selectOption('auto');await page.locator('#imageMenu').screenshot({path:'verification/fuel-landscape-mini-auto.png'});await page.setViewportSize({width:744,height:1133});await page.waitForFunction(()=>!imageMenu.classList.contains('fuel-landscape'));assert.ok((await page.locator('#imageMenu').boundingBox()).width<=420);await page.setViewportSize({width,height});await page.waitForFunction(()=>imageMenu.classList.contains('fuel-landscape'));}
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);assert.deepEqual(errors,[]);await page.close();console.log('Fuel rows, width, keyboard bounds, close/apply, manual totals and rotation passed '+width+' × '+height);
}
}finally{await browser?.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
