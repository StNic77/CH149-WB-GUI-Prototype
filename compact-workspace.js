/* Focus area menus on short choices; keep existing guarded editors behind them. */
(() => {
 const E=window.CabinEquipment,S=()=>window.CabinImageState();
 const originalLocation=window.CabinImageMenu.showLocation;
 function compact(){
  const panel=document.getElementById('floorAreaPanel');if(panel.hidden||window.CabinFloorArea.getSelection().cargoKind)return;
  panel.querySelector('.cascade-menu')?.remove();panel.querySelector('.cascade-back')?.remove();for(const node of panel.querySelectorAll('.cascade-hidden'))node.classList.remove('cascade-hidden');
  const cards=[...panel.querySelectorAll('.floor-choice')],menu=document.createElement('div');menu.className='cascade-menu';
  function focus(node,title){for(const c of cards)c.classList.toggle('cascade-hidden',c!==node);menu.hidden=true;const back=document.createElement('button');back.type='button';back.className='cascade-back secondary';back.textContent='← '+(window.CH149_FLOOR_SPACES.find(s=>s.id===window.CabinFloorArea.getSelection().space)?.name||'Area options');back.onclick=()=>{for(const c of cards)c.classList.add('cascade-hidden');menu.hidden=false;back.remove();document.getElementById('imageMenuBody').scrollTop=0;};menu.before(back);document.getElementById('imageMenuBody').scrollTop=0;}
  for(const card of cards){const title=card.querySelector('h3')?.textContent||'Options';card.classList.add('cascade-hidden');const b=document.createElement('button');b.type='button';b.className='cascade-choice secondary';b.textContent=title.replace(' · cabin position','');b.onclick=()=>{const buttons=[...card.querySelectorAll('button')];if(buttons.length===1&&!buttons[0].disabled)buttons[0].click();else focus(card,title);};menu.append(b);}
  // The compact overview also has a direct path to carried equipment in this bay.
  const space=window.CH149_FLOOR_SPACES.find(s=>s.id===window.CabinFloorArea.getSelection().space);
  if(space){const b=document.createElement('button');b.className='cascade-choice secondary';b.textContent='Equipment / contents';b.onclick=()=>window.CabinEquipmentUI.openLocation(space.bay);menu.append(b);}
  const first=cards[0];if(first)first.parentElement.before(menu);else panel.append(menu);
  for(const node of panel.querySelectorAll('.floor-load-note,.floor-reference-note,#areaLoads')){if(node.id==='areaLoads'&&node.querySelector('[data-area-load-edit]'))continue;node.classList.add('cascade-hidden');}
 }
 window.CabinImageMenu.showLocation=function(...args){originalLocation(...args);compact();};
 const floorRender=window.CabinFloorArea.render;window.CabinFloorArea.render=function(...args){floorRender(...args);compact();};
 new MutationObserver(()=>{const p=document.getElementById('floorAreaPanel');if(!p.hidden&&!p.querySelector('.cascade-menu')&&!window.CabinFloorArea.getSelection().cargoKind)compact();}).observe(document.getElementById('floorAreaPanel'),{childList:true});
 const detail=window.CabinImageMenu.showDetail;window.CabinImageMenu.showDetail=function(id){const loc=LOC.find(l=>l.id===id);if(loc&&['shelf','cabinet','storage'].includes(loc.type)&&!window.CabinFloorEquipment.locations.includes(id)){window.CabinEquipmentUI.openLocation(id);return;}detail(id);};
 // A whole-equipment snapshot makes dedicated legacy controls undoable too.
 document.addEventListener('click',e=>{if(e.target.closest('#equipmentUndo,#controlHand,[data-preset]'))return;if(!e.target.closest('#imageMenu,#aircraftSummary'))return;const s=S(),before=E.snapshot(s),sig=E.signature(s);queueMicrotask(()=>{if(E.signature(s)!==sig){E.record(s,before);window.CabinEquipmentUI.updateUndo();window.CabinEquipmentMarkers?.render();}});},true);
 // Signed delta is independent of quantity increment buttons.
 function delta(){const form=document.querySelector('#cargoEditForm');if(!form||form.querySelector('.bay-delta'))return;const kind=form.closest('#cargoPanel')?.querySelector('h3')?.textContent;const id=window.CabinCargo.getSelection?.();
  const input=form.elements.weight;if(!input)return;
  const box=document.createElement('section');box.className='bay-delta';box.innerHTML='<strong>Adjust load weight</strong><label>Change (kg)<input type="number" inputmode="decimal" min="0" step="any"></label><button type="button" data-sign="1" aria-pressed="true">+ Add</button> <button type="button" data-sign="-1" aria-pressed="false">− Subtract</button><button type="button" id="applyWeightDelta">Apply change to weight</button><p role="status"></p>';let sign=1;box.querySelectorAll('[data-sign]').forEach(b=>b.onclick=()=>{sign=Number(b.dataset.sign);box.querySelectorAll('[data-sign]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));preview();});
  const deltaInput=box.querySelector('input');deltaInput.removeAttribute('min');
  const deltaValue=()=>{const n=Number(deltaInput.value);return n<0?n:sign*n;};
  function preview(){const n=deltaValue(),next=Number(input.value)+n;box.querySelector('p').textContent=Number.isFinite(n)&&next>0?'New weight: '+next+' kg':next===0?'Use Remove load to clear this load completely.':'The resulting load weight cannot be negative.';box.querySelector('#applyWeightDelta').disabled=!Number.isFinite(n)||next<=0;}
  deltaInput.oninput=preview;box.querySelector('#applyWeightDelta').onclick=()=>{input.value=Number(input.value)+deltaValue();deltaInput.value='';input.dispatchEvent(new Event('input',{bubbles:true}));preview();};input.addEventListener('input',preview);form.append(box);
 }
 new MutationObserver(delta).observe(document.getElementById('cargoPanel'),{childList:true,subtree:true});
 // Refresh summary & overlays from the existing common render path.
 const oldSummary=window.CabinAircraftSummary.render;window.CabinAircraftSummary.render=function(...args){oldSummary(...args);window.CabinEquipmentUI.updateUndo();window.CabinEquipmentMarkers?.render();window.CabinFuelUI?.renderOverlay();window.CabinFuelUI?.syncSummary();};
 const oldView=window.CabinImageMenu.onView;window.CabinImageMenu.onView=function(...args){oldView(...args);window.CabinEquipmentMarkers?.onView();window.CabinFuelUI?.renderOverlay();};
})();
