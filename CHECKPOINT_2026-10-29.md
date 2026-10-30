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
