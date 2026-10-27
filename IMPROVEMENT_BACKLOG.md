# CH-149-615 current backlog

Updated 26 October 2026 after the user's latest iPad/workflow feedback. Previous published checkpoint: 0458550. Deployment was not independently verified in this session. Reference-pack ZIPs remain historical snapshots. The user subsequently authorized the entry page, local resume, keyboard fix, aft navigation and agreed wording for local review. The user has now authorized commit and push of this reviewed revision. The earlier hold is superseded for this scope only.

## Local implementation review — 26 October 2026

- Fresh entry: tail buttons, 149SIM display name for 149920, Basic Weight basis defaulting to Recorded, Basic Weight/CG/initial fuel in one row, Role, and Accept aircraft opening the image workspace.
- Entry has only total fuel: no reserve or distribution control. The exact user wording reads: "Initial fuel uses automatic distribution. Check actual fuel distribution in the aircraft and adjust in the Fuel menu if required, to ensure an accurate CG".
- Image-page controls remain editable. The fuel menu title is Fuel planning and the landing field is Fuel at landing (reserve) — kg. Live CG helper explains the capped landing fuel and unchanged non-fuel load.
- A compatible saved local session resumes directly to the image workspace. Return to Start page retains the existing aircraft until a replacement is accepted; Keep current session resumes it, while entering new details and selecting Accept aircraft starts over; incompatible/corrupt snapshots return to entry. This is prototype local persistence, not completion of source operational acceptance, output certification or live editor propagation.
- Port/Starboard aft image targets are enabled on the correct sides; they share view selection with View controls. The equipment-menu Starboard aft parent action now navigates to the view.
- Desktop entry no longer inherits the cabin's two-column main layout. Focused menu/dialog fields are kept visible within the visual viewport during simulated keyboard shrink. Actual iPad Safari keyboard acceptance remains open.

- Further local refinements: zero quantities appear blank and empty fields count as zero wherever permitted; Occupants layer hides default/added crew, passenger and patient badges without changing state or W&B. Seat indicators are centred on the seats above all aircraft/equipment images and below the separate occupant drawing layer. C4/C5/C6 are checked in SAR-3/SAR-10. Crew classification matches W&B, including SAR Tech positions, with only Crew/Passenger/Patient icons, also in the key. The starboard basket menu has a Starboard Aft View button. C3 alone is repositioned from its confirmed seat centre at 4559 mm using the common station calibration, just forward of Bay 1 on the centreline. C1/C2 retain 3673 mm; their images and all other seat-image positions are unchanged. Catalogue occupant arms are unchanged. Aft targets use the user-circled edge areas with hover labels only; equipment retains selection priority.
- DISCUSSION ONLY: clickable-zone highlight visibility layer. User preference is hidden by default and remembered. Proposed behavior is shading/outlines only, all navigation still clickable, temporary hover/focus reveal. No new highlight layer has been implemented.

## Artwork refinement — local review

- Full SAR cabinet fill/outline replaced by a compact SAR Cabinet label in reference mode; live mode shows only the selectable artwork. Aft access zones have no fill and only light hover/focus outlines.
- Added original-image visual crop/placement definitions for pictured SAR seats and fixtures and Transport passenger seats. Labels follow visual seat centres; the numerical aircraft model is unchanged. The role reference image now supplies the surrounding artwork and floor panels; only the individual item regions are removed from that backdrop and rendered as stateful components. The full PTA aft moulding is retained. Liferaft placements use the native Transport/CASEVAC images. Hidden floor under removals and custom/unpictured arrangements still need visual review.
- Dive Bottle / O2 Rack is currently an empty Role Fit fitting only. The user explicitly clarified that neither AviOx nor operational dive-kit bottle loads control its depiction, and there are no contents to put in it yet. The subsequent original-reference clarification supersedes the empty-frame clipping: retain the full pictured fitting artwork, without creating bottle loads. Future stowage identity/dependencies are deferred; do not invent contents or extra mass. Default Transport and CASEVAC do not carry the fitting. Their prototype default states and W&B now exclude it; existing saves receive a one-time default correction, and later manual installations remain supported and persist.
- Sensor Workstation now renders independently from C4 using its existing Role Fit key. Present in standard SAR-3/SAR-10, absent in standard Transport/CASEVAC; custom install/removal updates the picture and uses the existing 46.69 kg at 5830 mm.
- Keep the name Live equipment. The user rejected Current cabin and asked to hold naming for later discussion.

