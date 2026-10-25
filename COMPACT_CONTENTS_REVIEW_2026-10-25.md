> **Device-test release, 25 October 2026:** The user has now explicitly authorized committing and pushing this prototype for iPhone/iPad testing. Earlier local-only/uncommitted/no-publish statements below are historical. Current behavior is recorded in CONTROLS_REVIEW_2026-10-25.md; physical device acceptance remains pending.

> **Latest local review, 25 October 2026:** Controls, immediate contents multi-select, fuel strip, framing and collapsible summary are updated. See [CONTROLS_REVIEW_2026-10-25.md](CONTROLS_REVIEW_2026-10-25.md). Earlier menu descriptions below may describe the preceding iteration. No publication or Active Dev changes.

# Compact contents menus — local review, 25 October 2026

The user requested this bounded implementation after trying interactive practice menus. This is a local trial awaiting their review, not acceptance of the rest of the 24 October package. Nothing was committed, pushed or published. Active Dev, the equipment catalogue, calculation bodies, imagery and calibration were not changed.

## Implemented interaction

- Opening a shelf, compartment, stowage group or bay contents menu shows a read-only contents preview immediately. The space header includes its complete current contents weight. Each item row shows name, quantity and the combined weight of that row.
- Long lists initially show three rows, fading the bottom row only when more rows are hidden. Show all contents expands the list; Show fewer contents collapses it. No item-type count. The header always includes all contents, including hidden rows and any additional contents weight.
- Edit contents explicitly enables quantity editing and removal without another item-inspection click. Each row offers target quantity, Apply quantity, Cancel edit and Remove all of this item at this location. Other-location allocations remain intact. Draft quantities on other rows survive applying a single row.
- Move units retains the existing destination checks. Multi-select and selected-unit actions remain available under Move or remove selected units, keeping those action quantities separate from target quantities.
- Available to install retains search, categories and the complete eligible catalogue. Its default category is Standard contents. Items already at the selected location disappear from Available and are edited through Edit contents. Existing allocations elsewhere remain visible. Successful installation confirms item, quantity and destination.
- Selection totals and selection actions appear only with a selection. Clear all selections clears the entire current selection and confirms that no aircraft load was changed. Select all applies to the current list.
- Back returns from editing/installation to the read-only space overview. Cabinet spaces can return to a cabinet overview and select another zone. Menu help explains viewing, editing and catalogue access.
- The Undo control was removed as requested. Existing internal transaction snapshots remain for compatibility and accounting regressions; they are not exposed as a user control.

## Weight and safety presentation

Space headers and item rows reuse current planning state. Cabinet structure appears only at the cabinet parent level, alongside all-zone contents and their combined total. The cabinet detail overview also shows that breakdown. Aircraft totals remain the existing source-based results; presentation subtotals do not add another load.

Cabin bay contents use the existing explicit-bay accounting, including cargo/bay records and directly assigned mission equipment, not inferred seats/people/fixed equipment. Separate cargo editors remain available. Existing ramp checks and their shelf exclusion remain unchanged.

Loading limits remain accessible locally. Overloads and unresolved-load warnings expand automatically; undefined capacity remains explicit. Basket, Stokes, raft, occupant and patient controls retain their dedicated guards. No sample items or illustrative practice weights were copied into the prototype.

## Checkpoint and review

Before this increment, 442 project files were archived to:

`../prototype-checkpoint-before-compact-contents-20261025-104446.zip`

The archive includes the then-current local, uncommitted application and documents. Git metadata and reinstallable node_modules were excluded. Restore only the intended files after checking for newer work; do not reset or clean the repository.

Refresh the already-running local page, or use START_DEMO.cmd and http://127.0.0.1:61448/. Refresh still clears session-only aircraft edits.

Try Cabinet → Zone G, expand/collapse contents, enter Edit contents, edit or remove an item, return, and reinstall it through Available. Repeat in a forward/ramp shelf, overhead location and bay contents menu. Inspect the cabinet aggregate separately. Changes remain a trial until the user finds the real layouts useful.

Relevant checks: compact-contents-check, shelf-flow-check and the existing regression suite. The new check covers read-only navigation, fading/expansion, direct editing, pending edits on other rows, local removal with split allocations, reinstall/search, selection feedback, cabinet totals, all mapped shelf/overhead locations, explicit bay loads and responsive bounds. Browser-engine checks do not replace physical-device review.
