# Device-test checkpoint — 29 October 2026

## Current implementation

The main prototype now includes compact phone/tablet presentation; current-aircraft Start fields and unchanged-entry continuation; confirmed Clear all data; deterministic image-workspace display defaults; Cabin CG bands inside the viewing area; a responsive Longitudinal CG envelope replacing the image and hiding the bands; direct Cabin CG and 2D Cabin switches; removed Dive Bottle/O₂ Rack reinstall access; SWS label parity with the SAR cabinet; Ramp shelves reference label inside the port ramp box and both ramp boxes named Open ramp shelves; modest Stokes vector detail; and outboard station captions with explicit leaders when Bay Boundaries is on.

The source catalogue, aircraft masses/arms, solver, fuel model, envelope limits and calibration have not been changed. Existing equipment/loading and manual fuel distribution are retained by unchanged Start continuation. Larger invisible aft-view touch areas support phone/tablet selection; the existing anchors and detail routes remain.

## Verification

Windows Edge/Chromium viewport coverage: desktop 1440x1000, iPhone 390x844 / 844x390, iPad mini 744x1133 / 1133x744. Screenshots inspected during implementation. Planning/fuel, session retention/clear/defaults, CG presentation switching, boundary callouts, Sea Tray cell-first selection, compact load forms, detail return/fuel, shelf flows and cargo slot regressions are the checkpoint checks. Actual Safari/device testing remains for the user; this is not operational acceptance. Full historical suite is not claimed. Older display-specific checks may still assert superseded presentation.

Whole-cabin phone labels are small at fit; zoom remains available. Short landscape screens can require page scrolling. Litter detail is vector artwork, not a photographic replacement. Editor content, quantities, accounting exceptions and accepted-aircraft recovery retain their previous limits.

## Next round, explicitly selected by user

1. Equipment quantity/contents controls and related usability; review actual editors before changing layout. Aircraft Planning and catalogue/search remain in backlog.
2. Active Dev/prototype integration is future work, not implemented in this checkpoint. No hard link or cross-device live editor synchronization exists. The user will decide the design later; likely eventual merge for final use. Active Dev editor changes currently persist privately in that browser; the prototype uses pinned source snapshots. Preserve the Active Dev working copy, including its modified SAR_10_Pax.png.

Remaining capability work from the reference pack: broader matched-state source comparisons; editor/tail propagation and maintenance/custom accounting exceptions; acceptance/per-tail recovery; equipment eligibility/footprints; output identities/MCDU/briefing/clearance/PDF; certification/invalidation; offline/update/fallback/recovery. Policy decisions on fit-only Role, negative adjustments, cargo-arm bounds and renewed acceptance remain open. Unchanged Start continuation retention does not settle all renewed-acceptance cases.

## Device testing

Use the hosted GitHub Pages prototype after its deployment completes, not the abandoned Desktop/511 App/cabin-mobile-review trial. Test Start/continue with manual fuel and loading, clear confirmation/cancel, image-opening defaults, CG/Envelope/2D switches, boundary callouts, rack removal/reinstall, equipment and aft-view touch access, and portrait/landscape rotation. Report OS/browser and orientation with any issue.

## iPhone device-feedback refinement

Phone ribbon now defaults to Operating weight/CG, Fuel and AUW/CG; More expands Basic, bay/cargo values and Planning/Fuel/Start tools, and Less collapses it. Warnings remain present. The phone sizing panel is hidden by explicit user request; existing pinch zoom remains. iPad retains its full ribbon and sizing controls. Phone detection uses coarse-pointer compact-width/short-landscape media conditions, not an iOS user-agent check.

Live ribbon remains fixed on mobile; page padding reserves its height. Bay 5.5 reads B5.5 and all bay sections have demarcations, including bays without tanks; tank labels/quantities exist only where tanks actually exist. Station positions and fuel calculations are unchanged. Short landscape pages may still need scrolling to view all image/fuel content above the ribbon.

Verification: phone-ribbon-check passes desktop, phone portrait/landscape and iPad mini portrait/landscape, including expansion/collapse, unchanged loading, hidden phone sizing panel, tablet controls retained and dispatched two-touch pinch gesture zoom. Fuel/planning model, fuel landscape menus and Sea Tray regressions pass. Actual Safari/device feedback remains the next acceptance step.

## Latest device-test refinement

The phone landscape ribbon is approximately 48 CSS pixels high in the emulated viewport (safe-area insets can add device-dependent space). Labels and weights share a line; CG is beneath. Role/Layers/View, a fitted whole-aircraft image and a full-width proportional bay/fuel strip fit above it. More retains the additional values/tools. Portrait text remains stacked to avoid collisions. Source calculations and bay dimensions are unchanged.

Every workspace entry now scrolls Role/Layers/View to the top after layout settles. The header and introduction remain reachable by scrolling upward. iPad spacing was preserved; no tablet re-sizing controller was retained. The user's supplied iPad landscape photo is the accepted visual baseline: controls at top, large centered image, complete fuel strip above full ribbon, edge sizing controls, collapsed summary. Future phone adjustments must remain separate.

