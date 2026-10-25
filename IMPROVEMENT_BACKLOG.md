> **Device-test release, 25 October 2026:** The user has now explicitly authorized committing and pushing this prototype for iPhone/iPad testing. Earlier local-only/uncommitted/no-publish statements below are historical. Current behavior is recorded in CONTROLS_REVIEW_2026-10-25.md; physical device acceptance remains pending.

> **Latest local review, 25 October 2026:** Controls, immediate contents multi-select, fuel strip, framing and collapsible summary are updated. See [CONTROLS_REVIEW_2026-10-25.md](CONTROLS_REVIEW_2026-10-25.md). Earlier menu descriptions below may describe the preceding iteration. No publication or Active Dev changes.

> **25 October 2026 update:** The user subsequently authorized the compact contents-menu increment after interactive mock-up review. It is now implemented locally for review. See [COMPACT_CONTENTS_REVIEW_2026-10-25.md](COMPACT_CONTENTS_REVIEW_2026-10-25.md) for the current flow, checkpoint and checks. Older no-further-code statements below describe the prior handoff; unrelated review findings remain open. No commit, push, publication or Active Dev changes.

# Cabin workspace improvement backlog and user review

Updated 24 October 2026. This is the current discussion record, including implemented LOCAL work and the user's subsequent findings. It replaces the old blanket description of everything as discussion-only.

## Status and authority

A usability package was explicitly authorized, implemented and tested in the prototype on 24 October. It is uncommitted/unpushed, and Active Dev was not changed. The user then found eleven issues and requested that we game out the interactions before more code. The present request is documentation and a new-chat handoff only. Do not interpret this backlog as authorization to implement the next fixes or publish.

The next task is menu/interaction discussion, then framing/layer/symbol refinement. Active Dev's existing engine/editor are the foundation; do not reopen already solved source details or let an integration audit displace independent GUI work. Technical correctness checks do not establish usability acceptance.

## 1. Aircraft zoom, pan and handed controls

**Implemented locally; physical-device and layout refinement remain.**

- Controls stay anchored relative to the device in portrait and landscape; right hand is default, with mirrored left-hand selection.
- +/− and Reset view operate on the image and its targets, not menu/text size. Pinch beginning within the image zooms it; dragging pans the enlarged image. Browser accessibility pinch outside the image remains available to enlarge text.
- Menus remain open/readable during button zoom. Tap selects an object; drag/pinch must not accidentally activate it.
- Mouse wheel pans an enlarged image; Ctrl+wheel over it zooms it. These are alternatives, not required operator knowledge.
- The visible helper explains the benefit. Whole aircraft / Enlarge cabin / Reset view were accepted labels.
- Current review point 1 concerns Role controls being too far from the image; do not confuse moving those controls with abandoning device-relative zoom anchoring.

The earlier idea of locating plus/minus by aircraft Starboard/Port was refined into device-relative handed controls. Do not use screen left/right as aircraft Port/Stbd.

## 2. Useful Mini/phone framing and desktop wide view

**Whole aircraft and Enlarge cabin exist locally; Enlarge cabin needs correction.**

The useful span is around C1/C2 through the full approved aft ramp area, avoiding decorative nose/tail where possible. Both pilot controls, detail-view access and the complete ramp must remain reachable. Preserve source image proportions and all registered interaction layers; do not crop/regenerate the source, move calibration/boundaries or change arms.

The user reports that the current Enlarge cabin looks skewed and cuts off C1/C2. This is a reported display/fit defect, not proof of an accounting/calibration defect. A fresh reference image is saved at `references/2026-10-24-framing-reference.png`; it is for visual discussion, not accepted fit coordinates.

Preserve useful desktop and iPad Pro landscape behaviour. The earlier Wide view issue particularly concerned Mini, not every iPad. Responsive behaviour should follow available space. Review phone 390×844 / 844×390 and Mini 744×1133 / 1133×744 in F12 and on devices.

## 3. First-visit detail-image loading

**PARKED by explicit user decision on 24 October. Do not start here next.**

The demo loading is acceptable for now. Later delivery should use the Active Dev principle of a full first-open device download, update checking and access to a saved previous version as fallback. Do not treat ordinary browser caching as implemented offline/reversion support.

Earlier measurements of file sizes remain context: five detail PNGs approximately 37.5 MB total (Cabinet 4.36; Forward Shelves 5.43; Port Aft 4.27; Ramp Shelves 18.42; Stbd Aft 4.99 MB). The original minutes-long device delay was not independently timed; size alone does not establish its entire cause. No image optimization/regeneration was included in this package.

