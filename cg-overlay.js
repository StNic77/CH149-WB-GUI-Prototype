/* Read-only cabin-centreline CG view. Aircraft loads and source calculations are unchanged. */
(() => {
 const ns='http://www.w3.org/2000/svg';
 const viewport=document.getElementById('planViewport'),sheet=document.getElementById('planSheet');
 const layer=document.createElementNS(ns,'svg');
 layer.id='cgEnvelopeLayer';layer.classList.add('cg-envelope-layer');
 layer.setAttribute('aria-hidden','true');layer.setAttribute('preserveAspectRatio','none');viewport.append(layer);
 const controls=document.createElement('div');controls.className='overlay-controls';
 controls.innerHTML='<label><input type="checkbox" id="cgLayerToggle">Longitudinal CG</label>';
 document.querySelector('.view-framing').after(controls);
 const toggle=document.getElementById('cgLayerToggle'),summary=document.createElement('section');
 summary.id='cgLayerSummary';summary.className='cg-layer-summary';
 summary.setAttribute('aria-label','Takeoff and estimated landing centre of gravity');
 document.querySelector('.photo-wrap').after(summary);
 let condition='takeoff';
 const number=n=>Math.round(n).toLocaleString('en-CA');
 function node(name,attrs,parent){const el=document.createElementNS(ns,name);for(const [key,value]of Object.entries(attrs))el.setAttribute(key,value);parent.append(el);return el;}
 function projection(mapping){
  const view=viewport.getBoundingClientRect(),plane=sheet.getBoundingClientRect();
  const planeX=arm=>mapping.forwardX+(arm-4875)/6518*(mapping.aftX-mapping.forwardX);
  return {width:viewport.clientWidth,height:viewport.clientHeight,
   x:arm=>plane.left-view.left+planeX(arm)/mapping.width*plane.width,
   y:plane.top-view.top+mapping.centerY/mapping.height*plane.height,
   half:125*mapping.sourceScale/mapping.height*plane.height};
 }
 function drawCabin(result,mapping){
  const p=projection(mapping),{width,height,x,y}=p,active=result[condition];
  layer.setAttribute('viewBox',`0 0 ${width} ${height}`);
  layer.dataset.condition=condition;
  const defs=node('defs',{},layer),clip=node('clipPath',{id:'cgCabinDisplayClip'},defs);
  // Reuse the existing cabin display strip for visual clipping only. It is not a surveyed floor outline.
  node('rect',{x:x(4875),y:y-p.half,width:x(11393)-x(4875),height:2*p.half,'data-display-only':'true'},clip);
  node('line',{x1:x(4875),x2:x(11393),y1:y,y2:y,class:'cg-cabin-centreline'},layer);
  if(active.limits){
   const f=x(active.limits.forward),a=x(active.limits.aft),group=node('g',{'clip-path':'url(#cgCabinDisplayClip)'},layer);
   node('rect',{x:f,y:y-p.half,width:a-f,height:2*p.half,class:'cg-cabin-allowed-band',
    'data-condition-range':condition,'data-forward-cg':active.limits.forward,'data-aft-cg':active.limits.aft,'data-weight-status':active.weightStatus},group);
   for(const [name,arm]of [['forward',active.limits.forward],['aft',active.limits.aft]])
    node('line',{x1:x(arm),x2:x(arm),y1:y-p.half,y2:y+p.half,class:'cg-cabin-limit','data-cg-limit':name,'data-arm':arm},group);
  }
  const leftHand=document.getElementById('controlHand').value==='left',safeLeft=leftHand?82:8,safeRight=width-(leftHand?8:82);
  node('text',{x:safeLeft+2,y:18,class:'cg-cabin-condition-label'},layer).textContent=(condition==='takeoff'?'Takeoff':'Estimated landing')+' · '+number(active.weight)+' kg';
  node('text',{x:safeLeft+2,y:34,class:'cg-cabin-range-label'},layer).textContent=active.limits?'Fwd '+number(active.limits.forward)+' mm  —  Aft '+number(active.limits.aft)+' mm':'No allowable CG band at this weight';
  for(const [index,kind,label]of [[0,'takeoff','Takeoff'],[1,'landing','Landing est.']]){
   const point=result[kind],xx=x(point.cg),group=node('g',{'data-cg-track':kind,'data-cg-status':point.cgStatus,'data-weight-status':point.weightStatus},layer);
   const labelWidth=Math.min(167,(safeRight-safeLeft)*.58),gap=22;
   let lx=index?xx+gap:xx-labelWidth-gap,ly=y-23;
   if(lx<safeLeft||lx+labelWidth>safeRight){lx=Math.max(safeLeft,Math.min(safeRight-labelWidth,lx));ly=y+(index?30:-76);}
   ly=Math.max(44,Math.min(height-52,ly));
   const attach=xx<lx?lx:xx>lx+labelWidth?lx+labelWidth:Math.max(lx+8,Math.min(lx+labelWidth-8,xx));
   node('line',{x1:xx,y1:y,x2:attach,y2:ly+23,class:'cg-cabin-leader'},group);
   node('rect',{x:lx,y:ly,width:labelWidth,height:46,rx:6,class:'cg-cabin-label-card'},group);
   node('text',{x:lx+8,y:ly+15,class:'cg-cabin-point-label'},group).textContent=(index?'◆ ':'▲ ')+label;
   node('text',{x:lx+8,y:ly+30,class:'cg-cabin-point-value'},group).textContent=(point.cgStatus==='out'?'OUT CG ':'CG ')+number(point.cg)+' mm · '+point.band;
   node('text',{x:lx+8,y:ly+42,class:'cg-cabin-point-weight'},group).textContent=number(point.weight)+' kg';
  }
  // Draw both symbols last, at their true arm on the same aircraft centreline.
  // Close or identical CGs are never separated artificially to make them look distinct.
  for(const [kind,size]of [['takeoff',8],['landing',5]]){
   const point=result[kind],xx=x(point.cg),group=node('g',{'data-cg-track':kind,'data-cg-status':point.cgStatus,'data-weight-status':point.weightStatus},layer);
   node('polygon',{points:kind==='takeoff'?`${xx},${y-size} ${xx-size},${y+size} ${xx+size},${y+size}`:`${xx},${y-size} ${xx-size},${y} ${xx},${y+size} ${xx+size},${y}`,
    class:'cg-point-symbol','data-cg-marker':kind,'data-cg':point.cg,'data-weight':point.weight,'data-centre-x':xx,'data-centre-y':y},group);
  }
 }
 function focusCG(){
  const state=window.CabinImageState(),result=window.CabinCGEnvelope.flight(state),mapping=window.CabinBayLayer.getDisplayMapping();
  if(!result.ready||!mapping)return;
  const point=result[condition],arm=point.limits?(point.limits.forward+point.limits.aft)/2:point.cg;
  const viewer=window.CabinPlanViewer;viewer.changeZoom(4);
  const p=projection(mapping),view=viewer.getState();
  viewer.pan(view.panX+(.5-p.x(arm)/p.width),view.panY+(.5-p.y/p.height));
 }
 function render(){
  const state=window.CabinImageState(),enabled=toggle.checked&&state.view==='plan',mapping=window.CabinBayLayer.getDisplayMapping();
  document.body.classList.toggle('cg-layer-active',enabled&&!!mapping);
  summary.hidden=!enabled;layer.style.display=enabled&&mapping?'':'none';layer.replaceChildren();summary.replaceChildren();
  if(!enabled)return;
  const heading=document.createElement('div');heading.className='cg-layer-heading';
  const title=document.createElement('strong');title.textContent='Longitudinal CG';
  const fuelButton=document.createElement('button');fuelButton.type='button';fuelButton.textContent='Fuel / reserve';fuelButton.onclick=()=>window.CabinFuelUI.open();
  heading.append(title,fuelButton);summary.append(heading);
  const choices=document.createElement('div');choices.className='cg-condition-choices';
  for(const [key,label]of [['takeoff','Takeoff range'],['landing','Landing range']]){
   const button=document.createElement('button');button.type='button';button.dataset.cgCondition=key;button.textContent=label;
   button.setAttribute('aria-pressed',String(condition===key));button.onclick=()=>{condition=key;render();};choices.append(button);
  }
  for(const [id,label,action]of [['cgFocus','Focus CG',focusCG],['cgWholeCabin','Whole cabin',()=>window.CabinPlanViewer.fit()]]){
   const button=document.createElement('button');button.type='button';button.id=id;button.textContent=label;button.onclick=action;choices.append(button);
  }
  summary.append(choices);
  const result=window.CabinCGEnvelope.flight(state);
  if(!mapping||!result.ready){const note=document.createElement('p');note.textContent=!mapping?'Aircraft station alignment is unavailable.':result.reason;summary.append(note);return;}
  drawCabin(result,mapping);
  summary.append(window.CabinCGStrip.render(result,condition,key=>{condition=key;render();},summary.clientWidth-24));
  const note=document.createElement('p');note.className='cg-layer-note';
  note.textContent='The shaded cabin band uses the selected condition’s weight. Both markers stay at their calibrated arm on the aircraft centreline; each is checked against its own weight’s limits. Focus CG enlarges the true spacing. Landing uses '+number(result.landingFuel)+' kg fuel, capped at fuel aboard, from your selected '+number(result.reserve)+' kg fuel at landing (reserve); non-fuel loads stay unchanged. All CG values update live with aircraft weight, fuel and load-position changes.'+(result.shortfall?' Reserve shortfall: '+number(result.shortfall)+' kg.':'')+(result.manual?' Manual tanks: estimated landing uses the normal mapped fuel distribution.':'');summary.append(note);
 }
 toggle.addEventListener('change',render);document.getElementById('controlHand').addEventListener('change',render);
 const oldSummary=window.CabinAircraftSummary.render;
 window.CabinAircraftSummary.render=function(...args){const result=oldSummary(...args);render();return result;};
 const oldView=window.CabinImageMenu.onView;
 window.CabinImageMenu.onView=function(...args){const result=oldView(...args);render();return result;};
 window.CabinCGOverlay=Object.freeze({render});render();new ResizeObserver(render).observe(viewport);
})();
