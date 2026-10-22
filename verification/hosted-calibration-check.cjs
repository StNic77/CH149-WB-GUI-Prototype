const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),vm=require('node:vm');
const {pathToFileURL}=require('node:url');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),{createPreviewServer}=require('../preview-server.cjs');
const root=path.resolve(__dirname,'..'),sourceFile=path.join(root,'station-calibration.json'),original=fs.readFileSync(sourceFile),published=JSON.parse(original),prefix='/CH149-WB-GUI-Prototype/';
const bundled={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'station-calibration.js'),'utf8'),bundled);
assert.equal(bundled.window.CH149_STATION_CALIBRATION.forward,published.forward);assert.equal(bundled.window.CH149_STATION_CALIBRATION.aft,published.aft);
(async()=>{
 let calibrationRequests=0,invalid=false,browser;
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'cabin-hosted-check-')),stationFile=path.join(temp,'station-calibration.json');fs.writeFileSync(stationFile,original);
 const local=createPreviewServer({stationFile});
 const staticServer=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');if(!url.pathname.startsWith(prefix)){res.writeHead(404).end();return;}
  const relative=decodeURIComponent(url.pathname.slice(prefix.length))||'index.html',file=path.resolve(root,relative);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
  if(relative==='station-calibration.json'){calibrationRequests++;res.writeHead(200,{'Content-Type':'application/json'}).end(invalid?'{}':JSON.stringify(published));return;}
  const types={'.js':'application/javascript','.css':'text/css','.html':'text/html','.png':'image/png'};res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'}).end(fs.readFileSync(file));
 });
 const checkRoles=async page=>{for(const role of ['','SAR3','SAR10','TRANSPORT','CASEVAC']){await page.evaluate(r=>applyPreset(r),role);const m=await page.evaluate(()=>CabinBayLayer.getDisplayMapping());assert.equal(m.forwardX,published.forward);assert.equal(m.aftX,published.aft);}};
 await Promise.all([new Promise(r=>staticServer.listen(0,'127.0.0.1',r)),new Promise(r=>local.listen(0,'127.0.0.1',r))]);
 try{
  browser=await chromium.launch(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{headless:true});
  const hosted='http://127.0.0.1:'+staticServer.address().port+prefix,localURL='http://127.0.0.1:'+local.address().port;
  for(const stale of [false,true]){
   const context=await browser.newContext(),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   if(stale)await page.addInitScript(()=>localStorage.setItem('ch149-cabin-prototype.shared-stations.v1',JSON.stringify({schema:1,plane:[2560,1216],forward:500,aft:1700,source:'BASELINE',revision:0})));
   await page.goto(hosted);await page.waitForFunction(()=>CabinBayLayer.getState().publishedReady);assert.equal(await page.evaluate(()=>CabinBayLayer.getState().projectReady),false);await checkRoles(page);
   if(stale){const backup=await page.evaluate(()=>JSON.parse(localStorage.getItem('ch149-cabin-prototype.shared-stations.v1.previous')));assert.equal(backup.forward,500);assert.equal(backup.aft,1700);}
   await page.locator('#bayToggle').check();await page.locator('.bay-review').evaluate(el=>el.open=true);assert.equal(await page.locator('#baySaveShared').isDisabled(),true);assert.match(await page.locator('#bayPersistenceStatus').textContent(),/Published calibration loaded/);
   await page.reload();await page.waitForFunction(()=>CabinBayLayer.getState().publishedReady);await checkRoles(page);assert.deepEqual(errors,[]);await context.close();
  }
  const page=await browser.newPage();await page.goto(localURL);await page.waitForFunction(()=>CabinBayLayer.getState().projectReady);await checkRoles(page);assert.equal(await page.locator('#baySaveShared').isDisabled(),false);
  const saved=await page.evaluate(async value=>{const response=await fetch('/api/station-calibration',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...value,forward:value.forward+1,expectedRevision:value.revision})});if(!response.ok)throw Error('Test calibration save failed');return response.json();},published);
  const sync={window:{}};vm.runInNewContext(fs.readFileSync(path.join(temp,'station-calibration.js'),'utf8'),sync);assert.equal(sync.window.CH149_STATION_CALIBRATION.forward,saved.forward);assert.equal(sync.window.CH149_STATION_CALIBRATION.aft,saved.aft);await page.close();
  invalid=true;const blocked=await browser.newContext(),fallback=await blocked.newPage(),errors=[];fallback.on('pageerror',e=>errors.push(e.message));
  await fallback.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('Storage unavailable for test');}}));
  await fallback.goto(hosted);await fallback.waitForFunction(()=>document.getElementById('bayPersistenceStatus').textContent.includes('Built-in calibration retained'));await checkRoles(fallback);assert.deepEqual(errors,[]);await blocked.close();
  const file=await browser.newPage();await file.goto(pathToFileURL(path.join(root,'index.html')).href);await checkRoles(file);await file.close();assert.ok(calibrationRequests>=5);assert.deepEqual(fs.readFileSync(sourceFile),original);
  console.log('Passed embedded alignment on static subpaths/local server/direct files, fresh and stale browsers, unavailable storage, invalid JSON, all roles, reload and JSON/JS save synchronization.');
 }finally{if(browser)await browser.close();await Promise.all([new Promise(r=>staticServer.close(r)),new Promise(r=>local.close(r))]);fs.rmSync(temp,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
