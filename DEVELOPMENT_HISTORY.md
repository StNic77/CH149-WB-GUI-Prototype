# CH-149-615 graphical prototype — Development History

Consolidated 23 October 2026 for the next project chat. This records major work and decisions, not a full transcript or operational-validation claim. The current specification is `CABIN_UI_DEVELOPMENT_HANDOFF.md`; the next-session brief is `CONTINUE_IN_NEW_CHAT_PROMPT.md`.

Latest update: the loading-workspace increment supersedes the older pending shelf/bay and aircraft-calculation status in this history. See `LOADING_WORKSPACE_CHANGES.md` for implemented requirements and verification: direct view access, removal of the left workflow navigation, shelf totals/capacity, explicit bay load warnings, source-engine planning AUW/CG, 4,152 kg fuel cap/allowances and NVG 4+1 allocation. The user selected entered planning basic data and explicit bay loads only for local checks, and requested commit/push. Confirm current Git/deployment state for publication status.

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
