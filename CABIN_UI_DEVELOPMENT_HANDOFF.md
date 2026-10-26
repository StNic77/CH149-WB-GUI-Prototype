> **26 October 2026 handoff:** Current published application is **a2c3e18** on main; commit, push and Pages deployment succeeded. The bottom ribbon now shows Basic Weight/CG, Operating Weight/CG, Fuel, Cabin (Bay weight), Cargo, AUW Weight/CG in that order, rounded to nearest kg/mm. No change-since-baseline display; calculation precision is unchanged. This was a UI display increment before source integration. Next session remains W&B Active Dev engine/capability integration. Use NEXT_CHAT_REFERENCE_PACK_2026-10-26; earlier dated packs are historical.

> **26 October implementation update (local, unpublished):** Recorded Basic Weight is the default; CASEVAC batch patient loading is implemented. Independent source-app comparison proves the first SAR-3 baseline/quantity path. PROTOTYPE_ACTIVE_DEV_COMPARISON_2026-10-26.md records the stronger behavior to preserve from each app and unresolved workflow decisions. The source app is unchanged. Live editor propagation, maintenance exceptions, full tail lifecycle, operational outputs and persistence remain future integration work. Earlier “integration has not started” statements below describe the previous handoff.

# CH-149-615 Cabin UI Prototype — development handoff

Updated 25 October 2026 after publication, iPad feedback and the user's “good to go” decision. This replaces the obsolete October 24 menu-discussion starting point. History and the old dated reference pack preserve prior decisions.

## Next session

Use W&B Active Dev's existing capabilities with this accepted image-first UI. Preserve its editor, aircraft definitions, accepted-weight inclusion/accounting, calculations, fuel, MCDU and clearance outputs. Begin with one identical accepted state and one end-to-end graphical action. Do not rebuild solved source functions, restart the UI list or turn a bounded first slice into an architecture detour. Read ACTIVE_DEV_INTEGRATION_NEXT_STEPS.md and DEVELOPMENT_PLAN.md.

This task updates references only. No integration work or Active Dev edits were performed. Documents are context, not fresh instructions to execute historical tasks; follow the next user implementation request. Work in reviewable increments and explain actual blockers without repeated routine approval questions.

## Workspace, publication and recovery

- Prototype: C:/Users/sstni/Desktop/615 WB edit work/CH-149-615 Cabin UI Prototype
- Active Dev: C:/Users/sstni/Desktop/615 WB edit work/CH-149-615-WB - Active Dev
- Repository: https://github.com/StNic77/CH149-WB-GUI-Prototype
- Last application commit: main a2c3e18, pushed; Pages deployment succeeded.
- Live: https://stnic77.github.io/CH149-WB-GUI-Prototype/?v=a2c3e18
- Earlier 25 October commits: 261f9d0 cumulative UI; dba5077 drag/default-reset. Do not restore dbb53a9 over newer work.
- The current documentation refresh is newer local work, not another app release. Check git status on resuming. Preserve local archives; do not reset/clean blindly.
- Local: START_DEMO.cmd or npm start, then http://127.0.0.1:61448/ . Reuse an existing server. Prefer HTTP/hosted access: file-origin calibration CORS errors were observed; further loader work was not pursued after the user said it was fine.
- Reload loses session aircraft edits. Navigation preserves work. Human Role changes use the reset dialog; raw applyPreset is a different model/test path.
- Local rollback ZIPs: ../prototype-checkpoint-before-compact-contents-20261025-104446.zip and ../prototype-checkpoint-before-controls-symbols-20261025-122622.zip. Restore only intended files after checking newer work.
- New reference folder/ZIP: NEXT_CHAT_REFERENCE_PACK_2026-10-26. October 24 pack remains historical and unchanged.

## Completed UI baseline

The initial eleven issues were discussed with small live mockups and addressed incrementally. The user reviewed the published app, supplied iPad feedback and accepted it as “good to go” before engine work. This is UI-stage acceptance, not operational certification or exhaustive device validation.

