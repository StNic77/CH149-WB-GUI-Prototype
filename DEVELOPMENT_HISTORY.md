# CH-149-615 graphical prototype — Development History

Updated 24 October 2026 after the local usability package and first user review. This records major work and decisions, not a full transcript or operational-validation claim. The current specification is `CABIN_UI_DEVELOPMENT_HANDOFF.md`; the next-session brief is `CONTINUE_IN_NEW_CHAT_PROMPT.md`.

Subsequent discussion settled engine/model authority: Active Dev's configuration, editor definitions, accounting and calculations will drive the GUI. Packaging remains undecided. The reproduced SAR-3 discrepancy arises from different accepted inclusion baselines; the source model is the reconciliation target. See `IMPROVEMENT_BACKLOG.md` for this decision and the latest usability/performance/quantity notes. These discussion notes authorize no implementation or publication; earlier statements of an entirely open model/engine decision are historical.

Latest checkpoint: main remains at `dbb53a9`; the 24 October GUI usability package is local, uncommitted and unpushed. Active Dev was unchanged. The full Chromium suite and seven-size WebKit usability checks passed, but the user identified eleven usability issues and did not accept the GUI as finished. The next task is to game out menus/interactions in a new chat before more coding. See sections 17–20 and the current backlog/plan. Sections 1–16 below are historical; their old pending-status, sequencing and authorization statements do not override the latest scope.

## 1. Aim and starting material

This independent cabin UI prototype sits alongside the developed CH-149-615 W&B Active Dev application. The user wants aircraft configuration/loading operated through the picture, eventually retaining the developed application's calculations, information and workflows.

Initial guidance was in README, the GUI roadmap, alignment notes, development handoff and continuation prompt. Those accumulated dated updates and superseded proposals. The latest handoff/prompt consolidate current status rather than requiring the next chat to interpret contradictory append-only notes.

The guiding principle became explicit: reward the FE's assumptions. Clicking an item or space should expose its relevant actions there; visible aircraft and state should agree.

## 2. Alignment, bays and calibration

- The user identified forward/aft joints and reviewed bay/seat alignment across No Role Config, SAR3, SAR10, Transport and CASEVAC.
- Browser origins and per-plan local marks initially produced inconsistent guides. Export/import, shared/project-backed saves and stale-save protection were developed.
- When Pages differed from a correct local view, approved coordinates were embedded so fresh browsers, direct files, hosted deployments and unavailable storage share the same alignment.
- Bay6 fixed arm10875 was explicitly retained despite its slightly longer physical station span; source snapshot10884 remains recorded as provenance.
- Ramp end was established as14393. The user later adjusted/imported only its visual aft edge; that independent coordinate was embedded without changing cabin joints, real station values or configured arms.
- Bays Review annotates station boundaries above/below the plan. Current exact approved marks are in the handoff and station-calibration JS/JSON.

## 3. Seating and corrected dependencies

- Passenger schematic positions were separated from standard role installation. The18 possible positions did not prove all belonged in Transport; later defaults followed the pinned source plus explicit overrides.
- C5 versus P13/P14 and C6 versus P7/P8 were confirmed exclusive. C3/C4 received no additional passenger exclusions.
- Cabinet P4–P6 and PTA P15–P18 installation exclusions were added.
- An initial basket-versus-seat removal assumption was corrected: port permits P18 installed/folded/unoccupied; stbd permits P9/P10. Occupants block placement and are never automatically removed. Basket movement restores eligibility without deleting seat mass.
- Port basket and PTA cot were confirmed mutually exclusive.
- Passenger alternatives became hidden rather than ghosted under installed C5/C6.
- Pax imagery was aligned with backs against walls and inward-facing seats; depicted crew seats face forward.
- C3's fabricated blue crew-seat graphic was rejected. The user accepted an existing cockpit jump-panel depiction as the visual baseline, retaining the source arm and a transparent selection target.
- C1/C2/P2/P3 became permanently installed and directly interactive. C1/C2 were later made crew-only.
- Centred patient symbols and crew/pax seat-occupant symbols were added. Full named people/entered person weights remain unfinished.

## 4. Reviewed containers and detail views

