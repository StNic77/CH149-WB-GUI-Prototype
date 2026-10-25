/* Shared local capacity presentation; source limits, prototype state. */
(() => {
 const kg=n=>Number(n).toLocaleString('en-CA',{maximumFractionDigits:2})+' kg';
 function message(s){return `${kg(s.total)} total · ${s.limit===null?'Capacity not defined':kg(s.limit)+' limit · '+kg(s.excess||s.remaining)+(s.excess?' excess':' remaining')}`;}
 function element(s,label){const box=document.createElement('section');box.className='loading-status';box.dataset.limitStatus=s.level;box.setAttribute('role','status');const title=document.createElement('strong');title.textContent=(s.level==='caution'?'⚠ WARNING · ':'')+label;const body=document.createElement('p');body.textContent=message(s);box.append(title,body);if(s.issues?.length){const note=document.createElement('p');note.textContent=[...new Set(s.issues)].join(' ');box.append(note);}return box;}
 function overview(){
  let host=document.getElementById('detailWeightOverview');if(!host){host=document.createElement('details');host.id='detailWeightOverview';document.getElementById('viewTabs').after(host);}
  const s=window.CabinImageState(),locations=LOC.filter(l=>l.view===s.view&&['cabinet','shelf','storage'].includes(l.type)&&!window.CabinFloorEquipment.locations.includes(l.id));
  host.hidden=!locations.length;if(host.hidden)return;
  const states=locations.map(l=>({location:l,...window.CabinPlanning.shelf(s,l.id)})),warnings=states.filter(x=>x.level==='caution'),open=host.open;host.replaceChildren();host.open=open;
  const contents=states.reduce((n,r)=>n+r.total,0),cabinet=s.view==='cabinet',key='RF_SAR_EQUIPMENT_FWD_SAR_CABINET',structure=cabinet&&s.roleFit.has(key)?window.CH149_DATA.roleFit[key].w:0;
  const summary=document.createElement('summary');summary.textContent=`${cabinet?'SAR Cabinet':'Shelf / compartment weights'} · ${kg(contents+structure)}${warnings.length?' · ⚠ '+warnings.length+' WARNING'+(warnings.length>1?'S':''):''}`;host.append(summary);
  if(cabinet){const detail=document.createElement('p');detail.textContent=`Cabinet${s.roleFit.has(key)?' installed':' not installed'}: ${kg(structure)} · All contents: ${kg(contents)} · Combined: ${kg(structure+contents)}`;host.append(detail);const open=document.createElement('button');open.textContent='Open cabinet contents';open.onclick=()=>window.CabinEquipmentUI.openCabinet();host.append(open);}
  if(warnings.length)host.dataset.limitStatus='caution';else delete host.dataset.limitStatus;
  const grid=document.createElement('div');grid.className='detail-weight-grid';host.append(grid);
  for(const row of states){const b=document.createElement('button');b.type='button';b.dataset.weightLocation=row.id;b.dataset.limitStatus=row.level;b.append(document.createTextNode(row.location.label));const value=document.createElement('small');value.textContent=kg(row.total)+(row.level==='caution'?' · WARNING':'');b.append(value);b.onclick=()=>{s.selectedLoc=row.id;renderDetail();window.CabinImageMenu.showDetail(row.id);};grid.append(b);}
 }
 function area(){const selection=window.CabinFloorArea.getSelection(),panel=document.getElementById('floorAreaPanel');panel.querySelector('#localBayStatus')?.remove();if(selection.cargoKind||selection.space==='RAMP')return;const space=window.CH149_FLOOR_SPACES.find(row=>row.id===selection.space);if(!space)return;const status=window.CabinPlanning.bay(window.CabinImageState(),space.bay),box=element(status,'Bay load entries');box.id='localBayStatus';const note=document.createElement('p');note.textContent='Cargo, bay weight and equipment explicitly assigned to this bay. Fixed equipment, seats and people are excluded from this local check.';box.append(note);panel.querySelector('.floor-area-heading')?.after(box);}
 window.CabinLoadingFeedback={kg,message,element,overview,area};
 const floorRender=window.CabinFloorArea.render;window.CabinFloorArea.render=function(...args){floorRender(...args);area();};
 const original=window.renderDetail;window.renderDetail=function(...args){original(...args);overview();};
})();
