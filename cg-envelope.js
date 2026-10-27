/* Display ranges from the existing longitudinal weight/CG envelope. */
(() => {
 const envelope=window.CH149_PLANNING_SOURCE.envelope;
 function limitsAt(weight,clampOverweight=false){
  if(!Number.isFinite(weight))return null;
  const polygon=weight>15600?envelope.envAlt:envelope.envMain;
  const w=clampOverweight?Math.min(weight,Math.max(...polygon.map(p=>p.w))):weight,cuts=[];
  for(let i=0;i<polygon.length;i++){
   const a=polygon[i],b=polygon[(i+1)%polygon.length];
   if(a.w===b.w){if(w===a.w)cuts.push(a.cg,b.cg);}
   else {const t=(w-a.w)/(b.w-a.w);if(t>=0&&t<=1)cuts.push(a.cg+t*(b.cg-a.cg));}
  }
  return cuts.length?{forward:Math.max(envelope.hardCg.min,envelope.cgAbsolute.min,Math.min(...cuts)),aft:Math.min(envelope.hardCg.max,envelope.cgAbsolute.max,Math.max(...cuts))}:null;
 }
 function assess(weight,cg){
  const range=limitsAt(weight),comparison=range||limitsAt(weight,true);
  const out=Number.isFinite(cg)&&(cg<envelope.hardCg.min||cg>envelope.hardCg.max||cg<envelope.cgAbsolute.min||cg>envelope.cgAbsolute.max||comparison&&(cg<comparison.forward-1e-7||cg>comparison.aft+1e-7));
  return {weight,cg,limits:range,cgStatus:!Number.isFinite(cg)?'unreviewed':out?'out':'normal',weightStatus:weight>16000?'overweight':weight>15600?'alternate':'normal',band:!Number.isFinite(cg)?'':cg<envelope.cgBands.fwdMax?'Fwd':cg<=envelope.cgBands.midMax?'Mid':'Aft',withinEnvelope:!!range&&!out};
 }
 function flight(state){
  const result=window.CabinPlanning.evaluate(state),p=state.planning||{};
  if(!result.ready||result.issues.length)return {ready:false,reason:result.issues?.join(' ')||'Enter basic weight and CG.'};
  if(!Number.isFinite(p.fuel))return {ready:false,reason:'Enter fuel aboard to show takeoff and estimated landing CG.'};
  const reserve=p.reserve??300,landingFuel=Math.min(reserve,p.fuel);
  try{
   const fuel=window.CabinFuel.evaluate({total:p.fuel,manualTanks:p.fuelMode==='manual',tanks:p.tanks,landing:landingFuel},{weight:result.wb.nonFuelWExact,moment:result.wb.nonFuelM});
   return {ready:true,takeoff:assess(result.wb.auwExact,result.wb.auwCG),landing:assess(result.wb.nonFuelWExact+landingFuel,fuel.plot.landing.cg),burnTrack:fuel.plot.track,reserve,landingFuel,shortfall:Math.max(0,reserve-p.fuel),manual:!!fuel.plot.manual};
  }catch(error){return {ready:false,reason:error.message};}
 }
 window.CabinCGEnvelope=Object.freeze({limitsAt,assess,flight});
})();
