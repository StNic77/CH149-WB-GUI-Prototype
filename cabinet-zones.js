/* User-outlined navigation regions; masses/arms continue to come from the catalogue. */
(() => {
  const snapshot=window.CH149_CABINET_REGIONS,source=snapshot.source,ns='http://www.w3.org/2000/svg';
  const image=document.getElementById('cabinImage'),viewport=document.getElementById('planViewport');
  const overlay=document.createElementNS(ns,'svg');overlay.id='cabinetZones';overlay.classList.add('cabinet-zone-layer');
  overlay.setAttribute('viewBox',`0 0 ${source.width} ${source.height}`);overlay.setAttribute('aria-label','User-identified cabinet compartments');
  overlay.setAttribute('hidden','');document.getElementById('planSheet').append(overlay);
  const tools=document.getElementById('cabinetZoneTools'),reveal=document.getElementById('cabinetZoneReveal');
  const key='ch149-cabin-prototype.cabinet-regions.v1';
  const ids=Object.keys(snapshot.regions),labels=['A','B','C','D','E','F','G','H','Top surface'];
  let view=null,selected=ids[0],reader=null,onSelect=null,records=snapshot.regions;
  function valid(record){return Array.isArray(record?.points)&&record.points.length>=3&&record.points.length<=40&&record.points.every(p=>Array.isArray(p)&&p.length===2&&p.every(n=>Number.isFinite(n)&&n>=0&&n<=1));}
  function readReview(){
    records=snapshot.regions;
    try{const saved=JSON.parse(localStorage.getItem(key));if(saved?.schema===1&&saved.source?.file===source.file&&saved.source.width===source.width&&saved.source.height===source.height&&saved.source.sha256===source.sha256&&saved.regions&&typeof saved.regions==='object')records=saved.regions;}catch{}
  }
  function choose(id){selected=id;onSelect?.(id);paintSelection();}
  function paintSelection(){
    for(const node of overlay.querySelectorAll('[data-cabinet-location]')) {
      const active=node.getAttribute('data-cabinet-location')===selected;
      node.classList.toggle('selected',active);node.setAttribute('aria-pressed',String(active));
    }
    for(const node of overlay.querySelectorAll('[data-cabinet-label]'))node.classList.toggle('selected',node.getAttribute('data-cabinet-label')===selected);
    overlay.classList.toggle('reveal',reveal.checked);
    const location=window.CH149_DATA.stowage[selected];
    if(location)document.getElementById('cabinetZoneStatus').textContent=`Selected: ${location.name} · ${location.arm.toLocaleString('en-CA')} mm`;
  }
  function draw(){
    overlay.replaceChildren();
    ids.forEach((id,index)=>{
      const record=records[id],location=window.CH149_DATA.stowage[id];if(!valid(record)||!location)return;
      const polygon=document.createElementNS(ns,'polygon');polygon.setAttribute('points',record.points.map(([x,y])=>`${x*source.width},${y*source.height}`).join(' '));
      polygon.setAttribute('data-cabinet-location',id);polygon.setAttribute('tabindex','0');polygon.setAttribute('role','button');
      polygon.setAttribute('aria-label',`${labels[index]} · ${location.name} · configured arm ${location.arm} mm`);
      polygon.addEventListener('click',()=>choose(id));
      polygon.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();choose(id);}});
      overlay.append(polygon);
      const first=record.points[0],label=document.createElementNS(ns,'text');label.setAttribute('x',first[0]*source.width+12);label.setAttribute('y',first[1]*source.height+40);
      label.setAttribute('data-cabinet-label',id);label.setAttribute('aria-hidden','true');label.textContent=labels[index];overlay.append(label);
    });
    document.getElementById('cabinetZoneStatus').textContent=`${overlay.querySelectorAll('[data-cabinet-location]').length} identified locations · click a compartment to inspect it`;
    paintSelection();align();
  }
  function align(){
    const ready=view==='cabinet'&&image.getAttribute('src')===source.file&&image.complete&&image.naturalWidth===source.width&&image.naturalHeight===source.height;
    overlay.toggleAttribute('hidden',!ready);if(!ready)return;
    // Detail views use object-fit: contain. Match the actual letterboxed image,
    // not the outer panel, on every resize. Plan zoom is inactive in this view.
    const scale=Math.min(viewport.clientWidth/source.width,viewport.clientHeight/source.height);
    const width=source.width*scale,height=source.height*scale;
    Object.assign(overlay.style,{width:`${width}px`,height:`${height}px`,left:`${(viewport.clientWidth-width)/2}px`,top:`${(viewport.clientHeight-height)/2}px`});
  }
  reveal.onchange=paintSelection;image.addEventListener('load',align);new ResizeObserver(align).observe(viewport);
  window.addEventListener('storage',event=>{if(event.key===key){readReview();draw();}});
  window.CabinCabinetZones={
    connect({getSelection,select}){reader=getSelection;onSelect=select;},
    setSelection(id){if(ids.includes(id))selected=id;paintSelection();},
    setView(next){view=next;tools.hidden=view!=='cabinet';if(view==='cabinet'){
      readReview();if(ids.includes(reader?.()))selected=reader();draw();
      document.getElementById('viewSub').textContent='Click an identified compartment or choose a named location below';
      document.getElementById('photoCaption').textContent='User-identified compartment regions. Select one to inspect its prototype location details; the image remains a reference view.';
    }else overlay.setAttribute('hidden','');}
  };
})();
