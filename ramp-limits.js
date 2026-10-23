/* Active Dev AC_RAMP limits and hinge-moment proxy, applied to combined ramp loading.
 * Source app.js checks cargo individually; aggregation and shelf exclusion follow
 * the confirmed prototype rules. Warnings remain editable, as in Active Dev.
 */
(() => {
 const data=window.CH149_DATA,limits=Object.freeze({...data.ramp});
 const number=n=>Number(n).toLocaleString('en-CA',{maximumFractionDigits:2});
 function assess(state,replacement,except){
  const entries=(state.floorLoads||[]).filter(row=>row.installed!==false&&String(row.id)!==String(except));
  if(replacement&&replacement.installed!==false)entries.push(replacement);
  const loads=entries.filter(row=>row.area==='RAMP'||Number(row.arm)>=limits.hinge&&Number(row.arm)<=limits.end).map(row=>({weight:Number(row.weight),arm:Number(row.arm)}));
  // Only the stowed litter is ramp equipment here; shelves and their contents
  // have independent limits and are deliberately excluded, regardless of arm.
  const litter=data.missionEquip.ME_SAR_MISSION_EQUIP_STOKES_LITTER_RAMP;
  const stokes=state.mission?.has('ME_SAR_MISSION_EQUIP_STOKES_LITTER_RAMP')?litter.unitWeight*(litter.defaultQuantity??1):0;
  if(stokes)loads.push({weight:stokes,arm:data.stowage.RAMP_STOW.arm});
  const weight=loads.reduce((sum,row)=>sum+row.weight,0),moment=loads.reduce((sum,row)=>sum+row.weight*(row.arm-limits.hinge)/1000,0),arm=weight?limits.hinge+moment/weight*1000:null;
  const warnings=[];
  if(loads.some(row=>!Number.isFinite(row.weight)||!Number.isFinite(row.arm)||row.arm<limits.hinge||row.arm>limits.end))warnings.push(`Ramp arms must be ${limits.hinge}–${limits.end} mm.`);
  if(weight>limits.maxClosed+1e-9)warnings.push(`Ramp closed: ${number(weight)} kg exceeds ${limits.maxClosed} kg.`);
  if(weight>limits.maxOpen+1e-9)warnings.push(`Ramp open: ${number(weight)} kg exceeds ${limits.maxOpen} kg.`);
  if(moment>limits.hingeMomentMax+1e-9)warnings.push(`Hinge moment proxy: ${number(moment)} kg·m exceeds ${limits.hingeMomentMax} kg·m.`);
  return {weight,moment,arm,stokes,count:loads.length,closedOK:weight<=limits.maxClosed+1e-9,openOK:weight<=limits.maxOpen+1e-9,momentOK:moment<=limits.hingeMomentMax+1e-9,warnings,
   // This is a combined-load CG bound, not a permissible arm for every item.
   maxCombinedArm:weight?Math.min(limits.end,limits.hinge+1000*limits.hingeMomentMax/weight):limits.end};
 }
 function markup(state,replacement,except){const s=assess(state,replacement,except);return `<div class="ramp-limit-status" role="status"><strong>${s.warnings.length?'Caution · Ramp loading':'Ramp loading checks'}</strong><p>${number(s.weight)} kg total · ${s.arm===null?'No load CG':number(s.arm)+' mm combined arm'} · ${number(s.moment)} kg·m hinge moment proxy</p><p>Closed: ${limits.maxClosed} kg · Open: ${limits.maxOpen} kg · Hinge moment proxy: ${limits.hingeMomentMax} kg·m. Arms: ${limits.hinge}–${limits.end} mm.</p>${s.warnings.map(message=>`<p class="floor-reason">${message}</p>`).join('')}<details><summary>Included loads and arm check</summary>${s.weight?`<p>At this total weight, combined arm must be at or forward of ${number(s.maxCombinedArm)} mm for the hinge-moment check.</p>`:''}<p>Includes cargo, ramp bay weight${s.stokes?' and '+number(s.stokes)+' kg stowed Stokes':''}. Ramp shelves and shelf contents are excluded. Warnings do not prevent editing.</p></details></div>`;}
 window.CabinRampLimits={limits,assess,markup};
})();