## Latest local reference-view refinements

- Deployed Stokes uses crisp open-frame vector artwork based on the provided litter references, replacing the blurred crop and colour-key filter. Existing position, dimensions, deployment/patient actions and W&B remain unchanged.
- With Live equipment off, a removed sea tray is explicitly marked Sea tray removed in the image corner. The Role reference picture remains intact; clicking the marker opens its fitting controls.
- Reference-mode labels are Fwd shelves (the retained fixed fixture), SWS, O₂ rack and Basket. SWS/rack/basket labels appear only for installed items and open their item controls. Basket’s old symbol is replaced by text in this mode. The labels hide with Live equipment on and during CG display.

## Original requests and remaining device review

### 1. iPad keyboard obscures menu text entry

User-reported behavior: opening a menu with a text/number entry and the on-screen keyboard resizes or repositions the menu so the entry becomes obscured. Root cause has not yet been reproduced or established.

Desired behavior: keep the focused field and caret visible while typing, with menu contents scrollable and Apply/Cancel reachable. Preserve the draft, focus and selected aircraft state as the keyboard opens/closes. Review keyboard/visual-viewport sizing, menu position and scrolling together rather than introducing isolated closing exceptions.

Validation should cover actual iPad Safari in portrait/landscape, keyboard opening/closing, switching fields and long menus, including cargo weights/arms, fuel/reserve and equipment quantities. Desktop emulation alone does not establish native keyboard behavior. Suggested first usability fix when implementation resumes.

### 2. Fresh-session entry page; resume directly into the image workspace

The user proposes a separate initial entry point for a fresh session containing:

- Tail number selection.
- Initial Basic Weight and CG, retaining Recorded Basic Weight as the default and the explicit alternative basis choices.
- Initial Role selection, including the existing No Role Config option.
- A short explanation of the image workspace and the operator's next steps: inspect/change configuration, people, loads and fuel, and watch live W&B/CG feedback.
- A clear action to enter the image workspace.

All existing controls remain available in their current image-workspace positions. The entry page and image controls must edit the same aircraft state and use the same validation/accounting rules, without a second baseline or hidden reset.

A valid persisted session should reopen directly into its image workspace. Persistence, tail-specific restore, invalid/stale-session handling and explicit Start fresh remain prerequisites and design work; current prototype session edits still reset on reload. Preserve existing warnings/Cancel behavior for Role changes and accepted-information changes. Do not implement an automatic resume that bypasses required aircraft-information review.

This is a user-proposed workflow direction, not a finished page design. Discuss the entry/resume flow before building it.

### 3. Product direction: make load/fuel consequences immediately understandable

The user described live CG visualization as a major benefit for the Flight Engineer: seeing the effects of moving loads and changing fuel, rather than discovering them only in final totals. Carry this forward as a design objective, not as a separate unscoped rewrite.

Preserve live takeoff/estimated-landing markers, weight-dependent allowable ranges, clear out-of-limit feedback, numerical margins, the true cabin reference and the enlarged CG strip/full-envelope comparison. Keep landing assumptions and current aircraft state clear. Evaluate later interaction changes by how well they make loading consequences understandable.

## Completed or resolved in this session

