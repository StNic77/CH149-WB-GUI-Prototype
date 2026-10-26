/* Source rack mass includes its litters. Each patient remains a separate record. */
(() => {
 const data=window.CH149_DATA,positions=['FWD_STBD','AFT_STBD','FWD_PORT','AFT_PORT'],tiers=['TOP','MIDDLE','BOTTOM'];
 const panel=document.createElement('section');panel.id='casevacPanel';panel.className='floor-area-panel';panel.hidden=true;document.getElementById('seatReferenceNotice').before(panel);
 const toolbar=document.createElement('button');toolbar.id='casevacOpen';toolbar.textContent='CASEVAC litters';document.getElementById('planTools').append(toolbar);toolbar.onclick=()=>open();
 let bridge,selected=null,view='plan',message='';const picks=new Set(),key=id=>'RF_SAR_EQUIPMENT_CASEVAC_RACK_'+id;
 const kg=n=>Number(n).toLocaleString('en-CA',{maximumFractionDigits:4})+' kg';
 function patientIds(id){return tiers.map(t=>id+'_'+t).filter(p=>data.patientPositions[p]);}
 function install(state,id){if(!positions.includes(id))return {ok:false,reason:'Choose a defined CASEVAC rack.'};state.roleFit.add(key(id));return {ok:true};}
 function remove(state,id){if(!positions.includes(id))return {ok:false,reason:'Choose a defined CASEVAC rack.'};if(patientIds(id).some(p=>state.patients[p]))return {ok:false,reason:'Clear this rack’s patients before removing it.'};state.roleFit.delete(key(id));return {ok:true};}
 function setPatient(state,id,on){const pos=data.patientPositions[id];if(!pos||!positions.some(r=>key(r)===pos.roleFitKey))return {ok:false,reason:'Choose a defined CASEVAC patient tier.'};if(on&&!state.roleFit.has(pos.roleFitKey))return {ok:false,reason:'Install the rack before adding a patient.'};if(on)state.patients[id]=true;else delete state.patients[id];return {ok:true};}
 function available(state,id){const p=data.patientPositions[id];return !!p&&positions.some(r=>key(r)===p.roleFitKey)&&state.roleFit.has(p.roleFitKey)&&!state.patients[id];}
 function addPatients(state,ids){
  if(!Array.isArray(ids)||!ids.length)return {ok:false,reason:'Select at least one available patient position.'};
  if(new Set(ids).size!==ids.length||ids.some(id=>!available(state,id)))return {ok:false,reason:'A selected patient position is occupied or unavailable. Review the selection.'};
  for(const id of ids)state.patients[id]=true;
  return {ok:true};
 }
 function open(id='FWD_STBD',keepSelection=false){if(!bridge||!positions.includes(id))return;for(const module of [window.CabinFloorArea,window.CabinFloorEquipment,window.CabinBasket,window.CabinPTA,window.CabinStokes,window.CabinRampArea])module?.close();if(!keepSelection)picks.clear();selected=id;message='';if(view!=='plan')bridge.view('plan');render();}
 function act(fn,text){const result=fn();message=result.ok?text:result.reason;bridge.refresh();render();return result;}
 function render(){if(!bridge)return;toolbar.hidden=view!=='plan';panel.hidden=!selected||view!=='plan';if(panel.hidden)return;const state=bridge.state(),rack=data.roleFit[key(selected)],on=state.roleFit.has(key(selected)),occupied=patientIds(selected).filter(p=>state.patients[p]).length;
 for(const id of picks)if(!available(state,id))picks.delete(id);
 panel.innerHTML=`<div class="floor-area-heading"><div><h2>CASEVAC litters · ${selected.replace('_',' ')}</h2><p>${on?'Installed':'Not installed'} · rack and litters ${kg(rack.w)} · arm ${rack.arm.toLocaleString('en-CA')} mm</p></div><button class="secondary" id="casevacClose">Close</button></div><div class="floor-actions">${positions.map(id=>`<button class="secondary" data-casevac-rack="${id}" aria-pressed="${id===selected}">${id.replace('_',' ')} · ${state.roleFit.has(key(id))?'installed':'available'}</button>`).join('')}</div><div class="floor-actions"><button class="secondary" id="casevacToggle" ${on&&occupied?'disabled':''}>${on?'Remove rack and litters':'Install rack and litters'}</button></div>${occupied?'<p>Clear the patients before removing this rack.</p>':''}<div class="floor-choices">${tiers.filter(t=>data.patientPositions[selected+'_'+t]).map(tier=>{const id=selected+'_'+tier,p=data.patientPositions[id];return `<article class="floor-choice"><h3>${tier[0]+tier.slice(1).toLowerCase()} tier${p.provisional?' · provisional':''}</h3><p>${state.patients[id]?'Patient present':'No patient'} · ${kg(p.weight)} · ${p.arm.toLocaleString('en-CA')} mm</p><button class="secondary" data-casevac-patient="${id}" ${!on?'disabled':''}>${state.patients[id]?'Remove patient':'Add patient'}</button></article>`;}).join('')}</div><p>Rack weight includes its litters. Patients are separate loads. Forward racks have three patient tiers; aft racks have middle and bottom tiers only.</p><p role="status">${message}</p>`;
 // Replace only the patient-loading choices; rack and individual removal actions stay intact.
 for(const article of panel.querySelectorAll('.floor-choice')){
  const button=article.querySelector('[data-casevac-patient]'),id=button.dataset.casevacPatient,present=!!state.patients[id];
  const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.dataset.casevacSelect=id;input.checked=picks.has(id);input.disabled=!available(state,id);label.append(input,document.createTextNode('Select '+id.split('_').pop().toLowerCase()+' position'));article.insertBefore(label,button);article.classList.toggle('casevac-selected',input.checked);
  if(!present)button.remove();
  input.onchange=()=>{if(input.checked&&available(state,id))picks.add(id);else picks.delete(id);input.checked=picks.has(id);article.classList.toggle('casevac-selected',input.checked);updateSelection();};
 }
 const selection=document.createElement('div');selection.className='floor-actions';selection.innerHTML='<span id="casevacSelectionCount" role="status"></span><button id="casevacAddSelected">Add Selected Patients</button>';panel.querySelector('.floor-choices').after(selection);
 function updateSelection(){panel.querySelector('#casevacSelectionCount').textContent=picks.size+' positions selected across racks';panel.querySelector('#casevacAddSelected').disabled=!picks.size;}
 updateSelection();
 panel.querySelector('#casevacAddSelected').onclick=()=>{const count=picks.size,result=addPatients(state,[...picks]);if(result.ok){picks.clear();act(()=>result,count+' patients added.');window.CabinActions?.complete(count+' patients added.');}else {message=result.reason;render();}};
 panel.querySelector('#casevacClose').onclick=()=>window.CabinCasevac.close();panel.querySelector('#casevacToggle').onclick=()=>act(()=>on?remove(state,selected):install(state,selected),on?'Rack and litters removed.':'Rack and litters installed.');for(const b of panel.querySelectorAll('[data-casevac-rack]'))b.onclick=()=>window.CabinCasevac.open(b.dataset.casevacRack,true);for(const b of panel.querySelectorAll('[data-casevac-patient]'))b.onclick=()=>act(()=>setPatient(state,b.dataset.casevacPatient,false),'Patient removed.');
 }
 window.CabinCasevac={positions,key,patientIds,install,remove,setPatient,available,addPatients,open,render,close(){selected=null;picks.clear();render();},connect(value){bridge=value;},setView(id){view=id;if(id!=='plan'){selected=null;picks.clear();}render();}};
})();

