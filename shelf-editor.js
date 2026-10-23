/* Shelf installation is distinct from catalogue membership. No catalogue edits. */
(() => {
 const data=window.CH149_DATA,selection=new Map();
 const text=(tag,value)=>{const el=document.createElement(tag);el.textContent=value;return el;};
 const kg=value=>Number(value).toLocaleString('en-CA',{maximumFractionDigits:3})+' kg';
 function render(location,container){
  const state=window.CabinImageState(),oldOpen=new Set([...container.querySelectorAll('details[open][data-shelf-group]')].map(el=>el.dataset.shelfGroup));
  const installed=itemsAt(location.id),catalogue=Object.entries(data.missionEquip).filter(([key,item])=>item.active!==false&&item.group!=='Stowage'&&!item.isBasket&&!window.CabinStokes.isLitter(key)&&key!==window.CabinFloorEquipment.raftKey),preset=data.presets[state.preset],roleDefaults=new Set(preset?.missionOn||[]),normal=catalogue.filter(([key,item])=>item.stow===location.id&&(!preset||roleDefaults.has(key))),normalKeys=new Set(normal.map(([key])=>key));
  container.replaceChildren();const selected=selection.get(location.id),definition=data.missionEquip[selected],here=installed.some(row=>row.key===selected),onAircraft=state.mission.has(selected);
  const focus=document.createElement('section');focus.className='shelf-item-focus';focus.append(text('strong',definition?.name||'Select an item'));
  focus.append(text('p',definition?`${here?'Installed here':onAircraft?'Installed elsewhere on aircraft':'Not installed'} · ${kg((definition.unitWeight??definition.w??0)*(definition.defaultQuantity??1))}`:'Select an installed item or open Available equipment below. Removing an item keeps it in the catalogue for reinstallation.'));
  const action=document.createElement('button');action.type='button';action.id='shelfPrimaryAction';action.className='primary';action.disabled=!definition;
  action.textContent=here?'Remove from aircraft':onAircraft?'Move here':'Install here';focus.append(action);container.append(focus);
  const status=text('p','');status.id='shelfEditStatus';status.setAttribute('role','status');container.append(status);
  action.onclick=()=>{
   if(!definition)return;
   if(here){removeItem(selected);renderDetail();return;}
   const reason=window.CH149_SEAT_RULES.equipmentConflictMessage(state,selected);if(reason){status.textContent=reason;return;}
   if(onAircraft){moveItem(selected,location.id,{keepView:true});}
   else{state.mission.add(selected);state.moved[selected]={loc:location.id};recalculateItems();renderItems();renderSeats();}
   renderDetail();
  };
  const choose=key=>{selection.set(location.id,key);renderDetail();};
  function group(parent,label,rows,installedGroup){
   const details=document.createElement('details');details.dataset.shelfGroup=label;details.className='shelf-equipment-group';details.open=installedGroup||oldOpen.has(label);
   details.append(text('summary',`${label} (${rows.length})`));
   for(const [key,item]of rows){const b=document.createElement('button');b.type='button';b.className='shelf-equipment-choice';b.dataset.shelfItem=key;b.dataset.search=(item.name+' '+(item.group||'')).toLowerCase();b.setAttribute('aria-pressed',String(selected===key));
    b.append(text('span',item.name),text('small',installed.some(row=>row.key===key)?'Installed here':state.mission.has(key)?'On aircraft · move here':'Available to install'));b.onclick=()=>choose(key);details.append(b);}
   parent.append(details);return details;
  }
  if(normal.length)group(container,(preset?.name||'Default equipment')+' · normally stowed here',normal,true);
  const extras=installed.filter(row=>!normalKeys.has(row.key)),installedSection=document.createElement('section');installedSection.append(text('h3',`Other installed items (${extras.length})`));container.append(installedSection);
  const installedGroups=new Map();for(const row of extras){const source=data.missionEquip[row.key],name=source?.group||'Role Fit';if(!installedGroups.has(name))installedGroups.set(name,[]);installedGroups.get(name).push([row.key,source||row]);}
  for(const [name,rows]of installedGroups)group(installedSection,name,rows,true);
  if(!extras.length)installedSection.append(text('p','No other items installed here.'));
  const available=document.createElement('details');available.className='shelf-available';available.dataset.shelfGroup='available';available.open=oldOpen.has('available');
  const candidates=catalogue.filter(([key])=>!normalKeys.has(key)&&!installed.some(row=>row.key===key));available.append(text('summary',`Other available equipment (${candidates.length})`));
  const search=document.createElement('input');search.type='search';search.placeholder='Find equipment…';search.setAttribute('aria-label','Find available shelf equipment');available.append(search);
  const removed=candidates.filter(([key])=>state.removedFrom?.[key]===location.id);if(removed.length)group(available,'Removed from here',removed,false);
  const groups=new Map();for(const row of candidates){if(removed.includes(row))continue;const name=row[1].group||'Other equipment';if(!groups.has(name))groups.set(name,[]);groups.get(name).push(row);}
  for(const [name,rows]of [...groups].sort(([a],[b])=>a.localeCompare(b)))group(available,name,rows,false);
  search.oninput=()=>{const query=search.value.trim().toLowerCase();for(const details of available.querySelectorAll('details')){let count=0;for(const b of details.querySelectorAll('[data-shelf-item]')){b.hidden=!!query&&!b.dataset.search.includes(query);if(!b.hidden)count++;}details.hidden=!count;details.open=!!query||oldOpen.has(details.dataset.shelfGroup);}};
  container.append(available,text('p','Other catalogue items may require placement review; automatic fit and capacity checks are not yet available.'));
 }
 window.CabinShelfEditor={render,focus(location,key){selection.set(location,key);}};
})();
