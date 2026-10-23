# Loading workspace — implementation cross-reference

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

The Fuel menu shows fuel to 15,600 and 16,000 kg AUW using current total non-fuel weight, capped at 4,152 kg. This includes cargo/bay loads, unlike Active Dev's current Operating-Weight-only briefing display. Full burn plotting and manual tank controls remain deferred; automatic source distribution supplies fuel weight/moment here.

## Allocation scope

Split allocations are displayed and counted. The existing item-level remove/move actions still affect the entire equipment item, including all its allocations; the shelf controls state this explicitly. Per-allocation quantity editing is a later refinement. Removing NVGs from the aircraft removes all five; it never leaves a hidden sixth/double-counted record. A move preserves five sets and combines their allocations at the chosen destination.

## Source ownership and performance

Original catalogue, geometry and imagery are preserved. Capacity/envelope data are a separate source snapshot, with source-file hashes. `port-planning-source.cjs` deliberately imports only the required reference definitions/functions; demo use never reaches back into Active Dev or custodian storage. Active Dev remains unchanged. Calculations run on edits, without timers or a burn simulation, and reference code adds no source UI/storage dependency.

## Still deferred

Physical footprints/full location eligibility; individual quantities and entered people weights; operational acceptance/persistence/reporting; fuel visual design, burn plot and manual tank UI; complete comparison of both aircraft models and their deliberate differences. The aircraft summary is retained as a separate section; a mobile drawer is optional future refinement.

## Validation completed

Full `npm test` passed before commit: fuel solver parity for all 4,153 whole-kilogram quantities; planning/source-engine comparison and allocation/accounting tests; existing demo, embedded/hosted/file calibration, cargo integrity/relocation, image-local menus, refinements, aircraft summary, ramp and cargo-slot checks; and the new loading-workspace checks at 1440×1000, 834×1194, 1194×834, 390×844 and 844×390. Screenshots were inspected at phone size. A fixed-strip scrolling obstruction and a view-label/seat overlap found during regression were corrected before the passing run. Tests did not modify the source app, pinned equipment catalogue, approved geometry or reference imagery.
