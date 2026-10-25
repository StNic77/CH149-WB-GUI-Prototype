> **Device-test release, 25 October 2026:** The user has now explicitly authorized committing and pushing this prototype for iPhone/iPad testing. Earlier local-only/uncommitted/no-publish statements below are historical. Current behavior is recorded in CONTROLS_REVIEW_2026-10-25.md; physical device acceptance remains pending.

> **Latest local review, 25 October 2026:** Controls, immediate contents multi-select, fuel strip, framing and collapsible summary are updated. See [CONTROLS_REVIEW_2026-10-25.md](CONTROLS_REVIEW_2026-10-25.md). Earlier menu descriptions below may describe the preceding iteration. No publication or Active Dev changes.

> **25 October 2026 update:** The user subsequently authorized the compact contents-menu increment after interactive mock-up review. It is now implemented locally for review. See [COMPACT_CONTENTS_REVIEW_2026-10-25.md](COMPACT_CONTENTS_REVIEW_2026-10-25.md) for the current flow, checkpoint and checks. Older no-further-code statements below describe the prior handoff; unrelated review findings remain open. No commit, push, publication or Active Dev changes.

# CH-149-615 Cabin UI Prototype — Current Development Handoff

Updated 24 October 2026 after the user's first review of the LOCAL usability package.

## Resume here: discussion, not another coding pass

The user wants to game out the GUI interactions before further implementation. The latest request is to update the continuity documents and resume in a new chat. Earlier permission authorized the completed local package; it is not a fresh request to implement the review findings. No further application edits, Active Dev changes, commits, pushes or publication are requested by this handoff.

The user reviewed the package and identified substantial usability problems. Automated checks passed, but the GUI has NOT been accepted as usable or ready to integrate. Start with the installation/removal/quantity workflow, using concrete scenarios. Do not lead with another engine or architecture investigation of capabilities already solved in Active Dev.

Read alongside this file:
- `CONTINUE_IN_NEW_CHAT_PROMPT.md`: concise next-chat brief and first discussion task.
- `IMPROVEMENT_BACKLOG.md`: current requirements and the complete eleven-point review.
- `DEVELOPMENT_PLAN.md`: revised GUI-first sequence and later integration gates.
- `DEVELOPMENT_HISTORY.md`: historical decisions and the 24 October implementation/review record.
- `LOCAL_REVIEW_PACKAGE.md`: how to run the current, imperfect local package.
- `LOADING_WORKSPACE_CHANGES.md`: earlier loading implementation, with a current-status notice.

## Checkpoint and publication

- Prototype: `C:/Users/sstni/Desktop/615 WB edit work/CH-149-615 Cabin UI Prototype`.
- Active Dev: `C:/Users/sstni/Desktop/615 WB edit work/CH-149-615-WB - Active Dev`.
- Git: `main`, last commit `dbb53a9` (Prevent stale assets from breaking returning iPad layouts). The local branch matches the locally recorded `origin/main`; no remote refresh or live deployment verification was performed in this session.
- Earlier application checkpoints: `b3cf1da` loading workspace; `79e673c` cargo slots/cautions. Do not restore those older checkpoints over the new local work.
- The 24 October usability package is UNCOMMITTED and UNPUSHED. Preserve all local application and document changes. Do not reset or clean the working tree.
- Active Dev, pinned catalogue, source calculation bodies, source imagery and approved calibration were not changed by the usability package.
- Repository: https://github.com/StNic77/CH149-WB-GUI-Prototype
- Published demo: https://stnic77.github.io/CH149-WB-GUI-Prototype/ — the new local package is not published there.
- Local URL: http://127.0.0.1:61448/ . Double-click `START_DEMO.cmd` from the prototype folder, or use `npm start`. Check an existing listener before starting a duplicate; do not stop unrelated processes. Direct `index.html` opening is also supported.
- Aircraft edits remain session-only. Refresh clears them. Role Config selection deliberately reapplies standard equipment; Back to 2D changes only the view. Existing custom cargo/bay entries and planning data survive Role Config changes.

