/* On-demand fuel adapter. No aircraft state, listeners, polling or background calculations. */
(() => {
 const data=window.CH149_FUEL_SOURCE,keys=Object.keys(data.fuelTankArms);
 function quantity(value,name){if(typeof value!=='number'||!Number.isFinite(value)||value<0||value>data.maxFuelKg)throw new RangeError(`${name} must be 0–${data.maxFuelKg} kg.`);return Math.round(value);}
 function evaluate(input,nonFuel){
  const manual=!!input.manualTanks;
  const tanks=Object.fromEntries(keys.map(k=>[k,manual?quantity(input.tanks?.[k]??0,k):0]));
  const total=manual?Object.values(tanks).reduce((a,b)=>a+b,0):quantity(input.total,'Total fuel');
  quantity(total,'Total fuel');
  const landing=quantity(input.landing??300,'Landing fuel');
  if(landing>total)throw new RangeError('Landing fuel cannot exceed departure fuel.');
  const session={fuel:{total,landing,manualTanks:manual,tanks}};
  let reference;
  function computeWB(){
   if(!nonFuel||!Number.isFinite(nonFuel.weight)||nonFuel.weight<=0||!Number.isFinite(nonFuel.moment))throw new Error('Complete aircraft non-fuel weight and moment required.');
   const fuel=reference.computeFuelTotals(session),w=nonFuel.weight+fuel.w;
   return {nonFuelWExact:nonFuel.weight,nonFuelW:nonFuel.weight,nonFuelM:nonFuel.moment,auw:Math.round(w),auwCG:Math.round((nonFuel.moment+fuel.m)/w),fuelTotal:session.fuel.total};
  }
  reference=window.CabinFuelReferenceFactory(data,{sessions:{preview:session}},computeWB);
  const totals=reference.computeFuelTotals(session);
  return {fuel:{...session.fuel,tanks:{...session.fuel.tanks}},...totals,plot:nonFuel?reference.fuelPlotState('preview'):null,advisory:manual?'Predicted burn trace unavailable in Manual Fuel mode. Landing CG uses mapped landing fuel.':null};
 }
 function allowances(nonFuelWeight){
  if(typeof nonFuelWeight!=='number'||!Number.isFinite(nonFuelWeight)||nonFuelWeight<=0)throw new Error('Complete aircraft non-fuel weight required.');
  return data.auwTargets.map(auw=>({auw,maxFuelKg:Math.max(0,Math.min(data.maxFuelKg,Math.floor(auw-nonFuelWeight))),overweightWithoutFuel:nonFuelWeight>auw}));
 }
 window.CabinFuel=Object.freeze({evaluate,allowances});
})();
