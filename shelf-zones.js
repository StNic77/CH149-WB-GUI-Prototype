/* Shared display layer for reviewed shelf images. No placement/weight mutations. */
(() => {
  const ns='http://www.w3.org/2000/svg',image=document.getElementById('cabinImage'),viewport=document.getElementById('planViewport');
  function create(cfg,snapshot,options){
    const source=cfg.source,overlay=document.createElementNS(ns,'svg');overlay.id=options.overlay;overlay.classList.add('cabinet-zone-layer');overlay.setAttribute('viewBox',`0 0 ${source.width} ${source.height}`);overlay.setAttribute('aria-label',options.title+' areas');overlay.setAttribute('hidden','');document.getElementById('planSheet').append(overlay);
    const tools=document.createElement('div');tools.id=options.tools;tools.className='cabinet-zone-tools';tools.hidden=true;
    const label=document.createElement('label'),reveal=document.createElement('input');reveal.type='checkbox';reveal.id=options.reveal;label.append(reveal,options.outlineLabel||'Show shelf outlines');const status=document.createElement('span');status.id=options.status;
    const link=document.createElement('a');link.href=options.review;link.target='_blank';link.rel='noopener';link.textContent=options.linkLabel||'Define shelf areas';tools.append(label,status,link);document.getElementById('seatReferenceNotice').before(tools);
    let view=null,selected=null,select=null,reader=null,records=snapshot?.regions||{};
    const selector=`[data-${options.attribute}]`;
    const matches=value=>value?.schema===1&&value.source?.file===source.file&&value.source.width===source.width&&value.source.height===source.height&&value.source.sha256===source.sha256;
    function read(){records=snapshot?.regions||{};try{const local=JSON.parse(localStorage.getItem(cfg.key));if(matches(local))records=local.regions;}catch{}}
    function valid(record){return Array.isArray(record?.points)&&record.points.length>=3&&record.points.every(p=>Array.isArray(p)&&p.length===2&&p.every(n=>Number.isFinite(n)&&n>=0&&n<=1));}
    function paint(){for(const polygon of overlay.querySelectorAll(selector)){const active=polygon.getAttribute('data-'+options.attribute)===selected;polygon.classList.toggle('selected',active);polygon.setAttribute('aria-pressed',String(active));}overlay.classList.toggle('reveal',reveal.checked);const count=overlay.querySelectorAll('polygon').length,location=window.CH149_DATA.stowage[selected];status.textContent=!count?'No areas defined yet · use the definition link':!location?`${count} identified areas · select one to inspect`:`${cfg.names[cfg.ids.indexOf(selected)]} · ${location.arm.toLocaleString('en-CA')} mm${Number.isFinite(location.maxKg)?' · limit '+location.maxKg+' kg':''}`;}
    function choose(id){selected=id;select?.(id);paint();}
    // Thin ramp shelf faces need a finger-sized target without changing their
    // reviewed outlines. Resolve nearby taps to the nearest actual shelf edge.
    if(options.view==='ramp'){
      let down=null;
      viewport.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,moved:false};});
      viewport.addEventListener('pointermove',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>7)down.moved=true;});
      viewport.addEventListener('pointercancel',()=>{down=null;});
      viewport.addEventListener('click',e=>{
        if(view!=='ramp'||overlay.hasAttribute('hidden')||!down||down.moved||e.target.closest('button,[role=button],a'))return;
        const matrix=overlay.getScreenCTM();if(!matrix)return;let nearest=null,best=23;
        for(const id of cfg.ids){if(!valid(records[id]))continue;const points=records[id].points.map(([x,y])=>new DOMPoint(x*source.width,y*source.height).matrixTransform(matrix));
          for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((down.x-a.x)*dx+(down.y-a.y)*dy)/(dx*dx+dy*dy||1))),distance=Math.hypot(down.x-a.x-t*dx,down.y-a.y-t*dy);if(distance<best){best=distance;nearest=id;}}
        }
        if(nearest){e.preventDefault();e.stopImmediatePropagation();choose(nearest);}
      },true);
    }
    function align(){const ready=view===options.view&&image.getAttribute('src')===source.file&&image.complete&&image.naturalWidth===source.width&&image.naturalHeight===source.height;overlay.toggleAttribute('hidden',!ready);if(!ready)return;const scale=Math.min(viewport.clientWidth/source.width,viewport.clientHeight/source.height),width=source.width*scale,height=source.height*scale;Object.assign(overlay.style,{left:`${(viewport.clientWidth-width)/2}px`,top:`${(viewport.clientHeight-height)/2}px`,width:`${width}px`,height:`${height}px`});}
    function draw(){overlay.replaceChildren();cfg.ids.forEach((id,index)=>{const record=records?.[id];if(!valid(record)||!window.CH149_DATA.stowage[id])return;const polygon=document.createElementNS(ns,'polygon');polygon.setAttribute('points',record.points.map(([x,y])=>`${x*source.width},${y*source.height}`).join(' '));polygon.setAttribute('data-'+options.attribute,id);polygon.setAttribute('role','button');polygon.setAttribute('tabindex','0');polygon.setAttribute('aria-label',`${cfg.names[index]} · ${window.CH149_DATA.stowage[id].name}`);polygon.onclick=()=>choose(id);polygon.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();choose(id);}};overlay.append(polygon);const text=document.createElementNS(ns,'text');text.setAttribute('x',record.points[0][0]*source.width+12);text.setAttribute('y',record.points[0][1]*source.height+40);text.textContent=cfg.names[index];overlay.append(text);});paint();align();}
    async function loadProject(){if(location.protocol==='file:')return;try{const response=await fetch(cfg.endpoint,{cache:'no-store'});if(!response.ok)return;const project=await response.json();if(!matches(project))return;const local=JSON.parse(localStorage.getItem(cfg.key)||'null');if(!local||(Date.parse(project.updatedAt)||0)>=(Date.parse(local.updatedAt)||0)){records=project.regions;localStorage.setItem(cfg.key,JSON.stringify(project));if(view===options.view)draw();}}catch{}}
    reveal.onchange=paint;image.addEventListener('load',align);new ResizeObserver(align).observe(viewport);window.addEventListener('storage',event=>{if(event.key===cfg.key){read();draw();}});window.addEventListener('focus',()=>{if(view===options.view)loadProject();});
    return {connect(value){reader=value.getSelection;select=value.select;},setSelection(id){selected=cfg.ids.includes(id)?id:null;paint();},setView(value){view=value;tools.hidden=view!==options.view;if(view===options.view){read();selected=cfg.ids.includes(reader?.())?reader():null;draw();loadProject();}else overlay.setAttribute('hidden','');}};
  }
  window.CabinForwardShelves=create(window.CH149_FORWARD_SHELF_REVIEW,window.CH149_FORWARD_SHELF_REGIONS,{overlay:'forwardShelfZones',tools:'forwardShelfZoneTools',reveal:'forwardShelfReveal',status:'forwardShelfStatus',title:'Port forward shelf',review:'forward-shelf-review.html',view:'forward',attribute:'forward-shelf'});
  window.CabinRampShelves=create(window.CH149_RAMP_SHELF_REVIEW,window.CH149_RAMP_SHELF_REGIONS,{overlay:'rampShelfZones',tools:'rampShelfZoneTools',reveal:'rampShelfReveal',status:'rampShelfStatus',title:'Ramp shelf',review:'ramp-shelf-review.html',view:'ramp',attribute:'ramp-shelf'});
  window.CabinPortOverhead=create(window.CH149_PORT_OVERHEAD_REVIEW,window.CH149_PORT_OVERHEAD_REGIONS,{overlay:'portOverheadZones',tools:'portOverheadZoneTools',reveal:'portOverheadReveal',status:'portOverheadStatus',title:'Port overhead',review:'port-overhead-review.html',view:'pta',attribute:'port-overhead',outlineLabel:'Show overhead outlines',linkLabel:'Define Port overhead area'});
  window.CabinStbdOverhead=create(window.CH149_STBD_OVERHEAD_REVIEW,window.CH149_STBD_OVERHEAD_REGIONS,{overlay:'stbdOverheadZones',tools:'stbdOverheadZoneTools',reveal:'stbdOverheadReveal',status:'stbdOverheadStatus',title:'Stbd overhead',review:'stbd-overhead-review.html',view:'stbd',attribute:'stbd-overhead',outlineLabel:'Show overhead outlines',linkLabel:'Define Stbd overhead area'});
})();
