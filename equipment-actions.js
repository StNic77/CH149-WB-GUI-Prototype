/* Local prototype allocations. Source calculation functions consume these same rows. */
(() => {
 const data=window.CH149_DATA,copy=x=>structuredClone(x);
 const cabinet='RF_SAR_EQUIPMENT_FWD_SAR_CABINET';
 let last=null;
 function rows(s,key){
  if(!s.mission.has(key))return [];
  if(s.equipmentAllocations?.[key])return copy(s.equipmentAllocations[key]);
  const item=data.missionEquip[key];if(!item)return [];
  return (item.defaultAllocations?.length?item.defaultAllocations:[{quantity:item.defaultQuantity??1,stow:item.stow,customArm:item.customArm}]).map((r,i)=>({id:'base'+i,...r,...(s.moved?.[key]?.loc?{stow:s.moved[key].loc}:{})}));
 }
 const quantity=(s,key)=>rows(s,key).reduce((n,r)=>n+r.quantity,0);
 function locations(){
  const out={...data.stowage};
  for(const b of window.CH149_BAY_DATA.bays)out[b.id]={name:b.name,arm:b.arm,group:'Cabin Bays'};
  for(const [key,it]of Object.entries(data.roleFit))if(it.isStowage)out['ROLEFIT:'+key]={name:'In '+it.name,arm:it.arm,roleFitKey:key};
  for(const [key,it]of Object.entries(data.missionEquip))if(it.isBasket)out['CARRIER:'+key]={name:'In '+it.name,missionKey:key};
  return out;
 }
 function reason(s,id){
  const loc=locations()[id];if(!loc)return 'Location has no defined accounting arm.';
  if(loc.group==='SAR Cabinet'&&!s.roleFit.has(cabinet))return 'Install the SAR Cabinet first.';
  if(loc.roleFitKey&&!s.roleFit.has(loc.roleFitKey))return 'Install '+(data.roleFit[loc.roleFitKey]?.name||loc.roleFitKey)+' first.';
  if(id==='PTA_COT_AREA'&&!s.roleFit.has('RF_SAR_EQUIPMENT_CSH_PATIENT_TREATMENT_SYSTEM'))return 'Install the PTA cot first.';
  if(loc.missionKey&&!s.mission.has(loc.missionKey))return 'Install the carrying basket first.';
  const marker=Object.entries(data.missionEquip).find(([,it])=>it.group==='Stowage'&&it.stow===id)?.[0];
  if(marker&&(data.presets[s.preset]?.missionOff||[]).includes(marker))return 'This stowage is unavailable in the selected Role Config.';
  return '';
 }
 function destinationReason(s,key,id){
  const it=data.missionEquip[key],base=reason(s,id);if(base)return base;
  if(it?.isBasket){const side=key.endsWith('_PORT')?'PORT':'STBD',target=id==='CABIN_PORT_STOW'?'PORT':id==='CABIN_STBD_STOW'?'STBD':null;if(!target)return 'Choose basket stowage.';const other='ME_SAR_MISSION_EQUIP_RESCUE_BASKET_'+target;if(target!==side&&s.mission.has(other))return 'Another basket is here.';return window.CH149_SEAT_RULES.equipmentConflictMessage(s,other);}
  if(window.CabinStokes?.isLitter(key)){if(!['CABIN_DEPLOYED','RAMP_STOW'].includes(id))return 'Choose a Stokes position.';if(s.patients.STOKES_CABIN&&key.endsWith('_CABIN'))return 'Remove the patient before moving the litter.';const target='ME_SAR_MISSION_EQUIP_STOKES_LITTER_'+(id==='RAMP_STOW'?'RAMP':'CABIN');if(target!==key&&s.mission.has(target))return 'Another Stokes litter is here.';}
  if(key===window.CabinFloorEquipment?.raftKey&&!window.CabinFloorEquipment.locations.includes(id))return 'Choose a defined life raft fitting.';
  return '';
 }
 function set(s,key,value){
  s.equipmentAllocations??={};s.equipmentAllocations[key]=value.filter(r=>r.quantity>0);
  if(s.equipmentAllocations[key].length)s.mission.add(key);else s.mission.delete(key);
  if(!s.mission.has(key)&&(data.missionEquip[key]?.isBasket||window.CabinStokes?.isLitter(key)||key===window.CabinFloorEquipment?.raftKey))delete s.equipmentAllocations[key];
  delete s.moved[key];
 }
 function subtract(value,id,count){let left=count;for(const r of value)if(r.id===id||id==='*'){const q=Math.min(left,r.quantity);r.quantity-=q;left-=q;}return left;}
 function edit(s,action,selected,dest){
  const draft=copy(s);
  for(const pick of selected){
   const item=data.missionEquip[pick.key],count=Number(pick.quantity);if(!item||!Number.isInteger(count)||count<1)return {ok:false,reason:'Choose whole quantities of one or more.'};
   if(item.isBasket||window.CabinStokes?.isLitter(pick.key)||pick.key===window.CabinFloorEquipment?.raftKey)return {ok:false,reason:'Use this equipment’s dedicated controls for its placement and patient rules.'};
   if(action!=='remove'){const error=destinationReason(draft,pick.key,dest);if(error)return {ok:false,reason:error};}
   const value=rows(draft,pick.key),total=value.reduce((n,r)=>n+r.quantity,0);
   if(action==='install'&&item.maxQuantity!=null&&total+count>item.maxQuantity)return {ok:false,reason:item.name+': exceeds the configured maximum quantity.'};
   if(action!=='install'&&subtract(value,pick.id||'*',count))return {ok:false,reason:item.name+': selected quantity is no longer available.'};
   if(action!=='remove'){let target=value.find(r=>r.stow===dest);if(!target){target={id:'a'+(draft.nextAllocationId=(draft.nextAllocationId||0)+1),stow:dest,quantity:0};value.push(target);}target.quantity+=count;}
   set(draft,pick.key,value);
   if(action==='remove'){draft.removedFrom??={};draft.removedFrom[pick.key]=pick.location||rows(s,pick.key).find(r=>r.id===pick.id)?.stow;}
  }
  Object.assign(s,{mission:draft.mission,equipmentAllocations:draft.equipmentAllocations,moved:draft.moved,removedFrom:draft.removedFrom,nextAllocationId:draft.nextAllocationId});return {ok:true};
 }
 const fields=['mission','roleFit','seats','occupants','patients','moved','equipmentAllocations','stowageLoads','removedFrom','nextAllocationId'];
 function snapshot(s){return Object.fromEntries(fields.map(k=>[k,copy(s[k])]));}
 function signature(s){return JSON.stringify(snapshot(s),(_,v)=>v instanceof Set?[...v].sort():v);}
 function perform(s,action,label){const before=snapshot(s),result=action();if(result?.ok===false)return result;last={before,after:signature(s),label};return result||{ok:true};}
 function canUndo(s){return !!last&&last.after===signature(s);}
 function undo(s){if(!canUndo(s))return {ok:false,reason:'The aircraft changed after this action; Undo is no longer available.'};Object.assign(s,copy(last.before));last=null;return {ok:true};}
 function removeRole(s,key){
  const affected=window.CabinPlanning.missionRows(s).filter(r=>r.quantity>0&&(locations()[r.stowId]?.roleFitKey===key||key===cabinet&&locations()[r.stowId]?.group==='SAR Cabinet'||r.stowId==='ROLEFIT:'+key));
  if(Object.entries(data.patientPositions||{}).some(([id,p])=>s.patients[id]&&(p.roleFitKey===key||affected.some(r=>r.key===p.missionKey))))return {ok:false,reason:'Remove the patient before removing this support and its contents.'};
  for(const row of affected){if(data.missionEquip[row.key]?.isBasket){window.CabinBasket.remove(s,row.key);continue;}const value=rows(s,row.key);subtract(value,row.allocationId,row.quantity);set(s,row.key,value);}
  for(const [id]of Object.entries(s.stowageLoads||{}))if(locations()[id]?.roleFitKey===key||key===cabinet&&locations()[id]?.group==='SAR Cabinet')delete s.stowageLoads[id];
  s.roleFit.delete(key);return {ok:true};
 }
 function refresh(){recalculateItems();renderItems();renderTargets();renderSeats();renderDetail();window.CabinEquipmentUI?.updateUndo();}
 window.CabinEquipment={rows,quantity,locations,reason,destinationReason,edit,perform,canUndo,undo,removeRole,refresh,snapshot,signature,record(s,before){last={before,after:signature(s)};},clearUndo(){last=null;}};
})();