## Product direction and sequencing

The final product should have Active Dev's power and the prototype's image-first interface. Active Dev's model, editor, configuration, acceptance/inclusion rules, accounting, calculations, fuel, MCDU workflow and clearance output remain the foundation. Preserve its existing editor capabilities, including fleet and tail-specific definitions. Do not recreate those solved functions as a competing engine.

The user explicitly redirected today's effort: improve GUI usability incrementally, test it, then wire it to Active Dev and resolve integration foibles. Integration packaging remains a later technical choice. Do not get stuck in minor engine details or prematurely put a full architecture audit ahead of GUI refinement.

Future workflow decisions (agreed in discussion; not implemented by this package):
1. Select a tail and record its aircraft information, including basic weight/CG and recorded fuel; accept the starting record.
2. Selecting a tail with existing work resumes that session. Start fresh is explicit and warns before resetting.
3. Editing accepted information is allowed through a warning/reset flow, rather than permanently locking the fields. Confirming resets that tail to no Role Config, clears configuration/loading edits and certification, retains the tail and revised acceptance information, and requires acceptance again. Cancel preserves the session.
4. No Role Config does NOT mean every role-fit item is absent. Editor-defined normal fit and basic-weight inclusion are separate. SAR-10 omits the PTA Cot while flotation/ice protection can remain installed as defined.
5. Active Dev already has Normally fitted and Included in recorded aircraft weight settings and tail-specific support. The user's -511 ECS Pack example is always fitted but added to basic weight. Do not infer inclusion from permanence or normal installation; unresolved aircraft data are not decisions to invent.

## Implemented locally on 24 October — not a usability sign-off

- Screen-anchored +/−/Reset view controls, right hand by default and mirrored left-hand setting; aircraft-only pinch and pan; wheel pan/Ctrl+wheel zoom. Browser pinch outside the viewer remains available for text. Physical-device review is still needed.
- Whole aircraft / Enlarge cabin framing controls. The user reports Enlarge cabin skews the view and cuts off C1/C2; this implementation needs correction.
- Short area-choice cascades leading to existing dedicated editors. Shelf and equipment panels now offer individual quantities, extra units, split allocations, selected-unit moves/removals, Select all/Clear selection, bulk install/remove/move and one destination per group.
- Catalogue defaults are starting quantities, not assumed inventory ceilings. CASEVAC can carry four Penetration Kits without a SAR Cabinet by choosing another defined location. Explicit configured maxima remain distinct from defaults.
- `state.equipmentAllocations` is translated into the existing pinned reference resolver/calculations. Local source/destination/shelf/bay/aircraft totals use those rows. NVG default 4 in E / 1 in F remains.
- Quantity controls are − / quantity / + with direct entry. Signed bay/cargo mass changes have separate + Add / − Subtract controls and accept direct negative entry; negative loads are not created.
- Complete equipment list, Installed before Not installed and alphabetical within groups; item actions, split locations and Add more. Installation/prerequisite recovery exists but the interaction is confusing in user review.
- Fitting/stowage/conflict checks and alternate destination hints for baskets, Stokes and internal raft. Missing required stowage is not a valid destination; existing occupant/patient safeguards remain.
- Default container removal removes the container AND its local contents from the aircraft. Relocate contents first is a secondary path. This supersedes the earlier relocation-first default. Retained relocated units must remain counted once; reinstall must not duplicate them.
- Last-equipment-action Undo, currently in the bottom results bar. The user rejected that location: next design must keep Undo in the relevant menu, where it can persist. Do not describe this correction as already implemented.
- Trial equipment symbols for non-imaged equipment and stowage contents, off initially in 2D and on in detail views; symbol key; medical pouch for narcotics with NO N. SAR Cabinet shelves need no extra symbols.
- Trial fuel panel: automatic/manual distribution, tank quantities, preferred landing reserve and optional per-tank image labels. Reserve means planned fuel remaining at landing. A preferred 300 kg reserve can remain selected, but zero aboard gives zero planned landing fuel and a shortfall warning.
- Automatic tank quantities are expandable; manual mode opens those fields. Apply fuel is sticky at the top. A Safari-engine phone obstruction was found and corrected during testing.
- Image layer settings were partly consolidated under Image layers, but equipment/fuel toggles are separate and controls still use checkboxes. The user's new requirement is ALL layer controls together as compact state-coloured buttons.

