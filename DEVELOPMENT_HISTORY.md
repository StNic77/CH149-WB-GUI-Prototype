## 28 October 2026 — configuration-dependent detail reference images

Applied the user-agreed applicability matrix: SAR-3 retains every detail; SAR-10 retains Cabinet, Forward Shelves and Ramp Shelves; Transport/CASEVAC retain Forward and Ramp Shelves. Aft cabin imagery is unavailable outside SAR-3 among these standard roles. Unavailable choices are greyed out with helpers, while direct location/equipment access uses an image-unavailable explanation and retains all loading/W&B controls. No source or generated imagery is changed or added. Ramp imagery remains usable; future corrected imagery must include permanently installed P2/P3 in every role. See DETAIL_IMAGE_APPLICABILITY_2026-10-28.md. This supersedes proposals to use the experimental generated SAR-10 view in the application. The user will commit/push the combined changes.

## 27 October 2026 — remove C3 position-review tools

Removed Locate C3, Finish locating C3, their status text, click-to-reposition handler and saved visual-mark lookup. C3 retains its confirmed calibrated centreline position at seat station 4559 mm and existing occupant arm. Normal seat installation, assignment and occupant controls remain. Removed obsolete call sites and position-editor styling. This joins the Sea Tray increment; the user will commit and push the combined changes. Nothing has been staged, committed or pushed by the assistant.

## 27 October 2026 — Sea Tray cell selection and removed-state label

Implemented the two agreed Sea Tray changes. The confirmed interaction footprint is B3 Centre/Stbd, B4 Centre/Stbd and B5 Centre. With Live equipment enabled, an ordinary click/tap or keyboard activation of an exposed occupied cell opens the existing installed Sea Tray controls. Area options retains the originating cell and existing cargo/bay/raft choices; explicit cargo placement bypasses tray selection. The tray artwork never intercepts cells, including Bay review. Existing seats and equipment above it retain direct selection priority.

In reference view, Sea tray removed is positioned on the depicted tray at the user-marked upper area using the role's existing image registration. It follows image pan/zoom and opens the existing fitting controls. Installation, Live equipment and CG visibility retain their existing label behavior. No source masses, arms, calculations, installed location, artwork footprint or image assets changed.

Verification: sea-tray-selection-check passes SAR-3/SAR-10 at desktop, tablet portrait/landscape and phone sizes using mouse/touch plus keyboard. It checks all five cells with Bay boundaries off/on, original-cell return, cargo placement, W&B/state preservation, label registration through zoom, removal/reinstallation and overlying Stokes selection. Existing live-fidelity-check and image-workspace-check pass. Asset URL integrity and whitespace checks pass. Browser emulation is not physical iPad acceptance.

Generated Port Aft trials and their app integration are excluded at the user's request; originals remain active. Trials are preserved outside the repository in ../Port Aft Image Trials 2026-10-27. This repository increment contains Sea Tray behavior, related location wording, checks and continuity notes; the subsequent user-requested C3 position-review cleanup is also included. No publication is included.

> Package status, 27 October 2026: application 39b9b7f is committed and pushed for device checks. This documentation refresh is local and newer than the release. Physical iPad/Safari acceptance and hosted deployment confirmation remain open. Read CABIN_UI_DEVELOPMENT_HANDOFF.md and OPEN_ITEMS_2026-10-27.md for current consolidated status; older dated release statements below are historical.

# CH-149-615 graphical prototype — Development History

## 27 October 2026 — numeric entry, stable placement and ramp terminology

After 7dd6568 was pushed, the user liked the landscape Fuel layout (only Fuel uses it), requested whole-value selection for numeric entry and reported cargo menus jumping on desktop. Numeric focus/tap/Tab now selects the value; later caret editing remains. Focus no longer recentres the image menu; keyboard constraints adjust position only as needed. Regression checks reproduce ramp floor-point selection and existing/new cargo editing at desktop and tablet dimensions. The user confirmed the existing ramp limits and approved Ramp hinge moment instead of the inherited proxy wording. No constants, formula, units, source raster or Active Dev edits. Commit/push and a reference refresh were authorized.

