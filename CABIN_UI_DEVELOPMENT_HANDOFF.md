> Latest release preparation — 27 October 2026: base checkpoint 7dd6568 is pushed. The user approved the landscape Fuel layout and has now authorized commit/push of numeric whole-value selection, stable menu placement during entry, and the label Ramp hinge moment. The user confirmed the existing ramp limits are correct; neither limits nor calculations change. Desktop/large-tablet cargo position checks and reduced-keyboard checks pass. Actual iPad selection and broader menu usability still need review. Use the refreshed v2 reference package; earlier packages are historical.

# CH-149-615 Cabin UI Prototype — current handoff

Updated 27 October 2026. This document supersedes the older 24–26 October handoffs. Pushed base checkpoint: main 7dd65685db3de9b2803df95692726975820a0f15. The latest authorized release is described above; consult git log and the v2 package manifest for its exact commit. Pages deployment and physical device acceptance are not confirmed.

## Workspace and authority

Prototype: C:/Users/sstni/Desktop/615 WB edit work/CH-149-615 Cabin UI Prototype
Active Dev: C:/Users/sstni/Desktop/615 WB edit work/CH-149-615-WB - Active Dev
Repository: https://github.com/StNic77/CH149-WB-GUI-Prototype
Device URL: https://stnic77.github.io/CH149-WB-GUI-Prototype/?v=39b9b7f

Active Dev remains unchanged, clean at 16a592f, config v30 when checked for this package. Its accounting, editor definitions, calculations, fuel and operational capabilities are the integration authority. Preserve stronger prototype interaction and physical guards. Display artwork coordinates are not surveyed footprints or W&B arms. User-confirmed prototype exceptions are explicit, not silent changes to source data.

## Completed baseline

- CASEVAC: select multiple available positions across racks; clear selection feedback; Add Selected Patients once; close after success; unavailable/occupied positions protected. Existing defaults, arms and W&B retained.
- Recorded Basic Weight default; explicit RFM/current-fit alternatives. RFM 10098 plus two 9.35 kg fitted Role Fit items correctly rounds to 10117 kg; user confirmed this.
- Ribbon: Basic/Operating/Fuel/Cabin (Bay weight)/Cargo/AUW; whole kg/mm display with full internal precision. AUW normal green bold, alternate above 15600 through 16000 amber bold, overweight red bold. Valid AUW CG green bold; OUT CG red bold; Fwd/Mid/Aft associated with its value.
- Aircraft entry: tail buttons (149920 displayed as 149SIM), Basic Weight/CG/initial total fuel together, Role, Accept aircraft. No landing reserve or tank distribution controls on entry. Exact fuel note: Initial fuel uses automatic distribution. Check actual fuel distribution in the aircraft and adjust in the Fuel menu if required, to ensure an accurate CG.
- Accept opens the image workspace; all editing remains available there. Compatible saved local sessions resume to the image page. Return to Start page preserves the current aircraft until new information is accepted; Keep current session resumes it. Incompatible/corrupt saves return to entry. Zero quantity fields display blank and blank counts as zero where permitted; positive required values still validate.
- Fuel planning uses Fuel at landing (reserve). Estimated landing caps that quantity at fuel aboard and holds non-fuel loads unchanged. CG updates live with weight, fuel and load movement.
- CG layer: calibrated cabin-centreline markers, selected-weight limits, Focus CG, common-scale live strips and full weight-versus-CG chart. Takeoff/Landing subdues the other marker; Both shows distinct bands (blue upper half / purple lower half) and both true-arm markers. Full chart uses the existing automatic solver's sampled burn trace as a continuous solid line, rounded joins, no arrows/dashes. Manual tank mode explicitly has no predicted burn order/trace.
- Navigation: equipment-menu Starboard Aft parent action works; image Port/Starboard Aft regions use shared view-selection logic; no permanent aft labels; basket menu includes Starboard Aft View. Aft targets do not fill/obscure the rack. Forward shelves has a compact reference label.
- Layers: occupants independently hide all Crew/Passenger/Patient badges without changing W&B; symbols appear in the key. Seats above images, below occupants. C3 centre uses confirmed 4559 mm; C1/C2 remain 3673 mm, other source arms unchanged. Bay Cells now sit above boundaries without blocking higher seat/equipment interactions.
- Seats: C4/C5/C6 shown when fitted. C6 excludes P7/P8; C5 excludes P13/P14, including position lists. When neither alternative is fitted, one shared seat-choice control replaces colliding markers at the shared position. P7 matches P8's row/proportions, including the native Transport artwork convention, while retaining its own longitudinal location/arm. Occupied-seat and atomic replacement protections remain.
- Live artwork: original role floor panels retained, fitted items rendered separately, removed/moved items reveal the cleared underlay. Native seat/fixture crops, full PTA aft moulding and Transport/CASEVAC raft placements retained. Cabinet label only in reference mode. Dive Bottle / O2 Rack is the full depicted fitting, not separately weighed bottle contents. Default rack absent in Transport/CASEVAC; old saves migrate once; deliberate later installs persist. SWS separately installs/removes; its empty image location remains interactive for reinstallation. Clean open-frame deployed Stokes drawing.
- Reference mode: Fwd shelves, SWS, O2 rack and Basket compact labels; installed-state controls. Removed sea tray still has a corner status marker (moving it onto the tray is deferred).
- Latest detail fixes: Port Aft stretcher association moved over the pictured stretcher; installed rack symbol over its pictured fitting. Shared detail imagery can still depict a different role/fit; the SAR-10 guideline screenshot is an open review item.
- Input/touch refinements: focused fields use available visual viewport; sticky controls release while typing; input is scrolled fully into the body. Ramp shelf nearby taps select the nearest reviewed edge within 23 screen pixels, using original touch coordinates and rejecting pans/cancelled gestures. View offers the existing Adjust ramp shelf areas page.

## Technical map and persistence

session-entry.js/css manages entry and versioned local save ch149CabinSession.v1; it saves shared aircraft state, not a second calculation store. fitRevision protects the one-time rack-default migration. keyboard-menus.js and image-workspace.js cooperate on visible editor bounds. seat-rules.js is the shared exclusion/occupancy authority; seat-editor.js and live-cabin.js draw controls and state. live-visual-layout.js contains measured artwork crops; original raster files remain unchanged. equipment-markers.js draws detail associations. cg-envelope.js assesses source limits/flight points; cg-strip.js renders full envelope and trace; cg-overlay.js handles the cabin layer. fuel-model.js/fuel-reference.js reuse the fuel solver. prototype-rules.js isolates explicit fit overrides.

After JS/CSS changes run node version-assets.cjs, then node version-assets.cjs --check. Run appropriate verification before requesting device checks. Package references contain no aircraft session localStorage or browser profile.

## Integration state and next work

The first SAR-3 matched-state baseline/quantity comparison is complete; see PROTOTYPE_ACTIVE_DEV_COMPARISON_2026-10-26.md. Recorded basis and CURRENT are different inclusion definitions: the recorded example differs by 579.57 kg = 474.43 kg role fit + 105.14 kg seats. Do not change mass/arms to force agreement. Full editor propagation, all-role equivalence, tail acceptance, outputs/certification and offline lifecycle remain open.

OPEN_ITEMS_2026-10-27.md is the consolidated remaining list. Device feedback should be reviewed before the next selected slice. No future implementation or publication is authorized by this handoff itself. The live layer name remains Live equipment; renaming and remembered highlight layer remain deferred. Rack contents/dependencies are not defined.
