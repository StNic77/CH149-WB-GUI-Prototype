/* Screen-anchored controls; browser accessibility zoom is untouched outside the viewer. */
(() => {
 const viewer=window.CabinPlanViewer,v=document.getElementById('planViewport');
 let framing='whole',view='plan',hand='right';try{hand=localStorage.getItem('cabinControlHand')||'right';}catch{}
 const dock=document.createElement('aside');dock.id='aircraftTouchControls';dock.setAttribute('aria-label','Aircraft zoom controls');dock.innerHTML='<button id="touchZoomIn" aria-label="Zoom in">+</button><output id="touchZoomValue">100%</output><button id="touchZoomOut" aria-label="Zoom out">−</button><button id="touchReset">Reset view</button>';document.body.append(dock);
 const options=document.createElement('div');options.className='view-framing';options.innerHTML='<button id="wholeAircraft" aria-pressed="true">Whole aircraft</button><button id="enlargeCabin" aria-pressed="false">Enlarge cabin</button><label>Controls <select id="controlHand"><option value="right">Right hand</option><option value="left">Left hand</option></select></label>';document.getElementById('planTools').before(options);
 const help=document.querySelector('.plan-help');help.textContent='Use + and − or pinch the aircraft to enlarge it. Drag to look around. Tap equipment to edit. Pinch outside the image to enlarge text.';
 const layerOptions=document.createElement('details');layerOptions.className='layer-options';layerOptions.innerHTML='<summary>Image layers</summary>';const layers=document.querySelector('.image-layers');layers.before(layerOptions);layerOptions.append(layers);
 function reset(){viewer.fit();if(framing==='cabin'&&view==='plan'){const m=window.CabinBayLayer.getDisplayMapping(),r=v.getBoundingClientRect();if(!m||!r.width||!r.height)return;const seats=['C1','C2'].map(id=>document.querySelector('[data-live-object="seat-'+id+'"]')||document.querySelector('[data-seat-marker="'+id+'"]')).filter(Boolean).map(n=>n.getBoundingClientRect()).filter(b=>b.width>0&&b.height>0);const left=seats.length?Math.min(...seats.map(b=>(b.left-r.left)/r.width)):.12,right=Math.max(m.rampAftX/m.width,...seats.map(b=>(b.right-r.left)/r.width)),top=Math.min((m.centerY-220*m.sourceScale)/m.height,...seats.map(b=>(b.top-r.top)/r.height)),bottom=Math.max((m.centerY+220*m.sourceScale)/m.height,...seats.map(b=>(b.bottom-r.top)/r.height));viewer.fitBounds({left:Math.max(0,left-.012),right:Math.min(1,right+.012),top:Math.max(0,top-.015),bottom:Math.min(1,bottom+.015)});}}
 document.getElementById('wholeAircraft').onclick=()=>{framing='whole';reset();labels();};document.getElementById('enlargeCabin').onclick=()=>{framing='cabin';reset();labels();};
 function labels(){document.getElementById('wholeAircraft').setAttribute('aria-pressed',String(view!=='plan'||framing==='whole'));document.getElementById('enlargeCabin').setAttribute('aria-pressed',String(view==='plan'&&framing==='cabin'));dock.dataset.hand=hand;}
 const select=options.querySelector('select');select.value=hand;select.onchange=()=>{hand=select.value;try{localStorage.setItem('cabinControlHand',hand);}catch{}labels();};
 dock.querySelector('#touchZoomIn').onclick=()=>viewer.changeZoom(viewer.getState().zoom+.35);dock.querySelector('#touchZoomOut').onclick=()=>viewer.changeZoom(viewer.getState().zoom-.35);dock.querySelector('#touchReset').onclick=reset;
 document.getElementById('planFit').textContent='Reset view';document.getElementById('planFit').onclick=reset;
 // Prevent the menu's outside-click handler from treating zoom controls as dismissal.
 dock.addEventListener('pointerdown',e=>e.stopPropagation());
 let start=null;
 function distance(t){return Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);}
 v.addEventListener('touchstart',e=>{if(e.touches.length===2){e.preventDefault();const r=v.getBoundingClientRect();start={distance:distance(e.touches),zoom:viewer.getState().zoom,x:((e.touches[0].clientX+e.touches[1].clientX)/2-r.left)/r.width,y:((e.touches[0].clientY+e.touches[1].clientY)/2-r.top)/r.height};v.dataset.pinching='true';}},{passive:false});
 v.addEventListener('touchmove',e=>{if(start&&e.touches.length===2){e.preventDefault();e.stopPropagation();viewer.changeZoom(start.zoom*distance(e.touches)/start.distance,start.x,start.y);}},{passive:false});
 v.addEventListener('touchend',e=>{if(e.touches.length<2){start=null;setTimeout(()=>delete v.dataset.pinching,150);}});
 v.addEventListener('click',e=>{if(v.dataset.pinching){e.preventDefault();e.stopImmediatePropagation();}},true);
 v.addEventListener('wheel',e=>{const state=viewer.getState();if(e.ctrlKey){e.preventDefault();const r=v.getBoundingClientRect();viewer.changeZoom(state.zoom*Math.exp(-e.deltaY*.008),(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height);}else if(state.zoom>1){e.preventDefault();viewer.pan(state.panX-e.deltaX/v.clientWidth,state.panY-e.deltaY/v.clientHeight);}},{passive:false});
 // Keep pan separate from two-finger zoom.
 v.addEventListener('pointermove',e=>{if(v.dataset.pinching)e.stopImmediatePropagation();},true);
 let visible=true;new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;dock.hidden=!visible;},{threshold:.1}).observe(v);
 new ResizeObserver(()=>{if(framing==='cabin'&&view==='plan')requestAnimationFrame(reset);}).observe(v);
 window.CabinTouchControls={paint(zoom){dock.querySelector('output').value=Math.round(zoom*100)+'%';dock.querySelector('#touchZoomOut').disabled=zoom<=1;dock.querySelector('#touchZoomIn').disabled=zoom>=4;},onView(id){view=id;document.getElementById('enlargeCabin').hidden=id!=='plan';document.getElementById('wholeAircraft').textContent=id==='plan'?'Whole aircraft':'Whole image';reset();labels();},reset};labels();
})();