## 27 October 2026 — selected outstanding fixes, local review

The user selected outstanding-list items 1–9, 11–13 and 16. Implemented the automatic fuel burn trace, selected/both CG presentation, full input visibility adjustments, ramp touch targeting and review access, P7 artwork alignment, alternative-seat choice/exclusion presentation, empty SWS access, corrected Port Aft stretcher/rack associations and Bay Cells drawing priority. Source solver, weights, arms and standard configurations are retained. Baseline `6dc42c3` was previously pushed; the user has now authorized this revision for commit/push to support device checks. Physical iPad Safari acceptance remains open. See the current backlog for the remaining deferred scope; older release statuses below describe previous work.

Updated 24 October 2026 after the local usability package and first user review. This records major work and decisions, not a full transcript or operational-validation claim. The current specification is `CABIN_UI_DEVELOPMENT_HANDOFF.md`; the next-session brief is `CONTINUE_IN_NEW_CHAT_PROMPT.md`.

Subsequent discussion settled engine/model authority: Active Dev's configuration, editor definitions, accounting and calculations will drive the GUI. Packaging remains undecided. The reproduced SAR-3 discrepancy arises from different accepted inclusion baselines; the source model is the reconciliation target. See `IMPROVEMENT_BACKLOG.md` for this decision and the latest usability/performance/quantity notes. These discussion notes authorize no implementation or publication; earlier statements of an entirely open model/engine decision are historical.

Release baseline: `0458550`. The later 26 October review revision is authorized for commit/push; see the release authorization and validation notes at the end. Earlier checkpoint and local-only statements below describe their historical state.

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


## 27. Separate page and image gestures — 25 October 2026

The user approved one finger for page scrolling and two fingers for moving/zooming the image. Touch pointer pan is disabled, native vertical page scrolling is allowed, and two-touch translation/scale are applied together around their moving midpoint. Mouse pan and centered reset are retained. A brief touch hint explains the two-finger gesture. Native touch, Safari handler/reset and seven-size usability checks pass. This supersedes one-finger image panning in the preceding patch.


## 28. UI baseline accepted; engine-integration handoff — 25 October 2026

After published gesture changes, the user said “good to go” and chose to start the math engine later: make this app do what W&B Active Dev can do. Preserve the UI baseline and reuse source model/editor/accounting/configuration/calculations/fuel/MCDU/clearance rather than rebuilding an engine. First proposed slice: one identical accepted state and one end-to-end graphical edit with component comparisons. The recorded 579.57 kg inclusion difference remains an early integration concern. This is UI-stage acceptance, not operational certification.

The user requested all next-session documents updated with completed/future work. Rewrote handoff, continuation prompt, plan, backlog, review/run guide, loading cross-reference and both dated UI summaries to remove obsolete October 24 “uncommitted/all issues open/game out menus first” instructions. Added ACTIVE_DEV_INTEGRATION_NEXT_STEPS.md. Created the October 25 reference folder/ZIP with current documents and unchanged discussion images; October 24 pack remains historical. Application checkpoint is still main 58746ec, pushed and deployed. This documentation task did not change app behavior, edit Active Dev or begin integration. Documentation changes are newer local work, not another app release.


## 29. Rounded component ribbon published; session closed — 26 October 2026

Before broader engine integration, the user requested the bottom ribbon in order: Basic Weight/CG, Operating Weight/CG, Fuel, Cabin (Bay weight), Cargo, AUW Weight/CG. They clarified nearest kg/mm rounding and no change-since-baseline display. Implemented using existing source Operating/AUW results and existing adapted bay/cargo entries, preserving exact calculation precision. Tablet/desktop show six groups; phone wraps in reading order; content clearance follows ribbon height. Dedicated five-size Edge/Safari checks and related gesture/loading/iPad checks passed, as did source planning parity.

