/* Live code-native composition of unchanged source renders. No bitmap writes.
   Crop/display bounds are visual approximations, never load arms or fit rules. */
(() => {
 const reg=window.CH149_PLAN_REGISTRATION,base=reg.assets.BASELINE,data=window.CH149_DATA,ns='http://www.w3.org/2000/svg';
 const sheet=document.getElementById('planSheet'),wrap=document.querySelector('.photo-wrap');
 const background=document.createElement('div');background.id='liveCabinBackground';background.className='live-cabin-background';background.hidden=true;
 const img=document.createElement('img');img.src=base.file;img.alt='Cabin floor revealed beneath removed equipment';Object.assign(img.style,{left:base.x/reg.width*100+'%',top:base.y/reg.height*100+'%',width:base.size[0]*base.scale/reg.width*100+'%',height:base.size[1]*base.scale/reg.height*100+'%'});background.append(img);sheet.append(background);
 const roleBackdrop=document.createElementNS(ns,'svg');roleBackdrop.id='liveRoleBackdrop';roleBackdrop.setAttribute('viewBox',`0 0 ${reg.width} ${reg.height}`);roleBackdrop.setAttribute('aria-hidden','true');background.append(roleBackdrop);
 const layer=document.createElement('div');layer.id='liveCabinItems';layer.className='live-cabin-items';layer.hidden=true;sheet.append(layer);
 const occupants=document.createElement('div');occupants.id='liveOccupantLayer';occupants.className='live-occupant-layer';occupants.hidden=true;sheet.append(occupants);
 const referenceLabels=document.createElement('div');referenceLabels.id='referenceItemLabels';referenceLabels.hidden=true;sheet.append(referenceLabels);
 const referenceFit=document.createElement('button');referenceFit.id='referenceFitMarker';referenceFit.type='button';referenceFit.textContent='Sea tray removed';referenceFit.hidden=true;referenceFit.title='The sea tray is removed from the current fit. This is the Role reference image.';referenceFit.onclick=()=>window.CabinEquipmentUI.openRole('RF_AIRCRAFT_SYSTEMS_SEA_TRAY');document.getElementById('planViewport').append(referenceFit);
 const label=document.createElement('label'),toggle=document.createElement('input');toggle.type='checkbox';toggle.id='liveCabinToggle';toggle.checked=true;label.append(toggle,'Live equipment');document.getElementById('planTools').append(label);
 const occupantLabel=document.createElement('label'),occupantToggle=document.createElement('input');occupantToggle.type='checkbox';occupantToggle.id='occupantToggle';occupantToggle.checked=true;occupantLabel.append(occupantToggle,'Occupants');document.getElementById('planTools').append(occupantLabel);occupantToggle.onchange=()=>document.body.classList.toggle('occupants-hidden',!occupantToggle.checked);
 const notice=document.createElement('p');notice.id='liveCabinNotice';notice.className='live-cabin-notice';notice.hidden=true;notice.textContent='Live cabin · equipment and seats follow your changes. P2 and P3 stay in the background. Other equipment remains available in the contents lists.';document.getElementById('seatReferenceNotice').before(notice);
 const assets={
  basket:{file:'images/SAR_3_Pax_clean.png',size:[1864,843],crop:[1113,314,100,51],clip:'polygon(2% 3%,98% 3%,100% 12%,100% 88%,98% 97%,2% 97%,0 88%,0 12%)'},
  cot:{file:'images/SAR_3_Pax_clean.png',size:[1864,843],crop:[980,438,223,65]},
  stokes:{file:'images/SAR_3_Pax_clean.png',size:[1864,843],crop:[1284,308,190,64]},
  stokesCabin:{vector:'stokes',size:[340,99],crop:[0,0,340,99]},
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
 const visualLayouts=window.CH149_LIVE_VISUALS;
 for(const [role,layout]of Object.entries(visualLayouts)){const source=reg.assets[role];for(const [id,crop]of Object.entries(layout.seats||{}))assets[role+'-seat-'+id]={file:source.file,size:source.size,crop};for(const [id,crop]of Object.entries(layout))if(id!=='seats')assets[role+'-'+id]={file:source.file,size:source.size,crop,...(id==='seaTray'?{clip:role==='SAR10'?'polygon(0 0,73% 0,73% 61%,100% 61%,100% 100%,0 100%)':assets.seaTray.clip}:{})};}
 // Follow the PTA's full grey aft moulding while keeping the separate rack
 // underneath out of its artwork, so either fitting can be removed independently.
 assets['SAR3-pta'].clip=assets.cot.clip='polygon(5% 2%,88% 0,97% 4%,100% 20%,100% 80%,96% 96%,88% 96%,86% 84%,5% 84%,0 70%,0 28%)';
 // The complete pictured rack is the fitting artwork. Its visual detail does
 // not create separate bottle loads, contents, stowage or dependencies.
 let bridge,available=false;const nodes=new Map(),seatPoints=new Map();
 const percent=(v,total)=>v/total*100+'%';
 function stokesArtwork(){
  const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 340 99');svg.setAttribute('aria-hidden','true');svg.dataset.artwork='deployed-stokes';
  // Crisp open framework traced from the supplied litter references. Nothing
  // fills the gaps: the current sea tray/floor remains visible underneath.
  const outer='M31 7H307Q333 8 333 28V71Q332 93 309 93H28Q7 92 7 71V28Q8 7 31 7Z',rails='M13 27H329M8 49.5H333M12 72H329',ribs='M32 7V93M60 7V93M88 7V93M116 7V93M144 7V93M172 7V93M200 7V93M228 7V93M256 7V93M284 7V93M308 8V92';
  for(const [d,width]of [[outer,3],[rails,1.6],[ribs,1.6]]){const shadow=document.createElementNS(ns,'path');Object.entries({d,fill:'none',stroke:'#172b32','stroke-width':width+1.8,'stroke-opacity':'.42',transform:'translate(0 1)','stroke-linejoin':'round'}).forEach(([k,v])=>shadow.setAttribute(k,v));svg.append(shadow);}
  for(const [d,width,colour]of [[rails,1.5,'#db6b31'],[ribs,1.5,'#d9662d'],[outer,2.8,'#f0873e']]){const path=document.createElementNS(ns,'path');Object.entries({d,fill:'none',stroke:colour,'stroke-width':width,'stroke-linejoin':'round','stroke-linecap':'round'}).forEach(([k,v])=>path.setAttribute(k,v));svg.append(path);}
  return svg;
 }
 function imageNode(asset){if(asset.vector==='stokes')return stokesArtwork();const svg=document.createElementNS(ns,'svg'),[x,y,w,h]=asset.crop;svg.setAttribute('viewBox',`${x} ${y} ${w} ${h}`);svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');const image=document.createElementNS(ns,'image');image.setAttribute('href',asset.file);image.setAttribute('width',asset.size[0]);image.setAttribute('height',asset.size[1]);
  svg.append(image);if(asset.clip)svg.style.clipPath=asset.clip;return svg;}
 function sourceBackground(role){
  if(roleBackdrop.dataset.role===role)return;roleBackdrop.replaceChildren();roleBackdrop.dataset.role=role||'';
  const layout=visualLayouts[role],source=reg.assets[role];if(!layout||!source)return;
  const defs=document.createElementNS(ns,'defs'),mask=document.createElementNS(ns,'mask'),white=document.createElementNS(ns,'rect');mask.id='liveRoleItemMask';mask.setAttribute('maskUnits','userSpaceOnUse');mask.setAttribute('x','0');mask.setAttribute('y','0');mask.setAttribute('width',reg.width);mask.setAttribute('height',reg.height);Object.entries({x:0,y:0,width:reg.width,height:reg.height,fill:'white'}).forEach(([k,v])=>white.setAttribute(k,v));mask.append(white);
  // Keep every original floor/surrounding pixel. Only the separately rendered
  // item areas reveal the cleared underlay when that item is removed or moved.
  const cuts=[...Object.keys(layout.seats||{}).map(id=>assets[role+'-seat-'+id]),...Object.keys(layout).filter(id=>id!=='seats').map(id=>assets[role+'-'+id])];
  for(const a of cuts){const [x,y,w,h]=a.crop;let cut;if(a.clip){cut=document.createElementNS(ns,'polygon');const pairs=a.clip.slice(8,-1).split(',').map(s=>s.trim().split(/\s+/).map(v=>parseFloat(v)/100));cut.setAttribute('points',pairs.map(([px,py])=>`${source.x+(x+px*w)*source.scale},${source.y+(y+py*h)*source.scale}`).join(' '));}else{cut=document.createElementNS(ns,'rect');Object.entries({x:source.x+x*source.scale,y:source.y+y*source.scale,width:w*source.scale,height:h*source.scale}).forEach(([k,v])=>cut.setAttribute(k,v));}cut.setAttribute('fill','black');mask.append(cut);}
  defs.append(mask);const image=document.createElementNS(ns,'image');Object.entries({href:source.file,x:source.x,y:source.y,width:source.size[0]*source.scale,height:source.size[1]*source.scale,mask:'url(#liveRoleItemMask)'}).forEach(([k,v])=>image.setAttribute(k,v));roleBackdrop.append(defs,image);
 }
 function occupantKind(value,id){if(!value)return null;const type=window.CabinPlanning?.occupantType(id,value)??(data.crewSeats[id]?'crew':'pax');return type==='crew'?'crew':'passenger';}
 function occupancyNode(kind,rotation){const badge=document.createElement('span');badge.className='live-occupancy-marker';badge.dataset.occupancy=kind;badge.setAttribute('aria-hidden','true');badge.style.setProperty('--counter-rotation',`${-rotation}deg`);badge.innerHTML=kind==='patient'?'<svg viewBox="0 0 28 20"><circle cx="5" cy="7" r="3"/><path d="M10 8h8l5 5H10zM2 16h24"/></svg>':`<svg viewBox="0 0 20 24"><circle cx="10" cy="6" r="4"/><path d="M3 22v-6a7 7 0 0 1 14 0v6z"/></svg><b>${kind==='crew'?'C':'P'}</b>`;return badge;}
 function render(){
  if(!bridge)return;const state=bridge.state(),mapping=window.CabinBayLayer?.getDisplayMapping(),active=toggle.checked&&available&&!!mapping;
  const traySource=visualLayouts[state.preset]?.seaTray;referenceFit.hidden=active||!available||!mapping||!traySource||state.roleFit.has('RF_AIRCRAFT_SYSTEMS_SEA_TRAY');
  referenceLabels.hidden=active||!available||!mapping;referenceLabels.replaceChildren();
  background.hidden=layer.hidden=notice.hidden=!active;occupants.hidden=!available||!mapping;wrap.classList.toggle('live-cabin-active',active);seatPoints.clear();if(!available||!mapping)return;
  sourceBackground(state.preset);
  document.getElementById('photoChip').textContent=(state.preset?data.presets[state.preset]?.name:'No Role Config')+(active?' · live cabin':' · reference plan');document.getElementById('photoCaption').textContent=active?'Installed item pictures follow the current setup. Select an item to manage it or a floor cell for its available choices.':'Reference plan for the selected role. Seat and occupant layers show current state; switch on Live equipment to see equipment changes in the picture.';
  const seatNotice=document.getElementById('seatReferenceNotice');if(!seatNotice.hidden)seatNotice.textContent='Seat setup modified. Live layers show installed and folded seats; P2/P3 remain in the background.';
  const x=station=>mapping.forwardX+(station-4875)/6518*(mapping.aftX-mapping.forwardX),scale=base.scale,centre=reg.height/2,objects=[];
  function add(id,asset,station,offset,w,h,action,extra={}){objects.push({id,asset,x:x(station),y:centre+offset*scale,w,h,action,...extra});}
  function sourceObject(id,asset,source,action,extra={}){const a=assets[asset],r=reg.assets[source],[sx,sy,w,h]=a.crop;objects.push({id,asset,x:r.x+(sx+w/2)*r.scale,y:r.y+(sy+h/2)*r.scale,w:w*r.scale,h:h*r.scale,action,...extra});}
  function original(id,part,fallback,source,action,extra={}){const role=visualLayouts[state.preset]?.[part]?state.preset:source;sourceObject(id,assets[role+'-'+part]?role+'-'+part:fallback,role,action,extra);}
  // A floor covering leaves cell selection available; its controls live in the cell menus.
  if(state.roleFit.has('RF_AIRCRAFT_SYSTEMS_SEA_TRAY'))original('sea-tray','seaTray','seaTray','SAR3');
  if(state.roleFit.has('RF_SAR_EQUIPMENT_FWD_SAR_CABINET'))original('cabinet','cabinet','cabinet','SAR3',()=>bridge.view('cabinet'),{label:'SAR Cabinet'});
  const sensorKey='RF_SENSOR_SYSTEMS_SENSOR_WORKSTATION';
  if(state.roleFit.has(sensorKey))original('sensor-workstation','sensorWorkstation','SAR3-sensorWorkstation','SAR3',()=>window.CabinEquipmentUI.openRole(sensorKey),{label:'Sensor Workstation'});
  else {original('sensor-access','sensorWorkstation','SAR3-sensorWorkstation','SAR3',()=>window.CabinEquipmentUI.openRole(sensorKey),{label:'Install Sensor Workstation'});objects.at(-1).asset=null;}
  // Rack fitting only: no assigned contents or stowage dependencies yet.
  const oxygenKey='RF_SAR_EQUIPMENT_DIVE_O2_BOTTLE_RACK';
  if(state.roleFit.has(oxygenKey))original('oxygen-rack','oxygenRack','SAR3-oxygenRack','SAR3',()=>window.CabinEquipmentUI.openRole(oxygenKey),{label:'Dive Bottle / O₂ Rack'});
  for(const [suffix,asset]of [['FWD_STBD','rackFwdStbd'],['AFT_STBD','rackAftStbd'],['FWD_PORT','rackFwdPort'],['AFT_PORT','rackAftPort']])if(state.roleFit.has('RF_SAR_EQUIPMENT_CASEVAC_RACK_'+suffix))sourceObject('rack-'+suffix,asset,'CASEVAC',()=>window.CabinCasevac.open(suffix),{label:'CASEVAC rack · '+suffix.replace('_',' '),patientTiers:window.CabinCasevac.patientIds(suffix).filter(id=>state.patients[id])});
  for(const [id,seat]of Object.entries({...data.crewSeats,...data.paxSeats})){
   if(id==='C3'){const point=window.CabinSeatEditor.getC3Point(),occupant=state.seats.has(id)?occupantKind(state.occupants[id],id):null;add('c3-position',null,seat.arm,0,88,100,()=>bridge.seat(id),{...point,occupancy:occupant,label:'C3 cockpit jump position'+(occupant?' · '+occupant:'')});continue;}
   // P7 has no native reference image. Match P8's photographed row and size,
   // keeping P7's own calibrated longitudinal position and source W&B arm.
   if(id==='P7'){
    const role=state.preset,native=visualLayouts[role]?.seats?.P8,r=reg.assets[role],c=native;
    seatPoints.set(id,{x:x(seat.arm),y:native?r.y+(c[1]+c[3]/2)*r.scale:centre-65*scale});
    if(state.seats.has(id)){add('seat-P7',native?role+'-seat-P8':'pax',seat.arm,0,native?c[2]*r.scale:78,native?c[3]*r.scale:110,()=>bridge.seat(id),{y:seatPoints.get(id).y,occupancy:occupantKind(state.occupants[id],id),label:'P7'});}continue;
   }
   if(!state.seats.has(id))continue;
   const occupant=occupantKind(state.occupants[id],id);
   if(['C1','C2','P2','P3'].includes(id)){const port=/Port/i.test(seat.name);add('seat-'+id,null,seat.arm,port?65:-65,88,110,()=>bridge.seat(id),{occupancy:occupant,label:id+' · permanently installed'+(occupant?' · '+occupant:'')});continue;}
   const crew=!!data.crewSeats[id],port=/Port/i.test(seat.name),stbd=/Stbd/i.test(seat.name),folded=window.CH149_SEAT_RULES.occupancyBlockers(state,id).length>0;
   const asset=crew?(stbd?'crewStbd':'crewPort'):folded?'folded':'pax',width=crew?assets[asset].crop[2]*scale:78,height=crew?assets[asset].crop[3]*scale:folded?33:110;
   const action=()=>{window.CabinFloorArea.close();window.CabinRampArea?.close();window.CabinFloorEquipment?.close();window.CabinCasevac?.close();window.CabinBasket.close();window.CabinPTA.close();window.CabinStokes.close();bridge.seat(id);},details={folded,occupancy:occupant,label:id+(folded?' · folded':'')+(occupant?' · '+occupant:'')};
   if(!folded&&visualLayouts[state.preset]?.seats?.[id])sourceObject('seat-'+id,state.preset+'-seat-'+id,state.preset,action,details);
   else add('seat-'+id,asset,seat.arm,port?(folded?84:65):stbd?-(folded?84:65):0,width,height,action,{rotation:!crew&&port?180:0,...details});
  }
  const baskets=['PORT','STBD'].filter(side=>state.mission.has('ME_SAR_MISSION_EQUIP_RESCUE_BASKET_'+side));
  for(const side of baskets){const id=baskets.length===1?'basket':'basket-'+side,part='basket'+side,extra={label:'Rescue basket · '+side};if(visualLayouts[state.preset]?.[part])original(id,part,'basket','SAR3',()=>window.CabinBasket.open(side),extra);else add(id,'basket',data.stowage['CABIN_'+side+'_STOW'].arm,side==='PORT'?65:-65,186,96,()=>window.CabinBasket.open(side),{rotation:side==='PORT'?180:0,...extra});}
  if(state.roleFit.has('RF_SAR_EQUIPMENT_CSH_PATIENT_TREATMENT_SYSTEM'))original('pta','pta','cot','SAR3',()=>window.CabinPTA.open(),{occupied:!!state.patients.PTA,label:'PTA cot'});
  const litters=['CABIN','RAMP'].filter(side=>state.mission.has('ME_SAR_MISSION_EQUIP_STOKES_LITTER_'+side));
  const raftEditor=window.CabinFloorEquipment;if(state.mission.has(raftEditor.raftKey)&&!raftEditor.raftIssue(state)){const id=raftEditor.raftLocation(state),forward=id===raftEditor.locations[0];sourceObject('life-raft',forward?'raftB3':'raftB4',forward?'TRANSPORT':'CASEVAC',()=>raftEditor.openRaft(id),{label:'Internal life raft · '+data.stowage[id].name});}
  for(const side of litters){const id=litters.length===1?'stokes':'stokes-'+side;if(side==='RAMP')original(id,'stokesRamp','stokes','SAR3',()=>window.CabinStokes.open(side),{label:'Stokes litter · ramp stowed'});else add(id,'stokesCabin',7863,0,340,99,()=>window.CabinStokes.open(side),{occupied:!!state.patients.STOKES_CABIN,label:'Stokes litter · deployed B3/B4 Centre'});}
  if(!referenceLabels.hidden)for(const o of objects){const text=o.id==='sensor-workstation'?'SWS':o.id==='sensor-access'?'SWS +':o.id==='oxygen-rack'?'O₂ rack':o.id==='basket'||o.id.startsWith('basket-')?'Basket':null;if(!text)continue;const b=document.createElement('button');b.type='button';b.className='reference-item-label';b.dataset.referenceItem=o.id;b.textContent=text;b.setAttribute('aria-label',o.label||text);b.title=o.label||text;b.onclick=o.action;Object.assign(b.style,{left:percent(o.x,reg.width),top:percent(o.id.startsWith('sensor-')?o.y-o.h/2:o.y,reg.height)});referenceLabels.append(b);}
  occupants.replaceChildren();const keep=new Set(objects.map(o=>o.id));for(const [id,node]of nodes)if(!keep.has(id)){node.remove();nodes.delete(id);}
  for(const o of objects){let node=nodes.get(o.id);if(!node){node=document.createElement(o.action?'button':'div');if(o.action)node.type='button';node.className='live-cabin-object';node.dataset.liveObject=o.id;layer.append(node);nodes.set(o.id,node);}
   if(node.dataset.asset!==(o.asset||'')){node.replaceChildren(...(o.asset?[imageNode(assets[o.asset])]:[]));node.dataset.asset=o.asset||'';}
   if(o.id.startsWith('seat-'))seatPoints.set(o.id.slice(5),{x:o.x,y:o.y});
   const occupancy=o.occupied?'patient':o.occupancy;
   let anchor=null;if(occupancy||o.patientTiers?.length){anchor=document.createElement('div');anchor.className='live-occupant-anchor';anchor.dataset.occupantObject=o.id;occupants.append(anchor);}
   if(occupancy)anchor.append(occupancyNode(occupancy,o.rotation||0));
   if(o.patientTiers?.length){const group=document.createElement('span');group.className='live-rack-patients';for(const id of o.patientTiers){const badge=occupancyNode('patient',0),tier=id.split('_').pop(),text=document.createElement('b');text.textContent=tier[0];badge.append(text);badge.title=data.patientPositions[id].name;group.append(badge);}anchor.append(group);}
   const description=(o.label||o.id)+(o.occupied?' · patient present':'');node.setAttribute('aria-label',description);node.title=description;node.onclick=o.action||null;node.classList.toggle('folded',!!o.folded);node.classList.toggle('occupied',!!occupancy);
   // Explicit depth is independent of installation order / retained DOM nodes.
   // Mat below fixtures, seats and equipment; the internal raft stays on top.
   node.style.zIndex=o.id==='sea-tray'?'0':o.id.startsWith('rack-')?'1':o.id==='cabinet'?'2':o.id.startsWith('seat-')?(o.folded?'6':'3'):o.id==='life-raft'?'5':'4';
   const placement={left:percent(o.x,reg.width),top:percent(o.y,reg.height),width:percent(o.w,reg.width),height:percent(o.h,reg.height),transform:`translate(-50%,-50%) rotate(${o.rotation||0}deg)`};Object.assign(node.style,placement);if(anchor)Object.assign(anchor.style,placement);
  }
 }
 toggle.onchange=()=>{render();bridge?.refresh();};
 window.CabinLive={connect(value){bridge=value;},render,setView(view,hasPlan){available=view==='plan'&&hasPlan;render();},getSeatPoint:id=>seatPoints.get(id)||null,getState:()=>({enabled:toggle.checked,available,objects:[...nodes.keys()]}),assets,occupancySymbol:kind=>occupancyNode(kind,0)};
})();

