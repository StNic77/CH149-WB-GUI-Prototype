# Image-first workspace — development branch

Branch: `codex/image-first-workspace`. Preserved demo baseline: `main` at `30805a4`. No remote publication is part of this work.

## Agreed interaction

The Role Config establishes the starting equipment, seating and locations. It does not restrict the operator to installing items from that role alone.

Selecting a floor cell opens its location choices. Selecting an installed item opens the same floating workspace focused on that item's controls. The location breadcrumb returns to shared-space choices. Controls remain next to the image instead of requiring a scroll to a separate editor. Selecting another image item changes focus; Close/Escape dismisses the panel. Layer controls can be changed without discarding an open form.

The cabinet is a container: selecting it opens its detail image; selecting a compartment opens that compartment's contents locally. Forward/ramp shelves follow this pattern. Overhead locations remain accessible through the two aft detail views.

## First working implementation

- Toolbar layers: Seats, Bay Boundaries, Bay Cells, Alignment guides, Live equipment and Cargo. Each has an explanation. Zoom/fit/view controls remain separate. Redundant Browse controls and the old schematic position strip are retired from the interface.
- One nonmodal floating panel, kept within the window on desktop, tablet and phone, with location/item breadcrumbs and internal scrolling.
- Installed seat pictures work immediately without enabling seat markers. All existing seat installation, assignment, occupancy, folded-seat and exclusion rules remain in their original modules.
- P18 remains directly selectable when the port basket folds it. B6 Port coordinates seat/basket/cot choices; an occupant blocks basket placement. Moving a basket changes the menu's location context.
- Existing basket, PTA, Stokes, raft/fitting, Sea Tray, CASEVAC and cargo editors appear in this panel. Moving cargo temporarily makes the image available for point selection; Escape returns to the original record without a state change.
- Selectable plan access points open forward and ramp shelf detail views. Reviewed cabinet, shelf and overhead polygons open the existing contents; listed mission equipment can be removed or moved locally using existing mutation functions.
- All four CASEVAC racks are accessible from No Role Config through the cells containing their configured arm references: forward starboard B2 Stbd; forward port B4 Port; aft starboard B5.5 Stbd; aft port B5.5 Port. Forward racks retain three patient tiers and aft racks two.

## Refinements confirmed on 23 October 2026

- C1/C2 and P2/P3 are permanent seats with direct picture hit targets, even when unoccupied. They retain their existing background pictures and assignment controls.
- Stowage menus lead with items normally assigned to that location by the selected Role Config, including currently removed items. Other catalogue equipment is searchable and collapsed into source groups. Remove changes aircraft installation only; it never removes a catalogue definition.
- Back to 2D cabin changes only the view. It does not reapply the Role Config or reset the load.
- Cargo starts with an unobstructed point selection. The small marker can be dragged with mouse/touch, or adjusted with arrow keys, before completing the focused detail form. New cargo/bay forms dismiss after a successful add.
- Primary action rows stay at the top of the local editor. Responsive bounds use the visible viewport, including changes caused by the mobile keyboard; narrow layouts avoid covering the selected marker where possible.
- Demo and development use the local configuration snapshot only. Future integration should read custodian-managed configurations live through the shared application data layer; no live reachback has been added here.

## Deliberately incomplete mapping

The CASEVAC references above are **arm references**, not confirmed full rack footprints. Patient tier availability is confirmed; the occupied cells, installation clearances and seat/equipment exclusions across each rack's entire footprint still need review. Rack installation is not a declaration that an arbitrary combined aircraft load is cleared.

The location menus expose mapped options, not every eligible item in the operational catalogue. The complete Role Fit/Mission equipment-to-location mapping is still unfinished. Shared/spanning equipment must lead to one installed record from each confirmed affected cell; remaining rack spans must be added once established.

Seat assignments retain the existing prototype's occupant category. Named people, entered person weights, full quantity editing and the full operational calculation/limit/reporting engine are not introduced by this presentation change. Cargo/bay subtotals retain the pinned reference helpers; whole-aircraft W&B parity remains a separate integration and comparison task.

## Live aircraft sidebar — first pass (23 October 2026)

Six collapsible sections correspond to Acceptance Info; Role Selected / grouped Role Fit; grouped Mission Equipment; Crew, Pax, Patients and Seating; Fuel; and Load Planning. All start collapsed, show compact live counts/status, and retain their expansion state while editing.

Role Fit grouping uses the explicit group or the same group prefixes as Active Dev's accounting UI. Mission grouping uses the local catalogue. Changes are compared with the selected role's initial setup, including the prototype's confirmed role overrides. Added/removed equipment and moved mission items are identified; removed standard items remain visible and link back to installation controls. Supported rows open the existing image editors. Unsupported equipment editors, aircraft acceptance and fuel editing remain unconnected, rather than presenting working controls for those functions. Cargo totals are only the existing cargo/bay subtotal.

C1 and C2 expose crew assignment only. The seat rule also rejects passenger assignment without mutating occupants. The sidebar reads the same local aircraft state and configuration snapshot; it adds no live custodian-file connection and no separate loading data store.