Final checks: phone-ribbon-check passed all five viewports, with explicit phone-landscape fit/ribbon-height assertions. session-navigation-check passed desktop, both iPad mini orientations and phone portrait using More for phone tools. Sea Tray and fuel-landscape checks also passed during this refinement. Real device testing remains necessary.

## Standard iPhone ribbon approved for testing

Default iPhone ribbon is one horizontal line: OpW/CG weight/arm, Fuel, AUW/CG weight/arm plus uppercase band, and More. It uses current computed values, with no changes to the calculations. More restores the full values in normal source order: six columns in phone landscape, three columns/two rows in portrait, plus Planning/Fuel/Start tools. Less returns to the compact line. Extra inline text is hidden in the expanded, iPad and desktop layouts. iPad/desktop appearance remains unchanged.

Phone fitting now uses measured viewport/control/ribbon dimensions converted to pixel values; the prior multiplied CSS calculation was removed from the phone sizing rule. Expanded-ribbon overlap assertions were added, including 874x402 alongside 844x390 and portrait; six viewport checks passed. Planning and fuel model regressions passed. Screenshots were inspected in compact and expanded phone states. This is Chromium browser evidence; actual iPhone Safari testing remains necessary and is not represented as passed.

## Stable iPhone image size during scrolling

Removed fitting based on visible browser height. Phone aircraft sizing now follows content width, so Safari toolbar-height changes do not shrink/grow the aircraft. Portrait image height is also width-based rather than svh-based. Scrolling remains available; the page cannot force Safari's toolbar to retract on taps. Pinch zoom remains intentional. The default phone ribbon now hugs its text/More button with minimal padding instead of covering the whole screen width. More retains the responsive full values/tools layout. iPad/desktop rules remain unchanged.

Phone-ribbon regression now changes viewport height at constant width and scrolls the page, checking that sheet width/height, photo height and zoom stay unchanged; pinch zoom is checked separately. Passed desktop, phone portrait, two landscape phone sizes, and both iPad mini orientations. This is emulation, not physical Safari confirmation. Wider image and normal document scrolling take priority over forcing every control and image into a browser-height-dependent box.

## Input clearance above mobile keyboards

Shared keyboard handling now covers page inputs as well as floating editors/dialogs on coarse-pointer phone/tablet devices. On a reduced visible viewport, page fields are scrolled to just above the keyboard; temporary bottom scroll space allows this even on short Start pages and is removed when editing ends. Numeric whole-value selection and subsequent caret editing remain intact. No aircraft calculations or image layout changed.

Entry keyboard checks pass Basic Weight, Basic CG and Fuel at 390x844, 844x390, 744x1133 and 1133x744; temporary scroll-space cleanup is checked. Fuel landscape, compact load, anchored menu entry and phone ribbon/session/CG regressions passed. Actual iPhone/iPad keyboard behavior remains for device verification. User reported the preceding iPhone refresh is good.


## Keyboard alignment withdrawn after real iPhone regression

The user reported unpredictable vertical jitter when selecting inputs on build 905a50b, sometimes stopping after switching to Basic CG and then returning. Browser-emulation passes did not establish Safari stability. The automatic page-input positioning and temporary keyboard spacer have therefore been removed completely; keyboard-menus.js is restored byte-for-byte from pre-change commit 8cbff6d. Existing floating-editor visibility handling and numeric selection behavior remain. The requested exact page-field alignment above the keypad is deferred until a real Safari workflow can be verified. No attempted one-shot alignment remains in the deployed correction.

The entry keyboard check now verifies that repeated visual-viewport resize/scroll events do not invoke app-driven page scrolling and that input values remain intact, rather than claiming above-keypad placement. Phone/iPad layout remains separate and unchanged.

## Detail-image / selectable-zone alignment correction

User reported resized detail images and misaligned cabinet zones across devices, then confirmed desktop fixed during local investigation. The cabin-only aspect-ratio/position rule had been scoped to all #planSheet elements, including detail images. Both general cabin sizing and phone cabin sizing are now restricted to .photo-wrap.plan-view, restoring the detail image and overlay to the same full viewport coordinate plane. Saved compartment polygons, image files, calibration and W&B data were not edited.

New detail-zone-alignment-check verifies matching image-plane/viewport bounds for Cabinet, Forward, Ramp, Port Aft and Starboard Aft detail views, then taps interior points in all nine cabinet polygons and checks the selected location at desktop, iPad mini portrait/landscape and iPhone portrait/landscape sizes. All five sizes passed. Detail-image-policy and phone-ribbon regressions passed. Cabinet overlay screenshot was visually inspected. Actual device confirmation remains necessary; local correction is not yet committed/pushed.

## Quantity top-ups / reinstall search