## Latest user review — all eleven points remain open

1. Controls, specifically Role controls, are too far from the image.
2. Global Undo Equipment is inappropriate; it should exist and persist only in the menu it concerns.
3. Enlarge cabin visually skews/crops the view and loses C1/C2. Discuss the supplied framing reference; preserve proportions, both pilot-seat targets and the full ramp. Do not move calibration to compensate.
4. Some equipment symbols are on the wrong aircraft side. Two Guidelines should use one symbol with ×2. The symbol set and placements need more work.
5. Fuel might be better as a strip across the bottom of the image, showing bays, tanks and quantities when selected. This is a proposal to explore, not an agreed final layout.
6. Menus still are not compact enough, especially on Mini/mobile. Discuss and refine the interaction, not just smaller fonts.
7. Detail-view symbology is liked, but placements need correction. The user tentatively suggested grabbing/dragging a symbol into place in a Role setting. Placement editing is NOT yet agreed. It must not accidentally move loads, change arms or install equipment.
8. In 2D, symbols outside the cabin and boxed stowage-location labels are disliked. Prefer live clickable fixture/region interaction like the SAR Cabinet; ramp access needs work.
9. Equipment symbols can hide fuel indications. This remains a review defect despite earlier automated checks.
10. All layer controls should be together, smallish buttons rather than checkboxes, changing colour for selected state. Retain clear accessible selected-state semantics.
11. Equipment install/remove/quantity interaction is confusing. The install list/action can remain ready for repeated additions; editing quantities afterward involves awkward reselection. Walk through the precise desired list transition, selection and post-install controls before coding. Do not assume an assistant-proposed return-to-shelf/highlighted-item flow was accepted.

Full detail is in the backlog. Start by gaming out one Penetration Kit workflow, then a group and a container/dependency example. Make clear decisions before the next bounded implementation request.

## Durable reference images

Copies of the user attachments are saved locally:
- `references/2026-10-24-framing-reference.png`: latest broad cabin/cockpit-to-ramp image, supplied for framing consideration. It is not new calibration or an approved crop coordinate set.
- `references/2026-10-24-sponson-discussion.png`: red arrow = Stbd, green arrow = Port.

The references directory is Git-ignored. The images are available locally but would need explicit inclusion in a future release or reattachment if the next chat cannot access this workspace. Do not claim an image was reviewed if only its path is available.

Sponsons were first described as permanent compartments, then explicitly withdrawn as confirmed geometry: they may not exist as depicted and cited RFM equipment arms do not support those locations. Leave them unverified, empty and normally hidden. No destinations, IDs, arms or limits were added.

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

## Fuel and baseline cautions

Confirmed mapping: B1/T4 transfer, B2/T3 Main/Engine 3, B3/T2 Main/Engine 2 + APU, B4/T5 transfer, B6/T1 Main/Engine 1. Underfloor cells are full width; do not infer liquid shapes, capacity curves or pump thresholds from illustrations. Source automatic/manual fuel computation is reused; full burn visualization and operational outputs are not integrated.

The recorded SAR-3 mismatch remains unresolved as an integration/baseline issue: basic 10401 kg, CG 8487 mm, zero fuel; captured current-fit prototype 11423.20 kg / 8386 mm versus source maintenance inclusion 12002.77 kg (12003 displayed) / 8371 mm. Difference 579.57 kg = role-fit 474.43 + seat structures 105.14, with identical compared equipment/mission/crew. Do not artificially adjust source weights to match. Verify identical accepted inclusion states during later integration; do not let this delay agreed independent GUI work now.

