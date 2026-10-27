/* Compact viewing controls. Existing renderers and load calculations remain authoritative. */
(() => {
 const S=()=>window.CabinImageState(),D=window.CH149_DATA,$=id=>document.getElementById(id);
 const photo=document.querySelector('.photo-wrap'),bar=document.createElement('section');bar.id='compactViewControls';bar.setAttribute('aria-label','Aircraft viewing controls');
 bar.innerHTML='<div class="view-control-row"><button id="roleControl" aria-controls="roleOptions">Role</button><button id="layersControl" aria-controls="layerOptionsPanel">Layers</button><button id="viewControl" aria-controls="viewOptions">View</button></div><div id="roleOptions" hidden></div><div id="viewOptions" hidden></div><div id="layerOptionsPanel" hidden><div id="layerButtons" role="group" aria-label="Image layers"></div></div>';
 const return2D=document.createElement('button');return2D.type='button';return2D.id='detailReturn2D';return2D.textContent='2D view';return2D.setAttribute('aria-label','Return to 2D view');return2D.hidden=true;return2D.onclick=()=>chooseView('plan');photo.append(return2D);
 photo.before(bar);let open=S().preset?'':'role',lastRole=S().preset,pending=null,completed=0,controlsHidden=false;
 const retired=document.createElement('div');retired.id='retiredViewControls';retired.hidden=true;document.body.append(retired);
 const configs=$('configButtons'),oldToolbar=configs.closest('.toolbar');$('roleOptions').append(configs);oldToolbar.hidden=true;
 $('viewOptions').append($('viewTabs'));retired.append($('planTools'));
 const rampAdjust=document.createElement('a');rampAdjust.id='adjustRampShelfAreas';rampAdjust.href='ramp-shelf-review.html';rampAdjust.target='_blank';rampAdjust.rel='noopener';rampAdjust.textContent='Adjust ramp shelf areas';$('viewOptions').append(rampAdjust);
 for(const node of document.querySelectorAll('.view-framing,.overlay-controls'))retired.append(node);
 const oldLayerOptions=document.querySelector('.layer-options');if(oldLayerOptions)retired.append(oldLayerOptions);
 document.body.classList.add('compact-view-controls-active');
 const status=document.createElement('div');status.id='cabinActionFeedback';status.setAttribute('role','status');status.hidden=true;document.body.append(status);let statusTimer;
 function announce(text){clearTimeout(statusTimer);status.textContent=text;status.hidden=false;statusTimer=setTimeout(()=>{status.hidden=true;},2500);}
 function complete(text){completed++;window.CabinImageMenu.close();announce(text||'Change applied. Aircraft updated.');}
 window.CabinActions={complete,announce};
 function roleName(){return S().preset?D.presets[S().preset]?.name||S().preset:'Choose';}
 const viewNames={plan:'2D cabin',cabinet:'Cabinet',forward:'Fwd shelves',pta:'Port aft',ramp:'Ramp shelves',stbd:'Stbd aft'};
 const toggles=[['liveCabinToggle','Live equipment',true],['seatToggle','Seats',true],['occupantToggle','Occupants',true],['floorCellsToggle','Bay cells',true],['bayToggle','Bay boundaries',true],['cargoToggle','Cargo',true],['equipmentMarkerToggle','Equipment symbols',false],['fuelLayerToggle','Fuel quantities',true],['cgLayerToggle','Longitudinal CG',true],['planGuideToggle','Alignment guides',true]];
 for(const input of document.querySelectorAll('input[id$="Reveal"]'))if(!toggles.some(([id])=>id===input.id))toggles.push([input.id,input.closest('label')?.textContent.trim()||'Selectable regions',false]);
 for(const [id,label,planOnly]of toggles){const input=$(id);if(!input)continue;const b=document.createElement('button');b.type='button';b.dataset.layerFor=id;b.textContent=label;b.onclick=()=>{input.checked=!input.checked;input.dispatchEvent(new Event('change',{bubbles:true}));sync();announce(label+(input.checked?' shown.':' hidden.'));};input.addEventListener('change',sync);if(id.endsWith('Reveal')){const labelNode=input.closest('label');if(labelNode)retired.append(labelNode);}$('layerButtons').append(b);}
 retired.append($('controlHand'));
 const key=$('equipmentSymbolKey');if(key)$('layerOptionsPanel').append(key);
 for(const node of document.querySelectorAll('.cabinet-zone-tools,.shelf-region-tools,.overhead-region-tools'))retired.append(node);
 const alignment=bar.querySelector('[data-layer-for="planGuideToggle"]');if(alignment)alignment.remove();$('planGuideToggle').checked=false;$('planGuides').hidden=true;
 const dock=$('aircraftTouchControls'),slot=document.createElement('div');slot.id='aircraftSizingSlot';photo.after(slot);slot.append(dock);document.body.append(dock);dock.prepend($('wholeAircraft'),$('enlargeCabin'));dock.setAttribute('aria-label','Aircraft sizing controls');
 // The old container remains for compatibility with dependent scripts; it is hidden.
 const rawTouch=window.CabinTouchControls,oldOnView=rawTouch.onView;rawTouch.onView=function(...args){oldOnView(...args);sync();};
 const handKey=document.createElement('button');handKey.id='controlHandKey';handKey.onclick=()=>{const select=$('controlHand');select.value=select.value==='right'?'left':'right';select.dispatchEvent(new Event('change',{bubbles:true}));sync();};dock.append(handKey);const visibilityKey=document.createElement('button');visibilityKey.id='sideControlsToggle';visibilityKey.setAttribute('aria-controls','wholeAircraft enlargeCabin touchZoomIn touchZoomValue touchZoomOut touchReset controlHandKey');visibilityKey.onclick=()=>{controlsHidden=!controlsHidden;sync();};dock.append(visibilityKey);
 function placeDock(){const r=photo.getBoundingClientRect(),hand=$('controlHand').value,controls=bar.getBoundingClientRect(),bottom=innerHeight-($('liveAircraftStrip')?.getBoundingClientRect().height||0)-8,minTop=controls.bottom>0&&controls.top<bottom?Math.max(8,controls.bottom+6):8;
  dock.dataset.placement='side';slot.dataset.hand=hand;slot.hidden=true;dock.style.maxHeight=Math.max(100,bottom-minTop)+'px';const height=dock.getBoundingClientRect().height;dock.style.top=Math.max(8,Math.min(Math.max(8,bottom-height),Math.max(minTop,r.top+(S().view==='plan'?0:52))))+'px';handKey.textContent=hand==='right'?'Left hand':'Right hand';handKey.setAttribute('aria-label','Use '+(hand==='right'?'left':'right')+'-hand controls');
 }

 function sync(){return2D.hidden=S().view==='plan';dock.classList.toggle('sizing-controls-collapsed',controlsHidden);visibilityKey.textContent=controlsHidden?'Show controls':'Hide controls';visibilityKey.setAttribute('aria-expanded',String(!controlsHidden));const s=S();if(s.preset!==lastRole){lastRole=s.preset;open=s.preset?'':'role';}
  rampAdjust.hidden=s.view!=='ramp';
  $('roleControl').textContent='Role · '+roleName()+(open==='role'?' ▴':' ▾');$('viewControl').textContent='View · '+(viewNames[s.view]||s.view)+(open==='view'?' ▴':' ▾');$('layersControl').textContent='Layers'+(open==='layers'?' ▴':' ▾');
  for(const [name,id]of [['role','roleOptions'],['view','viewOptions'],['layers','layerOptionsPanel']]){const active=open===name;$(id).hidden=!active;$(name==='role'?'roleControl':name==='view'?'viewControl':'layersControl').setAttribute('aria-expanded',String(active));}
  const revealViews={cabinetZoneReveal:'cabinet',forwardShelfReveal:'forward',rampShelfReveal:'ramp',portOverheadReveal:'pta',stbdOverheadReveal:'stbd'};
  for(const [id,,planOnly]of toggles){const input=$(id),b=bar.querySelector('[data-layer-for="'+id+'"]');if(!input||!b)continue;const applicable=id.endsWith('Reveal')?revealViews[id]===s.view:id==='equipmentMarkerToggle'?s.view!=='cabinet':planOnly?s.view==='plan':true,cgHidden=document.body.classList.contains('cg-layer-active')&&['seatToggle','occupantToggle','floorCellsToggle','bayToggle','equipmentMarkerToggle'].includes(id);b.hidden=!applicable;b.setAttribute('aria-pressed',String(input.checked&&!cgHidden));b.disabled=input.disabled||cgHidden;b.title=cgHidden?'Hidden while Longitudinal CG is shown.':'';}
  if(key)key.hidden=false;
  for(const b of configs.querySelectorAll('[data-preset]')){b.setAttribute('aria-pressed',String(b.dataset.preset===s.preset));b.onclick=()=>requestRole(b.dataset.preset);}
  placeDock();
 }
 for(const [id,name]of [['roleControl','role'],['viewControl','view'],['layersControl','layers']])$(id).onclick=()=>{const next=open===name?'':name;if(next&&!open&&window.CabinImageMenu.getState().open)window.CabinImageMenu.suspend();open=next;sync();if(!open)window.CabinImageMenu.resume();};
 function chooseView(id){open='';setView(id);sync();$('viewControl').focus();}
 const dialog=document.createElement('dialog');dialog.id='roleResetDialog';dialog.setAttribute('aria-labelledby','roleResetTitle');dialog.innerHTML='<h2 id="roleResetTitle">Change Role and reset this session?</h2><p id="roleResetDescription">Your accepted aircraft information and fuel entries will be retained. Configuration edits, equipment quantities and locations, custom people/patients, loading and certification after acceptance will be reset. The new Role’s standard configuration will then be applied.</p><p id="roleResetError" role="alert"></p><div class="compact-actions"><button id="keepRoleSession">Keep current session</button><button id="confirmRoleReset">Change Role and reset</button></div>';dialog.setAttribute('aria-describedby','roleResetDescription');document.body.append(dialog);
 function requestRole(key){if(key===S().preset){open='';sync();window.CabinImageMenu.resume();announce('Current Role retained. No session changes.');return;}const s=S(),hasWork=!!s.preset||s.floorLoads?.length||s.mission.size||s.roleFit.size||Object.values(s.stowageLoads||{}).some(Boolean)||Object.values(s.occupants||{}).some(Boolean)||Object.values(s.patients||{}).some(Boolean)||s.planning?.fuel!==undefined;
  if(!hasWork){applyRole(key);return;}pending=key;$('roleResetError').textContent='';$('confirmRoleReset').textContent='Change to '+(D.presets[key]?.name||'No Role Config')+' and reset';dialog.showModal();$('keepRoleSession').focus();
 }
 function cancelRole(){pending=null;open='';dialog.close();sync();window.CabinImageMenu.resume();$('roleControl').focus();announce('Current session kept. No aircraft changes made.');}
 function applyRole(key){const s=S(),before=structuredClone(s),p=s.planning,accepted=p?Object.fromEntries(['tail','source','basicWeight','basicCG','basis','baseline','fuel','fuelMode','tanks','reserve'].filter(k=>p[k]!==undefined).map(k=>[k,structuredClone(p[k])])):null;
  window.CabinImageMenu.close();for(const m of ['CabinCargo','CabinFloorArea','CabinBasket','CabinPTA','CabinStokes'])window[m]?.close?.();
  s.floorLoads=[];s.stowageLoads={};s.nextFloorLoadId=0;s.nextAllocationId=0;s.selectedLoc=null;for(const k of ['certification','certified','clearance'])delete s[k];if(accepted)s.planning=accepted;else delete s.planning;
  if(applyPreset(key)===false){for(const k of Object.keys(s))if(!(k in before))delete s[k];Object.assign(s,before);render();$('roleResetError').textContent='The new Role could not be applied. Your previous session was retained.';return false;}
  if(accepted){const result=window.CabinPlanning.evaluate(s);if(result.wb)s.planning.start={weight:result.wb.auwExact,cg:result.wb.auwCG};renderSeats();}
  if(dialog.open)dialog.close();pending=null;open='';sync();$('roleControl').focus();announce((D.presets[key]?.name||'No Role Config')+' applied. Aircraft information and fuel retained; configuration and loading reset.');return true;
 }
 $('keepRoleSession').onclick=cancelRole;$('confirmRoleReset').onclick=()=>applyRole(pending);dialog.addEventListener('cancel',e=>{e.preventDefault();cancelRole();});
 // Preserve all established render entry points. Only human Role choices use the reset flow.
 const rawConfig=window.renderConfigButtons;window.renderConfigButtons=function(...a){const r=rawConfig(...a);sync();return r;};
 const rawViews=window.renderViews;window.renderViews=function(...a){const r=rawViews(...a);for(const b of $('viewTabs').querySelectorAll('[data-viewtab]'))b.onclick=()=>chooseView(b.dataset.viewtab);$('viewPicker').onchange=e=>chooseView(e.target.value);sync();return r;};
 const rawView=window.setView;window.setView=function(...a){const r=rawView(...a);sync();queueMicrotask(sync);return r;};
 $('controlHand').addEventListener('change',placeDock);window.addEventListener('resize',placeDock);window.addEventListener('scroll',placeDock,{passive:true});new ResizeObserver(placeDock).observe(photo);
 // Successful final actions close their menu; navigation and layer changes do not.
 const signature=()=>JSON.stringify({equipment:window.CabinEquipment.signature(S()),loads:S().floorLoads,planning:S().planning});
 function watchFinal(event){const button=event.submitter||event.target.closest?.('button');if(!button||!button.closest('#imageMenu')||button.disabled)return;const before=signature(),count=completed,label=button.textContent.trim(),subject=window.CabinImageMenu.getState().item||'';setTimeout(()=>{if(count===completed&&signature()!==before&&!window.CabinEquipmentUI.isIntermediate?.())complete((label+(subject?' · '+subject:'')).replace(/\s+/g,' ')+'. Aircraft updated.');},0);}
 document.addEventListener('click',watchFinal,true);document.addEventListener('submit',watchFinal,true);
 bar.addEventListener('keydown',e=>{if(e.key==='Escape'&&open){const focus=open==='role'?'roleControl':open==='view'?'viewControl':'layersControl';open='';sync();window.CabinImageMenu.resume();$(focus).focus();}});
 window.CabinViewControls={sync,requestRole,chooseView,placeDock,getState:()=>({open,pending,controlsHidden,placement:dock.dataset.placement})};renderConfigButtons();renderViews();sync();
})();