User reproduced Cabinet → Zone G → Edit contents → remove one Penetration Kit, then could not find pen to reinstall one. The Available list excluded any item still present at the selected location, so a partial removal hid the entire item from search. The shared available-catalogue path now retains ordinary installed items for all locations/groups and search/category modes; existing local items default to one unit to add. The item-details Add more section is also available when units already exist in the current location, with Add here for an explicit location or existing destination selection elsewhere. Existing installed/allocation quantity controls and multi-select behavior remain.

The same shared UI is used by cabinet and shelf contents routes. Dedicated basket/litter/raft and structural fitting controls remain guarded. Install standard contents retains its prior missing-item semantics. Catalogue masses/arms, maximum quantities, eligibility/destination checks, load accounting and calculations were not changed.

The new equipment-reinstall-check verifies removal 2→1, search pen, reinstall exactly one, return to the original AUW, then item-details Add more of one in the same location. It passed desktop, iPad mini portrait/landscape and iPhone portrait/landscape. The expected single-kit change is 14.35 kg from the existing catalogue. The compact-contents check now expects installed items to remain listed as available for top-up. This is local work, not committed/pushed.

## Simplified Units stowed editor

Per user instruction, the shared installed-contents editor keeps one Units stowed control, Remove all of this item, and expandable Move units. The separate Units to remove/move per-selected-row spinner is removed. Selecting an item opens its stowed-quantity controls; Apply/Cancel are hidden until a draft changes the quantity. The batch action is labelled Remove selected items, and continues to act on all units of the selected rows; partial quantity changes use Units stowed and partial moves use expandable Move units. This shared code applies across cabinet/shelf contents and item-allocation views. No aircraft state changes occur until Apply, removal or movement is confirmed through its existing action.

NVG regression covers Units stowed 4→3→4 with exact source weight restoration and other-location allocations unchanged; it also confirms batch removal clears selected-location units while retaining other-location NVGs. Passed desktop, iPad portrait/landscape and iPhone portrait/landscape. Reinstall, compact contents and zero-quantity regressions passed. Local only; this and the detail-zone correction remain uncommitted/unpublished.

## Quantity review follow-up

User agreed to removing duplicate Add more for an item already allocated to the current explicit location. Units stowed is now the only quantity-edit path there; Install/Add more remains for missing items or where a destination is needed.

Install standard contents now computes each location's shortage against its existing catalogue/default allocations, adds only positive deficits and leaves excess quantities untouched. Selecting it opens an inline helper listing additions, explaining that it adds equipment rather than retrieving units from elsewhere, showing the shared preview, and requiring Install missing quantities or Cancel. Other locations remain unchanged. Existing destination/max-quantity guards are still used.

User independently reported successful moves of both Penetration Kits from Zone G to PTA cot and back, then one to Bay 6 and back. Record this flow as positive user feedback; device/OS/orientation were not specified. Remaining device review includes the simplified quantity controls and helper. No keyboard-alignment change is included; the jitter rollback remains intact.

Standard-topup checks pass helper-before-mutation, cancellation, partial shortage restoration, excess preservation and other-location retention at desktop, iPad mini portrait/landscape and iPhone portrait/landscape sizes. Reinstall and Units stowed regressions also run with the duplicate Add more removed. Local only, uncommitted/unpublished.

## Standard shelf plus equipment elsewhere warning

Clarified requirement: warn when a location has (or a top-up would restore) its standard complement while units of those same items remain at non-standard locations elsewhere. This supersedes the briefly trialled interpretation of a local-only over-standard count. The helper now identifies the standard count here and actual quantities/locations elsewhere before confirmation. A persistent warning remains on the location contents page after adding, explaining that the remote units remain aboard and counted. Standard allocations elsewhere (such as the normal second NVG shelf) do not trigger this warning.

Exact regression: move one of four Zone E NVGs to Bay 6 (leaving the standard one in the other lockbox unchanged), select Install standard contents, verify preview says four here plus one in Bay 6 without changing state, Cancel leaves state intact, confirm adds only the missing one while retaining the Bay 6 unit, and verify the warning persists. Passed desktop, iPad mini portrait/landscape and iPhone portrait/landscape. User reported 'it worked'; device/orientation were not specified. Local work remains uncommitted/unpublished.


## Cabinet / quantity device-test publication

User authorized commit/push for device testing. This checkpoint includes detail-image overlay alignment; single Units stowed editing with contextual Apply/Cancel; full-item batch selection; expandable partial moves; reinstall/search availability for items already present; missing-standard-quantity top-ups with helper/confirmation; and warnings for standard contents here plus the same equipment at non-standard locations elsewhere. Aircraft source definitions, calibration, weights/arms and calculation engines remain untouched. Stable keyboard rollback remains in place.

Current final checks cover detail-plane geometry and all nine cabinet taps; pen-kit partial removal/reinstall; NVG editing and batch removal; standard shortage top-ups, extras preservation, helper cancellation and non-standard-elsewhere warnings; compact contents, zero removal, detail image applicability, phone ribbon and planning/fuel regressions. This is emulated browser evidence; real phone/iPad testing remains necessary.

Sea Strip is future work and Mountain Strip is tentative, with removal behavior undefined. No strip controls or actions are implemented.