## Deferred visual request — ramp-stowed Stokes (23 October 2026)

Parked at the user's request; do not implement yet. The orange Stokes litter visible in the supplied `Team member View STBD.png` is a reference for a conditional layer in the Ramp Shelves view (`Rear Shelves.png`). Show it only when the existing Stokes state is ramp-stowed; omit it when cabin-deployed or not installed. Use the same authoritative installation state as the 2D plan, with no duplicate litter or change to weights/arms. The viewpoints differ, so perspective, scale and shelf/seat occlusion need visual review rather than a direct unadjusted crop. The existing Starboard Aft reference view should also be considered when later making detail imagery reflect installation state. No imagery or live display behaviour changes are included now.

Reference attachments: `C:/Users/sstni/Desktop/Rear Shelves.png` and `C:/Users/sstni/Desktop/Team member View STBD.png`; corresponding images are already present in the prototype's images folder.

## Verification

Portable checks cover presets; approved embedded joints/ramp edge; cargo identity, slot limits, atomic edits and totals; image-local P18/basket flows and occupant guards; direct folded-seat selection; cabinet and shelf selection; CASEVAC installation from No Role Config; layer visibility; and menu bounds at desktop, iPad portrait/landscape, and phone portrait/landscape sizes. The refinement check also covers fixed-seat assignment, BMS removal/reinstallation, role-normal stowage priority, preserved loads on returning to 2D, draggable cargo markers and visible primary actions. Original catalogue data, calibration files, baseline imagery and the reference calculation file are protected by the existing cargo regression check.

## Ramp checks from Active Dev

The prototype reads the unchanged `config-data.js` AC_RAMP snapshot: hinge 11393 mm, end 14393 mm, closed load 350 kg, open load 450 kg and hingeMomentMax 450 kg·m. These match Active Dev `config.js`, section 4. Active Dev `app.js` ramp hints use weight × (arm − hinge) / 1000 and issue per-cargo warnings; its cabin bay editor also caps the Rear Area entry at 450 kg. No additional ramp-arm loading curve was found in those checks.

`ramp-limits.js` applies the same hinge-moment proxy to combined custom ramp cargo and ramp bay weight, plus the source 49 kg Stokes at 13132 mm when ramp-stowed. Custom cargo with an entered arm inside the ramp interval is included regardless of its displayed cell. Shelf loads and shelf structures are excluded under the confirmed prototype rule. Cabin-deployed Stokes and its patient are not ramp loads. This aggregation extends the source's per-entry warning behavior to avoid splitting a load to evade a warning. The physical ramp arm range is enforced atomically for Ramp records; overweight and moment exceedances remain editable and visible, matching the source warning workflow.

The displayed combined-arm bound is min(14393, 11393 + 450000 / total ramp kg), not a permissible arm for every individual load. Both open and closed weight checks are shown; no aircraft ramp-state simulation has been added. At the configured 12893 mm arm, 300 kg alone reaches 450 kg·m. The status previews a replacement draft without counting the old entry twice and updates after litter moves/removal. This does not alter the pinned aircraft subtotal helpers, source app, approved image registration or cargo entry count.

Boundary and browser checks cover inclusive station endpoints, invalid-edit preservation, 350/450 kg boundaries, 450 kg·m boundary, combined entries, Stokes transitions, shelf exclusion, and desktop/tablet/phone draft warnings. Ramp cargo uses the selected longitudinal fraction between the approved image hinge and aft mark, mapped linearly to X11393–X14393 and rounded to the nearest millimetre. Lateral position affects the displayed marker only. Draft markers can be dragged with mouse or touch; bay weight remains at the source 12893 mm arm. These are image-based estimates, not surveyed placement measurements. Shelf capacity integration and whole-aircraft approval remain separate work.

## Reusable cargo slots and visible cautions

Individual cargo now has a separate MCDU slot, 1–4. New cargo uses the lowest free slot; removing cargo frees that slot immediately without renumbering the remaining entries. Internal record IDs remain unique so editing, selection and removal cannot target a different load when a slot is reused. Bay weights never consume slots and are labelled by bay (including Ramp) rather than by the internal ID. Existing session records without slots are assigned available slots when rendered.

Ramp cargo and ramp-weight symbols use green for passing the connected ramp checks and red plus an exclamation mark for a combined ramp caution. All affected ramp entries update together, including after Stokes moves or load removal. Cabin loads stay neutral grey because cabin loading limits are not connected yet. Colour is supplemented by accessible labels, tooltips, explicit caution text in the sidebar and a notice at the top of the selected load menu. Draft cautions update as weight or arm changes before saving.

Load Planning includes a separate Remove control beside every cargo and bay-weight entry. It removes only that record, refreshes totals/symbols/cautions immediately and frees an individual cargo slot when relevant. Browser checks cover repeated empty/add/remove cycles, lowest-free-slot reuse, stable remaining slots, separate bay labels, aggregate red/green transitions, top-of-menu caution visibility and sidebar removal on desktop/tablet/phone.
