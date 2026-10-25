> **Device-test release, 25 October 2026:** The user has now explicitly authorized committing and pushing this prototype for iPhone/iPad testing. Earlier local-only/uncommitted/no-publish statements below are historical. Current behavior is recorded in CONTROLS_REVIEW_2026-10-25.md; physical device acceptance remains pending.

> **Latest local review, 25 October 2026:** Controls, immediate contents multi-select, fuel strip, framing and collapsible summary are updated. See [CONTROLS_REVIEW_2026-10-25.md](CONTROLS_REVIEW_2026-10-25.md). Earlier menu descriptions below may describe the preceding iteration. No publication or Active Dev changes.

> **25 October 2026 update:** The user subsequently authorized the compact contents-menu increment after interactive mock-up review. It is now implemented locally for review. See [COMPACT_CONTENTS_REVIEW_2026-10-25.md](COMPACT_CONTENTS_REVIEW_2026-10-25.md) for the current flow, checkpoint and checks. Older no-further-code statements below describe the prior handoff; unrelated review findings remain open. No commit, push, publication or Active Dev changes.

# Loading workspace — implementation cross-reference

## Current status notice — 24 October 2026

The original 23 October increment below is historical. A subsequent LOCAL usability package now adds per-allocation quantity editing, extra units, grouped equipment actions/Undo, touch controls, compact-menu trials, symbols, signed mass deltas and a manual/automatic fuel panel with preferred landing reserve. Current modules and scope are in `CABIN_UI_DEVELOPMENT_HANDOFF.md` and `LOCAL_REVIEW_PACKAGE.md`. `equipment-ui.js` now replaces the earlier shelf-editor render after load; `equipment-actions.js` owns the prototype's editable allocation rows.

Main's last commit is `dbb53a9`; the 24 October application changes and documents remain uncommitted and unpushed. Active Dev, source calculation bodies, catalogue, imagery and calibration were unchanged. Do not assume this local package is in the published demo.

The full Chromium suite and seven-size WebKit package checks passed. The user subsequently identified eleven substantial usability issues; the GUI is not usability-accepted. See backlog section 14. Next work is to game out the menus and review framing/layers/symbols before further code, not to repeat already implemented loading cautions or start a source-engine audit. No post-review application fixes or publication are authorized by this record.

23 October 2026. Local development on main after 79e673c. This increment brings planning aircraft calculations forward; it does not establish operational equivalence or certification.

| Requested change | Implementation | Verification |
|---|---|---|
| Obvious access to every detail view | `index.html`: six labelled view buttons; a labelled Views selector on phone widths. `image-workspace.js`: aircraft access points including both aft views, cabinet and shelves; Back to 2D retained. | `verification/loading-workspace-check.cjs`: every view, direct Starboard Aft access and return, desktop/tablet/phone portrait and landscape. |
| Remove left workflow sidebar | Removed workflow navigation and stopped loading placeholder stage navigation; `workspace.css` gives the workspace full width. Aircraft summary remains separate. | No workflow sidebar, no horizontal overflow; existing navigation/state retention checks adapted to actual view switching. |
| Live shelf totals and source limits | `planning-source.js` pins current shipped limits using Active Dev's explicit capacities and legacy fallback rules. `planning-model.js` uses source mission allocations/resolution; `shelf-editor.js` shows total, limit, remaining/excess, quantities and additional shelf weight. `loading-feedback.js` adds a detail-view compartment overview. | Unit and browser checks cover contents + extra load, removal, moves, unknown capacity and overloads that remain editable. |
| Bay limits | Source bay-entry maxima: 3,000 kg, except Bay 5.5 at 1,500 kg. At the user's choice, aggregate cargo, bay records and mission equipment explicitly assigned to that bay; do not infer bay loads from fixed equipment/seat/person stations. Show the accounting scope beside the check. Ramp retains its independent combined rules and shelf exclusion. | Combined entries, draft replacement without double counting, excess and recovery, existing ramp regressions. |
| Live AUW, CG, fuel and change since planning baseline | `planning-reference.js`: pinned source calculation, accounting and mission resolver functions in a private factory. `planning-model.js`: translates current UI state without changing the source app or introducing another aircraft engine. `planning-ui.js`: persistent result strip, session-only basic weight/CG and weight basis, fuel entry and allowances. | Source calculation parity plus mass/CG changes, captured equipment baseline removal, cargo/bays/shelf additions, fuel cap and browser update checks. |
| NVG split: four in E, one in F | Source `defaultAllocations` now feed local contents and calculations: LOCKBOX_TOP (E) quantity 4; LOCKBOX_BTM (F) quantity 1. `itemsAt` reads those allocation rows. All five sets count once. | Unit checks for both compartment quantities, total five, move/removal mass and CG; browser checks both shelves. |

