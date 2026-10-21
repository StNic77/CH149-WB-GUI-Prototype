(() => {
  const definition=window.CH149_REGION_REVIEW_CONFIG||{};
  const source=definition.source||{file:'images/SAR Cabinet.png',width:2880,height:1620,sha256:'7E493F71880D6C200E6BD9081EAA478F849655BE0F14EAD24C37B8639A37BB7F'};
  const ids=definition.ids||['SAR_CABINET_FWD_TOP','SAR_CABINET_FWD_BTM','SAR_CABINET_UPPER','SAR_CABINET_TOP','LOCKBOX_TOP','LOCKBOX_BTM','SAR_CABINET_MIDDLE','SAR_CABINET_BOTTOM','CABINET_TOP_SURFACE'];
  const names=definition.names||['A · Forward top','B · Forward bottom','C · Upper','D · Top','E · Lockbox top shelf','F · Lockbox bottom shelf','G · Middle','H · Bottom','On top of cabinet'];
  const key=definition.key||'ch149-cabin-prototype.cabinet-regions.v1',svgNS='http://www.w3.org/2000/svg';
  const $=id=>document.getElementById(id),viewport=$('regionViewport'),sheet=$('regionSheet'),overlay=$('regionOverlay');
  let selected=ids[0],regions={},draft=null,history=[],zoom=1,panX=0,panY=0,gesture=null,suppressClick=false;
  const clone=value=>JSON.parse(JSON.stringify(value));
  function validPolygon(points){return Array.isArray(points)&&points.length>=3&&points.length<=40&&points.every(p=>Array.isArray(p)&&p.length===2&&p.every(n=>Number.isFinite(n)&&n>=0&&n<=1))&&Math.abs(points.reduce((sum,p,i)=>{const q=points[(i+1)%points.length];return sum+p[0]*q[1]-q[0]*p[1];},0))>.00001;}
  try{const saved=JSON.parse(localStorage.getItem(key));if(saved?.schema===1&&saved.source?.file===source.file&&saved.source.width===source.width&&saved.source.height===source.height&&saved.source.sha256===source.sha256)for(const id of ids)if(validPolygon(saved.regions?.[id]?.points))regions[id]={locationId:id,points:clone(saved.regions[id].points),review:'user-outlined visible region',updatedAt:saved.regions[id].updatedAt};}catch{}
  function save(){try{localStorage.setItem(key,JSON.stringify({schema:1,source,regions,updatedAt:new Date().toISOString()}));$('saveStatus').textContent=`${definition.label||'Cabinet'} review saved in this browser.`;}catch{$('saveStatus').textContent='Could not save. Keep this tab open.';}window.CabinRegionPersistence?.save();}
  function remember(){history.push(clone(regions));if(history.length>30)history.shift();}
  function status(message){$('reviewStatus').textContent=message;}
  function element(type,attributes){const el=document.createElementNS(svgNS,type);for(const [name,value]of Object.entries(attributes))el.setAttribute(name,value);return el;}
  function paint(){
    panX=Math.max(1-zoom,Math.min(0,panX));panY=Math.max(1-zoom,Math.min(0,panY));
    sheet.style.transform=`translate(${panX*viewport.clientWidth}px,${panY*viewport.clientHeight}px) scale(${zoom})`;
    viewport.classList.toggle('zoomed',zoom>1);viewport.classList.toggle('drawing',draft!==null);
    $('zoomValue').value=Math.round(zoom*100)+'%';$('zoomOut').disabled=zoom<=1;$('zoomIn').disabled=zoom>=4;
  }
  function render(){
    $('zoneChoices').replaceChildren();
    ids.forEach((id,index)=>{const button=document.createElement('button');button.type='button';button.dataset.zone=id;button.setAttribute('aria-pressed',String(id===selected));
      const label=document.createElement('span');label.textContent=names[index];const state=document.createElement('small');state.textContent=regions[id]?'Outlined':'Unmapped';button.append(label,state);
      button.onclick=()=>{if(draft!==null){status('Finish or cancel the current outline before changing zones.');return;}selected=id;render();};$('zoneChoices').append(button);});
    const item=window.CH149_DATA.stowage[selected];$('selectedName').textContent=names[ids.indexOf(selected)];$('selectedArm').textContent=`Configured arm: ${item.arm.toLocaleString('en-CA')} mm`;
    if(Number.isFinite(item.maxKg))$('selectedArm').textContent+=` · limit ${item.maxKg} kg`;
    $('selectedState').textContent=regions[selected]?'Visible region outlined · user review record':'No image region identified yet';
    $('startOutline').hidden=draft!==null;for(const id of ['finishOutline','undoPoint','cancelOutline'])$(id).hidden=draft===null;
    $('finishOutline').disabled=!draft||draft.length<3;$('undoPoint').disabled=!draft?.length;
    $('removeOutline').disabled=draft!==null||!regions[selected];$('undoChange').disabled=draft!==null||!history.length;
    $('pointCount').textContent=draft!==null?`${draft.length} corners · at least 3 required`:'';
    overlay.replaceChildren();
    if($('showAll').checked)for(const id of ids){const region=regions[id];if(!region)continue;
      const polygon=element('polygon',{points:region.points.map(p=>`${p[0]*source.width},${p[1]*source.height}`).join(' '),class:`region-polygon${id===selected?' selected':''}`,'data-region-id':id});
      polygon.onclick=()=>{if(draft===null){selected=id;render();}};overlay.append(polygon);
      const p=region.points[0];const label=element('text',{x:p[0]*source.width+12,y:p[1]*source.height+34,class:'region-label'});label.textContent=names[ids.indexOf(id)].split(' · ')[0];overlay.append(label);
    }
    if(draft!==null){overlay.append(element('polyline',{points:draft.map(p=>`${p[0]*source.width},${p[1]*source.height}`).join(' '),class:'draft-polygon'}));
      for(const p of draft)overlay.append(element('circle',{cx:p[0]*source.width,cy:p[1]*source.height,r:8,class:'region-point'}));}
    paint();
  }
  function finish(){if(!validPolygon(draft)){status('Add at least three corners around a visible area. A straight line is not an outline.');return;}
    remember();regions[selected]={locationId:selected,points:clone(draft),review:'user-outlined visible region',updatedAt:new Date().toISOString()};draft=null;save();render();status(`${names[ids.indexOf(selected)]} outline saved. Choose the next zone, or refine this one.`);}
  $('startOutline').onclick=()=>{draft=[];render();status(`Outlining ${names[ids.indexOf(selected)]}: click visible corners, then Finish outline. Existing saved outline stays intact until you finish.`);};
  $('finishOutline').onclick=finish;
  $('undoPoint').onclick=()=>{draft?.pop();render();};
  $('cancelOutline').onclick=()=>{draft=null;render();status('Draft cancelled. Saved outlines are unchanged.');};
  $('removeOutline').onclick=()=>{if(!regions[selected]||draft!==null)return;remember();delete regions[selected];save();render();status('Selected outline removed. Undo last saved change can restore it.');};
  $('undoChange').onclick=()=>{if(!history.length||draft!==null)return;regions=history.pop();save();render();status('Last saved change undone.');};
  $('showAll').onchange=render;
  function changeZoom(next){next=Math.max(1,Math.min(4,next));panX=.5-(.5-panX)*next/zoom;panY=.5-(.5-panY)*next/zoom;zoom=next;paint();}
  $('zoomIn').onclick=()=>changeZoom(zoom+.5);$('zoomOut').onclick=()=>changeZoom(zoom-.5);$('fit').onclick=()=>{zoom=1;panX=panY=0;paint();};
  function point(event){const bounds=sheet.getBoundingClientRect();const x=(event.clientX-bounds.left)/bounds.width,y=(event.clientY-bounds.top)/bounds.height;if(x<0||x>1||y<0||y>1)return;if(draft.length>=40){status('This outline already has 40 corners. Finish or undo a corner.');return;}draft.push([x,y]);render();}
  viewport.addEventListener('click',event=>{if(suppressClick){suppressClick=false;event.preventDefault();event.stopImmediatePropagation();return;}if(draft!==null&&!(event.detail===0&&event.clientX===0&&event.clientY===0)){event.preventDefault();event.stopImmediatePropagation();point(event);}},true);
  viewport.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'&&event.button!==0)return;suppressClick=false;gesture={id:event.pointerId,type:event.pointerType,x:event.clientX,y:event.clientY,panX,panY,moved:false};});
  viewport.addEventListener('pointermove',event=>{if(gesture?.id!==event.pointerId)return;if(Math.hypot(event.clientX-gesture.x,event.clientY-gesture.y)<7&&!gesture.moved)return;
    gesture.moved=true;suppressClick=true;if(zoom<=1)return;viewport.setPointerCapture(event.pointerId);viewport.classList.add('panning');panX=gesture.panX+(event.clientX-gesture.x)/viewport.clientWidth;panY=gesture.panY+(event.clientY-gesture.y)/viewport.clientHeight;paint();});
  viewport.addEventListener('pointerup',event=>{if(gesture?.id===event.pointerId&&gesture.type==='touch'&&!gesture.moved&&draft!==null){point(event);suppressClick=true;}gesture=null;viewport.classList.remove('panning');});
  for(const type of ['pointercancel','lostpointercapture'])viewport.addEventListener(type,()=>{gesture=null;viewport.classList.remove('panning');});
  document.addEventListener('keydown',event=>{if(draft===null)return;if(event.key==='Escape'){$('cancelOutline').click();event.preventDefault();}else if(event.target===viewport&&event.key==='Enter'){finish();event.preventDefault();}else if(event.target===viewport&&event.key==='Backspace'){$('undoPoint').click();event.preventDefault();}});
  new ResizeObserver(paint).observe(viewport);render();
  window.CabinRegionReview={source,ids,key,getRegions:()=>clone(regions),apply(value){remember();regions=clone(value);draft=null;render();},saveBrowser:save,validPolygon};
})();
