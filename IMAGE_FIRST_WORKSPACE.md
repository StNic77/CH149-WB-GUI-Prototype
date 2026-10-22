# Image-first workspace — development branch

Branch: `codex/image-first-workspace`. Preserved demo baseline: `main` at `30805a4`. No remote publication is part of this work.

## Agreed interaction

The Role Config establishes the starting equipment, seating and locations. It does not restrict the operator to installing items from that role alone.

Selecting a floor cell opens its location choices. Selecting an installed item opens the same floating workspace focused on that item's controls. The location breadcrumb returns to shared-space choices. Controls remain next to the image instead of requiring a scroll to a separate editor. Selecting another image item changes focus; Close/Escape dismisses the panel. Layer controls can be changed without discarding an open form.

The cabinet is a container: selecting it opens its detail image; selecting a compartment opens that compartment's contents locally. Forward/ramp shelves follow this pattern. Overhead locations remain accessible through the two aft detail views.

## First working implementation

- Toolbar layers: Seats, Bay Boundaries, Bay Cells, Alignment guides, Live equipment and Cargo. Each has an explanation. Zoom/fit/view controls remain separate. The old location/equipment shortcuts have secondary access under Browse controls.
- One nonmodal floating panel, kept within the window on desktop, tablet and phone, with location/item breadcrumbs and internal scrolling.
- Installed seat pictures work immediately without enabling seat markers. All existing seat installation, assignment, occupancy, folded-seat and exclusion rules remain in their original modules.
- P18 remains directly selectable when the port basket folds it. B6 Port coordinates seat/basket/cot choices; an occupant blocks basket placement. Moving a basket changes the menu's location context.
- Existing basket, PTA, Stokes, raft/fitting, Sea Tray, CASEVAC and cargo editors appear in this panel. Moving cargo temporarily makes the image available for point selection; Escape returns to the original record without a state change.
- Selectable plan access points open forward and ramp shelf detail views. Reviewed cabinet, shelf and overhead polygons open the existing contents; listed mission equipment can be removed or moved locally using existing mutation functions.
- All four CASEVAC racks are accessible from No Role Config through the cells containing their configured arm references: forward starboard B2 Stbd; forward port B4 Port; aft starboard B5.5 Stbd; aft port B5.5 Port. Forward racks retain three patient tiers and aft racks two.

## Deliberately incomplete mapping

The CASEVAC references above are **arm references**, not confirmed full rack footprints. Patient tier availability is confirmed; the occupied cells, installation clearances and seat/equipment exclusions across each rack's entire footprint still need review. Rack installation is not a declaration that an arbitrary combined aircraft load is cleared.

The location menus expose mapped options, not every eligible item in the operational catalogue. The complete Role Fit/Mission equipment-to-location mapping is still unfinished. Shared/spanning equipment must lead to one installed record from each confirmed affected cell; remaining rack spans must be added once established.

Seat assignments retain the existing prototype's occupant category. Named people, entered person weights, full quantity editing and the full operational calculation/limit/reporting engine are not introduced by this presentation change. Cargo/bay subtotals retain the pinned reference helpers; whole-aircraft W&B parity remains a separate integration and comparison task.

## Verification

Portable checks cover presets; approved embedded joints/ramp edge; cargo identity, slot limits, atomic edits and totals; image-local P18/basket flows and occupant guards; direct folded-seat selection; cabinet and shelf selection; CASEVAC installation from No Role Config; layer visibility; and menu bounds at desktop, tablet and phone sizes. Original catalogue data, calibration files, baseline imagery and the reference calculation file are protected by the existing cargo regression check.