## 4. Independent quantities, extra units and split locations

**Implemented locally; interaction needs review, not a return to whole-item-only accounting.**

- Default quantities are the first choice, with easy − / quantity / + and direct entry.
- Show quantity here, weight per unit, local total and aircraft quantity/allocation context.
- Install extra units and choose where they go. Defaults are not inventory maxima; explicit configured maxima are separate.
- Remove a chosen whole-number quantity; move chosen units while the remainder stays. Each allocation counts once in local and aircraft totals.
- Source/destination totals, cautions, aircraft mass/moment/CG and fuel allowances follow the edited state. Show clear previews and current-versus-proposed meaning.
- Preserve catalogue/reinstall access. Reinstall/moving a container must not duplicate contents that were relocated.
- Example: Penetration Kit default 2 at 14.35 kg/unit in SAR_CABINET_MIDDLE. Human Remains Bag default 2 at 4 kg/unit in SAR_CABINET_BOTTOM. CASEVAC may carry four Penetration Kits elsewhere without a SAR Cabinet.
- NVGs retain default 4 in LOCKBOX_TOP/E and 1 in LOCKBOX_BTM/F. The same quantity/allocation system supports partial moves/removals.

Quantities are distinct from signed mass deltas: bay/cargo adjustment fields need a +/− sign choice because a mobile numeric keypad may omit minus. Direct negative entry also remains supported. A negative adjustment reduces a load; it does not create a negative load record.

## 5. Shelf weight information

**Source shelf/bay cautions and local totals already existed in the loading increment and remain connected.**

Keep contents total, limit and remaining/excess prominent. They update with applied edits; quantity/additional-weight controls provide previews. Unknown capacity must say so. The user specifically wants live feedback as items are edited.

Cabinet structure versus contents presentation is still parked. Do not add structure twice to aircraft accounting or count it as compartment contents. Local bay checks retain the user's explicit-load scope, excluding inferred fixed-equipment/seat/people loads.

## 6. Planning baseline versus Active Dev maintenance baseline

**Recorded correctness/integration issue; not fixed by the GUI usability package.**

Controlled SAR-3 comparison: basic 10401 kg, basic CG 8487 mm, zero fuel, same equipment, mission contents and crew:

| Accepted inclusion basis | Exact aircraft weight | Display CG | Role-fit adjustment | Seat-structure adjustment |
|---|---:|---:|---:|---:|
| Prototype current SAR-3 fit captured as included | 11423.20 kg | 8386 mm | 0 kg | 0 kg |
| Source fleet maintenance inclusion assumptions | 12002.77 kg (12003 displayed) | 8371 mm | +474.43 kg | +105.14 kg |

Difference 579.57 kg is reproduced by those two structural adjustments without changing crew. Prototype CURRENT snapshots the currently fitted structures as included; source `fleetMaintenanceBaseline` uses maintenance inclusion definitions. Identical input numbers and visible role names did not establish identical accepted states.

Later compare accepted inclusion, role/seat adjustments, mission allocations, people, cargo/bays and fuel individually. Preserve the reproduction and selection-order cases. Do not adjust source weights to force agreement or claim adapted-state function parity proves end-to-end equivalence. This issue must be resolved during integration, but is not today's reason to halt independent GUI usability work.

## 7. Authoritative engine, editor and future session lifecycle

**Product direction settled; full integration remains later.**

Active Dev's configuration, existing editor, accounting, model, calculations, fuel rules, MCDU and clearance outputs are the foundation. The final operator interface should follow the GUI prototype. Preserve fleet/tail editor definitions and eventual propagation into one aircraft state, not permanently diverging snapshots.

Read-only inspection confirmed the editor already separates Normally fitted from Included in recorded aircraft weight, supports tail-specific definitions and accepted inclusion records, and computes additions/removals. Do not rebuild that capacity. The user's -511 ECS Pack is an example of always fitted but added to basic weight. Ice protection/flotation treatment must come from the appropriate definition, not assumptions about permanence.

Agreed future workflow, not implemented in this package:
- Select tail, record its information and accept it; existing sessions resume by tail.
- Explicit Start fresh warns before reset.
- Changing acceptance information warns before applying. Confirm resets that tail to no Role Config, clears configuration/loading edits and certification, retains tail/revised information and requires acceptance again; Cancel leaves work intact.
- No Role Config is not an empty role-fit list. SAR-10 can have no PTA Cot and still retain flotation/ice protection according to definitions.

