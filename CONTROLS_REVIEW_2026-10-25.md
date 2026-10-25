> **Device-test release, 25 October 2026:** The user has now explicitly authorized committing and pushing this prototype for iPhone/iPad testing. Earlier local-only/uncommitted/no-publish statements below are historical. Current behavior is recorded in CONTROLS_REVIEW_2026-10-25.md; physical device acceptance remains pending.

# Controls and contents — local review, 25 October 2026

This local prototype increment follows the user’s live review. It is awaiting user assessment. No commit, push, publication or Active Dev changes.

## Current behavior

- Role choices collapse after selection. Choosing a different role warns before clearing configuration/loading edits and applying its standard configuration. Cancel preserves work; accepted baseline inputs remain. This is prototype behavior, not completed acceptance-workflow integration.
- Role, Layers and View remain together above the image. Hide controls collapses only the side rail’s zoom, sizing and handedness controls; Show controls recalls them. View is absent from the side rail and closes its chooser after a view is chosen.
- The image rail floats over the left or right image margin, including portrait phones. Its hand key is the sole visible hand control. Layers contains relevant controls and Symbol key; no hand selector, layer help, region review tools or alignment guides.
- Aircraft summary can collapse to a 44-pixel vertical strip at tablet/desktop widths without altering aircraft data.
- Enlarge cabin fits the complete C1/C2 targets and calibrated ramp using uniform scaling. Fuel quantities sit along the image bottom, aligned horizontally to their associated bays as zoom/pan changes.
- Opening a space shows contents and weights immediately. Edit contents exposes selection boxes and Select all, Remove selected, Move selected and Clear all selections first. Individual quantity editors expand by item. Selected-unit quantities remain separate from target quantities.
- Remove all items and Install standard contents are directly available on the space overview. Small screens may require scrolling within that same menu. Successful final actions close the menu; invalid drafts stay open. Layers stays open until closed. Feedback lasts 2.5 seconds.
- O2 has a 2D symbol and a transparent target on its rendered Port Aft rack. Guidelines are grouped inside the rendered Stbd Aft basket. Rifle/shotgun symbols use distinct cartridge/shell details. The stretcher symbol is visually associated with B6 Port (aft); its existing accounting arm and allocation were preserved.

## Scope and checks

The source catalogue, calculation bodies, calibration and reference pictures are preserved. Role-aware removal of items from detail pictures remains deferred. Physical iPad/phone assessment is still required.

The focused refinement check covers five screen sizes, all role framing, floating hand controls, hiding/recalling Views, relevant-only layers, immediate multi-select/removal, the fuel strip and summary collapse. Fuel checks pass all 4,153 whole-kilogram values with Active Dev parity; planning checks pass source-engine parity. Edge passes the five-size refinement check, seven-size role/view/symbol/final-action check, seven-size compact contents check, five-size shelf flow and seven-size usability package. Safari-engine refinement checks are also run separately. These are focused checks; the entire historical verification suite was not rerun.

Rollback checkpoint: `../prototype-checkpoint-before-controls-symbols-20261025-122622.zip`.


## Subsequent approved ramp and fuel refinement

The user accepted the corrected side-control hiding behavior and requested implementation of the agreed ramp and fuel changes.

- Ramp starts with exactly Ramp Shelves, Ramp Cargo, Ramp Area (Bay weight), Stokes Litter, in that order. Ramp Cargo lists installed ramp cargo and Add ramp cargo, with Back to Ramp. The other choices open the existing shelf, bay-weight and litter controls. Ramp limits remain in focused loading editors, rather than expanding the initial choice menu.
- Bay names sit above the fuel band for every configured cabin bay, including Bay 5 and Bay 5.5 without tank entries. Tank numbers are prominent and each quantity includes kg. Both rows follow the existing calibrated bay boundaries and zoom/pan. Phone labels stack to avoid adjacent words running together. No fuel distribution, weights or geometry changed.
- Edge and Safari-engine checks pass the new ramp/fuel flow at five sizes. Ramp limit/placement checks pass desktop, tablet and phone; the phone marker-drag test temporarily suspends its floating editor to reach the marker. The floating rail can also cover part of the ramp on a phone and can be moved or hidden using the existing controls. Fuel source parity still passes all 4,153 whole-kg quantities.


## Detail return and fuel retained across Role changes

By user request, each detail image now has a small fixed 2D view button at its top right, independent of image pan/zoom and side-control visibility. It returns directly to the plan. The side rail starts below this button in detail views.

Role selection/change preserves fuel amount, automatic/manual mode, entered tank quantities and preferred reserve along with accepted baseline information. This supports entering book fuel before selecting the first Role. Configuration/loading edits and certification still reset after confirmation; Cancel still preserves the complete session. The reset dialog states the retained fuel behavior. No source fuel calculation changed.


## Publication verification

Before the authorized device-test push, every check registered in verification/run-checks.cjs passed in Edge, including the broader cargo, image workspace, summary, ramp, loading and stale-asset iPad checks. Legacy checks were updated to reopen editors after successful actions and to exercise phone drag targets with the floating editor clear. The focused detail-return/fuel-retention and ramp/fuel-label checks also passed in the Safari engine at five screen sizes. This remains browser automation, not physical-device acceptance.
