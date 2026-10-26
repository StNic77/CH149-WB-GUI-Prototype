/* Display registration and inspection only. No loading state or W&B calculation. */
(() => {
  const data = window.CH149_BAY_DATA, registration = window.CH149_PLAN_REGISTRATION;
  const toggle = document.getElementById('bayToggle');
  const panel = document.getElementById('bayPanel');
  const layer = document.createElement('div');
  layer.id='bayLayer'; layer.className='bay-layer'; layer.hidden=true;
  document.getElementById('planSheet').append(layer);
  const viewport = document.getElementById('planViewport');
  const status = document.getElementById('bayMappingStatus');
  const reviewHelp = document.getElementById('bayReviewHelp');
  const rampMarkButton=document.createElement('button');rampMarkButton.id='bayMarkRampAft';rampMarkButton.type='button';rampMarkButton.textContent='Mark ramp aft edge · X14393';rampMarkButton.setAttribute('aria-pressed','false');document.querySelector('.bay-review-actions').insertBefore(rampMarkButton,document.getElementById('bayFinishMarks'));
  let asset = null, available = false, selected = 'BAY1', marking = null, suppressTouchClick = false;
  // Candidate landmarks only; do not promote these to aircraft station calibration.
  // Review marks use source-image x coordinates, never W&B arms.
  const marks = {};
  const storageKey = 'ch149-cabin-prototype.station-review.v1';
  const sharedKey='ch149-cabin-prototype.shared-stations.v1';
  let shared=null,projectRevision=0,projectReady=false,publishedReady=false,dirty=false;
  const saveButton=document.createElement('button');saveButton.type='button';saveButton.id='baySaveShared';saveButton.textContent='Save shared calibration to project';
  document.querySelector('.bay-review-actions').append(saveButton);
  const persistence=document.createElement('p');persistence.id='bayPersistenceStatus';persistence.setAttribute('role','status');document.querySelector('.bay-review').append(persistence);
  const exportButton=document.createElement('button');exportButton.type='button';exportButton.id='bayExportShared';exportButton.textContent='Export calibration';document.querySelector('.bay-review-actions').append(exportButton);
  const importButton=document.createElement('button');importButton.type='button';importButton.id='bayImportShared';importButton.textContent='Import calibration';document.querySelector('.bay-review-actions').append(importButton);
  const importFile=document.createElement('input');importFile.type='file';importFile.accept='.json,application/json';importFile.hidden=true;importFile.id='bayImportFile';document.querySelector('.bay-review').append(importFile);
  const validShared=value=>value?.schema===1&&JSON.stringify(value.plane)==='[2560,1216]'&&Number.isFinite(value.forward)&&Number.isFinite(value.aft)&&value.forward>=0&&value.forward<value.aft&&value.aft<=2560&&(value.rampAft===undefined||(Number.isFinite(value.rampAft)&&value.rampAft>value.aft&&value.rampAft<=2560));
  const builtIn=window.CH149_STATION_CALIBRATION;
  if(validShared(builtIn)){shared={...builtIn,plane:[...builtIn.plane]};persistence.textContent='Built-in calibration loaded · all configurations use the approved joints.';}
  try{const saved=JSON.parse(localStorage.getItem(sharedKey));if(validShared(saved)){if(!shared)shared=saved;else if(saved.forward!==shared.forward||saved.aft!==shared.aft)localStorage.setItem(sharedKey+'.previous',JSON.stringify(saved));}}catch{}
  // Validate saved marks against the exact source identity and dimensions. Keep
  // review storage separate from configuration edits and the 23 original markers.
  let stored = null;
  try {stored=JSON.parse(localStorage.getItem(storageKey));} catch {}
  const records=stored?.schema===1 ? stored.records : window.CH149_BAY_REVIEW_DRAFT;
  if(records && typeof records==='object') for(const [key,record] of Object.entries(records)) {
    const spec=registration.assets[key];
    if(!spec || !record || record.file!==spec.file || JSON.stringify(record.size)!==JSON.stringify(spec.size))continue;
    const next={};
    for(const end of ['forward','aft']) if(Number.isFinite(record[end]) && record[end]>=0 && record[end]<=spec.size[0])next[end]=record[end];
    if(next.forward!==undefined && next.aft!==undefined && next.forward>=next.aft)continue;
    if(Object.keys(next).length)marks[key]=next;
  }
  function fromSource(key,mark){const spec=registration.assets[key];return {schema:1,plane:[2560,1216],forward:spec.x+mark.forward*spec.scale,aft:spec.x+mark.aft*spec.scale,source:key,...(shared?.rampAft!==undefined?{rampAft:shared.rampAft}:{})};}
  // Migrate the user's last-reviewed baseline without discarding the five older
  // source-specific records. Project persistence requires the explicit save below.
  if(!shared&&marks.BASELINE?.forward!==undefined&&marks.BASELINE?.aft!==undefined)shared=fromSource('BASELINE',marks.BASELINE);
  async function loadProject(){
    let saved=null;
    try{const response=await fetch('/api/station-calibration',{cache:'no-store'});if(!response.ok)throw Error();saved=await response.json();if(saved&&!validShared(saved))throw Error();projectReady=true;publishedReady=false;}
    catch{projectReady=false;
      // Static hosts have no local save API. Resolve the published calibration
      // relative to the app folder, including GitHub Pages repository subpaths.
      try{const response=await fetch(new URL('station-calibration.json',document.baseURI),{cache:'no-store'});if(!response.ok)throw Error();saved=await response.json();if(!validShared(saved))throw Error();if(validShared(builtIn)&&(saved.revision||0)<=(builtIn.revision||0)&&(saved.forward!==builtIn.forward||saved.aft!==builtIn.aft||saved.rampAft!==builtIn.rampAft))throw Error();publishedReady=true;}
      catch{publishedReady=false;saveButton.disabled=true;persistence.textContent=validShared(builtIn)?'Built-in calibration retained · no matching published calibration or save service is available. Export deliberate adjustments to transfer them.':location.protocol==='file:'?'Opened directly as a file: marks stay in this browser. Use Export calibration, then Import calibration in the local web preview to save to the project.':'Browser marks retained. The saved project alignment could not be loaded.';return;}
    }
    saveButton.disabled=!projectReady;saveButton.title=projectReady?'':'Hosted demo: export adjustments and import them in the local preview to publish an updated calibration.';
    if(saved&&!dirty&&!marking){
      try{if(shared&&(shared.forward!==saved.forward||shared.aft!==saved.aft))localStorage.setItem(sharedKey+'.previous',JSON.stringify(shared));}catch{}
      shared=saved;projectRevision=saved.revision||0;try{localStorage.setItem(sharedKey,JSON.stringify(shared));}catch{}
      persistence.textContent=publishedReady?'Published calibration loaded · all configurations use the saved joints. Changes can be exported; this hosted demo cannot save to the project.':'Shared calibration loaded from the project · all configurations locked to the same joints.';draw();window.CabinSeatEditor?.renderLayer();
    }else if(!saved)persistence.textContent='Browser marks retained. Save shared calibration to project to use the corrected No Role Config pair in every browser.';
  }
  async function saveProject(){
    if(!shared||!validShared(shared)){persistence.textContent='Mark both joints first, then save the shared calibration.';return;}
    if(!projectReady)await loadProject();
    if(!projectReady){persistence.textContent=publishedReady?'Hosted demo: adjustments are kept in this browser. Export calibration and import it in the local preview to save and publish an updated pair.':location.protocol==='file:'?'This file page keeps marks in this browser. Use Export calibration, then import it into the local web preview to save to the project.':'Project save is unavailable. Your browser marks are retained; keep this page open and check the preview server.';return;}
    saveButton.disabled=true;
    try{const legacyRecords={};for(const [key,mark] of Object.entries(marks))legacyRecords[key]={file:registration.assets[key].file,size:registration.assets[key].size,...mark};
      const response=await fetch('/api/station-calibration',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...shared,expectedRevision:projectRevision,legacyRecords})});
      if(response.status===409){persistence.textContent='Another browser saved newer joints. Your browser draft is retained; reload the project calibration before saving.';return;}
      if(!response.ok)throw Error();const saved=await response.json();if(!validShared(saved)||saved.rampAft!==shared.rampAft)throw Error();shared=saved;projectRevision=shared.revision;dirty=false;saveMarks();persistence.textContent='Shared calibration saved to the project · all configurations use the same joints and ramp edge. Previous per-plan marks are backed up.';
    }catch{persistence.textContent='Project save failed. Your browser marks are retained; keep this page open and try again.';}finally{saveButton.disabled=false;}
  }
  saveButton.onclick=saveProject;
  exportButton.onclick=()=>{
    if(!validShared(shared)){persistence.textContent='Use a complete saved pair or mark both joints before exporting.';return;}
    const legacyRecords={};for(const [key,mark] of Object.entries(marks))legacyRecords[key]={file:registration.assets[key].file,size:registration.assets[key].size,...mark};
    const blob=new Blob([JSON.stringify({...shared,legacyRecords},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='CH149-station-calibration.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
    persistence.textContent='Calibration exported with the original per-plan marks. In the local web preview, choose Import calibration and select the downloaded file.';
  };
  importButton.onclick=()=>importFile.click();
  importFile.onchange=async()=>{
    const file=importFile.files?.[0];if(!file)return;
    try{
      if(file.size>25000)throw Error();const value=JSON.parse(await file.text());
      if(!validShared(value)||!registration.assets[value.source])throw Error();
      const imported={};for(const [key,record] of Object.entries(value.legacyRecords||{})){
        const spec=registration.assets[key];if(!spec||record.file!==spec.file||JSON.stringify(record.size)!==JSON.stringify(spec.size))throw Error();
        const clean={};for(const end of ['forward','aft'])if(record[end]!==undefined){if(!Number.isFinite(record[end])||record[end]<0||record[end]>spec.size[0])throw Error();clean[end]=record[end];}
        if(clean.forward!==undefined&&clean.aft!==undefined&&clean.forward>=clean.aft)throw Error();imported[key]=clean;
      }
      shared={schema:1,plane:[2560,1216],forward:value.forward,aft:value.aft,source:value.source,...(value.rampAft!==undefined?{rampAft:value.rampAft}:shared?.rampAft>value.aft?{rampAft:shared.rampAft}:{})};Object.assign(marks,imported);dirty=true;saveMarks();markMode(null);draw();window.CabinSeatEditor?.renderLayer();
      persistence.textContent='Calibration imported. Saving the shared pair and original marks to the project…';await saveProject();
    }catch{persistence.textContent='This file is not a valid calibration export. Existing marks were kept.';}finally{importFile.value='';}
  };
  window.addEventListener('focus',()=>{if(!dirty&&!marking)loadProject();});
  function saveMarks() {
    const records={};
    for(const [key,mark] of Object.entries(marks)) {
      const spec=registration.assets[key]; records[key]={file:spec.file,size:spec.size,...mark};
    }
    try {localStorage.setItem(storageKey,JSON.stringify({schema:1,records}));if(shared)localStorage.setItem(sharedKey,JSON.stringify(shared));return true;} catch {return false;}
  }
  const percent = (value, total) => `${value / total * 100}%`;
  const format = value => value.toLocaleString('en-CA');
  function anchors() {
    const key = Object.keys(registration.assets).find(key => registration.assets[key] === asset);
    const reviewed = marks[key] || {};
    if(shared)return {key,forward:(shared.forward-asset.x)/asset.scale,aft:(shared.aft-asset.x)/asset.scale,inherited:true,forwardMarked:true,aftMarked:true};
    // Share the user's baseline station lines through the existing common display
    // plane. Other source views remain visual cross-checks, not independent surveys.
    const baseline=marks.BASELINE, baseAsset=registration.assets.BASELINE;
    const inherited=key!=='BASELINE' && baseline?.forward!==undefined && baseline?.aft!==undefined;
    const projected=end=>(baseAsset.x+baseline[end]*baseAsset.scale-asset.x)/asset.scale;
    return { key, forward: reviewed.forward ?? (inherited?projected('forward'):asset.cockpitAftX), aft: reviewed.aft ?? (inherited?projected('aft'):asset.hingeX), inherited,
      forwardMarked: reviewed.forward !== undefined, aftMarked: reviewed.aft !== undefined };
  }
  function markMode(value) {
    if(value)window.CabinSeatEditor?.finishLocating();
    marking = value;
    document.getElementById('bayMarkForward').setAttribute('aria-pressed', String(value === 'forward'));
    document.getElementById('bayMarkAft').setAttribute('aria-pressed', String(value === 'aft'));
    rampMarkButton.setAttribute('aria-pressed',String(value==='rampAft'));
    viewport.classList.toggle('marking-station', !!value);
    viewport.dataset.marking = value ? `Marking ${value==='forward'?'forward joint X4875':'aft joint X11393'} · click anywhere on the plan, including beyond the dashed lines` : '';
    document.getElementById('bayFinishMarks').hidden = !value;
    reviewHelp.textContent = value ? `Click anywhere at the ${value === 'forward' ? 'forward joint X4875' : 'aft joint X11393'} position, including beyond the current dashed lines. Click again to adjust, then Finish marking. Drag to pan when zoomed; Escape finishes marking.` : 'Mark either joint here to adjust the shared alignment in every configuration. Finish marking saves it to the project. Existing browser marks are retained.';
    if(value==='rampAft'){viewport.dataset.marking='Marking ramp aft edge · X14393 · cabin joints stay fixed';reviewHelp.textContent='Click the aft edge of the ramp, then Finish marking. This moves only the ramp edge on the picture in all configurations. X14393 and all loading arms stay unchanged.';}
  }
  function inspect() {
    const bay = data.bays.find(bay => bay.id === selected);
    document.getElementById('bayName').textContent = bay.name;
    document.getElementById('bayArm').textContent = `${format(bay.arm)} mm`;
    document.getElementById('bayStations').textContent = bay.forward === undefined ? 'Rear region has not been mapped.' : `Boundaries X${bay.forward} – X${bay.aft}${bay.sourceLabel ? ` · schematic label: ${bay.sourceLabel}` : ''}`;
    document.getElementById('baySelectionNote').textContent = bay.armDecision ? 'Bay 6 arm retained at 10,875 mm by user decision. The extra 18 mm does not change this arm. Read-only inspection; no load has been added.' : bay.forward === undefined ? 'Configured arm available in the named list. No rear target is drawn.' : 'Read-only inspection · placement awaiting review. No load has been added.';
    for (const button of document.querySelectorAll('[data-bay-id]')) button.setAttribute('aria-pressed', String(button.dataset.bayId === selected));
  }
  function draw() {
    window.CabinCGOverlay?.render();
    const visible = toggle.checked && available;
    panel.hidden = !visible; layer.hidden = !visible;
    // Bay inspection is a separate layer; equipment navigation resumes when it is off.
    viewport.classList.toggle('inspecting-bays', visible);
    layer.replaceChildren();
    if (!visible) { markMode(null); return; }
    const a = anchors();
    const reviewedBoth = a.forwardMarked && a.aftMarked;
    status.textContent = shared ? 'Shared joints locked across all configurations' : reviewedBoth ? 'Joints marked · mapping awaiting review' : a.inherited ? 'Baseline boundaries shared · check against this view' : 'Draft placement · joints awaiting identification';
    document.getElementById('bayMarkSummary').textContent = `X4875: ${a.forwardMarked ? 'marked' : a.inherited ? 'from marked baseline' : 'candidate cockpit seam'} · X11393: ${a.aftMarked ? 'marked' : a.inherited ? 'from marked baseline' : 'candidate ramp joint'}`;
    // Uniform longitudinal interpolation is a presentation proposal, not measured aircraft geometry.
    const xAt = station => station===window.CH149_DATA.ramp.end&&shared?.rampAft!==undefined ? shared.rampAft : shared ? shared.forward+(station-4875)/6518*(shared.aft-shared.forward) : asset.x + (a.forward + (station - 4875) / 6518 * (a.aft - a.forward)) * asset.scale;
    // A display band, not a sidewall/usable-floor polygon or a lateral calibration.
    const top = registration.height / 2 - 125 * asset.scale;
    const height = 250 * asset.scale;
    for (const bay of data.bays.filter(bay => bay.forward !== undefined)) {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'bay-region'; button.dataset.bayId = bay.id;
      button.setAttribute('aria-label', `${bay.name}, configured arm ${bay.arm} millimetres, draft mapping`);
      Object.assign(button.style, {left:percent(xAt(bay.forward),registration.width), top:percent(top,registration.height), width:percent(xAt(bay.aft)-xAt(bay.forward),registration.width), height:percent(height,registration.height)});
      const label = document.createElement('span'); label.textContent = bay.name.replace('Bay ', ''); button.append(label);
      button.onclick = () => { selected = bay.id; inspect(); };
      layer.append(button);
    }
    const stations=[...new Set(data.bays.filter(bay=>bay.forward!==undefined).flatMap(bay=>[bay.forward,bay.aft]).concat(window.CH149_DATA.ramp.end))].sort((a,b)=>a-b);
    for (const [index,station] of stations.entries()) {
      const x=xAt(station),position=station===4875?'forward':station===11393?'aft':'boundary';
      const guide = document.createElement('div'); guide.className = `bay-station ${position}`;
      guide.classList.add(index%2?'station-bottom':'station-top');guide.dataset.station=station;
      guide.style.left = percent(x,registration.width); guide.style.top = percent(top-70,registration.height);
      guide.style.height = percent(height+140,registration.height);
      const label = document.createElement('span'); label.textContent = `X${station}`; guide.title = position==='boundary' ? `Station X${station}` : a[position+'Marked'] ? 'Confirmed joint' : a.inherited ? 'Baseline joint' : 'Joint awaiting confirmation';
      guide.append(label); layer.append(guide);
    }
    inspect();
    window.CabinSeatEditor?.renderLayer();
  }
  const choices = document.getElementById('bayChoices');
  for (const bay of data.bays) {
    const button = document.createElement('button'); button.type='button'; button.dataset.bayId=bay.id;
    button.textContent = bay.name; button.onclick = () => {selected=bay.id;inspect();}; choices.append(button);
  }
  toggle.onchange = draw;
  document.getElementById('bayMarkForward').onclick = () => markMode(marking === 'forward' ? null : 'forward');
  document.getElementById('bayMarkAft').onclick = () => markMode(marking === 'aft' ? null : 'aft');
  rampMarkButton.onclick=()=>markMode(marking==='rampAft'?null:'rampAft');
  document.getElementById('bayFinishMarks').onclick = () => {markMode(null);if(dirty)saveProject();};
  const restoreButton=document.getElementById('bayResetMarks');restoreButton.textContent="Use this plan’s saved pair";
  restoreButton.onclick = () => {if(!asset)return;const key=anchors().key,mark=marks[key];if(mark?.forward===undefined||mark?.aft===undefined){persistence.textContent='This plan has no complete saved pair. Mark both joints to establish one.';return;}shared=fromSource(key,mark);dirty=true;saveMarks();markMode(null);draw();window.CabinSeatEditor?.renderLayer();persistence.textContent='Saved pair applied to all configurations in this browser. Save shared calibration to project to share it with other browsers.';};
  document.addEventListener('keydown', event => {if(event.key==='Escape' && marking)markMode(null);});
  function pickJoint(event) {
    if(event.type==='click' && suppressTouchClick) {
      suppressTouchClick=false;event.preventDefault();event.stopImmediatePropagation();return;
    }
    if (!marking || !available || !toggle.checked || (event.detail === 0 && event.clientX === 0 && event.clientY === 0)) return;
    event.preventDefault();
    if(event.type === 'click') event.stopImmediatePropagation();
    const image = document.getElementById('cabinImage');
    const bounds = image.getBoundingClientRect();
    const sourceX = (event.clientX-bounds.left) / bounds.width * asset.size[0];
    if (sourceX < 0 || sourceX > asset.size[0]) {reviewHelp.textContent='Choose a point within the source plan.';return;}
    const a = anchors();
    const commonX=asset.x+sourceX*asset.scale;
    if(marking==='rampAft'){
      const hinge=shared?.aft??asset.x+a.aft*asset.scale;
      if(commonX<=hinge||commonX>registration.width){reviewHelp.textContent='Choose the ramp edge aft (right) of the hinge, within the image.';return;}
      if(!shared)shared=fromSource(a.key,{forward:a.forward,aft:a.aft});
      shared={...shared,rampAft:commonX};dirty=true;const saved=saveMarks();draw();
      reviewHelp.textContent=`Ramp aft edge placed${saved?' and saved in this browser':''}. Cabin joints, X14393 and loading arms are unchanged. Click again to adjust, then Finish marking.`;return;
    }
    if(marking==='aft'&&shared?.rampAft!==undefined&&commonX>=shared.rampAft){reviewHelp.textContent='The hinge must remain forward (left) of the marked ramp edge. The joint was not changed.';return;}
    if ((marking === 'forward' && sourceX >= a.aft) || (marking === 'aft' && sourceX <= a.forward)) {
      reviewHelp.textContent='The forward joint must be noseward (left) of the aft joint. The mark was not changed.';return;
    }
    marks[a.key] = {...marks[a.key], [marking]:sourceX};
    const next=fromSource(a.key,{forward:marking==='forward'?sourceX:a.forward,aft:marking==='aft'?sourceX:a.aft});
    // Preserve the untouched joint exactly, avoiding source/common-plane roundoff.
    if(shared){const other=marking==='forward'?'aft':'forward';next[other]=shared[other];}shared=next;dirty=true;
    const saved=saveMarks();draw();
    reviewHelp.textContent=`${marking==='aft'?'Aft':'Forward'} joint placed${saved?' and saved in this browser':''}. Click again anywhere on the plan to adjust it, then Finish marking.${saved?'':' Browser storage is unavailable; keep this page open.'}`;
  }
  viewport.addEventListener('click', pickJoint, true);
  // Touch taps are handled from pointer events as well: browser compatibility-click
  // synthesis can be suppressed after a native pan. A moved/cancelled touch never picks.
  let touch = null;
  viewport.addEventListener('pointerdown', event => {
    suppressTouchClick=false;
    if(event.pointerType === 'touch') touch={id:event.pointerId,x:event.clientX,y:event.clientY,moved:false};
  });
  viewport.addEventListener('pointermove', event => {
    if(touch?.id===event.pointerId && Math.hypot(event.clientX-touch.x,event.clientY-touch.y)>=7) touch.moved=true;
  });
  viewport.addEventListener('pointercancel', () => {touch=null;});
  viewport.addEventListener('pointerup', event => {
    if(touch?.id===event.pointerId && !touch.moved && available && toggle.checked) {
      if(marking) {pickJoint(event);suppressTouchClick=true;}
      else {
        const id=event.target.closest('[data-bay-id]')?.dataset.bayId;
        if(id) {selected=id;inspect();}
      }
    }
    touch=null;
  });
  window.CabinBayLayer = {
    finishMarking:()=>markMode(null),
    setView({asset:next,available:hasPlan}) {asset=next;available=hasPlan;markMode(null);draw();},
    getDisplayMapping() {
      if(!available||!asset)return null;
      const a=anchors();return {forwardX:shared?.forward??asset.x+a.forward*asset.scale,aftX:shared?.aft??asset.x+a.aft*asset.scale,
        rampAftX:shared?.rampAft??((shared?.aft??asset.x+a.aft*asset.scale)+(window.CH149_DATA.ramp.end-11393)/6518*((shared?.aft??asset.x+a.aft*asset.scale)-(shared?.forward??asset.x+a.forward*asset.scale))),width:registration.width,height:registration.height,centerY:registration.height/2,sourceScale:asset.scale};
    },
    getState:() => ({selected,enabled:toggle.checked,marking,marks:JSON.parse(JSON.stringify(marks)),shared,projectRevision,projectReady,publishedReady,mappingStatus:shared?'shared-visual-calibration':'awaiting-review'})
  };
  loadProject();
})();