Technical packaging/network/user arrangements remain open. The user wants GUI usability first and wiring/foibles afterward; avoid minutiae already solved in Active Dev. Active Dev remained unchanged during this session.

## 8. Shelf multi-select and container hierarchy

**Implemented as a local trial; interaction is not accepted yet.**

Requirements agreed before the package:
1. Defaults first; quantities exceptionally easy to adjust.
2. Select all shelf items is an explicit choice, and any subset can be selected individually.
3. Contextual Install/Remove and Move follow selection, scoped to the selected quantities/locations.
4. One destination per grouped move. Different destinations use separate groups.
5. Undo restores the complete last equipment action, including affected allocations and dependent items, with totals recalculated. Latest review requires Undo in its relevant menu, not globally.
6. Unselected items/units stay untouched; catalogue availability survives removal.

Container hierarchy: area/stowage → basket/container → contents. Default Remove container removes it AND its local contents from the aircraft. Relocate contents first is a secondary, more involved workflow. This supersedes the older relocation-first default in the original backlog/plan.

Destinations must exist, be eligible, and have required stowage/fittings installed in Role Fit. For baskets, also respect PTA Cot and conflicting occupied seats; do not silently remove them. Stokes and internal raft follow their required support/location/patient rules. Highlight alternate destinations with reasons for unavailability. Source shelf/bay limits warn by default; physical/occupant/fitting guards remain.

## 9. Compact cascading menus

**Initial cascades implemented; user reports they remain too large/confusing. This is the FIRST next discussion.**

Area → short item/action choices → focused controls, with Back/breadcrumbs preserving state. Direct item selection should skip unnecessary area choices. Example: B3 Centre → Stokes Litter / Sea Tray / Cargo or Bay Weight. Minimize routine scrolling, especially Mini/mobile; do not simply shrink labels or hide important cautions/actions.

Game out Available versus Installed lists, defaults, selection scope, quantities and post-action focus. In particular, completing Install must not leave an ambiguous interface inviting inadvertent repeated additions. Agree how explicit Add more differs from editing quantity already aboard.

The assistant suggested returning to shelf contents with the new item highlighted. That was NOT accepted; the user requested discussion. No further menu changes are authorized by this document.

## 10. Sponson areas

**PARKED, unverified, empty and normally hidden.**

The user identified red-arrow Stbd and green-arrow Port areas in `references/2026-10-24-sponson-discussion.png`. They initially called them permanent compartments, then noted uncertainty whether they exist as depicted; RFM arms for likely contents do not support these locations. Do not retain the initial permanence statement as confirmation. No contents, destinations, IDs, arms or capacities have been assigned. They are outside the active refinement package.

## 11. Non-imaged equipment and stowage symbology

**Trial layer implemented; detail approach liked, substantial corrections needed.**

- Default off in 2D, on in detail views, toggleable to declutter. Hiding symbols never removes equipment or weight.
- SAR Cabinet needs no extra imagery/symbols: clicking a shelf already shows its contents.
- Port Forward Shelves, Ramp Shelves and overhead stowage should indicate associated equipment/contents; standalone non-imaged equipment should indicate actual presence, including stretcher, Guidelines/Weights and O2 Rack.
- Initial vocabulary: kitbag for B25/personal kit, plain medical pouch for narcotics (NO N), weapon silhouette, stretcher outline, line/weight, cylinder/O2, with a clear key and named-list fallback.
- Keep symbols glanceable and sparse. Latest review: correct wrong aircraft sides, group two Guidelines as one symbol ×2, avoid symbols outside cabin confines and replace boxed 2D stowage names with live clickable fixture/region interaction. Ramp access needs work.
- Detail imagery does not depict current configuration in every role. Current carried state and controls remain authoritative; do not present reference contents as fitted merely because photographed.
- The user tentatively suggested dragging detail symbols into place in a Role setting. This is not yet an approved editor feature. Discuss visual association/placement scope and persistence, and separate that from moving loads, arms, calibration or role installation.
- No decision to replace all live equipment graphics with symbols, auto-disable Live equipment or draw every cabinet item was made. Avoid unnecessary duplication/clutter.

## 12. Fuel panel, reserve and visual layer

**Automatic/manual panel and trial labels implemented; imagery needs further design.**

