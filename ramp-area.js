/* One ramp zone; explicit-arm cargo and aggregate weight, with source-aligned ramp checks. */
(() => {
 const data=window.CH149_DATA,layer=document.createElement('div');layer.id='rampAreaLayer';layer.className='ramp-area-layer';layer.hidden=true;document.getElementById('planSheet').append(layer);
 const target=document.createElement('button');target.type='button';target.id='rampAreaTarget';target.dataset.rampZone='RAMP';target.className='floor-space-cell';target.setAttribute('aria-label','Select Ramp loading area');target.setAttribute('aria-controls','rampAreaPanel');layer.append(target);
 const panel=document.createElement('section');panel.id='rampAreaPanel';panel.className='floor-area-panel';panel.hidden=true;panel.setAttribute('aria-label','Ramp loading area');document.getElementById('seatReferenceNotice').before(panel);
 const openButton=document.createElement('button');openButton.type='button';openButton.id='rampAreaOpen';openButton.textContent='Ramp area';openButton.setAttribute('aria-controls','rampAreaPanel');document.getElementById('planTools').append(openButton);
 let bridge,available=false,opened=false,section='';
 function open(){if(!available||!bridge)return;window.CabinFloorArea.close();window.CabinBasket.close();window.CabinPTA.close();window.CabinStokes.close();window.CabinFloorEquipment?.close();window.CabinCasevac?.close();opened=true;section='';render();panel.scrollIntoView({block:'nearest'});}
 function close(){opened=false;render();}
 function render(){
  if(!bridge)return;const m=window.CabinBayLayer?.getDisplayMapping();layer.hidden=!available||!m;openButton.hidden=!available;panel.hidden=!available||!opened;
  if(!layer.hidden){const x=station=>m.forwardX+(station-4875)/6518*(m.aftX-m.forwardX);Object.assign(target.style,{left:x(data.ramp.hinge)/m.width*100+'%',width:(m.rampAftX-x(data.ramp.hinge))/m.width*100+'%',top:(m.centerY-95*m.sourceScale)/m.height*100+'%',height:190*m.sourceScale/m.height*100+'%'});target.setAttribute('aria-expanded',String(opened));target.classList.toggle('selected',opened);}
  if(panel.hidden)return;const state=bridge.state();
  const heading='<div class="floor-area-heading"><h2>Ramp</h2></div>';
  if(section==='cargo'){
   const loads=(state.floorLoads||[]).filter(row=>row.kind==='individual'&&row.installed!==false&&row.area==='RAMP');
   panel.innerHTML=heading+'<button type="button" class="cascade-back secondary" id="rampBack">← Back to Ramp</button><h3>Ramp Cargo</h3><div id="rampCargoEntries"></div><button type="button" class="secondary" id="rampCargoAdd">Add ramp cargo</button>'+window.CabinRampLimits.markup(state);
   const entries=panel.querySelector('#rampCargoEntries');for(const row of loads){const button=document.createElement('button');button.type='button';button.className='cascade-choice secondary';button.textContent=window.CabinCargo.label(row)+' · '+Number(row.weight).toLocaleString('en-CA')+' kg';button.dataset.rampCargoId=row.id;button.onclick=()=>window.CabinCargo.open(row.id);entries.append(button);}
   const cargoAdd=panel.querySelector('#rampCargoAdd');cargoAdd.disabled=(state.floorLoads||[]).filter(row=>row.kind==='individual'&&row.installed!==false).length>=4;cargoAdd.onclick=()=>{close();window.CabinFloorArea.beginRampCargo();};panel.querySelector('#rampBack').onclick=()=>{section='';render();};
   return;
  }
  panel.innerHTML=heading+'<div class="cascade-menu"><button type="button" class="cascade-choice secondary" id="rampAreaShelves">Ramp Shelves</button><button type="button" class="cascade-choice secondary" id="rampCargoOptions">Ramp Cargo</button><button type="button" class="cascade-choice secondary" id="rampBayWeight">Ramp Area (Bay weight)</button><button type="button" class="cascade-choice secondary" id="rampAreaStokes">Stokes Litter</button></div>';
  panel.querySelector('#rampCargoOptions').onclick=()=>{section='cargo';render();};
  panel.querySelector('#rampBayWeight').onclick=()=>{close();window.CabinCargo.openBay('RAMP');};panel.querySelector('#rampAreaStokes').onclick=()=>{close();window.CabinStokes.open('RAMP');};panel.querySelector('#rampAreaShelves').onclick=()=>{close();bridge.view('ramp');};

 }
 target.onclick=event=>{if(!window.CabinFloorArea.chooseRampPoint(event))window.CabinRampArea.open();};openButton.onclick=()=>window.CabinRampArea.open();
 window.CabinRampArea={connect(value){bridge=value;},open,close,render,setView(value){available=value;if(!value)opened=false;render();},getState:()=>({available,opened,area:'RAMP',cargoEnabled:!!bridge&&(bridge.state().floorLoads||[]).filter(row=>row.kind==='individual'&&row.installed!==false).length<4})};
})();