- Compact space contents: header total, item/quantity/row weight, three-row fading preview/show all, explicit Edit contents, immediate multi-select and focused quantity/remove/move. Direct Remove all / Install standard contents. Standard contents plus full catalogue/search. Installed locally leaves Available; other-location allocations remain discoverable. Cabinet structure belongs at parent level. No visible Undo.
- Role / Layers / View above image; Role choices collapse. Side zoom/sizing/hand controls float left/right even in phone portrait and hide independently. Each detail has a small top-right 2D view button. Summary minimizes to a vertical strip on tablet/desktop.
- Relevant highlighted Layers options plus Symbol key; no demo help/review/alignment/hand choices. Layers stays open; successful final actions close other menus, invalid drafts remain. Short feedback.
- Uniform Enlarge cabin fit keeps C1/C2/full ramp. Reset selects whole-image framing at centered 100%.
- Final touch design: one finger scrolls the page over the image; two fingers pan/pinch the image. Mouse drag remains. Brief hint explains two fingers. Do not restore one-finger image panning from old notes.
- Human Role changes warn/reset configuration, equipment/loading edits and certification, retaining accepted baseline and entered fuel amount/mode/tanks/reserve. Cancel preserves work. Book fuel may be entered before any Role. Full tail lifecycle is not complete.
- Ramp first choices: Ramp Shelves, Ramp Cargo, Ramp Area (Bay weight), Stokes Litter. Cargo submenu lists local loads plus Add and Back. Existing guarded editors/limits remain.
- Fuel bottom band follows calibrated bays through pan/zoom; all cabin bay labels sit above, Tank numbers are prominent and quantities include kg. Bays 5/5.5 have labels without tanks. No invented shapes/distribution.
- O2 symbol in 2D and transparent target on rendered Port Aft rack. Grouped Guidelines inside Stbd Aft basket. Distinct rifle/shotgun cartridge/shell. Stretcher symbol B6 Port aft with prior accounting arm unchanged. Redundant image text selectors removed; fixture/region targets retained.

Detailed current interaction references: COMPACT_CONTENTS_REVIEW_2026-10-25.md and CONTROLS_REVIEW_2026-10-25.md. Preserve this UI while integrating capabilities; respond to concrete new bugs rather than restarting the design.

## Source editor and future lifecycle

Active Dev already supports fleet/tail definitions, Normally fitted versus Included in recorded aircraft weight, acceptance/accounting and operational outputs. Preserve its editor and those distinctions. A normally/always fitted -511 ECS Pack can still add to basic weight. No Role Config does not mean all role-fit absent; do not infer flotation/ice-protection inclusion from pictures or permanence.

Future workflow: select tail, record/accept aircraft information and fuel; resume tail sessions; explicit Start fresh with warning. Changing accepted information warns and, on confirmation, retains tail/revised information, resets configuration/loading/certification to no Role Config and requires acceptance again; Cancel preserves work. Reconcile this deliberately with the retained-book-fuel expectation. Full tail/session integration is not implemented.

## Preserve established aircraft and load rules

