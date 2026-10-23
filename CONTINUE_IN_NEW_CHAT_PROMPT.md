# Continue development of the CH-149-615 graphical prototype

Updated 23 October 2026. Copy the brief below into the next project chat, or ask it to read this file and the companion handoff/history.

Latest increment: first read `LOADING_WORKSPACE_CHANGES.md`. It supersedes the older pending shelf/bay/AUW statements below. The left workflow sidebar is removed, every view has direct access, source shelf/bay warnings and planning AUW/CG/fuel updates are connected, and NVGs use four in E plus one in F. The user authorized commit/push of this increment; check Git/deployment state rather than assuming publication finished.

---

We are continuing the existing CH-149-615 Cabin UI Prototype. Read these files first:
1. `CABIN_UI_DEVELOPMENT_HANDOFF.md` — current state, approved rules, module map and priorities.
2. `DEVELOPMENT_HISTORY.md` — work sequence, corrected decisions and Git checkpoints.
3. `IMAGE_FIRST_WORKSPACE.md`, `CARGO_DEVELOPMENT_REPORT.md`, relevant source modules and older guidance as needed. Their older introductory status may be superseded by the current handoff.

Prototype root: `C:/Users/sstni/Desktop/615 WB edit work/CH-149-615 Cabin UI Prototype`.
Developed reference app: `C:/Users/sstni/Desktop/615 WB edit work/CH-149-615-WB - Active Dev`.

## Starting checkpoint

The image-first implementation won. It is on main, pushed publicly and deployed successfully. Last application commit: `79e673c`, reusable cargo slots, visible load cautions and sidebar removal. Old main is only history, not a separate version to keep alive. Confirm current branch/status before editing; do not restore the earlier baseline automatically.

Repository: https://github.com/StNic77/CH149-WB-GUI-Prototype
Demo: https://stnic77.github.io/CH149-WB-GUI-Prototype/
Preview: http://127.0.0.1:61448/

These continuity documents were saved locally after publication. Do not assume they have been pushed. Do not push new work without a subsequent publication request.

## My first principle

The app must reward the user's assumptions. An FE should instinctively understand it. The aircraft picture is the workspace; actions/warnings belong at the point of use.

- Click installed equipment: open the location workspace focused on that item.
- Click a floor area: show contents and what can go there, with conflicts explained.
- Click a container: open its detail image and compartment contents locally.
- Installation/removal/moves/folding/occupancy must update image, menus and summary together.
- Remove changes this aircraft, never deletes catalogue availability. Reinstall must stay discoverable.
- Navigation preserves edits. Back to 2D must not reapply the Role Config.
- Cargo explicitly starts point selection; the menu clears, then a small marker can be adjusted before entering/completing details.
- Important actions remain prominent, and cautions must not require scrolling to discover.
- Support phone/iPad/desktop, touch/keyboard, mobile keyboard and orientation changes.

Role Configs set standard starting conditions, not an exclusive equipment catalogue. No Role Config must support deliberate aircraft assembly.

## Next work: agree meaningful details, then implement

Start with a brief source-grounded review of the next two increments. We prefer discussing consequential aircraft/interaction decisions rather than coding unrelated pieces. Continue independently where existing rules are clear; ask only for decisions that materially affect the result.

### A. Bring across loading cautions from Active Dev

Inspect current source shelf/stowage and cabin bay limits and compare them with the prototype snapshot. Relevant source: `mission.js` stowage limits and allocation/location resolution; `app.js` assigned shelf loads, overload helpers, stowage list, cargo/ramp hints and cabin bay editor; `extra-crew.js` where personal/linked gear affects accounting; current config/custodian overrides.

Implement one coherent caution pattern at the affected location. Count installed contents plus added loads as source rules require, including quantities/allocations, without omissions/double counting. Show actual total, limit and excess locally and in the summary.

Loading-limit exceedances should produce a clear WARNING by default, not prevent further editing. We will agree separately which limits need mandatory enforcement. This does not remove existing physical, occupant or fitting guards. Unknown capacity must not be presented as cleared/green.

Ramp is a working precedent: combined cargo+ramp weight+stowed Stokes, shelves excluded, exceeded weight/moment editable, cautions at the top and red/green symbols. Do not build a second whole-aircraft calculation system to extend those checks.

### B. Plan an equipment-location layer

Use simple toggleable labels/markers for installed equipment without imagery. Begin with Dive Bottle/O2 Rack and Talon stretcher around PTA, then expand as locations are confirmed. Perfect crops are not required.