SAR cabinet regions were mapped and saved. Port forward shelves were located at B1 Port with Top/Middle/Bottom/Floor detail regions. The user outlined/imported four ramp shelves and both overhead locations; selection and configured-arm consistency were checked.

Aft views were renamed Port Aft View and Starboard Aft View. Empty Cabin Reference tab/image was removed. Raft stowage mapping was initially deferred; internal raft controls were subsequently implemented.

The common interaction became: installed item opens its controls, floor opens its choices, container opens its close-up and compartment contents, and Area options returns to the underlying space.

## 5. Area-first menus and load placement

B6 Port/P18 was the shared-space pilot for seat, PTA, basket, cargo and bay weight. Floor names were standardized to B1 Port/Centre/Stbd through B6 including B5.5:21 cabin cells. User requested hiding cell labels on the image.

Ordinary floor inspection was separated from Cargo placement. Cargo explicitly starts point selection; it estimates an arm from the selected longitudinal position and primarily asks for weight, with optional description/known-arm override. Bay weight remains a fixed configured-arm entry.

The ramp was confirmed as a SINGLE loading area. Shelf loads have separate limits and do not consume ramp allowance; ramp-stowed Stokes does consume it.

## 6. Complete item interactions and live layers

- Basket became the first complete item example: selection, inspect/move/remove, named destinations, Area options and linked gear arm/unresolved-state updates.
- PTA gained install/remove and separate patient states. Inspecting it stopped implicitly adding a patient. B5/B5.5/B6 Port all reach one cot record; occupied removal remains guarded.
- Stokes location was clarified: normally ramp starboard, cabin-deployed B3/B4 Centre with optional patient, compatible with seats/PTA. Occupied removal/stowing is blocked.
- The Stokes symbol was positioned aft of starboard shelves independently of source arm. Supplied imagery established deployed orientation; the ramp picture was refined to preserve SAR3 shelf overlap instead of the rejected detached aft wire frame.
- Live layers made baskets, cot, Stokes, supported seats and folded states appear/disappear/move over a common baseline. P2/P3 remain in background by user direction. Original role images remain accessible with Live equipment off.
- Crops, seat orientation and layer ordering were refined. These are approximate display layers, not surveyed fit/clearance evidence.
- Sea Tray became editable from B3/B4/B5 Centre, below raft/equipment and non-blocking for floor interaction/bay guides.
- Internal raft and separate required fittings were added at B3 Stbd Fwd/B4 Stbd Aft. Moves preserve fittings; invalid fitting removal is guarded.
- Explicit default overrides omit Sea Tray in Transport/CASEVAC and install raft/fitting at Transport B3 Stbd Fwd or CASEVAC B4 Stbd Aft.
- CASEVAC four-rack controls and patients were added. A provisional aft top-tier proposal was withdrawn; current forward racks have3 tiers each and aft racks2 each:10 patient positions. Full rack spans/clearances remain unconfirmed.

## 7. Independent cargo records and public groundwork

An apparent overwrite was investigated. Multiple records were stored, but cell-filtered lists and absent persistent symbols made earlier loads appear lost. One authoritative floorLoads collection, aircraft-wide symbols and an all-load inspector made entries independently visible/editable.

The user clarified four individual cargo entries plus one separate weight per cabin bay and Ramp. Unique identities, isolated CRUD, duplicate-bay rejection, atomic invalid edits, movement cancellation and12 simultaneous records were tested.

Pinned cargo/bay/CG helper bodies provide explicitly labelled custom-load subtotals only. They do not constitute connection of aircraft acceptance/equipment/people/fuel/full W&B.

The public repository and Pages demo were created and incrementally updated. Later image-first work was intentionally kept local until the user accepted it as main.

## 8. Image-first refinement

A discussion of cluttered mixed buttons led to layer controls and one consistent floating workspace. Selecting an item focuses its controls within the location context; breadcrumbs keep underlying choices accessible. Container/detail contents open locally instead of requiring a scroll to another editor.

Redundant Browse controls and schematic-strip navigation were retired. A visible Back to 2D action prevents reselecting a preset simply to return to the image. Compartment menus prioritize role-normal equipment, retain removed items for reinstall, and group/collapse/search other catalogue items.