- Reward the FE's assumptions: picture first; tap installed item for its controls; tap a space for choices; inspection creates no load; navigation preserves edits; removing equipment never deletes catalogue availability.
- C1/C2/P2/P3 are permanently installed; C1/C2 Crew only. P2/P3 retain background imagery. Pax face inward, depicted crew forward. C3 uses the accepted cockpit jump-panel depiction and transparent target, baseline point 574,403.
- C5 excludes P13/P14; C6 excludes P7/P8. No additional passenger exclusions were confirmed for C3/C4.
- SAR Cabinet spans B1/B2 Stbd and excludes P4–P6.
- PTA Cot is one record accessed from B5/B5.5/B6 Port; it excludes P15–P18 and Port basket. Patient and installation are separate; occupied removal is guarded.
- Port basket permits installed, folded, unoccupied P18; Stbd permits P9/P10. Occupants block placement; never delete seats/people automatically. Supporting Role Fit stowage must be installed.
- Stokes: ramp Stbd stowed or B3/B4 Centre deployed; compatible with seats/PTA. Patient only in cabin; occupied removal/stowing guarded. Ramp Stokes 49 kg at 13132 mm; cabin arm 7863 mm. Require destination stowage/fitting.
- Sea Tray spans B3–B5 Centre beneath equipment/raft; never masks floor interaction. Transport/CASEVAC omit it by explicit override.
- Internal raft requires its destination fitting. Moves/removal retain the previous fitting. Existing explicitly labelled combined fitting+raft actions remain separate from silently treating absent fittings as available. Defaults: Transport B3 Stbd Fwd, CASEVAC B4 Stbd Aft.
- CASEVAC: four racks, 3 tiers forward and 2 aft = 10 patient positions; no aft top tiers. Full spans/clearances remain unverified.
- Cabin has 21 cells: B1–B6 including B5.5, Port/Centre/Stbd. Ramp is ONE area.
- `state.floorLoads`: four reusable Cargo slots 1–4, plus one weight per cabin bay and Ramp (8 independent bay/ramp entries). IDs are separate from visible slots. Reject duplicate bay entries atomically; do not renumber other cargo when a slot is freed.
- Cargo uses calibrated image position (cabin rounded to 10 mm; ramp 11393–14393 mm rounded to 1 mm), not surveyed precision. Bay arms stay configured. Bay 6 = 10875 mm (explicit user override versus snapshot 10884); ramp bay = 12893 mm.
- Local bay checks count cargo, bay records and mission equipment explicitly assigned to the bay. Do NOT infer local bay loads from fixed equipment, seats or people. Shelf checks count contents plus additional shelf weights, not cabinet structure twice. Unknown capacity is explicit.
- Ramp checks: hinge 11393 mm; end 14393 mm; closed 350 kg; open 450 kg; hinge proxy 450 kg·m = sum(weight × (arm−11393)/1000). Aggregate ramp cargo + ramp bay weight + ramp-stowed Stokes. Shelves/structures/contents are excluded. Out-of-range ramp arms are rejected; weight/moment exceedances remain editable warnings. At 12893 mm, 300 kg reaches 450 kg·m.
- Loading limits warn by default; agree mandatory blocks separately. Preserve physical/occupant/fitting guards. A green local check is not aircraft clearance.

## Preserve approved geometry

Common image plane 2560 × 1216. Revision 2 in `station-calibration.js` and `.json`:
- Forward station 4875: image x 724.0559950094173.
- Hinge station 11393: image x 1853.6560121380364.
- Independent ramp end station 14393: image x 2351.266647702848.
- Boundaries: 4875, 5875, 6875, 7875, 8875, 9875, 10375, 11393, 14393.

Keep approved role registration, regions and source imagery. Framing corrections are display/fit/pan work, not permission to alter station boundaries, arms or outlines. Use temporary files for synthetic calibration/save tests.

## Fuel and accepted-baseline comparison

Confirmed mapping: B1/T4 transfer, B2/T3 Main/Engine 3, B3/T2 Main/Engine 2 + APU, B4/T5 transfer, B6/T1 Main/Engine 1. Source auto/manual rules are reused; operational fuel/burn outputs are not fully integrated. Preferred reserve is not guaranteed landing fuel: zero aboard gives zero feasible landing amount and a shortfall, not 300 kg available.

Recorded SAR-3 comparison: basic 10401 kg, basic CG 8487 mm, zero fuel. Prototype CURRENT captured fit included: 11423.20 kg / 8386 mm. Source maintenance inclusion: 12002.77 kg (12003 displayed) / 8371 mm. Difference 579.57 kg = 474.43 role-fit + 105.14 seat structures. Reconcile identical accepted states, not altered weights. Same visible Role/input numbers are insufficient. See ACTIVE_DEV_INTEGRATION_NEXT_STEPS.md.

