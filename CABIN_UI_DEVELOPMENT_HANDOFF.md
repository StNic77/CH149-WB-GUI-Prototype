# CH-149-615 Cabin UI Prototype — Current Development Handoff

Updated 23 October 2026. Read this first when resuming in a new project chat. Companion files: `CONTINUE_IN_NEW_CHAT_PROMPT.md` and `DEVELOPMENT_HISTORY.md`.

## New loading-workspace increment — supersedes the pending status below

See `LOADING_WORKSPACE_CHANGES.md` for the requirement-to-code/test cross-reference. All views are directly accessible, the left workflow navigation is removed, shelves and explicit bay loads have source capacity warnings, and planning basic weight/CG entry drives a persistent AUW/CG/fuel/change strip through pinned Active Dev functions. NVGs resolve as four in Zone E and one in Zone F. Fuel allowances to 15,600/16,000 kg include all non-fuel loads and cap at 4,152 kg. The user chose explicit bay loads only for local bay checks; fixed equipment, seats and people are excluded from those local checks. Full fuel visualization/burn UI, individual quantity editing, operational acceptance and persistence remain deferred. Earlier claims that shelf checks or live aircraft calculations are wholly unconnected are superseded by this increment; source parity checks do not establish operational validation.

## Current checkpoint

The image-first implementation is the accepted main version. The user has extensively exercised its interactions and considers it a strong foundation. It demonstrates configuring/loading an aircraft through the picture; it is not a complete aircraft model or an operational W&B release.

- Prototype root: `C:/Users/sstni/Desktop/615 WB edit work/CH-149-615 Cabin UI Prototype`
- Developed reference application: `C:/Users/sstni/Desktop/615 WB edit work/CH-149-615-WB - Active Dev`
- Repository: https://github.com/StNic77/CH149-WB-GUI-Prototype
- Demo: https://stnic77.github.io/CH149-WB-GUI-Prototype/
- Local preview: http://127.0.0.1:61448/
- Local branch and published application: main at `79e673c` — Reuse cargo slots and show load cautions with sidebar removal.
- Main was fast-forwarded and pushed at the user's explicit request. Pages deployment succeeded; the hosted cargo module was checked for the slot implementation.
- The former image-first branch points to the same commit; it is not a separately maintained version. Old main at30805a4 is history, not the baseline to restore.
- These three continuity documents are local artifacts saved after publication. Do not assume they were pushed. Recheck Git status before resuming work.

## First principle: reward the operator's assumptions

The intended operator is an FE. The picture is the primary workspace.

1. Select an installed item: its relevant controls open there, with that item in focus.
2. Select a space: see contents, available installation choices and explained conflicts.
3. Select a container: open its detail image, then its compartment controls locally.
4. Install/remove/move/fold/assign an occupant: picture, menus and summary agree immediately.
5. Remove means remove from the aircraft, not delete from the catalogue. Reinstall remains discoverable.
6. Navigation preserves current aircraft edits. Back to 2D must not reapply the Role Config.
7. Ordinary inspection creates no cargo dot/load. Choosing Cargo explicitly starts placement; the menu gets out of the way.
8. Important actions and cautions are visible at the point of use, without hunting or scrolling through unrelated controls.
9. Support phone, iPad portrait/landscape and desktop, touch/keyboard and mobile keyboard changes.
10. Agree consequential aircraft/interaction decisions with the user rather than coding disconnected increments.

Role Configs establish standard starting conditions, not an exclusive equipment catalogue. No Role Config is an important build-from-empty workflow.

## Latest agreed priorities — not yet implemented

### 1. Extend Active Dev's loading cautions

Start with shelves/stowage and cabin bay limits. Count installed contents and additional loads together, respecting source quantities/allocations and avoiding double counting. Display affected location, actual total, limit and excess in its local controls and summary. Use ramp cautions as the presentation model.

Loading-limit exceedances should normally produce a clear WARNING, not block further editing. The user will agree individually which limits must be mandatory. This does not remove current occupant, seat, fitting or item-presence guards. Unknown capacity must not be presented as within limits.

Read-only source inspection identified:
- `app.js`: `shelfLoadState`, `assignedShelfLoads`, `overloadedShelves`, `getLoadStowages`, ramp cargo hints, cabin bay editor.
- `mission.js`: `stowageLimits`, allocation/location resolution and mission rows.
- `extra-crew.js`: gear/stowage accounting that can affect capacity.
- Current configuration/custodian definitions and overrides: do not replace their meaning with historical hardcoded capacities.

