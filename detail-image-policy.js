/* Reference-image applicability only. Never a fit, loading or W&B rule. */
(() => {
 const roles=new Set(['SAR3','SAR10','TRANSPORT','CASEVAC']);
 function info(view,role){
  // No Role Config retains its existing reference browsing behavior.
  if(!roles.has(role))return {available:true,reason:''};
  if(['pta','stbd'].includes(view)&&role!=='SAR3')return {available:false,reason:'Aft cabin reference images are available for SAR-3 Pax only. The pictured arrangement does not represent this configuration.'};
  if(view==='cabinet'&&['TRANSPORT','CASEVAC'].includes(role))return {available:false,reason:'The SAR Cabinet reference image does not represent Transport or CASEVAC.'};
  return {available:true,reason:''};
 }
 function decorate(button,view,role){
  if(!button)return;const status=info(view,role);button.disabled=!status.available;
  if(!button.hasAttribute('data-available-image-title'))button.dataset.availableImageTitle=button.title;
  if(status.available){button.title=button.dataset.availableImageTitle;button.removeAttribute('aria-describedby');button.removeAttribute('data-image-unavailable');}
  else {button.title=status.reason;button.dataset.imageUnavailable='true';button.setAttribute('aria-describedby','detailImageHelp');}
  if(!status.available&&button.id&&button.closest('#imageMenu')){
   const helper=document.createElement('p');helper.id=button.id+'ImageHelp';helper.className='detail-image-help';helper.textContent=status.reason;
   button.after(helper);button.setAttribute('aria-describedby',helper.id);
  }
 }
 function updateControls(role){
  for(const b of document.querySelectorAll('[data-viewtab],[data-area]'))decorate(b,b.dataset.viewtab||b.dataset.area,role);
  for(const option of document.querySelectorAll('#viewPicker option'))option.disabled=!info(option.value,role).available;
  const tabs=document.getElementById('viewTabs');if(!tabs)return;
  let help=document.getElementById('detailImageHelp');if(!help){help=document.createElement('p');help.id='detailImageHelp';help.className='detail-image-help';}
  tabs.after(help);
  const unavailable=['cabinet','pta','stbd'].filter(view=>!info(view,role).available);
  help.hidden=!unavailable.length;help.textContent=(unavailable.includes('cabinet')?'SAR Cabinet and aft cabin images':'Aft cabin images')+' are unavailable for this configuration. Equipment, contents and W&B controls remain available.';
 }
 window.CabinDetailImages=Object.freeze({info,decorate,updateControls});
})();
