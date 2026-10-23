/* Unmodified fuel helper block from Active Dev compute.js. Private dependencies supplied by fuel-model.js. */
window.CabinFuelReferenceFactory=function(AC,STORE,computeWB){
const roundKg=Math.round,roundMm=Math.round;
const cgFromMoment=(w,m)=>w>0?m/w:null;
function solveFuelTanksFromTotal(totalKg){
  // Fill from stages, applying positive deltas only, sequentially, partially if needed.
  // This is a distribution solver for a total fuel amount.
  // Any negative stages are ignored for fill distribution; they’re transfer dynamics not a fill bucket.
  const tanks = {T1:0,T2:0,T3:0,T4:0,T5:0};
  let remaining = Math.max(0, totalKg);

  for (const st of AC.fuelStages){
    // stage capacity = sum of positive deltas
    const posKeys = Object.keys(st.deltas).filter(k => st.deltas[k] > 0);
    const cap = posKeys.reduce((a,k)=>a+st.deltas[k], 0);
    if (cap <= 0) continue;
    if (remaining <= 0) break;

    const take = Math.min(remaining, cap);
    const frac = take / cap;

    for (const k of posKeys){
      tanks[k] += st.deltas[k] * frac;
    }
    remaining -= take;
  }

  // rounding to nearest kg at end (you asked for that)
  for (const k of Object.keys(tanks)){
    tanks[k] = roundKg(tanks[k]);
  }

  // adjust rounding drift to match totalKg exactly by distributing +/-
  let sum = Object.values(tanks).reduce((a,b)=>a+b,0);
  let drift = roundKg(totalKg) - sum;
  const order = ["T3","T2","T1","T4","T5"]; // arbitrary stable order
  let i=0;
  while (drift !== 0 && i < 5000){
    const kk = order[i % order.length];
    tanks[kk] += (drift > 0 ? 1 : -1);
    drift += (drift > 0 ? -1 : 1);
    i++;
  }

  return tanks;
}

function computeFuelTotals(s){
  const total = roundKg(+s.fuel.total || 0);
  let tanks = s.fuel.tanks;

  if (!s.fuel.manualTanks){
    tanks = solveFuelTanksFromTotal(total);
    s.fuel.tanks = {...tanks};
  } else {
    // manual tanks: total is sum
    const sum = roundKg(Object.values(tanks).reduce((a,b)=>a+(+b||0),0));
    s.fuel.total = sum;
  }

  let w=0, m=0;
  for (const k of Object.keys(tanks)){
    const ww = +tanks[k] || 0;
    const arm = AC.fuelTankArms[k];
    w += ww;
    m += ww * arm;
  }
  return {w: roundKg(w), m};
}

/* =========================
   BURN TRACK
   Computes a sequence of {w, cg, label, fuel} points showing
   how AUW and CG evolve as fuel burns from departure down to
   landing weight. Uses the same fuel distribution solver so
   the CG shift matches how the tanks actually drain.

   Returns: array of points, departure first → landing last.
   ========================= */

function computeBurnTrack(tail){
  const s = STORE.sessions[tail];
  if (!s || s.fuel.manualTanks) return [];

  // Non-fuel state doesn't change during burn — capture once.
  // Use full non-fuel weight (OW + cargo + bay) and the TRUE moment,
  // not a reconstruction from rounded CG.
  const wb0     = computeWB(tail);
  const baseW   = wb0.nonFuelWExact ?? wb0.nonFuelW;
  const baseM   = wb0.nonFuelM;

  const fuelDep  = roundKg(s.fuel?.total ?? 0);
  const fuelLdg  = roundKg(Math.max(0, s.fuel?.landing ?? 300));

  // Helper: compute {w, cg} for a given total fuel amount
  const pointAtFuel = (fuelKg) => {
    const tanks = solveFuelTanksFromTotal(fuelKg);
    let fw = 0, fm = 0;
    for (const k of Object.keys(tanks)){
      const kg  = tanks[k] || 0;
      const arm = AC.fuelTankArms[k];
      fw += kg;
      fm += kg * arm;
    }
    const wExact = baseW + fw;
    const w  = roundKg(wExact);
    const m  = baseM + fm;
    const cg = roundMm(cgFromMoment(wExact, m) || 0);
    return { w, cg, fuel: roundKg(fw) };
  };

  // Sample the burn curve. We step every ~50 kg for a smooth line,
  // and explicitly include the departure and landing points.
  const track = [];
  const step  = 50;

  track.push({ ...pointAtFuel(fuelDep), label: "Departure" });

  for (let f = fuelDep - step; f > fuelLdg; f -= step){
    track.push({ ...pointAtFuel(f), label: null });
  }

  track.push({ ...pointAtFuel(fuelLdg), label: "Landing" });

  return track;
}


function computeLandingPoint(tail){
  const s=STORE.sessions[tail],wb=computeWB(tail);
  const fuel=Math.max(0,roundKg(s.fuel.landing??300));
  const tanks=solveFuelTanksFromTotal(fuel);
  const fm=Object.entries(tanks).reduce((n,[key,w])=>n+w*AC.fuelTankArms[key],0);
  return {w:roundKg(wb.nonFuelWExact+fuel),cg:roundMm(cgFromMoment(wb.nonFuelWExact+fuel,wb.nonFuelM+fm)),fuel,label:'Landing'};
}
function fuelPlotState(tail){
  const wb=computeWB(tail),s=STORE.sessions[tail];
  return {departure:{w:wb.auw,cg:wb.auwCG,fuel:wb.fuelTotal},landing:computeLandingPoint(tail),track:computeBurnTrack(tail),manual:!!s.fuel.manualTanks};
}


return {solveFuelTanksFromTotal,computeFuelTotals,computeBurnTrack,computeLandingPoint,fuelPlotState};
};
