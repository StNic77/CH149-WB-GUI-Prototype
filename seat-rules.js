/* Prototype fit rules explicitly confirmed by the user on 21 October 2026.
   These relationships are not present in the protected reference app's seat editor.
   Each alternative is a compatible set: P13/P14 may coexist, as may P7/P8. */
window.CH149_SEAT_RULES = (() => {
  const groups = [
    {id:'BAY4_PORT_SEATING',alternatives:[['C5'],['P13','P14']]},
    {id:'BAY5_STBD_SEATING',alternatives:[['C6'],['P7','P8']]}
  ];
  // Basket stowage fittings alone do not mean that a basket occupies the space.
  const equipment = [
    {key:'RF_SAR_EQUIPMENT_FWD_SAR_CABINET',set:'roleFit',name:'SAR cabinet',seats:['P4','P5','P6']},
    {key:'ME_SAR_MISSION_EQUIP_RESCUE_BASKET_STBD',set:'mission',name:'Starboard basket',seats:['P9','P10'],mode:'occupancy'},
    {key:'RF_SAR_EQUIPMENT_CSH_PATIENT_TREATMENT_SYSTEM',set:'roleFit',name:'PTA cot',seats:['P15','P16','P17','P18']},
    {key:'ME_SAR_MISSION_EQUIP_RESCUE_BASKET_PORT',set:'mission',name:'Port basket',seats:['P18'],mode:'occupancy'}
  ];
  // Rack conflicts confirmed by the user on 29 October 2026. P1 is intentional; P7 is not an aft-rack blocker.
  const rackRules=[
    {position:'FWD_PORT',seats:['C5','P13','P14','P15','P16'],equipment:['RF_SAR_EQUIPMENT_CSH_PATIENT_TREATMENT_SYSTEM']},
    {position:'AFT_PORT',seats:['P17','P18'],equipment:['RF_SAR_EQUIPMENT_CSH_PATIENT_TREATMENT_SYSTEM']},
    {position:'AFT_STBD',seats:['C6','P1','P8','P9','P10'],equipment:['ME_SAR_MISSION_EQUIP_RESCUE_BASKET_STBD']},
    {position:'FWD_STBD',seats:['P4','P5','P6'],equipment:['RF_SAR_EQUIPMENT_FWD_SAR_CABINET']}
  ].map(r=>({...r,key:'RF_SAR_EQUIPMENT_CASEVAC_RACK_'+r.position}));
  for(const rack of rackRules)equipment.push({key:rack.key,set:'roleFit',name:rack.position.replace('_',' ')+' CASEVAC rack',seats:rack.seats});
  function occupancyBlockers(state,id) {return equipment.filter(item=>item.seats.includes(id)&&state[item.set]?.has(item.key));}
  function blockers(state,id) {return occupancyBlockers(state,id).filter(item=>item.mode!=='occupancy');}
  function equipmentConflicts(state,key) {return equipment.filter(item=>item.key===key).flatMap(item=>item.seats.filter(id=>item.mode==='occupancy'?!!state.occupants?.[id]:state.seats.has(id)));}
  const equipmentPairs=[['ME_SAR_MISSION_EQUIP_RESCUE_BASKET_PORT','RF_SAR_EQUIPMENT_CSH_PATIENT_TREATMENT_SYSTEM'],...rackRules.flatMap(r=>r.equipment.map(key=>[r.key,key]))];
  function equipmentOverlaps(state,key){return equipmentPairs.flatMap(pair=>pair.includes(key)?pair.filter(other=>other!==key&&equipment.some(item=>item.key===other&&state[item.set]?.has(other))):[]);}
  function equipmentConflictMessage(state,key) {const overlaps=equipmentOverlaps(state,key);if(overlaps.length){if(!rackRules.some(r=>r.key===key||overlaps.includes(r.key)))return `The port basket and PTA cot cannot be installed together. Remove or relocate the conflicting equipment first.`;return 'Unavailable while '+overlaps.map(id=>equipment.find(e=>e.key===id)?.name||id).join(' and ')+' is installed. Remove or relocate the conflicting equipment first.';}const ids=equipmentConflicts(state,key),item=equipment.find(item=>item.key===key);if(!ids.length)return '';return item?.mode==='occupancy'?`Clear occupants from ${ids.join(', ')} before placing the ${item.name.toLowerCase()}. Seats can stay installed, folded up.`:`Remove seats ${ids.join(', ')} before placing this equipment.`;}
  function assignOccupant(state,id,kind) {
    if(['C1','C2'].includes(id)&&kind!=='Crew')return {ok:false,reason:'C1 and C2 are crew positions; passengers cannot be assigned here.'};
    if(!state.seats.has(id))return {ok:false,reason:'Install the seat before assigning an occupant.'};
    const blocked=occupancyBlockers(state,id);if(blocked.length)return {ok:false,reason:`${id} cannot be occupied while ${blocked.map(item=>item.name).join(' and ')} is installed.`};
    state.occupants[id]=kind;return {ok:true};
  }
  function conflicts(installed,id) {
    const result=new Set();
    for(const group of groups)for(let side=0;side<group.alternatives.length;side++) {
      if(group.alternatives[side].includes(id))for(let other=0;other<group.alternatives.length;other++) {
        if(other!==side)for(const candidate of group.alternatives[other])if(installed.has(candidate))result.add(candidate);
      }
    }
    return [...result];
  }
  function installationPlan(state,id) {
    const remove=conflicts(state.seats,id);
    return {id,remove,occupied:remove.filter(seat=>!!state.occupants[seat]),blockedBy:blockers(state,id)};
  }
  function issues(installed,state) {
    const result=[];
    for(const group of groups) {
      const present=group.alternatives.map(side=>side.filter(id=>installed.has(id)));
      if(present.filter(side=>side.length).length>1)result.push(`${present.map(side=>side.join(' + ')).filter(Boolean).join(' conflicts with ')}`);
    }
    if(state)for(const id of installed)for(const item of blockers(state,id))result.push(`${id} conflicts with ${item.name}`);
    if(state)for(const id of Object.keys(state.occupants||{}))if(state.occupants[id])for(const item of occupancyBlockers(state,id))result.push(`${id} occupant conflicts with ${item.name}`);
    if(state)for(const [left,right] of equipmentPairs){const item=equipment.find(item=>item.key===left);if(state[item.set]?.has(left)&&equipmentOverlaps(state,left).includes(right))result.push((equipment.find(e=>e.key===left)?.name||left)+' conflicts with '+(equipment.find(e=>e.key===right)?.name||right));}
    return result;
  }
  function install(state,id,catalogue,{replace=false}={}) {
    if(!catalogue[id])return {ok:false,reason:'Unknown seat position'};
    const plan=installationPlan(state,id);
    if(plan.blockedBy.length)return {ok:false,reason:`${id} is unavailable while ${plan.blockedBy.map(item=>item.name).join(' and ')} is installed.`,...plan};
    if(plan.occupied.length)return {ok:false,reason:`Clear occupants from ${plan.occupied.join(', ')} before replacing seats.`,...plan};
    if(plan.remove.some(seat=>catalogue[seat]?.alwaysInstalled))return {ok:false,reason:'An always-installed seat cannot be replaced.',...plan};
    if(plan.remove.length&&!replace)return {ok:false,reason:`${plan.remove.join(', ')} occupies this seating space.`,...plan};
    // Commit only after all checks: never partially remove a passenger pair.
    for(const seat of plan.remove)state.seats.delete(seat);
    state.seats.add(id);return {ok:true,...plan};
  }
  return {groups,equipment,rackRules,equipmentPairs,equipmentOverlaps,blockers,occupancyBlockers,equipmentConflicts,equipmentConflictMessage,assignOccupant,conflicts,issues,installationPlan,install,
    provenance:{by:'user',date:'2026-10-21',casevacConfirmed:'2026-10-29',confirmation:'C5 excludes P13/P14; C6 excludes P7/P8; C3 and C4 exclude no passenger positions.'}};
})();
