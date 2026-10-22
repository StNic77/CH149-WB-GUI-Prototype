/* Area-first interaction pilot. Targets select a region; catalogue arms remain
   independent of display coordinates. Raster reference images are unchanged. */
(() => {
  const data=window.CH149_DATA,rules=window.CH149_SEAT_RULES;
  const sides=['Stbd','Centre','Port'];
  const spaces=window.CH149_BAY_DATA.bays.filter(bay=>bay.forward!==undefined).flatMap(bay=>sides.map((side,lane)=>({id:`${bay.id}_${side.toUpperCase()}`,name:`B${bay.name.replace('Bay ','')} ${side}`,bay:bay.id,side,lane,forward:bay.forward,aft:bay.aft,arm:bay.arm})));
  window.CH149_FLOOR_SPACES=spaces;
  const area={id:'BAY6_PORT',name:'B6 Port',seat:'P18',bay:'BAY6',
    cot:'RF_SAR_EQUIPMENT_CSH_PATIENT_TREATMENT_SYSTEM',basket:'ME_SAR_MISSION_EQUIP_RESCUE_BASKET_PORT',otherBasket:'ME_SAR_MISSION_EQUIP_RESCUE_BASKET_STBD'};
  const layer=document.createElement('div');layer.className='floor-area-layer';layer.id='floorAreaLayer';document.getElementById('planSheet').append(layer);
  const cells=new Map();
  const selectionOutline=document.createElement('div');selectionOutline.id='floorSelectionOutline';selectionOutline.setAttribute('aria-hidden','true');selectionOutline.hidden=true;document.getElementById('planSheet').append(selectionOutline);
  const previewOutline=document.createElement('div');previewOutline.id='floorPreviewOutline';previewOutline.setAttribute('aria-hidden','true');previewOutline.hidden=true;document.getElementById('planSheet').append(previewOutline);
  for(const space of spaces){if(space.id===area.id)continue;const cell=document.createElement('button');cell.type='button';cell.className='floor-space-cell';cell.dataset.floorSpace=space.id;cell.setAttribute('aria-label',`Select ${space.name} floor space`);const label=document.createElement('span');label.textContent=space.name;cell.append(label);cell.onclick=event=>openArea(space,event);layer.append(cell);cells.set(space.id,cell);}
  const target=document.createElement('button');target.type='button';target.id='p18AreaTarget';target.className='floor-area-target';target.dataset.floorSpace=area.id;target.textContent=area.name;target.setAttribute('aria-label','Open B6 Port floor space options');target.setAttribute('aria-controls','floorAreaPanel');layer.append(target);cells.set(area.id,target);
  let hoveredCell=null,focusedCell=null;
  function drawPreview(){const cell=hoveredCell||(focusedCell?.matches(':focus-visible')?focusedCell:null);previewOutline.hidden=!available||layer.hidden||!cell;if(cell)Object.assign(previewOutline.style,{left:cell.style.left,top:cell.style.top,width:cell.style.width,height:cell.style.height});}
  for(const cell of cells.values()){cell.addEventListener('pointerenter',event=>{if(event.pointerType==='touch')return;hoveredCell=cell;drawPreview();});cell.addEventListener('pointerleave',()=>{if(hoveredCell===cell)hoveredCell=null;drawPreview();});cell.addEventListener('focus',()=>{focusedCell=cell;drawPreview();});cell.addEventListener('blur',()=>{if(focusedCell===cell)focusedCell=null;drawPreview();});}
  const panel=document.createElement('section');panel.id='floorAreaPanel';panel.className='floor-area-panel';panel.hidden=true;panel.setAttribute('aria-label',area.name);document.getElementById('seatReferenceNotice').before(panel);
  const pointMarker=document.createElement('span');pointMarker.id='floorCargoPoint';pointMarker.className='floor-cargo-point';pointMarker.setAttribute('aria-hidden','true');layer.append(pointMarker);
  const placementHelp=document.createElement('div');placementHelp.id='floorPlacementHelp';placementHelp.className='floor-placement-help';placementHelp.textContent='Cargo placement · click its floor position · Escape cancels';placementHelp.hidden=true;document.getElementById('planViewport').append(placementHelp);
  const openButton=document.createElement('button');openButton.type='button';openButton.id='floorSpaceOpen';openButton.textContent='B6 Port';openButton.setAttribute('aria-controls','floorAreaPanel');document.getElementById('planTools').append(openButton);
  let bridge=null,available=false,open=false,message='',cargoKind=null;
  let placingCargo=false,cargoPointChosen=false,cargoDraft={};
  let selectedSpace=spaces.find(space=>space.id===area.id),fraction=.5,lateral=.5;
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const kg=value=>`${Number(value).toLocaleString('en-CA',{maximumFractionDigits:3})} kg`;
  const arm=value=>`${Number(value).toLocaleString('en-CA')} mm`;
  const selectedBay=()=>window.CH149_BAY_DATA.bays.find(item=>item.id===selectedSpace.bay);
  const estimatedArm=()=>Math.round((selectedSpace.forward+fraction*(selectedSpace.aft-selectedSpace.forward))/10)*10;
  const catalogue={...data.paxSeats,...data.crewSeats};
  function notify(text){message=text;bridge.refresh();render();}
  function renderTarget(){
    const m=window.CabinBayLayer?.getDisplayMapping();layer.hidden=!available||!m;if(layer.hidden){selectionOutline.hidden=true;previewOutline.hidden=true;hoveredCell=focusedCell=null;return;}
    const x=station=>m.forwardX+(station-4875)/6518*(m.aftX-m.forwardX);
    for(const space of spaces)Object.assign(cells.get(space.id).style,{left:`${x(space.forward)/m.width*100}%`,width:`${(x(space.aft)-x(space.forward))/m.width*100}%`,top:`${(m.centerY+(-125+space.lane*250/3)*m.sourceScale)/m.height*100}%`,height:`${250/3*m.sourceScale/m.height*100}%`});
    for(const space of spaces){const cell=cells.get(space.id);cell.setAttribute('aria-expanded',String(open&&selectedSpace.id===space.id));cell.classList.toggle('selected',open&&selectedSpace.id===space.id);}
    selectionOutline.hidden=!available||!open;Object.assign(selectionOutline.style,{left:cells.get(selectedSpace.id).style.left,top:cells.get(selectedSpace.id).style.top,width:cells.get(selectedSpace.id).style.width,height:cells.get(selectedSpace.id).style.height});
    drawPreview();
    openButton.textContent=selectedSpace.name;
    document.getElementById('planViewport').classList.toggle('placing-floor-cargo',placingCargo);placementHelp.hidden=!placingCargo;
    pointMarker.hidden=!open||cargoKind!=='individual'||!cargoPointChosen;pointMarker.style.left=`${x(selectedSpace.forward+fraction*(selectedSpace.aft-selectedSpace.forward))/m.width*100}%`;pointMarker.style.top=`${(m.centerY+(-125+(selectedSpace.lane+lateral)*250/3)*m.sourceScale)/m.height*100}%`;
  }
  function rememberDraft(){const form=panel.querySelector('#areaLoadForm');if(form)cargoDraft={weight:form.elements.weight.value,name:form.elements.name.value,arm:form.elements.arm?.value||''};}
  function startCargo(){cargoKind='individual';placingCargo=true;cargoPointChosen=false;window.CabinBayLayer?.finishMarking();window.CabinSeatEditor?.finishLocating();render();document.getElementById('planViewport').scrollIntoView({block:'center'});}
  function cancelCargo(){placingCargo=false;cargoPointChosen=false;cargoKind=null;cargoDraft={};render();}
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&cargoKind){cancelCargo();}});
  function openArea(space=selectedSpace,event){
    if(!available||!bridge)return;
    window.CabinBasket?.close();
    window.CabinPTA?.close();
    window.CabinStokes?.close();
    window.CabinRampArea?.close();
    window.CabinFloorEquipment?.close();window.CabinCasevac?.close();
    const choosing=placingCargo; if(choosing)rememberDraft();selectedSpace=space;
    const m=window.CabinBayLayer.getDisplayMapping(),rect=document.getElementById('planSheet').getBoundingClientRect();
    if(choosing&&event&&event.detail!==0&&rect.width&&rect.height){const x=(event.clientX-rect.left)/rect.width*m.width,station=4875+(x-m.forwardX)/(m.aftX-m.forwardX)*6518,y=(event.clientY-rect.top)/rect.height*m.height;fraction=Math.max(0,Math.min(1,(station-space.forward)/(space.aft-space.forward)));lateral=Math.max(0,Math.min(1,((y-m.centerY)/m.sourceScale+125)/(250/3)-space.lane));}
    else {fraction=.5;lateral=.5;}
    open=true;message='';placingCargo=false;cargoPointChosen=choosing;
    if(!choosing){cargoKind=null;cargoDraft={};}render();
  }
  target.onclick=event=>openArea(spaces.find(space=>space.id===area.id),event);
  openButton.onclick=()=>openArea();
  function seatReason(state){const items=rules.blockers(state,area.seat);return items.length?`${items.map(item=>item.name).join(' and ')} must be removed first.`:'';}
  function card(title,status,body){return `<article class="floor-choice"><div><h3>${title}</h3><p>${status}</p></div>${body}</article>`;}
  function button(id,text,reason=''){return `<button type="button" class="secondary" id="${id}" ${reason?'disabled':''}>${text}</button>${reason?`<p class="floor-reason">${esc(reason)}</p>`:''}`;}
  function loadRecords(state){const loads=(state.floorLoads||[]).filter(item=>item.area===selectedSpace.id);return `<div id="areaLoads">${loads.length?`<h3>${selectedSpace.name} load records · ${kg(loads.reduce((sum,item)=>sum+item.weight,0))}</h3><ul>${loads.map(item=>`<li><span><strong>${esc(item.name)}</strong> · ${item.kind==='bay'?`${selectedBay().name} load`:'Individual cargo'}<br>${kg(item.weight)} at ${arm(item.arm)}${item.armSource==='floor-estimate'?' · estimated from floor point':''}</span><button type="button" class="secondary" data-area-load-remove="${item.id}">Remove</button></li>`).join('')}</ul>`:''}</div>`;}
  function loadNote(){return '<p class="floor-load-note">Record each load once: use an individual cargo entry or a bay entry. These load records do not reserve a floor footprint. Custom loads stay when changing Role Config.</p>';}
  function seatChoices(state){
    const seats=Object.entries(catalogue).filter(([,seat])=>seat.arm>=selectedSpace.forward&&seat.arm<selectedSpace.aft&&((selectedSpace.side==='Port'&&/Port/i.test(seat.name))||(selectedSpace.side==='Stbd'&&/Stbd/i.test(seat.name))));
    if(!seats.length)return '';
    return card('Seat positions',seats.map(([id,seat])=>{const blocked=rules.blockers(state,id),used=rules.conflicts(state.seats,id);return `<p>${esc(id)} · ${state.seats.has(id)?'Installed':blocked.length?'Unavailable: '+esc(blocked.map(item=>item.name).join(' and ')):used.length?'Alternative to '+used.join(' + '):'Available position'}</p><button type="button" class="secondary" data-area-seat="${id}" ${blocked.length?'disabled':''}>${id} seat options</button>`;}).join(''),'');
  }
  function containerChoices(){if(selectedSpace.id==='BAY1_PORT')return card('Port forward shelves','Top, Middle, Bottom and Floor storage in B1 Port.',button('areaForwardShelvesOpen','Open shelf view'));if(selectedSpace.id==='BAY6_STBD'){const state=bridge.state(),on=state.mission.has(area.otherBasket),other=state.mission.has(area.basket),reason=on?'':window.CabinBasket.reason(state,'STBD');return card('Rescue basket · Stbd',`${on?'Installed':other?'Basket currently at Port':'Not installed'} · P9/P10 may stay installed, folded up and unoccupied.`,button('areaStbdBasket',on?'Inspect basket':other?'Move basket here':'Install basket',reason));}return '';}
  function ptaChoices(){if(!['BAY5_PORT','BAY55_PORT'].includes(selectedSpace.id))return '';const state=bridge.state(),on=state.roleFit.has(area.cot),cot=data.roleFit[area.cot];return card('PTA cot',`${on?'Installed'+(state.patients.PTA?' · patient present':' · no patient'):'Not installed'} · ${kg(cot.w)} · ${arm(cot.arm)}<br>Spans B5 Port, B5.5 Port and part of B6 Port.`,button('areaPTAOptions','PTA cot options'));}
  function stokesChoices(){if(!['BAY3_CENTRE','BAY4_CENTRE'].includes(selectedSpace.id))return '';const state=bridge.state(),cabin=state.mission.has('ME_SAR_MISSION_EQUIP_STOKES_LITTER_CABIN'),ramp=state.mission.has('ME_SAR_MISSION_EQUIP_STOKES_LITTER_RAMP');return card('Stokes litter · cabin position',`${cabin?'Deployed here'+(state.patients.STOKES_CABIN?' · patient present':''):ramp?'Currently stowed on ramp':'Not installed'}<br>Spans B3 Centre and B4 Centre; compatible with seats and PTA cot.`,button('areaStokesOptions','Stokes litter options'));}
  function extraEquipmentChoices(){const state=bridge.state(),editor=window.CabinFloorEquipment;let out='';if(['BAY1_STBD','BAY2_STBD'].includes(selectedSpace.id)){const key='RF_SAR_EQUIPMENT_FWD_SAR_CABINET',on=state.roleFit.has(key),item=data.roleFit[key];out+=card('SAR Cabinet',`${on?'Installed':'Not installed'} · spans B1 and B2 Stbd · ${kg(item.w)} · ${arm(item.arm)}<br>Mutually exclusive with P4, P5 and P6.`,on?button('areaCabinetOpen','Open cabinet view'):button('areaCabinetInstall','Install SAR Cabinet',rules.equipmentConflictMessage(state,key)));}if(['BAY3_CENTRE','BAY4_CENTRE','BAY5_CENTRE'].includes(selectedSpace.id))out+=card('Sea Tray',`${state.roleFit.has(editor.trayKey)?'Installed':'Not installed'} · blue mat spanning B3, B4 and B5 Centre.`,button('areaSeaTrayOptions','Sea Tray options'));if(['BAY3_STBD','BAY4_STBD'].includes(selectedSpace.id)){const id=selectedSpace.id==='BAY3_STBD'?editor.locations[0]:editor.locations[1],here=state.mission.has(editor.raftKey)&&editor.raftLocation(state)===id;out+=card('Internal life raft',`${here?'Raft installed here':'Raft not installed here'} · stowage ${editor.fittingOn(state,id)?'installed':'required'}.`,button('areaRaftOptions','Life raft options'));}return out;}
  function bindLoadActions(state){
    panel.querySelector('#areaIndividualCargo').onclick=()=>{cargoDraft={};startCargo();};
    panel.querySelector('#areaBayCargo').onclick=()=>{placingCargo=false;cargoPointChosen=false;cargoDraft={};cargoKind='bay';renderTarget();renderCargoForm();};
    for(const control of panel.querySelectorAll('[data-area-load-remove]'))control.onclick=()=>{state.floorLoads=state.floorLoads.filter(item=>String(item.id)!==control.dataset.areaLoadRemove);notify('Load record removed.');};
    for(const control of panel.querySelectorAll('[data-area-seat]'))control.onclick=()=>bridge.seat(control.dataset.areaSeat);
    panel.querySelector('#areaForwardShelvesOpen')?.addEventListener('click',()=>bridge.view('forward'));
    panel.querySelector('#areaCabinetOpen')?.addEventListener('click',()=>bridge.view('cabinet'));
    panel.querySelector('#areaCabinetInstall')?.addEventListener('click',()=>{const key='RF_SAR_EQUIPMENT_FWD_SAR_CABINET',reason=rules.equipmentConflictMessage(state,key);if(reason){notify(reason);return;}state.roleFit.add(key);notify('SAR Cabinet installed across B1 and B2 Stbd.');bridge.view('plan');});
    panel.querySelector('#areaPTAOptions')?.addEventListener('click',()=>window.CabinPTA.open(selectedSpace.id));
    panel.querySelector('#areaStokesOptions')?.addEventListener('click',()=>window.CabinStokes.open('CABIN',selectedSpace.id));
    panel.querySelector('#areaSeaTrayOptions')?.addEventListener('click',()=>window.CabinFloorEquipment.openTray(selectedSpace.id));
    panel.querySelector('#areaRaftOptions')?.addEventListener('click',()=>window.CabinFloorEquipment.openRaft(selectedSpace.id==='BAY3_STBD'?'INT_LIFE_RAFT_B3_STBD_F':'INT_LIFE_RAFT_B4_STBD_A'));
    panel.querySelector('#areaStbdBasket')?.addEventListener('click',()=>{if(state.mission.has(area.otherBasket)){window.CabinBasket.open('STBD');return;}const result=state.mission.has(area.basket)?window.CabinBasket.move(state,area.basket,'CABIN_STBD_STOW'):window.CabinBasket.install(state,'STBD');notify(result.ok?'Basket installed at Stbd.':result.reason);});
    panel.querySelector('#areaClose').onclick=()=>{open=false;placingCargo=false;cargoPointChosen=false;cargoKind=null;cargoDraft={};render();cells.get(selectedSpace.id).focus();};
    renderCargoForm();
  }
  function render(){
    renderTarget();panel.hidden=!available||!open||!bridge;if(panel.hidden)return;
    panel.setAttribute('aria-label',selectedSpace.name);
    if(selectedSpace.id!==area.id){const state=bridge.state(),bay=selectedBay();panel.innerHTML=`<div class="floor-area-heading"><div><h2>${selectedSpace.name}</h2><p>Choose what belongs in this floor space. Cargo placement starts only when you choose Cargo.</p></div><button type="button" class="secondary" id="areaClose">Close</button></div><div class="floor-choices">${containerChoices()}${ptaChoices()}${stokesChoices()}${extraEquipmentChoices()}${seatChoices(state)}${card('Cargo','Choose a cargo position, then enter its weight.',button('areaIndividualCargo','Add cargo'))}${card('Bay weight',`${bay.name} · use the configured bay arm: ${arm(bay.arm)}.`,button('areaBayCargo','Enter bay weight'))}</div><p class="floor-load-note">Other equipment choices for this space have not been mapped yet. The B6 Port pilot includes seat, cot and basket options.</p>${loadNote()}<div id="areaCargoForm"></div>${loadRecords(state)}<p id="areaMessage" role="status">${esc(message)}</p>`;bindLoadActions(state);return;}
    const state=bridge.state(),seat=data.paxSeats[area.seat],installed=state.seats.has(area.seat),occupied=state.occupants[area.seat];
    const cot=data.roleFit[area.cot],cotOn=state.roleFit.has(area.cot),basketOn=state.mission.has(area.basket),otherBasket=state.mission.has(area.otherBasket);
    const basket=data.missionEquip[area.basket],basketArm=data.stowage[basket.stow].arm;
    const occupancy=rules.occupancyBlockers(state,area.seat),seatBlocked=seatReason(state),cotBlocked=rules.equipmentConflictMessage(state,area.cot),basketBlocked=rules.equipmentConflictMessage(state,area.basket);
    const removeSeatReason=occupied?'Clear the occupant before removing this seat.':'';
    const folded=installed&&occupancy.length>0;
    let seatButtons=button('areaSeatToggle',installed?'Remove P18 seat':'Install P18 seat',installed?removeSeatReason:seatBlocked);
    if(installed){seatButtons+=`<div class="floor-actions">${button('areaAddPassenger','Add passenger',occupancy.length?'This seat must remain folded up and unoccupied.':'')}${button('areaAssignCrew','Assign crew',occupancy.length?'This seat must remain folded up and unoccupied.':'')}${occupied?button('areaClearOccupant','Clear occupant'):''}</div>`;}
    const cotRemoveReason=state.patients.PTA?'Remove the PTA patient in the cot view before removing the cot.':'';
    const cotButtons=button('areaCotToggle',cotOn?'Remove PTA cot':'Install PTA cot',cotOn?cotRemoveReason:cotBlocked)+button('areaPTAOptions','PTA cot options')+(cotOn?button('areaInspectCot','Inspect PTA / patient position'):'');
    const basketButtons=button('areaBasketToggle',basketOn?'Remove port basket':otherBasket?'Move basket from starboard to port':'Install port basket',basketOn?'':basketBlocked)+(basketOn?button('areaBasketMove','Move basket to starboard',rules.equipmentConflictMessage(state,area.otherBasket)):'');
    const bay=selectedBay();
    panel.innerHTML=`<div class="floor-area-heading"><div><h2>${area.name}</h2><p>Floor space · includes seat position P18. Choose what belongs here; equipment keeps its own defined position and arm.</p></div><button type="button" class="secondary" id="areaClose" aria-label="Close B6 Port menu">Close</button></div>
      <div class="floor-choices">
      ${card('P18 seat',`${installed?folded?'Installed · folded up':'Installed':'Not installed'}${occupied?' · '+esc(occupied):''} · ${kg(seat.wSeat)} · seat arm ${arm(seat.arm)}`,seatButtons)}
      ${card('PTA cot',`${cotOn?'Installed':'Not installed'} · ${kg(cot.w)} · ${arm(cot.arm)}<br>Uses the wider PTA area: excludes P15–P18 and the port basket.`,cotButtons)}
      ${card('Rescue basket · port',`${basketOn?'Installed at port':otherBasket?'Currently at starboard':'Not installed'} · ${kg(basket.unitWeight)} · port arm ${arm(basketArm)}<br>P18 may stay installed, folded up and unoccupied.`,basketButtons)}
      ${card('Cargo','Choose a cargo position, then enter its weight.',button('areaIndividualCargo','Add cargo'))}
      ${card('Bay weight',`Bay 6 · configured arm: ${arm(bay.arm)}.`,button('areaBayCargo','Enter bay weight'))}
      </div>${loadNote()}
      <div id="areaCargoForm"></div>
      ${loadRecords(state)}
      <p id="areaMessage" role="status">${esc(message)}</p><p class="floor-reference-note">The picture remains a reference image. This menu and the seat markers show current installation state.</p>`;
    panel.querySelector('#areaClose').onclick=()=>{open=false;cargoKind=null;render();target.focus();};
    panel.querySelector('#areaSeatToggle').onclick=()=>{
      if(state.seats.has(area.seat)){if(state.occupants[area.seat])return;state.seats.delete(area.seat);notify('P18 seat removed.');}
      else {const result=rules.install(state,area.seat,catalogue);if(!result.ok){message=result.reason;render();return;}notify(`P18 installed${rules.occupancyBlockers(state,area.seat).length?' · folded up; no occupant allowed':''}.`);}
    };
    for(const [id,kind] of [['areaAddPassenger','Passenger'],['areaAssignCrew','Crew']])panel.querySelector('#'+id)?.addEventListener('click',()=>{const result=rules.assignOccupant(state,area.seat,kind);if(!result.ok){message=result.reason;render();return;}notify(`${kind} assigned to P18. No entered person weight yet.`);});
    panel.querySelector('#areaClearOccupant')?.addEventListener('click',()=>{delete state.occupants[area.seat];notify('P18 occupant cleared.');});
    panel.querySelector('#areaCotToggle').onclick=()=>{
      const removing=state.roleFit.has(area.cot),result=removing?window.CabinPTA.remove(state):window.CabinPTA.install(state);notify(result.ok?(removing?'PTA cot removed. Its excluded seat positions are available again.':'PTA cot installed at its defined position.'):result.reason);
    };
    panel.querySelector('#areaInspectCot')?.addEventListener('click',()=>{bridge.view('pta');window.CabinPTA.open();});
    panel.querySelector('#areaBasketToggle').onclick=()=>{
      if(state.mission.has(area.basket)){bridge.remove(area.basket);notify('Port basket removed.');return;}
      const conflict=rules.equipmentConflictMessage(state,area.basket);if(conflict){message=conflict;render();return;}
      if(state.mission.has(area.otherBasket))bridge.move(area.otherBasket,'CABIN_PORT_STOW');else {const result=window.CabinBasket.install(state,'PORT');if(!result.ok){message=result.reason;render();return;}}
      notify('Basket installed at port. P18 may remain installed, folded up and unoccupied.');
    };
    panel.querySelector('#areaBasketMove')?.addEventListener('click',()=>{
      const conflict=rules.equipmentConflictMessage(state,area.otherBasket);if(conflict){message=conflict;render();return;}
      bridge.move(area.basket,'CABIN_STBD_STOW');notify('Basket moved to starboard. P9/P10 must stay unoccupied; P18 can be occupied when installed.');
    });
    bindLoadActions(state);
  }
  function renderCargoForm(){
    const container=panel.querySelector('#areaCargoForm');if(!container)return;
    if(!cargoKind){container.innerHTML='';return;}
    const bay=selectedBay();
    container.innerHTML=`<form id="areaLoadForm"><h3>${cargoKind==='bay'?`${bay.name} load`:'Individual cargo'}</h3><label>Weight (kg)<input name="weight" type="number" min="0.001" step="any" value="${esc(cargoDraft.weight||'')}" required></label>${cargoKind==='bay'?`<p>Configured arm: <strong>${arm(bay.arm)}</strong></p>`:`<p>${cargoPointChosen?`Estimated arm from selected floor point: <strong id="areaEstimatedArm">${arm(estimatedArm())}</strong>`:'Choose the cargo position on the floor to estimate its arm.'}</p><button type="button" class="secondary" id="areaChooseCargoPoint">${cargoPointChosen?'Change cargo position':'Choose cargo position'}</button><details id="areaKnownArm"><summary>Use a known arm instead</summary><label>Known arm (mm)<input name="arm" type="number" min="0" step="any" value="${esc(cargoDraft.arm||'')}" placeholder="Leave blank to use the estimate"></label></details>`}<details><summary>Description (optional)</summary><label>Description<input name="name" maxlength="80" value="${esc(cargoDraft.name||'')}" placeholder="${cargoKind==='bay'?bay.name+' load':selectedSpace.name+' cargo'}"></label></details><div class="floor-actions"><button type="submit" class="secondary">Add load record</button><button type="button" class="secondary" id="areaCancelLoad">Cancel</button></div><p id="areaLoadError" role="status"></p></form>`;
    container.querySelector('#areaCancelLoad').onclick=cancelCargo;container.querySelector('#areaChooseCargoPoint')?.addEventListener('click',()=>{rememberDraft();startCargo();});
    container.querySelector('form').onsubmit=event=>{
      event.preventDefault();const form=event.currentTarget,state=bridge.state(),name=form.elements.name.value.trim()||(cargoKind==='bay'?bay.name+' load':selectedSpace.name+' cargo'),weight=Number(form.elements.weight.value),override=cargoKind==='individual'&&form.elements.arm.value.trim()!=='',value=cargoKind==='bay'?bay.arm:override?Number(form.elements.arm.value):estimatedArm();
      if(cargoKind==='individual'&&!override&&!cargoPointChosen){container.querySelector('#areaLoadError').textContent='Choose a cargo position on the floor first.';return;}
      if(!name||!Number.isFinite(weight)||weight<=0||!Number.isFinite(value)||value<0){container.querySelector('#areaLoadError').textContent='Enter a positive weight and a valid arm.';return;}
      state.nextFloorLoadId=(state.nextFloorLoadId||0)+1;state.floorLoads??=[];state.floorLoads.push({id:state.nextFloorLoadId,area:selectedSpace.id,kind:cargoKind,name,weight,arm:value,armSource:cargoKind==='bay'?'configured-bay':override?'entered':'floor-estimate',floorPoint:cargoPointChosen?{bay:selectedSpace.bay,fraction,lateral,side:selectedSpace.side}:null});cargoKind=null;placingCargo=false;cargoPointChosen=false;cargoDraft={};notify('Load recorded once in its selected category.');
    };
    if(!placingCargo)container.querySelector('input')?.focus();
  }
  window.CabinFloorArea={connect(value){bridge=value;},render,renderTarget,open:openArea,openById(id){const space=spaces.find(s=>s.id===id);if(space)openArea(space);},close(){open=false;cancelCargo();},getSelection:()=>({space:selectedSpace.id,estimatedArm:estimatedArm(),fraction,lateral,placingCargo,cargoPointChosen}),setView(value){available=value;placingCargo=false;cargoPointChosen=false;cargoKind=null;cargoDraft={};placementHelp.hidden=true;document.getElementById('planViewport').classList.remove('placing-floor-cargo');render();}};
})();

