/* Unmodified cargo/bay/CG helpers from the read-only reference compute.js.
   Source SHA256: 211e7ce6a50402193c11e992a8920a12153a4dba5adb534f033c52d538624584
   Scope: custom-load subtotals only; no aircraft acceptance/fuel/operating result. */
(() => {
const AC={bayArms:Object.fromEntries(window.CH149_BAY_DATA.bays.map(b=>[b.id,b.arm]))};
function cgFromMoment(totalW, totalM){
  if (totalW <= 0) return null;
  return totalM / totalW;
}

function computeCargoTotals(s){
  let w=0, m=0;
  for (const c of s.cargo){
    const ww = +c.w || 0;
    const arm = +c.arm || 0;
    w += ww;
    m += ww * arm;
  }
  return {w, m};
}

function computeBayTotals(s){
  let w=0, m=0;
  for (const bay of Object.keys(s.bays)){
    const ww = +s.bays[bay] || 0;
    const arm = AC.bayArms[bay];
    w += ww;
    m += ww * arm;
  }
  return {w, m};
}
window.CabinLoadMath=Object.freeze({cgFromMoment,computeCargoTotals,computeBayTotals});
})();
