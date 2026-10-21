/* Explicit user decisions, separate from the pinned reference catalogue. */
(() => {
 const data=window.CH149_DATA;
 window.CabinPresetRules={apply(key,state){if(!['TRANSPORT','CASEVAC'].includes(key))return;state.roleFit.delete('RF_AIRCRAFT_SYSTEMS_SEA_TRAY');const loc=key==='TRANSPORT'?'INT_LIFE_RAFT_B3_STBD_F':'INT_LIFE_RAFT_B4_STBD_A',raft='ME_AIRCRAFT_ALSE_EQUIP_INTERNAL_LIFE_RAFT';state.roleFit.add(data.stowage[loc].roleFitKey);state.mission.add(raft);state.moved[raft]={loc};}};
})();