Detail-image performance is PARKED by the user. Future delivery should carry forward the Active Dev principle of a full first-open device download, update checking and a saved-version fallback. The prototype does not gain those capabilities merely from browser caching.

## Implementation map

- `index.html`: state, role/view navigation, common render bridges; resets equipment allocations on Role Config application.
- `plan-viewer.js`, `touch-workspace.js`, `plan-viewer.css`: transform, pinch/pan/zoom, handed controls and current hardcoded working-area framing.
- `image-workspace.js/.css`, `compact-workspace.js`, `usability.css`: floating menus, cascades, signed load delta, menu positioning and package presentation.
- `equipment-actions.js`: local quantity/allocation transactions, dependencies, container removal, snapshots and Undo.
- `equipment-ui.js`: item/shelf/group/destination/Role Fit controls; currently creates Undo in `liveAircraftStrip`. This is the main menu-refinement area.
- `equipment-markers.js`: trial symbols, grouping, positioning, layer defaults and key. Placements are NOT approved.
- `destination-hints.js`: action-specific alternate basket/Stokes/raft destinations and basket contents access.
- `fuel-ui.js`: fuel panel, reserve/shortfall display, sticky Apply action and trial image labels.
- `planning-model.js`: graphical state/allocations/manual fuel translated into pinned source functions.
- `planning-reference.js`, `fuel-reference.js`, `planning-source.js`, `fuel-source.js`: pinned source functions/data; not live editor connectivity.
- `loading-feedback.js`: shelf/bay feedback/overview. `shelf-editor.js` remains an earlier implementation whose public render is replaced by `equipment-ui.js` after load; do not edit only the obsolete render and expect the current menu to change.
- `aircraft-summary.js/.css`: full grouped lists and entry points, people and loads.
- Existing seat, basket, PTA, Stokes, raft/Sea Tray, CASEVAC, cargo and ramp modules retain specialised operations and guards.
- `version-assets.cjs`: content-hashed script/style URLs; refresh after asset changes before checks/publication.

## Verification and remaining scope

The full tracked regression suite passed in Edge/Chromium after implementation. The new usability package passed in Chromium and Playwright WebKit at 1440×1000, 744×1133, 1133×744, 834×1194, 1194×834, 390×844 and 844×390. Chromium exercised a two-finger aircraft pinch without page scrolling/scaling. Safari-engine simulations on Windows are NOT physical iPad/iPhone validation. The later eleven-point user review is evidence that usability remains unfinished; passing tests do not overrule it.

Windows checks:
```powershell
$env:PLAYWRIGHT_MODULE='C:/Users/sstni/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'
$env:PLAYWRIGHT_CHANNEL='msedge'
& 'C:/Program Files/nodejs/npm.cmd' test
# Selected checks: npm test -- usability-package-check image-workspace-check
# Safari-engine package: set PLAYWRIGHT_ENGINE=webkit, then select usability-package-check.
```

`verification/run-checks.cjs` runs the suite; `compact-test-navigation.cjs` adapts older regression navigation through real cascade controls; `usability-package-check.cjs` covers new transactions, fitting recovery, hints, signed deltas, layers, fuel and responsive layouts. Legacy checks verify source parity (including all 4153 whole-kg fuel quantities), calibration, loads, seats, patients and warnings.

Still later: GUI usability acceptance; complete source/model integration; actual editor propagation; complete eligible-location/footprint review; named people/entered weights; operational acceptance/MCDU/clearance workflow; persistence/recovery; custodian/network/user workflow; reliable offline/update/reversion support. Conditional ramp-detail Stokes imagery remains parked.

When implementation is later authorized, complete routine steps and checks without repetitive conversational approvals. Respect genuine platform restrictions; explain actual blockers. Do not bypass device security or ask the user to disable it. This documentation pass changes no application behaviour and does not authorize publication.
