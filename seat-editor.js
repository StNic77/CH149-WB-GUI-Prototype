/* Seat-reference markers and prototype installation state; no new seat locations. */
(() => {
  const data=window.CH149_DATA, all={...data.crewSeats,...data.paxSeats},rules=window.CH149_SEAT_RULES;
  const layer=document.createElement('div');layer.id='seatLayer';layer.className='seat-layer';
  document.getElementById('planSheet').append(layer);
  const toggle=document.getElementById('seatToggle'),panel=document.getElementById('seatPanel');
  let getState=null, available=false, locating=false, suppressLocateClick=false;
  // User accepted the existing cockpit-jump panel as the common image baseline.
  // Keep older browser marks untouched under v1; new deliberate adjustments use v2.
  const positionKey='ch149-cabin-prototype.c3-position-review.v2';
  let c3Positions={};
  try {const saved=JSON.parse(localStorage.getItem(positionKey));if(saved?.schema===1&&saved.records&&typeof saved.records==='object')c3Positions=saved.records;} catch {}
  const viewport=document.getElementById('planViewport');
  function currentAsset(){return window.CabinPlanViewer?.getState().asset;}
  function c3Point() {
    const active=currentAsset(),assets=window.CH149_PLAN_REGISTRATION.assets;
    const sources=Object.values(assets).sort((a,b)=>Number(b===active)-Number(a===active));
    for(const source of sources){
      const point=c3Positions[source.file];
      if(point&&JSON.stringify(point.size)===JSON.stringify(source.size)&&Number.isFinite(point.x)&&Number.isFinite(point.y)&&point.x>=0&&point.x<=source.size[0]&&point.y>=0&&point.y<=source.size[1])return {x:source.x+point.x*source.scale,y:source.y+point.y*source.scale};
    }
    const baseline=assets.BASELINE;
    return {x:baseline.x+574*baseline.scale,y:baseline.y+403*baseline.scale};
  }
  function finishLocating() {
    locating=false;viewport.classList.remove('locating-seat');
    document.getElementById('seatFinishLocate').hidden=true;
    document.getElementById('seatLocateC3').setAttribute('aria-pressed','false');
    if(document.getElementById('seatLocationStatus').textContent.startsWith('C3 position marked'))document.getElementById('seatLocationStatus').textContent='C3 visual position saved. Use Locate C3 to adjust it; catalogue arms are unchanged.';
  }
  document.getElementById('seatLocateC3').onclick=()=>{
    if(!available){document.getElementById('seatLocationStatus').textContent='Open an available plan to locate C3.';return;}
    window.CabinBayLayer.finishMarking();locating=true;
    viewport.classList.add('locating-seat');
    document.getElementById('seatLocateC3').setAttribute('aria-pressed','true');
    document.getElementById('seatFinishLocate').hidden=false;
    document.getElementById('seatLocationStatus').textContent='Click C3 on the plan. Click again to refine, then Finish locating C3. Its catalogue arm will stay unchanged.';
    select('C3');
  };
  document.getElementById('seatFinishLocate').onclick=finishLocating;
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&locating)finishLocating();});
  function locatePoint(event) {
    if(event.type==='click'&&suppressLocateClick){suppressLocateClick=false;event.preventDefault();event.stopImmediatePropagation();return;}
    if(!locating||!available||(event.clientX===0&&event.clientY===0&&event.detail===0))return;
    const source=currentAsset(),rect=document.getElementById('cabinImage').getBoundingClientRect();
    const x=(event.clientX-rect.left)/rect.width*source.size[0],y=(event.clientY-rect.top)/rect.height*source.size[1];
    if(x<0||y<0||x>source.size[0]||y>source.size[1])return;
    event.preventDefault();if(event.type==='click')event.stopImmediatePropagation();
    c3Positions[source.file]={size:source.size,x,y,review:'User-identified visual centre; catalogue arms unchanged'};
    let saved=true;try {localStorage.setItem(positionKey,JSON.stringify({schema:1,records:c3Positions}));} catch {saved=false;}
    document.getElementById('seatLocationStatus').textContent=`C3 position marked${saved?' and saved in this browser':''}. Click again to refine, then Finish locating C3. Seat and occupant arms are unchanged.`;
    renderLayer();
  }
  viewport.addEventListener('click',locatePoint,true);
  const ordered=ids=>ids.sort((a,b)=>Number(a.slice(1))-Number(b.slice(1)));
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function expectedSeats(state) {
    const preset=data.presets[state.preset];
    return new Set(preset?[...(preset.seats?.crew||[]),...(preset.seats?.pax||[]),...Object.keys(data.crewSeats).filter(id=>all[id].alwaysInstalled)]:Object.keys(all).filter(id=>all[id].alwaysInstalled||all[id].normallyInstalled));
  }
  function changed(state) {const expected=expectedSeats(state);expected.add('P2');expected.add('P3');return expected.size!==state.seats.size||[...expected].some(id=>!state.seats.has(id));}
  function select(id) {if(!all[id]||rules.blockers(getState(),id).length)return;getState().selectedSeat=id;render();window.CabinImageMenu?.showSeat(id);}
  function list(ids) {
    const state=getState();
    return ids.map(id=>{const conflicts=rules.conflicts(state.seats,id),blocked=rules.blockers(state,id),restricted=rules.occupancyBlockers(state,id);return `<button type="button" class="seat ${state.seats.has(id)?'on':''}" data-seat="${id}" ${blocked.length?'disabled':''} aria-pressed="${state.selectedSeat===id}"><b>${esc(id)}</b> · ${esc(all[id].name.replace(new RegExp('^'+id+'\\s*'),''))}<small>${blocked.length?`Unavailable · ${esc(blocked.map(item=>item.name).join(' + '))} installed`:restricted.length?`${state.seats.has(id)?'Installed · folded up':'Seat can be installed'} · no occupant (${esc(restricted.map(item=>item.name).join(' + '))})`:state.seats.has(id)?'Installed':conflicts.length?`Space used by ${conflicts.join(', ')}`:'Available position'}${state.occupants[id]?' · occupied':''}</small></button>`;}).join('');
  }
  function renderMenu() {
    const state=getState(),id=state.selectedSeat,seat=all[id],container=document.getElementById('seatMenu');
    if(!seat){container.innerHTML='<p class="quiet">Select a seat marker or a named position to install or remove its seat.</p>';return;}
    const installed=state.seats.has(id),occupied=!!state.occupants[id],fixed=!!seat.alwaysInstalled||['C1','C2','P2','P3'].includes(id);
    const plan=rules.installationPlan(state,id);
    if(plan.blockedBy.length){container.innerHTML=`<p class="quiet">${esc(id)} is unavailable while ${esc(plan.blockedBy.map(item=>item.name).join(' and '))} is installed.</p>`;return;}
    container.innerHTML=`<div class="seat-menu"><strong>${esc(id)} · ${esc(seat.name.replace(new RegExp('^'+id+'\\s*'),''))}</strong><p>${installed?'Installed':'Available position'} · seat ${seat.wSeat} kg · seat arm ${seat.arm.toLocaleString('en-CA')} mm</p>${seat.occupantArm!==undefined&&seat.occupantArm!==seat.arm?`<p>Occupant arm ${seat.occupantArm.toLocaleString('en-CA')} mm</p>`:''}${fixed?'<p>This seat is permanently installed.</p>':occupied?'<p>This position is occupied. Clear its occupant before removing the seat.</p>':''}${occupied?`<p>Occupant: ${esc(state.occupants[id])}</p>`:''}<div class="actions"><button type="button" class="secondary" id="toggleSeat" ${fixed||installed&&occupied?'disabled':''}>${installed?'Remove seat':'Install seat'}</button>${occupied?'<button type="button" class="secondary" id="clearSeatOccupant">Clear occupant</button>':''}${installed?'<button type="button" class="secondary" id="addPax">Add passenger</button><button type="button" class="secondary" id="addCrew">Assign crew</button>':''}</div></div>`;
    if(['C1','C2'].includes(id))container.querySelector('#addPax')?.remove();
    const restricted=rules.occupancyBlockers(state,id);
    if(restricted.length){const note=document.createElement('p');note.className='seat-conflict-note';note.textContent=`${restricted.map(item=>item.name).join(' and ')} uses this space. The seat may stay installed, folded up, but cannot be occupied.`;container.querySelector('.seat-menu').append(note);for(const button of container.querySelectorAll('#addPax,#addCrew'))button.disabled=true;}
    document.getElementById('toggleSeat').onclick=()=>{
      if(seat.alwaysInstalled || state.seats.has(id)&&state.occupants[id])return;
      if(state.seats.has(id))state.seats.delete(id);else {
        const result=rules.install(state,id,all);
        if(!result.ok){document.getElementById('seatEditMessage').textContent=result.reason;return;}
      }
      render();document.getElementById('seatEditMessage').textContent=`${id} ${state.seats.has(id)?'installed':'removed'} at its defined position.`;
      document.getElementById('toggleSeat')?.focus();
    };
    if(!installed&&plan.remove.length) {
      const toggleButton=document.getElementById('toggleSeat');toggleButton.disabled=true;
      const message=document.createElement('p');message.className='seat-conflict-note';
      message.textContent=`This space is occupied by ${plan.remove.join(' and ')}. ${plan.occupied.length?`Clear occupants from ${plan.occupied.join(' and ')} before replacing those seats.`:`Installing ${id} replaces ${plan.remove.join(' and ')}.`}`;
      container.querySelector('.seat-menu').append(message);
      const replace=document.createElement('button');replace.type='button';replace.className='secondary';replace.id='replaceSeat';
      replace.textContent=`Replace ${plan.remove.join(' + ')} with ${id}`;replace.disabled=!!plan.occupied.length;
      replace.onclick=()=>{
        const result=rules.install(state,id,all,{replace:true});
        if(!result.ok){document.getElementById('seatEditMessage').textContent=result.reason;return;}
        render();document.getElementById('seatEditMessage').textContent=`${id} installed; ${result.remove.join(' and ')} removed from the shared seating space.`;
        document.getElementById('toggleSeat')?.focus();
      };
      container.querySelector('.actions').append(replace);
    }
    document.getElementById('clearSeatOccupant')?.addEventListener('click',()=>{
      delete state.occupants[id];render();document.getElementById('seatEditMessage').textContent=`Occupant cleared from ${id}. Equipment allocations are unchanged.`;
    });
    for(const [button,kind] of [['addPax','Passenger'],['addCrew','Crew']])document.getElementById(button)?.addEventListener('click',()=>{
      const result=rules.assignOccupant(state,id,kind);if(!result.ok){document.getElementById('seatEditMessage').textContent=result.reason;return;}render();
      document.getElementById('seatEditMessage').textContent=`${kind} assigned at ${id}. This prototype assignment has no entered weight yet.`;
    });
  }
  function renderLayer() {
    window.CabinFloorArea?.renderTarget();
    window.CabinBasket?.render();
    window.CabinPTA?.render();
    window.CabinStokes?.render();
    window.CabinLive?.render();
    window.CabinRampArea?.render();
    window.CabinFloorEquipment?.render();
    window.CabinCasevac?.render();
    window.CabinCargo?.render();
    layer.replaceChildren();
    if(!getState){layer.hidden=true;return;}
    const mapping=window.CabinBayLayer.getDisplayMapping();
    layer.hidden=!toggle.checked||!available||!mapping;
    if(layer.hidden)return;
    const state=getState();
    const xAt=arm=>mapping.forwardX+(arm-4875)/6518*(mapping.aftX-mapping.forwardX);
    for(const id of [...ordered(Object.keys(data.paxSeats)),...ordered(Object.keys(data.crewSeats))]) {
      if(rules.blockers(state,id).length)continue;
      if(!state.seats.has(id)&&rules.conflicts(state.seats,id).length)continue;
      const seat=all[id],port=/Port/i.test(seat.name),stbd=/Stbd/i.test(seat.name);
      const isCrew=!!data.crewSeats[id],offset=(isCrew?68:118)*mapping.sourceScale;
      const point=id==='C3'?c3Point():null;
      const y=point?.y??mapping.centerY+(port?offset:stbd?-offset:0);
      const button=document.createElement('button');button.type='button';button.className='seat-marker';button.dataset.seatMarker=id;
      button.classList.toggle('installed',state.seats.has(id));
      const restricted=rules.occupancyBlockers(state,id);button.classList.toggle('folded',state.seats.has(id)&&!!restricted.length);
      const conflicts=rules.conflicts(state.seats,id);
      button.setAttribute('aria-label',`${id}, ${seat.name}, ${state.seats.has(id)?'installed':conflicts.length?'space used by '+conflicts.join(' and '):'available position'}`);
      if(restricted.length)button.setAttribute('aria-label',`${id}, ${seat.name}, ${state.seats.has(id)?'installed, folded up':'seat can be installed'}, cannot be occupied while ${restricted.map(item=>item.name).join(' and ')} is installed`);
      button.classList.toggle('space-used',!state.seats.has(id)&&!!conflicts.length);
      button.setAttribute('aria-pressed',String(state.selectedSeat===id));button.textContent=id;
      button.style.left=`${(point?.x??xAt(seat.arm))/mapping.width*100}%`;button.style.top=`${y/mapping.height*100}%`;
      button.onclick=()=>select(id);layer.append(button);
    }
  }
  function render() {
    if(!getState)return;
    const state=getState(),modified=changed(state);
    panel.hidden=!toggle.checked||!available;
    document.getElementById('seatList').innerHTML=list(ordered(Object.keys(data.paxSeats)));
    document.getElementById('crewSeatList').innerHTML=list(ordered(Object.keys(data.crewSeats)));
    for(const button of panel.querySelectorAll('[data-seat]'))button.onclick=()=>select(button.dataset.seat);
    document.getElementById('seatInstalledCount').textContent=`${Object.keys(data.paxSeats).filter(id=>state.seats.has(id)).length} / ${Object.keys(data.paxSeats).length} passenger seats installed`;
    document.getElementById('seatStateLabel').textContent=modified?'Seat setup modified':state.preset?'Seat setup matches selected preset':'Seat setup matches baseline';
    const notice=document.getElementById('seatReferenceNotice');notice.hidden=!modified;
    notice.textContent='Seat setup modified. The plan image shows its reference configuration; seat markers and the position list show your current installation state.';
    renderMenu();renderLayer();
    window.CabinFloorArea?.render();
    window.CabinAircraftSummary?.render();
  }
  toggle.onchange=()=>{if(!toggle.checked)finishLocating();render();};
  let touch=null;
  viewport.addEventListener('pointerdown',event=>{
    suppressLocateClick=false;
    const id=event.target.closest('[data-seat-marker]')?.dataset.seatMarker;
    if(event.pointerType==='touch'&&(id||locating))touch={id,pointer:event.pointerId,x:event.clientX,y:event.clientY,moved:false};
  });
  viewport.addEventListener('pointermove',event=>{if(touch?.pointer===event.pointerId&&Math.hypot(event.clientX-touch.x,event.clientY-touch.y)>=7)touch.moved=true;});
  viewport.addEventListener('pointerup',event=>{if(touch?.pointer===event.pointerId&&!touch.moved){if(locating){locatePoint(event);suppressLocateClick=true;}else if(touch.id)select(touch.id);}touch=null;});
  viewport.addEventListener('pointercancel',()=>{touch=null;});
  window.CabinSeatEditor={select,connect(reader){getState=reader;},render,renderLayer,getC3Point:c3Point,finishLocating,setView(value){finishLocating();available=value;render();}};
})();
