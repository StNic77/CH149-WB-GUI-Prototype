/* Thin translation into pinned reference functions. No second aircraft engine. */
(() => {
 const data=window.CH149_DATA,source=window.CH149_PLANNING_SOURCE;
 const clone=x=>JSON.parse(JSON.stringify(x));
 const config={...clone(data),...clone(window.CH149_FUEL_SOURCE),envelope:clone(source.envelope),bayArms:Object.fromEntries(window.CH149_BAY_DATA.bays.map(b=>[b.id,b.arm]))};
 // Capacity updates are separate from the pinned equipment catalogue.
 for(const [id,loc]of Object.entries(config.stowage))loc.maxKg=source.stowageLimits[id]??null;
 for(const item of Object.values(config.missionEquip))item.unitWeight??=(item.w??0)/(item.defaultQuantity??1);
 const store={sessions:{}},reference=window.CabinPlanningReferenceFactory(config,store);
 const dictionary=set=>Object.fromEntries([...set].map(key=>[key,true]));
 function session(state){
  const p=state.planning||{},basis=p.basis||'MAINTENANCE',baseline=p.baseline||(basis==='MAINTENANCE'?reference.fleetMaintenanceBaseline():{});
  const s={tail:p.tail||'preview',preset:state.preset,accepted:{isAccepted:true,basicW:p.basicWeight||0,basicCG:p.basicCG||0,basicWeightBasis:['CURRENT','MAINTENANCE'].includes(basis)?'MAINTENANCE':'RFM',maintenanceBaseline:baseline,maintenanceExceptions:[]},roleFit:dictionary(state.roleFit),seats:dictionary(state.seats),mission:dictionary(state.mission),missionLoads:{},roleFitDeclarations:{},roleFitDeclarationOrigins:{},patientOccupants:{...state.patients},occupants:{},bays:{},cargo:[],zones:[],customExceptions:[],fuel:{total:p.fuel??0,landing:0,manualTanks:false,tanks:{}}};
  for(const key of Object.keys(config.roleFit)){
   const on=state.roleFit.has(key),included=['CURRENT','MAINTENANCE'].includes(basis)&&baseline.roleFit?.[key];
   s.roleFitDeclarations[key]=on?(included?'ACCOUNTED':'ADD'):(included?'REMOVE':'EXCLUDED');s.roleFitDeclarationOrigins[key]='manual';
  }
  for(const [seat,kind]of Object.entries(state.occupants||{}))if(kind)s.occupants[seat]={type:kind==='Crew'||kind!=='Passenger'&&(seat.startsWith('C')||kind==='SAR Tech')?'crew':'pax'};
  for(const key of state.mission){
   const item=config.missionEquip[key];if(!item)continue;
   const allocations=item.defaultAllocations?.length?item.defaultAllocations:[{quantity:item.defaultQuantity??1,stow:item.stow,customArm:item.customArm}];
   s.missionLoads[key]=window.CabinEquipment?window.CabinEquipment.rows(state,key):allocations.map((row,i)=>({id:'base'+i,...row,...(state.moved?.[key]?.loc?{stow:state.moved[key].loc}:{})}));
  }
  if(p.fuelMode==='manual'){s.fuel.manualTanks=true;s.fuel.tanks={...p.tanks};}
  s.fuel.landing=Math.min(p.reserve??300,p.fuel??0);
  for(const row of state.floorLoads||[]){if(row.installed===false)continue;if(row.kind==='bay'){const space=window.CH149_FLOOR_SPACES.find(x=>x.id===row.area);s.bays[row.area==='RAMP'?'REAR':space?.bay]=row.weight;}else s.cargo.push({w:row.weight,arm:row.arm});}
  for(const [id,w]of Object.entries(state.stowageLoads||{}))if(w>0)s.zones.push({id,w});
  return s;
 }
 function missionRows(state){return reference.missionRows(session(state));}
 function setBaseline(state,inputs){
  if(!['RFM','CURRENT','MAINTENANCE'].includes(inputs.basis)||!Number.isFinite(inputs.basicWeight)||inputs.basicWeight<=0||!Number.isFinite(inputs.basicCG)||inputs.basicCG<=0)return {ok:false,reason:'Enter a valid basic weight, CG and weight basis.'};
  if(inputs.tail&&!source.tails.active.includes(inputs.tail))return {ok:false,reason:'Choose a defined active aircraft.'};
  const baseline=inputs.basis==='MAINTENANCE'?reference.fleetMaintenanceBaseline():{roleFit:dictionary(state.roleFit),seats:dictionary(state.seats)};
  state.planning={...state.planning,...inputs,baseline:clone(baseline),source:clone(source.source)};
  const result=evaluate(state);state.planning.start={weight:result.wb.auwExact,cg:result.wb.auwCG};
  return {ok:true};
 }
 function evaluate(state){
  const p=state.planning;if(!p||!Number.isFinite(p.basicWeight)||p.basicWeight<=0||!Number.isFinite(p.basicCG)||p.basicCG<=0)return {ready:false,issues:['Enter planning basic weight and CG.']};
  const s=session(state),rows=reference.missionRows(s),issues=rows.filter(r=>r.quantity>0&&r.error).map(r=>r.name+': '+r.error);
  issues.push(...reference.accountingIssues(s),...reference.patientIssues(s));
  store.sessions.preview=s;const wb=reference.computeWB('preview');delete store.sessions.preview;
  if(!Number.isFinite(wb.auwExact)||wb.auwCG===null)issues.push('An installed load has no resolved accounting arm.');
  return {ready:true,wb,issues,allowances:window.CabinFuel.allowances(wb.nonFuelWExact)};
 }
 function shelf(state,id){
  const rows=missionRows(state).filter(r=>r.stowId===id&&r.quantity>0),assigned=rows.reduce((n,r)=>n+r.w,0),additional=Number(state.stowageLoads?.[id]||0),limit=source.stowageLimits[id]??null,total=assigned+additional,issues=rows.filter(r=>r.error).map(r=>r.error);
  return {id,rows,assigned,additional,total,limit,excess:limit===null?null:Math.max(0,total-limit),remaining:limit===null?null:limit-total,level:limit!==null&&total>limit+1e-9?'caution':limit===null||issues.length?'unreviewed':'ok',issues};
 }
 function bay(state,id,replacement,except){
  const loads=(state.floorLoads||[]).filter(r=>r.installed!==false&&String(r.id)!==String(except));if(replacement&&replacement.installed!==false)loads.push(replacement);
  const rows=loads.filter(r=>r.area!=='RAMP'&&window.CH149_FLOOR_SPACES.find(s=>s.id===r.area)?.bay===id);
  const assigned=missionRows(state).filter(r=>r.stowId===id&&r.quantity>0),total=rows.reduce((n,r)=>n+Number(r.weight),0)+assigned.reduce((n,r)=>n+r.w,0),limit=source.bayLimits[id]??null;
  return {id,total,limit,rows,assigned,excess:limit===null?null:Math.max(0,total-limit),remaining:limit===null?null:limit-total,level:limit!==null&&total>limit+1e-9?'caution':limit===null||assigned.some(r=>r.error)?'unreviewed':'ok'};
 }
 window.CabinPlanning=Object.freeze({session,missionRows,evaluate,shelf,bay,source,setBaseline});
})();