Fuel remains accessible without enabling an overlay: totals, tank quantities, distribution mode and preferred landing reserve. Reserve means planned fuel remaining at landing. Retain a preferred 300 kg choice if desired, but zero aboard means zero planned landing fuel, with a shortfall warning rather than an impossible 300 kg end value.

Confirmed bay/tank mapping: B1/T4 transfer; B2/T3 Main/Engine3; B3/T2 Main/Engine2+APU; B4/T5 transfer; B6/T1 Main/Engine1. Source fuel rules are used. Do not fabricate a liquid shape/level, tank geometry or new distribution/burn rules.

Current trial labels default off. User review reports they can be hidden by equipment symbols and suggests a strip across the bottom of the image showing bays, tanks and quantities when selected. Explore the strip and layer interaction; neither final layout nor automatic equipment-layer suppression was agreed. Full operational fuel/burn/output integration remains later.

## 13. Equipment list and installation state

**Full catalogue and initial hierarchy implemented; transitions need redesign through discussion.**

Role Config → category → item; Installed first, then Not installed, alphabetically within each group. Each item exposes its relevant action and allocations; extra units use explicit Add more. Equipment remains accessible without imagery and with the symbol layer hidden. Prerequisite stowage/fittings must be discoverable.

The user finds installation/removal frustrating: the install list/action appears to remain ready for repeating installation, while editing an installed quantity involves awkward reselection. Preserve this as user-observed behaviour, not a proven numerical double-count bug. Agree the expected transition between lists, what stays selected, whether/how the menu returns, and the distinction between quantity editing and another install. Do not mark this workflow finished because the underlying allocation tests pass.

## 14. First local review — eleven open findings (24 October)

All findings below are OPEN; no code fixes were made after this review. The user requested discussion and documentation for a new chat.

| # | User finding / requirement | Next discussion or verification |
|---|---|---|
| 1 | Controls (Roles) are too far from the image. | Keep role selection close to the working picture; clarify grouping without moving handed zoom away from its device-relative rule. |
| 2 | Undo Equipment is a poor global control. | It should exist/persist inside the menu it pertains to. Scope and interaction must be clear. |
| 3 | Enlarge cabin skews the image and cuts off C1/C2. | Review the supplied reference; preserve proportions, pilot controls and full ramp. Diagnose display fit without changing calibrated geometry. |
| 4 | Some symbols are on the wrong side; two Guidelines should be one symbol ×2. | Review orientation, item/location association and quantity grouping. |
| 5 | Fuel may belong in a bottom-of-image strip showing bays, tanks and quantities. | Trial/discuss the strip; no final design chosen. |
| 6 | Menus are still insufficiently compact. | Reduce navigation/scroll burden by clear focused steps, not just smaller text. |
| 7 | Detail symbols are liked but need corrections; perhaps drag them into place in a Role setting. | Placement editor is tentative. Do not conflate visual dragging with moving aircraft loads or changing arms. |
| 8 | 2D symbols outside cabin confines and boxed stowage-location labels are disliked. | Prefer live clickable areas like SAR Cabinet; review ramp fixtures/access. |
| 9 | Fuel indications are hidden in some cases with equipment symbols on. | Reproduce overlap/priority at phone/Mini sizes with both layers; reserve readable fuel space. |
| 10 | All layer controls together, compact buttons rather than checkboxes, selected-state colour. | Agree placement, state labels and touch/accessibility behaviour. |
| 11 | Install/remove/quantity interaction is confusing; repeat additions and awkward reselection. | Game out complete item lifecycle and post-action lists/selection before implementation. |

## 15. Next-session discussion order

1. Use two Penetration Kits on a shelf to walk through inspection, installing defaults, changing quantity, explicit Add more, removing one/all, moving part, Cancel/Back and local Undo. For each step state the visible list, selected item(s), quantity, action and result.
2. Repeat with CASEVAC carrying four kits without a SAR Cabinet; then a grouped shelf move and a basket/container/support example. Keep the same mental model.
3. Agree placement of Role/layer controls, and review the C1/C2-to-ramp framing image.
4. Review 2D versus detail symbol examples and the trial fuel strip, including simultaneous layers. Discuss a visual-placement mode only if it helps.
5. Only then agree a bounded local implementation/testing increment. Do not push automatically or begin source integration as a distraction from usability.

The current full Chromium regression suite and seven-size WebKit usability checks passed before these findings. They are useful baseline evidence, not acceptance. See the handoff for exact module/verification details and `DEVELOPMENT_PLAN.md` for the revised sequence.
