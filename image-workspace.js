/* Image-first presentation adapter. Existing modules retain all loading mutations. */
(() => {
 const viewport=document.getElementById('planViewport'),tools=document.getElementById('planTools');
 const host=document.createElement('section');host.id='imageMenu';host.className='image-menu';host.hidden=true;host.tabIndex=-1;host.setAttribute('role','dialog');host.setAttribute('aria-label','Selected aircraft location');
 host.innerHTML='<div class="image-menu-bar"><nav id="imageBreadcrumbs" aria-label="Selected location"></nav><button type="button" id="imageMenuClose" aria-label="Close location menu">×</button></div><div id="imageMenuBody"></div>';
 document.body.append(host);const body=host.querySelector('#imageMenuBody'),crumbs=host.querySelector('nav');
 const seatControls=document.createElement('section');seatControls.id='seatLocalControls';seatControls.append(document.getElementById('seatMenu'),document.getElementById('seatEditMessage'));
 body.append(seatControls);
 const ids=['floorAreaPanel','seatLocalControls','basketPanel','ptaPanel','stokesPanel','rampAreaPanel','floorEquipmentPanel','casevacPanel','cargoPanel','viewerDetail'];
 for(const id of ids){const panel=document.getElementById(id);if(panel)body.append(panel);}
 const locationChoices=document.createElement('details');locationChoices.id='detailLocationChoices';locationChoices.innerHTML='<summary>Other shelves / compartments</summary>';locationChoices.append(document.getElementById('detailSlots'));document.getElementById('viewerDetail').append(locationChoices);
 let current=null,area=null,item=null,anchor=null,trigger=null,lastPoint=null,lastTrigger=null,frame=0,placementHidden=false;
 const state=()=>window.CabinImageState(),spaces=window.CH149_FLOOR_SPACES;
 const spaceName=id=>id==='RAMP'?'Ramp':spaces.find(s=>s.id===id)?.name||id||'Cabin';
 const areaAt=(arm,side)=>spaces.find(s=>arm>=s.forward&&arm<s.aft&&s.side===side)?.id;
 function seatArea(id){const seat=window.CH149_DATA.paxSeats[id]||window.CH149_DATA.crewSeats[id];return seat?areaAt(seat.arm,/Port/i.test(seat.name)?'Port':/Stbd/i.test(seat.name)?'Stbd':'Centre'):null;}
 function close(restoreFocus=false){host.hidden=true;current=null;placementHidden=false;if(restoreFocus)(trigger?.isConnected?trigger:viewport).focus({preventScroll:true});}
 function promoteActions(){const panel=document.getElementById(current);if(!panel)return;
  const editor=panel.querySelector('#cargoEditor');if(editor&&panel.querySelector('#cargoTotals')&&editor.parentNode!==panel)panel.insertBefore(editor,panel.querySelector('#cargoTotals'));
  const parent=panel.querySelector('#areaLoadForm,#cargoEditForm,.seat-menu')||panel;
  const row=parent.querySelector('.actions,.floor-actions');
  const important=panel.querySelector('#casevacToggle')?.parentElement||row;
  if(important&&!important.matches('.floor-choice *')&&parent.firstElementChild!==important)parent.prepend(important);
  if(important)important.dataset.primaryActions='true';
 }
 function position(){frame=0;if(host.hidden)return;promoteActions();const box=viewport.getBoundingClientRect(),margin=8,visible=window.visualViewport,viewWidth=visible?.width||innerWidth,viewHeight=(visible?.height||innerHeight)-(document.getElementById('liveAircraftStrip')?.getBoundingClientRect().height||0),viewLeft=visible?.offsetLeft||0,viewTop=visible?.offsetTop||0;
  const editing=host.contains(document.activeElement)&&document.activeElement.matches('input,textarea,select');
  if(editing){host.style.width=Math.min(current==='cargoPanel'?520:420,viewWidth-16)+'px';host.style.left=(viewLeft+(viewWidth-parseFloat(host.style.width))/2)+'px';host.style.top=(viewTop+8)+'px';host.style.maxHeight=Math.max(60,(visible?.height||innerHeight)-16)+'px';window.CabinKeyboardMenus?.schedule();return;}
  const dock=document.getElementById('aircraftTouchControls'),reserve=viewWidth<650&&dock&&!dock.hidden&&dock.dataset.placement==='side'?dock.getBoundingClientRect().width+16:0,leftHand=dock?.dataset.hand==='left';
  host.style.width=Math.min(current==='cargoPanel'?520:420,viewWidth-margin*2-reserve)+'px';
  host.style.maxHeight=Math.max(120,Math.min(viewHeight-24,viewWidth<900?viewHeight*.78:Math.max(box.height,460)))+'px';
  const p=anchor||{x:box.left+box.width/2,y:Math.max(12,box.top)+30},size=host.getBoundingClientRect();
  if(viewWidth<650){const above=p.y-viewTop-24,below=viewTop+viewHeight-p.y-24;host.style.maxHeight=Math.max(120,Math.min(viewHeight-24,Math.max(above,below)))+'px';}
  const actual=host.getBoundingClientRect();
  let x=p.x+12;if(x+size.width>viewLeft+viewWidth-margin)x=p.x-size.width-12;
  host.style.left=Math.max(viewLeft+margin+(leftHand?reserve:0),Math.min(viewLeft+viewWidth-size.width-margin-(leftHand?0:reserve),x))+'px';
  const y=viewWidth<650?(p.y-viewTop>viewTop+viewHeight-p.y?p.y-actual.height-20:p.y+20):p.y-16;
  host.style.top=Math.max(viewTop+margin,Math.min(viewTop+viewHeight-actual.height-margin,y))+'px';
  const controls=document.getElementById('compactViewControls')?.getBoundingClientRect(),placed=host.getBoundingClientRect();if(controls&&controls.bottom>viewTop&&controls.top<viewTop+viewHeight&&placed.top<controls.bottom&&placed.bottom>controls.top){const below=viewTop+viewHeight-controls.bottom-margin*2,above=controls.top-viewTop-margin*2;if(below>=120){host.style.maxHeight=below+'px';host.style.top=controls.bottom+margin+'px';}else if(above>=120){host.style.maxHeight=above+'px';host.style.top=viewTop+margin+'px';}}
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(position);}
 function separator(){if(crumbs.children.length){const s=document.createElement('span');s.textContent='›';s.setAttribute('aria-hidden','true');crumbs.append(s);}}
 function breadcrumb(label,action){separator();const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=action;crumbs.append(b);}
 function show(panelId,root,label){const panel=document.getElementById(panelId);if(!panel)return;
  if(host.hidden){const r=viewport.getBoundingClientRect();anchor=lastPoint||{x:r.left+r.width*.55,y:r.top+r.height*.35};trigger=lastTrigger||document.activeElement;}
  current=panelId;area=root;item=label;placementHidden=false;
  for(const child of body.children)child.classList.toggle('image-menu-current',child===panel);
  crumbs.replaceChildren();breadcrumb(state().view==='plan'?'Cabin':'← 2D cabin',()=>{close();setView('plan');});
  if(root)breadcrumb(spaceName(root),()=>root==='RAMP'?window.CabinRampArea.open():window.CabinFloorArea.openById(root));
  if(panelId==='viewerDetail')breadcrumb(document.getElementById('viewTitle').textContent,()=>close());
  if(label){separator();const text=document.createElement('span');text.textContent=label;crumbs.append(text);}
  host.hidden=false;body.scrollTop=0;position();schedule();host.focus({preventScroll:true});
 }
 function moduleArea(fallback,allowed){return allowed?.includes(area)?area:fallback;}
 function wrap(module,name,panel,resolve){const original=module?.[name];if(!original)return;module[name]=(...args)=>{original(...args);const context=resolve(...args);show(panel,context.area,context.label);};}
 wrap(window.CabinBasket,'open','basketPanel',side=>({area:side==='PORT'?'BAY6_PORT':'BAY6_STBD',label:'Rescue basket'}));
 wrap(window.CabinPTA,'open','ptaPanel',id=>({area:moduleArea(id||'BAY6_PORT',['BAY5_PORT','BAY55_PORT','BAY6_PORT']),label:'PTA cot'}));
 wrap(window.CabinStokes,'open','stokesPanel',side=>{const other=side==='RAMP'?'CABIN':'RAMP',prefix='ME_SAR_MISSION_EQUIP_STOKES_LITTER_',actual=state().mission.has(prefix+side)?side:state().mission.has(prefix+other)?other:side;return {area:actual==='RAMP'?'RAMP':moduleArea('BAY3_CENTRE',['BAY3_CENTRE','BAY4_CENTRE']),label:'Stokes litter'};});
 wrap(window.CabinRampArea,'open','rampAreaPanel',()=>({area:'RAMP'}));
 wrap(window.CabinFloorEquipment,'openTray','floorEquipmentPanel',()=>({area:moduleArea('BAY3_CENTRE',['BAY3_CENTRE','BAY4_CENTRE','BAY5_CENTRE']),label:'Sea Tray'}));
 wrap(window.CabinFloorEquipment,'openRaft','floorEquipmentPanel',id=>({area:(id||window.CabinFloorEquipment.raftLocation(state()))===window.CabinFloorEquipment.locations[1]?'BAY4_STBD':'BAY3_STBD',label:'Life raft and stowage'}));
 wrap(window.CabinCasevac,'open','casevacPanel',(id='FWD_STBD')=>({area:areaAt(window.CH149_DATA.roleFit[window.CabinCasevac.key(id)].arm,id.endsWith('PORT')?'Port':'Stbd'),label:'CASEVAC rack and patients'}));
 for(const name of ['open','openBay','openCargoArea'])wrap(window.CabinCargo,name,'cargoPanel',id=>({area:name==='open'?window.CabinCargo.get(state(),id)?.area:id,label:name==='openBay'?'Bay weight':'Cargo and bay loads'}));
 function showSeat(id){show('seatLocalControls',seatArea(id),id);}
 function showLocation(){const selected=window.CabinFloorArea.getSelection();window.CabinLoadingFeedback?.area();show('floorAreaPanel',selected.space,selected.cargoKind==='individual'?'Cargo details':selected.cargoKind==='bay'?'Bay weight':null);}
 function showDetail(id){show('viewerDetail',null,window.CH149_DATA.stowage[id]?.name||id);}
 // Capture the user's image target before existing handlers change the view.
 document.addEventListener('pointerdown',event=>{if(viewport.contains(event.target)){lastPoint={x:event.clientX,y:event.clientY};lastTrigger=event.target.closest('button,[role="button"]');}if(!host.hidden&&!host.contains(event.target)&&!viewport.contains(event.target)&&!event.target.closest('.image-layer,#aircraftTouchControls,#compactViewControls,#roleResetDialog,.view-framing,.overlay-controls'))close();},true);
 document.addEventListener('click',event=>{if(!viewport.contains(event.target))return;
  if(event.detail===0){const r=event.target.getBoundingClientRect();lastPoint={x:r.left+r.width/2,y:r.top+r.height/2};}
  if(event.target===viewport||event.target.id==='planSheet'||event.target.id==='cabinImage')close();
 },true);
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!host.hidden){close(true);event.stopPropagation();}});
 host.querySelector('#imageMenuClose').onclick=()=>close(true);
 new MutationObserver(()=>{if(host.hidden)return;const panel=document.getElementById(current);if(panel?.hidden||current==='viewerDetail'&&!panel.classList.contains('show'))close();else schedule();}).observe(body,{attributes:true,attributeFilter:['hidden','class'],childList:true,subtree:true});
 window.addEventListener('resize',schedule);window.addEventListener('scroll',event=>{if(!host.contains(event.target))schedule();},true);window.visualViewport?.addEventListener('resize',schedule);window.visualViewport?.addEventListener('scroll',schedule);
 // Retire duplicate navigation while retaining elements referenced by legacy modules.
 const fallback=document.createElement('div');fallback.id='retiredImageControls';fallback.hidden=true;document.body.append(fallback);
 for(const id of ['floorSpaceOpen','rampAreaOpen','casevacOpen','cargoOpen']){const b=document.getElementById(id);if(b)fallback.append(b);}
 document.querySelector('.axis').hidden=true;document.querySelector('.area-nav').hidden=true;
 const back=document.createElement('button');back.id='backToCabin';back.type='button';back.className='image-back-button';back.textContent='← Back to 2D cabin';back.onclick=()=>setView('plan');document.querySelector('.viewer-head').after(back);
 const cellLabel=document.createElement('label');cellLabel.innerHTML='<input id="floorCellsToggle" type="checkbox" checked>Bay Cells';tools.append(cellLabel);
 const descriptions={occupantToggle:['Occupants','Show or hide all crew, passenger and patient markers. Visibility does not change occupants, loads or W&B.'],seatToggle:['Seats','Seat-position markers and available installation positions. Installed seat pictures remain selectable when these markers are hidden.'],bayToggle:['Bay Boundaries','Station lines and bay boundaries. These guides do not change the aircraft load.'],floorCellsToggle:['Bay Cells','Selectable Port, Centre and Stbd floor spaces, plus the single ramp area.'],planGuideToggle:['Alignment guides','Prototype reference guides used to check image alignment.'],liveCabinToggle:['Live equipment','Shows installed seats and equipment, including moved, removed and folded states. Off shows the original Role Config reference image.'],cargoToggle:['Cargo','Shows Cargo 1–4 and bay-weight symbols. Green passes current ramp checks; red indicates a combined ramp loading caution. Cabin checks include explicit bay loads only; grey means no applicable check. Hiding symbols does not remove loads or change their weight.']};
 const layers=document.createElement('div');layers.className='image-layers';layers.setAttribute('aria-label','Image layers');const heading=document.createElement('strong');heading.textContent='Layers';layers.append(heading);tools.append(layers);
 for(const [id,[name,help]]of Object.entries(descriptions)){const input=document.getElementById(id),label=input.closest('label');label.lastChild.textContent=name;const group=document.createElement('div');group.className='image-layer';const explanation=document.createElement('details');explanation.innerHTML='<summary aria-label="About '+name+'">?</summary>';const p=document.createElement('p');p.textContent=help;explanation.append(p);group.append(label,explanation);layers.append(group);}
 document.getElementById('floorCellsToggle').onchange=event=>viewport.classList.toggle('floor-cells-hidden',!event.target.checked);
 // Shelf access points refer to known fixtures; they do not define loading footprints.
 const shelfLayer=document.createElement('div');shelfLayer.id='planShelfAccess';document.getElementById('planSheet').append(shelfLayer);
 for(const [id,label,view]of [['forward','Forward shelves','forward'],['rampPort','Port ramp shelves','ramp'],['rampStbd','Stbd ramp shelves','ramp'],['portAft','Port Aft View','pta'],['stbdAft','Starboard Aft View','stbd']]){const b=document.createElement('button');b.type='button';b.dataset.shelfAccess=id;b.textContent='';b.title='Open '+label;b.setAttribute('aria-label','Open '+label);b.onclick=()=>window.CabinViewControls.chooseView(view);shelfLayer.append(b);}
 const forwardLabel=document.createElement('span');forwardLabel.className='reference-name-label';forwardLabel.textContent='Fwd shelves';shelfLayer.querySelector('[data-shelf-access=forward]').append(forwardLabel);
 function renderAccess(){const m=window.CabinBayLayer.getDisplayMapping();shelfLayer.hidden=state().view!=='plan'||!m;if(!m)return;
  for(const b of shelfLayer.children){const id=b.dataset.shelfAccess,forward=id==='forward',aft=id.endsWith('Aft'),x=forward?m.forwardX+(5375-4875)/6518*(m.aftX-m.forwardX):aft?m.aftX-40*m.sourceScale:m.aftX+(m.rampAftX-m.aftX)*.48,y=m.centerY+(['rampStbd','stbdAft'].includes(id)?-120:120)*m.sourceScale;b.style.left=x/m.width*100+'%';b.style.top=y/m.height*100+'%';b.style.width=(aft?60:120)*m.sourceScale/m.width*100+'%';b.style.height=(aft?34:80)*m.sourceScale/m.height*100+'%';}
 }
 window.CabinImageMenu={showSeat,showLocation,showDetail,close,show,anchorAtElement(element){if(element){const r=element.getBoundingClientRect();lastPoint={x:r.left+r.width/2,y:r.top+r.height/2};lastTrigger=element;}},setAnchor(x,y){anchor={x,y};},retarget(panel,root,label){if(!host.hidden&&current===panel&&root!==area)show(panel,root,label);},renderAccess,onView(){close();back.hidden=state().view==='plan';renderAccess();},suspend(){placementHidden=!host.hidden;host.hidden=true;},resume(){if(placementHidden&&current){host.hidden=false;placementHidden=false;schedule();}},getState:()=>({open:!host.hidden,current,area,item})};
 back.hidden=state().view==='plan';
 renderAccess();
})();
