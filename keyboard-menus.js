/* Keep the focused editor inside the visible viewport when a software keyboard opens. */
(() => {
 let frame=0,restingHeight=window.visualViewport?.height||innerHeight;
 const keyboardSpace=document.createElement('div');keyboardSpace.id='keyboardScrollSpace';keyboardSpace.setAttribute('aria-hidden','true');keyboardSpace.hidden=true;document.body.append(keyboardSpace);
 const touch=()=>matchMedia('(pointer:coarse)').matches;
 function rememberViewport(){if(!document.activeElement?.matches('input,textarea,select'))restingHeight=window.visualViewport?.height||innerHeight;}
 const editableNumber=node=>node instanceof HTMLInputElement&&node.type==='number'&&!node.readOnly&&!node.disabled;
 let entering=null;
 function selectValue(input){if(!editableNumber(input)||document.activeElement!==input)return;input.select();}
 // Select on entry, including keyboard Tab. Reapply after the initial tap/click
 // because its native caret placement can collapse a focus-time selection.
 // Later taps in the already focused field retain normal caret editing.
 document.addEventListener('pointerdown',event=>{const input=event.target;entering=editableNumber(input)&&document.activeElement!==input?input:null;},true);
 document.addEventListener('pointercancel',()=>{entering=null;},true);
 document.addEventListener('focusin',event=>{if(editableNumber(event.target))selectValue(event.target);});
 document.addEventListener('click',event=>{if(event.target!==entering)return;const input=entering,value=input.value;entering=null;selectValue(input);requestAnimationFrame(()=>{if(input.value===value)selectValue(input);});});
 function reveal(){frame=0;const vv=window.visualViewport,top=vv?.offsetTop||0,height=vv?.height||innerHeight;
  for(const dialog of document.querySelectorAll('#planningDialog[open]')){dialog.style.maxHeight=Math.max(60,height-24)+'px';dialog.style.margin='0';dialog.style.top=(top+12)+'px';dialog.style.left='50%';dialog.style.transform='translateX(-50%)';}
  const input=document.activeElement;if(!input?.matches('input,textarea,select')){keyboardSpace.hidden=true;return;}const menu=input.closest('#imageMenu,dialog[open]');
  const keyboard=touch()&&(height<restingHeight-100||innerHeight-height>100);
  if(!menu){keyboardSpace.hidden=!keyboard;if(!keyboard)return;keyboardSpace.style.height=(Math.max(0,restingHeight-height)+24)+'px';const r=input.getBoundingClientRect(),target=top+height-12,delta=r.bottom-target;if(Math.abs(delta)>2){let scroller=input.parentElement;while(scroller&&scroller!==document.body){const style=getComputedStyle(scroller);if(/auto|scroll/.test(style.overflowY)&&scroller.scrollHeight>scroller.clientHeight)break;scroller=scroller.parentElement;}if(scroller&&scroller!==document.body)scroller.scrollTop+=delta;else window.scrollBy({top:delta,left:0,behavior:'instant'});}return;}
  keyboardSpace.hidden=true;if(menu.hidden)return;
  menu.classList.add('editing-input');
  const scroller=menu.id==='imageMenu'?document.getElementById('imageMenuBody'):menu;
  // Sticky action rows can cover a correctly scrolled field. During entry they
  // join normal document flow, leaving the full input and its value visible.
  if(menu.id==='imageMenu')window.CabinImageMenu.keepEditorVisible();
  const bounds=scroller.getBoundingClientRect(),r=input.getBoundingClientRect(),low=Math.max(top+12,bounds.top+8),high=Math.min(top+height-12,bounds.bottom-8);
  if(keyboard&&Math.abs(r.bottom-high)>2)scroller.scrollTop+=r.bottom-high;else if(r.bottom>high)scroller.scrollTop+=r.bottom-high;else if(r.top<low)scroller.scrollTop-=low-r.top;
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(reveal);}
 document.addEventListener('pointerdown',rememberViewport,true);document.addEventListener('focusin',schedule);window.visualViewport?.addEventListener('resize',schedule);window.visualViewport?.addEventListener('scroll',schedule);window.addEventListener('resize',()=>{rememberViewport();schedule();});
 document.addEventListener('focusout',()=>{schedule();requestAnimationFrame(()=>{for(const menu of document.querySelectorAll('.editing-input'))if(!menu.contains(document.activeElement)||!document.activeElement.matches('input,textarea,select'))menu.classList.remove('editing-input');});for(const d of document.querySelectorAll('dialog:not([open])'))for(const k of ['maxHeight','margin','top','left','transform'])d.style[k]='';});
 window.CabinKeyboardMenus={reveal,schedule};
})();
