/* Action-specific destinations, independent of optional display layers. */
(() => {
 const E=window.CabinEquipment,D=window.CH149_DATA,layer=document.createElement('div');layer.id='equipmentDestinationHints';document.getElementById('planSheet').append(layer);
 function render(){
  layer.replaceChildren();const s=window.CabinImageState(),menu=window.CabinImageMenu.getState(),m=window.CabinBayLayer.getDisplayMapping();if(!menu.open||s.view!=='plan'||!m)return;
  let key,targets=[],module;
  if(menu.current==='basketPanel'){
   const side=menu.area==='BAY6_PORT'?'PORT':'STBD',other=side==='PORT'?'STBD':'PORT';key='ME_SAR_MISSION_EQUIP_RESCUE_BASKET_'+side;module='basket';targets=[{id:'CABIN_'+other+'_STOW',side:other,label:'Move basket here'}];
   const panel=document.getElementById('basketPanel');if(!panel.querySelector('#basketContents')){const b=document.createElement('button');b.id='basketContents';b.className='secondary';const id='CABIN_'+side+'_STOW',rows=window.CabinPlanning.missionRows(s).filter(r=>r.stowId===id&&r.key!==key&&r.quantity>0);b.textContent='Contents · '+rows.length+' items';b.onclick=()=>window.CabinEquipmentUI.openLocation(id);panel.querySelector('.floor-actions')?.after(b);}
  }else if(menu.current==='stokesPanel'){
   const from=menu.area==='RAMP'?'RAMP':'CABIN',to=from==='RAMP'?'CABIN':'RAMP';key='ME_SAR_MISSION_EQUIP_STOKES_LITTER_'+from;module='stokes';targets=[{id:to==='RAMP'?'RAMP_STOW':'CABIN_DEPLOYED',side:to,label:to==='RAMP'?'Stow Stokes here':'Deploy Stokes here'}];
  }else if(menu.current==='floorEquipmentPanel'&&document.getElementById('raftRemove')){
   key=window.CabinFloorEquipment.raftKey;module='raft';targets=window.CabinFloorEquipment.locations.filter(id=>id!==window.CabinFloorEquipment.raftLocation(s)).map(id=>({id,label:'Move life raft here'}));
  }
  if(!key||!s.mission.has(key))return;
  for(const target of targets){const loc=D.stowage[target.id],error=E.destinationReason(s,key,target.id),b=document.createElement('button');b.type='button';b.className='equipment-destination';b.dataset.destinationHint=target.id;b.dataset.available=String(!error);b.textContent=error?'Unavailable':target.label;b.title=error||target.label;b.setAttribute('aria-label',error?loc.name+' unavailable: '+error:target.label);b.disabled=!!error;const station=target.id==='RAMP_STOW'?13900:loc.arm,x=m.forwardX+(station-4875)/6518*(m.aftX-m.forwardX),y=m.centerY+(target.side==='PORT'?70:target.side==='STBD'?-70:module==='raft'?-60:0)*m.sourceScale;b.style.left=x/m.width*100+'%';b.style.top=y/m.height*100+'%';b.onclick=()=>{const result=module==='basket'?window.CabinBasket.move(s,key,target.id):module==='stokes'?window.CabinStokes.move(s,key,target.id):window.CabinFloorEquipment.moveRaft(s,target.id);if(!result.ok)return;E.refresh();if(module==='basket')window.CabinBasket.open(target.side);else if(module==='stokes')window.CabinStokes.open(target.side);else window.CabinFloorEquipment.openRaft(target.id);};layer.append(b);}
 }
 let scheduled=false;function schedule(){if(!scheduled){scheduled=true;queueMicrotask(()=>{scheduled=false;render();});}}
 new MutationObserver(schedule).observe(document.getElementById('imageMenu'),{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});window.CabinDestinationHints={render};
})();