Active Dev already aggregates assigned shelf equipment and additional zone weights. Bring across that accounting meaning and provenance. The prototype currently has no connected cabin bay or shelf overload checks.

### 2. Plan an equipment-location layer

Use simple selectable labels/markers for installed items without dedicated imagery. First examples: Dive Bottle / O2 Rack and Talon stretcher around the PTA cot area. Open the same relevant local controls as pictured items. Fittings and contents must remain distinct and counted once.

Source references: `RF_SAR_EQUIPMENT_DIVE_O2_BOTTLE_RACK` has arm10849; `ME_SAR_MISSION_EQUIP_TALON_STRETCHER` is assigned to `PTA_COT_AREA`, arm10375. These do not establish exact marker coordinates, full footprints or every dependency. Confirm visual placement and related items with the user; no fancy imagery is required.

### 3. Compare models before full integration

There is known divergence between prototype and Active Dev in locations, defaults, dependencies and exclusions. Compare item by item: weights, arms, quantities, locations, required fittings, carriers, accounting category, allowed moves and exclusions. For every discrepancy, explicitly choose the prototype rule, Active Dev's rule or a correction to both.

Active Dev already contains the developed math engine. Do not build another whole-aircraft engine. However, the final architecture remains OPEN: its model/engine may need to adapt to the stronger graphical workflow. Do not assume the old structure must win because it came first. Preserve verified calculations and agreed aircraft rules; choose the structure from evidence.

For now, inspect Active Dev read-only. Future architectural possibilities are not authorization to modify it immediately. Build graphical/equipment capacity and useful local cautions before connecting the complete aircraft workflow. Save/restore remains needed, although the immediate priorities above take precedence.

## Working interface

- One floating nonmodal image-local workspace, location/item breadcrumbs, internal scrolling and prominent primary actions.
- Toolbar layers: Seats, Bay Boundaries, Bay Cells, Alignment guides (prototype), Live equipment and Cargo, with explanations. Redundant Browse controls and the schematic strip are retired from the visible UI.
- Installed seats and supported equipment are directly selectable without enabling seat-position markers.
- SAR cabinet, B1 Port forward shelves, four ramp shelves and both overheads have user-reviewed detail regions.
- Current aft detail names: Port Aft View and Starboard Aft View. Empty Cabin Reference tab/image was removed.
- Basket, PTA, Stokes, Sea Tray, internal raft/fittings, CASEVAC racks and seats have supported local controls/live layers. Other equipment coverage remains incomplete.
- Cabinet/shelf contents lead with role-normal items, including removed equipment. Other equipment is grouped, collapsed and searchable. Catalogue definitions survive removal.
- Back to 2D changes the view only. Selecting a Role Config deliberately reapplies standard conditions; it is not a back button.
- Six collapsible sidebar areas: Acceptance Info; Role Selected/grouped Role Fit/edits; grouped Mission Equipment/edits; Crew/Pax/Patients/Seating; Fuel; Load Planning.
- Supported summary rows open local editors. Acceptance/fuel and unsupported equipment editors are not complete working features.
- Each cargo/bay sidebar entry has an immediate Remove button, updating totals, symbols and caution state.

## Confirmed seat/equipment rules

- C1/C2/P2/P3 are permanently installed and interactive. C1/C2 accept Crew only, never Passenger. P2/P3 retain background imagery.
- Pax backs are against the outer walls, facing inward; depicted crew seats face forward. C3 uses the accepted cockpit jump-panel depiction and transparent target, not an invented blue seat. Accepted baseline point:574,403.
- C5 excludes P13/P14; C6 excludes P7/P8. Alternative pax imagery is hidden when those crew seats are installed. No additional pax exclusions were confirmed for C3/C4.
- SAR cabinet spans B1/B2 Stbd and excludes P4/P5/P6.
- PTA cot spans B5 Port, B5.5 Port and part of B6 Port. All menus access one cot. It excludes P15–P18 and port basket. Installed state and patient state are separate; occupied removal is blocked.
- Port basket permits installed/folded/unoccupied P18; stbd permits P9/P10. Occupants block placement. No automatic occupant/seat removal. Moving/removing a basket restores occupancy eligibility.
- Basket moves use known port/stbd locations, avoid duplicates and update linked gear arms. Missing carriers flag gear unresolved instead of deleting it.
- Stokes normally stows starboard ramp, symbol aft of the stbd shelves. Cabin deployment is B3/B4 Centre and can hold a patient; it does not exclude seats/PTA. Occupied removal/stowing is blocked.
- Ramp Stokes is49kg at13132mm; cabin arm7863mm. Symbol position and accounting arm are separate.
- Sea Tray spans B3/B4/B5 Centre, stays below raft/equipment and must not mask floor-cell hover/selection or bay guides.
- Transport/CASEVAC normally omit Sea Tray. Internal raft plus fitting defaults: B3 Stbd Fwd in Transport, B4 Stbd Aft in CASEVAC. Overrides are separate from pinned source data.
- Internal raft requires its destination fitting. Explicit combined install actions exist. Moves/removal retain fittings; an occupied fitting cannot be removed underneath the raft.
- CASEVAC: four racks, three patient tiers on each forward rack and middle/bottom only aft:10 positions. Do not add aft top tiers. Possible overhead interference was the user's explanation, not independently established geometry.
- Rack menu references currently use configured arms: Fwd Stbd B2, Fwd Port B4, aft racks B5.5 on respective sides. Full rack spans, clearances and exclusions remain unconfirmed.