Cargo clears the menu for position selection, supports small draggable/keyboard-adjustable markers and dismisses successful new-entry forms. Primary actions and responsive placement were refined across desktop/iPad/phone orientations.

The six-section collapsible live aircraft summary was added: acceptance, role-fit/groups/edits, mission/groups/edits, people/patients/seating, fuel placeholder, load planning. Supported rows open local editors; unconnected capability remains explicit.

## 9. Ramp loading cautions

Read-only source inspection found hinge11393, end14393, closed350kg, open450kg and450kg·m hinge-moment proxy. Active Dev's hints warn on individual cargo; its rear-area editor uses450kg as a bay cap.

The prototype applies those source constants/formula to aggregate ramp cargo+ramp bay weight+stowed Stokes, excluding shelves under the user's confirmed rule. Its combined-arm bound is an explanatory result of that proxy, not a new independently verified load curve or an arm permission for each item.

At the user's request, Cargo can select anywhere on the ramp and drag before completion. Selected longitudinal image fraction estimates station arm; ramp bay weight stays12893. Exceeded weight/moment stays editable with cautions; an out-of-range Ramp arm is rejected atomically. Both open/closed checks are shown, without simulating ramp actuation.

## 10. Reusable slots, status colours and sidebar removal

The user identified ever-increasing visible load numbers. A separate MCDU slot field now supplies Cargo1–4, lowest-free-slot reuse and stable numbering for remaining loads. Unique internal identities remain separate to prevent stale selection/removal from targeting a new load. Bay weights use bay names and do not consume slots.

Ramp symbols turn green when current checks pass, red+! for an aggregate caution. Grey cabin loads have no connected cabin limit check. Issue text is at the top of selected-load menus and in the sidebar; draft edits preview cautions. Sidebar Remove buttons delete only the chosen record and immediately update slots, totals, imagery and cautions.

## 11. Git checkpoints and publication

| Commit | Change |
|---|---|
|3c54b02|Initial interactive public cabin GUI demo|
|7f773d8|Floor hover/focus above live equipment|
|a8b1562|Approved station alignment embedded for hosted/file use|
|049a4cd|Alignment loader versioning for cached demos|
|6279532|Independent cargo layer and guarded cargo/bay records|
|5ecbafa|Bay station labels and ramp cargo entries|
|30805a4|Independent approved ramp aft edge; former local main|
|6cf460b|Image-local item/location menus and layers|
|9e27974|Fixed seats, role-led stowage, point-first cargo refinements|
|200b61f|Collapsible aircraft summary, crew-only pilot seats|
|92ebbef|Source ramp checks and cargo point placement|
|79e673c|Reusable cargo slots, status colours/cautions, sidebar removal|

The user explicitly chose the image-first implementation as the winner and requested commit/push to main, with no need to keep an old parallel version alive. Main was fast-forwarded to79e673c and pushed; Pages deployment succeeded and its cargo file was checked. No force push/history replacement was needed. Working tree was clean before these continuity documents were written.

## 12. Fuel scope and corrections

The user explicitly retained fuel AND its visualization in the work list. Initial B4/B6 tank identities were reversed, then corrected: B4=T5 transfer; B6=T1 main. Other mapping remains B1=T4 transfer, B2=T3 main, B3=T2 main/APU.

Supplied excerpts describe full-width underfloor cells, engine/APU supply, transfer/crossfeed, B1/B2 upper70%-level port and lower non-return flap, combined analysis above that level and filling sequence. Older notes describing70% as wholly undefined or reversing B4/B6 are superseded.

Those descriptions do not establish every capacity, variable arm curve, pump threshold or exact tank shape. The user awaits suitable student-guide imagery before choosing the visualization. No working GUI fuel editor/full fuel connection exists; the developed reference app already contains the fuel/calculation foundation.

## 13. Closing development discussion

The user reports having heavily exercised the prototype with expected results. This establishes a promising interface concept, not complete model coverage or operational/calculation validation.

Agreed next priorities:
1. Extend source capacity cautions to shelves/stowage and cabin bays, correctly counting contents and additional loads.
2. Use WARNING FIRST for exceeded loading limits. Agree mandatory blocks individually; do not automatically prohibit every exceedance or remove unrelated existing guards.
3. Plan a selectable equipment-location layer without fancy imagery, starting with bottle/O2 rack and Talon stretcher near PTA.
4. Compare prototype/reference definitions and dependencies before full integration; explicitly decide which model/rule to keep or correct.
5. Continue building operator capability before connecting the full end-to-end workflow.

