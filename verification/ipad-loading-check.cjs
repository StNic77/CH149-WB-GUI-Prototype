const prepare=require('./compact-test-navigation.cjs');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const browsers=require(process.env.PLAYWRIGHT_MODULE||'playwright'),{createPreviewServer}=require('../preview-server.cjs');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const assets=[...html.matchAll(/(?:src|href)="([^"?]+\.(?:js|css))(?:\?([^" ]+))?"/g)].map(m=>({file:m[1],version:new URLSearchParams(m[2]||'').get('v')}));
const hashes=Object.fromEntries(assets.map(a=>[a.file,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,a.file))).digest('hex').slice(0,12)]));
const oldCSS=fs.readFileSync(path.join(root,'workspace.css'),'utf8')+'\n.app-layout{display:grid!important;grid-template-columns:190px minmax(0,1fr)!important}.viewtabs{display:none!important}';
(async()=>{const server=createPreviewServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{const engine=process.env.PLAYWRIGHT_ENGINE||'chromium';browser=await browsers[engine].launch(engine==='chromium'?{channel:process.env.PLAYWRIGHT_CHANNEL||'msedge',headless:true}:{headless:true});
for(const [width,height]of [[834,1194],[1194,834],[768,1024],[1024,768]]){const page=await browser.newPage({viewport:{width,height},hasTouch:true,isMobile:true,deviceScaleFactor:2}),errors=[];page.on('pageerror',e=>errors.push(e.message));
// Simulate an iPad retaining a previous stylesheet under its old URL.
await page.route('**/workspace.css*',route=>new URL(route.request().url()).searchParams.get('v')===hashes['workspace.css']?route.continue():route.fulfill({contentType:'text/css',body:oldCSS}));
await page.goto(process.env.IPAD_TEST_URL||'http://127.0.0.1:'+server.address().port);await prepare(page);
await page.waitForFunction(()=>{const img=document.getElementById('cabinImage');return img?.complete&&img.naturalWidth>0;});
assert.equal(await page.locator('#cabinImage').isVisible(),true);assert.ok((await page.locator('#cabinImage').boundingBox()).width>100,'Aircraft image must have a visible width.');
const layout=await page.locator('.workspace-body').boundingBox();assert.ok(layout.width>width*.85,'Stale stylesheet has collapsed the iPad workspace: '+layout.width+' / '+width);
assert.equal(await page.locator('#viewControl').isVisible(),true);await page.locator('[data-viewtab="stbd"]').tap();assert.equal(await page.evaluate(()=>state.view),'stbd');await page.waitForFunction(()=>cabinImage.complete&&cabinImage.naturalWidth>0);await page.locator('#backToCabin').tap();await page.locator('#openPlanning').tap();assert.equal(await page.locator('#planningDialog').isVisible(),true);await page.locator('#planningForm [name="weight"]').fill('10000');await page.locator('#planningForm [name="cg"]').fill('8000');await page.locator('#planningForm [type="submit"]').tap();assert.equal(await page.locator('#planningDialog').isVisible(),false);await page.evaluate(()=>applyPreset('SAR3'));await page.waitForFunction(()=>cabinImage.complete&&cabinImage.naturalWidth>0);assert.match(await page.locator('#liveAircraftValues').textContent(),/AUW.*kg/);assert.deepEqual(errors,[]);
await page.screenshot({path:path.join(__dirname,'ipad-loading-'+engine+'-'+width+'.png')});await page.close();console.log(engine+': iPad stale-asset loading, aircraft images and view/planning controls passed at '+width+'×'+height);}
for(const a of assets)assert.equal(a.version,hashes[a.file],'Missing/stale content version: '+a.file);
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
