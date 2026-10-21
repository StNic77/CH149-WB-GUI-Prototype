/* Project persistence plus portable transfer for the direct-file review workflow. */
(() => {
  const definition=window.CH149_REGION_REVIEW_CONFIG||window.CH149_FORWARD_SHELF_REVIEW,review=window.CabinRegionReview;
  const status=document.getElementById('saveStatus'),actions=document.querySelector('.actions');
  const source=definition.source;
  const sameSource=value=>value?.file===source.file&&value.width===source.width&&value.height===source.height&&value.sha256===source.sha256;
  function validate(value){if(value?.schema!==1||!sameSource(value.source)||!value.regions||typeof value.regions!=='object'||Array.isArray(value.regions))throw Error();for(const [id,record]of Object.entries(value.regions))if(!definition.ids.includes(id)||record.locationId!==id||!review.validPolygon(record.points))throw Error();return value.regions;}
  function control(text,id){const button=document.createElement('button');button.type='button';button.id=id;button.textContent=text;actions.append(button);return button;}
  const save=control('Save review to project','saveProjectReview'),exportButton=control('Export review','exportRegionReview'),importButton=control('Import review','importRegionReview');
  const input=document.createElement('input');input.type='file';input.accept='.json,application/json';input.hidden=true;input.id='importRegionFile';actions.append(input);
  let revision=0,queued=false,saving=false,changed=false;
  const loaded=(async()=>{
    if(location.protocol==='file:'){status.textContent='Direct file page: review stays in this browser. Export review to transfer it to the web preview.';return;}
    try{const response=await fetch(definition.endpoint,{cache:'no-store'});if(!response.ok)throw Error();const project=await response.json();if(!project)return;const regions=validate(project);revision=project.revision||0;
      const local=JSON.parse(localStorage.getItem(definition.key)||'null');
      if(!changed&&(Object.keys(review.getRegions()).length===0||(Date.parse(project.updatedAt)||0)>(Date.parse(local?.updatedAt)||0))){review.apply(regions);localStorage.setItem(definition.key,JSON.stringify(project));status.textContent=Object.keys(regions).length?'Project review loaded. Continue outlining or refine a saved region.':'No shelf outlines saved yet.';}
    }catch{status.textContent='Browser review retained. Project save is unavailable; Export review keeps a portable copy.';}
  })();
  async function saveProject(){changed=true;queued=true;await loaded;if(saving)return;
    if(location.protocol==='file:'){queued=false;status.textContent='Saved in this browser. Use Export review, then Import review in the web preview to save it to the project.';return;}
    saving=true;save.disabled=true;
    try{while(queued){queued=false;const body={schema:1,source,regions:review.getRegions(),expectedRevision:revision};const response=await fetch(definition.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
        if(response.status===409){status.textContent='A newer review was saved elsewhere. Your browser draft is retained; export it before reloading.';queued=false;return;}
        if(!response.ok)throw Error();const project=await response.json();revision=project.revision;status.textContent='Shelf review saved to the project and this browser.';
      }}catch{queued=false;status.textContent='Browser review retained. Project save failed; Export review keeps a portable copy.';}finally{saving=false;save.disabled=false;}
  }
  window.CabinRegionPersistence={save:saveProject};save.onclick=saveProject;
  exportButton.onclick=()=>{const blob=new Blob([JSON.stringify({schema:1,source,regions:review.getRegions()},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=definition.exportName;link.click();setTimeout(()=>URL.revokeObjectURL(url),60000);status.textContent='Review exported. It includes the source identity and exact outlined points.';};
  importButton.onclick=()=>input.click();input.onchange=async()=>{const file=input.files?.[0];if(!file)return;try{if(file.size>50000)throw Error();const value=JSON.parse(await file.text()),regions=validate(value);review.apply(regions);review.saveBrowser();}catch{status.textContent='Invalid or different-source review file. Existing outlines were kept.';}finally{input.value='';}};
})();
