/* Shared navigation for regression checks written before the compact area menu.
   Uses the visible cascade buttons, then the existing focused controls. */
module.exports=async function prepare(page){
 await require('./enter-workspace.cjs')(page);
 const locate=page.locator.bind(page);let previousMenu=null;
 page.locator=function(selector,...args){const locator=locate(selector,...args);
  for(const method of ['click','tap']){const activate=locator[method].bind(locator);locator[method]=async function(...options){
   // Older integrity checks continue in a rendered editor after each commit.
   // Reopen it explicitly; view-controls-check separately asserts automatic closing.
   const menu=await page.evaluate(()=>window.CabinImageMenu?.getState());if(menu?.open)previousMenu=menu;
   if(await locator.count()&&await locator.first().evaluate(el=>!!el.closest('#imageMenu'))&&!await locate('#imageMenu').isVisible()&&await locate('#layersControl').count()&&await locate('#layersControl').getAttribute('aria-expanded')==='true')await locate('#layersControl').click();
   if(previousMenu&&await locator.count()&&!await locator.first().isVisible()&&await locator.first().evaluate(el=>!!el.closest('#imageMenu'))&&!await locate('#imageMenu').isVisible())await page.evaluate(m=>CabinImageMenu.show(m.current,m.area,m.item),previousMenu);
   const compact=await locate('#compactViewControls').count();
   if(compact){
    if(selector==='#fuelAlways'){await locate('#openFuel')[method]();return;}
    if(selector==='.layer-options>summary'){if(await locate('#layersControl').getAttribute('aria-expanded')!=='true')await locate('#layersControl')[method]();return;}
    if(selector==='#backToCabin'){if(await locate('#viewControl').getAttribute('aria-expanded')!=='true')await locate('#viewControl')[method]();await locate('[data-viewtab="'+(selector==='#backToCabin'?'plan':'stbd')+'"]').click();return;}
    if(selector==='#planWide'){await locate('#planViewport').scrollIntoViewIfNeeded();await locate('#wholeAircraft')[method]();return;}
    if(await locator.count()&&await locator.first().evaluate(el=>!!el.closest('#viewOptions'))&&!(await locator.first().isVisible()))await locate('#viewControl')[method]();
   }
   if(await locator.count()&&!(await locator.first().isVisible())){
    const card=await locator.first().evaluate(el=>{const c=el.closest('.floor-choice');return c?[...document.querySelectorAll('#floorAreaPanel .floor-choice')].indexOf(c):-1;});
    if(card>=0){await locate('#floorAreaPanel .cascade-choice').nth(card)[method]();if(!await locator.count()||!await locator.first().isVisible())return;}
   }
   if(await locator.count()&&await locator.first().evaluate(el=>!!el.closest('#aircraftSummary'))&&!await locate('#aircraftSummary').isVisible())await locate('#summaryToggle').click();
   if(await locator.count()&&!await locator.first().isVisible()&&await locator.first().evaluate(el=>!!el.closest('.aircraft-ribbon-actions'))&&await locate('#phoneRibbonToggle').isVisible())await locate('#phoneRibbonToggle').click();
   const result=await activate(...options);await page.waitForTimeout(5);return result;
  };}
  for(const method of ['check','uncheck']){const activate=locator[method].bind(locator);locator[method]=async function(...options){if(await locator.count()){const id=await locator.first().getAttribute('id'),button=id?locate('[data-layer-for="'+id+'"]'):null;if(button&&await button.count()){if(await locate('#layersControl').getAttribute('aria-expanded')!=='true')await locate('#layersControl').click();if(await locator.isChecked()!==(method==='check'))await button.click();return;}if(await locator.first().evaluate(el=>!!el.closest('.layer-options:not([open])')))await locate('.layer-options>summary').click();}return activate(...options);};}
  const selectOption=locator.selectOption.bind(locator);locator.selectOption=async function(value,...options){if(await locate('#compactViewControls').count()){if(selector==='#viewPicker'){if(await locate('#viewControl').getAttribute('aria-expanded')!=='true')await locate('#viewControl').click();await locate('[data-viewtab="'+value+'"]').click();return [value];}if(selector==='#controlHand'){if(await locator.inputValue()!==value)await locate('#controlHandKey').click();return [value];}}return selectOption(value,...options);};
  return locator;
 };
 // These regression cases exercise baskets/litters, not absent fitting rejection
 // (covered separately in usability-package-check). Supply their support fixtures.
 await page.evaluate(()=>{for(const key of ['RF_STOW_BASKET_PORT','RF_STOW_BASKET_STBD','RF_STOW_STOKES_CABIN','RF_STOW_STOKES_RAMP'])state.roleFit.add(key);});
};
