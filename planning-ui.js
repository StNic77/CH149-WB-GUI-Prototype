/* Operator planning controls. Calculations run only on edits through the shared refresh. */
(() => {
 const kg=window.CabinLoadingFeedback.kg,number=n=>Number(n).toLocaleString('en-CA',{maximumFractionDigits:2}),s=()=>window.CabinImageState();
 const strip=document.createElement('section');strip.id='liveAircraftStrip';strip.setAttribute('aria-label','Aircraft weights and centres of gravity');strip.innerHTML='<div id="liveAircraftValues" role="status"></div><div class="aircraft-ribbon-actions"><button id="openFuel" type="button">Fuel</button></div><div id="aircraftRibbonWarning" role="status" hidden></div>';document.body.append(strip);
 let ribbonHeight=0;new ResizeObserver(()=>{const height=Math.ceil(strip.getBoundingClientRect().height);if(height!==ribbonHeight){ribbonHeight=height;document.documentElement.style.setProperty('--aircraft-ribbon-height',height+'px');}}).observe(strip);
 function openFuel(){window.CabinImageMenu.close();const fuel=document.querySelector('[data-summary-id="fuel"]');fuel.open=true;fuel.scrollIntoView({block:'center',behavior:'smooth'});}
 document.getElementById('openFuel').onclick=openFuel;
 function cgOutside(wb){
  return window.CabinCGEnvelope.assess(wb.auwExact,wb.auwCG).cgStatus==='out';
 }
 function render(){
  const state=s(),result=window.CabinPlanning.evaluate(state),values=document.getElementById('liveAircraftValues');values.replaceChildren();
  function value(key,label,weight,cg){const box=document.createElement('span'),name=document.createElement('small'),strong=document.createElement('strong');box.className='aircraft-ribbon-metric';box.dataset.aircraftMetric=key;name.textContent=label;strong.textContent=Number.isFinite(weight)?kg(Math.round(weight)):key==='basic'?'Enter basic data':key==='fuel'?'Not entered':'—';if(Number.isFinite(weight))box.dataset.weight=weight;box.append(name,strong);if(cg!==undefined){const position=document.createElement('span');position.className='aircraft-ribbon-cg';position.textContent='CG '+(Number.isFinite(cg)&&cg>0?number(Math.round(cg))+' mm':'—');if(Number.isFinite(cg)&&cg>0)box.dataset.cg=cg;box.append(position);}values.append(box);return box;}
  const p=state.planning||{},wb=result.ready?result.wb:null,session=window.CabinPlanning.session(state),bayWeight=Object.values(session.bays).reduce((n,w)=>n+Number(w),0),cargoWeight=session.cargo.reduce((n,row)=>n+Number(row.w),0);
  value('basic','Basic',p.basicWeight>0?p.basicWeight:null,p.basicCG>0?p.basicCG:null);
  value('operating','Operating',wb?.opWExact,wb?.opCG??null).title='Includes Basic, configured equipment, crew and other operating items. Excludes fuel, bay weights and individual cargo.';
  value('fuel','Fuel',p.fuel);
  value('cabin','Cabin (Bay weight)',bayWeight).title='All bay-weight entries, including Ramp. Individual cargo is separate.';
  value('cargo','Cargo',cargoWeight);
  const auw=value('auw','AUW',wb?.auwExact,result.ready&&!result.issues.length?wb.auwCG:null);auw.title='Operating + Fuel + Cabin (Bay weight) + Cargo';
  const valid=result.ready&&!result.issues.length,outCG=valid&&cgOutside(wb);
  auw.dataset.weightStatus=!valid?'unreviewed':wb.flags.overweightAirborne?'overweight':wb.flags.altGross?'alternate':'normal';
  auw.dataset.cgStatus=!valid?'unreviewed':outCG?'out':'normal';
  if(valid&&(wb.flags.overweightAirborne||wb.flags.altGross)){const note=document.createElement('span');note.className='aircraft-ribbon-weight-status';note.textContent=wb.flags.overweightAirborne?'OVER WEIGHT':'Alternate Gross Weight';note.title=wb.flags.overweightAirborne?'AUW above 16,000 kg':'Alternate Gross Weight (15,600–16,000 kg)';auw.querySelector('strong').after(note);}
  if(valid){const position=auw.querySelector('.aircraft-ribbon-cg'),cgValue=document.createElement('span'),band=document.createElement('span');cgValue.className='aircraft-ribbon-cg-value';cgValue.textContent=(outCG?'OUT CG ':'CG ')+number(Math.round(wb.auwCG))+' mm';band.className='aircraft-ribbon-cg-band';band.textContent={FWD:'Fwd',MID:'Mid',AFT:'Aft'}[wb.cgBand]||'';position.replaceChildren(cgValue,band);}
  const warning=document.getElementById('aircraftRibbonWarning'),otherEnvelope=valid&&!wb.flags.envOk&&!outCG&&!wb.flags.overweightAirborne&&!wb.flags.altGross;
  warning.hidden=!(result.ready&&(result.issues.length||otherEnvelope));warning.textContent=warning.hidden?'':result.issues.length?'Resolve load locations':'Outside weight/CG envelope';
  strip.dataset.limitStatus=result.ready&&(result.issues.length||wb.flags.overweightAirborne||wb.flags.altGross||!wb.flags.envOk)?'caution':'unreviewed';
  const fuel=document.querySelector('[data-summary-id="fuel"]');if(fuel){fuel.querySelector('.live-fuel-planning')?.remove();const box=document.createElement('section');box.className='live-fuel-planning';
   const title=document.createElement('h3');title.textContent='Fuel planning';box.append(title);
   const fuelForm=document.createElement('form');fuelForm.innerHTML='<label>Fuel aboard / planned (kg)<input name="fuel" type="number" min="0" max="4152" step="1"></label><button type="submit">Set fuel</button>';fuelForm.elements.fuel.value=state.planning?.fuel||'';fuelForm.onsubmit=event=>{event.preventDefault();const input=fuelForm.elements.fuel,n=Number(input.value);if(!Number.isFinite(n)||n<0||n>4152)return;state.planning??={};state.planning.fuel=Math.round(n);renderSeats();};box.append(fuelForm);
   for(const row of result.ready?result.allowances:[]){const p=document.createElement('p');p.textContent=`Max fuel to ${number(row.auw)} kg AUW: ${kg(row.maxFuelKg)}${row.overweightWithoutFuel?' · WARNING: already overweight without fuel':''}`;if(state.planning?.fuel!==undefined){const change=row.maxFuelKg-state.planning.fuel;p.textContent+=change>=0?' · '+kg(change)+' available to add':' · '+kg(-change)+' to remove';}box.append(p);}
   const note=document.createElement('p');note.textContent=!result.ready?'Enter planning basic data to calculate fuel allowances.':result.issues.length?'WARNING · '+result.issues.join(' '):state.planning?.fuel===undefined?'Fuel not entered: AUW/CG currently use zero fuel.':'Weight-based allowances include all current non-fuel loads. CG and the envelope require a separate check.';box.append(note);
   if(result.ready){const p=document.createElement('p');p.textContent=(result.wb.flags.overweightAirborne?'WARNING · OVER WEIGHT. ':'')+(!result.wb.flags.envOk?'WARNING · Outside source weight/CG envelope. ':'')+(result.wb.flags.altGross?'Above 15,600 kg; alternate gross-weight envelope applies.':'');if(p.textContent)box.append(p);}
   fuel.querySelector('summary').after(box);
  }
 }
 const old=window.CabinAircraftSummary.render;window.CabinAircraftSummary.render=function(...args){old(...args);render();};
 window.CabinPlanningUI={render,openFuel};render();window.CabinLoadingFeedback.overview();
})();