Committed/pushed as a2c3e18; Pages deployment succeeded and current index was verified. User confirmed the commit/push and chose to leave it here, resuming in a new thread with updated references. Refreshed the October 26 handoff pack to include the ribbon release and existing integration brief; October 24/25 packs remain historical. No Active Dev edits or broader integration work have started. Current documentation refresh is local, newer than the published application commit.

## 30. First integration slice, CASEVAC and live CG visualization — 26 October 2026

Committed and pushed as 0458550. Added Recorded Basic Weight default using source inclusion definitions; independently compared the first SAR-3 graphical quantity path with Active Dev, explaining the 579.57 kg inclusion distinction. Added CASEVAC patient multi-select with atomic unavailable/occupied guards. Added AUW/CG status colours and Fwd/Mid/Aft bands, reserve-based landing CG, a calibrated cabin-centreline allowable band, Focus CG, enlarged takeoff/landing strips with margins and an expandable full weight-versus-CG envelope. Edge/Safari checks included the 301 kg ramp case and changing AUW-dependent limits. Active Dev is unchanged; full live editor/tail/output integration remains unfinished. Deployment of this commit was not independently verified in this session.

The user confirmed that P2/P3 remain additive under the RFM basis despite permanent installation: 10098 + 18.70 = 10116.70 kg (10117 displayed). No weight or inclusion change was made.

## 31. New iPad/startup feedback recorded; implementation deferred — 26 October 2026

The user reported iPad on-screen keyboard/menu resizing that obscures text entry. They proposed a fresh-session lead page for tail, initial Basic Weight/CG and Role, with brief guidance before entering the image workspace; existing image controls should remain. A valid persistent session should open directly into the image workspace. They highlighted live CG visualization as a major benefit for understanding load/fuel consequences.

The user explicitly requested adding these items to the ongoing list and reviewing what remains, without making application changes now. Updated IMPROVEMENT_BACKLOG.md and DEVELOPMENT_PLAN.md to distinguish completed work, pending requests, unresolved behavior decisions and parked visual work. These new planning updates are local and are not part of application commit 0458550.

## 26 October 2026 — local entry and image refinements

Authorized locally after the earlier hold: setup with tail buttons (149920 displayed as 149SIM), Recorded Basic Weight default, Basic Weight/CG/initial fuel together, Role and Accept aircraft. No reserve or distribution selector on entry. The user’s exact initial-fuel note is retained. Existing image-page editing remains. A compatible versioned local snapshot resumes to the image; Start fresh permits keeping the current session until replacement acceptance.

Corrected desktop setup inheriting the cabin grid. The Starboard aft equipment parent action now selects its view. Aft navigation regions have moved to the user-circled edge areas and use hover labels without permanent text; equipment retains click priority. Fuel planning / Fuel at landing (reserve) wording and live CG helper are aligned. Zero-valued quantity inputs display blank and blanks represent zero where permitted. Occupants visibility hides all crew/passenger/patient markers without removing their masses or changing W&B.

Keyboard handling scrolls focused menu/dialog inputs within the visual viewport; simulated shrink is checked locally. Physical iPad Safari remains to be verified. A Safari-engine check could not launch because its browser runtime is unavailable; no Safari pass is claimed for this revision.

Clickable-zone highlight layer remains discussion-only. User chose hidden by default with remembered choice. Proposed highlights affect visibility only; navigation stays clickable and equipment, occupant and CG layers remain independent. Nothing from this revision has been committed or pushed.

Further local review refinements: starboard basket menu opens Starboard Aft View; seat indicators are centred on seats, with drawing order images → Seats → Occupants. C4/C5/C6 are checked in both SAR roles. Occupant markers have a separate drawing plane, remain aligned under zoom, and can be hidden without altering state. Default crew / SAR Tech classification is shared with the W&B adapter; the generic occupied dot is removed. Crew, Passenger and Patient symbols are added to the key and remain visible in the key while the Occupants image layer is hidden.

