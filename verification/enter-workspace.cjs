/* Enter through the new first-session UI, then restore the legacy test's
   deliberately unconfigured fixture. Entry/resume itself has separate checks. */
module.exports=async page=>{
 await page.waitForFunction(()=>!!window.CabinSession);
 if(!await page.locator('#sessionEntry').isVisible())return;
 const before=await page.evaluate(()=>JSON.stringify(state,(_,v)=>v instanceof Set?{set:[...v]}:v));
 await page.locator('#entryTails [data-entry-choice="149920"]').click();
 await page.locator('#sessionEntry [name=weight]').fill('10401');await page.locator('#sessionEntry [name=cg]').fill('8487');await page.locator('#enterWorkspace').click();
 await page.evaluate(raw=>{const original=JSON.parse(raw,(_,v)=>v&&Object.keys(v).length===1&&Array.isArray(v.set)?new Set(v.set):v);for(const key of Object.keys(state))delete state[key];Object.assign(state,original);recalculateItems();render();},before);
};