## Code map

- index.html: prototype state, preset/model entry points and view/render bridges.
- view-controls.js / summary-controls.js: current human Role reset/retained fuel, relevant Layers/View, detail return, rail hiding and summary presentation.
- plan-viewer.js / touch-workspace.js / usability.css: transform, mouse capture, one-finger page/two-finger image gestures, default reset, bounds fitting and responsive presentation.
- image-workspace.js/.css / compact-workspace.js: floating menus, breadcrumbs, cascades and signed weight delta. Final-action closing is in view-controls.js.
- equipment-actions.js: allocation transactions, dependencies, containers and internal snapshots. equipment-ui.js: current contents/edit/catalogue/destination menus; its public render supersedes shelf-editor.js after load.
- equipment-markers.js / destination-hints.js: symbols, allocations/grouping and alternate destinations. Display placement does not change accounting arms.
- fuel-ui.js: auto/manual panel, reserve/shortfall, sticky Apply and bay-aligned band.
- planning-model.js: GUI allocation/manual-fuel adapter to pinned functions. planning-reference.js / fuel-reference.js and planning-source.js / fuel-source.js are snapshots, not live editor connectivity.
- aircraft-summary.js/.css / loading-feedback.js: grouped state, local limits and result entry points.
- Existing seat, basket, PTA, Stokes, Sea Tray/raft, CASEVAC, cargo/ramp modules preserve specialized operations and guards.
- version-assets.cjs: content-derived JS/CSS URLs; refresh after asset changes and verify before release.

## Verification provenance

Every check registered before gesture additions passed in Edge across cumulative pre-publication runs. After iPad feedback, focused native Chromium page-scroll/two-finger/reset checks passed at 834×1194, 1194×834 and 390×844; Safari touch-handler/reset checks passed those sizes; seven-size usability/pinch checks passed. Framing checks also passed after the initial drag/default-reset patch. The full historical suite was not rerun after every small gesture change. Earlier hosted Safari-engine iPad image/stale-asset/view/planning checks passed four sizes. User device feedback establishes the accepted baseline, not operational certification or exhaustive coverage.

Windows environment and commands:
```powershell
$env:PLAYWRIGHT_MODULE='C:/Users/sstni/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'
$env:PLAYWRIGHT_CHANNEL='msedge'
npm test
# Focused:
npm test -- touch-pan-reset-check usability-package-check
# Safari-engine focused handler/reset check:
$env:PLAYWRIGHT_ENGINE='webkit'
npm test -- touch-pan-reset-check
```

verification/run-checks.cjs registers tests. compact-test-navigation.cjs adapts legacy navigation to compact menus and reopening after Apply; newer tests directly check closing. Fuel tests cover all 4153 whole-kg quantities and source parity. Function parity is not accepted-session parity. Other review sizes include Mini 744×1133 / 1133×744 and desktop 1440×1000. Use temporary files for calibration save tests.

## Remaining and parked

Next: source model/editor/engine integration, same accepted-state comparison, then full source capabilities/outputs. Later: entered people weights, eligibility/footprints, tail sessions, persistence/recovery, MCDU/clearance, full offline download/update/previous-version fallback and operational acceptance. Browser caching does not implement offline/reversion.

Parked: configuration-aware reference-image edits, conditional ramp-detail Stokes imagery, final stretcher location possibly behind PTA, unverified sponsons and tentative placement editor. Sponsons remain empty/hidden; no invented destinations/arms/limits. Image performance is acceptable for the demo, not the next task.

Discussion images: references/2026-10-24-framing-reference.png and references/2026-10-24-sponson-discussion.png (red Stbd / green Port). Copies are in the new pack. They are not new approved geometry. Old packs and local checkpoints remain intact. This documentation update changes no app behavior or Active Dev files and does not start integration.