Markers should open the same local item/area controls as pictured equipment. Distinguish fittings from contents. Use source weights/arms/stowage for accounting but confirm visual positions with me; an arm/render does not establish a surveyed footprint or every allowed dependency.

### C. Make dependency comparison the checkpoint before full integration

Prototype and Active Dev diverge in some defaults, stowage, fittings, carriers and exclusions. Compare each item's weights, arms, quantities, eligible locations, accounting category and dependencies. Record each deliberate difference and choose prototype rule, Active Dev rule or a correction to both.

Active Dev already has the developed math engine. We are building a graphical way to operate the aircraft model, not recreating the engine. However, final architecture is open: the Active Dev model/engine may need changes, the prototype may evolve or parts of both may combine. Do not force the old structure to win because it came first. Preserve verified calculations and agreed aircraft rules; decide from evidence.

For now, Active Dev remains read-only. Future architecture discussion does not authorize immediate changes there. Continue building graphical/equipment capacity and local cautions before connecting the full end-to-end aircraft workflow. Save/restore and full quantities/people/fuel/reporting remain planned, not complete.

## Preserve confirmed behaviour

- Cargo uses four reusable slots1–4, lowest free reused; unique record IDs remain separate. No ever-increasing user-facing counter. Bay weights are separate one-per-bay plus Ramp and use bay labels. Sidebar has immediate Remove for every load.
- Current colours: red+! for aggregate ramp caution, green for passing connected ramp checks, grey for cabin loads without a connected limit check. Top-of-menu warnings update during draft edits.
- Ramp is one area. Cargo arm is estimated from chosen image point over11393–14393mm; bay weight stays at12893. Source limits:350kg closed,450kg open,450kg·m hinge proxy. Stowed Stokes49kg at13132 counts; shelves/contents do not. Weight/moment overloads stay editable.
- Preserve approved shared embedded calibration in both JS/JSON. Independent ramp edge must not move cabin joints. Exact coordinates are in the handoff. Never depend on old local-storage marks.
- Bay6 fixed10875mm is a user decision versus snapshot10884.
- Baskets fold installed seats: portP18, stbdP9/P10; occupants block placement. PTA excludes P15–P18 and port basket. Cabinet excludes P4–P6. C5 excludes P13/P14; C6 excludes P7/P8.
- C1/C2/P2/P3 always installed; C1/C2 crew-only. C3 retains accepted cockpit-panel baseline, no fabricated seat imagery.
- PTA is accessible from B5/B5.5/B6 Port as one installed record. Stokes is ramp Stbd or deployed B3/B4 Centre; patient in cabin only; no seat/PTA exclusion. Occupied removal/stow remains blocked.
- Sea Tray spans B3–B5 Centre, must not mask cells/guides and stays below life raft. Transport/CASEVAC defaults omit it; raft/fitting starts B3 Stbd Fwd in Transport, B4 Stbd Aft in CASEVAC.
- CASEVAC has3 forward tiers and2 aft tiers; no aft top. Full rack footprints/conflicts still need review.
- Correct fuel mapping: B1/T4 transfer, B2/T3 main, B3/T2 main/APU, B4/T5 transfer, B6/T1 main. Visualization awaits suitable imagery. Keep fuel in scope; do not reuse old reversed B4/B6 notes.
- Custom loads and aircraft edits are session-only. Full-aircraft acceptance/math/fuel/envelope/reporting, complete equipment mapping/allocations/quantities/people weights, persistence/custodian/offline remain incomplete.
- Conditional Stokes imagery in Ramp Shelves detail view is explicitly parked for later.

## Working practice

Keep the image-first interface, reviewed imagery/regions and approved station calibration. Use pinned source snapshots plus explicit overrides until deliberate reconciliation; do not silently refresh away decisions or introduce live custodian reachback for this demo.

I authorize normal implementation and checks without requesting individual permission for every step. Respect genuine platform approval requirements and explain actual blockers; avoid repetitive confirmation loops. Give concise, operator-focused progress updates.

Use meaningful checks for new limits/accounting and menu interactions. Full npm suite passed before publication across desktop/tablet/phone, including calibration, load identity/totals, local menus, responsive refinements, ramp checks and cargo slot reuse/removal. See the handoff for Windows runtime/test commands. Verify visible caution/action placement, not only numerical results. Synthetic review/save tests must use temporary files, never real saved polygons/calibration.

The prototype's green symbols and working controls do not establish operational clearance. End-to-end result equivalence is a later comparison against the agreed model and developed engine.

Start by confirming current files and proposing a concise shelf/bay caution increment, identifying any source/prototype discrepancy that needs my decision. Continue with agreed work instead of asking whether to begin.
