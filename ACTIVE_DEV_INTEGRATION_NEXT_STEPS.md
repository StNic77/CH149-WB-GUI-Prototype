# Active Dev integration — remaining work

Updated 27 October 2026, prototype release 39b9b7f. The first bounded SAR-3 baseline/equipment quantity and landing comparison is already complete. PROTOTYPE_ACTIVE_DEV_COMPARISON_2026-10-26.md is historical evidence of that slice, not proof of complete editor/lifecycle/output parity.

Preserve Active Dev's existing definitions, accepted inclusion/accounting, computation, automatic fuel solver and operational outputs. Preserve the prototype's accepted graphical interactions and confirmed physical guards. Keep artwork placements separate from W&B arms. Do not build a permanently competing aircraft model or silently force totals to match.

Next integration slices should be chosen with the user after current device feedback:

1. Connect live fleet/tail editor definitions and maintenance/custom inclusion exceptions to the same accepted aircraft state used by graphical actions.
2. Extend matched-state comparisons to other Roles, split/group moves, fitting/container rules, occupants/patients, bay/cargo loads and manual fuel.
3. Complete accepted-aircraft lifecycle and per-tail recovery, distinct from the prototype's already implemented first-session entry/local resume.
4. Reconcile Operating Weight versus non-fuel/AUW and source output requirements; then integrate MCDU/briefing/clearance, certification and invalidation.
5. Complete eligibility/footprint checks and individual person weights; plan offline delivery, updates and rollback only when selected.

Known inclusion example: with SAR-3 Basic Weight 10401 kg / CG 8487 mm / zero fuel and compared carried fit aligned, CURRENT captured-fit basis produced 11423.20 kg / displayed CG 8386 mm; maintenance definitions produced 12002.77 kg / displayed CG 8371 mm. Difference 579.57 kg = 474.43 role fit + 105.14 seats. These are distinct accepted inclusion bases. Do not change source mass/arms/crew to hide it.

Normally fitted is independent of Included in recorded aircraft weight; permanence does not establish inclusion. No Role Config is not necessarily empty Role Fit. The prototype now defaults Recorded Basic Weight and has working session entry/resume; older instructions to implement those from scratch are superseded. Human Role changes retain aircraft/fuel while confirming configuration/loading reset. Renewed-acceptance fuel policy and fit-only Role behavior remain discussion items.

Inspect actual source files before each slice: config.js, editor.js, accounting.js, accounting-ui.js, compute.js, app.js and mcdu.js. Active Dev was clean at 16a592f, config v30, when this pack was prepared. Do not edit it merely because this document describes integration. Follow the next explicit user task and validate exact component weights/moments/CG and relevant outputs.
