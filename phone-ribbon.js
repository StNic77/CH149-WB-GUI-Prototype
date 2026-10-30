/* Phone-only ribbon presentation. Existing metric renderers and aircraft state stay authoritative. */
(()=>{
 const ribbon=document.getElementById('liveAircraftStrip'),values=document.getElementById('liveAircraftValues'),actions=ribbon.querySelector('.aircraft-ribbon-actions');
 const phone=matchMedia('(pointer:coarse) and (max-width:650px), (pointer:coarse) and (max-width:1000px) and (max-height:500px)');
 const toggle=document.createElement('button');toggle.type='button';toggle.id='phoneRibbonToggle';toggle.setAttribute('aria-controls','liveAircraftValues');ribbon.append(toggle);let expanded=false;
 function paint(){document.body.classList.toggle('phone-ribbon',phone.matches);ribbon.classList.toggle('phone-ribbon-expanded',phone.matches&&expanded);toggle.hidden=!phone.matches;toggle.textContent=expanded?'Less ▾':'More ▴';toggle.setAttribute('aria-expanded',String(expanded));toggle.setAttribute('aria-label',expanded?'Collapse aircraft ribbon':'Expand aircraft values and tools');if(phone.matches&&!expanded&&actions.contains(document.activeElement))toggle.focus();}
 toggle.onclick=()=>{expanded=!expanded;paint();};phone.addEventListener('change',()=>{expanded=false;paint();});
 ribbon.addEventListener('keydown',e=>{if(e.key==='Escape'&&expanded&&phone.matches){expanded=false;paint();toggle.focus();}});
 new ResizeObserver(()=>window.CabinViewControls?.placeDock()).observe(ribbon);
 paint();
})();
