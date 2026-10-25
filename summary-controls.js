/* A presentation preference only; summary contents and aircraft state are retained. */
(() => {
 const main=document.getElementById('cabinMain'),side=main.querySelector('.side'),root=document.getElementById('aircraftSummary'),heading=document.getElementById('aircraftSummaryRole').closest('.side-head');
 let minimized=false;try{minimized=localStorage.getItem('cabinSummaryMinimized')==='true';}catch{}
 const button=document.createElement('button');button.id='summaryToggle';button.setAttribute('aria-controls','aircraftSummary');heading.prepend(button);
 function paint(){main.classList.toggle('summary-minimized',minimized);side.classList.toggle('summary-collapsed',minimized);root.hidden=minimized;button.textContent=minimized?'Aircraft summary ◂':'Minimize summary ▸';button.setAttribute('aria-expanded',String(!minimized));button.setAttribute('aria-label',minimized?'Expand aircraft summary':'Minimize aircraft summary');}
 button.onclick=()=>{minimized=!minimized;try{localStorage.setItem('cabinSummaryMinimized',String(minimized));}catch{}paint();window.CabinViewControls?.placeDock();};
 window.CabinSummaryControls={getState:()=>({minimized})};paint();
})();
