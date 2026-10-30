/* Phone-only ribbon presentation. Existing metric renderers and aircraft state stay authoritative. */
(()=>{
 const ribbon=document.getElementById('liveAircraftStrip'),values=document.getElementById('liveAircraftValues'),actions=ribbon.querySelector('.aircraft-ribbon-actions');
 const phone=matchMedia('(pointer:coarse) and (max-width:650px), (pointer:coarse) and (max-width:1000px) and (max-height:500px)');
 const toggle=document.createElement('button');toggle.type='button';toggle.id='phoneRibbonToggle';toggle.setAttribute('aria-controls','liveAircraftValues');ribbon.append(toggle);let expanded=false;
 function metricLabels(){const label=values.querySelector('[data-aircraft-metric=operating] small');if(label)label.textContent=phone.matches?'OpW':'Operating';for(const key of ['operating','fuel','auw']){const box=values.querySelector('[data-aircraft-metric='+key+']');if(!box)continue;let inline=box.querySelector('.phone-inline-metric');if(!inline){inline=document.createElement('span');inline.className='phone-inline-metric';box.append(inline);}const weight=box.dataset.weight!==undefined?Math.round(Number(box.dataset.weight))+'kg':'—',cg=box.dataset.cg!==undefined?Math.round(Number(box.dataset.cg))+'mm':'—',band=box.querySelector('.aircraft-ribbon-cg-band')?.textContent.toUpperCase()||'';inline.textContent=key==='fuel'?'Fuel '+weight:(key==='operating'?'OpW/CG ':'AUW/CG ')+weight+'/'+cg+(key==='auw'&&band?' '+band:'')+(box.dataset.cgStatus==='out'?' OUT CG':'');}}

 new MutationObserver(metricLabels).observe(values,{childList:true});
 function paint(){metricLabels();document.body.classList.toggle('phone-ribbon',phone.matches);ribbon.classList.toggle('phone-ribbon-expanded',phone.matches&&expanded);toggle.hidden=!phone.matches;toggle.textContent=expanded?'Less ▾':'More ▴';toggle.setAttribute('aria-expanded',String(expanded));toggle.setAttribute('aria-label',expanded?'Collapse aircraft ribbon':'Expand aircraft values and tools');if(phone.matches&&!expanded&&actions.contains(document.activeElement))toggle.focus();}
 toggle.onclick=()=>{expanded=!expanded;paint();requestAnimationFrame(fit);};phone.addEventListener('change',()=>{expanded=false;paint();});
 ribbon.addEventListener('keydown',e=>{if(e.key==='Escape'&&expanded&&phone.matches){expanded=false;paint();toggle.focus();}});
 function fit(){const landscape=phone.matches&&innerWidth>650&&innerHeight<=500;document.body.classList.toggle('phone-landscape-fit',landscape);if(phone.matches){const photo=document.querySelector('.photo-wrap'),width=photo.clientWidth;document.documentElement.style.setProperty('--phone-photo-height',(landscape?Math.ceil(width*.32+66):Math.max(280,Math.min(420,Math.round(width*1.05))))+'px');document.documentElement.style.setProperty('--phone-sheet-width',width+'px');}window.CabinViewControls?.placeDock();}

 new ResizeObserver(fit).observe(ribbon);window.addEventListener('resize',fit);visualViewport?.addEventListener('resize',fit);fit();
 paint();
})();