Active Dev already has the developed math engine. Final architecture remains open: its model/engine may need adaptation, the prototype may evolve, or parts may combine. Existing structure does not automatically win every decision. Active Dev remains read-only until a future agreed scope authorizes changes.

Outstanding: complete equipment/eligible locations/quantities/allocations; full people weights/identities; rack footprints; acceptance/accounting; whole-aircraft results/envelope; fuel; MCDU/reports; save/restore/recovery; custodian/offline/release workflows.

Specifically parked: conditional ramp-stowed Stokes imagery in Ramp Shelves detail view; it needs perspective/occlusion review and is not next.

## 14. Verification and continuity

The full tracked npm suite passed before publication: demo/presets, hosted/file calibration, load integrity/totals, local menus, responsive refinements, sidebar/pilot seats, ramp checks and cargo slots/status/removal. Tests protect source helpers, calibration, pinned data and imagery; synthetic save tests use isolated files.

Three documents form the local next-chat foundation:
- `CABIN_UI_DEVELOPMENT_HANDOFF.md`: current state, rules, priorities, implementation map and verification.
- `CONTINUE_IN_NEW_CHAT_PROMPT.md`: detailed continuation brief.
- `DEVELOPMENT_HISTORY.md`: this consolidated history.

Creating these files changed no application behaviour or Active Dev source. They were saved locally after the separately completed application publication; no new publication was requested for the documents.

## 15. Additional GUI discussion notes — 23 October 2026

The user added several planning ideas, without authorizing implementation: grouped multi-select removal/reinstallation of shelf contents; compact cascading menus to minimize scrolling on small screens; a repeatable sidebar hierarchy from Role Config to equipment category to individual item, with per-item Install/Remove actions, Installed first and Not installed second, alphabetical within each group, and parent dependency handling that relocates retained contents (the cabinet basic kit or basket Guidelines/Weights) to user-selected eligible stowage or a bay rather than dropping them; two sponson stowage areas reachable from the 2D aircraft or top view buttons, with menus but no detail renders; a selectable layer for space-occupying items missing from imagery (examples include O2 Rack, Stretcher, Guidelines, weights and possible B25/Ron bag symbols); and a fuel quantity overlay showing per-tank quantities against bay boundaries plus manual/automatic origin. The sponson areas are not explicitly defined in Active Dev and must be user/source-defined before assigning model data. Port and Starboard Ramp Shelves indicators may need minor repositioning to make room for sponson labels. Full scope and cautions are recorded in `IMPROVEMENT_BACKLOG.md` sections 8–13. No application, Active Dev, commit or publication changes were made.

## 16. Development plan — 23 October 2026

The user agreed the discussion backlog was solid enough to turn into a development plan. `DEVELOPMENT_PLAN.md` stages the work from integration-boundary mapping and source-model/accounting reconciliation through a shared-model proof, compact direct workflows, user-defined sponson/equipment occupancy layers, fuel/MCDU/clearance outputs, and verification/release. It records operating-weight versus all-up result distinctions and the need to preserve the prototype's low-navigation interactions and Active Dev's developed editor and operational functions. Packaging and tail/network assumptions remain open. The plan is documentation only and authorizes no implementation or publication.

## 17. Source foundation and GUI-first sequence — 24 October 2026

The user confirmed the desired final product: Active Dev's capabilities (with refinement where needed) and the GUI prototype's interface. Read-only inspection confirmed Active Dev already separates normal fit from recorded-basic-weight inclusion, has tail-specific editor definitions and accepted accounting. Its existing editor must carry into the GUI. The -511 ECS Pack illustrates always fitted but added to basic weight; normal installation does not prove inclusion. The source app was not changed.

The user agreed future tail/session behaviour: select a tail and record/accept its information; resume its existing session when selected; explicit Start fresh warns. Editing accepted information warns, then on confirmation resets that tail's session to no Role Config and clears configuration/loading/certification while retaining tail/revised information and requiring acceptance again. Cancel preserves the session. No Role Config does not erase normal aircraft-level fit. These lifecycle refinements were discussed, not implemented in the prototype package.

