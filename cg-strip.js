/* Enlarged weight-specific CG slices, with the full source envelope on demand. */
(() => {
 const ns='http://www.w3.org/2000/svg',number=n=>Math.round(n).toLocaleString('en-CA');
 let fullOpen=false,lastDetails=null;
 function scale(result){const e=window.CabinPlanning.source.envelope,arms=[...e.envMain,...e.envAlt].map(p=>p.cg).concat(result.takeoff.cg,result.landing.cg,...(result.burnTrack||[]).map(p=>p.cg));return {min:Math.floor((Math.min(...arms)-60)/100)*100,max:Math.ceil((Math.max(...arms)+60)/100)*100};}
 function svgNode(name,attrs,parent){const el=document.createElementNS(ns,name);for(const [key,value]of Object.entries(attrs))el.setAttribute(key,value);parent.append(el);return el;}
 function fullEnvelope(result,domain,width,condition){
  const height=340,left=58,right=width-18,top=24,bottom=height-34,envelope=window.CabinPlanning.source.envelope;
  const weights=[...envelope.envMain,...envelope.envAlt].map(p=>p.w).concat(result.takeoff.weight,result.landing.weight),minW=Math.floor((Math.min(...weights)-200)/500)*500,maxW=Math.ceil((Math.max(...weights)+200)/500)*500;
  const x=cg=>left+(cg-domain.min)/(domain.max-domain.min)*(right-left),y=w=>bottom-(w-minW)/(maxW-minW)*(bottom-top);
  const svg=document.createElementNS(ns,'svg');svg.classList.add('cg-full-envelope');svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.setAttribute('role','img');svg.setAttribute('aria-label','Full weight versus longitudinal CG envelope with takeoff and estimated landing points');
  for(let i=0;i<=4;i++){const arm=domain.min+(domain.max-domain.min)*i/4,xx=x(arm);svgNode('line',{x1:xx,x2:xx,y1:top,y2:bottom,class:'cg-full-grid'},svg);svgNode('text',{x:xx,y:bottom+15,'text-anchor':'middle',class:'cg-full-tick'},svg).textContent=number(arm);}
  for(let i=0;i<=3;i++){const w=minW+(maxW-minW)*i/3,yy=y(w);svgNode('line',{x1:left,x2:right,y1:yy,y2:yy,class:'cg-full-grid'},svg);svgNode('text',{x:left-6,y:yy+3,'text-anchor':'end',class:'cg-full-tick'},svg).textContent=number(w);}
  svgNode('text',{x:left,y:13,class:'cg-full-title'},svg).textContent='Weight (kg)';svgNode('text',{x:(left+right)/2,y:height-3,'text-anchor':'middle',class:'cg-full-title'},svg).textContent='Longitudinal CG (mm)';
  for(const [kind,polygon]of [['normal',envelope.envMain],['alternate',envelope.envAlt]])svgNode('polygon',{points:polygon.map(p=>`${x(p.cg)},${y(p.w)}`).join(' '),class:'cg-full-area','data-full-envelope':kind},svg);
  if(!result.manual&&result.burnTrack?.length>1){
   // Join the actual solver samples directly; rounded joins soften the display
   // without spline overshoot or changing the predicted CG at any fuel quantity.
   svgNode('polyline',{points:result.burnTrack.map(p=>`${x(p.cg)},${y(p.w)}`).join(' '),class:'cg-burn-path','data-burn-path':'auto'},svg);
  }
  const near=Math.abs(y(result.takeoff.weight)-y(result.landing.weight))<28;
  for(const [index,kind,label]of [[0,'takeoff','Takeoff'],[1,'landing','Landing est.']]){
   const p=result[kind],xx=x(p.cg),yy=y(p.weight),group=svgNode('g',{'data-full-point':kind,'data-cg-status':p.cgStatus,'data-muted':String(condition!=='both'&&condition!==kind)},svg);
   if(p.limits&&(condition==='both'||condition===kind))svgNode('line',{x1:x(p.limits.forward),x2:x(p.limits.aft),y1:yy,y2:yy,class:'cg-full-slice'},group);
   svgNode('polygon',{points:index?`${xx},${yy-5} ${xx-5},${yy} ${xx},${yy+5} ${xx+5},${yy}`:`${xx},${yy-6} ${xx-6},${yy+5} ${xx+6},${yy+5}`,class:'cg-full-marker','data-cg':p.cg,'data-weight':p.weight},group);
   const labelX=Math.max(left+2,Math.min(right-130,xx+10)),labelY=Math.max(top+12,Math.min(bottom-4,yy+(index?19:-12)+(near&&index?10:0)));
   svgNode('text',{x:labelX,y:labelY,class:'cg-full-label'},group).textContent=label+' · '+number(p.cg)+' mm';
  }
  return svg;
 }
 function render(result,condition,select,width){
  // Read the native state synchronously; Safari may defer its toggle event.
  if(lastDetails)fullOpen=lastDetails.open;
  const box=document.createElement('section');box.id='cgLiveStrip';box.className='cg-live-strip';box.setAttribute('aria-label','Live takeoff and landing CG ranges');
  const domain=scale(result),position=arm=>(arm-domain.min)/(domain.max-domain.min)*100;box.dataset.condition=condition;
  box.dataset.scaleMin=domain.min;box.dataset.scaleMax=domain.max;
  const heading=document.createElement('h3');heading.textContent='Live CG ranges';box.append(heading);
  const explanation=document.createElement('p');explanation.className='cg-strip-explanation';explanation.textContent='Each band follows its own weight. Both rows share the same arm scale; out-of-limit CG stays visible. Estimated landing CG uses your selected fuel at landing (reserve), capped at fuel aboard, and assumes the same non-fuel load as takeoff. Calculated CG values update live as aircraft weight, fuel quantity or load positions change.';box.append(explanation);
  for(const [kind,label,symbol]of [['takeoff','Takeoff','▲'],['landing','Estimated landing','◆']]){
   const p=result[kind],row=document.createElement('article');row.className='cg-strip-row';row.dataset.cgStripRow=kind;row.dataset.cgResult=kind;row.dataset.cgStatus=p.cgStatus;row.dataset.weightStatus=p.weightStatus;row.dataset.selected=String(condition===kind);
   const button=document.createElement('button');button.type='button';button.className='cg-strip-select';button.setAttribute('aria-pressed',String(condition===kind));button.setAttribute('aria-label','Show '+label.toLowerCase()+' allowable band on aircraft');button.onclick=()=>select(kind);
   const name=document.createElement('span');name.textContent=symbol+' '+label+' · '+number(p.weight)+' kg';const current=document.createElement('strong');current.className='cg-strip-current';current.textContent=(p.cgStatus==='out'?'OUT CG ':'CG ')+number(p.cg)+' mm · '+p.band;button.append(name,current);row.append(button);
   const track=document.createElement('div');track.className='cg-strip-track';
   if(p.limits){const band=document.createElement('span');band.className='cg-strip-allowed';band.dataset.stripRange=kind;band.dataset.forwardCg=p.limits.forward;band.dataset.aftCg=p.limits.aft;band.style.left=position(p.limits.forward)+'%';band.style.width=(position(p.limits.aft)-position(p.limits.forward))+'%';track.append(band);}
   const marker=document.createElement('span');marker.className='cg-strip-marker';marker.dataset.stripMarker=kind;marker.dataset.cg=p.cg;marker.style.left=position(p.cg)+'%';marker.textContent=symbol;marker.setAttribute('aria-hidden','true');track.append(marker);row.append(track);
   const status=document.createElement('p');status.className='cg-strip-margins';
   if(!p.limits)status.textContent='No allowable CG range at this weight'+(p.weightStatus==='overweight'?' · OVER WEIGHT':'');
   else {const f=p.cg-p.limits.forward,a=p.limits.aft-p.cg;status.textContent='Allowable CG '+number(p.limits.forward)+'–'+number(p.limits.aft)+' mm · '+(f<0?Math.ceil(-f)+' mm forward of limit':a<0?Math.ceil(-a)+' mm aft of limit':'Fwd margin '+Math.floor(f)+' mm · Aft margin '+Math.floor(a)+' mm');}
   row.append(status);box.append(row);
  }
  const axis=document.createElement('div');axis.className='cg-strip-axis';for(let i=0;i<=4;i++){const tick=document.createElement('span');tick.textContent=number(domain.min+(domain.max-domain.min)*i/4);axis.append(tick);}box.append(axis);
  const axisLabel=document.createElement('p');axisLabel.className='cg-strip-axis-label';axisLabel.textContent='Fwd ← Longitudinal CG (mm) → Aft';box.append(axisLabel);
  const details=document.createElement('details');details.id='cgFullEnvelopeDetails';details.open=fullOpen;const title=document.createElement('summary');title.textContent='Full weight-versus-CG envelope';details.append(title);
  const note=document.createElement('p');note.className='cg-strip-explanation';note.textContent='Green is the normal envelope; amber is the alternate envelope. Blue shows takeoff; purple shows estimated landing. '+(result.manual?'Predicted burn path is unavailable with manual tank quantities.':'The continuous line predicts automatic fuel burn from takeoff to your fuel at landing; non-fuel loads stay unchanged.');details.append(note,fullEnvelope(result,domain,Math.max(300,width),condition));lastDetails=details;details.addEventListener('toggle',()=>{if(lastDetails===details)fullOpen=details.open;});box.append(details);
  return box;
 }
 window.CabinCGStrip=Object.freeze({render});
})();
