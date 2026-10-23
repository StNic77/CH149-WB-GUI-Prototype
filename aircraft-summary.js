/* Live read-only aircraft summary, with links into the existing image editors.
   Role-fit grouping follows Active Dev/accounting-ui.js; no calculation engine. */
(() => {
 const data=window.CH149_DATA,side=document.querySelector('#cabinMain>.side'),legacy=document.createElement('div');legacy.hidden=true;
 while(side.firstChild)legacy.append(side.firstChild);side.append(legacy);
 const heading=document.createElement('div');heading.className='side-head';heading.innerHTML='<h2>Aircraft summary</h2><p id="aircraftSummaryRole" class="sub"></p>';side.append(heading);
 const root=document.createElement('div');root.id='aircraftSummary';root.className='scroll aircraft-summary';side.append(root);
 const text=(tag,value)=>{const node=document.createElement(tag);node.textContent=value;return node;};
 const weight=w=>Number(w).toLocaleString('en-CA',{maximumFractionDigits:2})+' kg';
 const groupPrefixes=[['RF_AIRCRAFT_SYSTEMS_','Aircraft Systems'],['RF_ICE_PROTECTION_','Ice Protection'],['RF_SAR_EQUIPMENT_','SAR Equipment'],['RF_SENSOR_SYSTEMS_','Sensor Systems'],['RF_SERVICING_EQUIPMENT_','Servicing Equipment'],['RF_STOW_','Stowage Fittings']];
 function standard(current){const p=data.presets[current.preset],s={preset:current.preset,mission:new Set(),roleFit:new Set(),moved:{},seats:new Set(),occupants:{},patients:{}};
  if(p){for(const k of p.missionOn||[])if(data.missionEquip[k]&&data.missionEquip[k].group!=='Stowage')s.mission.add(k);for(const k of p.roleFitOn||[])if(data.roleFit[k])s.roleFit.add(k);for(const id of [...(p.seats?.crew||[]),...(p.seats?.pax||[])])s.seats.add(id);for(const id of p.occupants||[])s.occupants[id]=p.occupantRoles?.[id]||'OCCUPIED';}
  else for(const [id,seat]of Object.entries({...data.crewSeats,...data.paxSeats}))if(seat.alwaysInstalled||seat.normallyInstalled)s.seats.add(id);
  for(const id of ['C1','C2','P2','P3'])s.seats.add(id);window.CabinPresetRules.apply(current.preset,s);return s;
 }
 function location(s,key){return window.CabinBasket.resolvedLocation(s,key)?.id||s.moved?.[key]?.loc||data.missionEquip[key]?.stow||'';}
 function difference(on,expected,key){return on.has(key)?expected.has(key)?'Standard':'Added':'Removed from standard';}
 function imageTarget(selector){document.getElementById('planViewport').scrollIntoView({block:'nearest'});window.CabinImageMenu.anchorAtElement(document.querySelector(selector));}
 function openSeat(id){if(window.CabinImageState().view!=='plan')setView('plan');imageTarget(`[data-live-object="seat-${id}"],[data-seat-marker="${id}"]`);window.CabinSeatEditor.select(id);}
 function missionAction(key,s){const item=data.missionEquip[key];if(!item)return null;
  if(item.isBasket)return ()=>{if(window.CabinImageState().view!=='plan')setView('plan');imageTarget('[data-live-object="basket"]');window.CabinBasket.open(key.endsWith('_PORT')?'PORT':'STBD');};
  if(window.CabinStokes.isLitter(key))return ()=>{if(window.CabinImageState().view!=='plan')setView('plan');imageTarget('[data-live-object^="stokes"]');window.CabinStokes.open(key.endsWith('_RAMP')?'RAMP':'CABIN');};
  if(key===window.CabinFloorEquipment.raftKey)return ()=>{setView('plan');imageTarget('[data-live-object="life-raft"]');window.CabinFloorEquipment.openRaft(location(s,key));};
  const id=location(s,key),place=LOC.find(l=>l.id===id);if(!place||!['cabinet','shelf','storage'].includes(place.type))return null;
  return ()=>{setView(place.view);window.CabinImageState().selectedLoc=id;window.CabinShelfEditor.focus(id,key);renderDetail();imageTarget('#cabinImage');window.CabinImageMenu.showDetail(id);};
 }
 function roleAction(key){if(key==='RF_SAR_EQUIPMENT_FWD_SAR_CABINET')return ()=>{const s=window.CabinImageState();if(s.roleFit.has(key)){setView('cabinet');document.getElementById('planViewport').scrollIntoView({block:'nearest'});}else{setView('plan');imageTarget('[data-floor-space="BAY1_STBD"]');window.CabinFloorArea.openById('BAY1_STBD');}};
  if(key==='RF_SAR_EQUIPMENT_CSH_PATIENT_TREATMENT_SYSTEM')return ()=>{setView('plan');imageTarget('[data-live-object="pta"]');window.CabinPTA.open();};
  if(key===window.CabinFloorEquipment.trayKey)return ()=>{setView('plan');imageTarget('[data-live-object="sea-tray"]');window.CabinFloorEquipment.openTray();};
  const rack=window.CabinCasevac.positions.find(id=>window.CabinCasevac.key(id)===key);if(rack)return ()=>{setView('plan');imageTarget(`[data-live-object="rack-${rack}"]`);window.CabinCasevac.open(rack);};
  const raft=window.CabinFloorEquipment.locations.find(id=>data.stowage[id].roleFitKey===key);if(raft)return ()=>{setView('plan');imageTarget('[data-live-object="life-raft"]');window.CabinFloorEquipment.openRaft(raft);};return null;
 }
 function render(){const s=window.CabinImageState(),base=standard(s),opened=new Set([...root.querySelectorAll('details[open]')].map(node=>node.dataset.summaryId)),scroll=root.scrollTop;
  root.replaceChildren();document.getElementById('aircraftSummaryRole').textContent=data.presets[s.preset]?.name||'No Role Config';
  function section(parent,id,title,summary){const node=document.createElement('details');node.dataset.summaryId=id;node.open=opened.has(id);const label=document.createElement('summary');label.append(text('strong',title),text('small',summary));node.append(label);parent.append(node);return node;}
  function row(parent,name,status,action,id){const node=document.createElement(action?'button':'div');if(action){node.type='button';node.onclick=action;}node.className='summary-row';if(id)node.dataset.summaryItem=id;node.append(text('span',name),text('small',status));parent.append(node);return node;}
  const accepted=section(root,'acceptance','Acceptance Info','Awaiting accepted aircraft data');accepted.append(text('p','Aircraft identity, accepted basic weight and CG are not connected in this prototype.'));
  const roleKeys=[...new Set([...base.roleFit,...s.roleFit])],fitChanges=roleKeys.filter(k=>s.roleFit.has(k)!==base.roleFit.has(k));
  const role=section(root,'role','Role Selected',`${data.presets[s.preset]?.name||'No Role Config'} · ${s.roleFit.size} fitted · ${fitChanges.length} edits`);role.append(text('p','Compared with the selected Role Config standard.'));
  const fits=new Map();for(const key of roleKeys){const item=data.roleFit[key];if(!item)continue;const group=item.group||groupPrefixes.find(([prefix])=>key.startsWith(prefix))?.[1]||'Other Equipment';if(!fits.has(group))fits.set(group,[]);fits.get(group).push(key);}
  for(const [name,keys]of fits){const changed=keys.filter(k=>s.roleFit.has(k)!==base.roleFit.has(k)).length,group=section(role,'role-'+name,name,`${keys.filter(k=>s.roleFit.has(k)).length} fitted${changed?' · '+changed+' edits':''}`);for(const key of keys.sort((a,b)=>data.roleFit[a].name.localeCompare(data.roleFit[b].name)))row(group,data.roleFit[key].name,difference(s.roleFit,base.roleFit,key),roleAction(key),key);}
  const missionKeys=[...new Set([...base.mission,...s.mission])].filter(k=>data.missionEquip[k]),missionChanges=missionKeys.filter(k=>s.mission.has(k)!==base.mission.has(k)||(s.mission.has(k)&&base.mission.has(k)&&location(s,k)!==location(base,k)));
  const mission=section(root,'mission','Mission Equipment',`${s.mission.size} installed · ${missionChanges.length} edits`),groups=new Map();
  const issue=window.CabinFloorEquipment.raftIssue(s);if(issue)mission.append(text('p',issue));
  for(const key of missionKeys){const name=data.missionEquip[key].group||'Other equipment';if(!groups.has(name))groups.set(name,[]);groups.get(name).push(key);}
  for(const [name,keys]of [...groups].sort(([a],[b])=>a.localeCompare(b))){const changed=keys.filter(k=>missionChanges.includes(k)).length,group=section(mission,'mission-'+name,name,`${keys.filter(k=>s.mission.has(k)).length} installed${changed?' · '+changed+' edits':''}`);for(const key of keys.sort((a,b)=>data.missionEquip[a].name.localeCompare(data.missionEquip[b].name))){const status=difference(s.mission,base.mission,key),moved=status==='Standard'&&location(s,key)!==location(base,key),id=location(s.mission.has(key)?s:base,key),place=data.stowage[id]?.name||id||'Location required';row(group,data.missionEquip[key].name,`${moved?'Moved from standard':status} · ${place}`,missionAction(key,s.mission.has(key)?s:base),key);}}
  const occupants=Object.entries(s.occupants).filter(([,value])=>!!value),patients=Object.keys(s.patients).filter(k=>s.patients[k]),crew=occupants.filter(([id,kind])=>kind==='Crew'||id.startsWith('C')&&kind!=='Passenger'),pax=occupants.filter(pair=>!crew.includes(pair)),seatChanges=[...new Set([...s.seats,...base.seats])].filter(id=>s.seats.has(id)!==base.seats.has(id));
  const people=section(root,'people','Crew, Pax, Patients & Seating',`${crew.length} crew · ${pax.length} pax · ${patients.length} patients · ${s.seats.size} seats`);
  for(const [label,list]of [['Crew',crew],['Passengers',pax]]){const group=section(people,'people-'+label,label,`${list.length} assigned`);for(const [id,kind]of list)row(group,id+' · '+kind,'Open occupant / seat controls',()=>openSeat(id));if(!list.length)group.append(text('p','None assigned.'));}
  const patientGroup=section(people,'patients','Patients',`${patients.length} carried`);
  if(s.roleFit.has('RF_SAR_EQUIPMENT_CSH_PATIENT_TREATMENT_SYSTEM'))row(patientGroup,'PTA cot',s.patients.PTA?'Patient present':'Empty',()=>{setView('plan');imageTarget('[data-live-object="pta"]');window.CabinPTA.open();});
  if(s.mission.has('ME_SAR_MISSION_EQUIP_STOKES_LITTER_CABIN'))row(patientGroup,'Stokes litter',s.patients.STOKES_CABIN?'Patient present':'Empty',()=>{setView('plan');imageTarget('[data-live-object^="stokes"]');window.CabinStokes.open('CABIN');});
  for(const rack of window.CabinCasevac.positions)if(s.roleFit.has(window.CabinCasevac.key(rack)))row(patientGroup,'CASEVAC '+rack.replace('_',' '),`${window.CabinCasevac.patientIds(rack).filter(id=>s.patients[id]).length} patients`,roleAction(window.CabinCasevac.key(rack)));
  const seating=section(people,'seating','Seating',`${s.seats.size} installed · ${seatChanges.length} installation edits`);
  for(const [id,seat]of Object.entries({...data.crewSeats,...data.paxSeats})){const blockers=window.CH149_SEAT_RULES.blockers(s,id),status=s.seats.has(id)?window.CH149_SEAT_RULES.occupancyBlockers(s,id).length?'Installed · folded':'Installed':blockers.length?'Unavailable: '+blockers.map(x=>x.name).join(', '):'Not installed';row(seating,id+' · '+seat.name.replace(new RegExp('^'+id+'\\s*'),''),status+(seatChanges.includes(id)?' · changed from standard':''),blockers.length?null:()=>openSeat(id));}
  const fuel=section(root,'fuel','Fuel','Not entered');fuel.append(text('p','Fuel quantities and the fuel editor are not connected yet.'));
  for(const label of ['Bay 1 · Tank 4 · transfer','Bay 2 · Tank 3 · main','Bay 3 · Tank 2 · main / APU','Bay 4 · Tank 5 · transfer','Bay 6 · Tank 1 · main'])fuel.append(text('p',label));
  const loads=(s.floorLoads||[]).filter(x=>x.installed!==false),total=window.CabinCargo.totals(s),planning=section(root,'planning','Load Planning',`${loads.filter(x=>x.kind==='individual').length} cargo · ${loads.filter(x=>x.kind==='bay').length} bay weights${loads.length?' · '+weight(total.w):''}`);
  for(const load of loads)row(planning,load.name,`${load.kind==='bay'?'Bay weight':'Cargo'} · ${weight(load.weight)} · ${load.arm} mm`,()=>{setView('plan');imageTarget(`[data-cargo-id="${load.id}"]`);window.CabinCargo.open(load.id);});
  if(!loads.length)planning.append(text('p','No cargo or bay weights entered. Select a floor cell or the ramp to add a load.'));else planning.append(text('p',`Cargo/bay subtotal: ${weight(total.w)}. Aircraft, equipment, people and fuel are not included.`));
  const ramp=window.CabinRampLimits.assess(s),rampRow=row(planning,'Ramp loading',`${weight(ramp.weight)} · ${ramp.moment.toFixed(1)} kg·m${ramp.warnings.length?' · '+ramp.warnings.join(' '):' · Within current checks'}`,()=>{setView('plan');imageTarget('#rampAreaTarget');window.CabinRampArea.open();});rampRow.dataset.rampSummary='true';
  if(ramp.warnings.length)planning.querySelector('summary small').textContent+=' · Ramp warning';
  root.scrollTop=scroll;
 }
 window.CabinAircraftSummary={render,standard};render();
})();