The assistant initially pursued integration detail too far. The user explicitly redirected work to incremental GUI usability first, followed by wiring to the developed source and fixing integration foibles. Do not turn the next chat back into an engine/editor redesign. Detail-image loading was parked; future delivery should carry forward full first-open device download, update checks and a saved-version fallback.

## 18. Local usability package — 24 October 2026

After discussing the package, the user explicitly authorized all necessary edits within the prototype folder and routine checks, with NO PUSH, while away. The package was implemented locally on main without a commit or publication:

- Device-anchored right/left-hand controls, aircraft pinch/pan, browser zoom outside the viewer, Whole aircraft / Enlarge cabin / Reset view.
- Area cascades and focused equipment controls; full Installed/Not installed equipment access.
- Per-unit quantities, extra units, split allocations, selected-unit moves/removals, arbitrary multi-select and Select all, grouped installation and one destination per group.
- Default quantities are first choice, not assumed inventory maxima. CASEVAC can carry four Penetration Kits at defined non-cabinet locations. NVG defaults stay 4 in E and 1 in F.
- Signed load adjustments have + Add / − Subtract independently of the quantity −/number/+ controls, plus direct negative entry.
- Complete equipment-action Undo, initially placed in the persistent bottom bar. This location was later rejected by the user.
- Container removal defaults to removing its local contents as well; retaining contents uses explicit relocation. This supersedes the older relocation-first default.
- Basket/Stokes/raft destinations require installed support and respect conflicts/patients, with alternate-location hints and prerequisite installation recovery.
- Trial equipment symbols for non-imaged equipment and shelf/overhead contents, default off in 2D and on in detail. Narcotics uses a plain medical pouch, no N. SAR Cabinet needs no extra contents symbols.
- Automatic/manual fuel panel, preferred landing reserve and trial per-tank labels. Preferred 300 kg remains a choice; zero aboard gives zero planned landing fuel and a shortfall warning. Apply fuel was made sticky at the top after a WebKit phone scroll obstruction was found.

Key new modules: equipment-actions.js, equipment-ui.js, compact-workspace.js, touch-workspace.js, fuel-ui.js, equipment-markers.js, destination-hints.js, usability.css. Allocation rows feed the existing pinned source resolver/calculation functions through planning-model.js. Source catalogue/calculation bodies/imagery/calibration and Active Dev stayed unchanged. Session persistence and full source/editor integration were not added.

Full Chromium regression suite passed, including fuel parity across all 4153 whole-kg quantities and prior cargo/calibration/seat/patient/warning regressions. The package passed Chromium and WebKit at 1440×1000, 744×1133, 1133×744, 834×1194, 1194×834, 390×844 and 844×390. Chromium additionally exercised a two-finger image pinch without page scale/scroll change. These were browser-engine simulations on Windows, not physical iOS validation or user acceptance.

During work, the user shared a device-security alert blocking an earlier long inline editing command. The agent acknowledged it and did not ask the user to disable protection. Keep future edits reviewable and respect real platform/security restrictions. The user does not want repetitive routine permission requests once an implementation scope is authorized.

## 19. First user review — 24 October 2026

The user found the package insufficiently usable despite passing checks:
1. Role controls too far from the image.
2. Undo should persist in the relevant menu, not globally in the bottom bar.
3. Enlarge cabin visually skews/crops the image and cuts off C1/C2; a reference image was supplied for consideration.
4. Some symbols are on the wrong aircraft side; two Guidelines should be one symbol ×2; more symbol work is needed.
5. Explore fuel as a bottom-of-image bay/tank/quantity strip when selected.
6. Menus still are not compact enough.
7. Detail symbols are liked but require corrections; dragging symbols into place in a Role setting was suggested tentatively.
8. 2D symbols outside the cabin and boxed stowage-location labels are disliked; prefer live clickable fixture areas like SAR Cabinet, especially around the ramp.
9. Equipment symbols hide fuel indications in some cases.
10. Put all layer controls together as compact state-coloured buttons, not checkboxes.
11. Install/remove/quantity interactions are frustrating/confusing: repeat installation remains too easy, and editing afterward requires awkward reselection.

