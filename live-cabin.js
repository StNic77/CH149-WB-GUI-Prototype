/* Live code-native composition of unchanged source renders. No bitmap writes.
   Crop/display bounds are visual approximations, never load arms or fit rules. */
(() => {
 const reg=window.CH149_PLAN_REGISTRATION,base=reg.assets.BASELINE,data=window.CH149_DATA,ns='http://www.w3.org/2000/svg';
 const sheet=document.getElementById('planSheet'),wrap=document.querySelector('.photo-wrap');
 const background=document.createElement('div');background.id='liveCabinBackground';background.className='live-cabin-background';background.hidden=true;
 const img=document.createElement('img');img.src=base.file;img.alt='Common cabin background retaining P2 and P3';Object.assign(img.style,{left:base.x/reg.width*100+'%',top:base.y/reg.height*100+'%',width:base.size[0]*base.scale/reg.width*100+'%',height:base.size[1]*base.scale/reg.height*100+'%'});background.append(img);sheet.append(background);
 const layer=document.createElement('div');layer.id='liveCabinItems';layer.className='live-cabin-items';layer.hidden=true;sheet.append(layer);
 const label=document.createElement('label'),toggle=document.createElement('input');toggle.type='checkbox';toggle.id='liveCabinToggle';toggle.checked=true;label.append(toggle,'Live equipment');document.getElementById('planTools').append(label);
 const notice=document.createElement('p');notice.id='liveCabinNotice';notice.className='live-cabin-notice';notice.hidden=true;notice.textContent='Live cabin · equipment and seats follow your changes. P2 and P3 stay in the background. Other equipment remains available in the contents lists.';document.getElementById('seatReferenceNotice').before(notice);
 const assets={
  basket:{file:'images/SAR_3_Pax_clean.png',size:[1864,843],crop:[1113,314,100,51],clip:'polygon(2% 3%,98% 3%,100% 12%,100% 88%,98% 97%,2% 97%,0 88%,0 12%)'},
  cot:{file:'images/SAR_3_Pax_clean.png',size:[1864,843],crop:[985,443,186,54],clip:'polygon(5% 1%,93% 1%,100% 17%,100% 83%,94% 99%,5% 99%,0 83%,0 17%)'},
  stokes:{file:'images/SAR_3_Pax_clean.png',size:[1864,843],crop:[1284,308,190,64]},
  stokesCabin:{file:'images/Stokes_Cabin_Deployed_reference.png',size:[978,467],crop:[424,224,130,38],orangeFrame:true},
  pax:{file:'images/Transport_clean.png',size:[1883,835],crop:[641,329,48,68]},
  folded:{file:'images/Transport_clean.png',size:[1883,835],crop:[641,329,48,19]},
  crewPort:{file:'images/SAR_3_Pax_clean.png',size:[1864,843],crop:[725,437,58,64]},
  crewStbd:{file:'images/SAR_3_Pax_clean.png',size:[1864,843],crop:[987,311,67,62]},
  cabinet:{file:'images/SAR_3_Pax_clean.png',size:[1864,843],crop:[608,305,157,68]},
  seaTray:{file:'images/SAR_3_Pax_clean.png',size:[1864,843],crop:[767,296,297,137],clip:'polygon(0 0,75% 0,75% 58%,100% 58%,100% 100%,3% 100%,0 60%)'},
  raftB3:{file:'images/Transport_clean.png',size:[1883,835],crop:[816,326,60,104],clip:'polygon(10% 0,90% 0,100% 8%,100% 92%,90% 100%,10% 100%,0 92%,0 8%)'},
  raftB4:{file:'images/CASEVAC_clean.png',size:[1918,820],crop:[962,276,58,101],clip:'polygon(10% 0,90% 0,100% 8%,100% 92%,90% 100%,10% 100%,0 92%,0 8%)'},
  rackFwdStbd:{file:'images/CASEVAC_clean.png',size:[1918,820],crop:[615,289,229,73]},
  rackAftStbd:{file:'images/CASEVAC_clean.png',size:[1918,820],crop:[1022,286,227,76]},
  rackFwdPort:{file:'images/CASEVAC_clean.png',size:[1918,820],crop:[811,437,219,69]},
  rackAftPort:{file:'images/CASEVAC_clean.png',size:[1918,820],crop:[1035,438,226,69]}
 };
 let bridge,available=false;const nodes=new Map();
 const percent=(v,total)=>v/total*100+'%';
 let filterId=0;
 function imageNode(asset){const svg=document.createElementNS(ns,'svg'),[x,y,w,h]=asset.crop;svg.setAttribute('viewBox',`${x} ${y} ${w} ${h}`);svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');const image=document.createElementNS(ns,'image');image.setAttribute('href',asset.file);image.setAttribute('width',asset.size[0]);image.setAttribute('height',asset.size[1]);
  if(asset.orangeFrame){const defs=document.createElementNS(ns,'defs'),filter=document.createElementNS(ns,'filter'),matrix=document.createElementNS(ns,'feColorMatrix'),id='live-frame-'+(++filterId);filter.id=id;filter.setAttribute('color-interpolation-filters','sRGB');matrix.setAttribute('type','matrix');matrix.setAttribute('values','1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  4 -4 0 0 -0.1');filter.append(matrix);defs.append(filter);svg.append(defs);image.setAttribute('filter',`url(#${id})`);}
  svg.append(image);if(asset.clip)svg.style.clipPath=asset.clip;return svg;}
 function occupantKind(value){if(!value)return null;return /^crew$|pilot|flight engineer|\bFE\b|\bST\b|team lead|team member|commander|officer/i.test(String(value))?'crew':/^passenger$|pax/i.test(String(value))?'passenger':'occupied';}
 function occupancyNode(kind,rotation){const badge=document.createElement('span');badge.className='live-occupancy-marker';badge.dataset.occupancy=kind;badge.setAttribute('aria-hidden','true');badge.style.setProperty('--counter-rotation',`${-rotation}deg`);badge.innerHTML=kind==='patient'?'<svg viewBox="0 0 28 20"><circle cx="5" cy="7" r="3"/><path d="M10 8h8l5 5H10zM2 16h24"/></svg>':`<svg viewBox="0 0 20 24"><circle cx="10" cy="6" r="4"/><path d="M3 22v-6a7 7 0 0 1 14 0v6z"/></svg><b>${kind==='crew'?'C':kind==='passenger'?'P':'•'}</b>`;return badge;}
 function render(){
  if(!bridge)return;const state=bridge.state(),mapping=window.CabinBayLayer?.getDisplayMapping(),active=toggle.checked&&available&&!!mapping;
  background.hidden=layer.hidden=notice.hidden=!active;wrap.classList.toggle('live-cabin-active',active);if(!active){if(available){document.getElementById('photoChip').textContent=(state.preset?data.presets[state.preset]?.name:'No Role Config')+' · reference plan';document.getElementById('photoCaption').textContent='Reference plan for the selected role. Manual equipment and seat edits are shown in the controls; switch on Live equipment to see them in the picture.';}return;}
  document.getElementById('photoChip').textContent=(state.preset?data.presets[state.preset]?.name:'No Role Config')+' · live cabin';document.getElementById('photoCaption').textContent='Installed item pictures follow the current setup. Select an item to manage it or a floor cell for its available choices.';
  const seatNotice=document.getElementById('seatReferenceNotice');if(!seatNotice.hidden)seatNotice.textContent='Seat setup modified. Live layers show installed and folded seats; P2/P3 remain in the background.';
  const x=station=>mapping.forwardX+(station-4875)/6518*(mapping.aftX-mapping.forwardX),scale=base.scale,centre=reg.height/2,objects=[];
  function add(id,asset,station,offset,w,h,action,extra={}){objects.push({id,asset,x:x(station),y:centre+offset*scale,w,h,action,...extra});}
  function sourceObject(id,asset,source,action,extra={}){const a=assets[asset],r=reg.assets[source],[sx,sy,w,h]=a.crop;objects.push({id,asset,x:r.x+(sx+w/2)*r.scale,y:r.y+(sy+h/2)*r.scale,w:w*r.scale,h:h*r.scale,action,...extra});}
  // A floor covering leaves cell selection available; its controls live in the cell menus.
  if(state.roleFit.has('RF_AIRCRAFT_SYSTEMS_SEA_TRAY'))sourceObject('sea-tray','seaTray','SAR3');
  if(state.roleFit.has('RF_SAR_EQUIPMENT_FWD_SAR_CABINET'))sourceObject('cabinet','cabinet','SAR3',()=>bridge.view('cabinet'));
  for(const [suffix,asset]of [['FWD_STBD','rackFwdStbd'],['AFT_STBD','rackAftStbd'],['FWD_PORT','rackFwdPort'],['AFT_PORT','rackAftPort']])if(state.roleFit.has('RF_SAR_EQUIPMENT_CASEVAC_RACK_'+suffix))sourceObject('rack-'+suffix,asset,'CASEVAC',()=>window.CabinCasevac.open(suffix),{label:'CASEVAC rack · '+suffix.replace('_',' '),patientTiers:window.CabinCasevac.patientIds(suffix).filter(id=>state.patients[id])});
  for(const [id,seat]of Object.entries({...data.crewSeats,...data.paxSeats})){
   if(id==='C3'){const point=window.CabinSeatEditor.getC3Point(),occupant=state.seats.has(id)?occupantKind(state.occupants[id]):null;add('c3-position',null,seat.arm,0,88,100,()=>bridge.seat(id),{...point,occupancy:occupant,label:'C3 cockpit jump position'+(occupant?' · '+occupant:'')});continue;}
   if(!state.seats.has(id))continue;
   const occupant=occupantKind(state.occupants[id]);
   if(['C1','C2','P2','P3'].includes(id)){if(occupant){const port=/Port/i.test(seat.name);add('occupant-'+id,null,seat.arm,port?65:-65,40,40,()=>bridge.seat(id),{occupancy:occupant,label:id+' · '+occupant});}continue;}
   const crew=!!data.crewSeats[id],port=/Port/i.test(seat.name),stbd=/Stbd/i.test(seat.name),folded=window.CH149_SEAT_RULES.occupancyBlockers(state,id).length>0;
   const asset=crew?(stbd?'crewStbd':'crewPort'):folded?'folded':'pax',width=crew?assets[asset].crop[2]*scale:78,height=crew?assets[asset].crop[3]*scale:folded?33:110;
   add('seat-'+id,asset,seat.arm,port?(folded?84:65):stbd?-(folded?84:65):0,width,height,()=>{window.CabinFloorArea.close();window.CabinRampArea?.close();window.CabinFloorEquipment?.close();window.CabinCasevac?.close();window.CabinBasket.close();window.CabinPTA.close();window.CabinStokes.close();bridge.seat(id);},{rotation:!crew&&port?180:0,folded,occupancy:occupant,label:id+(folded?' · folded':'')+(occupant?' · '+occupant:'')});
  }
  const baskets=['PORT','STBD'].filter(side=>state.mission.has('ME_SAR_MISSION_EQUIP_RESCUE_BASKET_'+side));
  for(const side of baskets)add(baskets.length===1?'basket':'basket-'+side,'basket',data.stowage['CABIN_'+side+'_STOW'].arm,side==='PORT'?65:-65,186,96,()=>window.CabinBasket.open(side),{rotation:side==='PORT'?180:0,label:'Rescue basket · '+side});
  if(state.roleFit.has('RF_SAR_EQUIPMENT_CSH_PATIENT_TREATMENT_SYSTEM'))add('pta','cot',9950,65,340,99,()=>window.CabinPTA.open(),{occupied:!!state.patients.PTA,label:'PTA cot'});
  const litters=['CABIN','RAMP'].filter(side=>state.mission.has('ME_SAR_MISSION_EQUIP_STOKES_LITTER_'+side));
  const raftEditor=window.CabinFloorEquipment;if(state.mission.has(raftEditor.raftKey)&&!raftEditor.raftIssue(state)){const id=raftEditor.raftLocation(state);add('life-raft',id===raftEditor.locations[0]?'raftB3':'raftB4',data.stowage[id].arm,-42,94,165,()=>raftEditor.openRaft(id),{label:'Internal life raft · '+data.stowage[id].name});}
  for(const side of litters){const id=litters.length===1?'stokes':'stokes-'+side;if(side==='RAMP'){sourceObject(id,'stokes','SAR3',()=>window.CabinStokes.open(side));objects[objects.length-1].label='Stokes litter · ramp stowed';}else add(id,'stokesCabin',7863,0,340,99,()=>window.CabinStokes.open(side),{occupied:!!state.patients.STOKES_CABIN,label:'Stokes litter · deployed B3/B4 Centre'});}
  const keep=new Set(objects.map(o=>o.id));for(const [id,node]of nodes)if(!keep.has(id)){node.remove();nodes.delete(id);}
  for(const o of objects){let node=nodes.get(o.id);if(!node){node=document.createElement(o.action?'button':'div');if(o.action)node.type='button';node.className='live-cabin-object';node.dataset.liveObject=o.id;layer.append(node);nodes.set(o.id,node);}
   if(node.dataset.asset!==(o.asset||'')){node.replaceChildren(...(o.asset?[imageNode(assets[o.asset])]:[]));node.dataset.asset=o.asset||'';}
   const occupancy=o.occupied?'patient':o.occupancy;
   node.querySelector('.live-occupancy-marker')?.remove();if(occupancy)node.append(occupancyNode(occupancy,o.rotation||0));
   node.querySelector('.live-rack-patients')?.remove();if(o.patientTiers?.length){const group=document.createElement('span');group.className='live-rack-patients';for(const id of o.patientTiers){const badge=occupancyNode('patient',0),tier=id.split('_').pop(),text=document.createElement('b');text.textContent=tier[0];badge.append(text);badge.title=data.patientPositions[id].name;group.append(badge);}node.append(group);}
   const description=(o.label||o.id)+(o.occupied?' · patient present':'');node.setAttribute('aria-label',description);node.title=description;node.onclick=o.action||null;node.classList.toggle('folded',!!o.folded);node.classList.toggle('occupied',!!occupancy);
   // Explicit depth is independent of installation order / retained DOM nodes.
   // Mat below fixtures, seats and equipment; the internal raft stays on top.
   node.style.zIndex=o.id==='sea-tray'?'0':o.id.startsWith('rack-')?'1':o.id==='cabinet'?'2':o.id.startsWith('seat-')?(o.folded?'6':'3'):o.id==='life-raft'?'5':'4';
   Object.assign(node.style,{left:percent(o.x,reg.width),top:percent(o.y,reg.height),width:percent(o.w,reg.width),height:percent(o.h,reg.height),transform:`translate(-50%,-50%) rotate(${o.rotation||0}deg)`});
  }
 }
 toggle.onchange=()=>{render();bridge?.refresh();};
 window.CabinLive={connect(value){bridge=value;},render,setView(view,hasPlan){available=view==='plan'&&hasPlan;render();},getState:()=>({enabled:toggle.checked,available,objects:[...nodes.keys()]}),assets};
})();