User clarified C3’s physical installation from the port avionics cabinet into the space aft of the centre console; the drawing is approximate but the seat centre is authoritative. C3 alone is repositioned from its confirmed seat centre at 4559 mm using the common station calibration, just forward of Bay 1 on the centreline. C1/C2 retain 3673 mm; their images and all other seat-image positions are unchanged. Catalogue occupant arms are unchanged.

## 26 October 2026 — reference-image fidelity review

Replaced the full cabinet highlight with a compact label in reference mode, and the same label on the live cabinet. Added live-visual-layout.js with original-render artwork crops and placement, preserving native proportions for pictured seats and SAR fixtures. Seat/occupant overlays follow their pictured seat centres; C3 retains its explicitly confirmed station-based position. Source masses/arms are unchanged. This improves source fidelity but does not establish surveyed geometry or exact artwork for unpictured/custom fits or hidden floor detail.

The user clarified Dive Bottle / O2 Rack is currently only a fitting with no contents, and may later become stowage with dependencies. Rendered an empty source frame with pictured bottle area excluded, controlled only by the existing rack Role Fit key. No bottle identity, quantity, mass, storage control or dependency was added.

Added the Sensor Workstation as a separate source-artwork component beside C4. Its installed/removed appearance follows RF_SENSOR_SYSTEMS_SENSOR_WORKSTATION; SAR defaults show it, Transport/CASEVAC defaults omit it, and custom installation is supported. Local tests confirm removal/reinstallation changes weight by the existing 46.69 kg while preserving seats, occupants and mission items.

Local Edge checks passed the new fidelity/rack/workstation checks across desktop/tablet/phone, plus occupant layering, standard roles/CASEVAC, CG and image-local controls. Live equipment naming is held unchanged for later discussion. No commit or push.

## 26 October 2026 — source-image item composition correction

User supplied the four original annotated references and clarified that the full pictured items should become selectable live items, including rack and SWS. The prototype’s copies of these originals match Active Dev byte-for-byte; source files remain unchanged. The previous empty-rack artwork clipping is superseded: the complete rack depiction is retained as fitting artwork only, without creating contents or dependencies.

Live equipment now retains the role reference image as the detailed backdrop. Its individually rendered item regions are masked out and restored by installed item components; removals/moves reveal the cleared underlay only in those regions. This preserves visible original floor panels and surrounding detail rather than substituting the whole cabin background. Hidden floor beneath removed items and unsupported custom arrangements remain a visual-review limitation. PTA crop and silhouette now include the full grey aft moulding while excluding the independent rack below. Liferaft placements and native proportions are taken directly from Transport and CASEVAC image coordinates; location identities and W&B arms are unchanged.

Cabinet label is shown in reference mode only; live cabinet artwork remains selectable without a label. Aft access zones are transparent at rest and on hover/focus, with outline-only feedback, so they do not obscure the rack. No new highlight visibility layer or layer rename was introduced. All work remains local and unpushed.

## 26 October 2026 — Transport / CASEVAC rack default correction

User confirmed Dive Bottle / O2 Rack is not installed in these two roles. Updated the prototype-only default-fit rules to remove the fitting from Transport and CASEVAC, matching both the picture and W&B; SAR-3/SAR-10 retain it. The pinned source catalogue remains unchanged. Older valid saved Transport/CASEVAC sessions receive the correction once and keep their other loads; the saved fit revision then preserves any later deliberate rack installation. Local desktop/tablet/phone tests cover absence in both defaults, the 7 kg correction, preservation of other loads, and persistence of deliberate installations. No push.

## 26 October 2026 — return-to-start wording

Renamed Start fresh to Return to Start page at the user’s request. Navigation preserves current aircraft/session data. Keep current session returns unchanged; entering new details and selecting Accept aircraft replaces the session and starts over. The accept button now keeps the same label on first entry and return, with a short explanation of the choice. No immediate Clear all Data action was introduced. Local only.

## 26 October 2026 — Stokes clarity and reference labels