No fixes to these eleven findings were implemented after the review. The assistant proposed returning to shelf contents with the new item highlighted after Install; the user did not accept it and instead asked to game out the interaction. Fuel strip and symbol dragging are also open design ideas, not finalized features.

The current backlog carries all eleven findings and the next discussion scenarios. Passing tests are a baseline, not a reason to dismiss the user's review.

## 20. Sponsons, references and continuity close — 24 October 2026

The user identified Stbd (red arrow) and Port (green arrow) sponson areas, initially calling them permanent compartments. They then noted the RFM arms do not support the likely stowed items there and the areas may not exist as depicted. The latest decision is unverified, empty and normally hidden. No sponson model locations/arms/limits were added.

User attachments were copied unchanged from temporary attachment paths into local Git-ignored references:
- references/2026-10-24-framing-reference.png — latest framing consideration; not approved calibration/crop coordinates.
- references/2026-10-24-sponson-discussion.png — red Stbd / green Port discussion.

The user requested updating all continuity documents and returning in a new chat to discuss before coding. The five main references, local review guide and loading-workspace record were updated to distinguish implemented trial, rejected choices, open ideas and later integration. No application behaviour, Active Dev source, commit or publication changed in this documentation pass. Preserve the uncommitted local package for the next discussion.


## 21. Compact contents cascade — 25 October 2026

The user chose to discuss and test small interaction changes using in-conversation practice menus before further prototype edits. The final agreed pattern shows read-only items and row weights immediately, complete contents weight beside the space header, a fading final preview row and Show all contents, explicit Edit contents, Standard contents and broader catalogue access, local Remove all, compact selection-only actions and no Undo control. Cabinet structure belongs at parent level. The user then explicitly requested applying this to the prototype across spaces. A full local project-file checkpoint was saved first; implementation and current checks are recorded in COMPACT_CONTENTS_REVIEW_2026-10-25.md. This is a local review increment, not sign-off on the whole GUI. No Active Dev changes or publication.


## 22. Controls, symbols and live-review refinements — 25 October 2026

The user authorized the reviewed role/view/layer controls and symbols, then identified crowded layers, missing direct bulk/multi-select, fuel placement, cockpit framing and summary space usage. These were refined locally, with portrait controls floating over the image margin by explicit user choice. Hand control is available only in the image rail. See CONTROLS_REVIEW_2026-10-25.md for current behavior, remaining review and rollback checkpoint. Local only; no publication or Active Dev changes.


## 23. Compact ramp and labelled fuel strip — 25 October 2026

Following explicit user approval, the ramp overview now uses four compact choices with Ramp Shelves first. Ramp Cargo opens its local loads and Add action; existing cargo, bay-weight and litter editors/limits remain. Fuel has all cabin bay labels above the band, prominent Tank numbers and kg on each quantity, with stacked phone labels. Edge and Safari flow checks pass five sizes; ramp limit/placement checks and fuel source parity pass. See CONTROLS_REVIEW_2026-10-25.md. No publication or Active Dev edits.


## 24. Detail-to-2D shortcut and fuel retention — 25 October 2026

The user requested a small top-right 2D view button in each detail, and preservation of book fuel entered before selecting a Role. All five details now provide the direct return. Human Role reset preserves fuel amount/mode/tanks/reserve while retaining configuration/loading reset confirmation. Dialog wording and regression expectations were updated. Local prototype only.


## 25. Device-test publication authorized — 25 October 2026

The user explicitly requested commit and push so the hosted prototype can be assessed on iPhone/iPad. The cumulative 24–25 October application changes, verification updates and current review documents are included. Local reference-pack archives, screenshots, checkpoints and development dependencies are excluded. Active Dev remains unchanged. Earlier local-only instructions are historical; this approval applies to the prototype device-test release.


## 26. iPad drag handover and default reset — 25 October 2026

Device feedback identified interrupted panning. Native touch reproduction confirmed that child capture loss cancelled viewport dragging at the first movement. The handler now distinguishes capture ownership and active pointer, preserving continuous pan. Reset view clears enlarged-cabin framing and returns to centered 100% in plan/detail views. Focused native-touch/Safari-engine checks and framing/usability regressions pass. Published for device retesting under the user’s existing commit/push authorization.
