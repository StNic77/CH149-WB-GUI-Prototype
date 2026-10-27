/* Keep the focused editor inside the visible viewport when a software keyboard opens. */
(() => {
 let frame=0;
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
  const input=document.activeElement;if(!input?.matches('input,textarea,select'))return;const menu=input.closest('#imageMenu,dialog[open]');if(!menu||menu.hidden)return;
  menu.classList.add('editing-input');
  const scroller=menu.id==='imageMenu'?document.getElementById('imageMenuBody'):menu;
  // Sticky action rows can cover a correctly scrolled field. During entry they
  // join normal document flow, leaving the full input and its value visible.
  if(menu.id==='imageMenu')window.CabinImageMenu.keepEditorVisible();
  const bounds=scroller.getBoundingClientRect(),r=input.getBoundingClientRect(),low=Math.max(top+12,bounds.top+8),high=Math.min(top+height-12,bounds.bottom-8);
  if(r.bottom>high)scroller.scrollTop+=r.bottom-high;else if(r.top<low)scroller.scrollTop-=low-r.top;
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(reveal);}
 document.addEventListener('focusin',schedule);window.visualViewport?.addEventListener('resize',schedule);window.visualViewport?.addEventListener('scroll',schedule);window.addEventListener('resize',schedule);
 document.addEventListener('focusout',()=>{requestAnimationFrame(()=>{for(const menu of document.querySelectorAll('.editing-input'))if(!menu.contains(document.activeElement)||!document.activeElement.matches('input,textarea,select'))menu.classList.remove('editing-input');});for(const d of document.querySelectorAll('dialog:not([open])'))for(const k of ['maxHeight','margin','top','left','transform'])d.style[k]='';});
 window.CabinKeyboardMenus={reveal,schedule};
})();