User requested a cleaner deployed Stokes rendering using the partially obscured ramp litter as reference. Replaced the enlarged low-resolution cabin crop/alpha filter with crisp open orange framework drawn as scalable SVG paths. Gaps remain transparent to the actual floor/tray. Existing deployment dimensions/position, patient actions, item identity and W&B are unchanged.

User requested that a removed sea tray be identified or removed from the static reference view. Added a Sea tray removed status button in the image corner for SAR reference images depicting the tray when the actual fit omits it. It opens fitting controls and disappears after installation or when Live equipment is on. Positioned outside the image’s transformed item plane to avoid overlapping deployed litter controls or scaling with zoom.

Added consistent compact reference labels: Fwd shelves for the retained fixed shelving, plus installed-only SWS, O₂ rack and Basket. Each opens the associated view/item menu. Reference basket symbol is suppressed in favour of the label. These labels hide in live mode and during CG display. Local desktop/tablet/phone tests cover the label visibility/actions, removal status, unchanged viewing calculations and clean litter rendering. No commit or push.

## 26 October 2026 — release authorization

User requested commit and push of the accumulated local revision after iterative review. This checkpoint includes entry/resume and Return to Start page, keyboard visibility handling, blank zero quantities, aft navigation and labels, separate seat/occupant drawing and occupant key, source-image live composition, corrected role rack defaults, liferaft and workstation rendering, deployed Stokes clarity, and reference-view installed/removed labels. Deferred highlight-layer design and layer renaming remain unimplemented.

Reference ZIPs/directories and generated review images are excluded from the commit. Active Dev and original reference images are unchanged. Local automated checks cover the implemented paths; physical iPad keyboard behavior remains a device-acceptance item. Push success is verified separately in the chat and does not by itself verify hosted deployment.

Pre-commit validation completed: the targeted new artwork, reference-label, occupant-layer, zero-quantity, entry/resume and CG checks passed. Remaining registered usability, fuel/planning engine parity, hosted calibration, cargo, refinement, aircraft summary, ramp/slot, loading workspace and iPad-size stale-asset checks also passed in the local Chromium/Edge engine. Asset URL integrity and whitespace checks passed. Native iPad keyboard and Safari-device acceptance remain outstanding.

## 28 October 2026 — full next-chat package refresh

Updated current handoff, continuation, open list, plan/backlog, run guide and verification/device references. Recommended next discussion: extend the approved Fuel landscape input-menu approach across other iPad text/numeric menus. Recorded all parked decisions, accepted standard occupant weights, external image-trial exclusion and future ramp P2/P3 imagery. Package source includes current uncommitted working tree; no staging/commit/push or new implementation in this documentation pass. Earlier dated packs remain unchanged.

## 28 October 2026 — compact landscape load menus

Implemented the user-selected first group: Add/Edit Cargo, Add/Edit Bay Weight including Ramp, and both additional shelf-weight entry routes. Landscape touch tablets at widths of at least 700 px use 140 px numeric inputs (roughly seven characters with native control padding), with the primary action alongside; new floor loads also retain Cancel on that row. Descriptions and optional arm details stay separate. Existing edit removal/reposition actions retain their behavior. Portrait and desktop retain their layouts. No calculation, mass, arm or validation changes.

The shared menu uses up to 620 px for these forms and retains anchored placement while typing. Targeted browser checks cover Mini/larger tablet landscape, portrait and desktop, saved bay/shelf weights and alignment. Physical Safari keyboard acceptance remains pending. This follows the current reference pack; older next-work descriptions record the previous plan.

## 28 October 2026 — Sea Tray remains a cell option

User correction supersedes the earlier direct-tray cell-selection behavior: tapping/clicking or keyboard-activating any of the five covered cells opens its normal cell-options menu. Sea Tray is one option in that menu. Explicit selection opens its controls; Area options returns to the original cell. Non-intercepting artwork, removed label, overlying equipment selection, cargo placement and aircraft weights/arms are retained. Regression coverage now requires cell-first selection for both SAR roles, with boundaries on/off and desktop/tablet/phone input.