- Confirmed prototype starting commit a2c3e18 and clean Active Dev starting state; Active Dev was not edited.
- Added the Recorded Basic Weight basis as the default, using source inclusion definitions; RFM remains explicit.
- Reproduced/explained the 579.57 kg SAR-3 difference as differing inclusion assumptions. The first independent source-app comparison passes for matching baseline, graphical quantity change, cancellation, rejected operations, removal/reinstall and automatic/manual fuel. This is a bounded first slice, not complete editor/tail integration.
- Implemented CASEVAC patient multi-select across racks, one Add Selected Patients action, automatic closing after success, and occupied/unavailable-position guards.
- Added bold green/amber/red AUW status; bold green valid CG and red OUT CG/value; Fwd/Mid/Aft associated with AUW CG.
- Implemented the cabin-centreline CG band selected by takeoff/landing weight, both calibrated markers, Focus CG, layer suppression/restoration and reserve-based landing estimate.
- Added the enlarged live CG strip: separate takeoff/landing ranges and margins, shared arm scale, and expandable complete weight-versus-CG envelope. Verified the 301 kg ramp-load case, including CG movement, changing limits and aft-limit exceedance.
- Confirmed the RFM no-role example is correct: 10098 + P2/P3 seat structures (9.35 kg each) = 10116.70 kg, displayed as 10117 kg. The user confirmed those seats remain additive under the RFM basis despite permanent installation. No inclusion-flag change is required.
- Committed and pushed the application, verification checks and review documents as 0458550. New feedback/document updates after that commit remain local.

## Remaining implementation work

| Workstream | What remains |
|---|---|
| iPad text-entry usability | Reproduce and fix keyboard/menu occlusion, then verify on a physical iPad. |
| Entry page and persistent sessions | Agree fresh/resume journeys; implement a shared initial-data entry page, tail/session persistence, recovery and explicit Start fresh. |
| Full Active Dev integration | Connect live fleet/tail editor definitions and accepted state to the graphical workflow; retain maintenance exceptions, custom exceptions and accounting distinctions. Current functions/catalogue are pinned snapshots. |
| Broader workflow equivalence | Extend component/state comparisons across all roles, split/group allocations, containers/fittings, seats/people/patients, cargo/bay loads and fuel. Preserve the prototype's stronger physical guards. |
| People and eligible locations | Enter individual weights; complete eligible-location and footprint review without inventing capacities/geometry. |
| Operational outputs | Integrate MCDU/briefing/clearance/PDF, preserve Operating Weight versus AUW distinctions, and implement certification/invalidation. Preserve Cargo 1–4 identities in source output mapping. |
| Delivery and acceptance | Complete initial device download, update checking, accessible previous-version fallback, persistence/recovery and physical-device/output acceptance. Ordinary browser caching is not the requested offline delivery feature. |

## Decisions still to discuss

- Whether a separately named fit-only Role operation is useful alongside the accepted full Role reset; keep current behavior until agreed.
- Whether negative corrections belong in ordinary cargo or a separate adjustment mechanism.
- The authoritative general cabin cargo-arm bounds; retain precise entered-arm cargo and separate configured-arm bay loading.
- How renewed aircraft acceptance should handle entered fuel/manual tank quantities; preserve the existing retained-fuel expectation until the lifecycle is deliberately reconciled.

See PROTOTYPE_ACTIVE_DEV_COMPARISON_2026-10-26.md for evidence and the recommended behavior to preserve from each app.

## Original eleven findings — current disposition

The accepted compact Role/Layers/View controls, contents/quantity editing, image framing, symbols, fuel strip, ramp menus, hidden hand/zoom controls and detail return are implemented. The visible global Undo remains removed. Touch behavior remains one-finger page scrolling, two-finger image pan/pinch, with centered reset. Do not reopen those settled design discussions because older reference packs describe them as pending. The new keyboard issue above is a concrete device finding to address separately.

## Parked / future visual work

- Configuration-aware detail reference images, including conditional ramp Stokes imagery.
- Confirm final stretcher position, possibly behind PTA; current symbol remains B6 Port aft with its prior accounting arm.
- Verify sponsons and eligible contents/arms; keep empty/hidden until confirmed.
- Tentative symbol/placement editor remains unapproved.

Preserve fixed geometry/arms, independent cargo/bay accounting, group selection scope, fitting/occupant/patient guards, warning-versus-mandatory-limit distinctions and explicit unknown capacities.
