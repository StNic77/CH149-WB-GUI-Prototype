/* Explicit user decisions, separate from the pinned reference catalogue. */
(() => {
 const data=window.CH149_DATA;
 const rack='RF_SAR_EQUIPMENT_DIVE_O2_BOTTLE_RACK',withoutRack=key=>['TRANSPORT','CASEVAC'].includes(key);
 window.CabinPresetRules={revision:1,apply(key,state){if(!withoutRack(key))return;state.roleFit.delete(rack);state.roleFit.delete('RF_AIRCRAFT_SYSTEMS_SEA_TRAY');const loc=key==='TRANSPORT'?'INT_LIFE_RAFT_B3_STBD_F':'INT_LIFE_RAFT_B4_STBD_A',raft='ME_AIRCRAFT_ALSE_EQUIP_INTERNAL_LIFE_RAFT';state.roleFit.add(data.stowage[loc].roleFitKey);state.mission.add(raft);state.moved[raft]={loc};},migrate(state,revision=0){return revision<1&&withoutRack(state.preset)?state.roleFit.delete(rack):false;}};
})();
