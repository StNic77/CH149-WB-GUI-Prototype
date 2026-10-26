/* Pinned Active Dev function bodies. Startup normalization is omitted; all state is private. */
window.CabinPlanningReferenceFactory=function(AC,STORE){
function missionLocations(data=AC){
  const bays=Object.fromEntries(Object.entries(data.bayArms||{}).map(([id,arm])=>[id,{name:id==='BAY55'?'Bay 5.5':id==='REAR'?'Rear Area (Ramp Area)':id.replace('BAY','Bay '),arm,group:'Cabin Bays'}]));
  const carriers={};
  for(const [key,it] of Object.entries(data.roleFit||{}))if(it.isStowage)carriers['ROLEFIT:'+key]={name:'In '+it.name,arm:it.arm,group:'Equipment',roleFitKey:key};
  for(const [key,it] of Object.entries(data.missionEquip||{}))if(it.isBasket)carriers['CARRIER:'+key]={name:'In '+it.name,arm:null,group:'Equipment',missionKey:key};
  const groups=new Map();
  for(const [id,loc] of Object.entries({...data.stowage,...bays,...carriers})){
    const group=loc.group||'Other';
    if(!groups.has(group))groups.set(group,[]);
    groups.get(group).push([id,loc]);
  }
  return Object.fromEntries([...groups.values()].flat());
}

// Compatibility defaults for configurations saved before capacities were editable.
const LEGACY_STOWAGE_LIMITS = Object.freeze({
  SAR_CABINET_FWD_TOP:22, SAR_CABINET_FWD_BTM:60, SAR_CABINET_UPPER:35,
  SAR_CABINET_TOP:63, LOCKBOX_TOP:18.5, LOCKBOX_BTM:18.5,
  SAR_CABINET_MIDDLE:100, SAR_CABINET_BOTTOM:125,
  PORT_FWD_SHELF_TOP:22, PORT_FWD_SHELF_MID:22, PORT_FWD_SHELF_BOT:22,
  RAMP_PORT_FWD:44, RAMP_PORT_AFT:22, RAMP_STBD_FWD:44, RAMP_STBD_AFT:22,
  OVERHEAD_PORT:7.5, OVERHEAD_STBD:20
});
function stowageLimits(data=AC){
  const limits={};
  for(const [id,loc] of Object.entries(data.stowage||{})){
    const max=Object.prototype.hasOwnProperty.call(loc,'maxKg')?loc.maxKg:LEGACY_STOWAGE_LIMITS[id];
    if(Number.isFinite(max)&&max>=0)limits[id]=max;
  }
  return limits;
}
function stowageMarker(id,data=AC){
  return Object.entries(data.missionEquip||{}).find(([,item])=>item.group==='Stowage'&&item.stow===id)?.[0];
}
function stowageIncludedInRole(key,preset){
  if((preset?.missionOff||[]).includes(key))return false;
  // Preserve availability for older roles that have no explicit location choice.
  return true;
}
function stowageAvailable(s,id){
  const loc=missionLocations()[id];
  if(!loc)return false;
  if(loc.roleFitKey&&!roleFitIsInstalled(s,loc.roleFitKey))return false;
  if(loc.group==='SAR Cabinet'&&!roleFitIsInstalled(s,'RF_SAR_EQUIPMENT_FWD_SAR_CABINET'))return false;
  const marker=stowageMarker(id);
  return !marker||(s.mission?.[marker]??stowageIncludedInRole(marker,AC.presets[s.preset]));
}

// Role defaults are copied into sortie allocations only when loading the full
// configuration. Reading a location must never relocate an existing load.
function missionDefaultAllocation(key){
  const it=AC.missionEquip[key];
  return {id:'base',quantity:it.defaultQuantity??1,stow:it.stow,customArm:it.customArm??null,basketRef:null};
}
function missionDefaultAllocations(key){
  const it=AC.missionEquip[key];
  if(!Array.isArray(it.defaultAllocations)||!it.defaultAllocations.length)return [missionDefaultAllocation(key)];
  return it.defaultAllocations.map((allocation,index)=>({id:'base'+index,quantity:allocation.quantity,stow:allocation.stow,customArm:allocation.customArm??null,basketRef:null}));
}
function missionAllocations(s,key){
  const rows=s.missionLoads?.[key];
  return rows===undefined?missionDefaultAllocations(key):rows;
}
function editMissionAllocations(s,key){
  s.missionLoads??={};
  return s.missionLoads[key]??=(missionAllocations(s,key).map(x=>({...x})));
}
function missionBaskets(s){
  return Object.entries(AC.missionEquip).filter(([key,it])=>s.mission?.[key]&&it.isBasket&&it.active!==false)
    .flatMap(([key,it])=>missionAllocations(s,key).filter(r=>r.quantity>0).map(r=>({key,id:r.id,label:it.name+' · '+(missionLocations()[r.stow]?.name||r.stow)})));
}
function missionDefaultBasket(s,baskets=missionBaskets(s)){
  const preset=AC.presets?.[s.preset];
  const excluded=preset?.missionOff||[];
  const defaults=(preset?.missionOn||[]).filter(key=>!excluded.includes(key)&&AC.missionEquip[key]?.isBasket&&s.mission?.[key]);
  if(defaults.length!==1)return null;
  const matches=baskets.filter(b=>b.key===defaults[0]);
  return matches.length===1?matches[0]:null;
}
function resolveMissionLocation(s,row,seen=new Set()){
  if(row.stow==='CREW_SEAT'){
    const crewId=row.crewId,seat=Object.entries(s.occupants||{}).find(([,person])=>person?.crewId===crewId)?.[0]||row.crewSeat;
    const loc=seat&&(AC.crewSeats[seat]||AC.paxSeats[seat]);
    if(!loc)return {arm:null,stowId:'CREW_SEAT',stow:'Crew member seat',error:'associated crew seat is unavailable; choose another stowage location'};
    const arm=loc.occupantArm??loc.arm;
    return {arm,stowId:'CREW_SEAT:'+seat,stow:'With crew member · '+seat+' · '+loc.name,stowGroup:'Crew Seat',error:Number.isFinite(arm)?null:'crew seat arm is unavailable'};
  }
  if(row.stow?.startsWith('CARRIER:')){
    const key=row.stow.slice(8),it=AC.missionEquip[key];
    if(!it?.isBasket||!s.mission?.[key])return {arm:null,stow:'Unavailable carrying item',error:'carrying item is unavailable; choose another stowage location'};
    const rows=missionAllocations(s,key).filter(r=>r.quantity>0);
    if(rows.length!==1)return {arm:null,stow:'Select carrying item location',error:'carrying item has multiple locations; select a specific carrying item'};
    return resolveMissionLocation(s,{stow:'BASKET',basketRef:{key,id:rows[0].id}},seen);
  }
  if(row.stow==='BASKET'){
    const baskets=missionBaskets(s), link=row.basketRef;
    const basket=link?baskets.find(b=>b.key===link.key&&b.id===link.id):baskets.length===1?baskets[0]:missionDefaultBasket(s,baskets);
    if(!basket)return {arm:null,stowId:'BASKET',stow:'Select carrying basket or location',error:'select the carrying basket or a separate stowage location'};
    const token=basket.key+':'+basket.id;
    if(seen.has(token))return {arm:null,stow:'Invalid basket link',error:'basket location cycle'};
    seen.add(token);
    const target=missionAllocations(s,basket.key).find(r=>r.id===basket.id);
    const loc=resolveMissionLocation(s,target,seen);
    return {...loc,stow:'In '+AC.missionEquip[basket.key].name+' · '+loc.stow};
  }
  if(row.stow==='CUSTOM')return {arm:Number.isFinite(row.customArm)?row.customArm:null,stowId:'CUSTOM',stow:'Custom ('+row.customArm+' mm)',error:Number.isFinite(row.customArm)?null:'enter a custom arm'};
  const loc=missionLocations()[row.stow];
  if(!loc)return {arm:null,stowId:row.stow,stow:'Missing location',error:'select a valid location'};
  if(!stowageAvailable(s,row.stow))return {arm:null,stowId:row.stow,stow:loc.name,error:'stowage location is unavailable; enable it in Available Stowage Locations or choose another location'};
  if(loc.roleFitKey&&!roleFitIsInstalled(s,loc.roleFitKey))return {arm:null,stow:loc.name,error:'carrying item is not fitted; choose another stowage location'};
  const unavailable=loc.group==='SAR Cabinet'&&!roleFitIsInstalled(s,'RF_SAR_EQUIPMENT_FWD_SAR_CABINET');
  return {arm:loc.arm,stowId:row.stow,stow:loc.name,stowGroup:loc.group,error:unavailable?'cabinet is unavailable; select another location':null};
}
function missionRows(s){
  const rows=[];
  for(const [key,on] of Object.entries(s.mission||{})){
    if(!on)continue;const it=AC.missionEquip[key];
    if(!it||it.group==='Stowage')continue;
    for(const row of missionAllocations(s,key)){
      const loc=resolveMissionLocation(s,row),quantity=row.quantity,unitWeight=it.unitWeight;
      rows.push({...it,...loc,key,allocationId:row.id,quantity,unitWeight,w:unitWeight*quantity,m:quantity===0?0:loc.arm==null?NaN:unitWeight*quantity*loc.arm});
    }
  }
  return rows;
}

/* Explicit sortie declarations relative to the accepted aircraft weight/moment.
   Boolean roleFit remains a derived physical-fit view for existing consumers. */
const ROLE_FIT_DECLARATIONS = Object.freeze(['NEUTRAL','ADD','REMOVE','ACCOUNTED','EXCLUDED']);
const ROLE_FIT_LABELS = Object.freeze({NEUTRAL:'Needs review',ADD:'Fitted · Add item weight to aircraft total',REMOVE:'Not fitted · Adjust current weight as required',ACCOUNTED:'Fitted · No weight adjustment',EXCLUDED:'Not fitted · Adjust current weight as required',CUSTOM:'Custom Exception'});
const ROLE_FIT_ALIASES = Object.freeze({
  RF_CASEVAC_STRETCHER_RACK_4:'RF_SAR_EQUIPMENT_CASEVAC_RACK_SYSTEM',
  RF_SECONDARY_HOIST:'RF_AIRCRAFT_SYSTEMS_SECONDARY_HOIST', RF_TRAKKA:'RF_SENSOR_SYSTEMS_TRAKKA_SRCHLT',
  RF_SEA_TRAY:'RF_AIRCRAFT_SYSTEMS_SEA_TRAY', RF_DIVE_O2_RACK:'RF_SAR_EQUIPMENT_DIVE_O2_BOTTLE_RACK',
  RF_AIR_COOLING:'RF_AIRCRAFT_SYSTEMS_AIR_COOLING_PACK', RF_FLOAT_SYS:'RF_AIRCRAFT_SYSTEMS_FLOATATION_SYSTEM',
  RF_LIFERAFT_SPONSONS:'RF_AIRCRAFT_SYSTEMS_SPONSON_LIFERAFTS', RF_LASHING_KIT:'RF_SERVICING_EQUIPMENT_LASHING_KIT',
  RF_RIPU:'RF_ICE_PROTECTION_RIPU', RF_RIPU_CABLES:'RF_ICE_PROTECTION_RIPU_CABLES',
  RF_MR_SLIP:'RF_ICE_PROTECTION_MR_SLIP_RING', RF_TR_SLIP:'RF_ICE_PROTECTION_TR_SLIP_RING',
  RF_ICE_PROTECTIO_MR_SLIP_RING:'RF_ICE_PROTECTION_MR_SLIP_RING',
  RF_FIELD_TOOLKIT:'RF_SERVICING_EQUIPMENT_FIELD_TOOL_KIT', RF_SERVICING_FIELD_TOOL_KIT:'RF_SERVICING_EQUIPMENT_FIELD_TOOL_KIT',
  RF_CODE_A_EQUIPMENT:'RF_SERVICING_EQUIPMENT_CODE_A_EQUIP', RF_EOIR_MX15:'RF_SENSOR_SYSTEMS_EOIR_TURRET',
  RF_SENSOR_WS:'RF_SENSOR_SYSTEMS_SENSOR_WORKSTATION', RF_PTA_COT:'RF_SAR_EQUIPMENT_CSH_PATIENT_TREATMENT_SYSTEM',
  RF_SAR_CABINET:'RF_SAR_EQUIPMENT_FWD_SAR_CABINET', RF_EOIR_HANDCTRL:'RF_SENSOR_SYSTEMS_EOIR_HAND_CONTROLLER'
});
function canonicalRoleFitKey(key){ return ROLE_FIT_ALIASES[key] || key; }
const CASEVAC_RACK_KEYS=Object.freeze(['FWD_PORT','FWD_STBD','AFT_PORT','AFT_STBD'].map(position=>'RF_SAR_EQUIPMENT_CASEVAC_RACK_'+position));
const LEGACY_CASEVAC_RACK_KEYS=Object.freeze(['RF_SAR_EQUIPMENT_CASEVAC_RACK_SYSTEM','RF_CASEVAC_STRETCHER_RACK_4']);
function expandedRoleFitKeys(key){return LEGACY_CASEVAC_RACK_KEYS.includes(key)?[...CASEVAC_RACK_KEYS]:[canonicalRoleFitKey(key)];}
function normalizeAccountingConfiguration(){
  const legacy=LEGACY_CASEVAC_RACK_KEYS.map(key=>AC.roleFit[key]).find(Boolean);
  if(legacy){
    for(const key of CASEVAC_RACK_KEYS)if(!AC.roleFit[key]&&AC_ROLE_FIT[key])AC.roleFit[key]={...AC_ROLE_FIT[key],w:legacy.w/4,normally:!!legacy.normally,maintenanceIncluded:!!legacy.maintenanceIncluded};
  }
  for(const key of LEGACY_CASEVAC_RACK_KEYS)delete AC.roleFit[key];
  for(const preset of Object.values(AC.presets))for(const field of ['roleFitOn','roleFitOff'])preset[field]=[...new Set((preset[field]||[]).flatMap(expandedRoleFitKeys))].filter(key=>!!AC.roleFit[key]);
}
function normalizeRackSessionKey(s){
  for(const map of [s.roleFit,s.roleFitDeclarations,s.roleFitDeclarationOrigins,s.accepted?.maintenanceBaseline?.roleFit]){
    for(const oldKey of LEGACY_CASEVAC_RACK_KEYS){
      if(!map||!Object.hasOwn(map,oldKey))continue;
      for(const key of CASEVAC_RACK_KEYS)if(!Object.hasOwn(map,key))map[key]=map[oldKey];
      delete map[oldKey];
    }
  }
  if(Array.isArray(s.accepted?.maintenanceExceptions))s.accepted.maintenanceExceptions=[...new Set(s.accepted.maintenanceExceptions.flatMap(expandedRoleFitKeys))];
  for(const item of s.customExceptions||[]){
    if(LEGACY_CASEVAC_RACK_KEYS.includes(item.roleFitKey)||['casevac stretcher rack (4 off)','casevac stretcher rack system'].includes(String(item.description||'').trim().toLowerCase())){
      // Preserve the recorded custom mass and arm as one adjustment, linked to all four installations.
      item.roleFitKeys=[...CASEVAC_RACK_KEYS];delete item.roleFitKey;
      for(const key of CASEVAC_RACK_KEYS){s.roleFitDeclarations??={};s.roleFitDeclarationOrigins??={};s.roleFitDeclarations[key]='NEUTRAL';s.roleFitDeclarationOrigins[key]='manual';}
    }
  }
  pruneStaleRoleFitReferences(s);
}
function pruneStaleRoleFitReferences(s){
  let changed=false;
  for(const map of [s.roleFit,s.roleFitDeclarations,s.roleFitDeclarationOrigins]){
    for(const key of Object.keys(map||{})) if(!AC.roleFit[key]) { delete map[key]; changed=true; }
  }
  // Keep accepted snapshots and custom links as evidence; unresolved custom links block certification.
  if(changed){s.accountingReviewRequired=true;invalidateAccountingCertification(s);}
}
function roleFitAccountingSignature(){ return JSON.stringify([2,AC.roleFit,AC.presets]); }
function roleFitDeclaration(s,key){ return s.roleFitDeclarations?.[key] || 'NEUTRAL'; }
function roleFitIsAircraftLevel(key){
  const item=AC.roleFit[key];
  return !!item?.normally && !!item?.maintenanceIncluded;
}
function roleFitIncludedInAcceptedWeight(s,key){
  return !!s.accepted?.isAccepted && basicWeightBasis(s)==='MAINTENANCE' && !!s.accepted?.maintenanceBaseline?.roleFit?.[key];
}
function resolvedRoleFitDeclaration(s,key){
  const action=roleFitDeclaration(s,key);
  if(action==='ACCOUNTED' && basicWeightBasis(s)==='RFM') return 'ADD';
  if(action==='EXCLUDED' && roleFitIncludedInAcceptedWeight(s,key) && !roleFitRemovedInAcceptedRecord(s,key)) return 'REMOVE';
  if(action!=='NEUTRAL') return action;
  if(roleFitRemovedInAcceptedRecord(s,key)) return 'EXCLUDED';
  const baseline=s.accepted?.maintenanceBaseline?.roleFit;
  if(s.accepted?.isAccepted){
    const included=basicWeightBasis(s)==='MAINTENANCE' && !!baseline?.[key];
    // An explicit manual neutral choice retains accepted accounting. Automatic
    // defaults separately describe physical fit and inclusion in accepted weight.
    if(s.roleFitDeclarationOrigins?.[key]==='manual') return included?'ACCOUNTED':'EXCLUDED';
    const preset=AC.presets[s.preset];
    if(preset?.roleFitOff?.includes(key) && !roleFitIsAircraftLevel(key)) return 'EXCLUDED';
    const fitted=preset?.roleFitOn?.includes(key) || !!AC.roleFit[key]?.normally || included;
    return fitted?(included?'ACCOUNTED':'ADD'):'EXCLUDED';
  }
  return 'NEUTRAL'; // unanswered: do not infer inclusion from expected fit
}
function roleFitRemovedInAcceptedRecord(s,key){
  if (!s.accepted?.isAccepted || basicWeightBasis(s)!=='MAINTENANCE') return false;
  if (Array.isArray(s.accepted.maintenanceExceptions)) return s.accepted.maintenanceExceptions.map(canonicalRoleFitKey).includes(key);
  return roleFitMaintenanceDefault(AC.roleFit[key]) && s.accepted.maintenanceBaseline?.roleFit?.[key]===false;
}
function customRoleFitKey(item){
  if (item.roleFitKey) return canonicalRoleFitKey(item.roleFitKey);
  const name=String(item.description||'').trim().toLowerCase().replace(/\s+/g,' ');
  return Object.keys(AC.roleFit).find(key=>AC.roleFit[key].name.trim().toLowerCase().replace(/\s+/g,' ')===name) || '';
}
function customRoleFitKeys(item){return item.roleFitKeys?.length?item.roleFitKeys:[customRoleFitKey(item)].filter(Boolean);}
function customForRoleFit(s,key){ return (s.customExceptions||[]).filter(item=>customRoleFitKeys(item).includes(key)); }
function roleFitIsInstalled(s,key){
  if (roleFitRemovedInAcceptedRecord(s,key)) return false;
  const custom=customForRoleFit(s,key);
  if (custom.length) return custom.length===1 && Number(custom[0].w)>0;
  const action=resolvedRoleFitDeclaration(s,key);
  if (action==='ADD' || action==='ACCOUNTED') return true;
  if (action==='REMOVE' || action==='EXCLUDED') return false;
  // Neutral makes no physical claim: retain a known accepted fit, if available.
  return s.accepted?.isAccepted && basicWeightBasis(s)==='MAINTENANCE' && !!s.accepted.maintenanceBaseline?.roleFit?.[key];
}
function syncRoleFitPhysicalState(s){
  s.roleFit=s.roleFit||{};
  for (const key of Object.keys(AC.roleFit)) s.roleFit[key]=roleFitIsInstalled(s,key);
}
function invalidateAccountingCertification(s){
  if (s.certify) { s.certify.certified=false; s.certify.by=null; s.certify.at=null; }
  s.signedOutBy=null; s.signedOutAt=null;
}
function setRoleFitDeclaration(s,key,action,origin='manual'){
  if (!AC.roleFit[key] || !ROLE_FIT_DECLARATIONS.includes(action)) return 'Invalid equipment declaration.';
  if (roleFitRemovedInAcceptedRecord(s,key) && action!=='NEUTRAL') return 'This removal is already in the accepted aircraft record. It cannot be applied again or reinstalled in this session.';
  if (customForRoleFit(s,key).length && action!=='NEUTRAL') return 'This item is controlled by a Custom Exception. Edit that entry to avoid counting it twice.';
  s.roleFitDeclarations=s.roleFitDeclarations||{}; s.roleFitDeclarationOrigins=s.roleFitDeclarationOrigins||{};
  s.roleFitDeclarations[key]=action; s.roleFitDeclarationOrigins[key]=origin;
  invalidateAccountingCertification(s); syncRoleFitPhysicalState(s); return '';
}
function presetRoleFitDeclaration(s,preset,key){
  const included=basicWeightBasis(s)==='MAINTENANCE' && !!s.accepted?.maintenanceBaseline?.roleFit?.[key];
  if (roleFitIsAircraftLevel(key)) return included ? 'ACCOUNTED' : 'ADD';
  if ((preset?.roleFitOff||[]).includes(key)) return 'EXCLUDED';
  if ((preset?.roleFitOn||[]).includes(key)) return included ? 'NEUTRAL' : 'ADD';
  return 'NEUTRAL'; // omission never means REMOVE
}
function roleFitExpectation(s,key){
  const normal=!!AC.roleFit[key]?.normally, preset=AC.presets[s.preset];
  const on=!!preset?.roleFitOn?.includes(key), off=!!preset?.roleFitOff?.includes(key);
  const aircraftLevel=roleFitIsAircraftLevel(key);
  return {normal,aircraftLevel,installed:aircraftLevel?true:off?false:on?true:normal,configuration:preset?.name||'No configuration',inherited:!!preset&&!on&&!off};
}
function applyRoleFitPreset(s,preset){
  for (const key of Object.keys(AC.roleFit)){
    if (roleFitRemovedInAcceptedRecord(s,key)) { setRoleFitDeclaration(s,key,'NEUTRAL','accepted'); continue; }
    if (s.roleFitDeclarationOrigins?.[key]==='manual' || customForRoleFit(s,key).length) continue;
    setRoleFitDeclaration(s,key,presetRoleFitDeclaration(s,preset,key),'preset');
  }
  syncRoleFitPhysicalState(s);
}
function roleFitAccountingRows(s){
  return Object.entries(AC.roleFit).map(([key,item])=>{
    const declaration=resolvedRoleFitDeclaration(s,key), custom=customForRoleFit(s,key).length>0;
    const locked=roleFitRemovedInAcceptedRecord(s,key);
    const factor=locked||custom ? 0 : declaration==='ADD'?1:declaration==='REMOVE'?-1:0;
    return {key,name:item.name,declaration:custom?'CUSTOM':declaration,origin:s.roleFitDeclarationOrigins?.[key]||'none',
      itemW:item.w,arm:item.arm,w:factor*item.w,m:factor*item.w*item.arm,current:roleFitIsInstalled(s,key),locked,custom};
  });
}
function customExceptionAccountingRows(s){
  return (s.customExceptions||[]).map(item=>{
    const keys=customRoleFitKeys(item), key=keys[0]||'', inputW=Number(item.w)||0, arm=Number(item.arm)||0;
    const accounted=item.accounting==='ACCOUNTED';
    const invalidLink=keys.some(link=>!AC.roleFit[link] || customForRoleFit(s,link).length>1 || (!accounted&&roleFitRemovedInAcceptedRecord(s,link)));
    const w=accounted||invalidLink ? 0 : inputW;
    return {...item,key,inputW,arm,w,m:w*arm,accounting:accounted?'ACCOUNTED':'APPLY',invalidLink};
  });
}
function accountingIssues(s){
  const issues=[];
  if (s.accountingReviewRequired) issues.push('Review the migrated Role Config declarations before certifying.');
  for (const [key,item] of Object.entries(AC.roleFit)){
    const action=roleFitDeclaration(s,key), linked=customForRoleFit(s,key);
    if (!ROLE_FIT_DECLARATIONS.includes(action)) issues.push(item.name+': invalid declaration.');
    if (action==='REMOVE' && (!roleFitIncludedInAcceptedWeight(s,key)||roleFitRemovedInAcceptedRecord(s,key))) issues.push(item.name+': subtraction is not supported by the accepted aircraft basic weight. Review this item or record the adjustment as a Custom Exception.');
    if (roleFitRemovedInAcceptedRecord(s,key) && action!=='NEUTRAL') issues.push(item.name+': conflicts with equipment marked removed in the accepted aircraft record.');
    if (linked.length>1) issues.push(item.name+': more than one Custom Exception refers to this item. Resolve duplicate accounting.');
    if (linked.length && action!=='NEUTRAL') issues.push(item.name+': use either the listed declaration or the Custom Exception.');
  }
  for (const item of customExceptionAccountingRows(s)){
    if (item.key && !AC.roleFit[item.key]) issues.push((item.description||'Custom Exception')+': linked equipment no longer exists.');
    if (item.invalidLink) issues.push((item.description||'Custom Exception')+': linked accounting is unavailable or duplicated; no adjustment is applied.');
    if (item.accounting==='ACCOUNTED' && item.w!==0) issues.push('Invalid accounted adjustment.');
  }
  return [...new Set(issues)];
}
function migrateRoleFitDeclarations(s){
  const previous=s.roleFit||{}, baseline=s.accepted?.maintenanceBaseline?.roleFit;
  s.roleFitDeclarations={}; s.roleFitDeclarationOrigins={};
  for (const key of Object.keys(AC.roleFit)){
    const current=!!previous[key]; const included=basicWeightBasis(s)==='MAINTENANCE' && !!baseline?.[key];
    s.roleFitDeclarations[key]=roleFitRemovedInAcceptedRecord(s,key)?'NEUTRAL':current?(included?'ACCOUNTED':'ADD'):(included?'REMOVE':'NEUTRAL');
    s.roleFitDeclarationOrigins[key]='manual'; // preserve until deliberately released to presets
  }
  for (const item of (s.customExceptions||[])) { item.accounting=item.accounting||'APPLY'; item.roleFitKey=item.roleFitKey||''; }
  s.accountingReviewRequired=!!(s.accepted?.isAccepted || s.preset || (s.customExceptions||[]).length);
  s.accountingReviewReason='migration';
  s.customExceptionsReviewed=false;
  invalidateAccountingCertification(s); syncRoleFitPhysicalState(s);
}

/* compute.js — All W&B math and calculations */
/* =========================
   CORE MATH
   ========================= */

function roundKg(x){ return Math.round(x); } // per your rounding requirement
function roundMm(x){ return Math.round(x); }

function cgFromMoment(totalW, totalM){
  if (totalW <= 0) return null;
  return totalM / totalW;
}


/* =========================
   MISSION EQUIPMENT RESOLVER
   Mission items reference a stowage location by ID (see config.js
   Section 7). This helper returns a fully-resolved item with the
   arm and stowage name already looked up, so calling code can just
   read .arm and .stow without knowing about the lookup.
   ========================= */

function getMissionItem(key){
  const it=AC.missionEquip[key];if(!it)return null;
  const loc=missionLocations()[it.stow];
  return {...it,key,w:it.unitWeight!==undefined?it.unitWeight*(it.defaultQuantity??1):it.w,
    arm:it.stow==='CUSTOM'?it.customArm:loc?.arm??0,stowId:it.stow,stow:loc?.name||(it.stow==='CUSTOM'?'Custom ('+it.customArm+' mm)':it.stow),stowGroup:loc?.group||''};
}

function normalizeRoleFitState(state){
  // Role-fit items remain independently selectable unless explicitly locked by
  // the Accepted Aircraft State. Do not infer installation/removal of the
  // EO/IR Hand Controller from the Sensor Workstation or EO/IR package.
  return state;
}

function computeRoleFitTotals(s){
  syncRoleFitPhysicalState(s);
  let w=0,m=0;
  for (const [key,item] of Object.entries(AC.roleFit)) if(roleFitIsInstalled(s,key)){w+=item.w;m+=item.w*item.arm;}
  return {w,m};
}
function basicWeightBasis(s){ return s?.accepted?.basicWeightBasis === "MAINTENANCE" ? "MAINTENANCE" : "RFM"; }
function roleFitMaintenanceDefault(it){ return it?.maintenanceIncluded !== undefined ? !!it.maintenanceIncluded : !!it?.normally; }
function seatMaintenanceDefault(it){ return !!it?.maintenanceIncluded; }
function computeRoleFitAdjustment(s){
  const current=computeRoleFitTotals(s), rows=roleFitAccountingRows(s);
  return {w:rows.reduce((sum,x)=>sum+x.w,0),m:rows.reduce((sum,x)=>sum+x.m,0),currentW:current.w,currentM:current.m,
    changes:rows.filter(x=>x.declaration!=='NEUTRAL'),baselineEstablished:!!s.accepted?.isAccepted};
}

function computeMissionTotals(s){
  const rows=missionRows(s);
  return {w:rows.reduce((n,r)=>n+r.w,0),m:rows.reduce((n,r)=>n+r.m,0)};
}

const PATIENT_STANDARD_WEIGHT_KG=90.00;
function patientPositionAvailable(s,position){
  if(position.missionKey){
    if(!s.mission?.[position.missionKey])return false;
    return missionAllocations(s,position.missionKey).some(row=>row.quantity>0&&row.stow===position.requiredStow&&!resolveMissionLocation(s,row).error);
  }
  if(position.roleFitKey)return roleFitIsInstalled(s,position.roleFitKey);
  return position.kind==='pta'&&roleFitIsInstalled(s,'RF_SAR_EQUIPMENT_CSH_PATIENT_TREATMENT_SYSTEM');
}
function patientRows(s){
  return Object.entries(AC.patientPositions||{}).map(([key,position])=>({...position,key,available:patientPositionAvailable(s,position),occupied:s.patientOccupants?.[key]===true}));
}
function computePatientTotals(s){
  const rows=patientRows(s).filter(row=>row.occupied);
  return {count:rows.length,w:rows.reduce((n,row)=>n+row.weight,0),m:rows.reduce((n,row)=>n+row.weight*row.arm,0)};
}
function patientIssues(s){
  const issues=patientRows(s).filter(row=>row.occupied&&!row.available).map(row=>row.name+': patient position unavailable. '+(row.requiredStow?'Stow the litter in the required location or clear the patient.':'Fit the required equipment or clear the patient.'));
  for(const [key,occupied] of Object.entries(s.patientOccupants||{}))if(occupied&&!AC.patientPositions?.[key])issues.push('Unknown patient position: '+key+'. Clear the patient or restore its definition.');
  return issues;
}

function computeSeatTotals(s){
  // Occupant standard weights (per RFM):
  //   CREW standard weight = 90.7 kg (200 lb)
  //   PAX  standard weight = 90.00 kg
  const crewW = 90.7;  // RFM: crew standard weight is 90.7 kg
  const paxW  = 90.0;  // RFM: PAX standard weight is 90.00 kg
  let w=0, m=0, structureW=0, structureM=0, occupantW=0, occupantM=0;
  const changes=[];
  const basis = basicWeightBasis(s);
  const maintenanceSeats = s?.accepted?.maintenanceBaseline?.seats;

  const addSeatStructure = (k, seat) => {
    if (seat.includedInRfmBasic) return;
    const current = !!s.seats[k];
    const baseline = basis === "MAINTENANCE" ? !!maintenanceSeats?.[k] : false;
    const factor = (basis === "MAINTENANCE" && !maintenanceSeats) ? 0 : (Number(current) - Number(baseline));
    if (!factor) return;
    const dw = factor * seat.wSeat;
    const dm = dw * seat.arm;
    structureW += dw; structureM += dm;
    changes.push({key:k,name:seat.name,baseline,current,w:dw,arm:seat.arm,m:dm});
  };

  // crew seats — occupants at crew standard weight (90.7 kg)
  for (const k of Object.keys(AC.crewSeats)){
    const seat = AC.crewSeats[k];
    addSeatStructure(k, seat);
    if (s.seats[k] && s.occupants[k]){
      occupantW += crewW;
      occupantM += crewW * (seat.occupantArm ?? seat.arm);
    }
  }
  // pax seats — occupants at PAX standard weight (90.00 kg)
  for (const k of Object.keys(AC.paxSeats)){
    const seat = AC.paxSeats[k];
    addSeatStructure(k, seat);
    if (s.seats[k] && s.occupants[k]){
      const weight=s.occupants[k].type==='crew'?crewW:paxW;
      occupantW += weight;
      occupantM += weight * (seat.occupantArm??seat.arm);
    }
  }
  const patients=computePatientTotals(s);
  occupantW+=patients.w;occupantM+=patients.m;
  w = structureW + occupantW; m = structureM + occupantM;
  return {w,m,structureW,structureM,occupantW,occupantM,changes,baselineEstablished:basis !== "MAINTENANCE" || !!maintenanceSeats};
}

function computeBayTotals(s){
  let w=0, m=0;
  for (const bay of Object.keys(s.bays)){
    const ww = +s.bays[bay] || 0;
    const arm = AC.bayArms[bay];
    w += ww;
    m += ww * arm;
  }
  return {w, m};
}

function computeCargoTotals(s){
  let w=0, m=0;
  for (const c of s.cargo){
    const ww = +c.w || 0;
    const arm = +c.arm || 0;
    w += ww;
    m += ww * arm;
  }
  return {w, m};
}

function computeCustomExceptionTotals(s){
  const rows=customExceptionAccountingRows(s);
  return {w:rows.reduce((sum,x)=>sum+x.w,0),m:rows.reduce((sum,x)=>sum+x.m,0)};
}

function solveFuelTanksFromTotal(totalKg){
  // Fill from stages, applying positive deltas only, sequentially, partially if needed.
  // This is a distribution solver for a total fuel amount.
  // Any negative stages are ignored for fill distribution; they’re transfer dynamics not a fill bucket.
  const tanks = {T1:0,T2:0,T3:0,T4:0,T5:0};
  let remaining = Math.max(0, totalKg);

  for (const st of AC.fuelStages){
    // stage capacity = sum of positive deltas
    const posKeys = Object.keys(st.deltas).filter(k => st.deltas[k] > 0);
    const cap = posKeys.reduce((a,k)=>a+st.deltas[k], 0);
    if (cap <= 0) continue;
    if (remaining <= 0) break;

    const take = Math.min(remaining, cap);
    const frac = take / cap;

    for (const k of posKeys){
      tanks[k] += st.deltas[k] * frac;
    }
    remaining -= take;
  }

  // rounding to nearest kg at end (you asked for that)
  for (const k of Object.keys(tanks)){
    tanks[k] = roundKg(tanks[k]);
  }

  // adjust rounding drift to match totalKg exactly by distributing +/-
  let sum = Object.values(tanks).reduce((a,b)=>a+b,0);
  let drift = roundKg(totalKg) - sum;
  const order = ["T3","T2","T1","T4","T5"]; // arbitrary stable order
  let i=0;
  while (drift !== 0 && i < 5000){
    const kk = order[i % order.length];
    tanks[kk] += (drift > 0 ? 1 : -1);
    drift += (drift > 0 ? -1 : 1);
    i++;
  }

  return tanks;
}

function computeFuelTotals(s){
  const total = roundKg(+s.fuel.total || 0);
  let tanks = s.fuel.tanks;

  if (!s.fuel.manualTanks){
    tanks = solveFuelTanksFromTotal(total);
    s.fuel.tanks = {...tanks};
  } else {
    // manual tanks: total is sum
    const sum = roundKg(Object.values(tanks).reduce((a,b)=>a+(+b||0),0));
    s.fuel.total = sum;
  }

  let w=0, m=0;
  for (const k of Object.keys(tanks)){
    const ww = +tanks[k] || 0;
    const arm = AC.fuelTankArms[k];
    w += ww;
    m += ww * arm;
  }
  return {w: roundKg(w), m};
}

/* =========================
   BURN TRACK
   Computes a sequence of {w, cg, label, fuel} points showing
   how AUW and CG evolve as fuel burns from departure down to
   landing weight. Uses the same fuel distribution solver so
   the CG shift matches how the tanks actually drain.

   Returns: array of points, departure first → landing last.
   ========================= */

function computeBurnTrack(tail){
  const s = STORE.sessions[tail];
  if (!s || s.fuel.manualTanks) return [];

  // Non-fuel state doesn't change during burn — capture once.
  // Use full non-fuel weight (OW + cargo + bay) and the TRUE moment,
  // not a reconstruction from rounded CG.
  const wb0     = computeWB(tail);
  const baseW   = wb0.nonFuelWExact ?? wb0.nonFuelW;
  const baseM   = wb0.nonFuelM;

  const fuelDep  = roundKg(s.fuel?.total ?? 0);
  const fuelLdg  = roundKg(Math.max(0, s.fuel?.landing ?? 300));

  // Helper: compute {w, cg} for a given total fuel amount
  const pointAtFuel = (fuelKg) => {
    const tanks = solveFuelTanksFromTotal(fuelKg);
    let fw = 0, fm = 0;
    for (const k of Object.keys(tanks)){
      const kg  = tanks[k] || 0;
      const arm = AC.fuelTankArms[k];
      fw += kg;
      fm += kg * arm;
    }
    const wExact = baseW + fw;
    const w  = roundKg(wExact);
    const m  = baseM + fm;
    const cg = roundMm(cgFromMoment(wExact, m) || 0);
    return { w, cg, fuel: roundKg(fw) };
  };

  // Sample the burn curve. We step every ~50 kg for a smooth line,
  // and explicitly include the departure and landing points.
  const track = [];
  const step  = 50;

  track.push({ ...pointAtFuel(fuelDep), label: "Departure" });

  for (let f = fuelDep - step; f > fuelLdg; f -= step){
    track.push({ ...pointAtFuel(f), label: null });
  }

  track.push({ ...pointAtFuel(fuelLdg), label: "Landing" });

  return track;
}


function computeLandingPoint(tail){
  const s=STORE.sessions[tail],wb=computeWB(tail);
  const fuel=Math.max(0,roundKg(s.fuel.landing??300));
  const tanks=solveFuelTanksFromTotal(fuel);
  const fm=Object.entries(tanks).reduce((n,[key,w])=>n+w*AC.fuelTankArms[key],0);
  return {w:roundKg(wb.nonFuelWExact+fuel),cg:roundMm(cgFromMoment(wb.nonFuelWExact+fuel,wb.nonFuelM+fm)),fuel,label:'Landing'};
}
function fuelPlotState(tail){
  const wb=computeWB(tail),s=STORE.sessions[tail];
  return {departure:{w:wb.auw,cg:wb.auwCG,fuel:wb.fuelTotal},landing:computeLandingPoint(tail),track:computeBurnTrack(tail),manual:!!s.fuel.manualTanks};
}

function cgBand(cg){
  if (cg == null) return "—";
  if (cg < AC.envelope.cgBands.fwdMax) return "FWD";
  if (cg <= AC.envelope.cgBands.midMax) return "MID";
  return "AFT";
}

function pointInPoly(pt, poly){
  // ray-casting for convex/concave polygons
  let inside = false;
  for (let i=0, j=poly.length-1; i<poly.length; j=i++){
    const xi=poly[i].cg, yi=poly[i].w;
    const xj=poly[j].cg, yj=poly[j].w;
    const intersect = ((yi > pt.w) !== (yj > pt.w)) &&
      (pt.cg < (xj - xi) * (pt.w - yi) / ((yj - yi) || 1e-9) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function computeWB(tail){
  const s = STORE.sessions[tail];

  // basic
  const basicW = +s.accepted.basicW || 0;
  const basicCG = +s.accepted.basicCG || 0;
  const basicM = basicW * basicCG;

  // Role fit / mission / seats
  const rf = computeRoleFitAdjustment(s);
  const me = computeMissionTotals(s);
  const st = computeSeatTotals(s);

  // Cabin bay loads (tactical / optional)
  const bay = computeBayTotals(s);

    // Cargo
  const cargo = computeCargoTotals(s);
  const custom = computeCustomExceptionTotals(s);

  // Load zones / shelves (discrete stowage locations)
  // Use the configured stowage arm, including for sessions saved before zones
  // carried an arm of their own.
  const zones = (() => {
    const list = Array.isArray(s.zones) ? s.zones : [];
    let w = 0;
    let m = 0;
    for (const z of list){
      if (!z) continue;
      const zw = +z.w || 0;
      const configuredArm = AC.stowage?.[z.id]?.arm;
      const arm = Number.isFinite(+configuredArm) ? +configuredArm : +z.arm;
      if (!Number.isFinite(zw)) continue;
      w += zw;
      if (Number.isFinite(arm)) m += zw * arm;
    }
    return { w, m };
  })();

  // Fuel
  const MAX_FUEL_KG = AC.maxFuelKg; // hard physical cap (see config.js)

  // ---- Hard physical fuel cap (does not change allowance logic; prevents impossible fuel) ----
  if (!s.fuel) s.fuel = { total: 0, tanks: {} };

  // Clamp total (if UI writes to total directly)
  s.fuel.total = Math.min(roundKg(s.fuel.total || 0), MAX_FUEL_KG);

  // Clamp tanks (if UI writes to tanks directly)
  const t = s.fuel.tanks || {};
  const tankKeys = Object.keys(t);
  if (tankKeys.length){
    const sumTanks = tankKeys.reduce((acc,k)=> acc + (Number(t[k])||0), 0);
    if (sumTanks > MAX_FUEL_KG){
      const factor = MAX_FUEL_KG / sumTanks;

      // scale down proportionally
      let scaled = {};
      let newSum = 0;
      for (const k of tankKeys){
        const v = Number(t[k]) || 0;
        const nv = roundKg(v * factor);
        scaled[k] = nv;
        newSum += nv;
      }

      // fix rounding drift to hit cap exactly (adjust last key)
      const drift = newSum - MAX_FUEL_KG;
      if (drift !== 0){
        const last = tankKeys[tankKeys.length - 1];
        scaled[last] = roundKg((scaled[last] || 0) - drift);
      }

      s.fuel.tanks = scaled;
      s.fuel.total = MAX_FUEL_KG;
    }
  }
  // ------------------------------------------------------------------------------------------

  const fuel = computeFuelTotals(s);


  // ✅ OPERATING WEIGHT (per RFM): Basic + selected items (role-fit, mission equip)
  //    + crew/baggage (seats & occupants) + mission stowages (zones).
  //    Cargo and Bays are TACTICAL PAYLOAD — excluded from OW, added at AUW.
  const opWExact = basicW + rf.w + me.w + st.w + zones.w + custom.w;
  const opW = roundKg(opWExact);
  const opM = basicM + rf.m + me.m + st.m + zones.m + custom.m;
  const opCG = Number.isFinite(opM) ? roundMm(cgFromMoment(opWExact, opM) || 0) : null;


  // ✅ AUW = Operating Weight + Payload (Cargo + Bays) + Fuel
  const auwExact = opWExact + bay.w + cargo.w + fuel.w;
  const auw = roundKg(auwExact);
  const auwM = opM + bay.m + cargo.m + fuel.m;
  const auwCG = Number.isFinite(auwM) ? roundMm(cgFromMoment(auwExact, auwM) || 0) : null;

  // Envelope checks
  const hardCgOk = (auwCG >= AC.envelope.hardCg.min && auwCG <= AC.envelope.hardCg.max);
  const absCgOk = (auwCG >= AC.envelope.cgAbsolute.min && auwCG <= AC.envelope.cgAbsolute.max);
  const inMain = pointInPoly({w:auwExact, cg:auwCG}, AC.envelope.envMain);
  const inAlt = (auwExact <= 16000) && (auwExact >= 15600) && pointInPoly({w:auwExact, cg:auwCG}, AC.envelope.envAlt.concat([AC.envelope.envAlt[0]]));
  const envOk = (inMain && absCgOk) || (inAlt && absCgOk);

  // Weight checks (per your notes)
  const overweightAirborne = auwExact > 16000;
  const altGross = (auwExact > 15600 && auwExact <= 16000);

  const band = cgBand(auwCG);

  // Non-fuel totals (OW + tactical payload), with TRUE unrounded moment.
  // Used by the burn track (holds non-fuel constant, varies fuel) and the
  // PDF, so neither has to reconstruct moment from a rounded CG.
  const nonFuelWExact = opWExact + bay.w + cargo.w;
  const nonFuelW = roundKg(nonFuelWExact);
  const nonFuelM = opM + bay.m + cargo.m;

  return {
    basicW, basicCG,
    basicWeightBasis: basicWeightBasis(s),
    roleFitAdjustmentW: rf.w,
    roleFitAdjustmentM: rf.m,
    roleFitCurrentW: rf.currentW,
    roleFitCurrentM: rf.currentM,
    roleFitChanges: rf.changes,
    roleFitBaselineEstablished: rf.baselineEstablished,
    seatStructureAdjustmentW: st.structureW,
    seatStructureAdjustmentM: st.structureM,
    seatStructureChanges: st.changes,
    roleEquipmentAdjustmentW: rf.w + st.structureW,
    roleEquipmentAdjustmentM: rf.m + st.structureM,
    opW, opWExact, opCG, opM,       // exact mass retained for CG and limits
    nonFuelW, nonFuelWExact, nonFuelM, // OW + cargo + bay (no fuel), exact mass/moment retained
    fuelTotal: roundKg(s.fuel.total || 0),
    fuelTanks: {...s.fuel.tanks},
    bayTotal:  roundKg(bay.w),
    cabinTotal: roundKg(bay.w),     // retained alias (legacy callers)
    cargoTotal: roundKg(cargo.w),
    cargoTotalExact: cargo.w,
    customExceptionW: custom.w,
    customExceptionM: custom.m,
    zonesTotal: roundKg(zones.w),

    auw, auwExact, auwCG,
    cgBand: band,
    flags: {
      hardCgOk, absCgOk, envOk, inMain, inAlt,
      overweightAirborne, altGross
    }
  };
}


/* =========================
   ACCEPTANCE INVALIDATION
   ========================= */
function fleetMaintenanceBaseline(){
  const roleFit={}, seats={};
  for (const [k,it] of Object.entries(AC.roleFit)) roleFit[k] = roleFitMaintenanceDefault(it);
  normalizeRoleFitState(roleFit);
  for (const [k,it] of [...Object.entries(AC.crewSeats), ...Object.entries(AC.paxSeats)]) seats[k] = !!(it.includedInRfmBasic || seatMaintenanceDefault(it));
  return {roleFit,seats};
}


return {computeWB,missionRows,stowageLimits,computeRoleFitAdjustment,computeSeatTotals,fleetMaintenanceBaseline,accountingIssues,patientIssues};
};