## Floor, cargo and ramp

Cabin nomenclature is B1 Port/Centre/Stbd through B6, including B5.5:21 selectable cells. The ramp is ONE area, not lateral thirds. Cell labels remain hidden on the image; boundary review annotations are separate.

`state.floorLoads` is the authoritative custom-load collection. Internal record identity is separate from reusable user-facing slots:
- Four cargo slots1–4. New cargo takes the lowest free slot; removal frees it without renumbering other loads.
- One independent weight per B1/B2/B3/B4/B5/B5.5/B6 plus Ramp:8 bay/ramp entries. They do not consume cargo slots and are labelled by bay, not sequential cargo number.
- Four individual cargo plus eight bay/ramp records can coexist. Duplicate bay creation is rejected; another cell in the same bay accesses the existing record.
- Cargo point placement hides the menu and opens focused details after picking. Small draft markers support mouse/touch drag and arrow-key adjustment; optional description/known-arm override remain.
- Cabin arm estimates use calibrated longitudinal position rounded to10mm. Ramp estimates map the selected image fraction between approved hinge/aft marks to11393–14393mm, rounded to1mm. These are estimates, not surveyed precision. Lateral placement changes marker position, not longitudinal arm math.
- Bay weights keep fixed arms. Ramp bay weight is12893mm. Bay6 retains the user's10875 override versus pinned source10884.
- Custom loads survive views/stages/role changes within a session, but reset on refresh. Save/restore is not implemented.
- Visibility changes do not change loads. Weight/moment/CG displayed for cargo and bays are CUSTOM-LOAD SUBTOTALS ONLY: aircraft, equipment, people and fuel are excluded.

### Connected ramp checks

Source constants: hinge11393mm, end14393mm, closed350kg, open450kg, hinge-moment proxy450kg·m.

Proxy = sum(weight kg × (arm mm −11393) /1000).

The prototype aggregates custom ramp cargo + ramp bay weight + ramp-stowed Stokes, extending Active Dev's individual cargo hints. Custom cargo with an arm inside the ramp range counts even if its displayed cell is elsewhere. Ramp shelves/structures/contents are EXCLUDED and have independent limits. Cabin-deployed Stokes/patient do not count on the ramp.

Out-of-range Ramp record arms are rejected atomically. Weight/moment exceedances remain editable with cautions. Both closed/open checks are shown; no simulated ramp actuation/state control exists. At12893mm,300kg alone reaches450kg·m.

Green ramp symbols pass current checks; red plus ! means a combined ramp caution. All affected entries update together. Grey cabin symbols have no connected cabin limit check yet. Explicit issue text is at the top of selected-load menus and in the sidebar; draft cautions update before saving. Green is not whole-aircraft clearance.

## Preserve approved embedded alignment

Do not re-mark or restore old browser-local calibration. One approved alignment serves all roles and deployment types.

- Common image plane2560×1216.
- Forward stationX4875: image coordinate724.0559950094173.
- Hinge stationX11393: image coordinate1853.6560121380364.
- Independent ramp endX14393: image coordinate2351.266647702848.
- Revision2, held in `station-calibration.js` and `.json`.

Embedded JS supports fresh browsers, Pages, direct files and unavailable storage. Editing ramp edge must not move cabin joints or alter station/configured-arm values. Physical station values and image pixels are distinct.

Boundaries:4875,5875,6875,7875,8875,9875,10375,11393,14393. Bay6 bounds10375–11393; fixed arm10875.

## Fuel: retained scope, design not selected

Corrected user-confirmed mapping:

| Bay | Tank | Function |
|---|---|---|
|1|4|Transfer, interconnected with Tank3|
|2|3|Main/Engine3|
|3|2|Main/Engine2 and APU|
|4|5|Transfer|
|6|1|Main/Engine1|

Older reversed B4/B6 mapping is superseded. Cells span full fuselage width underfloor, not the lateral cabin thirds. Suitable imagery/visualization is pending.

User excerpts describe the B1/B2 upper70%-level port, lower transfer-to-main flap, combined analysis above that level and filling sequence. Do not invent capacity, variable-arm curves or pump thresholds from that description. Read corrected sections of `FUEL_VISUALISATION_NOTES.md` and reconcile with Active Dev/applicable references when fuel work begins. Quantities/distribution/burn/departure/landing CG and visualization remain future integration work.

## Source ownership and architecture

The prototype uses a pinned reduced catalogue (`config-data.js`, `config-source.json`, v29 provenance), explicit prototype overrides and separate bay data. Active Dev evolves independently. Do not assume parity or silently refresh away user-confirmed decisions. Demo/development uses a local snapshot; future custodian-managed live configuration is planned, not connected.

The developed engine includes configuration/accounting/mission/people/fuel/MCDU/persistence/reporting dependencies. `compute.js` is not automatically a standalone pure library. Only pinned cargo/bay/CG helper bodies in `load-math.js` currently supply subtotals. Future integration must compare the same agreed aircraft state and results, not create competing stores/engines.

Still incomplete: full equipment/eligible-location coverage; quantities/allocations; named people and entered person weights; rack footprints; acceptance/basic-weight accounting; whole-aircraft W&B/envelope; fuel; MCDU/reporting; persistence/recovery; custodian and offline/release workflows.

## Implementation map

- `index.html`: shared aircraft state/render bridges.
- `image-workspace.js/.css`: local menus, breadcrumbs, layers, responsive positioning and primary actions.
- `aircraft-summary.js/.css`: six summary sections, differences from standard, load removal.
- `shelf-editor.js`: role-prioritized grouped/reinstallable contents.
- `floor-area.js/.css`: cells, cargo drafts/estimation/drag/relocation.
- `cargo-layer.js/.css`: validated custom-load CRUD, reusable slots, symbols, status and inspector.
- `ramp-area.js/.css`, `ramp-limits.js`: ramp selection and aggregate checks.
- `seat-rules.js`, `seat-editor.js`, `basket-editor.js`, `pta-editor.js`, `stokes-editor.js`, `floor-equipment.js`, `casevac-editor.js`: current guarded equipment/people operations.
- `live-cabin.js/.css`: approximate composited imagery; original role pictures available with Live equipment off.
- Reviewed region files, calibration and plan registration: preserve user-approved geometry.
- `preview-server.cjs`: static preview/review saves; built-in Node modules suffice to run demo.

Launch from project root with `START_DEMO.cmd`, `npm start` or `node preview-server.cjs 61448`. Check an existing preview before starting another; do not terminate unrelated listeners. Existing static preview serves updated files without restart.

## Verification and authority

Full tracked npm suite passed before publication: demo/presets, hosted/file calibration, cargo integrity/totals, image menus, responsive refinements, sidebar/pilot rules, ramp checks and reusable slots/removal. Windows environment:

```powershell
$env:PLAYWRIGHT_MODULE='C:/Users/sstni/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'
$env:PLAYWRIGHT_CHANNEL='msedge'
& 'C:/Program Files/nodejs/npm.cmd' test
```

Run meaningful checks appropriate to each change. Test menu placement/responsiveness as well as values. Use temporary files for synthetic review/save tests; never overwrite actual calibration or outlines. Existing tests protect pinned data, imagery and source helpers.

The user authorizes normal development/checks without individual conversational permission at each step. Respect real platform approvals; do not create repetitive confirmation loops. Active Dev remains read-only unless a new agreed scope authorizes changes. Latest publication was explicit and completed; do not automatically publish additional changes or these documents without another request.

## Deferred/superseded notes

Parked by user: conditional ramp-stowed Stokes imagery in Ramp Shelves detail view, based on the supplied starboard team-member view. Perspective/occlusion require review; this is not the next priority.

Older guidance contains superseded statements: old fuel mapping; absent ramp cargo/checks; static-only imagery; old basket/seat exclusions; missing outlines; keeping old main alive; fixed engine-isolation-first scheduling. README and the opening of IMAGE_FIRST_WORKSPACE may still describe the former branch/old baseline. Current main and latest priorities are those above. Use this handoff and the latest conversation to resolve outdated status; do not undo reviewed work to match an older note.