## Planning basis

The operator chose manual planning basic weight and CG entry. RFM basis adds removable role fit/seat structures according to the source accounting rules. The alternative current-fit basis snapshots currently installed role fit and seat structures as included in the entered basic weight; subsequent removals subtract them once. Mission contents, people, shelf additions, cargo and fuel remain separate in both modes. Applying a new planning baseline resets the displayed change reference. Role Config changes preserve the planning baseline and custom load entries. Full save/restore remains unimplemented.

People use the source standard weights until named people and individual weights are refined. Missing carrier/stowage arms remain unresolved, suppress the CG readout and produce an explicit warning. With fuel unentered, the engine uses zero and the UI says fuel is not entered. Envelope status uses the pinned source envelope; this is planning feedback, not aircraft clearance.

The Fuel menu shows fuel to 15,600 and 16,000 kg AUW using current total non-fuel weight, capped at 4,152 kg. This includes cargo/bay loads, unlike Active Dev's Operating-Weight-only briefing display recorded during the original increment. As of 24 October, manual tank entry is available through the local trial fuel panel as well as automatic source distribution. Full burn plotting/operational integration remain later. Preferred landing reserve is retained separately from the feasible planned landing quantity; zero aboard never displays 300 kg as actual landing fuel.

## Allocation scope

The 23 October increment displayed/counted split defaults but used whole-item moves/removals. That limitation is superseded locally on 24 October: selected units can now move or be removed from a specific allocation while other units remain, and extra units can be installed at chosen destinations. NVGs still default to four in E and one in F. Bulk actions and Undo use the same edited allocation state and pinned source calculation functions. The user's review concerns the clarity of those menus and their post-action list/selection behaviour; it does not authorize discarding the quantity/allocation capability.

## Source ownership and performance

Original catalogue, geometry and imagery are preserved. Capacity/envelope data are a separate source snapshot, with source-file hashes. `port-planning-source.cjs` deliberately imports only the required reference definitions/functions; demo use never reaches back into Active Dev or custodian storage. Active Dev remains unchanged. Calculations run on edits, without timers or a burn simulation, and reference code adds no source UI/storage dependency.

## Still deferred

Still deferred: physical footprints/full eligibility, entered people weights, operational acceptance/persistence/reporting, final fuel imagery/burn plot, complete source/model integration and deliberate-difference reconciliation. Individual quantities and manual tank controls now exist as local trials. GUI usability is unfinished, and the current aircraft summary/global Undo/layer layout is subject to the eleven-point user review. Detail-image performance/offline/update/reversion work is explicitly parked for the demo.

## Validation completed

Full `npm test` passed before commit: fuel solver parity for all 4,153 whole-kilogram quantities; planning/source-engine comparison and allocation/accounting tests; existing demo, embedded/hosted/file calibration, cargo integrity/relocation, image-local menus, refinements, aircraft summary, ramp and cargo-slot checks; and the new loading-workspace checks at 1440×1000, 834×1194, 1194×834, 390×844 and 844×390. Screenshots were inspected at phone size. A fixed-strip scrolling obstruction and a view-label/seat overlap found during regression were corrected before the passing run. Tests did not modify the source app, pinned equipment catalogue, approved geometry or reference imagery.

## Returning iPad loading repair

After publication, the user reported Safari on iOS 27 showing a disorganized page without the aircraft. A retained older workspace stylesheet was reproduced collapsing an 834px workspace to 190px and hiding Views. This establishes a release/cache defect; it does not independently prove the cause of every symptom on the physical iPad.

`version-assets.cjs` now assigns content hashes to all app script/stylesheet URLs. `npm run assets:version` refreshes them before release; `npm test` rejects stale/missing hashes. The new iPad loading check injects the older stylesheet for the old URL, verifies current requests avoid it, and confirms aircraft image loading, full-width layout, views and planning controls at 834×1194, 1194×834, 768×1024 and 1024×768. It passed using Playwright WebKit 26.5 as well as Edge; this is Safari-engine testing on Windows, not physical iOS 27 validation. Set `PLAYWRIGHT_ENGINE=webkit` for that check. An optional `IPAD_TEST_URL` exercises the hosted deployment.
